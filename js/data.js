/* سِراج — game data */

const ITEMS = {
  dates:      { nameAr: 'تمر سكري',       icon: 'icon_dates',      fair: 14,  tier: 1, staple: true },
  coffee:     { nameAr: 'قهوة خولانية',    icon: 'icon_coffee',     fair: 28,  tier: 1, staple: true },
  sadu:       { nameAr: 'نسيج سدو',        icon: 'icon_sadu',       fair: 55,  tier: 2 },
  bukhoor:    { nameAr: 'بخور فاخر',       icon: 'icon_bukhoor',    fair: 38,  tier: 1, staple: true },
  oud:        { nameAr: 'دهن عود',         icon: 'icon_oud',        fair: 95,  tier: 2 },
  frank:      { nameAr: 'لُبان مرّ',        icon: 'icon_frank',      fair: 48,  tier: 2, source: 'night' },
  stone:      { nameAr: 'حجر منقوش',       icon: 'icon_stone',      fair: 92,  tier: 2, source: 'night' },
  manuscript: { nameAr: 'مخطوطة قديمة',    icon: 'icon_manuscript', fair: 140, tier: 3, source: 'night', fragile: true },
  silver:     { nameAr: 'فضة قديمة',       icon: 'icon_silver',     fair: 115, tier: 3, source: 'night' },
  dagger:     { nameAr: 'جنبية أثرية',     icon: 'icon_dagger',     fair: 165, tier: 3, source: 'night' },
  tablet:     { nameAr: 'لوح الواجهة',     icon: 'icon_tablet',     fair: 320, tier: 4, source: 'night', unique: true },
};

/* night loot table: zone 1 */
const LOOT_Z1 = [
  { id: 'frank',      w: 42 },
  { id: 'stone',      w: 26 },
  { id: 'silver',     w: 14 },
  { id: 'manuscript', w: 12 },
  { id: 'dagger',     w: 6 },
];

const CUSTOMERS = {
  um: {
    nameAr: 'أم العيال', spr: 'cust_um',
    knows: 0.9, ceiling: 1.06, haggler: 0.5, budgetMax: 80,
    prefers: it => it.staple,
    lines: {
      open: ['«وش آخرها يا ولدي؟»', '«عاد أنا جارتكم من زمان!»', '«غلّيتها علينا ذا المرة…»'],
      happy: ['«الله يبارك لك في تجارتك»'],
      angry: ['«لا… ذا مو سعره. مع السلامة»'],
    },
    tell: 'تشتري للبيت — ميزانيتها محدودة لكنها وفيّة',
  },
  elder: {
    nameAr: 'العم أبو متعب', spr: 'cust_elder',
    knows: 1.0, ceiling: 1.02, haggler: 0.8, repWeight: 3,
    prefers: it => true,
    lines: {
      open: ['«هذا سعره؟ كان نشتريه بريالين أيام جدك»', '«أنا أعرف السوق قبل لا تنولد»'],
      happy: ['«كذا البيع… مثل ما كان جدك يبيع»'],
      angry: ['«بقول للديرة كلها عن أسعارك!»'],
    },
    tell: 'يعرف الأسعار القديمة — غبنُه يضرّ سمعتك بالديرة كلها',
  },
  kid: {
    nameAr: 'الصبي حمود', spr: 'cust_kid',
    knows: 0.2, ceiling: 1.1, haggler: 0.1, budgetMax: 22,
    prefers: it => it.fair <= 30,
    lines: {
      open: ['«أبغى من ذاك الحلو بريال!»', '«عطني أحسن تمرة عندك!»'],
      happy: ['«بقول لربعي كلهم عن دكانك!»'],
      angry: ['«…بس معي ريالين»'],
    },
    tell: 'مصروفه بسيط — لكنه ينشر الخبر بسرعة الصاروخ',
  },
  collector: {
    nameAr: 'الطوّاش سليمان', spr: 'cust_collector',
    knows: 0.95, ceiling: 1.5, haggler: 1.0, minTier: 2,
    prefers: it => it.tier >= 2,
    lines: {
      open: ['«هذي القطعة… وش سومك فيها؟»', '«أدفع زين — بس ما أنغبن»'],
      happy: ['«صفقة تسرّ… زِد من ذا النوع»'],
      angry: ['«تبيع لتاجر؟ احترم السوق»'],
    },
    tell: 'خبير مساومة — يدفع فوق السعر للقطع النادرة فقط',
  },
  traveler: {
    nameAr: 'عابر سبيل', spr: 'cust_traveler',
    knows: 0.5, ceiling: 1.35, haggler: 0.0,
    prefers: it => it.staple || it.tier <= 2,
    lines: {
      open: ['«عبّيلي للدرب، الله يجزاك خير»'],
      happy: ['«سمعت بالليل أصوات عند المقابر… انتبه لروحك»'],
      angry: ['«الدرب طويل ومالي وقت للمساومة»'],
    },
    tell: 'قادم من درب القوافل — يدفع زين ولا يساوم',
  },
  night: {
    nameAr: 'زبون الليل', spr: 'cust_night',
    knows: 1.0, ceiling: 2.2, haggler: 0.3, minTier: 3, nightOnly: true,
    prefers: it => it.tier >= 3,
    lines: {
      open: ['«…عندك شيء ما يُباع في النهار؟»'],
      happy: ['«…سنلتقي»'],
      angry: ['«…خسارة»'],
    },
    tell: 'لا أحد يعرف من وين يجي… يدفع بعملات غريبة',
  },
};

