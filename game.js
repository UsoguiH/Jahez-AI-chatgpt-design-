'use strict';
/* ==========================================================================
   YOU SUCK AT THIS™ — a love letter to your inadequacy
   A precision rage-platformer with a personality problem.
   ========================================================================== */

/* ============================ CONFIG ===================================== */
const TILE = 30, COLS = 32, ROWS = 18, W = 960, H = 540;
const GRAV = 2200, MOVE = 260, JUMPV = -690, MAXFALL = 980;
const COYOTE = 0.09, JBUFFER = 0.12;
const PW = 22, PH = 26;

/* ============================ TAUNT LIBRARY ============================== */
// Tone escalates with session deaths: condescending -> mocking -> vicious -> existential.
const TAUNTS = {
  tier1: [
    "Oh no. Anyway.",
    "That was a tutorial-grade obstacle, {name}.",
    "Don't worry. The first 50 deaths are the hardest.",
    "The spike was stationary. It has no AI. It just sat there. And won.",
    "Tip: try not dying. Works for most people.",
    "Your character died doing what it loved: paying for your mistakes.",
    "Death #{deaths}. I'm keeping count so your therapist doesn't have to.",
    "You pressed jump. The game respected it. Gravity, however...",
    "Interesting strategy, walking into it. Bold.",
    "I've seen speedruns of this level. They did not look like that.",
    "A for effort. F for everything that effort produced.",
  ],
  tier2: [
    "{deaths} deaths. The spikes are starting to feel guilty.",
    "I'd call you a casual, but casuals finish level 2.",
    "My grandma plays this in oven mitts. She's past this part.",
    "You're not unlucky, {name}. Luck implies randomness. This is consistent.",
    "The respawn system is filing for overtime.",
    "{minutes} minutes in. A microwave burrito would have achieved more.",
    "I'm not mad. I'm just laughing. At you. Specifically.",
    "That gap is jumpable. Pigeons handle harder navigation daily.",
    "Your muscle memory called. It wants a refund.",
    "Somewhere out there, a worse player exists. Probably. Statistically.",
    "You keep doing the same thing and expecting... actually what DO you expect?",
  ],
  tier3: [
    "{deaths} deaths, {name}. At this point the game is studying YOU.",
    "I showed your gameplay to the other levels. They're not even scared.",
    "You know what's wild? You CHOSE to be here. Free will is hilarious.",
    "The save file is embarrassed to contain this run.",
    "NASA wants to study whatever force keeps pulling you into spikes.",
    "Each death makes you stronger. So far the data does not support this.",
    "You're like a moth, {name}, but the lamp is failure.",
    "Even the fake platforms feel bad now. And betrayal is their whole job.",
    "Your persistence would be inspiring if it ever accomplished anything.",
    "I've started rendering the spikes lazily. They know you're coming back.",
  ],
  tier4: [
    "What if I told you the controls were perfect this whole time? Because they were.",
    "Remember when you thought this would take ten minutes? That was {minutes} minutes ago.",
    "You can quit. I'll still be here. We both know you'll be back.",
    "Death #{deaths}. The number isn't the sad part. The persistence is.",
    "I'm not the villain, {name}. I'm a mirror. With spikes in it.",
    "This level has not changed since you started. Sit with that.",
    "Blink twice if you need help. It won't matter. But blink twice.",
    "At {deaths} deaths we stop calling it a game and start calling it a lifestyle.",
  ],
  spike: [
    "Impaled. Classic.",
    "The spike thanks you for the company.",
    "Pointy thing pointy. Today's lesson, free of charge.",
    "You and that spike should just get a room at this point.",
  ],
  saw: [
    "The saw is the only thing in this game doing its job.",
    "Sliced, diced, and emotionally compromised.",
    "It spins in a predictable pattern, {name}. PREDICTABLE.",
    "The saw didn't even slow down. It doesn't respect you enough to slow down.",
  ],
  fall: [
    "Gravity 1, {name} 0. The score has not changed all day.",
    "You fell off the level. There was SO much level to stand on.",
    "The void says hi. It's seeing you a lot lately.",
    "That wasn't a jump, that was a donation to the abyss.",
  ],
  troll: [
    "Surprise! It was always there. In my heart.",
    "That spike was hiding. From your gameplay. Can't blame it.",
    "Pop goes the weasel. You're the weasel.",
    "You walked into an ambush a goldfish would have suspected.",
  ],
  fakeplat: [
    "That platform had one job: to leave. Nailed it.",
    "Trust is earned, {name}. The floor owes you nothing.",
    "It looked solid. So do you, and look how that's going.",
    "The platform dumped you. It's not the first thing to do that, is it.",
  ],
  crumble: [
    "It was crumbling. Visibly. With cracks. CRACKS, {name}.",
    "Standing still on a collapsing platform. A masterclass in decision-making.",
    "The platform gave you a full warning. More than life ever does.",
  ],
  restart: [
    "Self-destruct. Couldn't even let the level do its job.",
    "Pressing R counts as a death. Rules are rules. My rules.",
    "Quitting on yourself before the game can. Efficient, honestly.",
  ],
  nearmiss: [
    "{px} PIXELS from the door. That's it. {px}.",
    "SO close. I genuinely gasped. Then I laughed for a while.",
    "You were RIGHT THERE. This is the part where you can't quit and we both know it.",
    "{px} pixels. You could have spit on the exit. Instead, this.",
    "One more jump. It was ONE more jump, {name}.",
  ],
  samespot: [
    "Same spot. AGAIN. The spike has learned your name.",
    "That's {n} times in the exact same place. It's not a trap anymore, it's a tradition.",
    "I'm naming this spot after you, {name}. The plaque is being engraved.",
    "x{n} same location. Insanity is doing the same thing and... you know what, never mind.",
  ],
  fastdeath: [
    "{s} seconds. A sneeze lasts longer.",
    "Speedrunning death. Finally a leaderboard you'd top.",
    "You died faster than the level finished loading. Impressive. Horrible, but impressive.",
  ],
  idle: [
    "Take your time. The spikes are immortal. You are not.",
    "Staring at it won't make it easier. Watching you hasn't gotten easier either.",
    "Planning your route? Adorable. The route doesn't care.",
    "AFK? Or paralyzed by the weight of your own track record?",
  ],
  back: [
    "Welcome back. The level didn't miss you.",
    "I KNEW you'd come back. They always come back.",
    "Did you google a walkthrough? There isn't one. There's just you. And this.",
    "Tab-switching won't heal what this game has shown you about yourself.",
  ],
  gaslight: [
    "The controls are fine. They have always been fine.",
    "Wind changed direction. (There is no wind.)",
    "You feel that? Me neither. Everything is completely normal.",
    "Left is left. Right is right. Probably. Don't overthink it.",
    "If the movement feels wrong, consider that the movement is you.",
  ],
  rage: [
    "Rage detected. Delicious.",
    "Your APM just spiked. Your skill did not.",
    "Deep breaths, {name}. The spikes can smell cortisol.",
  ],
  mercy: [
    "Want me to make it easier? ... LOL. No.",
    "I considered adding a checkpoint here. Then I considered your attitude.",
    "Easy mode is in another game. A game for people like... well.",
  ],
};

