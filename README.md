# سِراج — SIRAJ

لعبة 2D تمزج بين **إدارة دكان في سوق نجدي** و**استكشاف خرابات بالليل** — مستوحاة من حلقة لعب Moonlighter، ومبنية بالكامل حول التراث السعودي.

A 2D roguelite + shop-management hybrid set in a Najdi souq: price goods and haggle with customers by day, dive into folklore-haunted ruins for rare loot by night.

## ▶️ التشغيل / Run

No build step — plain HTML5/Canvas/JS:

```bash
# any static server, e.g.
python3 -m http.server 8000
# then open http://localhost:8000
```

Or just open `index.html` in a modern browser.

## 🎮 التحكم / Controls

| فعل | مفتاح |
|-----|------|
| حركة (movement) | WASD / Arrows |
| ضرب (attack) | J / Z / Space |
| تفادي (dodge) | K / X / Shift |
| بخور العودة (escape the dive) | E |
| الدكان (shop) | Mouse — click stands, customers with **؟**, sliders |

## 🕹 حلقة اللعب / The loop

1. **النهار:** رصّ البضاعة على طاولات العرض، حدّد السوم، راقب فقاعات الزباين، ساوم (المساومة minigame)، وقدّم قهوة وتمر لتلين القلوب.
2. **المغرب:** دفتر الحساب — سدّد دين جدّك (١٥٠٠ ريال) وطوّر الدكان.
3. **الليل:** خذ السراج ودشّ «مقابر الأولين» — اقتل الأطياف، عبّي الخُرج، واهرب ببخور العودة قبل لا يغلبك الليل.

Full design document: [`SIRAJ_GAME_DESIGN.md`](SIRAJ_GAME_DESIGN.md)

## 🧱 Tech

- Vanilla JS + Canvas, no dependencies, no assets — all pixel art generated in code (`js/sprites.js`)
- Arabic-first RTL UI, WebAudio synth SFX, localStorage saves
- This is the **vertical slice**: day/night loop, haggling, reputation, upgrades, zone 1 (مقابر الأولين) with boss «حارس الواجهة»