const ZONES = [
  {
    id: 'tombs', icon: '🏜', nameAr: 'مقابر الأولين',
    sub: 'واجهات منحوتة بالصخر — أطياف ورمال', unlocked: true,
    boss: 'حارس الواجهة',
  },
  { id: 'dirah',  icon: '🏚', nameAr: 'الديرة المهجورة', sub: 'سوق الجن يفتح في منتصف الليل', lockMsg: 'النسخة القادمة' },
  { id: 'iram',   icon: '🌪', nameAr: 'رمال إرم',        sub: 'المدينة الغارقة تحت الكثبان', lockMsg: 'النسخة القادمة' },
  { id: 'fog',    icon: '⛰', nameAr: 'جبال الضباب',     sub: 'غيلان عسير وعرائس الجبل',    lockMsg: 'النسخة القادمة' },
  { id: 'darin',  icon: '🌊', nameAr: 'مغاصات دارين',    sub: 'بو دريا يطرق على الأخشاب',   lockMsg: 'النسخة القادمة' },
];

const UPGRADES = [
  {
    id: 'majlis', icon: '☕', nameAr: 'ركن المجلس', cost: 180,
    desc: 'قهوة وتمر للزباين: تزيد صبرهم في المساومة (مرة لكل زبون)',
  },
  {
    id: 'burner', icon: '🪔', nameAr: 'مبخرة الدكان', cost: 150,
    desc: 'ريحة البخور تطيّب الخواطر: +١ صبر لكل الزباين تلقائيًا',
  },
  {
    id: 'stand5', icon: '🪑', nameAr: 'طاولة خامسة', cost: 260,
    desc: 'مساحة عرض إضافية — بضاعة أكثر، بيع أكثر',
  },
  {
    id: 'blade', icon: '🗡', nameAr: 'جنبية مسقية', cost: 300,
    desc: 'الحدّاد يسقي نصلك من جديد: ضرر أعلى في الدشّات',
  },
  {
    id: 'satchel', icon: '🎒', nameAr: 'خُرج سدو كبير', cost: 220,
    desc: 'حياكة سدو متينة: +٤ خانات في حقيبة الليل',
  },
  {
    id: 'lantern', icon: '🏮', nameAr: 'فتيلة أوسع للسراج', cost: 200,
    desc: 'دائرة ضوء أوسع في الخرابات — تشوف الخطر قبل لا يشوفك',
  },
];

const INTRO_PAGES = [
  'المرقب — بلدة طينية في نجد، كان سوقها يضجّ بالقوافل…\nاليوم ما بقي فيه إلا دكاكين مسكّرة وريح تصفّر بين الفرجان.',
  'رجعت من الرياض عشان تصفّي «دكان سراج» — دكان جدك اللي اختفى قبل سنة.\nلقيت تحت الدرج: دفتره، وسراجه العود، ودَين بـ١٥٠٠ ريال لمجلس التجار.',
  'في آخر صفحة من الدفتر، بخط جدك:\n«البضاعة الزينة ما تجي من القوافل يا وليدي…\nتجي من الأماكن اللي يخاف منها الناس. خذ السراج، والليل طويل».',
  'بالنهار: افتح الدكان، رصّ البضاعة، وساوم الزباين.\nبالليل: خذ السراج ودشّ الخرابات — وجِب ما لا يُباع في النهار.\n\nسدّد الدَّين… ورجّع السوق للحياة.',
];

const DEBT_TOTAL = 1500;
const SATCHEL_BASE = 8;
const PLAYER_HP = 100;