const MILESTONES = {
  5:   "FIVE deaths. A nice round warm-up.",
  10:  "TEN. Double digits. The game has officially noticed you.",
  20:  "TWENTY deaths. You can stop any time. (You can't.)",
  30:  "30 deaths. Your character's life insurance has been voided.",
  50:  "FIFTY. Half a hundred. I'm framing this.",
  75:  "75 deaths. We've passed 'bad' and entered 'fascinating'.",
  100: "ONE HUNDRED DEATHS, {name}. This is a relationship now.",
  150: "150. I ran out of jokes 70 deaths ago. This is just documentation.",
  200: "200 deaths. Scientists will want this footage.",
  300: "300. THIS. IS. EMBARRASSING. (For both of us. Mostly you.)",
};

/* ============================ LEVELS =====================================
   Legend:  # solid   ^ spike-up   v spike-down   P spawn   G goal
            g fake goal   F fake platform   C crumble   T pop-up troll spike
            H invisible block   s horizontal saw   d vertical saw            */
const LEVELS = [
  {
    name: "THE TUTORIAL",
    intro: "Move with ARROWS/WASD. Jump with SPACE. Even you can't mess this up.<br><span class='roast'>(You will mess this up.)</span>",
    clear: "Level 1 done. The participation trophy is in the mail.",
    modifier: null,
    map: [
      "................................",
      "................................",
      "................................",
      "................................",
      "................................",
      "................................",
      "................................",
      "...........................G...",
      "..........................#####",
      "................................",
      "......................##........",
      "................................",
      "..................##............",
      "................................",
      "..............##................",
      "................................",
      "P...^^....^^^........T..........",
      "################################",
    ],
  },
  {
    name: "SAW POINT",
    intro: "Spinning blades. They move in patterns. Patterns require pattern recognition.<br><span class='roast'>I already see the problem.</span>",
    clear: "You beat the saws. They demand a rematch. They'll get one — you'll die again eventually.",
    modifier: null,
    map: [
      "................................",
      "................................",
      "...........................G...",
      "..........................#####",
      "................................",
      "......................##........",
      "................................",
      "..................CC............",
      "........s.......................",
      "..............##................",
      "................................",
      "..........FF....................",
      "................................",
      "................................",
      ".....##.........................",
      "................................",
      "P...............................",
      "####^^^^^^^^^^^^^^^^^^^^^^^^####",
    ],
  },
  {
    name: "TRUST ISSUES",
    intro: "Some platforms in this level are lying to you.<br><span class='roast'>So is your confidence.</span>",
    clear: "You learned not to trust anything. The game's first real life lesson.",
    modifier: null,
    map: [
      "................................",
      "................................",
      "...........................G...",
      "..........................#####",
      ".........................H......",
      "......................FF........",
      "..................T.............",
      "..................##............",
      "................................",
      "..............FF................",
      "................................",
      "..........##....................",
      "................................",
      "................................",
      ".....FF.........................",
      "................................",
      "P...............................",
      "####^^^^^^^^^^^^^^^^^^^^^^^^####",
    ],
  },
  {
    name: "GASLIGHT DISTRICT",
    intro: "Nothing is wrong with this level. Nothing will go wrong with your controls.<br><span class='roast'>Nothing. :)</span>",
    clear: "See? The controls were fine. They were always fine. Moving on.",
    modifier: "invert",
    map: [
      "................................",
      "................................",
      "..........................T.G..",
      "..........................#####",
      "................................",
      "......................##........",
      "...........d....................",
      "..................##............",
      "................................",
      "..............##................",
      ".......s........................",
      "..........##....................",
      "................................",
      "................................",
      ".....##.........................",
      "................................",
      "P......^...........^............",
      "####^^^^^^^^^^^^^^^^^^^^^^^^####",
    ],
  },
  {
    name: "THE HALLWAY OF HATE",
    intro: "Four corridors. Snake your way up.<br><span class='roast'>Tight ceilings. Tighter jumps. Loosest part of this level is your technique.</span>",
    clear: "You escaped the hallways. They're installing more spikes for your next visit.",
    modifier: null,
    map: [
      "................................",
      "................................",
      "................................",
      "................................",
      "..G.....^.........^........^...",
      "############################....",
      "..............s.................",
      "......^.......T......^.....^...",
      "....############################",
      ".........s......................",
      "...^......^.........^......T...",
      "############################....",
      "..................s.............",
      ".....^........^...........^....",
      "....############################",
      "..........s.....................",
      "P......^..........^........^...",
      "################################",
    ],
  },
  {
    name: "LIGHTS OUT",
    intro: "I turned the lights off.<br><span class='roast'>Honestly? Watching you play was getting hard for me too.</span>",
    clear: "Out of the dark. Your gameplay, however, remains in it.",
    modifier: "dark",
    map: [
      "................................",
      "................................",
      "...........................G...",
      "..........................#####",
      "................................",
      "......................##........",
      "....................d...........",
      "..................FF............",
      "........s.......................",
      "..............##................",
      "................................",
      "..........CC....................",
      "................................",
      "................................",
      ".....##.........................",
      "................................",
      "P..........T..........T........",
      "####^^^^^^^^^^^^^^^^^^^^^^^^####",
    ],
  },
  {
    name: "THE FINAL INSULT",
    intro: "Last level. Everything I have, all at once.<br><span class='roast'>The exit is right there at the top. Trust me. :)</span>",
    clear: "",
    modifier: "chaos",
    hiddenGoal: true,
    map: [
      "................................",
      ".G..........................g..",
      "####..CC..CC..CC..CC..CC..####..",
      "................................",
      "................s...............",
      "..........................###..",
      "................................",
      "......................##........",
      ".......s........................",
      "..................##............",
      "................................",
      "..............##................",
      ".........s......................",
      "..........##....................",
      "................................",
      ".....##.........................",
      "P.........T.....................",
      "####^^^^^^^^^^^^^^^^^^^^^^^^####",
    ],
  },
];

