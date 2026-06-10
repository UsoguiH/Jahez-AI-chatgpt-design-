/* سِراج — pixel sprite factory (all art generated in-code, Moonlighter-style readability) */

const PAL = {
  k: '#1d1410', // outline / black
  w: '#f4ead2', // white cloth
  W: '#ffffff',
  f: '#e0b088', // skin
  F: '#c98f64', // skin shade
  e: '#2a1c10', // eyes
  t: '#efe6cf', // thobe
  T: '#d8cbab', // thobe shade
  b: '#6b4226', // brown / bisht
  B: '#4a2c18', // dark brown
  g: '#caa14a', // gold trim
  G: '#f4b942', // bright gold / amber
  r: '#a83232', // sadu red
  o: '#d97b29', // sadu orange
  s: '#c9a36a', // sandstone
  S: '#a37c4a', // sandstone shade
  c: '#3ec9a2', // teal glow
  C: '#1d7a64', // teal dark
  p: '#7b6ba8', // spirit purple
  P: '#4a3f73', // spirit dark
  d: '#5a5468', // stone gray
  D: '#3a3547', // stone dark
  n: '#23203b', // night dark
  v: '#8a5a34', // wood light
  x: '#39588f', // kid blue
  X: '#27406b',
  m: '#4a6741', // green bisht
  M: '#33492c',
  q: '#caC0e8', // pale glow  (lower q)
  y: '#e8e0f8', // ghost pale
};
PAL.q = '#cac0e8';

function makeSprite(rows, scale = 1) {
  const h = rows.length, w = rows[0].length;
  const cv = document.createElement('canvas');
  cv.width = w * scale; cv.height = h * scale;
  const c = cv.getContext('2d');
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const ch = rows[y][x];
    if (ch === '.' || ch === ' ') continue;
    c.fillStyle = PAL[ch] || '#f0f';
    c.fillRect(x * scale, y * scale, scale, scale);
  }
  return cv;
}

/* ---------- characters (12 x 16) ---------- */
const SPR_SRC = {};

SPR_SRC.player = [ // merchant: white ghutra + black agal + cream thobe
  '....kkkk....',
  '...kwwwwk...',
  '..kkkkkkkk..',
  '..kwffffwk..',
  '..kwfefefk..',
  '..kwffffwk..',
  '...kwwwwk...',
  '....kttk....',
  '...kttttk...',
  '..kttttttk..',
  '..kttTTttk..',
  '..kttttttk..',
  '..kttttttk..',
  '...ktkkts...',
  '...ktk.ktk..',
  '...kk...kk..',
];

SPR_SRC.playerNight = [ // + sadu satchel strap and belt
  '....kkkk....',
  '...kwwwwk...',
  '..kkkkkkkk..',
  '..kwffffwk..',
  '..kwfefefk..',
  '..kwffffwk..',
  '...kwwwwk...',
  '....ktrk....',
  '...ktrttk...',
  '..ktrttttk..',
  '..kttrTttk..',
  '..krororok..',
  '..kttttrtk..',
  '...ktkktrk..',
  '...ktk.ktk..',
  '...kk...kk..',
];

SPR_SRC.cust_um = [ // أم العيال — black abaya
  '....kkkk....',
  '...kkkkkk...',
  '..kkkffkkk..',
  '..kkfefefk..',
  '..kkkffkkk..',
  '...kkkkkk...',
  '...kkkkkk...',
  '..kkkkkkkk..',
  '..kkkkkkkk..',
  '..kkknnkkk..',
  '..kkkkkkkk..',
  '..kkkkkkkk..',
  '..kkkkkkkk..',
  '...kkkkkk...',
  '...kk..kk...',
  '...kk..kk...',
];

SPR_SRC.cust_elder = [ // الختيار — bisht + white beard
  '....kkkk....',
  '...kwwwwk...',
  '..kkkkkkkk..',
  '..kwffffwk..',
  '..kwfefefk..',
  '..kwwwwwwk..',
  '...kwwwwk...',
  '...kbttbk...',
  '..kbttttbk..',
  '..kbtggtbk..',
  '..kbttttbk..',
  '..kbttttbk..',
  '..kbttttbk..',
  '...kbkkbk...',
  '...ktk.ktk..',
  '...kk...kk..',
];

