/* سِراج — night phase: the dive (الدشّة) — zone 1: مقابر الأولين */

const TILE = 64, RW = 13, RH = 8;

const Dungeon = {
  cv: null, ctx: null,
  rooms: {}, cur: null,
  player: null, floaties: [],
  fade: 0, shake: 0, time: 0,
  over: false,

  init() {
    this.cv = document.getElementById('dungeon-canvas');
    this.ctx = this.cv.getContext('2d');
  },

  /* ---------- generation ---------- */
  start() {
    this.rooms = {}; this.floaties = []; this.over = false;
    this.time = 0; this.fade = 1;

    // random walk on 3x3 grid
    const path = [[1, 2]];
    const seen = new Set(['1,2']);
    let cx = 1, cy = 2;
    while (path.length < 5) {
      const dirs = [[0, -1], [1, 0], [-1, 0], [0, 1]].filter(([dx, dy]) => {
        const nx = cx + dx, ny = cy + dy;
        return nx >= 0 && nx < 3 && ny >= 0 && ny < 3 && !seen.has(nx + ',' + ny);
      });
      if (!dirs.length) break;
      const [dx, dy] = dirs[Math.floor(Math.random() * dirs.length)];
      cx += dx; cy += dy;
      seen.add(cx + ',' + cy);
      path.push([cx, cy]);
    }
    path.forEach(([gx, gy], i) => {
      this.rooms[gx + ',' + gy] = this.makeRoom(gx, gy, i === 0, i === path.length - 1);
    });
    // door links
    for (const key in this.rooms) {
      const r = this.rooms[key];
      r.doors = {
        n: !!this.rooms[r.gx + ',' + (r.gy - 1)],
        s: !!this.rooms[r.gx + ',' + (r.gy + 1)],
        e: !!this.rooms[(r.gx + 1) + ',' + r.gy],
        w: !!this.rooms[(r.gx - 1) + ',' + r.gy],
      };
    }
    this.cur = this.rooms[path[0][0] + ',' + path[0][1]];
    this.cur.seen = true;

    this.player = {
      x: this.cv.width / 2, y: this.cv.height - 120,
      vx: 0, vy: 0, fx: 0, fy: -1,
      hp: PLAYER_HP, satchel: [], gold: 0,
      invuln: 0, dodgeT: 0, dodgeCd: 0, atkT: 0, atkCd: 0,
      bukhoor: 1, flip: false,
    };
    this.updateSatchelUI(); this.updateMinimap();
    document.getElementById('boss-banner').classList.add('hidden');
    updateDungeonHUD();
  },

  makeRoom(gx, gy, isStart, isBoss) {
    const room = { gx, gy, isStart, isBoss, seen: false, enemies: [], pots: [], drops: [], pillars: [], portal: null };
    if (!isStart && !isBoss) {
      const n = 2 + Math.floor(Math.random() * 3);
      for (let i = 0; i < n; i++) {
        const types = ['wraith', 'wraith', 'beetle', 'falcon'];
        room.enemies.push(this.makeEnemy(types[Math.floor(Math.random() * types.length)],
          120 + Math.random() * (this.cvW() - 240), 120 + Math.random() * (this.cvH() - 240)));
      }
      const np = 2 + Math.floor(Math.random() * 3);
      for (let i = 0; i < np; i++) {
        room.pots.push({ x: 100 + Math.random() * (this.cvW() - 200), y: 110 + Math.random() * (this.cvH() - 220), broken: false });
      }
      if (Math.random() < 0.6) {
        room.pillars.push({ x: 200 + Math.random() * 400, y: 160 + Math.random() * 180 });
      }
      if (Math.random() < 0.4) room.chest = { x: this.cvW() / 2 + (Math.random() * 300 - 150), y: 150, open: false };
    }
    if (isBoss) {
      room.enemies.push(this.makeEnemy('guardian', this.cvW() / 2, 190));
    }
    return room;
  },

  cvW() { return 832; }, cvH() { return 512; },

  makeEnemy(type, x, y) {
    const defs = {
      wraith:   { hp: 50,  spd: 52,  dmg: 12, spr: 'wraith' },
      beetle:   { hp: 22,  spd: 95,  dmg: 8,  spr: 'beetle' },
      falcon:   { hp: 32,  spd: 70,  dmg: 10, spr: 'falconStone' },
      guardian: { hp: 340, spd: 60,  dmg: 20, spr: 'guardian', boss: true },
    };
    const d = defs[type];
    return { type, ...d, maxHp: d.hp, x, y, vx: 0, vy: 0, t: Math.random() * 6, state: 'idle', flash: 0, summoned: false };
  },

  /* ---------- helpers ---------- */
  bounds() { return { x0: TILE + 8, y0: TILE + 24, x1: this.cvW() - TILE - 8, y1: this.cvH() - TILE - 4 }; },

  toast(msg) {
    const t = document.getElementById('dungeon-toast');
    t.textContent = msg; t.classList.remove('hidden');
    clearTimeout(this._tt);
    this._tt = setTimeout(() => t.classList.add('hidden'), 1800);
  },

  satchelCap() { return SATCHEL_BASE + (G.upgrades.satchel ? 4 : 0); },

  addLoot(id) {
    const p = this.player;
    if (p.satchel.length >= this.satchelCap()) { this.toast('الخُرج ممتلئ! 🎒'); return false; }
    p.satchel.push(id);
    SFX.pickup();
    this.updateSatchelUI();
    return true;
  },

  rollLoot() {
    const total = LOOT_Z1.reduce((a, l) => a + l.w, 0);
    let r = Math.random() * total;
    for (const l of LOOT_Z1) { r -= l.w; if (r <= 0) return l.id; }
    return LOOT_Z1[0].id;
  },

  updateSatchelUI() {
    const el = document.getElementById('satchel');
    el.innerHTML = '';
    const cap = this.satchelCap();
    for (let i = 0; i < cap; i++) {
      const d = document.createElement('div');
      d.className = 'sslot' + (this.player.satchel[i] ? ' filled' : '');
      if (this.player.satchel[i]) {
        const c = document.createElement('canvas'); c.width = 30; c.height = 30;
        const x = c.getContext('2d'); x.imageSmoothingEnabled = false;
        x.drawImage(SPR[ITEMS[this.player.satchel[i]].icon], 0, 0, 30, 30);
        d.appendChild(c);
      }
      el.appendChild(d);
    }
  },

  updateMinimap() {
    const el = document.getElementById('minimap');
    el.innerHTML = '';
    for (let y = 0; y < 3; y++) for (let x = 0; x < 3; x++) {
      const d = document.createElement('div');
      const r = this.rooms[x + ',' + y];
      d.className = 'mroom' + (!r ? ' none' : (r.seen ? ' seen' : '')) +
        (r === this.cur ? ' here' : '') + (r && r.isBoss && r.seen ? ' boss' : '');
      el.appendChild(d);
    }
  },

  /* ---------- update ---------- */
  update(dt) {
    if (this.over) return;
    this.time += dt;
    if (this.fade > 0) this.fade = Math.max(0, this.fade - dt * 2);
    if (this.shake > 0) this.shake = Math.max(0, this.shake - dt * 30);

    const p = this.player, b = this.bounds();

    // ----- player movement -----
    const spd = p.dodgeT > 0 ? 360 : 170;
    let mx = 0, my = 0;
    if (Keys.has('arrowleft') || Keys.has('a')) mx -= 1;
    if (Keys.has('arrowright') || Keys.has('d')) mx += 1;
    if (Keys.has('arrowup') || Keys.has('w')) my -= 1;
    if (Keys.has('arrowdown') || Keys.has('s')) my += 1;
    if (!mx && !my && (TouchInput.mx || TouchInput.my)) { mx = TouchInput.mx; my = TouchInput.my; }
    if (p.dodgeT > 0) { mx = p.fx; my = p.fy; }
    if (mx || my) {
      const d = Math.hypot(mx, my);
      p.x += mx / d * spd * dt; p.y += my / d * spd * dt;
      if (p.dodgeT <= 0) { p.fx = mx / d; p.fy = my / d; }
      p.flip = mx < 0;
    }
    // pillar collision
    for (const pil of this.cur.pillars) {
      const dx = p.x - pil.x, dy = (p.y - 14) - pil.y;
      const dist = Math.hypot(dx, dy);
      if (dist < 38) { p.x = pil.x + dx / dist * 38; p.y = pil.y + dy / dist * 38 + 14; }
    }
    p.x = Math.max(b.x0, Math.min(b.x1, p.x));
    p.y = Math.max(b.y0 + 30, Math.min(b.y1, p.y));

    // timers
    p.invuln = Math.max(0, p.invuln - dt);
    p.dodgeT = Math.max(0, p.dodgeT - dt);
    p.dodgeCd = Math.max(0, p.dodgeCd - dt);
    p.atkT = Math.max(0, p.atkT - dt);
    p.atkCd = Math.max(0, p.atkCd - dt);

    // actions (keyboard or one-shot touch flags)
    if ((Keys.has('j') || Keys.has('z') || Keys.has(' ') || TouchInput.atk) && p.atkCd <= 0) {
      p.atkT = 0.16; p.atkCd = 0.38; SFX.hit();
      this.doAttack();
    }
    if ((Keys.has('k') || Keys.has('x') || Keys.has('shift') || TouchInput.dodge) && p.dodgeCd <= 0 && (p.fx || p.fy)) {
      p.dodgeT = 0.16; p.dodgeCd = 0.8; p.invuln = Math.max(p.invuln, 0.4); SFX.dodge();
    }
    const wantEscape = Keys.has('e') || TouchInput.bukhoor;
    TouchInput.atk = false; TouchInput.dodge = false; TouchInput.bukhoor = false;
    if (wantEscape && p.bukhoor > 0) {
      p.bukhoor = 0; SFX.smoke();
      this.finish('escape');
      return;
    }

    // ----- doors -----
    this.checkDoors();

    // ----- enemies -----
    const room = this.cur;
    for (const en of room.enemies) {
      if (en.hp <= 0) continue;
      en.t += dt; en.flash = Math.max(0, en.flash - dt);
      this.enemyAI(en, dt);
      // contact damage
      if (p.invuln <= 0 && Math.abs(en.x - p.x) < 30 && Math.abs(en.y - p.y + 20) < 36) {
        this.hurtPlayer(en.dmg);
      }
    }
    room.enemies = room.enemies.filter(en => en.hp > 0 || en.deathT > 0);

    // boss banner / portal
    const boss = room.enemies.find(e => e.boss && e.hp > 0);
    if (room.isBoss) {
      const bb = document.getElementById('boss-banner');
      if (boss) {
        bb.classList.remove('hidden');
        document.getElementById('boss-name').textContent = 'حارس الواجهة';
        document.getElementById('boss-hp-fill').style.width = (boss.hp / boss.maxHp * 100) + '%';
      } else bb.classList.add('hidden');
    }

    // ----- drops pickup -----
    for (const d of room.drops) {
      if (d.taken) continue;
      d.t = (d.t || 0) + dt;
      if (Math.abs(d.x - p.x) < 30 && Math.abs(d.y - p.y + 18) < 34) {
        if (d.kind === 'gold') {
          d.taken = true; p.gold += d.val; SFX.coin();
          this.floaties.push(new Floaty(d.x, d.y - 14, '+' + d.val, '#f4b942'));
        } else if (this.addLoot(d.id)) {
          d.taken = true;
          this.floaties.push(new Floaty(d.x, d.y - 14, ITEMS[d.id].nameAr, '#3ec9a2'));
        }
        updateDungeonHUD();
      }
    }
    // pots
    // chest
    const ch = room.chest;
    if (ch && !ch.open && Math.abs(ch.x - p.x) < 44 && Math.abs(ch.y - p.y + 18) < 44) {
      ch.open = true; SFX.deal();
      for (let i = 0; i < 2; i++) room.drops.push({ kind: 'loot', id: this.rollLoot(), x: ch.x - 20 + i * 40, y: ch.y + 40 });
      room.drops.push({ kind: 'gold', val: 10 + Math.floor(Math.random() * 14), x: ch.x, y: ch.y + 64 });
    }
    // portal exit
    if (room.portal && Math.abs(room.portal.x - p.x) < 40 && Math.abs(room.portal.y - p.y + 18) < 40) {
      this.finish('boss');
      return;
    }

    this.floaties = this.floaties.filter(f => f.update(dt));
    if (p.hp <= 0) this.finish('death');
  },

  doAttack() {
    const p = this.player;
    const ax = p.x + p.fx * 44, ay = p.y - 20 + p.fy * 44;
    const room = this.cur;
    const dmg = 25 + (G.upgrades.blade ? 15 : 0);
    for (const en of room.enemies) {
      if (en.hp <= 0) continue;
      if (Math.abs(en.x - ax) < 46 && Math.abs(en.y - ay) < 46) {
        en.hp -= dmg; en.flash = 0.12;
        en.x += p.fx * 14; en.y += p.fy * 14;
        this.floaties.push(new Floaty(en.x, en.y - 40, dmg, '#ff7a5c'));
        if (en.hp <= 0) this.killEnemy(en);
      }
    }
    for (const pot of room.pots) {
      if (!pot.broken && Math.abs(pot.x - ax) < 42 && Math.abs(pot.y - ay) < 42) {
        pot.broken = true; SFX.hit();
        if (Math.random() < 0.5) room.drops.push({ kind: 'gold', val: 3 + Math.floor(Math.random() * 6), x: pot.x, y: pot.y });
        else if (Math.random() < 0.5) room.drops.push({ kind: 'loot', id: 'frank', x: pot.x, y: pot.y });
      }
    }
  },

  killEnemy(en) {
    const room = this.cur;
    SFX.hit();
    if (en.boss) {
      SFX.deal();
      room.drops.push({ kind: 'loot', id: 'tablet', x: en.x, y: en.y });
      room.drops.push({ kind: 'gold', val: 80, x: en.x - 40, y: en.y + 20 });
      room.drops.push({ kind: 'gold', val: 60, x: en.x + 40, y: en.y + 20 });
      room.portal = { x: this.cvW() / 2, y: 100 };
      this.toast('سقط حارس الواجهة! 🏺 بوابة الدخان فتحت');
    } else {
      if (Math.random() < 0.55) room.drops.push({ kind: 'loot', id: this.rollLoot(), x: en.x, y: en.y });
      else room.drops.push({ kind: 'gold', val: 4 + Math.floor(Math.random() * 8), x: en.x, y: en.y });
    }
  },

  enemyAI(en, dt) {
    const p = this.player;
    const dx = p.x - en.x, dy = (p.y - 20) - en.y, dist = Math.hypot(dx, dy) || 1;
    if (en.type === 'wraith') {
      // drifts toward player with sine sway
      en.x += (dx / dist * en.spd + Math.sin(en.t * 3) * 20) * dt;
      en.y += (dy / dist * en.spd + Math.cos(en.t * 2.2) * 14) * dt;
    } else if (en.type === 'beetle') {
      // zigzag dash
      if (en.state === 'idle') { en.state = 'move'; en.tx = p.x + (Math.random() * 160 - 80); en.ty = p.y - 20 + (Math.random() * 160 - 80); }
      const tdx = en.tx - en.x, tdy = en.ty - en.y, td = Math.hypot(tdx, tdy);
      if (td < 8) en.state = 'idle';
      else { en.x += tdx / td * en.spd * dt; en.y += tdy / td * en.spd * dt; }
    } else if (en.type === 'falcon') {
      // hover then swoop
      if (en.state === 'idle') { en.hover = (en.hover || 0) + dt; en.x += Math.sin(en.t * 2) * 40 * dt; if (en.hover > 1.6 && dist < 320) { en.state = 'swoop'; en.sx = dx / dist; en.sy = dy / dist; en.hover = 0; en.sT = 0.7; } }
      else { en.sT -= dt; en.x += en.sx * 260 * dt; en.y += en.sy * 260 * dt; if (en.sT <= 0) en.state = 'idle'; }
    } else if (en.type === 'guardian') {
      if (en.state === 'idle') {
        en.x += dx / dist * en.spd * 0.4 * dt;
        if ((en.cdT = (en.cdT || 2) - dt) <= 0) { en.state = 'tele'; en.teleT = 0.7; SFX.boss(); }
      } else if (en.state === 'tele') {
        en.teleT -= dt;
        if (en.teleT <= 0) { en.state = 'charge'; en.sx = dx / dist; en.sy = dy / dist; en.chT = 0.9; }
      } else if (en.state === 'charge') {
        en.chT -= dt;
        en.x += en.sx * 330 * dt; en.y += en.sy * 330 * dt;
        const b = this.bounds();
        if (en.x < b.x0 + 30 || en.x > b.x1 - 30 || en.y < b.y0 + 30 || en.y > b.y1 - 30 || en.chT <= 0) {
          en.state = 'stun'; en.stT = 1.1; this.shake = 8; SFX.hurt();
        }
      } else if (en.state === 'stun') {
        en.stT -= dt;
        if (en.stT <= 0) { en.state = 'idle'; en.cdT = 1.6 + Math.random(); }
      }
      // summon at half hp
      if (!en.summoned && en.hp < en.maxHp / 2) {
        en.summoned = true;
        this.cur.enemies.push(this.makeEnemy('wraith', en.x - 90, en.y));
        this.cur.enemies.push(this.makeEnemy('wraith', en.x + 90, en.y));
        this.toast('الحارس يستدعي أطياف الرمل!');
      }
    }
    const b = this.bounds();
    en.x = Math.max(b.x0 + 10, Math.min(b.x1 - 10, en.x));
    en.y = Math.max(b.y0 + 10, Math.min(b.y1 - 10, en.y));
  },

  hurtPlayer(dmg) {
    const p = this.player;
    p.hp -= dmg; p.invuln = 0.85; this.shake = 7;
    SFX.hurt();
    // fragile goods may break
    const fragIdx = p.satchel.findIndex(id => ITEMS[id].fragile);
    if (fragIdx >= 0 && Math.random() < 0.35) {
      const broken = p.satchel.splice(fragIdx, 1)[0];
      this.toast(`تمزّقت ${ITEMS[broken].nameAr}! 📜`);
      this.updateSatchelUI();
    }
    updateDungeonHUD();
  },

  checkDoors() {
    const p = this.player, W = this.cvW(), H = this.cvH();
    const r = this.cur;
    const midX = Math.abs(p.x - W / 2) < 52, midY = Math.abs((p.y - 20) - H / 2) < 52;
    let moved = null;
    if (r.doors.n && p.y - 30 <= TILE + 26 && midX) moved = [0, -1, p.x, H - TILE - 14];
    else if (r.doors.s && p.y >= H - TILE - 6 && midX) moved = [0, 1, p.x, TILE + 60];
    else if (r.doors.w && p.x <= TILE + 12 && midY) moved = [-1, 0, W - TILE - 20, p.y];
    else if (r.doors.e && p.x >= W - TILE - 12 && midY) moved = [1, 0, TILE + 20, p.y];
    if (moved) {
      const next = this.rooms[(r.gx + moved[0]) + ',' + (r.gy + moved[1])];
      if (next) {
        this.cur = next; next.seen = true;
        p.x = moved[2]; p.y = moved[3];
        this.fade = 0.6; SFX.door();
        this.updateMinimap();
        if (next.isBoss && next.enemies.some(e => e.boss && e.hp > 0)) SFX.boss();
      }
    }
  },

  finish(result) {
    this.over = true;
    endNight(result, this.player);
  },

  /* ---------- draw ---------- */
  draw() {
    const ctx = this.ctx, W = this.cvW(), H = this.cvH();
    ctx.save();
    if (this.shake > 0) ctx.translate((Math.random() - .5) * this.shake, (Math.random() - .5) * this.shake);

    const room = this.cur, p = this.player;
    // floor
    ctx.fillStyle = room.isBoss ? '#2e2a40' : '#383048';
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = room.isBoss ? '#332e46' : '#3e3550';
    for (let y = TILE; y < H - TILE; y += 32) for (let x = TILE + ((y / 32) % 2) * 32; x < W - TILE; x += 64) ctx.fillRect(x, y, 30, 30);
    // scattered rubble
    ctx.fillStyle = '#2c2740';
    for (let i = 0; i < 14; i++) {
      const rx = (i * 197 + room.gx * 131) % (W - 2 * TILE) + TILE;
      const ry = (i * 151 + room.gy * 89) % (H - 2 * TILE) + TILE;
      ctx.fillRect(rx, ry, 10, 6);
    }
    // walls — carved sandstone
    ctx.fillStyle = '#544668';
    ctx.fillRect(0, 0, W, TILE + 16); ctx.fillRect(0, H - TILE, W, TILE);
    ctx.fillRect(0, 0, TILE, H); ctx.fillRect(W - TILE, 0, TILE, H);
    ctx.fillStyle = '#473a59';
    for (let x = 0; x < W; x += 40) { ctx.fillRect(x, TILE - 8, 36, 20); ctx.fillRect(x + 12, H - TILE + 4, 36, 20); }
    for (let y = 0; y < H; y += 40) { ctx.fillRect(8, y, 20, 36); ctx.fillRect(W - 30, y, 20, 36); }
    // nabataean facade carving on top wall
    ctx.fillStyle = '#3ec9a2';
    for (let x = 110; x < W - 100; x += 150) {
      ctx.globalAlpha = 0.5 + Math.sin(this.time * 2 + x) * 0.2;
      ctx.fillRect(x, 18, 6, 26); ctx.fillRect(x + 12, 26, 6, 18); ctx.fillRect(x - 12, 26, 6, 18);
      ctx.globalAlpha = 1;
    }
    // doors
    ctx.fillStyle = '#171327';
    if (room.doors.n) ctx.fillRect(W / 2 - 50, 0, 100, TILE + 16);
    if (room.doors.s) ctx.fillRect(W / 2 - 50, H - TILE, 100, TILE);
    if (room.doors.w) ctx.fillRect(0, H / 2 - 50, TILE, 100);
    if (room.doors.e) ctx.fillRect(W - TILE, H / 2 - 50, TILE, 100);

    // pillars
    for (const pil of room.pillars) {
      drawShadow(ctx, pil.x, pil.y + 34, 24);
      ctx.fillStyle = '#5e5074'; ctx.fillRect(pil.x - 18, pil.y - 50, 36, 84);
      ctx.fillStyle = '#6e5f86'; ctx.fillRect(pil.x - 22, pil.y - 58, 44, 12);
      ctx.fillRect(pil.x - 22, pil.y + 26, 44, 10);
    }
    // pots
    for (const pot of room.pots) {
      if (pot.broken) {
        ctx.fillStyle = '#7a5a3a'; ctx.fillRect(pot.x - 10, pot.y + 6, 8, 5); ctx.fillRect(pot.x + 4, pot.y + 8, 9, 5);
        continue;
      }
      drawShadow(ctx, pot.x, pot.y + 14, 13);
      ctx.fillStyle = '#9a6a3c';
      ctx.beginPath(); ctx.ellipse(pot.x, pot.y, 13, 15, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#7a5028'; ctx.fillRect(pot.x - 7, pot.y - 17, 14, 6);
    }
    // chest
    if (room.chest) {
      const ch = room.chest;
      drawShadow(ctx, ch.x, ch.y + 20, 22);
      ctx.fillStyle = '#6b4226'; ctx.fillRect(ch.x - 22, ch.y - 10, 44, 30);
      ctx.fillStyle = ch.open ? '#3a2414' : '#8a5a34'; ctx.fillRect(ch.x - 22, ch.y - 18, 44, 12);
      ctx.fillStyle = '#f4b942'; ctx.fillRect(ch.x - 4, ch.y - 4, 8, 10);
    }
    // portal
    if (room.portal) {
      const po = room.portal, pu = 1 + Math.sin(this.time * 4) * .15;
      ctx.save(); ctx.translate(po.x, po.y); ctx.scale(pu, pu);
      ctx.fillStyle = 'rgba(62,201,162,.25)'; ctx.beginPath(); ctx.arc(0, 0, 38, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#3ec9a2'; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(0, 0, 30, 0, Math.PI * 2); ctx.stroke();
      ctx.restore();
      ctx.fillStyle = '#3ec9a2'; ctx.font = 'bold 13px Tajawal'; ctx.textAlign = 'center';
      ctx.fillText('بوابة الدخان', po.x, po.y + 56); ctx.textAlign = 'start';
    }
    // drops
    for (const d of room.drops) {
      if (d.taken) continue;
      const bobY = Math.sin((d.t || 0) * 4) * 4;
      if (d.kind === 'gold') {
        ctx.fillStyle = '#f4b942'; ctx.beginPath(); ctx.arc(d.x, d.y + bobY, 7, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = '#b07f1a'; ctx.lineWidth = 2; ctx.stroke();
      } else {
        drawShadow(ctx, d.x, d.y + 14, 10);
        ctx.drawImage(SPR[ITEMS[d.id].icon], d.x - 16, d.y - 16 + bobY, 32, 32);
      }
    }

    // entities sorted by y
    const ents = [...room.enemies.filter(e => e.hp > 0)];
    ents.sort((a, b) => a.y - b.y);
    let playerDrawn = false;
    for (const en of ents) {
      if (!playerDrawn && en.y > p.y - 20) { this.drawPlayer(ctx); playerDrawn = true; }
      drawShadow(ctx, en.x, en.y + (en.boss ? 36 : 18), en.boss ? 34 : 15);
      const blink = en.state === 'tele' && Math.floor(this.time * 10) % 2 === 0;
      drawSpr(ctx, SPR[en.spr], en.x, en.y + (en.boss ? 38 : 22), { flash: en.flash > 0 || blink, flip: p.x < en.x });
      if (!en.boss && en.hp < en.maxHp) {
        ctx.fillStyle = '#1a0d08'; ctx.fillRect(en.x - 18, en.y - 44, 36, 6);
        ctx.fillStyle = '#e74c3c'; ctx.fillRect(en.x - 17, en.y - 43, 34 * (en.hp / en.maxHp), 4);
      }
    }
    if (!playerDrawn) this.drawPlayer(ctx);

    for (const f of this.floaties) f.draw(ctx);

    // darkness + lantern light
    const lr = G.upgrades.lantern ? 300 : 215;
    const dk = ctx.createRadialGradient(p.x, p.y - 24, lr * 0.45, p.x, p.y - 24, lr);
    dk.addColorStop(0, 'rgba(8,5,18,0)');
    dk.addColorStop(0.75, 'rgba(8,5,18,.55)');
    dk.addColorStop(1, 'rgba(8,5,18,.88)');
    ctx.fillStyle = dk; ctx.fillRect(0, 0, W, H);
    // lantern warm flicker
    const fl = 0.06 + Math.sin(this.time * 9) * 0.02;
    const wg = ctx.createRadialGradient(p.x, p.y - 24, 0, p.x, p.y - 24, 110);
    wg.addColorStop(0, `rgba(244,185,66,${fl})`); wg.addColorStop(1, 'rgba(244,185,66,0)');
    ctx.fillStyle = wg; ctx.fillRect(0, 0, W, H);

    if (this.fade > 0) { ctx.fillStyle = `rgba(8,5,18,${this.fade})`; ctx.fillRect(0, 0, W, H); }
    ctx.restore();
  },

  drawPlayer(ctx) {
    const p = this.player;
    drawShadow(ctx, p.x, p.y, 16);
    const vis = p.invuln > 0 && Math.floor(this.time * 14) % 2 === 0;
    if (!vis) drawSpr(ctx, SPR.playerNight, p.x, p.y, { flip: p.flip });
    // attack slash
    if (p.atkT > 0) {
      ctx.save();
      ctx.translate(p.x + p.fx * 46, p.y - 22 + p.fy * 46);
      ctx.rotate(Math.atan2(p.fy, p.fx));
      ctx.strokeStyle = 'rgba(246,239,220,.9)'; ctx.lineWidth = 5;
      ctx.beginPath(); ctx.arc(0, 0, 26, -1.1, 1.1); ctx.stroke();
      ctx.strokeStyle = 'rgba(62,201,162,.5)'; ctx.lineWidth = 9;
      ctx.beginPath(); ctx.arc(0, 0, 20, -0.9, 0.9); ctx.stroke();
      ctx.restore();
    }
  },
};

function updateDungeonHUD() {
  const p = Dungeon.player; if (!p) return;
  document.getElementById('hud-hp-fill').style.width = Math.max(0, p.hp / PLAYER_HP * 100) + '%';
  document.getElementById('hud-hp-num').textContent = Math.max(0, p.hp) + '/' + PLAYER_HP;
  document.getElementById('hud-dgold').textContent = p.gold;
}
