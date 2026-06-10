# سِراج (SIRAJ)
### وثيقة التصميم — Game Design Document
**Genre:** 2D roguelite + shop management (Moonlighter-style loop, original setting)
**Target:** Saudi / Gulf players first, global second · PC + mobile-friendly design
**Team scope:** 2–4 people, 12–18 months · Recommended engine: Godot 4

---

## 1. Game Title

**«سِراج»** — *SIRAJ* ("oil lamp / the light that guides at night")

The title is the grandfather's name, the name of the shop (**دكان سراج**), and the literal lantern
the player carries into the dark. One word, reads instantly in Arabic and English, and the lamp
becomes the game's logo and the dungeon-light upgrade system.

---

## 2. Story Premise

Salem — or Nourah, the player picks (**سالم / نورة**) — leaves a dull job in Riyadh to settle the
estate of their missing grandfather Siraj: a failing shop in the old souq of **المرقب (Al‑Mirqab)**,
a fictional mud-brick oasis town in Najd. Inside the shop they find his journal and his old lantern,
and learn the family secret: for forty years, Siraj kept the town alive by slipping out at night to
trade with places people don't speak of. The great sandstorm of last year — **الهبوب الكبير** —
has reopened those places, and now strange goods, strange rumors, and stranger customers are
drifting back into the souq. To pay off the shop's debts, revive the dying market, and find out
what happened to Siraj, the player must become what their grandfather was: a respectable merchant
by day, and a **داشر الليل** by night.

---

## 3. Core Gameplay Loop

One in-game day ≈ 18–25 real minutes. The day has a rhythm modeled on a real souq day.

### ☀️ Day Phase — الدكان (the shop)

1. **Morning setup (الصباح):** Pull items from storage onto display stands. Set an asking price
   (السوم) per item. Price discovery works like Moonlighter: customer reactions (😊 / 🤔 / 😠 /
   💸) teach you each item's real market band — but here reactions are filtered through *who* the
   customer is (see §5).
2. **First selling window (الضحى):** Customers stream in. Each sale can become a **haggle
   (مساومة)** — a short, snappy minigame (§5). Serve, read, counter, close.
