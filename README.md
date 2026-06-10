# YOU SUCK AT THIS™

*a love letter to your inadequacy*

A complete, fully playable rage-platformer in the proud tradition of *Getting Over
It*, *Trap Adventure 2*, and *I Wanna Be The Guy* — a game that insults you
personally, punishes you creatively, and is precision-engineered to make you
rage-quit and immediately crawl back.

## How to run

No build, no dependencies. Either:

1. **Just open it** — double-click `index.html` in any modern browser, or
2. **Serve it** (recommended, keeps localStorage stable):

   ```bash
   python3 -m http.server 8000
   # then open http://localhost:8000
   ```

## Controls

| Key | Action |
| --- | --- |
| `← →` / `A D` | Move |
| `Space` / `W` / `↑` | Jump (hold for full height) |
| `R` | Restart level — *costs a death, rules are rules* |
| `M` | Mute |
| `Esc` | Begs for mercy (denied) |

## What you're in for

- **7 levels, no checkpoints.** Die anywhere, restart the level. The game is hard
  but *fair-ish*: tight coyote time, jump buffering, and forgiving spike hitboxes
  mean every death is technically your fault. That's the point.
- **A personal insult engine.** It asks your name first so the trash talk is
  bespoke. The tone escalates through four tiers (condescending → mocking →
  vicious → existential) as your death count climbs, with special material for
  dying fast, dying in the same spot repeatedly, dying near the exit, idling,
  and tabbing out.
- **Trap-based betrayal.** Fake platforms, crumbling platforms, invisible blocks,
  pop-up spikes, a level that quietly inverts your controls while insisting
  they're fine, a level played in the dark, and one door that is lying to you.
- **Compulsion hooks.** Near-miss detection ("9 PIXELS from the door"), a
  best-run progress bar, death-count milestones, fake global statistics, and a
  rage-quit detector that greets you when you come back. You will come back.
- **A victory screen worth the suffering.** Rank, stats, confetti, a genuine
  moment of respect, and a one-click brag to inflict the game on your friends.

## Files

- `index.html` — shell, styles, overlay UI
- `game.js` — engine, levels, physics, and the insult library

All insults are aimed exclusively at your gameplay. The game keeps a lifetime
death counter in localStorage. It remembers. It always remembers.