SPR_SRC.cust_kid = [ // الصبي — small blue thobe
  '............',
  '............',
  '....kkkk....',
  '...kffffk...',
  '...kfefek...',
  '...kffffk...',
  '....kxxk....',
  '...kxxxxk...',
  '..kxxxxxxk..',
  '..kxxXXxxk..',
  '..kxxxxxxk..',
  '...kxkkxk...',
  '...kxk.kxk..',
  '...kk...kk..',
  '............',
  '............',
];

SPR_SRC.cust_collector = [ // الطوّاش — green bisht with gold
  '....kkkk....',
  '...kwwwwk...',
  '..kkkkkkkk..',
  '..kwffffwk..',
  '..kwfefefk..',
  '..kwffffwk..',
  '...kwwwwk...',
  '...kmttmk...',
  '..kmgttgmk..',
  '..kmtggtmk..',
  '..kmgttgmk..',
  '..kmttttmk..',
  '..kmttttmk..',
  '...kmkkmk...',
  '...ktk.ktk..',
  '...kk...kk..',
];

SPR_SRC.cust_traveler = [ // عابر السبيل — dusty robe + turban
  '....bbbb....',
  '...bsssssb..',
  '..bsbbbbsb..',
  '..kbffffbk..',
  '..kbfefefk..',
  '..kbffffbk..',
  '...kbssbk...',
  '...ksssbk...',
  '..kssssssk..',
  '..kssbbssk..',
  '..kssssssk..',
  '..kssssssk..',
  '..kssssssk..',
  '...kskksk...',
  '...ksk.ksk..',
  '...kk...kk..',
];

SPR_SRC.cust_night = [ // زبون الليل — hooded, glowing eyes
  '....PPPP....',
  '...PPPPPP...',
  '..PPnnnnPP..',
  '..PnncncnP..',
  '..PnnnnnnP..',
  '...PnnnnP...',
  '...PPPPPP...',
  '..PPPPPPPP..',
  '..PPPnnPPP..',
  '..PPnPPnPP..',
  '..PPPPPPPP..',
  '..PPPPPPPP..',
  '..PPPPPPPP..',
  '...PPPPPP...',
  '...PP..PP...',
  '............',
];

/* ---------- enemies ---------- */
SPR_SRC.wraith = [ // طيف الرمل — sand wraith
  '....pppp....',
  '...pyyyyp...',
  '..pyyyyyyp..',
  '..pycyycyp..',
  '..pyyyyyyp..',
  '..pyyPPyyp..',
  '...pyyyyp...',
  '..pyyyyyyp..',
  '..pyypyypp..',
  '...pyp.pyp..',
  '....p...p...',
  '............',
];

SPR_SRC.beetle = [ // خنفساء المقابر
  '............',
  '..k......k..',
  '...k.kk.k...',
  '..kDDDDDDk..',
  '.kDdcddcdDk.',
  '.kDddddddDk.',
  '.kDDdddDDDk.',
  '..kDDDDDDk..',
  '...k.kk.k...',
  '..k......k..',
];

SPR_SRC.falconStone = [ // صقر حجري
  '..k.......k...',
  '.kdk.....kdk..',
  'kdddk...kdddk.',
  'kddddkkkddddk.',
  '.kddddddddddk.',
  '..kdcddddcdk..',
  '...kddddddk...',
  '....kddddk....',
  '.....kddk.....',
  '......kk......',
];

SPR_SRC.guardian = [ // حارس الواجهة — boss
  '......kkkkkk......',
  '.....kssssssk.....',
  '....kssSSSSssk....',
  '....ksScssScsk....',
  '....kssSSSSssk....',
  '.....kssssssk.....',
  '....kkkssskkkk....',
  '...kssksssksssk...',
  '..kssskdddksssk...',
  '.kssk.kdddk.kssk..',
  '.ksk..kdddk..ksk..',
  '.kk..ksssssk..kk..',
  '.....kssSssk......',
  '....kssskssk......',
  '....kssk.kssk.....',
  '...kssk...kssk....',
  '...kssk...kssk....',
  '..kSSk.....kSSk...',
];