3. **Midday break (وقفة الظهر):** Shutters close — the souq pauses, as real souqs do. This is the
   *crafting window*: visit the blacksmith, the Sadu weaver, the herbalist; restock; drink coffee
   at the قهوة and pick up rumors (rumors = dungeon intel: tonight's loot modifiers, boss hints).
4. **Second selling window (العصر):** Different crowd — workers, elders, the broker (الدلّال).
   Auction opportunities and bulk buyers appear here.
5. **Close & plan (المغرب):** Count the cash box, pay debt installments, choose tonight's zone,
   pack the **Sadu satchel** (weight-limited inventory — every slot you fill with potions is a slot
   you can't fill with loot).

### 🌙 Night Phase — الدشّة (the dive)

1. **Travel:** Pick one of five zones from the map (§4). Travel is instant; the lantern lights.
2. **Explore:** Top-down action-roguelite floors built from hand-made room templates assembled
   procedurally (Moonlighter-style: readable rooms, 3 floors + boss per zone). Combat: light
   attack, heavy attack, stamina dodge-roll, one **falcon companion** command (§8).
3. **Risk vs. greed:** Loot is weight-rated. The satchel fills fast. Some treasures are *fragile*
   (manuscripts tear if you get hit) or *cursed* (jinn-touched items attract enemies until warded).
4. **Get out:** Burn **بخور العودة** (return bukhoor — a consumable censer) to ride the smoke home,
   or push deeper. Defeat = you wake at dawn in the shop, rescued; everything in the satchel except
   one protected slot is gone.
5. **Dawn:** New stock hits the shelves. Loop.

**Session promise:** every full day/night cycle the player makes one pricing discovery, one combat
discovery, and one progression purchase. Nothing in the loop takes longer than ~10 minutes before
a reward beat.

---

## 4. The Five Night Zones

Each zone = 1 tileset, 4–5 regular enemies, 1 boss, ~30 unique loot items. Zones unlock in order;
each is rooted in a real Saudi region or legend. Folklore creatures are presented the way the
stories themselves present them — dangerous, clever, occasionally honorable — never as religious
commentary.

| # | Zone | Real-world root |
|---|------|-----------------|
| 1 | مقابر الأولين — *Tombs of the First Ones* | Hegra / AlUla rock-cut tombs, Jabal Ikmah inscriptions |
| 2 | الديرة المهجورة — *The Abandoned Dirah* | Najd ghost villages (Ushaiger-style mud-brick) + the folk motif of **سوق الجن**, the midnight jinn market |
| 3 | رمال إرم — *The Sands of Iram* | Empty Quarter; the legend of the lost city of Iram (إرم ذات العماد) and the **Wabar** meteorite site |
| 4 | جبال الضباب — *The Fog Mountains* | Asir highlands: juniper forests, fog, stone قصبة towers, Al‑Qatt Al‑Asiri art |
| 5 | مغاصات دارين — *The Pearl Banks of Darin* | Tarout Island / Darin port, Gulf pearl-diving history, the sailors' legend of **بو دريا (Bu Darya)** |

**Zone 1 — مقابر الأولين (Tombs of the First Ones).** Wind-carved sandstone halls, monumental
facades, lamplight on inscriptions. *Enemies:* stone-feathered falcons that dive from facade
ledges; sand-wraiths (أطياف الرمل) that rise from urns; tomb beetles in swarms; a **هاتف** — a
disembodied voice that mimics loot sounds and your grandfather's voice to lure you into trap rooms.
*Boss:* حارس الواجهة, a colossal carved guardian that fights using the tomb facade itself.
*Rare loot:* inked **manuscripts** (fragile), frankincense resin, carved offering bowls, "lion of
Dadan" stone fragments.

**Zone 2 — الديرة المهجورة (The Abandoned Dirah).** A mirror of the player's own town, empty and
moonlit; doors creak open behind you. *Enemies:* **نسناس** (hopping half-creatures) that steal
satchel items and flee; dust-shiqq (الشق) that splits in two when struck; possessed house cats.
*Twist:* not everything here is hostile — at midnight the central square becomes **سوق الجن**,
where veiled traders buy your cursed items and sell goods no human market has, paid in strange
coins. Cheat them once and the market never opens for you again (permanent, per save).
*Boss:* أم الدار, the matriarch spirit of the great house, fought across rooms that rearrange.
*Rare loot:* carved Najdi doors (heavy! a 2-slot item worth a fortune), antique silver jewelry,
Sadu tapestries, jinn-market exotica.

**Zone 3 — رمال إرم (The Sands of Iram).** Dunes at night that *flow* — floors literally drift,
rooms slide, and pillars of a buried city surface and sink. *Enemies:* **سعلاة (si'lah)**
shapeshifters that take the form of merchants you know from the day phase (their haggling dialogue
is *slightly wrong* — players who know their customers spot the fake); ghouls (غيلان) that tunnel;
glass-scorpions born of lightning-struck sand. *Boss:* عملاق العماد, a pillar-giant of Iram.
*Rare loot:* **حديد الوبار** (Wabar meteorite iron — the only material for top-tier weapons),
desert glass, amber, star-charts of the old caravans.

**Zone 4 — جبال الضباب (The Fog Mountains).** Vertical Asiri terraces, juniper woods, fog that
hides whole rooms until you light braziers. *Enemies:* mountain ghouls that ambush from fog;
thieving baboon packs (annoying, comedic, dangerous in numbers); the **مرعب الضباب**, a stalker
enemy that only moves when unlit. *Boss:* راعي القصبة, the watchtower keeper who controls the fog.
*Rare loot:* Khawlani coffee heirloom beans, juniper resin, wild mountain honeycomb (sells higher
the *fresher* it is — a timer item), Al‑Qatt pigment stones.

**Zone 5 — مغاصات دارين (The Pearl Banks of Darin).** The loop flips underwater: breath replaces
stamina, the lantern becomes a diving lamp, sunken dhows and drowned coral courtyards. *Enemies:*
pearl-hoarding morays; drowned-sailor wraiths; luminous jellyfish fields (environmental). The zone
is haunted by **بو دريا**, the old sailors' terror of the Gulf — heard knocking on hulls long
before he is seen. *Boss:* **بو دريا** himself, a multi-phase fight between wrecks.
*Rare loot:* pearls graded by size (الدانة = jackpot grade), red coral, **ambergris** (rarest
commodity in the game), nautical instruments of the pearl fleet.

---

## 5. Shop Mechanics — السوق

The shop is not a vending machine; it's a social space. Three systems interlock: **pricing**,
**haggling (المساومة)**, and **reputation (السمعة)**.

### Pricing & the market
- Every item has a hidden fair-value band that shifts with supply (flood the market with pearls
  and pearls dip), **season** (bukhoor and oud spike before Eid; dates spike in Ramadan), and town
  prosperity level.
- Customer reaction bubbles teach the band, Moonlighter-style, but reactions are *personal*: the
  elder knows true values, the kid doesn't, the collector tolerates a premium for pristine quality.

### Haggling — المساومة
A 15–30 second exchange, three beats max, on a price dial:

1. Customer asks: **«وش آخرها؟»** ("what's your final price?") and makes an opening bid.
2. Player counters. Each customer has a hidden ceiling and a **patience meter** with visible
   tells: foot-tapping, glancing at the door, re-folding their shumagh.
3. Close, concede, or lose them. A perfect read (closing within 5% of their ceiling) earns bonus
   سمعة and a chance they become a **regular**.

**Hospitality (الضيافة):** once per customer, offer **قهوة وتمر** from the shop's majlis corner.
It refills patience and softens the counter-offer — but coffee and dates are real inventory that
cost money to keep stocked. Generosity is a *resource decision*, exactly as it is in a real souq.

**عشان خاطرك pricing:** selling below market to a neighbor or elder logs a "favor" (**وجه**).
Favors come back: discounted crafting, rumors, quest hooks, a regular who defends your prices to
other customers.

### Customer types
| Type | Behavior | Sample line |
|------|----------|-------------|
| **أم العيال** — the household buyer | Fixed budget, buys staples, fiercely loyal if never gouged | «عاد أنا جارتكم من زمان!» |
| **الختيار** — the elder | Knows pre-storm prices; overcharge him and the *whole town* hears | «هذا سعره؟ كان نشتريه بريالين أيام جدك.» |
| **عابر السبيل** — the traveler (Darb Zubaydah caravans) | Pays generously, no haggling, brings zone rumors instead of سمعة | «عبّيلي للدرب، الله يجزاك خير.» |
| **الطوّاش** — the collector | Wants pristine/rare only; expert haggler; the top-end of the economy | «هذي الدانة... وش سومك فيها؟» |
| **الصبي** — the kid | Tiny purchases; spreads word fast (foot-traffic buff) | «أبغى من ذاك الحلو بريال!» |
| **الدلّال** — the auction broker | Offers to حراج (auction) your big-ticket items in the square: high risk, high ceiling | «خلّه عندي، أسوّمه لك في الحراج.» |
| **زبون الليل** — the night customer | Appears at closing time, overpays in strange old coins, only wants jinn-touched goods. Ties into سوق الجن. | «...عندك شيء ما يُباع في النهار؟» |

### Reputation — السمعة
A single town-wide meter moved by fair pricing, favors, hospitality, and honesty (selling a cursed
item *without disclosing it* tanks سمعة when it's discovered days later). High سمعة = more
customers, better caravan stock, town milestones. It is the day-phase equivalent of gear score.

---

## 6. Progression

Three tracks, all fed by one economy (ريال), so every purchase is a real tradeoff against debt
payments and tomorrow's coffee stock.

### A. Shop upgrades (الدكان)
Display shelves → outdoor awning stand (مظلة) → **majlis corner** (enables hospitality) → bukhoor
burner (ambient mood: +patience for everyone, burns inventory) → strongbox (theft protection) →
cooled date cellar (perishables last longer) → second floor (player home; cosmetic + save point).

### B. Gear & crafting (العدّة)
- **الحدّاد (blacksmith):** weapons in tiers — janbiya (fast), saif (balanced), war-cane (slow,
  sweeping), sling (ranged). Top tier requires **Wabar iron** from Zone 3.
- **حايكة السدو (the Sadu weaver):** satchels (carry weight), cloaks (defense + one folkloric
  ward slot), falcon hoods (companion upgrades). Sadu patterns are the gear-tier visual language.
- **العطّار (herbalist):** myrrh salves (heal), black-seed tonics (stamina), warding salts and
  iron charms (anti-jinn, per folklore), بخور العودة (the escape item).
- **The lantern (السراج):** the meta-item. Journal pages found in zones upgrade it — wider light,
  reveals mimics, pacifies lesser spirits. The lantern is the run-knowledge progression that
  survives death.

### C. Town development (الديرة)
Invest profits to reopen souq stalls, one craftsman at a time: roaster → herbalist → blacksmith →
goldsmith → the **قهوة** (coffeehouse: quest/rumor hub) → the **خان** (caravanserai: weekly
caravans with exotic stock, bulk orders, and traveling questgivers). Each reopening visibly
repopulates the souq — more foot traffic, more sound, more life. Town level gates zone unlocks, so
day-phase success and night-phase access stay coupled.

**Seasonal beat:** the calendar cycles through seasons including a **Ramadan month** where the
loop inverts — the souq opens *at night*, busy and lantern-lit after iftar, and dungeon dives
happen in the quiet of day. One month a year, the whole game changes rhythm. (Depicted through
market rhythm, lanterns, and food culture — prayer and worship themselves are never gamified.)

---

## 7. Art Direction

Hand-painted "hi-bit" 2D (Moonlighter-density sprites, richer texture), top-down with isometric
flavor. Architecture is the star: Najdi mud-brick with triangular crenellations and painted carved
doors in town; rock-cut sandstone monumentality in zone 1; Asiri stone-and-Qatt color in zone 4.
Palette splits the loop — warm ochres, whites, and palm greens by day; deep indigo and violet
nights cut by amber lantern glow — and all UI framing uses Sadu weave and Al‑Qatt Al‑Asiri
geometric borders instead of generic fantasy scrollwork. Audio: oud and rababa by day, sparse
samri percussion and wind at night.

---

## 8. What Makes It Distinctly Saudi

Three mechanics that could not be pasted onto a Western version of this loop:

1. **الضيافة is a combat-grade system.** Hospitality (coffee, dates, bukhoor, the majlis) is a
   real resource economy that directly modifies the haggling game, builds the وجه/favor network,
   and drives سمعة. In a Western shop game, generosity is flavor text; here it is the meta.

2. **Folklore etiquette instead of "kill everything."** Per actual Arabian folklore, jinn respect
   iron, salt, and courtesy. Many night encounters can be warded, traded with (سوق الجن), or
   politely *avoided* — and the si'lah mimic mechanic rewards players for genuinely knowing their
   daytime customers. The night world has manners, and learning them is progression.

3. **The souq's social clock.** The day phase follows a real souq rhythm — morning setup, the
   midday closure, the afternoon crowd, the Friday surge, the Ramadan night-souq inversion.
   Time-of-day isn't a lighting preset; it decides *who walks in*, what they'll pay, and when the
   player crafts. The calendar itself is a Saudi mechanic.

(Plus a fourth for free: the **falcon companion** — trained, hooded between commands, and upgraded
by the Sadu weaver — fetches distant loot and flushes ambushers, replacing the generic pet/drone.)

---

## 9. Scope & Production Reality (2–4 people, 12–18 months)

- **Engine:** Godot 4 (free, 2D-first, easy Arabic RTL text via its TextServer).
- **Content budget:** 5 tilesets, ~24 enemies, 5 bosses, ~150 items, 7 customer archetypes,
  1 town hub. Rooms are hand-built templates assembled procedurally — no full procgen tech.
- **Haggling is UI, not simulation:** one dial widget + patience meter + tell animations, reused
  for all customers. Cheap to build, deep to tune.
- **Milestones:** M3 — combat + one zone graybox. M6 — shop loop + haggling vertical slice
  (zone 1 + town). M9 — MVP: zones 1–2, debt arc, first town tier. M12 — content complete zones
  1–4. M15 — zone 5, Ramadan season, polish. M16–18 — localization QA (Arabic-first, English
  second), ports, launch.
- **Cultural review:** budget for a Saudi folklore/heritage consultant pass on all creature
  designs, dialogue, and zone framing before content lock. Folklore is treated as folklore;
  religious practice is honored by *rhythm and absence*, never gamified.

---

*دكان سراج يفتح أبوابه — والليل طويل.*