/* ============================ PERSISTENCE ================================ */
const store = {
  get(k, d) { try { const v = localStorage.getItem('ysat_' + k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem('ysat_' + k, JSON.stringify(v)); } catch (e) {} },
};

/* ============================ STATE ====================================== */
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const overlay = document.getElementById('overlay');

const G = {
  mode: 'title',          // title | intro | play | dead | clear | victory
  levelIdx: 0,
  grid: [],
  saws: [],
  trolls: [],
  tstate: {},             // per-tile dynamic state for F/C/H
  spawn: { x: 30, y: 450 },
  goal: null,             // {x,y} px of goal tile
  fakeGoal: null,
  goalRevealed: true,
  player: { x: 0, y: 0, vx: 0, vy: 0, onGround: false, coyote: 0, jbuf: 0, face: 1 },
  dead: false,
  deadT: 0,
  // session stats
  deaths: 0,
  levelDeaths: 0,
  startTime: 0,
  levelStart: 0,
  spawnTime: 0,
  rageQuits: 0,
  comebacks: 0,
  // lifetime
  name: store.get('name', ''),
  lifeDeaths: store.get('lifeDeaths', 0),
  wins: store.get('wins', 0),
  // hooks
  bestDist: Infinity,     // closest-to-goal this level (px)
  maxX: 0,
  lastDeathPos: null,
  sameSpotN: 0,
  rageHeat: 0,
  lastInput: 0,
  idleWarned: false,
  deathlessLevel: true,
  // modifiers
  invertActive: false,
  invertT: 0,
  invertNext: 7,
  darkPulse: 0,
  // fx
  particles: [],
  confetti: [],
  shake: 0,
  banner: null,           // {text, t}
  bannerQ: [],
  flash: null,            // {text, t, sub}
  muted: store.get('muted', false),
  time: 0,
};

const keys = {};

/* ============================ AUDIO ====================================== */
let AC = null;
function audio() {
  if (!AC) { try { AC = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {} }
  return AC;
}
function beep(freq, dur, type, vol, slideTo) {
  if (G.muted) return;
  const ac = audio(); if (!ac) return;
  const o = ac.createOscillator(), g = ac.createGain();
  o.type = type || 'square';
  o.frequency.setValueAtTime(freq, ac.currentTime);
  if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, ac.currentTime + dur);
  g.gain.setValueAtTime(vol || 0.06, ac.currentTime);
  g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + dur);
  o.connect(g); g.connect(ac.destination);
  o.start(); o.stop(ac.currentTime + dur + 0.02);
}
const sfx = {
  jump()  { beep(300, 0.1, 'square', 0.05, 520); },
  death() { beep(220, 0.35, 'sawtooth', 0.09, 50); beep(180, 0.4, 'square', 0.05, 40); },
  taunt() { beep(700, 0.05, 'square', 0.03, 900); },
  pop()   { beep(150, 0.12, 'square', 0.07, 600); },
  clear() { [440, 554, 659, 880].forEach((f, i) => setTimeout(() => beep(f, 0.18, 'square', 0.06), i * 110)); },
  win()   { [523, 659, 784, 1047, 784, 1047, 1319].forEach((f, i) => setTimeout(() => beep(f, 0.22, 'square', 0.07), i * 140)); },
  crumb() { beep(120, 0.15, 'sawtooth', 0.05, 60); },
};

/* ============================ TAUNT ENGINE =============================== */
const lastPick = {};
function pick(pool) {
  const arr = TAUNTS[pool];
  let i = Math.floor(Math.random() * arr.length);
  if (arr.length > 1 && i === lastPick[pool]) i = (i + 1) % arr.length;
  lastPick[pool] = i;
  return arr[i];
}
function fmt(s, extra) {
  const mins = Math.max(1, Math.floor((performance.now() - G.startTime) / 60000));
  return s.replace(/\{name\}/g, G.name || 'champ')
          .replace(/\{deaths\}/g, G.deaths)
          .replace(/\{minutes\}/g, mins)
          .replace(/\{px\}/g, extra && extra.px !== undefined ? extra.px : '?')
          .replace(/\{n\}/g, extra && extra.n !== undefined ? extra.n : '?')
          .replace(/\{s\}/g, extra && extra.s !== undefined ? extra.s : '?');
}
function say(pool, extra) {
  const text = fmt(pick(pool), extra);
  if (G.banner && G.banner.t > 0.5 && G.bannerQ.length < 2) G.bannerQ.push(text);
  else G.banner = { text, t: 3.2 };
  sfx.taunt();
}
function sayRaw(text) {
  G.banner = { text: fmt(text), t: 3.2 };
  sfx.taunt();
}
function bigFlash(text, sub) {
  G.flash = { text: fmt(text), sub: sub ? fmt(sub) : null, t: 2.2 };
}
function tierPool() {
  if (G.deaths >= 80) return 'tier4';
  if (G.deaths >= 40) return 'tier3';
  if (G.deaths >= 15) return 'tier2';
  return 'tier1';
}

/* ============================ LEVEL LOADING ============================== */
function tileAt(tx, ty) {
  if (tx < 0 || tx >= COLS || ty < 0 || ty >= ROWS) return '.';
  return G.grid[ty][tx];
}
function key(tx, ty) { return tx + ',' + ty; }
function solidAt(tx, ty) {
  const c = tileAt(tx, ty);
  if (c === '#' || c === 'H') return true;
  if (c === 'F' || c === 'C') {
    const st = G.tstate[key(tx, ty)];
    return !(st && st.gone);
  }
  return false;
}
function loadLevel(idx) {
  G.levelIdx = idx;
  const lv = LEVELS[idx];
  G.grid = lv.map.map(r => r.padEnd(COLS, '.').slice(0, COLS).split(''));
  while (G.grid.length < ROWS) G.grid.push('.'.repeat(COLS).split(''));
  G.saws = []; G.trolls = []; G.tstate = {};
  G.goal = null; G.fakeGoal = null;
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      const c = G.grid[y][x], px = x * TILE, py = y * TILE;
      if (c === 'P') { G.spawn = { x: px + (TILE - PW) / 2, y: py + TILE - PH }; G.grid[y][x] = '.'; }
      else if (c === 'G') { G.goal = { x: px, y: py }; G.grid[y][x] = '.'; }
      else if (c === 'g') { G.fakeGoal = { x: px, y: py }; G.grid[y][x] = '.'; }
      else if (c === 's') { G.saws.push({ x: px + 15, y: py + 15, axis: 'h', dir: 1, r: 12, spin: 0 }); G.grid[y][x] = '.'; }
      else if (c === 'd') { G.saws.push({ x: px + 15, y: py + 15, axis: 'v', dir: 1, r: 12, spin: 0 }); G.grid[y][x] = '.'; }
      else if (c === 'T') { G.trolls.push({ tx: x, ty: y, active: false, t: 0 }); G.grid[y][x] = '.'; }
    }
  }
  G.goalRevealed = !lv.hiddenGoal;
  G.levelDeaths = 0;
  G.bestDist = Infinity;
  G.maxX = 0;
  G.lastDeathPos = null;
  G.sameSpotN = 0;
  G.deathlessLevel = true;
  G.levelStart = performance.now();
  respawn();
}
function respawn() {
  const p = G.player;
  p.x = G.spawn.x; p.y = G.spawn.y;
  p.vx = 0; p.vy = 0; p.onGround = false; p.coyote = 0; p.jbuf = 0;
  G.dead = false;
  // restore fake/crumble platforms, but invisible blocks stay revealed once found
  const kept = {};
  for (const k in G.tstate) if (G.tstate[k].revealed) kept[k] = { revealed: true };
  G.tstate = kept;
  G.trolls.forEach(t => { t.active = false; t.t = 0; });
  G.spawnTime = performance.now();
  G.invertActive = false;
  G.invertNext = G.time + 5 + Math.random() * 4;
}