/* ---------- item icons (10x10) ---------- */
SPR_SRC.icon_dates = [
  '....kk....',
  '...kggk...',
  '..kbBbbk..',
  '.kbBbBbbk.',
  '.kBbbbBbk.',
  '.kbBbBbbk.',
  '.kbbBbBbk.',
  '..kbbbbk..',
  '...kbbk...',
  '....kk....',
];
SPR_SRC.icon_bukhoor = [
  '...c..c...',
  '..c..c....',
  '...c..c...',
  '..kkkkkk..',
  '.kGGGGGGk.',
  '.kgGGGGgk.',
  '..kggggk..',
  '..kbBBbk..',
  '.kbbbbbbk.',
  '..kkkkkk..',
];
SPR_SRC.icon_oud = [
  '....kk....',
  '...kggk...',
  '...kggk...',
  '..kGGGGk..',
  '.kGgggGGk.',
  '.kGgGGgGk.',
  '.kGgggGGk.',
  '.kGGGGGGk.',
  '..kGGGGk..',
  '...kkkk...',
];
SPR_SRC.icon_manuscript = [
  '..kkkkkk..',
  '.kwwwwwwk.',
  '.kwBBBwwk.',
  '.kwwwwwwk.',
  '.kwBBBBwk.',
  '.kwwwwwwk.',
  '.kwBBwwwk.',
  '.kwwwwwwk.',
  '.kwwwwgwk.',
  '..kkkkkk..',
];
SPR_SRC.icon_frank = [
  '..........',
  '...k..k...',
  '..kGk kGk.',
  '.kGGGkGGk.',
  '.kGgGGgGk.',
  '..kGGGGk..',
  '.kGgGGGGk.',
  '.kGGGgGk..',
  '..kkkkk...',
  '..........',
];
SPR_SRC.icon_stone = [
  '..kkkkkk..',
  '.kssssssk.',
  '.ksCssCsk.',
  '.kssssssk.',
  '.ksCCCssk.',
  '.kssssssk.',
  '.ksCssCsk.',
  '.kssSsssk.',
  '.kSssssSk.',
  '..kkkkkk..',
];
SPR_SRC.icon_sadu = [
  '.kkkkkkkk.',
  '.krrrrrrk.',
  '.kkokkokk.',
  '.krrrrrrk.',
  '.kowkkwok.',
  '.krrrrrrk.',
  '.kkokkokk.',
  '.krrrrrrk.',
  '.kkkkkkkk.',
  '..........',
];
SPR_SRC.icon_dagger = [
  '.......kk.',
  '......kgk.',
  '.....kgk..',
  '....kwk...',
  '...kwwk...',
  '..kwwk....',
  '.kwwk.....',
  'kgggk.....',
  'kgkgk.....',
  '.kk.kk....',
];
SPR_SRC.icon_silver = [
  '...kkkk...',
  '..kWWWWk..',
  '.kWqqqqWk.',
  '.kWqWWqWk.',
  '.kWqqqqWk.',
  '..kWWWWk..',
  '...kWWk...',
  '..kWWWWk..',
  '..kkkkkk..',
  '..........',
];
SPR_SRC.icon_coffee = [
  '..........',
  '..k.kk.k..',
  '..kkbbkk..',
  '.kbBbbBbk.',
  '.kbbBBbbk.',
  '.kBbbbbBk.',
  '..kbBBbk..',
  '...kbbk...',
  '....kk....',
  '..........',
];
SPR_SRC.icon_tablet = [
  '..kkkkkk..',
  '.kSSSSSSk.',
  '.kScccSSk.',
  '.kSSSSSSk.',
  '.kSccSSck.',
  '.kSSSSSSk.',
  '.kSScccSk.',
  '.kSSSSSSk.',
  '.kSSSSSSk.',
  '..kkkkkk..',
];
SPR_SRC.icon_censer = [
  '....cc....',
  '...c..c...',
  '....c.....',
  '...kkkk...',
  '..kGggGk..',
  '.kGgggGGk.',
  '.kGGGGGGk.',
  '..kGGGGk..',
  '...kBBk...',
  '..kBBBBk..',
];
SPR_SRC.icon_potion = [
  '....kk....',
  '...kwwk...',
  '....kk....',
  '...kcck...',
  '..kccccck.',
  '.kcCccCck.',
  '.kccCCcck.',
  '.kcccccck.',
  '..kcccck..',
  '...kkkk...',
];

