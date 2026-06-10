/* سِراج — day phase: the shop (الدكان) */

const Shop = {
  cv: null, ctx: null,
  state: 'setup',          // setup | open | closing
  customers: [], floaties: [], schedule: [],
  time: 0, selStand: -1, selItem: null,
  haggleCust: null,

  init() {
    this.cv = document.getElementById('shop-canvas');
    this.ctx = this.cv.getContext('2d');
    this.cv.addEventListener('click', e => this.onClick(e));
  },

  standPositions() {
    const p = [
      { x: 235, y: 240 }, { x: 480, y: 240 },
      { x: 235, y: 360 }, { x: 480, y: 360 },
    ];
    if (G.upgrades.stand5) p.push({ x: 615, y: 300 });
    return p;
  },

  /* ---------- day start ---------- */
  startDay() {
    this.state = 'setup';
    this.customers = []; this.floaties = []; this.schedule = [];
    this.time = 0;
    G.dayLog = [];
    // market drift
    G.market = {};
    for (const id in ITEMS) G.market[id] = 0.92 + Math.random() * 0.22;
    document.getElementById('btn-open-shop').classList.remove('hidden');
    document.getElementById('btn-end-day').classList.add('hidden');
    document.getElementById('shop-phase-chip').textContent = 'تجهيز الدكان — الصباح';
    document.getElementById('shop-hint').innerHTML = 'اضغط على طاولة العرض لرصّ البضاعة وتحديد السوم';
    updateHUD();
  },

  fairOf(id) { return Math.round(ITEMS[id].fair * (G.market[id] || 1)); },

  openShop() {
    if (!G.stands.some(s => s && s.item)) { toast('رصّ شي على الطاولات أول!'); return; }
    this.state = 'open';
    SFX.click();
    document.getElementById('btn-open-shop').classList.add('hidden');
    document.getElementById('btn-end-day').classList.remove('hidden');
    document.getElementById('shop-phase-chip').textContent = 'الدكان مفتوح 🔔';
    document.getElementById('shop-hint').innerHTML = 'راقب فقاعات الزباين — <b>؟</b> تعني فرصة مساومة: اضغط على الزبون!';

    // build schedule
    const n = Math.min(9, 5 + Math.floor(G.rep / 25) + (G.day > 2 ? 1 : 0));
    const pool = ['um', 'um', 'kid', 'kid', 'traveler', 'elder', 'elder', 'collector', 'collector', 'um', 'traveler'];
    let t = 1.5;
    for (let i = 0; i < n; i++) {
      this.schedule.push({ at: t, type: pool[Math.floor(Math.random() * pool.length)] });
      t += 4.5 + Math.random() * 3.5;
    }
    // night customer if rare goods on display
    if (G.stands.some(s => s && s.item && ITEMS[s.item].tier >= 3) && Math.random() < 0.5) {
      this.schedule.push({ at: t + 2, type: 'night' });
    }
  },

  endDay() {
    this.state = 'closing';
    // remaining stand stock returns to storage
    for (const s of G.stands) {
      if (s && s.item) { G.inv[s.item] = (G.inv[s.item] || 0) + s.count; }
    }
    G.stands = G.stands.map(() => null);
    showEvening();
  },

  /* ---------- customers ---------- */
  spawn(type) {
    const def = CUSTOMERS[type];
    const stands = this.standPositions();
    // pick a stand
    const stocked = [];
    G.stands.forEach((s, i) => { if (s && s.item && i < stands.length) stocked.push(i); });
    if (!stocked.length) return;
    let pick = stocked.filter(i => def.prefers(ITEMS[G.stands[i].item]));
    if (def.minTier) pick = pick.filter(i => ITEMS[G.stands[i].item].tier >= def.minTier);
    const browse = pick.length ? pick : stocked;
    const standIdx = browse[Math.floor(Math.random() * browse.length)];
    this.customers.push({
      type, def, standIdx,
      x: 416, y: 540, state: 'toStand', bubble: null, waitT: 0,
      coffeeUsed: false, flip: Math.random() < .5,
      noFit: !pick.length && !!def.minTier,
    });
  },

  decide(c) {
    const stand = G.stands[c.standIdx];
    if (!stand || !stand.item) { this.bubble(c, 'think'); c.state = 'leaveCalm'; return; }
    if (c.noFit) { this.bubble(c, 'think'); this.say(c, '«ما عندك اللي أدور عليه…»'); c.state = 'leaveCalm'; return; }
    const item = ITEMS[stand.item];
    const fair = this.fairOf(stand.item);
    const price = stand.price;
    const d = c.def;
    const effCeil = d.ceiling + (1 - d.knows) * 0.25;
    const r = price / fair;

    if (d.budgetMax && price > d.budgetMax) {
      this.bubble(c, 'think'); this.say(c, d.lines.angry[0]); c.state = 'leaveCalm'; return;
    }
    if (r <= 0.82) {           // bargain — instant grab
      this.bubble(c, 'coin');
      c.state = 'buying'; c.waitT = 0.9; c.bonusRep = 1;
      return;
    }
    if (r <= effCeil) {        // fair — happy buy
      this.bubble(c, 'happy');
      c.state = 'buying'; c.waitT = 1.0; c.bonusRep = (d.repWeight ? 2 : 1);
      return;
    }
    if (d.haggler > 0 && r <= effCeil + 0.45) {  // haggle window
      this.bubble(c, 'think');
      c.state = 'haggleWait'; c.waitT = 7;
      c.fair = fair; c.ceilVal = Math.round(fair * effCeil * (1 + Math.random() * 0.08));
      c.bid = Math.max(1, Math.round(fair * (0.72 + Math.random() * 0.12)));
      c.patience = 3 + (G.upgrades.burner ? 1 : 0);
      return;
    }
    // too expensive
    this.bubble(c, 'angry'); SFX.angry();
    this.say(c, d.lines.angry[Math.floor(Math.random() * d.lines.angry.length)]);
    G.rep = Math.max(0, G.rep - (d.repWeight ? 6 : 2));
    if (d.repWeight) toast('الختيار زعلان — سمعتك انجرحت بالديرة');
    c.state = 'leaveAngry';
    updateHUD();
  },

  completeSale(c, price, viaHaggle = false, perfect = false) {
    const stand = G.stands[c.standIdx];
    if (!stand || !stand.item) return;
    const item = ITEMS[stand.item];
    G.gold += price;
    G.dayLog.push({ text: `${item.nameAr} ← ${c.def.nameAr}`, amt: price });
    stand.count--;
    if (stand.count <= 0) G.stands[c.standIdx] = null;
    const sp = this.standPositions()[c.standIdx];
    this.floaties.push(new Floaty(sp.x, sp.y - 60, `+${price}`, '#f4b942'));
    if (c.bonusRep) G.rep = Math.min(100, G.rep + c.bonusRep);
    if (perfect) { G.rep = Math.min(100, G.rep + 3); this.floaties.push(new Floaty(sp.x, sp.y - 84, 'قراءة ممتازة!', '#3ec9a2')); }
    SFX.buy();
    if (viaHaggle) SFX.deal();
    c.state = 'leaveHappy';
    this.bubble(c, 'love');
    updateHUD();
  },

  bubble(c, mood) { c.bubble = { mood, t: 1.6 }; },
  say(c, text) {
    const sp = this.standPositions()[c.standIdx] || { x: c.x, y: c.y };
    this.floaties.push(new Floaty(sp.x, sp.y - 92, text, '#f6efdc'));
  },

  /* ---------- haggle modal ---------- */
  openHaggle(c) {
    this.haggleCust = c;
    c.state = 'haggling';
    const m = document.getElementById('modal-haggle');
    m.classList.remove('hidden');
    const stand = G.stands[c.standIdx];
    const item = ITEMS[stand.item];
    document.getElementById('haggle-name').textContent = c.def.nameAr;
    document.getElementById('haggle-tell').textContent = c.def.tell;
    document.getElementById('haggle-item-name').textContent = item.nameAr;
    document.getElementById('haggle-ask').textContent = stand.price;
    drawIconTo('haggle-item-icon', item.icon);
    // portrait = head of sprite, scaled
    const pc = document.getElementById('haggle-portrait');
    const px = pc.getContext('2d');
    px.imageSmoothingEnabled = false;
    px.clearRect(0, 0, 96, 96);
    px.drawImage(SPR[c.def.spr], 0, 0, 48, 30, 4, 10, 88, 56);
    this.updateHaggleUI(c.def.lines.open[Math.floor(Math.random() * c.def.lines.open.length)]);
    const slider = document.getElementById('haggle-slider');
    slider.min = c.bid; slider.max = stand.price;
    slider.value = Math.round((c.bid + stand.price) / 2);
    document.getElementById('haggle-counter').textContent = slider.value;
    document.getElementById('btn-haggle-coffee').disabled = !G.upgrades.majlis || c.coffeeUsed || G.gold < 5;
  },

  updateHaggleUI(speech) {
    const c = this.haggleCust;
    if (speech) document.getElementById('haggle-speech').textContent = speech;
    document.getElementById('haggle-bid').textContent = c.bid;
    const pat = document.getElementById('haggle-patience');
    pat.innerHTML = '';
    const maxPat = 3 + (G.upgrades.burner ? 1 : 0);
    for (let i = 0; i < maxPat; i++) {
      const d = document.createElement('div');
      d.className = 'p' + (i < c.patience ? '' : ' off');
      pat.appendChild(d);
    }
  },

  haggleOffer() {
    const c = this.haggleCust; if (!c) return;
    const offer = parseInt(document.getElementById('haggle-slider').value, 10);
    if (offer <= c.bid) { this.haggleAccept(); return; }
    if (offer <= c.ceilVal) {
      const perfect = offer >= c.ceilVal * 0.95;
      this.closeHaggle();
      this.completeSale(c, offer, true, perfect);
      return;
    }
    c.patience--;
    SFX.fail();
    if (c.patience <= 0) {
      this.closeHaggle();
      this.bubble(c, 'angry'); SFX.angry();
      G.rep = Math.max(0, G.rep - 1);
      c.state = 'leaveAngry';
      updateHUD();
      return;
    }
    // bid creeps up toward ceiling
    c.bid = Math.min(c.ceilVal, Math.round(c.bid + (c.ceilVal - c.bid) * (0.35 + Math.random() * 0.2)));
    const grumbles = ['«لا يا طويل العمر… نزّل شوي»', '«تراك مغلّيها… هذا عرضي»', '«آخر كلام عندي كذا»'];
    this.updateHaggleUI(grumbles[Math.floor(Math.random() * grumbles.length)]);
  },

  haggleAccept() {
    const c = this.haggleCust; if (!c) return;
    this.closeHaggle();
    this.completeSale(c, c.bid, true, false);
  },

  haggleCoffee() {
    const c = this.haggleCust; if (!c || c.coffeeUsed || !G.upgrades.majlis || G.gold < 5) return;
    c.coffeeUsed = true; G.gold -= 5;
    c.patience = Math.min(4 + (G.upgrades.burner ? 1 : 0), c.patience + 1);
    c.ceilVal = Math.round(c.ceilVal * 1.06);
    SFX.coffee();
    G.dayLog.push({ text: 'قهوة وتمر للضيف', amt: -5 });
    this.updateHaggleUI('«…الله يحيّيك، قهوتكم طيبة» ☕');
    document.getElementById('btn-haggle-coffee').disabled = true;
    updateHUD();
  },

  closeHaggle() {
    document.getElementById('modal-haggle').classList.add('hidden');
    this.haggleCust = null;
  },

  /* ---------- input ---------- */
  onClick(e) {
    const r = this.cv.getBoundingClientRect();
    const x = (e.clientX - r.left) * (this.cv.width / r.width);
    const y = (e.clientY - r.top) * (this.cv.height / r.height);

    // customer waiting to haggle?
    for (const c of this.customers) {
      if (c.state === 'haggleWait' && Math.abs(x - c.x) < 36 && Math.abs(y - (c.y - 36)) < 44) {
        SFX.click(); this.openHaggle(c); return;
      }
    }
    // stand?
    const stands = this.standPositions();
    for (let i = 0; i < stands.length; i++) {
      const s = stands[i];
      if (Math.abs(x - s.x) < 52 && Math.abs(y - s.y) < 36) {
        SFX.click(); openStockModal(i); return;
      }
    }
  },

  /* ---------- update / draw ---------- */
  update(dt) {
    this.time += dt;
    // spawn from schedule
    if (this.state === 'open') {
      for (const s of this.schedule) {
        if (!s.done && this.time >= s.at) { s.done = true; this.spawn(s.type); }
      }
      // all done?
      if (this.schedule.every(s => s.done) && this.customers.length === 0) {
        this.endDay(); return;
      }
    }

    for (const c of this.customers) {
      const sp = this.standPositions()[c.standIdx] || { x: 416, y: 300 };
      const target = { x: sp.x, y: sp.y + 52 };
      if (c.state === 'toStand') {
        const arrived = this.walkTo(c, target, dt);
        if (arrived) { c.state = 'deciding'; c.waitT = 0.8; }
      } else if (c.state === 'deciding') {
        c.waitT -= dt;
        if (c.waitT <= 0) this.decide(c);
      } else if (c.state === 'buying') {
        c.waitT -= dt;
        if (c.waitT <= 0) {
          const st = G.stands[c.standIdx];
          if (st && st.item) this.completeSale(c, st.price, false, false);
          else { this.bubble(c, 'think'); c.state = 'leaveCalm'; }
        }
      } else if (c.state === 'haggleWait') {
        c.waitT -= dt;
        if (c.waitT <= 0) {
          if (Math.random() < 0.6) { this.bubble(c, 'think'); c.state = 'leaveCalm'; }
          else c.waitT = 4;
        }
      } else if (c.state === 'leaveHappy' || c.state === 'leaveAngry' || c.state === 'leaveCalm') {
        const out = this.walkTo(c, { x: 416, y: 560 }, dt, 90);
        if (out) c.state = 'gone';
      }
      if (c.bubble) { c.bubble.t -= dt; if (c.bubble.t <= 0) c.bubble = null; }
    }
    this.customers = this.customers.filter(c => c.state !== 'gone');
    this.floaties = this.floaties.filter(f => f.update(dt));
  },

  walkTo(c, t, dt, speed = 75) {
    const dx = t.x - c.x, dy = t.y - c.y;
    const d = Math.hypot(dx, dy);
    if (d < 4) return true;
    c.x += dx / d * speed * dt;
    c.y += dy / d * speed * dt;
    c.flip = dx < 0;
    return false;
  },

  draw() {
    const ctx = this.ctx, W = this.cv.width, H = this.cv.height;
    // floor — wood planks
    ctx.fillStyle = '#9a6a3c'; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = '#8a5c32';
    for (let y = 0; y < H; y += 32) {
      ctx.fillRect(0, y, W, 2);
      for (let x = (y / 32 % 2) * 64; x < W; x += 128) ctx.fillRect(x, y, 2, 32);
    }
    // mud-brick wall (top)
    ctx.fillStyle = '#c9a36a'; ctx.fillRect(0, 0, W, 92);
    ctx.fillStyle = '#b8925a';
    for (let y = 0; y < 92; y += 16) for (let x = (y / 16 % 2) * 24; x < W; x += 48) ctx.fillRect(x, y, 22, 14);
    // najdi triangle crenellation
    ctx.fillStyle = '#a37c4a';
    for (let x = 8; x < W; x += 42) {
      ctx.beginPath(); ctx.moveTo(x, 14); ctx.lineTo(x + 12, 0); ctx.lineTo(x + 24, 14); ctx.closePath(); ctx.fill();
    }
    // wall niches with wares
    for (let i = 0; i < 5; i++) {
      const nx = 90 + i * 150;
      ctx.fillStyle = '#7a5a34'; ctx.fillRect(nx, 28, 60, 48);
      ctx.fillStyle = '#5e4226'; ctx.fillRect(nx + 4, 32, 52, 40);
      const icons = ['icon_oud', 'icon_bukhoor', 'icon_sadu', 'icon_dates', 'icon_coffee'];
      const ic = SPR[icons[i]];
      ctx.drawImage(ic, nx + 12, 36, 36, 36);
    }
    // sadu carpet
    this.drawCarpet(ctx, 196, 200, 440, 230);

    // counter (top center)
    ctx.fillStyle = '#6b4226'; ctx.fillRect(316, 118, 200, 46);
    ctx.fillStyle = '#4a2c18'; ctx.fillRect(316, 158, 200, 8);
    ctx.fillStyle = '#8a5a34'; ctx.fillRect(322, 124, 188, 12);
    // cash box
    ctx.fillStyle = '#3a2414'; ctx.fillRect(470, 104, 34, 20);
    ctx.fillStyle = '#f4b942'; ctx.fillRect(483, 110, 8, 6);

    // door (bottom)
    ctx.fillStyle = '#4a2c18'; ctx.fillRect(376, H - 16, 80, 16);
    ctx.fillStyle = '#f0d8a0'; ctx.fillRect(384, H - 12, 64, 12);

    // stands
    const stands = this.standPositions();
    stands.forEach((s, i) => {
      this.drawStand(ctx, s.x, s.y, G.stands[i], i === this.selStand);
    });

    // player behind counter (idle bob)
    const bob = Math.sin(this.time * 2.2) * 2;
    drawShadow(ctx, 416, 116, 18);
    drawSpr(ctx, SPR.player, 416, 112 + bob);

    // customers
    const sorted = [...this.customers].sort((a, b) => a.y - b.y);
    for (const c of sorted) {
      drawShadow(ctx, c.x, c.y, 16);
      drawSpr(ctx, SPR[c.def.spr], c.x, c.y, { flip: c.flip });
      if (c.bubble) drawBubble(ctx, c.x, c.y - 92, c.bubble.mood);
      if (c.state === 'haggleWait') {
        // pulsing "haggle me" marker
        const pulse = 1 + Math.sin(this.time * 6) * 0.12;
        ctx.save();
        ctx.translate(c.x, c.y - 100); ctx.scale(pulse, pulse);
        ctx.fillStyle = '#2ea88a'; ctx.strokeStyle = '#0d3a2e'; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.arc(0, 0, 16, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#fff'; ctx.font = 'bold 20px Tajawal'; ctx.textAlign = 'center';
        ctx.fillText('؟', 0, 7);
        ctx.restore();
      }
    }

    for (const f of this.floaties) f.draw(ctx);

    // soft vignette
    const vg = ctx.createRadialGradient(W / 2, H / 2, H / 2.2, W / 2, H / 2, H);
    vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(20,10,4,.35)');
    ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H);
  },

  drawCarpet(ctx, x, y, w, h) {
    ctx.fillStyle = '#a83232'; ctx.fillRect(x, y, w, h);
    ctx.fillStyle = '#8a2626'; ctx.fillRect(x + 8, y + 8, w - 16, h - 16);
    ctx.fillStyle = '#d97b29';
    for (let i = x + 16; i < x + w - 24; i += 28) { ctx.fillRect(i, y + 14, 14, 6); ctx.fillRect(i, y + h - 20, 14, 6); }
    ctx.fillStyle = '#1d1410';
    for (let i = x + 24; i < x + w - 24; i += 56) {
      ctx.beginPath(); ctx.moveTo(i, y + h / 2); ctx.lineTo(i + 10, y + h / 2 - 10); ctx.lineTo(i + 20, y + h / 2); ctx.lineTo(i + 10, y + h / 2 + 10); ctx.closePath(); ctx.fill();
    }
  },

  drawStand(ctx, x, y, stand, sel) {
    // table
    ctx.fillStyle = '#4a2c18'; ctx.fillRect(x - 50, y - 26, 100, 56);
    ctx.fillStyle = '#6b4226'; ctx.fillRect(x - 46, y - 22, 92, 44);
    ctx.fillStyle = '#2ea88a'; ctx.fillRect(x - 42, y - 18, 84, 32); // cloth
    ctx.fillStyle = '#1d7a64'; ctx.fillRect(x - 42, y + 8, 84, 6);
    if (sel) { ctx.strokeStyle = '#f4b942'; ctx.lineWidth = 3; ctx.strokeRect(x - 52, y - 28, 104, 60); }
    if (stand && stand.item) {
      const ic = SPR[ITEMS[stand.item].icon];
      ctx.drawImage(ic, x - 20, y - 26, 40, 40);
      // count chip
      ctx.fillStyle = 'rgba(20,15,8,.85)';
      ctx.beginPath(); ctx.arc(x + 32, y - 14, 11, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#f6efdc'; ctx.font = 'bold 12px Tajawal'; ctx.textAlign = 'center';
      ctx.fillText(stand.count, x + 32, y - 10);
      // price tag
      ctx.fillStyle = '#fffdf2'; ctx.strokeStyle = '#1d1410'; ctx.lineWidth = 2;
      const tw = 52;
      ctx.fillRect(x - tw / 2, y + 18, tw, 20); ctx.strokeRect(x - tw / 2, y + 18, tw, 20);
      ctx.fillStyle = '#1d1410'; ctx.font = 'bold 13px Tajawal';
      ctx.fillText(stand.price + ' ر', x, y + 33);
      ctx.textAlign = 'start';
    } else {
      ctx.fillStyle = 'rgba(255,255,255,.25)'; ctx.font = 'bold 22px Tajawal'; ctx.textAlign = 'center';
      ctx.fillText('+', x, y + 2);
      ctx.textAlign = 'start';
    }
  },
};

/* ---------- stock modal (DOM) ---------- */
let stockStandIdx = -1, stockItemSel = null;

function openStockModal(idx) {
  stockStandIdx = idx; stockItemSel = null;
  const m = document.getElementById('modal-stock');
  m.classList.remove('hidden');
  const cur = document.getElementById('stock-current');
  const stand = G.stands[idx];
  if (stand && stand.item) {
    cur.classList.remove('hidden');
    document.getElementById('stock-cur-name').textContent = ITEMS[stand.item].nameAr + ' — ' + stand.price + ' ريال';
    document.getElementById('stock-cur-count').textContent = 'الكمية: ' + stand.count;
    drawIconTo('stock-cur-icon', ITEMS[stand.item].icon);
  } else cur.classList.add('hidden');
  document.getElementById('price-setter').classList.add('hidden');
  renderStockGrid();
}

function renderStockGrid() {
  const grid = document.getElementById('stock-grid');
  grid.innerHTML = '';
  const ids = Object.keys(G.inv).filter(id => G.inv[id] > 0);
  if (!ids.length) {
    grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;color:#7a6034;padding:14px">المخزن فاضي… دشّ الليل يجيب البضاعة 🌙</div>';
    return;
  }
  for (const id of ids) {
    const slot = document.createElement('div');
    slot.className = 'inv-slot' + (stockItemSel === id ? ' selected' : '');
    slot.title = ITEMS[id].nameAr;
    const c = document.createElement('canvas'); c.width = 40; c.height = 40;
    slot.appendChild(c);
    const ic = c.getContext('2d'); ic.imageSmoothingEnabled = false;
    ic.drawImage(SPR[ITEMS[id].icon], 0, 0, 40, 40);
    const cnt = document.createElement('span'); cnt.className = 'count'; cnt.textContent = G.inv[id];
    slot.appendChild(cnt);
    slot.onclick = () => { SFX.click(); selectStockItem(id); };
    grid.appendChild(slot);
  }
}

function selectStockItem(id) {
  stockItemSel = id;
  renderStockGrid();
  const ps = document.getElementById('price-setter');
  ps.classList.remove('hidden');
  const fair = Shop.fairOf(id);
  const slider = document.getElementById('price-slider');
  slider.min = 1; slider.max = Math.max(20, fair * 3);
  slider.value = G.lastPrice[id] || fair;
  document.getElementById('price-value').textContent = slider.value;
  document.getElementById('price-hint').textContent =
    `«${ITEMS[id].nameAr}» — جدك كان يقول: راقب الوجوه، السوق يعلّمك سعره`;
}

function drawIconTo(canvasId, iconKey) {
  const c = document.getElementById(canvasId);
  const x = c.getContext('2d');
  x.imageSmoothingEnabled = false;
  x.clearRect(0, 0, c.width, c.height);
  x.drawImage(SPR[iconKey], 0, 0, c.width, c.height);
}

function wireShopUI() {
  document.getElementById('btn-open-shop').onclick = () => Shop.openShop();
  document.getElementById('btn-end-day').onclick = () => { SFX.click(); Shop.endDay(); };

  const slider = document.getElementById('price-slider');
  slider.oninput = () => document.getElementById('price-value').textContent = slider.value;
  document.getElementById('price-minus').onclick = () => { slider.value = +slider.value - 1; slider.oninput(); SFX.click(); };
  document.getElementById('price-plus').onclick = () => { slider.value = +slider.value + 1; slider.oninput(); SFX.click(); };

  document.getElementById('btn-confirm-stock').onclick = () => {
    if (!stockItemSel || stockStandIdx < 0) return;
    const price = parseInt(slider.value, 10);
    // return current stand stock first
    const old = G.stands[stockStandIdx];
    if (old && old.item) G.inv[old.item] = (G.inv[old.item] || 0) + old.count;
    const count = G.inv[stockItemSel];
    delete G.inv[stockItemSel];
    G.stands[stockStandIdx] = { item: stockItemSel, count, price };
    G.lastPrice[stockItemSel] = price;
    SFX.coin();
    document.getElementById('modal-stock').classList.add('hidden');
    saveGame();
  };

  document.getElementById('btn-unstock').onclick = () => {
    const old = G.stands[stockStandIdx];
    if (old && old.item) { G.inv[old.item] = (G.inv[old.item] || 0) + old.count; G.stands[stockStandIdx] = null; }
    SFX.click();
    document.getElementById('modal-stock').classList.add('hidden');
  };

  // haggle
  const hs = document.getElementById('haggle-slider');
  hs.oninput = () => document.getElementById('haggle-counter').textContent = hs.value;
  document.getElementById('haggle-minus').onclick = () => { hs.value = +hs.value - 1; hs.oninput(); SFX.click(); };
  document.getElementById('haggle-plus').onclick = () => { hs.value = +hs.value + 1; hs.oninput(); SFX.click(); };
  document.getElementById('btn-haggle-offer').onclick = () => Shop.haggleOffer();
  document.getElementById('btn-haggle-accept').onclick = () => Shop.haggleAccept();
  document.getElementById('btn-haggle-coffee').onclick = () => Shop.haggleCoffee();

  document.querySelectorAll('.modal-close').forEach(b => {
    b.onclick = () => { document.getElementById(b.dataset.close).classList.add('hidden'); SFX.click(); };
  });
}
