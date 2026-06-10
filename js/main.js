/* سِراج — main: state machine, screens, save, loop */

let G = null;
const Keys = new Set();
const TouchInput = { mx: 0, my: 0, atk: false, dodge: false, bukhoor: false };
const SAVE_KEY = 'siraj_save_v1';

/* ---------- mobile touch controls ---------- */
function wireTouch() {
  if (!('ontouchstart' in window) && navigator.maxTouchPoints === 0) return;
  document.body.classList.add('touch');

  const zone = document.getElementById('joy-zone');
  const base = document.getElementById('joy-base');
  const knob = document.getElementById('joy-knob');
  let joyId = null, ox = 0, oy = 0;
  const R = 44;

  function setKnob(dx, dy) {
    const len = Math.hypot(dx, dy);
    const cl = Math.min(len, R);
    const nx = len ? dx / len : 0, ny = len ? dy / len : 0;
    knob.style.transform = `translate(calc(-50% + ${nx * cl}px), calc(-50% + ${ny * cl}px))`;
    if (len > 12) { TouchInput.mx = nx; TouchInput.my = ny; }
    else { TouchInput.mx = 0; TouchInput.my = 0; }
  }
  zone.addEventListener('touchstart', e => {
    e.preventDefault();
    const t = e.changedTouches[0];
    if (joyId !== null) return;
    joyId = t.identifier;
    const zr = zone.getBoundingClientRect();
    ox = t.clientX; oy = t.clientY;
    base.style.left = (t.clientX - zr.left - 55) + 'px';
    base.style.top = (t.clientY - zr.top - 55) + 'px';
    base.style.bottom = 'auto';
    base.classList.add('on');
    setKnob(0, 0);
  }, { passive: false });
  zone.addEventListener('touchmove', e => {
    e.preventDefault();
    for (const t of e.changedTouches) {
      if (t.identifier === joyId) setKnob(t.clientX - ox, t.clientY - oy);
    }
  }, { passive: false });
  const joyEnd = e => {
    for (const t of e.changedTouches) {
      if (t.identifier === joyId) {
        joyId = null; base.classList.remove('on');
        TouchInput.mx = 0; TouchInput.my = 0;
      }
    }
  };
  zone.addEventListener('touchend', joyEnd);
  zone.addEventListener('touchcancel', joyEnd);

  const bindBtn = (id, key, flag) => {
    const el = document.getElementById(id);
    el.addEventListener('touchstart', e => { e.preventDefault(); Keys.add(key); TouchInput[flag] = true; }, { passive: false });
    const off = e => { e.preventDefault(); Keys.delete(key); };
    el.addEventListener('touchend', off, { passive: false });
    el.addEventListener('touchcancel', off, { passive: false });
  };
  bindBtn('tb-atk', 'j', 'atk');
  bindBtn('tb-dodge', 'k', 'dodge');
  bindBtn('tb-bukhoor', 'e', 'bukhoor');
}

function newGame() {
  G = {
    day: 1, gold: 60, rep: 50,
    debt: DEBT_TOTAL, won: false,
    inv: { dates: 6, bukhoor: 4, sadu: 2, coffee: 3 },
    stands: [null, null, null, null],
    upgrades: {},
    lastPrice: {},
    market: {},
    dayLog: [],
  };
}

function saveGame() {
  try { localStorage.setItem(SAVE_KEY, JSON.stringify(G)); } catch (e) { /* private mode */ }
}
function loadGame() {
  try {
    const s = localStorage.getItem(SAVE_KEY);
    if (s) { G = JSON.parse(s); return true; }
  } catch (e) { /* corrupted */ }
  return false;
}