/* ============================ DEATH & WIN ================================ */
function activeGoalRect() {
  if (!G.goal || !G.goalRevealed) return null;
  return { x: G.goal.x, y: G.goal.y - TILE, w: TILE, h: TILE * 2 };
}
function die(cause) {
  if (G.dead || G.mode !== 'play') return;
  G.dead = true; G.deadT = 0.8; G.mode = 'dead';
  G.deaths++; G.levelDeaths++; G.lifeDeaths++;
  store.set('lifeDeaths', G.lifeDeaths);
  G.deathlessLevel = false;
  G.rageHeat += 1;
  G.shake = 0.35;
  sfx.death();
  const p = G.player;
  for (let i = 0; i < 26; i++) {
    G.particles.push({
      x: p.x + PW / 2, y: p.y + PH / 2,
      vx: (Math.random() - 0.5) * 460, vy: (Math.random() - 0.8) * 420,
      t: 0.6 + Math.random() * 0.5, col: Math.random() < 0.7 ? '#ff3355' : '#ffcc00',
    });
  }
  chooseTaunt(cause, p);
}
function chooseTaunt(cause, p) {
  // milestone first (big moment)
  if (MILESTONES[G.deaths]) {
    bigFlash(MILESTONES[G.deaths]);
    return;
  }
  if (cause === 'fakegoal') {
    bigFlash("THAT'S NOT AN EXIT", "It never was. The real one just unlocked. You're welcome. Climb again.");
    return;
  }
  // near-miss hook: distance to goal
  const goalR = activeGoalRect() || (G.fakeGoal && { x: G.fakeGoal.x, y: G.fakeGoal.y - TILE, w: TILE, h: TILE * 2 });
  if (goalR) {
    const d = Math.round(Math.hypot(goalR.x + 15 - (p.x + PW / 2), goalR.y + 30 - (p.y + PH / 2)));
    if (d < G.bestDist) {
      G.bestDist = d;
      if (d < 150) {
        bigFlash("SO CLOSE", null);
        say('nearmiss', { px: d });
        return;
      }
      if (d < 400) sayRaw("NEW PERSONAL BEST: " + d + "px from freedom. Frame it.");
    }
  }
  // same-spot detection
  if (G.lastDeathPos && Math.hypot(p.x - G.lastDeathPos.x, p.y - G.lastDeathPos.y) < 70) {
    G.sameSpotN++;
    if (G.sameSpotN >= 2) { say('samespot', { n: G.sameSpotN + 1 }); G.lastDeathPos = { x: p.x, y: p.y }; return; }
  } else G.sameSpotN = 0;
  G.lastDeathPos = { x: p.x, y: p.y };
  // rage meter
  if (G.rageHeat >= 5) { G.rageHeat = 2.5; say('rage'); return; }
  // fast death
  const aliveS = (performance.now() - G.spawnTime) / 1000;
  if (aliveS < 1.6 && Math.random() < 0.6) { say('fastdeath', { s: aliveS.toFixed(1) }); return; }
  // fake mercy at 10+ deaths on one level
  if (G.levelDeaths > 0 && G.levelDeaths % 10 === 0) { say('mercy'); return; }
  // cause-specific or tier roast
  if (cause && TAUNTS[cause] && Math.random() < 0.5) say(cause);
  else say(tierPool());
}
function levelClear() {
  G.mode = 'clear';
  sfx.clear();
  store.set('bestLevel', Math.max(store.get('bestLevel', 0), G.levelIdx + 1));
  if (G.levelIdx >= LEVELS.length - 1) { winGame(); return; }
  showClear();
}
function winGame() {
  G.mode = 'victory';
  G.wins++; store.set('wins', G.wins);
  sfx.win();
  for (let i = 0; i < 160; i++) {
    G.confetti.push({
      x: Math.random() * W, y: -20 - Math.random() * H,
      vy: 60 + Math.random() * 120, vx: (Math.random() - 0.5) * 60,
      col: ['#ff3355', '#ffcc00', '#33ddff', '#66ff88', '#ff88ee'][i % 5],
      w: 4 + Math.random() * 5, rot: Math.random() * 6.28, vr: (Math.random() - 0.5) * 8,
    });
  }
  showVictory();
}

/* ============================ MODIFIERS ================================== */
function updateModifiers(dt) {
  const mod = LEVELS[G.levelIdx].modifier;
  if (!mod) return;
  if (mod === 'invert' || mod === 'chaos') {
    if (G.invertActive) {
      G.invertT -= dt;
      if (G.invertT <= 0) G.invertActive = false;
    } else if (G.time >= G.invertNext) {
      if (mod === 'chaos' && Math.random() < 0.45) {
        G.darkPulse = 3.0;
        sayRaw("Power's fine. Your eyes are the problem.");
      } else {
        G.invertActive = true; G.invertT = 2.5;
        say('gaslight');
      }
      G.invertNext = G.time + 6 + Math.random() * 3.5;
    }
  }
  if (G.darkPulse > 0) G.darkPulse -= dt;
}