const SPR = {};
function buildSprites() {
  for (const key in SPR_SRC) SPR[key] = makeSprite(SPR_SRC[key], 4);
}

/* draw sprite centered at x, bottom at y (world chars), with optional flip/flash */
function drawSpr(ctx, spr, cx, by, opts = {}) {
  const w = spr.width, h = spr.height;
  ctx.save();
  if (opts.alpha != null) ctx.globalAlpha = opts.alpha;
  ctx.translate(cx, by);
  if (opts.flip) ctx.scale(-1, 1);
  if (opts.flash) { ctx.filter = 'brightness(2.2) saturate(0)'; }
  ctx.drawImage(spr, -w / 2, -h, w, h);
  ctx.restore();
}

/* shadow ellipse */
function drawShadow(ctx, x, y, r = 16) {
  ctx.save();
  ctx.fillStyle = 'rgba(0,0,0,.3)';
  ctx.beginPath();
  ctx.ellipse(x, y, r, r * 0.4, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

/* reaction bubble: mood in {love, happy, think, angry, coin} */
function drawBubble(ctx, x, y, mood) {
  ctx.save();
  ctx.fillStyle = '#fffdf2';
  ctx.strokeStyle = PAL.k;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(x, y, 20, 0, Math.PI * 2);
  ctx.fill(); ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x - 6, y + 17); ctx.lineTo(x, y + 28); ctx.lineTo(x + 6, y + 17);
  ctx.closePath(); ctx.fillStyle = '#fffdf2'; ctx.fill();
  ctx.strokeStyle = PAL.k; ctx.lineWidth = 2;

  ctx.fillStyle = PAL.k;
  if (mood === 'happy' || mood === 'love') {
    ctx.fillRect(x - 9, y - 7, 4, 6); ctx.fillRect(x + 5, y - 7, 4, 6);
    ctx.beginPath(); ctx.arc(x, y + 3, 8, 0.15 * Math.PI, 0.85 * Math.PI); ctx.lineWidth = 3; ctx.stroke();
    if (mood === 'love') { ctx.fillStyle = PAL.r; ctx.fillRect(x + 9, y - 14, 5, 5); ctx.fillRect(x + 13, y - 14, 5, 5); ctx.fillRect(x + 11, y - 10, 5, 5); }
  } else if (mood === 'think') {
    ctx.fillRect(x - 9, y - 5, 4, 4); ctx.fillRect(x + 5, y - 5, 4, 4);
    ctx.fillRect(x - 5, y + 6, 10, 3);
    ctx.fillStyle = PAL.C; ctx.font = 'bold 13px Tajawal'; ctx.fillText('؟', x + 10, y - 8);
  } else if (mood === 'angry') {
    ctx.strokeStyle = PAL.k; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(x - 11, y - 9); ctx.lineTo(x - 4, y - 5); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x + 11, y - 9); ctx.lineTo(x + 4, y - 5); ctx.stroke();
    ctx.fillRect(x - 9, y - 4, 4, 4); ctx.fillRect(x + 5, y - 4, 4, 4);
    ctx.beginPath(); ctx.arc(x, y + 10, 7, 1.15 * Math.PI, 1.85 * Math.PI); ctx.stroke();
  } else if (mood === 'coin') {
    ctx.fillStyle = PAL.G; ctx.beginPath(); ctx.arc(x, y, 11, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#b07f1a'; ctx.lineWidth = 2; ctx.stroke();
    ctx.fillStyle = '#b07f1a'; ctx.font = 'bold 14px Tajawal'; ctx.textAlign = 'center';
    ctx.fillText('ر', x, y + 5); ctx.textAlign = 'start';
  }
  ctx.restore();
}

/* floating text particles */
class Floaty {
  constructor(x, y, text, color = '#f4b942') { this.x = x; this.y = y; this.text = text; this.color = color; this.t = 0; }
  update(dt) { this.t += dt; this.y -= dt * 28; return this.t < 1.1; }
  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = Math.max(0, 1 - this.t / 1.1);
    ctx.font = 'bold 17px Tajawal';
    ctx.fillStyle = this.color;
    ctx.strokeStyle = '#000'; ctx.lineWidth = 3; ctx.textAlign = 'center';
    ctx.strokeText(this.text, this.x, this.y);
    ctx.fillText(this.text, this.x, this.y);
    ctx.restore();
  }
}