/* ---------- screens ---------- */
function show(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

function toast(msg, ms = 2200) {
  const t = document.getElementById('toast');
  t.textContent = msg; t.classList.remove('hidden');
  clearTimeout(toast._t);
  toast._t = setTimeout(() => t.classList.add('hidden'), ms);
}

const AR_DIGITS = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
function arNum(n) { return String(n).replace(/\d/g, d => AR_DIGITS[+d]); }

function updateHUD() {
  document.getElementById('hud-gold').textContent = G.gold;
  document.getElementById('hud-day').textContent = 'اليوم ' + arNum(G.day);
  document.getElementById('hud-rep-fill').style.width = G.rep + '%';
}

/* ---------- intro ---------- */
let introPage = 0;
function startIntro() {
  introPage = 0;
  document.getElementById('intro-text').textContent = INTRO_PAGES[0];
  document.getElementById('btn-intro-next').textContent = '›› تابع';
  show('screen-intro');
}

/* ---------- evening ---------- */
function showEvening() {
  show('screen-evening');
  document.getElementById('ledger-day').textContent = '— اليوم ' + arNum(G.day);
  const lines = document.getElementById('ledger-lines');
  lines.innerHTML = '';
  if (!G.dayLog.length) {
    lines.innerHTML = '<div class="ledger-line"><span>ما باع الدكان شي اليوم…</span><span>—</span></div>';
  }
  for (const l of G.dayLog) {
    const d = document.createElement('div');
    d.className = 'ledger-line';
    d.innerHTML = `<span>${l.text}</span><span class="${l.amt >= 0 ? 'plus' : 'minus'}">${l.amt >= 0 ? '+' : ''}${l.amt}</span>`;
    lines.appendChild(d);
  }
  refreshEveningTotals();
  saveGame();
}

function refreshEveningTotals() {
  document.getElementById('ledger-gold').textContent = G.gold;
  document.getElementById('ledger-debt').textContent = G.debt;
  const slider = document.getElementById('debt-slider');
  slider.max = Math.min(G.gold, G.debt);
  slider.value = Math.min(+slider.value, +slider.max);
  document.getElementById('debt-amt').textContent = slider.value;
  document.getElementById('btn-pay-debt').disabled = +slider.max <= 0;
}

function payDebt() {
  const amt = parseInt(document.getElementById('debt-slider').value, 10) || 0;
  if (amt <= 0) return;
  G.gold -= amt; G.debt -= amt;
  SFX.coin();
  G.dayLog.push({ text: 'سداد لمجلس التجار', amt: -amt });
  document.getElementById('debt-slider').value = 0;
  refreshEveningTotals(); updateHUD(); saveGame();
  if (G.debt <= 0 && !G.won) {
    G.won = true; saveGame();
    setTimeout(() => { SFX.deal(); show('screen-win'); }, 600);
  } else {
    toast('سدّدت ' + amt + ' ريال — باقي ' + G.debt);
  }
}

/* ---------- upgrades ---------- */
function renderUpgrades() {
  const grid = document.getElementById('upgrade-grid');
  grid.innerHTML = '';
  for (const u of UPGRADES) {
    const owned = !!G.upgrades[u.id];
    const card = document.createElement('div');
    card.className = 'upgrade-card' + (owned ? ' owned' : '');
    card.innerHTML = `
      <div class="uicon">${u.icon}</div>
      <div class="uname">${u.nameAr}</div>
      <div class="udesc">${u.desc}</div>
      ${owned ? '<div class="owned-chip">✓ مركّب</div>' : ''}
      <button class="btn btn-small ${G.gold >= u.cost ? 'btn-accent' : ''}" ${G.gold < u.cost ? 'disabled' : ''}>${u.cost} ريال</button>`;
    if (!owned) {
      card.querySelector('button').onclick = () => {
        if (G.gold < u.cost) return;
        G.gold -= u.cost; G.upgrades[u.id] = true;
        G.dayLog.push({ text: 'تطوير: ' + u.nameAr, amt: -u.cost });
        if (u.id === 'stand5') G.stands.push(null);
        SFX.deal(); renderUpgrades(); refreshEveningTotals(); updateHUD(); saveGame();
      };
    }
    grid.appendChild(card);
  }
}

/* ---------- zones ---------- */
function renderZones() {
  const wrap = document.getElementById('zone-cards');
  wrap.innerHTML = '';
  for (const z of ZONES) {
    const card = document.createElement('div');
    card.className = 'zone-card' + (z.unlocked ? '' : ' locked');
    card.innerHTML = `<div class="zicon">${z.icon}</div><div class="zname">${z.nameAr}</div>
      <div class="zsub">${z.sub}</div>${z.unlocked ? '' : `<div class="zlock">🔒 ${z.lockMsg}</div>`}`;
    if (z.unlocked) card.onclick = () => { SFX.door(); startNight(z.id); };
    wrap.appendChild(card);
  }
}

/* ---------- night ---------- */
let rotateDismissed = false;
function maybeRotateHint() {
  const el = document.getElementById('rotate-hint');
  const dungeonActive = document.getElementById('screen-dungeon').classList.contains('active');
  const portrait = window.innerHeight > window.innerWidth;
  if (!rotateDismissed && dungeonActive && portrait && document.body.classList.contains('touch')) {
    el.classList.remove('hidden');
  } else {
    el.classList.add('hidden');
  }
}
window.addEventListener('resize', maybeRotateHint);
window.addEventListener('orientationchange', () => setTimeout(maybeRotateHint, 300));

function startNight(zoneId) {
  show('screen-dungeon');
  Dungeon.start();
  maybeRotateHint();
}

function endNight(result, player) {
  const titleEl = document.getElementById('night-result-title');
  const textEl = document.getElementById('night-result-text');
  const grid = document.getElementById('night-loot-grid');
  grid.innerHTML = '';

  let keepLoot = true;
  if (result === 'death') {
    keepLoot = false;
    SFX.death();
    titleEl.textContent = '💀 غلبك الليل';
    textEl.textContent = 'صحيت الفجر عند باب الدكان — أحد سحبك من الخرابات.\nراح كل اللي بالخُرج… بس السراج باقي، والدرس محفوظ.';
    G.gold += Math.floor(player.gold / 2);
  } else if (result === 'boss') {
    SFX.deal();
    titleEl.textContent = '🏺 سقط حارس الواجهة!';
    textEl.textContent = 'رجعت مع الفجر والخُرج مليان — ولوح الواجهة معك.\nهمس جدك في الدفتر: «قلت لك يا وليدي… الليل يجود على أهله».';
  } else {
    SFX.smoke();
    titleEl.textContent = '🌫 بخور العودة';
    textEl.textContent = 'ركبت الدخان ورجعت للدكان قبل أذان الفجر.\nاللي جبته الليلة يدخل المخزن — جهّزه للبيع.';
  }

  if (keepLoot) {
    G.gold += player.gold;
    for (const id of player.satchel) {
      G.inv[id] = (G.inv[id] || 0) + 1;
      const slot = document.createElement('div');
      slot.className = 'inv-slot';
      const c = document.createElement('canvas'); c.width = 36; c.height = 36;
      const x = c.getContext('2d'); x.imageSmoothingEnabled = false;
      x.drawImage(SPR[ITEMS[id].icon], 0, 0, 36, 36);
      slot.appendChild(c);
      slot.title = ITEMS[id].nameAr;
      grid.appendChild(slot);
    }
    if (!player.satchel.length) grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;color:#7a6034">رجعت بخُرج فاضي…</div>';
  }

  show('screen-night-result');
  saveGame();
}

function nextMorning() {
  G.day++;
  updateHUD();
  Shop.startDay();
  show('screen-shop');
  saveGame();
}

/* ---------- title lantern ---------- */
function drawTitleLantern() {
  const cv = document.getElementById('lantern-canvas');
  const c = cv.getContext('2d');
  c.imageSmoothingEnabled = false;
  const s = 8;
  c.clearRect(0, 0, cv.width, cv.height);
  const px = (x, y, w, h, col) => { c.fillStyle = col; c.fillRect(x * s, y * s, w * s, h * s); };
  px(5, 0, 2, 1, '#1d1410');       // hook
  px(4, 1, 4, 1, '#caa14a');       // crown
  px(3, 2, 6, 1, '#1d1410');
  px(3, 3, 1, 7, '#1d1410'); px(8, 3, 1, 7, '#1d1410');  // frame
  px(4, 3, 4, 7, '#f4b942');       // glass
  px(5, 5, 2, 3, '#fff3c4');       // flame core
  px(3, 10, 6, 1, '#1d1410');
  px(4, 11, 4, 1, '#caa14a');      // base
  px(5, 12, 2, 2, '#1d1410');
}

/* ---------- main loop ---------- */
let lastT = 0;
function loop(t) {
  const dt = Math.min(0.05, (t - lastT) / 1000 || 0.016);
  lastT = t;
  const shopActive = document.getElementById('screen-shop').classList.contains('active');
  const dgActive = document.getElementById('screen-dungeon').classList.contains('active');
  if (shopActive) {
    if (!document.getElementById('modal-haggle').classList.contains('hidden') ||
        !document.getElementById('modal-stock').classList.contains('hidden')) {
      // paused while modal open — still draw
      Shop.draw();
    } else {
      Shop.update(dt); Shop.draw();
    }
  } else if (dgActive) {
    Dungeon.update(dt); Dungeon.draw();
  }
  requestAnimationFrame(loop);
}

/* ---------- boot ---------- */
window.addEventListener('keydown', e => {
  Keys.add(e.key.toLowerCase());
  if ([' ', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(e.key.toLowerCase())) e.preventDefault();
});
window.addEventListener('keyup', e => Keys.delete(e.key.toLowerCase()));
window.addEventListener('blur', () => Keys.clear());

window.addEventListener('DOMContentLoaded', () => {
  buildSprites();
  drawTitleLantern();
  Shop.init();
  Dungeon.init();
  wireShopUI();
  wireTouch();

  if (localStorage.getItem(SAVE_KEY)) document.getElementById('btn-continue').classList.remove('hidden');

  document.getElementById('btn-new-game').onclick = () => {
    SFX.click(); newGame(); startIntro();
  };
  document.getElementById('btn-continue').onclick = () => {
    SFX.click();
    if (loadGame()) { updateHUD(); Shop.startDay(); show('screen-shop'); }
    else { newGame(); startIntro(); }
  };
  document.getElementById('btn-intro-next').onclick = () => {
    SFX.click();
    introPage++;
    if (introPage >= INTRO_PAGES.length) {
      updateHUD(); Shop.startDay(); show('screen-shop'); saveGame();
      return;
    }
    document.getElementById('intro-text').textContent = INTRO_PAGES[introPage];
    if (introPage === INTRO_PAGES.length - 1) document.getElementById('btn-intro-next').textContent = '☀ افتح الدكان';
  };

  document.getElementById('rotate-hint').addEventListener('click', () => {
    rotateDismissed = true; maybeRotateHint();
  });
  document.getElementById('btn-pay-debt').onclick = payDebt;
  document.getElementById('debt-slider').oninput = () =>
    document.getElementById('debt-amt').textContent = document.getElementById('debt-slider').value;

  document.getElementById('btn-upgrades').onclick = () => {
    SFX.click(); renderUpgrades();
    document.getElementById('modal-upgrades').classList.remove('hidden');
  };
  document.getElementById('btn-dive').onclick = () => { SFX.click(); renderZones(); show('screen-zones'); };
  document.getElementById('btn-zones-back').onclick = () => { SFX.click(); showEvening(); };
  document.getElementById('btn-sleep').onclick = () => { SFX.click(); nextMorning(); };
  document.getElementById('btn-night-continue').onclick = () => { SFX.click(); nextMorning(); };
  document.getElementById('btn-win-continue').onclick = () => { SFX.click(); showEvening(); };

  requestAnimationFrame(loop);
});