/* ============================ PHYSICS ==================================== */
function rectsOverlap(ax, ay, aw, ah, bx, by, bw, bh) {
  return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
}
function update(dt) {
  G.time += dt;
  updateParticles(dt);
  if (G.shake > 0) G.shake -= dt;
  if (G.rageHeat > 0) G.rageHeat -= dt * 0.03;

  // banner queue
  if (G.banner) {
    G.banner.t -= dt;
    if (G.banner.t <= 0) G.banner = G.bannerQ.length ? { text: G.bannerQ.shift(), t: 3.2 } : null;
  }
  if (G.flash) { G.flash.t -= dt; if (G.flash.t <= 0) G.flash = null; }

  updateSaws(dt);
  updateTrolls(dt);

  if (G.mode === 'dead') {
    G.deadT -= dt;
    if (G.deadT <= 0) { G.mode = 'play'; respawn(); }
    return;
  }
  if (G.mode !== 'play') return;

  updateModifiers(dt);

  // idle nag
  if (G.time - G.lastInput > 12 && !G.idleWarned) { say('idle'); G.idleWarned = true; }

  const p = G.player;
  let dir = (keys.right ? 1 : 0) - (keys.left ? 1 : 0);
  if (G.invertActive) dir *= -1;
  p.vx = dir * MOVE;
  if (dir !== 0) p.face = dir;

  // jump buffering + coyote
  p.coyote -= dt; p.jbuf -= dt;
  if (keys.jumpPressed) { p.jbuf = JBUFFER; keys.jumpPressed = false; }
  if (p.jbuf > 0 && p.coyote > 0) {
    p.vy = JUMPV; p.coyote = 0; p.jbuf = 0; p.onGround = false;
    sfx.jump();
  }
  if (!keys.jump && p.vy < 0) p.vy *= Math.pow(0.02, dt * 6); // variable jump height

  p.vy = Math.min(p.vy + GRAV * dt, MAXFALL);

  // --- horizontal sweep
  p.x += p.vx * dt;
  if (p.x < 0) p.x = 0;
  if (p.x + PW > W) p.x = W - PW;
  collideAxis(p, 'x');
  // --- vertical sweep
  p.onGround = false;
  p.y += p.vy * dt;
  collideAxis(p, 'y');
  if (p.onGround) p.coyote = COYOTE;

  // fell off the world
  if (p.y > H + 60) { die('fall'); return; }

  // hazards
  checkHazards(p);
  if (G.dead) return;

  // fake/crumble platform timers for the tile(s) under our feet
  tickStoodTiles(p, dt);

  // goal checks
  const gr = activeGoalRect();
  if (gr && rectsOverlap(p.x, p.y, PW, PH, gr.x + 4, gr.y, gr.w - 8, gr.h)) { levelClear(); return; }
  if (G.fakeGoal && rectsOverlap(p.x, p.y, PW, PH, G.fakeGoal.x + 4, G.fakeGoal.y - TILE, TILE - 8, TILE * 2)) {
    G.goalRevealed = true;
    die('fakegoal');
    return;
  }

  // progress hook
  G.maxX = Math.max(G.maxX, p.x);
}
function collideAxis(p, axis) {
  const x0 = Math.floor(p.x / TILE), x1 = Math.floor((p.x + PW - 0.01) / TILE);
  const y0 = Math.floor(p.y / TILE), y1 = Math.floor((p.y + PH - 0.01) / TILE);
  for (let ty = y0; ty <= y1; ty++) {
    for (let tx = x0; tx <= x1; tx++) {
      if (!solidAt(tx, ty)) continue;
      const bx = tx * TILE, by = ty * TILE;
      if (!rectsOverlap(p.x, p.y, PW, PH, bx, by, TILE, TILE)) continue;
      // reveal invisible blocks on contact
      if (tileAt(tx, ty) === 'H') {
        const k = key(tx, ty);
        if (!G.tstate[k] || !G.tstate[k].revealed) {
          G.tstate[k] = Object.assign(G.tstate[k] || {}, { revealed: true });
          sfx.pop();
          sayRaw("Invisible block. It was always there. Reality is whatever I say it is.");
        }
      }
      if (axis === 'x') {
        p.x = p.vx > 0 ? bx - PW : bx + TILE;
        p.vx = 0;
      } else {
        if (p.vy > 0) { p.y = by - PH; p.vy = 0; p.onGround = true; }
        else { p.y = by + TILE; p.vy = 0; }
      }
    }
  }
}
function tickStoodTiles(p, dt) {
  if (!p.onGround) return;
  const fy = Math.floor((p.y + PH + 1) / TILE);
  const x0 = Math.floor(p.x / TILE), x1 = Math.floor((p.x + PW - 0.01) / TILE);
  for (let tx = x0; tx <= x1; tx++) {
    const c = tileAt(tx, fy);
    if (c !== 'F' && c !== 'C') continue;
    const k = key(tx, fy);
    const st = G.tstate[k] = G.tstate[k] || { stand: 0, gone: false };
    if (st.gone) continue;
    st.stand += dt;
    const limit = c === 'F' ? 0.25 : 0.38;
    if (st.stand >= limit) {
      st.gone = true;
      sfx.crumb();
      for (let i = 0; i < 8; i++) {
        G.particles.push({
          x: tx * TILE + 15, y: fy * TILE + 15,
          vx: (Math.random() - 0.5) * 200, vy: Math.random() * 180,
          t: 0.5, col: c === 'F' ? '#5a5a78' : '#7a6a50',
        });
      }
    }
  }
}
function checkHazards(p) {
  // tile spikes (forgiving hitbox: 16px wide, 16px tall)
  const x0 = Math.floor(p.x / TILE) - 1, x1 = Math.floor((p.x + PW) / TILE) + 1;
  const y0 = Math.floor(p.y / TILE) - 1, y1 = Math.floor((p.y + PH) / TILE) + 1;
  for (let ty = y0; ty <= y1; ty++) {
    for (let tx = x0; tx <= x1; tx++) {
      const c = tileAt(tx, ty);
      if (c !== '^' && c !== 'v') continue;
      // forgiving hitbox: deaths must feel like the player's fault (it keeps them hooked)
      const sx = tx * TILE + 8, sw = 14;
      const sy = c === '^' ? ty * TILE + 16 : ty * TILE, sh = 14;
      if (rectsOverlap(p.x, p.y, PW, PH, sx, sy, sw, sh)) { die('spike'); return; }
    }
  }
  // saws
  for (const s of G.saws) {
    const cx = Math.max(p.x, Math.min(s.x, p.x + PW));
    const cy = Math.max(p.y, Math.min(s.y, p.y + PH));
    if (Math.hypot(s.x - cx, s.y - cy) < s.r - 2) { die('saw'); return; }
  }
  // troll spikes (deadly once popped)
  for (const t of G.trolls) {
    if (!t.active || t.t < 0.15) continue;
    const sx = t.tx * TILE + 8, sy = t.ty * TILE + 16;
    if (rectsOverlap(p.x, p.y, PW, PH, sx, sy, 14, 14)) { die('troll'); return; }
  }
}
function updateSaws(dt) {
  const speedMul = 1 + G.levelIdx * 0.08; // sadistic escalation
  for (const s of G.saws) {
    s.spin += dt * 12;
    const v = 130 * speedMul * s.dir * dt;
    if (s.axis === 'h') {
      s.x += v;
      const ntx = Math.floor((s.x + s.dir * s.r) / TILE), nty = Math.floor(s.y / TILE);
      if (s.x - s.r < 0 || s.x + s.r > W || solidAt(ntx, nty)) { s.dir *= -1; s.x += 130 * speedMul * s.dir * dt * 2; }
    } else {
      s.y += v;
      const ntx = Math.floor(s.x / TILE), nty = Math.floor((s.y + s.dir * s.r) / TILE);
      if (s.y - s.r < 0 || s.y + s.r > H || solidAt(ntx, nty)) { s.dir *= -1; s.y += 130 * speedMul * s.dir * dt * 2; }
    }
  }
}
function updateTrolls(dt) {
  if (G.mode !== 'play') return;
  const p = G.player;
  for (const t of G.trolls) {
    if (t.active) { t.t += dt; continue; }
    const d = Math.hypot(t.tx * TILE + 15 - (p.x + PW / 2), t.ty * TILE + 15 - (p.y + PH / 2));
    if (d < 95) { t.active = true; t.t = 0; sfx.pop(); }
  }
}
function updateParticles(dt) {
  for (let i = G.particles.length - 1; i >= 0; i--) {
    const q = G.particles[i];
    q.t -= dt; q.x += q.vx * dt; q.y += q.vy * dt; q.vy += 900 * dt;
    if (q.t <= 0) G.particles.splice(i, 1);
  }
  for (let i = G.confetti.length - 1; i >= 0; i--) {
    const c = G.confetti[i];
    c.y += c.vy * dt; c.x += c.vx * dt + Math.sin(G.time * 3 + i) * 0.6; c.rot += c.vr * dt;
    if (c.y > H + 30) { c.y = -20; c.x = Math.random() * W; }
  }
}

