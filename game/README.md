# Find The Imposter — Game UI

Duolingo-style party game UI built with React + Framer Motion.

## Setup

```bash
cd game
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

## Demo Navigation

Use the floating **Demo Nav** bar at the bottom to advance through all game phases:

| Phase | Screen |
|-------|--------|
| Home | Landing page |
| Name Entry | Player name input |
| Lobby | Room lobby (toggle Phone / Shared Screen view) |
| Role Reveal | 3D card flip revealing Crew or Imposter role |
| Submission | Answer input with lock-in animation |
| Submission Locked | Locked state with checkmark |
| Reveal | Staggered card flip revealing all answers |
| Debate | Countdown timer + Sus marking |
| Voting | Voting ballot |
| Vote Done | Vote confirmation |
| Round Result | Result reveal + score update |
| Final Score | Podium + confetti + full leaderboard |

## Tech Stack

- **React 18** + Vite
- **Framer Motion 11** — all animations
- **Zustand** — mock game state
- **Tailwind CSS** — utility styling
- **canvas-confetti** — final score celebration
- **Google Fonts (Nunito)** — Duolingo-style rounded typography

## Key Animation Highlights

- **Role card**: 3D `rotateY` flip with perspective (RoleRevealScreen)
- **Answer reveal**: Staggered `rotateY` flip with 90ms delay between cards (RevealScreen)
- **Duolingo buttons**: `0 4px 0 #shadow` box-shadow + `whileTap={{ y: 4 }}` press effect
- **Countdown ring**: SVG `strokeDashoffset` with color transitions green → orange → red
- **Score deltas**: Float-up fade animation on +1/+2 score changes
- **Confetti burst**: Multi-origin confetti on game end
- **Sus glow**: Pulsing `boxShadow` animation on marked players
- **Lobby join**: Spring scale-in for each player card