/* ============================ RENDER ===================================== */
function render() {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, W, H);
  // bg
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, '#10101c'); bg.addColorStop(1, '#0b0b12');
  ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = 'rgba(255,255,255,0.025)';
  for (let x = 0; x <= COLS; x++) { ctx.beginPath(); ctx.moveTo(x * TILE, 0); ctx.lineTo(x * TILE, H); ctx.stroke(); }
  for (let y = 0; y <= ROWS; y++) { ctx.beginPath(); ctx.moveTo(0, y * TILE); ctx.lineTo(W, y * TILE); ctx.stroke(); }

  if (G.shake > 0) {
    ctx.translate((Math.random() - 0.5) * 10 * G.shake * 3, (Math.random() - 0.5) * 10 * G.shake * 3);
  }

  if (G.mode !== 'title') {
    drawTiles();
    drawGoals();
    drawSaws();
    drawTrolls();
    if (!G.dead && (G.mode === 'play' || G.mode === 'clear')) drawPlayer();
    drawParticlesFx();
    drawDarkness();
    drawHUD();
  }
  drawConfetti();
  drawBanner();
  drawFlash();
}
function drawTiles() {
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      const c = G.grid[y][x], px = x * TILE, py = y * TILE;
      if (c === '#') drawBlock(px, py, '#3a3a55', '#4d4d70');
      else if (c === 'F') {
        const st = G.tstate[key(x, y)];
        if (!st || !st.gone) drawBlock(px, py, '#38384f', '#4a4a68'); // imperceptibly darker. mostly.
      } else if (c === 'C') {
        const st = G.tstate[key(x, y)];
        if (!st || !st.gone) {
          const wob = st && st.stand > 0 ? Math.sin(G.time * 60) * 1.5 : 0;
          drawBlock(px + wob, py, '#55492f', '#6e5e3e');
          ctx.strokeStyle = '#2c2517'; ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(px + 6 + wob, py + 4); ctx.lineTo(px + 14 + wob, py + 16); ctx.lineTo(px + 9 + wob, py + 27);
          ctx.moveTo(px + 22 + wob, py + 2); ctx.lineTo(px + 18 + wob, py + 14);
          ctx.stroke();
        }
      } else if (c === 'H') {
        const st = G.tstate[key(x, y)];
        if (st && st.revealed) {
          drawBlock(px, py, '#503a5a', '#6b4d78');
          ctx.fillStyle = '#c9a0e0'; ctx.font = 'bold 16px monospace';
          ctx.fillText('?', px + 11, py + 21);
        }
      } else if (c === '^') drawSpike(px, py, false);
      else if (c === 'v') drawSpike(px, py, true);
    }
  }
}
function drawBlock(px, py, base, top) {
  ctx.fillStyle = base; ctx.fillRect(px, py, TILE, TILE);
  ctx.fillStyle = top; ctx.fillRect(px, py, TILE, 5);
  ctx.strokeStyle = 'rgba(0,0,0,0.35)'; ctx.strokeRect(px + 0.5, py + 0.5, TILE - 1, TILE - 1);
}
function drawSpike(px, py, down) {
  ctx.fillStyle = '#c8344e';
  ctx.beginPath();
  if (!down) { ctx.moveTo(px + 2, py + TILE); ctx.lineTo(px + TILE / 2, py + 6); ctx.lineTo(px + TILE - 2, py + TILE); }
  else { ctx.moveTo(px + 2, py); ctx.lineTo(px + TILE / 2, py + TILE - 6); ctx.lineTo(px + TILE - 2, py); }
  ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#ff5570';
  ctx.beginPath();
  if (!down) { ctx.moveTo(px + 8, py + TILE); ctx.lineTo(px + TILE / 2, py + 12); ctx.lineTo(px + TILE / 2 + 3, py + TILE); }
  else { ctx.moveTo(px + 8, py); ctx.lineTo(px + TILE / 2, py + TILE - 12); ctx.lineTo(px + TILE / 2 + 3, py); }
  ctx.closePath(); ctx.fill();
}
function drawGoals() {
  const drawDoor = (gx, gy, flickering) => {
    if (flickering && Math.floor(G.time * 2.2) % 5 === 0 && Math.floor(G.time * 30) % 4 === 0) return; // subtle tell
    ctx.fillStyle = '#1c4029'; ctx.fillRect(gx + 2, gy - TILE, TILE - 4, TILE * 2);
    ctx.fillStyle = '#2f7a48'; ctx.fillRect(gx + 5, gy - TILE + 3, TILE - 10, TILE * 2 - 6);
    ctx.fillStyle = '#9fffc4'; ctx.fillRect(gx + TILE - 11, gy + 4, 4, 4);
    const glow = 0.25 + Math.sin(G.time * 4) * 0.12;
    ctx.fillStyle = 'rgba(80,255,140,' + glow + ')';
    ctx.fillRect(gx - 3, gy - TILE - 4, TILE + 6, TILE * 2 + 8);
  };
  if (G.goal && G.goalRevealed) drawDoor(G.goal.x, G.goal.y, false);
  else if (G.goal && !G.goalRevealed) { // bricked-up exit
    drawBlock(G.goal.x, G.goal.y, '#33334a', '#444460');
    drawBlock(G.goal.x, G.goal.y - TILE, '#33334a', '#444460');
  }
  if (G.fakeGoal) drawDoor(G.fakeGoal.x, G.fakeGoal.y, true);
}
function drawSaws() {
  for (const s of G.saws) {
    ctx.save();
    ctx.translate(s.x, s.y); ctx.rotate(s.spin);
    ctx.fillStyle = '#aab0c8';
    ctx.beginPath();
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      ctx.lineTo(Math.cos(a) * (s.r + 4), Math.sin(a) * (s.r + 4));
      ctx.lineTo(Math.cos(a + 0.39) * s.r * 0.7, Math.sin(a + 0.39) * s.r * 0.7);
    }
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#666e88'; ctx.beginPath(); ctx.arc(0, 0, s.r * 0.45, 0, 7); ctx.fill();
    ctx.restore();
  }
}
function drawTrolls() {
  for (const t of G.trolls) {
    if (!t.active) continue;
    const k = Math.min(1, t.t / 0.15);
    const px = t.tx * TILE, py = t.ty * TILE + (1 - k) * TILE;
    ctx.save();
    ctx.beginPath(); ctx.rect(t.tx * TILE, t.ty * TILE, TILE, TILE); ctx.clip();
    drawSpike(px, py, false);
    ctx.restore();
  }
}
function drawPlayer() {
  const p = G.player;
  ctx.fillStyle = '#3ddcff';
  ctx.fillRect(p.x, p.y, PW, PH);
  ctx.fillStyle = '#bff2ff';
  ctx.fillRect(p.x, p.y, PW, 4);
  // battle damage with session deaths
  if (G.deaths >= 20) { ctx.strokeStyle = 'rgba(0,0,0,0.4)'; ctx.beginPath(); ctx.moveTo(p.x + 4, p.y + 8); ctx.lineTo(p.x + 9, p.y + 16); ctx.stroke(); }
  if (G.deaths >= 60) { ctx.fillStyle = '#e8b08a'; ctx.fillRect(p.x + 12, p.y + 18, 8, 4); }
  // eyes
  const ex = p.face > 0 ? 4 : -4;
  ctx.fillStyle = '#fff';
  ctx.fillRect(p.x + 4, p.y + 8, 6, 7); ctx.fillRect(p.x + 12, p.y + 8, 6, 7);
  ctx.fillStyle = '#101020';
  ctx.fillRect(p.x + 5 + ex / 2, p.y + 10, 3, 4); ctx.fillRect(p.x + 13 + ex / 2, p.y + 10, 3, 4);
}
function drawParticlesFx() {
  for (const q of G.particles) {
    ctx.globalAlpha = Math.max(0, Math.min(1, q.t * 2));
    ctx.fillStyle = q.col;
    ctx.fillRect(q.x - 3, q.y - 3, 6, 6);
  }
  ctx.globalAlpha = 1;
}
function drawDarkness() {
  const mod = LEVELS[G.levelIdx] && LEVELS[G.levelIdx].modifier;
  const darkOn = mod === 'dark' || (mod === 'chaos' && G.darkPulse > 0);
  if (!darkOn || G.mode === 'clear') return;
  const p = G.player;
  const cx = p.x + PW / 2, cy = p.y + PH / 2;
  const rad = ctx.createRadialGradient(cx, cy, 60, cx, cy, 175);
  rad.addColorStop(0, 'rgba(4,4,10,0)');
  rad.addColorStop(1, 'rgba(4,4,10,0.985)');
  ctx.fillStyle = rad;
  ctx.fillRect(0, 0, W, H);
  if (G.invertActive) { ctx.fillStyle = 'rgba(160,60,200,0.05)'; ctx.fillRect(0, 0, W, H); }
}
function drawHUD() {
  const lv = LEVELS[G.levelIdx];
  ctx.font = 'bold 13px monospace';
  ctx.fillStyle = '#8a8aa0';
  ctx.fillText('LV ' + (G.levelIdx + 1) + '/' + LEVELS.length + ' — ' + lv.name, 12, 20);
  ctx.fillStyle = '#ff3355';
  ctx.fillText('☠ ' + G.deaths + ' (lifetime: ' + G.lifeDeaths + ')', 12, 38);
  const secs = Math.floor((performance.now() - G.startTime) / 1000);
  ctx.fillStyle = '#8a8aa0';
  ctx.fillText('⏱ ' + Math.floor(secs / 60) + ':' + String(secs % 60).padStart(2, '0'), 12, 56);
  // best-progress bar (the hook)
  if (G.goal) {
    const denom = Math.max(1, (G.goalRevealed ? G.goal.x : (G.fakeGoal ? G.fakeGoal.x : G.goal.x)));
    const prog = Math.min(1, G.maxX / denom);
    ctx.fillStyle = '#22223a'; ctx.fillRect(W - 192, 14, 180, 10);
    ctx.fillStyle = '#ffcc00'; ctx.fillRect(W - 192, 14, 180 * prog, 10);
    ctx.fillStyle = '#8a8aa0'; ctx.fillText('BEST RUN ' + Math.round(prog * 100) + '%', W - 192, 38);
  }
  if (G.muted) { ctx.fillStyle = '#555570'; ctx.fillText('[M] muted', W - 192, 56); }
  if (G.invertActive) {
    // the tell is one faint character. gaslighting with plausible deniability.
    ctx.fillStyle = 'rgba(200,120,255,0.35)'; ctx.fillText('~', W / 2 - 4, 20);
  }
}
function drawConfetti() {
  for (const c of G.confetti) {
    ctx.save();
    ctx.translate(c.x, c.y); ctx.rotate(c.rot);
    ctx.fillStyle = c.col;
    ctx.fillRect(-c.w / 2, -c.w / 2, c.w, c.w * 1.6);
    ctx.restore();
  }
}
function drawBanner() {
  if (!G.banner || G.mode === 'title') return;
  const a = Math.min(1, G.banner.t * 3, (3.2 - G.banner.t) * 5);
  ctx.globalAlpha = Math.max(0, a);
  ctx.font = 'bold 16px monospace';
  const tw = ctx.measureText(G.banner.text).width;
  const bx = W / 2 - tw / 2 - 14, by = 64;
  ctx.fillStyle = 'rgba(10,10,18,0.92)';
  ctx.fillRect(bx, by, tw + 28, 34);
  ctx.strokeStyle = '#ff3355'; ctx.strokeRect(bx + 0.5, by + 0.5, tw + 27, 33);
  ctx.fillStyle = '#ffd9e0';
  ctx.fillText(G.banner.text, W / 2 - tw / 2, by + 22);
  ctx.globalAlpha = 1;
}
function drawFlash() {
  if (!G.flash || G.mode === 'title') return;
  const k = G.flash.t / 2.2;
  ctx.globalAlpha = Math.min(1, k * 4);
  const scale = 1 + (1 - Math.min(1, (2.2 - G.flash.t) * 6)) * 0.6;
  ctx.save();
  ctx.translate(W / 2, H / 2 - 40); ctx.scale(scale, scale);
  ctx.font = 'bold 40px monospace';
  ctx.textAlign = 'center';
  ctx.fillStyle = '#000'; ctx.fillText(G.flash.text, 3, 3);
  ctx.fillStyle = '#ffcc00'; ctx.fillText(G.flash.text, 0, 0);
  if (G.flash.sub) {
    ctx.font = 'bold 15px monospace';
    ctx.fillStyle = '#ffd9e0'; ctx.fillText(G.flash.sub, 0, 34);
  }
  ctx.restore();
  ctx.textAlign = 'left';
  ctx.globalAlpha = 1;
}

/* ============================ DOM OVERLAYS =============================== */
function show(html) { overlay.innerHTML = html; overlay.classList.add('visible'); }
function hide() { overlay.classList.remove('visible'); overlay.innerHTML = ''; }

function showTitle() {
  G.mode = 'title';
  const life = G.lifeDeaths;
  const wins = G.wins;
  const fled = store.get('fled', false);
  let welcome = "A precision platformer that believes in you slightly less than you do.";
  if (fled) welcome = "<span class='roast'>You closed the tab mid-level last time. We both know why. Anyway — welcome back.</span>";
  else if (wins > 0) welcome = "<span class='roast'>A returning champion. Here to prove the first win wasn't luck? It was.</span>";
  else if (life > 0) welcome = "<span class='roast'>Welcome back, " + esc(G.name || 'you') + ". Lifetime deaths: " + life + ". The spikes kept your spot warm.</span>";
  store.set('fled', false);
  show(
    "<div class='panel'>" +
    "<h1>YOU SUCK AT THIS™</h1>" +
    "<div class='sub'>a love letter to your inadequacy</div>" +
    "<p>" + welcome + "</p>" +
    "<p>Enter your name so I can disappoint you <i>personally</i>:</p>" +
    "<input id='nameIn' type='text' maxlength='14' placeholder='your future regret' value='" + esc(G.name) + "'>" +
    "<div class='diff'>DIFFICULTY: <span class='locked'>Easy</span> <span class='locked'>Normal</span> <span class='only'>[ THE ONLY MODE ]</span></div>" +
    "<button id='startBtn'>I CONSENT TO EMOTIONAL DAMAGE</button>" +
    "<div class='keys'>←→/AD move · SPACE jump · R restart (costs a death) · M mute · ESC begs for mercy</div>" +
    "<div class='tiny'>7 levels. No checkpoints. No excuses. All insults aimed at your gameplay are aimed at your gameplay.</div>" +
    "</div>"
  );
  const btn = document.getElementById('startBtn');
  const inp = document.getElementById('nameIn');
  inp.addEventListener('keydown', e => { e.stopPropagation(); if (e.key === 'Enter') btn.click(); });
  btn.addEventListener('click', () => {
    G.name = (inp.value.trim() || 'champ').slice(0, 14);
    store.set('name', G.name);
    audio();
    fakeLoading();
  });
}
function fakeLoading() {
  show(
    "<div class='panel'><h2>LOADING…</h2>" +
    "<p id='loadLine'>Loading your skill profile…</p></div>"
  );
  setTimeout(() => {
    const el = document.getElementById('loadLine');
    if (el) el.innerHTML = "Skill profile: <span class='roast'>NOT FOUND.</span> Starting anyway.";
  }, 800);
  setTimeout(() => {
    G.deaths = 0; G.rageQuits = 0; G.comebacks = 0; G.rageHeat = 0;
    G.startTime = performance.now();
    G.confetti.length = 0;
    startLevel(0);
  }, 1700);
}
function startLevel(idx) {
  loadLevel(idx);
  const lv = LEVELS[idx];
  G.mode = 'intro';
  show(
    "<div class='panel'>" +
    "<h2>LEVEL " + (idx + 1) + "/" + LEVELS.length + ": " + lv.name + "</h2>" +
    "<p>" + lv.intro + "</p>" +
    "<button id='goBtn'>" + (idx === 0 ? "BEGIN" : "CONTINUE SUFFERING") + "</button>" +
    "</div>"
  );
  document.getElementById('goBtn').addEventListener('click', () => {
    hide();
    G.mode = 'play';
    G.levelStart = performance.now();
    G.spawnTime = performance.now();
    G.lastInput = G.time;
    G.idleWarned = false;
  });
}
function showClear() {
  const lv = LEVELS[G.levelIdx];
  const secs = Math.floor((performance.now() - G.levelStart) / 1000);
  const fakeAvg = 1 + Math.floor(Math.random() * 4);
  const fakePct = 3 + Math.floor(Math.random() * 7);
  let zinger;
  if (G.deathlessLevel) zinger = "<span class='roast'>Wait. ZERO deaths? Who are you and what have you done with " + esc(G.name) + "?</span>";
  else if (G.levelDeaths <= 3) zinger = "<span class='roast'>Only " + G.levelDeaths + " deaths. Suspiciously competent. I'll fix that.</span>";
  else zinger = "<span class='roast'>" + esc(lv.clear) + "</span>";
  show(
    "<div class='panel'>" +
    "<h2>LEVEL " + (G.levelIdx + 1) + " CLEARED</h2>" +
    "<div class='stats'>" +
    "<div>Your deaths: <b>" + G.levelDeaths + "</b></div>" +
    "<div>Global average*: <b>" + fakeAvg + "</b></div>" +
    "<div>Your time: <b>" + secs + "s</b> &nbsp;(bottom <b>" + fakePct + "%</b> worldwide*)</div>" +
    "</div>" +
    "<p>" + zinger + "</p>" +
    "<button id='nextBtn'>NEXT (it gets worse)</button>" +
    "<div class='tiny'>*statistics provided by the Department of Made Up Numbers</div>" +
    "</div>"
  );
  document.getElementById('nextBtn').addEventListener('click', () => {
    startLevel(G.levelIdx + 1);
  });
}
function showVictory() {
  const secs = Math.floor((performance.now() - G.startTime) / 1000);
  const mins = Math.floor(secs / 60), rem = secs % 60;
  const d = G.deaths;
  let rank, roast;
  if (d < 30)       { rank = 'S'; roast = "Under 30 deaths. Either you're a savant or you practiced in secret. I'm not even mad. I'm disgusted."; }
  else if (d < 60)  { rank = 'A'; roast = "Genuinely solid. I built those traps with love and you disrespected every single one."; }
  else if (d < 100) { rank = 'B'; roast = "You got there. Like a shopping cart with one bad wheel gets there. But you got there."; }
  else if (d < 150) { rank = 'C'; roast = "The spikes will tell their kids about you. As a cautionary tale, but still."; }
  else if (d < 250) { rank = 'D'; roast = d + " deaths. The game didn't beat you. You beat you. Repeatedly. I just watched."; }
  else              { rank = 'F'; roast = d + " deaths and you STILL didn't quit. That's not skill, that's a hostage situation. You won anyway."; }
  const shareText = "I beat YOU SUCK AT THIS™ in " + mins + "m" + rem + "s with " + d + " deaths (rank " + rank + "). " +
                    "It insulted me " + (d + 12) + " times and I still won. Your turn. I need to watch someone else suffer.";
  show(
    "<div class='panel'>" +
    "<h1>YOU. ACTUALLY. WON.</h1>" +
    "<div class='sub'>nobody is more surprised than me</div>" +
    "<div class='rank'>" + rank + "</div>" +
    "<div class='stats'>" +
    "<div>Deaths: <b>" + d + "</b> &nbsp; Time: <b>" + mins + "m " + rem + "s</b></div>" +
    "<div>Rage-quit attempts detected: <b>" + G.rageQuits + "</b> &nbsp; Crawls back: <b>" + G.comebacks + "</b></div>" +
    "<div>Lifetime deaths: <b>" + G.lifeDeaths + "</b> &nbsp; Total wins: <b>" + G.wins + "</b></div>" +
    "</div>" +
    "<p class='roast'>" + roast + "</p>" +
    "<p>Every insult, every fake platform, every \"accidental\" spike — you ate all of it and finished anyway. " +
    "That's the joke, " + esc(G.name) + ": the game was never unbeatable. You just had to want it more than you wanted your dignity. You did. Respect.</p>" +
    "<button id='shareBtn'>COPY YOUR BRAG</button>" +
    "<button id='againBtn' class='ghost'>PLAY AGAIN (why?)</button>" +
    "<div class='tiny'>recommend it to a friend you respect slightly less than yourself</div>" +
    "</div>"
  );
  document.getElementById('shareBtn').addEventListener('click', e => {
    try { navigator.clipboard.writeText(shareText); } catch (err) {}
    e.target.textContent = "COPIED. GO GLOAT.";
  });
  document.getElementById('againBtn').addEventListener('click', () => {
    G.confetti.length = 0;
    showTitle();
  });
}
function esc(s) {
  return String(s || '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

/* ============================ INPUT ====================================== */
window.addEventListener('keydown', e => {
  if (overlay.classList.contains('visible') && e.target.tagName === 'INPUT') return;
  const c = e.code;
  if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'Space', 'KeyA', 'KeyD', 'KeyW'].includes(c)) e.preventDefault();
  if (c === 'ArrowLeft' || c === 'KeyA') keys.left = true;
  if (c === 'ArrowRight' || c === 'KeyD') keys.right = true;
  if (c === 'Space' || c === 'ArrowUp' || c === 'KeyW') {
    if (!keys.jump) keys.jumpPressed = true;
    keys.jump = true;
  }
  if (c === 'KeyM') { G.muted = !G.muted; store.set('muted', G.muted); }
  if (G.mode === 'play') {
    G.lastInput = G.time; G.idleWarned = false;
    if (c === 'KeyR') die('restart');
    if (c === 'Escape') sayRaw("There is no pause. Suffering waits for no one.");
  }
});
window.addEventListener('keyup', e => {
  const c = e.code;
  if (c === 'ArrowLeft' || c === 'KeyA') keys.left = false;
  if (c === 'ArrowRight' || c === 'KeyD') keys.right = false;
  if (c === 'Space' || c === 'ArrowUp' || c === 'KeyW') keys.jump = false;
});

/* ===================== RAGE-QUIT SURVEILLANCE ============================ */
let hiddenAt = 0;
document.addEventListener('visibilitychange', () => {
  if (G.mode !== 'play' && G.mode !== 'dead') return;
  if (document.hidden) {
    hiddenAt = performance.now();
    G.rageQuits++;
  } else {
    G.comebacks++;
    const away = (performance.now() - hiddenAt) / 1000;
    if (away > 3) say('back');
    else sayRaw("Checking your messages won't unspike the spikes.");
  }
});
window.addEventListener('beforeunload', () => {
  if (G.mode === 'play' || G.mode === 'dead') store.set('fled', true);
});

/* ============================ MAIN LOOP ================================== */
let last = performance.now();
function loop(now) {
  const dt = Math.min(1 / 30, (now - last) / 1000);
  last = now;
  update(dt);
  render();
  requestAnimationFrame(loop);
}
showTitle();
requestAnimationFrame(loop);
