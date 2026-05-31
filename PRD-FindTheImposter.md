# Product Requirements Document
# Find The Imposter — Web Edition

**Document Version:** 1.0  
**Date:** 2026-05-31  
**Status:** Final Draft  
**Owner:** Product Team  

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Product Vision & Strategic Goals](#2-product-vision--strategic-goals)
3. [Target Audience & User Personas](#3-target-audience--user-personas)
4. [Market Analysis & Competitive Landscape](#4-market-analysis--competitive-landscape)
5. [Core Gameplay Loop — Full Specification](#5-core-gameplay-loop--full-specification)
6. [User Stories](#6-user-stories)
7. [Feature Specifications](#7-feature-specifications)
   - 7.1 Lobby & Room System
   - 7.2 Role Assignment Engine
   - 7.3 Question Engine
   - 7.4 Answer Submission
   - 7.5 Simultaneous Reveal
   - 7.6 Debate Phase
   - 7.7 Voting System
   - 7.8 Scoring & Leaderboard
   - 7.9 Round Management
   - 7.10 Host Controls
8. [UI/UX Design Specification](#8-uiux-design-specification)
9. [Screen-by-Screen Flow](#9-screen-by-screen-flow)
10. [Animation System (Framer Motion)](#10-animation-system-framer-motion)
11. [Technical Architecture](#11-technical-architecture)
12. [Database Design](#12-database-design)
13. [API Design](#13-api-design)
14. [Real-Time Event System](#14-real-time-event-system)
15. [Question Database — Content Specification](#15-question-database--content-specification)
16. [Room Sharing System](#16-room-sharing-system)
17. [Accessibility Requirements](#17-accessibility-requirements)
18. [Performance Requirements](#18-performance-requirements)
19. [Security Considerations](#19-security-considerations)
20. [Error Handling & Edge Cases](#20-error-handling--edge-cases)
21. [Analytics & Instrumentation](#21-analytics--instrumentation)
22. [Monetization Strategy](#22-monetization-strategy)
23. [Localization & Internationalization](#23-localization--internationalization)
24. [Testing Strategy](#24-testing-strategy)
25. [Go-to-Market & Launch Strategy](#25-go-to-market--launch-strategy)
26. [Success Metrics & KPIs](#26-success-metrics--kpis)
27. [Product Roadmap](#27-product-roadmap)
28. [Open Questions & Risks](#28-open-questions--risks)
29. [Appendix](#29-appendix)

---

## 1. Executive Summary

**Find The Imposter** is a real-time, browser-based multiplayer party game for 4–10 players. Players each receive a secret prompt and submit a one-word or one-number answer. One player (the Imposter) receives a subtly different prompt and must blend in. After all answers are revealed simultaneously on a shared screen, players debate, then vote to identify the Imposter. The game runs for 5–10 rounds, accumulating a score across the session.

The product is a **mobile-first web application**: players join and interact via their smartphones, while a shared display (TV, laptop, or stream) shows the game state. The aesthetic is Duolingo-inspired — bold colors, large rounded buttons, satisfying micro-animations powered by Framer Motion — making the experience feel polished and joyful.

The MVP targets friend groups and streamers who currently lack a free, no-download equivalent to Jackbox-style games in this specific format.

---

## 2. Product Vision & Strategic Goals

### Vision Statement
> Make any gathering — a living room, a Discord call, a Twitch stream — instantly more fun with a game anyone can play in under 60 seconds of setup.

### Strategic Goals

| # | Goal | Metric | Target (6 months post-launch) |
|---|------|--------|-------------------------------|
| G1 | Grow organic word-of-mouth | Rooms created per week | 10,000 |
| G2 | Maximize session retention | Rounds completed per session | ≥ 6 |
| G3 | Establish streamer adoption | Twitch/YouTube sessions tagged | 500/month |
| G4 | Build a replayable content library | Unique prompt pairs | ≥ 500 at launch |
| G5 | Achieve fast time-to-first-game | Seconds from landing to first answer submitted | < 60s |

### Design Principles

1. **Zero friction** — No account required for players. One tap to join.
2. **Shared screen first** — The main display is a passive TV-like surface; all interaction happens on phones.
3. **Joyful by default** — Every state transition has a satisfying animation. Silence is never uncomfortable because the UI always communicates what's happening.
4. **Fair bluffing** — The Imposter prompt must always be plausibly related to the Crew prompt so bluffing is possible but not trivially easy.
5. **Replayable** — Prompt pairs are never repeated within a session. Role rotation ensures everyone experiences the Imposter role.

---

## 3. Target Audience & User Personas

### 3.1 Primary Personas

#### Persona A — "The Social Organizer" (Sara, 26)
- **Context:** Hosts weekly game nights with 6–8 friends. Owns a Smart TV and everyone has a phone.
- **Pain point:** Jackbox requires purchasing game packs; free alternatives feel low-quality.
- **Goal:** Find a free, no-setup game to bridge the gap between activities.
- **Key need:** Effortless room sharing (QR code or short link), fast setup, works on any phone browser.

#### Persona B — "The Variety Streamer" (Khalid, 23)
- **Context:** Mid-size Twitch streamer (5k–50k followers) who plays party games with chat or with a friend group on stream.
- **Pain point:** Most party games require software installation or paid licenses for commercial streaming.
- **Goal:** A free, browser-based party game that looks great on stream and is easy for guests to join.
- **Key need:** A shareable room code on-screen, a spectator-friendly shared display mode, no "please install" popups.

#### Persona C — "The Casual Gamer" (Adel, 31)
- **Context:** Joins game nights without preparation. Needs to understand the game in < 30 seconds.
- **Pain point:** Complex onboarding ruins the social mood.
- **Goal:** Pick up the rules from context and start having fun immediately.
- **Key need:** In-game role card that clearly explains what they need to do, minimal UI clutter.

#### Persona D — "The Host" (any player who creates a room)
- **Context:** Takes responsibility for starting/stopping rounds, managing pace.
- **Goal:** Maintain control without becoming a bottleneck.
- **Key need:** A host panel that is powerful but never overwhelming; one-tap to advance the game state.

### 3.2 Secondary Audience
- Corporate team-building facilitators
- University orientation event organizers
- Online friend groups on Discord voice calls (each on their own screen)

---

## 4. Market Analysis & Competitive Landscape

### 4.1 Competitor Matrix

| Product | Platform | Price | Download Required | Real-Time | Max Players | Imposter Mechanic |
|---------|----------|-------|-------------------|-----------|-------------|-------------------|
| Jackbox (Fibbage) | Web + TV App | $10–$30/pack | Host only | Yes | 8 | No |
| Among Us | PC/Mobile App | Free–$5 | Yes (app) | Yes | 15 | Yes (task-based) |
| Skribbl.io | Browser | Free | No | Yes | 12 | No |
| Gartic Phone | Browser | Free | No | Yes | 30 | No |
| **Find The Imposter** | **Browser** | **Free (MVP)** | **No** | **Yes** | **10** | **Yes (prompt-based)** |

### 4.2 Differentiators
- **Prompt-based deduction** is a novel mechanic not directly replicated by existing free browser games.
- **Duolingo-inspired UI** creates a premium feel despite being free.
- **No host paywall** — every feature is available without purchase.
- **Streamer-first sharing** — overlay-friendly room codes, spectator mode.

### 4.3 Market Opportunity
- The party game genre generates ~$1.5B annually (digital + physical).
- Browser-based party games grew 340% in engagement during 2020–2022 and retained significant share.
- The "no-download" demographic represents the largest untapped segment among casual gamers aged 18–35.

---

## 5. Core Gameplay Loop — Full Specification

### 5.1 High-Level Flow

```
[LOBBY] → [ROUND START] → [PROMPT DELIVERY] → [ANSWER SUBMISSION]
    → [REVEAL] → [DEBATE] → [VOTE] → [ROUND RESULT] → [SCOREBOARD]
    → (next round OR game end)
```

### 5.2 Phase-by-Phase Specification

#### Phase 0: Pre-Game / Lobby
- Host creates a room. System generates a 6-character alphanumeric room code (e.g., `ZXKR47`) and a QR code.
- Players navigate to the game URL and enter the room code OR scan the QR code.
- Each player enters a **display name** (max 16 characters, no account required).
- The shared screen (host view) shows all connected players as animated avatar cards.
- Host can set: number of rounds (5–10), debate timer duration (30s / 60s / 90s / custom), and whether to allow spectators.
- Minimum players to start: 4. Maximum: 10.
- Host taps **"Start Game"** when ready.

#### Phase 1: Round Start
- System picks the next unused prompt pair from the question bank.
- System applies the role assignment algorithm (see Section 7.2) to designate exactly one Imposter.
- The shared screen shows a **"Round X of Y"** splash with a dramatic animation.
- Each player's phone screen transitions to show their **Role Card**:
  - **Crew card:** Green theme. Shows the Crew prompt. e.g., *"How many hours of sleep do you get per night?"*
  - **Imposter card:** Red/dark theme. Shows the Imposter prompt. e.g., *"How many cups of coffee do you drink per day?"*
  - Both cards display: "Keep your prompt SECRET. Submit your answer below."
- Role cards appear with a flip animation (Framer Motion `rotateY` 0→180).
- Players have **15 seconds** to read their prompt before the answer input field activates (optional setting: skip this delay).

#### Phase 2: Answer Submission
- Each player sees a large input field on their phone.
- **Input rules:**
  - Single word OR a number (integer or simple decimal).
  - Maximum 12 characters.
  - No spaces allowed (enforced client-side with a validation message).
  - Profanity filter applied server-side.
- A **"Lock In"** button (large, rounded, Duolingo-style green) submits the answer.
- Once locked in, the button becomes a checkmark with a bounce animation; the player cannot change their answer.
- The shared screen shows a grid of player cards. Each card flips from "thinking" (animated pulsing dots) to a **locked padlock icon** as each player submits.
- A countdown timer shows remaining time (default: 60 seconds from prompt delivery). If all players submit early, the timer auto-advances.
- If a player has NOT submitted when the timer reaches 0, their answer is recorded as **"—"** (em dash) and they are auto-locked.

#### Phase 3: Simultaneous Reveal
- All player cards on the shared screen flip simultaneously (Framer Motion staggered children, 80ms delay between each card).
- Each card shows: **Player Name + Answer**.
- Reveal is accompanied by a satisfying "whoosh" sound effect (optional, toggleable).
- Players have 3 seconds to absorb the answers before the debate timer activates.
- The Imposter sees their own answer revealed among the others and must mentally prepare their argument.

#### Phase 4: Debate Phase
- A large countdown timer (ring progress animation) appears on the shared screen.
- Default duration: **60 seconds** (configurable by host: 30s / 60s / 90s).
- No in-app voice; debate happens over the physical room / voice call.
- Phone screens show a **"Debate"** status card with a brief tip: *"Defend your answer. Look for the odd one out."*
- Players can optionally tap a **"Sus"** button next to any player's name (purely visual, shows a red exclamation on the shared screen — does not count as a vote).
- When the timer reaches 10 seconds, the ring pulses red with an urgency animation.
- When the timer hits 0, a gong-style animation sweeps across the shared screen and voting begins automatically.

#### Phase 5: Voting
- Each player's phone shows a **voting ballot** with all other player names as large tap targets (cannot vote for self).
- Players have **30 seconds** to cast exactly one vote.
- Votes are hidden until all players have voted OR the timer expires.
- A progress indicator on the shared screen shows "X of Y players have voted" without revealing who.
- If a player does not vote in time, their vote is recorded as **abstain** (counts as no vote cast).

#### Phase 6: Vote Reveal & Round Result
- All votes are revealed simultaneously on the shared screen in a dramatic cascade animation.
- The player with the most votes is highlighted with a spotlight effect.
- **Outcome logic:**
  - **Majority vote (> 50%) identifies the Imposter → Crew wins this round.**
    - Each Crew member earns **+1 point**.
    - The Imposter card is revealed with a red flash.
    - Animation: The Imposter's avatar "shatters" off the screen (particle effect).
  - **No majority / Imposter not caught → Imposter wins this round.**
    - The Imposter earns **+2 points** (bonus for successfully bluffing).
    - Animation: The Imposter's avatar glows and expands with a triumphant effect.
  - **Tie vote:** No one is eliminated. The Imposter earns **+1 point** (partial bluff success). Crew earns **0**.
- The correct Imposter is always revealed after the vote, regardless of outcome.
- Both prompts (Crew and Imposter) are revealed side by side so all players understand the round.
- A **"Next Round"** button appears for the host (or auto-advances after 8 seconds).

#### Phase 7: End of Game
- After all rounds complete, the **Final Scoreboard** is shown on the shared screen.
- Players are ranked 1st–Nth with trophy animations for top 3.
- A **"Play Again"** button resets the game with the same room (reshuffles prompts and roles).
- A **"New Game"** button returns to the lobby screen.
- A **"Share Results"** button generates a shareable image/card of the final scoreboard.

### 5.3 Edge Cases in Gameplay

| Scenario | Handling |
|----------|---------|
| Player disconnects during submission | Their slot shows "—" and is auto-locked at timer end |
| Player disconnects during voting | Their vote is recorded as abstain |
| Host disconnects | First player in the room is auto-promoted to host |
| All players tie in vote | See tie rule above |
| Only 1 player left | Game ends, remaining player wins by default |
| Player rejoins mid-round | They see the current phase view; cannot re-submit if locked |
| Prompt database exhausted | System shows a "No more new prompts" message and offers to reuse (shuffled) |

---

## 6. User Stories

### Host Stories

| ID | As a host, I want to... | So that... | Priority |
|----|------------------------|------------|----------|
| H1 | Create a room in one tap | I can start a game without friction | P0 |
| H2 | Share the room via QR code AND a short link AND a room code | Friends can join regardless of their situation | P0 |
| H3 | Set the number of rounds before starting | I control how long the session lasts | P0 |
| H4 | Set the debate timer duration | I match the pace to my group's energy | P1 |
| H5 | See all connected players on a lobby screen before starting | I know everyone is ready | P0 |
| H6 | Kick a player from the lobby | I can remove someone who joined by mistake | P1 |
| H7 | Advance the game manually (skip waiting) | I maintain momentum if everyone is ready | P1 |
| H8 | Pause the game between rounds | I can take a bathroom break or explain the rules | P2 |
| H9 | End the game early and go to the scoreboard | I can call it if time runs out | P2 |
| H10 | Replay with the same group without a new room code | Continuity between sessions | P1 |

### Player Stories

| ID | As a player, I want to... | So that... | Priority |
|----|--------------------------|------------|----------|
| P1 | Join a room by scanning a QR code | I don't have to type anything | P0 |
| P2 | Join a room by entering a 6-character code | I can join from a shared link or spoken code | P0 |
| P3 | See my role (Crew or Imposter) clearly on my screen | I know what I'm supposed to do | P0 |
| P4 | Read my prompt clearly before the submission timer starts | I have time to think | P0 |
| P5 | Submit my answer with a satisfying "locked in" confirmation | I know my answer was received | P0 |
| P6 | See all answers revealed at the same time | The drama is preserved | P0 |
| P7 | Vote for who I think the Imposter is | I participate in the core deduction mechanic | P0 |
| P8 | See the vote results and who the Imposter actually was | I get closure and understand the round | P0 |
| P9 | See my running score and ranking | I'm motivated to keep playing | P1 |
| P10 | Understand the rules without reading a manual | The game explains itself through UI | P0 |
| P11 | Mark someone as "sus" during debate | I communicate suspicion without disrupting the verbal debate | P2 |
| P12 | Share the final scoreboard image | I can show off the results on social media | P2 |

### Spectator Stories

| ID | As a spectator, I want to... | So that... | Priority |
|----|------------------------------|------------|----------|
| S1 | Watch the shared screen without voting | I enjoy the game without participating | P2 |
| S2 | See the Imposter's secret prompt (on spectator view only) | Spectating is more interesting when I know the secret | P3 |

---

## 7. Feature Specifications

### 7.1 Lobby & Room System

#### 7.1.1 Room Creation
- **Trigger:** User taps "Create Room" on the home screen.
- **Process:**
  1. Client sends `POST /api/rooms` to the backend.
  2. Backend generates a unique 6-character alphanumeric room code (uppercased, ambiguous characters O, 0, I, 1 excluded).
  3. Backend creates a room record in the database with status `LOBBY`.
  4. Backend returns the room code, a WebSocket channel ID, and a shareable URL.
  5. Client navigates to `/host/:roomCode` and joins the WebSocket channel.
- **Room code expiry:** Rooms expire after 4 hours of inactivity.
- **Concurrent room cap:** 500 active rooms per server instance (horizontal scaling beyond this).

#### 7.1.2 Room Joining
- **Entry points:**
  - Direct URL: `https://findtheimposter.app/join/ZXKR47`
  - QR code scan (links to the same URL)
  - Manual code entry on the homepage
- **Flow:**
  1. User enters room code (client normalizes to uppercase, strips spaces).
  2. Client sends `POST /api/rooms/:code/join` with a display name.
  3. Backend validates: room exists, room is in LOBBY state, player count < 10, display name is unique in this room.
  4. On success, backend returns a player session token (JWT, 4-hour expiry) and WebSocket credentials.
  5. Client stores the token in `localStorage` for reconnection.
  6. Client joins the WebSocket channel and the lobby screen renders.
- **Error states:**
  - Room not found → "This room code doesn't exist. Check for typos."
  - Room full → "This room is full (10/10 players)."
  - Game already started → "This game is in progress. Ask the host to let you join next round."
  - Display name taken → "This nickname is already taken in this room. Choose another."

#### 7.1.3 Lobby Screen (Shared Display)
- Shows the room code in large text (top-center).
- Shows a QR code (right side, toggleable).
- Shows a short shareable URL below the QR: `findtheimposter.app/j/ZXKR47`.
- Players appear as animated avatar cards in a grid. Avatar is an auto-generated emoji or color + initial.
- A "Waiting for players" pulse animation plays until the host starts.
- Host's card is marked with a crown icon.
- Shows player count: "4 / 10 players joined".

#### 7.1.4 Lobby Screen (Player Phone)
- Shows "You're in!" confirmation with the player's chosen name.
- Shows a list of other players already in the lobby.
- Shows game settings if the host has configured them.
- A "Ready" toggle (optional) to signal readiness to the host.
- Animated waiting state: bouncing dots with "Waiting for host to start...".

### 7.2 Role Assignment Engine

#### 7.2.1 Algorithm
The role assignment must satisfy:
- Exactly 1 Imposter per round.
- No player is assigned Imposter twice until all players have been Imposter once (round-robin fairness).
- The first Imposter is selected randomly. Subsequent Imposters are drawn from a "not yet been Imposter" pool.
- When all players have been Imposter once, the pool resets and a new cycle begins.
- The Imposter identity is never sent to non-Imposter clients; only a per-player role assignment is sent to each individual client via a private WebSocket message.

#### 7.2.2 Implementation Notes
- Maintain a `imposterHistory` array on the server per room, tracking which player IDs have been Imposter.
- On round start, filter out players in the history. If the filtered list is empty, reset history.
- Randomly sample one player from the filtered list.
- Send each player their role via a direct server-to-client message (not broadcast).

#### 7.2.3 Security
- The Imposter's identity is NEVER sent in a broadcast WebSocket message.
- The server never sends the Crew prompt to the Imposter or vice versa.
- Client-side code cannot determine who the Imposter is by inspecting WebSocket traffic (only the player's own role is in their message payload).

### 7.3 Question Engine

#### 7.3.1 Prompt Pair Structure
Each prompt pair in the database contains:
```json
{
  "id": "uuid",
  "crew_prompt": "How many hours of sleep do you get per night?",
  "imposter_prompt": "How many cups of coffee do you drink per day?",
  "category": "daily_life",
  "difficulty": "easy",
  "expected_answer_type": "number",
  "min_players": 4,
  "tags": ["relatable", "health", "numbers"],
  "created_at": "2026-01-01T00:00:00Z",
  "is_active": true
}
```

#### 7.3.2 Prompt Selection Rules
- Prompts are shuffled at room creation and stored as an ordered list on the server.
- The game consumes prompts sequentially from this list, ensuring no repeats within a session.
- Prompts are filtered by `min_players` ≤ current player count.
- NSFW/adult prompts are excluded by default (opt-in by host for adult sessions — post-MVP).

#### 7.3.3 Prompt Pair Design Guidelines
- **The Imposter prompt must be plausibly close to the Crew prompt.** A Crew answer and Imposter answer should fall in a similar numerical/categorical range.
- **Both prompts must be answerable in a single word or number.**
- **Prompt pairs must allow bluffing.** The Imposter should have a reasonable explanation for their answer.
- **Avoid culturally specific references** that would be unfair for some player groups.
- See Section 15 for full content specification and sample pairs.

#### 7.3.4 Prompt Difficulty Levels
| Level | Description | Example |
|-------|-------------|--------|
| Easy | Obvious difference between Crew/Imposter once revealed | Sleep hours vs. Netflix hours |
| Medium | Plausible overlap; requires careful voting | Shoe size vs. waist size in inches |
| Hard | Nearly identical prompts; very easy to bluff | Height in feet vs. weight in kilos |

### 7.4 Answer Submission

#### 7.4.1 Input Component
- Large, centered text field (min touch target: 48×48px per WCAG 2.1).
- Placeholder text: *"Type your answer..."*
- `inputmode="text"` on mobile to trigger soft keyboard.
- Character counter displayed when input length > 8.
- Real-time client-side validation:
  - No spaces (immediate feedback: "No spaces allowed — use a single word or number")
  - No special characters except `.` `-` for decimals and negatives
  - Max 12 characters
- **"Lock In" button** (large, full-width, green, rounded-2xl, bold text).
- Once locked, the field and button are replaced by a green checkmark card with bounce animation and text "Answer locked in! Waiting for others..."

#### 7.4.2 Server-Side Handling
- `POST /api/rooms/:code/rounds/:round/answer`
- Server validates: player session valid, round is active, player has not already submitted.
- Answer is stored encrypted at rest.
- Server broadcasts to the shared display: player X has locked in (no answer content, just a lock-state update).
- When all players have submitted, server broadcasts `ROUND_REVEAL_READY` immediately (before timer expiry).

### 7.5 Simultaneous Reveal

#### 7.5.1 Reveal Trigger
- Triggered by either: all players submitted OR submission timer reaching 0.
- Server sends `REVEAL` event to all clients with the full answer list.

#### 7.5.2 Shared Screen Behavior
- Player cards are arranged in a grid (2-column on portrait, 3-column on landscape).
- Each card shows player name + a face-down "?" state before reveal.
- On `REVEAL` event, cards flip one-by-one with a 80ms stagger (Framer Motion `staggerChildren`).
- After all cards are flipped, a 3-second pause, then debate timer starts automatically.

#### 7.5.3 Player Phone Behavior
- Players see all answers on their phone as well (a smaller card list).
- Their own card is highlighted with a subtle glow.
- Debate phase instructions appear below the answer list.

### 7.6 Debate Phase

#### 7.6.1 Timer
- Configurable: 30s / 60s (default) / 90s.
- Visual: A circular countdown ring on the shared screen.
- Animation phases:
  - 100%–30%: Green ring, steady rotation.
  - 30%–10%: Orange ring, slight pulsing.
  - 10%–0%: Red ring, rapid pulsing with screen edge glow.
- Audio: An optional ticking sound in the last 10 seconds.

#### 7.6.2 Sus Button
- On each player's phone, during the debate phase, they see a list of all other players' names + answers.
- Each entry has a small "Sus" button (skull icon, red).
- Tapping "Sus" sends a broadcast to the shared screen that highlights that player's answer card with a red glow.
- Multiple players can mark the same person as "Sus"; the glow intensifies.
- Sus marks are visual only — they have zero effect on voting.
- Sus marks reset at the end of the debate phase.

### 7.7 Voting System

#### 7.7.1 Ballot Screen
- Appears on each player's phone immediately when the debate timer ends.
- Shows a scrollable list of all other players (cannot vote for yourself; your own name is grayed out).
- Each player entry is a large, tap-friendly button (min height: 64px) showing: player name, their submitted answer.
- Selecting a player highlights their card with a checkmark animation.
- A **"Cast Vote"** button becomes active when a selection is made.
- Players can change their selection before casting.
- Once cast, the ballot is locked and the screen shows "Vote cast! Waiting for others...".

#### 7.7.2 Vote Collection
- Server collects votes privately.
- Shared screen shows: "X of Y players have voted" with animated dots.
- Auto-closes when all votes are cast OR 30-second timer expires.
- Abstained votes do not count toward any player's total.

#### 7.7.3 Result Calculation
```
For each player P:
  P.vote_count = count of votes cast for P

Max votes = max(all vote_counts)
Candidates = players where vote_count == Max votes

If len(Candidates) == 1 AND Candidates[0] IS the Imposter:
  Result = CREW_WIN (majority caught the Imposter)
Else if len(Candidates) == 1 AND Candidates[0] is NOT the Imposter:
  Result = IMPOSTER_WIN (wrong person eliminated)
Else (tie, or no votes cast):
  Result = TIE
```

#### 7.7.4 Scoring After Vote
| Result | Crew Members | Imposter |
|--------|-------------|----------|
| CREW_WIN | +1 point each | +0 points |
| IMPOSTER_WIN | +0 points | +2 points |
| TIE | +0 points | +1 point |

### 7.8 Scoring & Leaderboard

#### 7.8.1 Score Tracking
- Scores are stored server-side per room per session.
- Scores persist across rounds for the duration of the session.
- Scores are displayed after every round on the shared screen (brief scoreboard flash, 5 seconds).

#### 7.8.2 Leaderboard Display
- Shown on the shared screen after every round and at game end.
- Players listed in rank order (highest score first).
- Score changes animate in (number counting up with easing).
- Rank changes animate with a "rising" or "falling" card motion.
- At game end: Top 3 players get trophy icons (🥇🥈🥉), with a confetti burst for 1st place.

#### 7.8.3 Player Phone Leaderboard
- Also shown on each player's phone after each round.
- The player's own row is highlighted.
- Shows "You're in Xth place!" with motivating message variants.

### 7.9 Round Management

#### 7.9.1 Round Count
- Configurable by host: 5, 7, or 10 rounds (or custom 4–12).
- Default: 7 rounds.

#### 7.9.2 Round Progress Indicator
- Always visible on the shared screen (top bar): "Round 3 / 7".
- Progress bar fills across the top of the screen.

#### 7.9.3 Between Rounds
- Post-round result screen shows for 8 seconds (or until host taps "Next Round").
- Shows: who the Imposter was, both prompts, vote breakdown, points earned this round, running totals.

### 7.10 Host Controls

#### 7.10.1 Host Panel (Phone)
- Accessible via a "Host" tab on the phone during the game.
- Controls:
  - **Skip Timer** — advance the current phase immediately.
  - **Pause Game** — freeze all timers, show "Game Paused" on shared screen.
  - **Resume Game** — unfreeze.
  - **End Game** — go to final scoreboard.
  - **Kick Player** — remove a player from the session.
  - **Adjust next debate timer** — change duration for the next round only.

#### 7.10.2 Host Indicators
- Host sees all answers before reveal (on their private panel). This is intentional to help moderate.
- Host sees who the current Imposter is (marked privately on their panel).

---

## 8. UI/UX Design Specification

### 8.1 Design Language: "Duolingo-Inspired Party"

The aesthetic borrows from Duolingo's successful formula: **rounded corners, bold saturated colors, large tap targets, expressive animations, and celebratory feedback.** The goal is a UI that feels instantly playful and trustworthy.

#### 8.1.1 Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-primary` | `#58CC02` | Primary action buttons, Crew theme accent |
| `--color-primary-dark` | `#46A302` | Button pressed states |
| `--color-secondary` | `#1CB0F6` | Links, secondary actions, info states |
| `--color-danger` | `#FF4B4B` | Imposter reveal, error states, "Sus" markers |
| `--color-danger-dark` | `#EA2B2B` | Danger pressed states |
| `--color-warning` | `#FF9600` | Timer warning states |
| `--color-gold` | `#FFD700` | Scoring, trophies, leaderboard highlights |
| `--color-surface` | `#FFFFFF` | Card backgrounds |
| `--color-surface-raised` | `#F7F7F7` | Secondary card backgrounds |
| `--color-bg` | `#1A1A2E` | App background (dark navy) |
| `--color-bg-light` | `#16213E` | Secondary background |
| `--color-text-primary` | `#FFFFFF` | Main text on dark backgrounds |
| `--color-text-secondary` | `#AFAFAF` | Supporting text |
| `--color-text-dark` | `#1A1A2E` | Text on light card surfaces |
| `--color-imposter-bg` | `#1A0A0A` | Imposter role card background |
| `--color-crew-bg` | `#0A1A0A` | Crew role card background |

#### 8.1.2 Typography

| Role | Font | Weight | Size (mobile) |
|------|------|--------|---------------|
| Display (game titles) | Nunito | 800 ExtraBold | 32px |
| Heading 1 | Nunito | 700 Bold | 24px |
| Heading 2 | Nunito | 600 SemiBold | 20px |
| Body | Nunito | 400 Regular | 16px |
| Body Emphasis | Nunito | 600 SemiBold | 16px |
| Caption | Nunito | 400 Regular | 12px |
| Button | Nunito | 700 Bold | 18px |
| Answer Display | Nunito | 800 ExtraBold | 22px |

Nunito was chosen for its friendly, rounded letterforms that complement the Duolingo aesthetic.

#### 8.1.3 Spacing System
Based on an 8px base unit:
- `--space-1`: 4px
- `--space-2`: 8px
- `--space-3`: 12px
- `--space-4`: 16px
- `--space-5`: 20px
- `--space-6`: 24px
- `--space-8`: 32px
- `--space-10`: 40px
- `--space-12`: 48px

#### 8.1.4 Border Radius
- `--radius-sm`: 8px (input fields, small tags)
- `--radius-md`: 16px (cards, panels)
- `--radius-lg`: 24px (modal sheets, large cards)
- `--radius-xl`: 32px (primary action buttons)
- `--radius-full`: 9999px (chips, avatar circles, progress rings)

#### 8.1.5 Shadows
- `--shadow-card`: `0 4px 14px rgba(0,0,0,0.3)` (for cards on dark bg)
- `--shadow-button`: `0 4px 0px <darken 20%>` (Duolingo 3D button effect)
- `--shadow-button-pressed`: `0 0px 0px` + `translateY(4px)` (press-down illusion)

#### 8.1.6 Button Component Specification
**Primary Button ("Lock In", "Start Game", "Cast Vote")**
- Background: `--color-primary`
- Bottom border / box-shadow: `0 4px 0 #46A302` (3D raised effect)
- Border-radius: `--radius-xl`
- Text: white, 18px bold, uppercase
- Min height: 56px
- On press: `translateY(4px)`, shadow collapses → gives physical press feel
- Framer Motion: `whileTap={{ scale: 0.97, y: 4 }}`

**Danger Button ("Vote", "Kick")**
- Background: `--color-danger`
- Bottom shadow: `0 4px 0 #EA2B2B`

**Ghost Button ("Skip", secondary actions)**
- Background: transparent
- Border: 2px solid `--color-secondary`
- Text: `--color-secondary`

### 8.2 Component Library

#### PlayerCard
- Props: `name`, `answer` (hidden/shown), `isLocked`, `isSelf`, `isImposter` (only shown post-reveal)
- States: Waiting (pulsing dots), Locked (padlock), Revealed (answer + name), Imposter (red glow border)
- Size: 160×100px on shared screen; full-width on mobile
- Animation: Card flip on reveal (3D CSS transform with Framer Motion)

#### RoleCard
- Props: `role` (crew|imposter), `prompt`
- Crew: green gradient background, shield icon, prompt text
- Imposter: dark red gradient background, skull icon, prompt text
- Reveal animation: 3D flip (Y-axis, 600ms), then a scale+bounce settle

#### VoteButton
- Props: `player`, `answer`, `isSelected`, `isDisabled`
- Full-width, 64px min-height
- Selected state: green border + checkmark + scale 1.02
- Disabled (self): 50% opacity, cursor-not-allowed

#### CountdownRing
- SVG-based circular progress
- Props: `total`, `remaining`, `size`
- Color transitions via Framer Motion as `remaining/total` crosses 0.3 and 0.1 thresholds

#### ScoreRow
- Props: `rank`, `name`, `score`, `delta`, `isMe`
- `delta` shows score change (+1, +2) with a floating number animation
- Rank change: row animates reordering via Framer Motion `layout` prop

#### RoomCodeDisplay
- Large, spaced characters (letter-spacing: 8px)
- Each character in its own rounded pill
- Tap-to-copy functionality with checkmark confirmation

---

## 9. Screen-by-Screen Flow

### 9.1 Home Screen (Mobile)
```
┌─────────────────────────┐
│   🕵️ Find The Imposter  │  (title, animated entry)
│                         │
│  ┌───────────────────┐  │
│  │  [ CREATE ROOM ]  │  │  (large green primary button)
│  └───────────────────┘  │
│                         │
│  ┌───────────────────┐  │
│  │   [ JOIN ROOM ]   │  │  (large secondary button)
│  └───────────────────┘  │
│                         │
│   ──── or ────          │
│   [ Enter Room Code ]   │  (text input, 6 chars)
│   [ JOIN ]              │
└─────────────────────────┘
```
- **Entry animation:** Title bounces in from top. Buttons fade+slide up staggered.
- The mascot (a cartoon detective silhouette) peeks in from the right edge.

### 9.2 Name Entry Screen (Mobile)
```
┌─────────────────────────┐
│  ← Back                 │
│                         │
│  What's your name?      │
│  ┌─────────────────┐    │
│  │  Adel           │    │
│  └─────────────────┘    │
│                         │
│  [ LET'S PLAY →  ]      │
└─────────────────────────┘
```

### 9.3 Lobby Screen — Shared Display
```
┌──────────────────────────────────────────┐
│  Find The Imposter              [QR CODE] │
│                                           │
│  Join at: findtheimposter.app/j/          │
│  Room Code:  Z X K R 4 7                 │
│                                           │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐   │
│  │ Sara │ │Khalid│ │ Adel │ │  +  │    │
│  │  👑  │ │      │ │      │ │      │   │
│  └──────┘ └──────┘ └──────┘ └──────┘   │
│                                           │
│  4 / 10 players    [HOST: START GAME]    │
└──────────────────────────────────────────┘
```

### 9.4 Role Reveal Screen (Mobile)
```
┌─────────────────────────┐
│   ROUND 1 OF 7          │
│                         │
│  ┌───────────────────┐  │
│  │  🛡️  CREW MEMBER  │  │  (green card, flip animation)
│  │                   │  │
│  │  How many hours   │  │
│  │  of sleep do you  │  │
│  │  get per night?   │  │
│  │                   │  │
│  │  Keep this SECRET │  │
│  └───────────────────┘  │
│                         │
│  [ Ready to answer ]    │
└─────────────────────────┘
```
Imposter variant: Dark red card, skull icon, different prompt.

### 9.5 Answer Submission Screen (Mobile)
```
┌─────────────────────────┐
│   ⏳  42s remaining     │
│   4/6 players locked in │
│                         │
│  Your answer:           │
│  ┌─────────────────┐   │
│  │  7              │   │
│  └─────────────────┘   │
│                         │
│  [ LOCK IN MY ANSWER ]  │
└─────────────────────────┘
```

### 9.6 Answer Reveal Screen — Shared Display
```
┌──────────────────────────────────────────┐
│  Round 1 of 7         Revealing answers! │
│                                           │
│  ┌────────┐ ┌────────┐ ┌────────┐       │
│  │  Sara  │ │ Khalid │ │  Adel  │       │
│  │   7    │ │  12 ❓ │ │   8    │       │  ← cards flipping
│  └────────┘ └────────┘ └────────┘       │
│                                           │
│  ┌────────┐ ┌────────┐ ┌────────┐       │
│  │  Noor  │ │  Omar  │ │  Jess  │       │
│  │   6    │ │   7    │ │  ❓    │       │
│  └────────┘ └────────┘ └────────┘       │
└──────────────────────────────────────────┘
```

### 9.7 Debate Screen — Shared Display
```
┌──────────────────────────────────────────┐
│  DEBATE TIME!              ⬤ 00:43      │  ← countdown ring
│                                           │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐   │
│  │Sara 7│ │Khal12│!│Adel 8│ │Noor 6│   │  ← Khalid has sus mark
│  └──────┘ └──────┘ └──────┘ └──────┘   │
│                                           │
│  Defend your answer. Find the imposter!  │
└──────────────────────────────────────────┘
```

### 9.8 Voting Screen (Mobile)
```
┌─────────────────────────┐
│  🗳️  VOTE NOW!          │
│  Who is the Imposter?   │
│  ⏱ 24s remaining       │
│                         │
│  ┌───────────────────┐  │
│  │  Khalid    "12"   │  │  ← tapped, green checkmark
│  └───────────────────┘  │
│  ┌───────────────────┐  │
│  │  Sara       "7"   │  │
│  └───────────────────┘  │
│  ┌───────────────────┐  │
│  │  Adel       "8"   │  │
│  └───────────────────┘  │
│                         │
│  [ CAST MY VOTE ]       │
└─────────────────────────┘
```

### 9.9 Round Result Screen — Shared Display
```
┌──────────────────────────────────────────┐
│  🎉 CREW WINS THIS ROUND!                │
│                                           │
│  The Imposter was: KHALID                 │
│                                           │
│  Crew prompt: "Hours of sleep per night" │
│  Imposter prompt: "Cups of coffee/day"   │
│                                           │
│  ──── Scores ────                         │
│  1. Sara     ███████ 3pts  (+1)           │
│  2. Khalid   ████    2pts  (+0)           │
│  3. Adel     ██      1pts  (+1)           │
│                                           │
│  [HOST: NEXT ROUND →]                    │
└──────────────────────────────────────────┘
```

### 9.10 Final Scoreboard — Shared Display
```
┌──────────────────────────────────────────┐
│  🏆  GAME OVER  🏆                       │
│                                           │
│  🥇  Sara         14 pts   🎊            │
│  🥈  Adel         11 pts                 │
│  🥉  Khalid        9 pts                 │
│  4.  Noor          7 pts                 │
│  5.  Omar          5 pts                 │
│                                           │
│  [ PLAY AGAIN ]    [ SHARE RESULTS ]     │
└──────────────────────────────────────────┘
```

---

## 10. Animation System (Framer Motion)

### 10.1 Animation Philosophy
Every transition has a purpose: confirm an action, build anticipation, or deliver a reward. Animations must feel snappy (< 400ms for interactive feedback) and theatrical (600–1000ms for reveal moments).

### 10.2 Animation Inventory

#### 10.2.1 Card Flip (Answer Reveal)
```jsx
// Framer Motion 3D card flip
const flipVariants = {
  hidden: { rotateY: 90, opacity: 0 },
  visible: {
    rotateY: 0,
    opacity: 1,
    transition: { duration: 0.5, ease: [0.215, 0.61, 0.355, 1] }
  }
};

// Stagger container
const containerVariants = {
  visible: {
    transition: { staggerChildren: 0.08 }
  }
};
```

#### 10.2.2 Role Card Flip (Round Start)
```jsx
// Full 3D flip with bounce settle
const roleRevealVariants = {
  initial: { rotateY: 180, scale: 0.8 },
  animate: {
    rotateY: 0,
    scale: 1,
    transition: {
      rotateY: { duration: 0.6, ease: 'easeOut' },
      scale: { duration: 0.4, delay: 0.3, type: 'spring', stiffness: 200, damping: 12 }
    }
  }
};
```

#### 10.2.3 Button Press (Duolingo 3D Push)
```jsx
const primaryButtonProps = {
  whileTap: { scale: 0.97, y: 4 },
  transition: { type: 'spring', stiffness: 500, damping: 30 }
};
// CSS: box-shadow transitions from '0 4px 0 #46A302' to '0 0px 0 #46A302' on tap
```

#### 10.2.4 Lock-In Confirmation
```jsx
// Checkmark appears with a scale+rotate pop
const checkmarkVariants = {
  initial: { scale: 0, rotate: -45 },
  animate: {
    scale: 1, rotate: 0,
    transition: { type: 'spring', stiffness: 300, damping: 15 }
  }
};
```

#### 10.2.5 Score Delta Float
```jsx
// Floating "+1" that rises and fades
const scoreDelta = {
  initial: { opacity: 1, y: 0 },
  animate: {
    opacity: 0, y: -40,
    transition: { duration: 1.2, ease: 'easeOut' }
  }
};
```

#### 10.2.6 Leaderboard Reorder
```jsx
// Use Framer Motion layout animations
// Each ScoreRow: <motion.div layout layoutId={player.id}>
// Framer Motion automatically animates position changes
```

#### 10.2.7 Imposter Reveal Shatter
```jsx
// When Imposter is caught: avatar card breaks into particles
// Implemented as: scale to 1.2 → rapid shake → scale to 0 + blur
const shatterVariants = {
  animate: [
    { scale: 1.2, duration: 0.15 },
    { x: [-5, 5, -5, 5, 0], duration: 0.3 },
    { scale: 0, opacity: 0, filter: 'blur(8px)', duration: 0.4 }
  ]
};
```

#### 10.2.8 Confetti Burst (Game Winner)
- Use `canvas-confetti` or `react-confetti` library.
- Triggered for 1st place on the final scoreboard.
- 3-second burst, then fades.

#### 10.2.9 Countdown Ring
```jsx
// SVG circle with animated strokeDashoffset
// Color transitions via Framer Motion animate
const ringColor = useMotionValue('#58CC02');
useEffect(() => {
  if (pct < 0.1) animate(ringColor, '#FF4B4B', { duration: 0.5 });
  else if (pct < 0.3) animate(ringColor, '#FF9600', { duration: 0.5 });
}, [pct]);
```

#### 10.2.10 Page Transitions
```jsx
// Slide-up entrance for all phone screens
const pageVariants = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.2 } }
};
// Wrap all routes in <AnimatePresence mode="wait">
```

#### 10.2.11 Player Join Pop (Lobby)
```jsx
// Each player card animates in when they join
const playerJoinVariants = {
  initial: { scale: 0, opacity: 0 },
  animate: {
    scale: 1, opacity: 1,
    transition: { type: 'spring', stiffness: 260, damping: 20 }
  }
};
```

#### 10.2.12 Sus Mark Flash
```jsx
// Red glow pulses on targeted player card
const susGlow = {
  animate: {
    boxShadow: ['0 0 0px #FF4B4B', '0 0 20px #FF4B4B', '0 0 8px #FF4B4B'],
    transition: { duration: 1.5, repeat: Infinity }
  }
};
```

---

## 11. Technical Architecture

### 11.1 System Overview

```
┌─────────────────────────────────────────────────────────┐
│                      CLIENTS                            │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │
│  │ Player Phone│  │ Player Phone│  │ Shared Screen│    │
│  │  (React PWA)│  │  (React PWA)│  │  (React PWA) │    │
│  └──────┬──────┘  └──────┬──────┘  └──────┬───────┘    │
└─────────┼────────────────┼────────────────┼────────────┘
          │                │                │
     WebSocket        WebSocket         WebSocket
          │                │                │
┌─────────▼────────────────▼────────────────▼────────────┐
│                    API GATEWAY                          │
│              (Nginx / Cloudflare)                       │
└─────────────────────┬───────────────────────────────────┘
                      │  HTTP + WS
┌─────────────────────▼───────────────────────────────────┐
│              GAME SERVER (Node.js + Socket.IO)           │
│  ┌───────────────┐  ┌───────────────┐                   │
│  │  REST API     │  │  WS Handler   │                   │
│  │  (Express.js) │  │  (Socket.IO)  │                   │
│  └───────┬───────┘  └───────┬───────┘                   │
│          └──────────┬────────┘                          │
│              ┌──────▼──────┐                            │
│              │  Game Logic │                            │
│              │  Engine     │                            │
│              └──────┬──────┘                            │
└─────────────────────┼───────────────────────────────────┘
                      │
        ┌─────────────┼─────────────┐
        │             │             │
┌───────▼──────┐ ┌───▼──────┐ ┌───▼───────────┐
│  PostgreSQL  │ │  Redis   │ │  S3/CDN       │
│  (Supabase)  │ │(Upstash) │ │  (Assets)     │
└──────────────┘ └──────────┘ └───────────────┘
```

### 11.2 Frontend Stack

| Layer | Technology | Rationale |
|-------|------------|----------|
| Framework | React 18 + Vite | Fast HMR, modern concurrent features |
| Routing | React Router v6 | Simple, battle-tested SPA routing |
| Animation | Framer Motion 11 | Required per spec; best-in-class React animation |
| Real-time | Socket.IO Client | Pairs with server; auto-reconnect, fallback |
| State | Zustand | Lightweight global state; no boilerplate |
| Styling | Tailwind CSS v3 + CSS Modules | Utility-first for speed; modules for complex components |
| Forms | React Hook Form | Performant, native-feeling inputs |
| PWA | Vite PWA Plugin | Offline-capable, installable |
| Fonts | Google Fonts (Nunito) | Self-hosted for performance |
| Sounds | Howler.js | Lightweight audio for SFX |
| QR Code | qrcode.react | Client-side QR generation |
| Confetti | canvas-confetti | Lightweight celebratory burst |
| Testing | Vitest + React Testing Library | Unit + integration tests |
| E2E | Playwright | Cross-browser E2E tests |

### 11.3 Backend Stack

| Layer | Technology | Rationale |
|-------|------------|----------|
| Runtime | Node.js 20 LTS | Excellent WS support, NPM ecosystem |
| Framework | Express.js 4 | Lightweight HTTP server |
| WebSockets | Socket.IO 4 | Rooms, namespaces, ACKs, auto-reconnect |
| Database | PostgreSQL (Supabase) | Relational, ACID, JSON support for flexible data |
| Cache / PubSub | Redis (Upstash) | Session storage, room state, pub/sub for horizontal scaling |
| Auth | JWT (jsonwebtoken) | Stateless, simple for this use case |
| Validation | Zod | Type-safe schema validation |
| Profanity Filter | bad-words library + custom list | Content safety |
| Logging | Pino | Fast, structured JSON logging |
| Testing | Jest + Supertest | Unit + integration testing |
| ORM | Prisma | Type-safe DB queries, migrations |

### 11.4 Infrastructure & Deployment

| Component | Service | Notes |
|-----------|---------|-------|
| Frontend hosting | Vercel | CDN-first, instant deploys |
| Backend hosting | Railway (or Render) | WebSocket-compatible, auto-scale |
| Database | Supabase (PostgreSQL) | Managed, free tier available |
| Redis | Upstash | Serverless Redis, WS pub/sub |
| CDN / Assets | Cloudflare R2 | Audio SFX, images |
| Domain | Cloudflare DNS | DDoS protection |
| Monitoring | Sentry (errors) + Axiom (logs) | |
| Analytics | PostHog | Self-hostable, event tracking |

### 11.5 Horizontal Scaling Strategy
Socket.IO sessions use Redis Pub/Sub (via `@socket.io/redis-adapter`) so that:
- Multiple Node.js instances can serve different WebSocket connections for the same room.
- A message emitted on Instance A reaches all clients on Instance B in the same room.
- Session tokens validated against Redis (not in-memory) so any instance can authenticate any player.

---

## 12. Database Design

### 12.1 Schema

```sql
-- Rooms
CREATE TABLE rooms (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code          VARCHAR(6) UNIQUE NOT NULL,
  host_id       UUID NOT NULL REFERENCES players(id),
  status        VARCHAR(20) NOT NULL DEFAULT 'LOBBY',
    -- LOBBY | ROUND_START | SUBMISSION | REVEAL | DEBATE | VOTING | ROUND_RESULT | FINISHED
  total_rounds  INT NOT NULL DEFAULT 7,
  current_round INT NOT NULL DEFAULT 0,
  debate_timer  INT NOT NULL DEFAULT 60,  -- seconds
  created_at    TIMESTAMPTZ DEFAULT now(),
  expires_at    TIMESTAMPTZ DEFAULT now() + interval '4 hours'
);

-- Players (ephemeral, per-room)
CREATE TABLE players (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id       UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  display_name  VARCHAR(16) NOT NULL,
  session_token VARCHAR(512) NOT NULL,
  is_host       BOOLEAN NOT NULL DEFAULT false,
  is_connected  BOOLEAN NOT NULL DEFAULT true,
  score         INT NOT NULL DEFAULT 0,
  joined_at     TIMESTAMPTZ DEFAULT now()
);

-- Rounds
CREATE TABLE rounds (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id           UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  round_number      INT NOT NULL,
  prompt_pair_id    UUID NOT NULL REFERENCES prompt_pairs(id),
  imposter_id       UUID NOT NULL REFERENCES players(id),
  status            VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
  started_at        TIMESTAMPTZ DEFAULT now(),
  reveal_at         TIMESTAMPTZ,
  debate_ends_at    TIMESTAMPTZ,
  voting_ends_at    TIMESTAMPTZ,
  result            VARCHAR(20),  -- CREW_WIN | IMPOSTER_WIN | TIE
  UNIQUE(room_id, round_number)
);

-- Answers
CREATE TABLE answers (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  round_id    UUID NOT NULL REFERENCES rounds(id) ON DELETE CASCADE,
  player_id   UUID NOT NULL REFERENCES players(id),
  answer_text VARCHAR(12) NOT NULL,
  locked_at   TIMESTAMPTZ DEFAULT now(),
  UNIQUE(round_id, player_id)
);

-- Votes
CREATE TABLE votes (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  round_id      UUID NOT NULL REFERENCES rounds(id) ON DELETE CASCADE,
  voter_id      UUID NOT NULL REFERENCES players(id),
  target_id     UUID REFERENCES players(id),  -- NULL = abstain
  cast_at       TIMESTAMPTZ DEFAULT now(),
  UNIQUE(round_id, voter_id)
);

-- Prompt Pairs
CREATE TABLE prompt_pairs (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  crew_prompt           TEXT NOT NULL,
  imposter_prompt       TEXT NOT NULL,
  category              VARCHAR(50),
  difficulty            VARCHAR(10) NOT NULL DEFAULT 'easy',
  expected_answer_type  VARCHAR(10) NOT NULL DEFAULT 'number',  -- number | word
  min_players           INT NOT NULL DEFAULT 4,
  tags                  TEXT[] DEFAULT '{}',
  is_active             BOOLEAN DEFAULT true,
  created_at            TIMESTAMPTZ DEFAULT now()
);

-- Imposter History (per room, for role rotation)
CREATE TABLE imposter_history (
  room_id     UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  player_id   UUID NOT NULL REFERENCES players(id),
  round_id    UUID NOT NULL REFERENCES rounds(id),
  cycle       INT NOT NULL DEFAULT 1,  -- resets when all players have been Imposter
  PRIMARY KEY (room_id, player_id, cycle)
);

-- Indexes
CREATE INDEX idx_rooms_code ON rooms(code);
CREATE INDEX idx_players_room ON players(room_id);
CREATE INDEX idx_rounds_room ON rounds(room_id);
CREATE INDEX idx_answers_round ON answers(round_id);
CREATE INDEX idx_votes_round ON votes(round_id);
```

### 12.2 Redis Keys (Session State)
```
room:{code}:state          → JSON blob of current room state (TTL: 4h)
room:{code}:players        → Set of player IDs
room:{code}:round:{n}:answers  → Hash of playerID → answer (revealed only after all submitted)
session:{token}            → JSON { playerId, roomCode, role } (TTL: 4h)
```

---

## 13. API Design

### 13.1 REST Endpoints

#### Rooms
```
POST   /api/rooms                    → Create room
         Body: { hostName: string, settings: RoomSettings }
         Response: { roomCode, playerId, sessionToken, shareUrl, qrCodeUrl }

GET    /api/rooms/:code              → Get room info (lobby state)
         Response: { players, status, settings }

POST   /api/rooms/:code/join         → Join a room
         Body: { displayName: string }
         Response: { playerId, sessionToken }

DELETE /api/rooms/:code/players/:id  → Kick a player (host only)
```

#### Game
```
POST   /api/rooms/:code/start        → Start the game (host only)
POST   /api/rooms/:code/rounds/:n/answer  → Submit answer
         Body: { answer: string }
POST   /api/rooms/:code/rounds/:n/vote    → Cast vote
         Body: { targetPlayerId: string | null }
POST   /api/rooms/:code/advance      → Advance game phase (host only, skip timer)
POST   /api/rooms/:code/pause        → Pause game (host only)
POST   /api/rooms/:code/end          → End game early (host only)
```

#### Content
```
GET    /api/prompts/random           → Get a random sample (for preview/demo)
```

### 13.2 WebSocket Events

#### Server → All Clients (Broadcast)
```
PLAYER_JOINED         { player: Player }
PLAYER_LEFT           { playerId, newHostId? }
GAME_STARTED          { totalRounds, settings }
ROUND_STARTED         { roundNumber }
PLAYER_LOCKED_IN      { playerId }                     // no answer
ALL_LOCKED_IN         {}                               // trigger reveal
REVEAL                { answers: Array<{playerId, answer}> }
DEBATE_STARTED        { endsAt: ISO8601 }
VOTING_STARTED        { endsAt: ISO8601 }
VOTE_PROGRESS         { votedCount, totalCount }       // no player IDs
ROUND_RESULT          { result, imposterId, crewPrompt, imposterPrompt, votes, scores }
SCOREBOARD_UPDATE     { players: Array<{id, name, score, rank}> }
GAME_OVER             { finalScores, winner }
GAME_PAUSED           {}
GAME_RESUMED          {}
HOST_CHANGED          { newHostId }
SUS_MARK              { targetId, markerId }           // debate phase
```

#### Server → Individual Client (Private)
```
ROLE_ASSIGNED         { role: 'crew'|'imposter', prompt: string }
YOUR_ANSWER_CONFIRMED { answer: string }
YOUR_VOTE_CONFIRMED   { targetId }
SESSION_RESTORED      { gameState }                   // on reconnect
```

#### Client → Server
```
SUBMIT_ANSWER         { answer: string }
SUBMIT_VOTE           { targetPlayerId: string | null }
MARK_SUS              { targetPlayerId: string }
HOST_ADVANCE          {}
HOST_PAUSE            {}
HOST_RESUME           {}
HOST_KICK             { playerId: string }
```

---

## 14. Real-Time Event System

### 14.1 Connection Flow
1. Client connects to Socket.IO server with auth: `{ sessionToken }`.
2. Server validates token, retrieves room/player from Redis.
3. Server joins the socket to room: `socket.join(roomCode)`.
4. Server emits `SESSION_RESTORED` with current game state (handles page refresh / reconnect).

### 14.2 Room Namespacing
- Each room is a Socket.IO room: `socket.to(roomCode).emit(event, data)`.
- The shared display and all player phones are in the same Socket.IO room.
- Private messages use `socket.to(socket.id).emit()` (direct to specific socket).

### 14.3 State Machine
The game server maintains a state machine per room:
```
LOBBY
  → (host starts) → ROUND_START
  → (3s delay) → SUBMISSION
  → (all submit OR timer) → REVEAL
  → (3s delay) → DEBATE
  → (timer ends) → VOTING
  → (all vote OR timer) → ROUND_RESULT
  → (if more rounds) → ROUND_START
  → (if last round) → FINISHED
```
Each state transition is atomic (Redis-locked) to prevent race conditions with concurrent requests.

### 14.4 Timer Management
- All timers run on the server (NOT the client).
- Clients receive an `endsAt` ISO timestamp and display a countdown locally.
- This prevents drift from client clock differences.
- `setTimeout` on server fires the state transition; client UI is a purely visual countdown.

### 14.5 Reconnection Handling
- Socket.IO auto-reconnects on disconnect.
- On reconnect, `SESSION_RESTORED` carries:
  - Current phase
  - Current round data (answers visible if past REVEAL, etc.)
  - Player's role (if SUBMISSION/DEBATE phase)
  - Whether the player has already submitted/voted
- Player can seamlessly re-enter a game in progress.

---

## 15. Question Database — Content Specification

### 15.1 Design Principles for Prompt Pairs

1. **Numerical prompts:** Both crew and imposter prompts should elicit numbers in a similar range. This is the core deception mechanism.
2. **Word prompts:** Both prompts should elicit words from a similar semantic domain.
3. **No double meanings:** A prompt must have an obvious, single-type answer (not "could be a number or a word").
4. **Plausible bluff:** The Imposter's prompt must give them a chance to explain their answer convincingly if challenged. The goal is tension, not a guaranteed catch.
5. **Universal accessibility:** Avoid references to specific countries, sports, celebrities, or events that a subset of players wouldn't know.

### 15.2 Categories

| Category | Description | # Pairs (Launch Target) |
|----------|-------------|------------------------|
| Daily Life | Routines, habits, personal quantities | 80 |
| Food & Drink | Eating habits, quantities, preferences | 70 |
| Body & Health | Physical stats, exercise, sleep | 60 |
| Technology | Devices, apps, screen time | 50 |
| Social & Relationships | Friends, calls, messages | 50 |
| Travel & Adventure | Trips, distances, transport | 40 |
| Work & Productivity | Hours, tasks, focus | 40 |
| Entertainment | Movies, games, music | 50 |
| Words (non-numeric) | Single-word answers | 60 |
| **Total** | | **500** |

### 15.3 Sample Prompt Pairs (30 Examples)

| # | Crew Prompt | Imposter Prompt | Category | Difficulty | Type |
|---|-------------|-----------------|----------|------------|------|
| 1 | How many hours of sleep do you get per night? | How many cups of coffee do you drink per day? | Daily Life | Easy | Number |
| 2 | How many times do you shower per week? | How many meals do you eat per day? | Daily Life | Easy | Number |
| 3 | How many apps are on your phone's home screen? | How many tabs do you have open right now? | Technology | Medium | Number |
| 4 | How many hours a day do you spend on your phone? | How many hours a day do you spend watching TV? | Technology | Hard | Number |
| 5 | How many text messages do you send per day? | How many emails do you send per day? | Social | Hard | Number |
| 6 | How many steps do you walk per day (in thousands)? | How many floors of stairs do you climb per day? | Body | Medium | Number |
| 7 | How many glasses of water do you drink per day? | How many fruits do you eat per day? | Food | Easy | Number |
| 8 | How many slices of pizza can you eat in one sitting? | How many pieces of sushi can you eat in one sitting? | Food | Medium | Number |
| 9 | How many hours per week do you exercise? | How many hours per week do you cook? | Daily Life | Medium | Number |
| 10 | How many countries have you visited? | How many cities have you lived in? | Travel | Medium | Number |
| 11 | How many languages do you speak? | How many musical instruments can you play? | Social | Easy | Number |
| 12 | How many hours do you work per day? | How many hours do you study per day? | Work | Hard | Number |
| 13 | At what age did you get your first phone? | At what age did you learn to drive? | Daily Life | Medium | Number |
| 14 | How many unread notifications do you have right now? | How many unread emails do you have? | Technology | Easy | Number |
| 15 | How many hours did you last sleep? | How many hours ago did you last eat? | Daily Life | Hard | Number |
| 16 | How many movies have you watched this month? | How many books have you read this year? | Entertainment | Hard | Number |
| 17 | How many friends do you have saved in your phone? | How many followers do you have on social media (in hundreds)? | Social | Medium | Number |
| 18 | How many times have you been on an airplane? | How many times have you been on a train? | Travel | Medium | Number |
| 19 | How many pairs of shoes do you own? | How many shirts do you own? | Daily Life | Easy | Number |
| 20 | What floor of an apartment would you prefer to live on? | How many rooms does your ideal house have? | Daily Life | Hard | Number |
| 21 | Name an animal that lives in the ocean | Name an animal with four legs | Words | Easy | Word |
| 22 | Name a color associated with royalty | Name a color associated with danger | Words | Medium | Word |
| 23 | Name a sport played on grass | Name a sport played in water | Words | Easy | Word |
| 24 | Name something you find in a kitchen | Name something you find in a bathroom | Words | Hard | Word |
| 25 | Name a fruit that is yellow | Name a fruit that is red | Words | Hard | Word |
| 26 | Name something people do on weekends | Name something people do on Monday mornings | Words | Hard | Word |
| 27 | Name a vehicle that goes on water | Name a vehicle that goes in the air | Words | Medium | Word |
| 28 | Name something you'd bring to a beach | Name something you'd bring to a library | Words | Hard | Word |
| 29 | How many hours until your next meal? | How many hours until you go to sleep? | Daily Life | Hard | Number |
| 30 | How many minutes does your morning routine take? | How many minutes does your commute take? | Daily Life | Medium | Number |

### 15.4 Content Moderation
- All prompts manually reviewed before activation.
- `is_active: false` for prompts pending review or flagged by users.
- Players can flag a prompt as inappropriate during the round result screen (post-MVP).
- Adult/NSFW prompt pack disabled by default; host opt-in (18+ confirmation, post-MVP).

---

## 16. Room Sharing System

### 16.1 Sharing Methods (Priority Order)

#### Method 1: QR Code (Highest Usability)
- Displayed prominently on the shared screen (TV/laptop).
- Generated client-side using `qrcode.react`.
- Contains the direct join URL: `https://findtheimposter.app/j/ZXKR47`
- Visible immediately after room creation, before game starts.
- Players in the same physical space can scan without any typing.
- **UX:** Large enough to scan from 6 feet (TV screen) — minimum 200×200px on display.

#### Method 2: Short URL
- Format: `findtheimposter.app/j/ZXKR47`
- Displayable on the shared screen below the QR code.
- Copyable with one tap on the host's phone.
- Can be pasted into a group chat, Discord, Twitch chat, etc.
- **UX:** URL is displayed with each character visually separated for easy reading/typing.

#### Method 3: Room Code
- 6-character code, displayable as spoken communication ("Join with code ZXKR47").
- Players enter on the home screen or a join page.
- **UX:** Code displayed in a large, pill-formatted font on the shared screen. Ambiguous chars excluded.

#### Method 4: Native Share API
- On the host's phone, a "Share" button triggers the native OS share sheet.
- Share content: "Join my game of Find The Imposter! 🕵️ [URL]"
- Works for WhatsApp, iMessage, Telegram, Discord, Instagram DMs, etc.
- Falls back to clipboard copy if Web Share API is unavailable.

#### Method 5: Deep Link via NFC (Post-MVP)
- Host's phone can write the join URL to NFC tag for tap-to-join.

### 16.2 Streaming-Specific Support
- The shared screen URL (`/display/:code`) has a "Clean Mode" toggle: hides UI chrome, shows only game content at high contrast — optimized for OBS capture.
- Room code is always visible in the top-right corner during gameplay (small but readable at 1080p).
- A dedicated "Streamer Mode" overlays a stylized banner: "Join at: findtheimposter.app • Code: ZXKR47" — permanently visible as a stream overlay element.

### 16.3 Room Code Format Specification
- Length: 6 characters.
- Character set: A–Z and 2–9 (excludes I, O, 0, 1 to prevent confusion).
- Generation: `crypto.randomBytes` + mapping to character set (server-side, Node.js).
- Uniqueness: Checked against active rooms in the database before returning.
- Collision probability: 26^6 = ~308 million combinations; negligible collision risk at <500 concurrent rooms.

---

## 17. Accessibility Requirements

### 17.1 WCAG Compliance
Target: **WCAG 2.1 Level AA** for all primary user flows.

### 17.2 Requirements

| Requirement | Specification |
|-------------|---------------|
| Color contrast | All text/background combinations ≥ 4.5:1 ratio |
| Touch targets | Minimum 48×48px for all interactive elements |
| Font size | Minimum 16px for body text; 14px absolute minimum |
| Focus indicators | Visible 2px focus ring on all interactive elements |
| Screen reader | Semantic HTML; ARIA labels on icon-only buttons |
| Motion sensitivity | All animations respect `prefers-reduced-motion` media query |
| Color-blind safe | Game state never communicated by color alone (always + icon or text) |
| Keyboard navigation | Full keyboard accessibility for all desktop interactions |
| Error messages | Clearly associated with their form fields via `aria-describedby` |
| Timer alternatives | Debate countdown also shown as numeric text, not just visual ring |

### 17.3 Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  /* All Framer Motion transitions disabled / instant */
  /* Card flips become instant fades */
  /* No bouncing animations */
  /* Confetti disabled */
}
```
Implemented via Framer Motion's `useReducedMotion()` hook.

---

## 18. Performance Requirements

### 18.1 Load Time Targets

| Metric | Target | Measurement Tool |
|--------|--------|------------------|
| First Contentful Paint (FCP) | < 1.5s | Lighthouse |
| Largest Contentful Paint (LCP) | < 2.5s | Lighthouse |
| Time to Interactive (TTI) | < 3.5s | Lighthouse |
| Total bundle size (gzipped) | < 300KB | Vite bundle analyzer |
| Lighthouse Performance Score | ≥ 90 | Lighthouse CI |

### 18.2 Runtime Performance

| Metric | Target |
|--------|--------|
| WebSocket message latency (server → client) | < 100ms (p95) |
| Answer submission → confirmation | < 200ms |
| Vote cast → server acknowledgment | < 200ms |
| Simultaneous reveal (all cards flip) | Within 1 frame of receiving REVEAL event |
| Animation frame rate | Consistent 60fps on mid-range Android (Snapdragon 665) |
| Memory leak | Zero leak over 10-round session (heap stable) |

### 18.3 Scale Targets (MVP)

| Metric | Target |
|--------|--------|
| Concurrent rooms | 500 |
| Concurrent players | 5,000 |
| WebSocket connections | 5,000 |
| API requests/second | 500 |

### 18.4 Optimization Strategies
- Vite code splitting: separate chunks for Framer Motion, Socket.IO, game logic.
- Image optimization: SVG icons, WebP for any raster assets.
- Font: self-host Nunito, subset to Latin characters only.
- Socket.IO: binary encoding disabled (JSON only; shorter payloads).
- React: `memo()` on PlayerCard and VoteButton to prevent re-renders on unrelated state changes.

---

## 19. Security Considerations

### 19.1 Authentication
- Players authenticate using a JWT issued at join time.
- JWT contains: `{ playerId, roomCode, role: 'player'|'host', iat, exp }`.
- JWT is signed with HS256 and a 256-bit secret stored in environment variables.
- Token expiry: 4 hours (matches room lifetime).
- Token stored in `localStorage` (acceptable for this low-stakes, ephemeral use case).

### 19.2 Role Assignment Security
- The Imposter's identity is never broadcast; only sent in private socket messages.
- The server never includes `imposter_id` in any broadcast event payload.
- The server validates all actions against the player's session (e.g., only the host can call `/advance`).

### 19.3 Input Validation
- All inputs validated on both client AND server (client: UX; server: security).
- Answer text: server strips/rejects any input not matching `^[a-zA-Z0-9.\-]{1,12}$`.
- Display name: stripped of HTML/script tags; limited to alphanumeric + spaces + common punctuation.
- Room code: normalized to uppercase, validated against `^[A-Z2-9]{6}$`.

### 19.4 Rate Limiting
- Room creation: 3 rooms per IP per hour.
- Join attempts: 10 per IP per 5 minutes.
- Answer submission: 1 per player per round (server rejects duplicates).
- WebSocket messages: 50 events per second per connection (drops excess).

### 19.5 Anti-Cheat
- Answers are stored server-side and only revealed to clients on the `REVEAL` event.
- A client cannot request another player's role or answer through any REST endpoint.
- The shared screen is a passive receiver only — it has no special privileges.
- Voting results computed entirely server-side; clients cannot influence results by manipulating payloads.

### 19.6 Content Safety
- Profanity filter on display names and answers (server-side).
- Filtered content replaced with `****` and player is warned.
- Repeat offenders can be kicked by the host.

### 19.7 Privacy
- No personal data collected (no email, no phone, no real names required).
- Display names are ephemeral and deleted with the room after 4 hours.
- No cookies except session storage (GDPR-compliant by default).
- Analytics events are anonymized (no user ID linkable to real identity).

---

## 20. Error Handling & Edge Cases

### 20.1 Network Errors

| Error | User-Facing Message | Behavior |
|-------|--------------------|---------|
| Cannot connect to server | "Connection failed. Retrying..." | Auto-retry with exponential backoff (1s, 2s, 4s, 8s, stop) |
| WebSocket disconnected mid-game | "Reconnecting..." banner | Auto-reconnect; `SESSION_RESTORED` brings player back to current state |
| Submit answer timeout | "Couldn't reach the server. Try again." | Allow one retry; after 2 failures, mark as late submission |
| Room not found | "Room not found. Check your code." | Return to home screen |
| Server error 500 | "Something went wrong. Please try again." | Sentry error logged; player shown generic error |

### 20.2 Game Logic Edge Cases

| Scenario | Handling |
|----------|---------|
| Only the Imposter hasn't answered when timer hits 0 | Auto-lock Imposter with "—"; proceed to reveal |
| All players vote for themselves (impossible — self-vote blocked) | N/A |
| Host disconnects during voting | New host can't change the vote; votes still collected; server advances as normal |
| All players abstain from voting | Result = TIE |
| Player joins mid-round | They see "A round is in progress" screen and wait; added to game for next round |
| Player count drops below 4 mid-game | Warning shown; if drops to 3, game is paused with message "Not enough players" |
| Duplicate room codes (extremely rare) | Server retries code generation until unique; max 10 attempts |
| Question bank exhausted | System presents an "All prompts used!" screen; offers to reshuffle |

### 20.3 Input Validation Errors

| Error | Message |
|-------|---------|
| Answer contains a space | "No spaces — use one word or one number" |
| Answer too long (> 12 chars) | "Keep it short! Max 12 characters" |
| Answer contains profanity | "Let's keep it clean! Try a different answer" |
| Display name already taken | "That name's taken in this room — pick another" |
| Room code wrong length | "Room codes are 6 characters" |

---

## 21. Analytics & Instrumentation

### 21.1 Key Events to Track

| Event | Properties | Purpose |
|-------|------------|---------|
| `room_created` | settings, player_count_at_start | Funnel top |
| `player_joined` | room_age_when_joined | Drop-off analysis |
| `game_started` | player_count, rounds_configured | Engagement baseline |
| `answer_submitted` | time_taken, round_number | Engagement depth |
| `vote_cast` | time_taken, correct_vote | Gameplay quality |
| `round_completed` | result, imposter_caught_rate | Balance metrics |
| `game_completed` | rounds_played, total_duration | Session length |
| `share_triggered` | method (qr/url/native) | Virality loop |
| `player_disconnected` | phase, reconnected | Stability |
| `prompt_flagged` | prompt_id | Content quality |

### 21.2 Dashboards
- **Daily Active Rooms** (rooms created per day)
- **Session Completion Rate** (games started vs games that completed all rounds)
- **Imposter Catch Rate** (% of rounds where Imposter was caught — target: 55–65% for balance)
- **Rounds per Session** (measure of engagement)
- **Time-to-First-Answer** (speed of onboarding)
- **Share Rate** (% of rooms where share was triggered)
- **Top Prompt Pairs by Suspicion** (which pairs generate the most Sus marks)

### 21.3 Balance Tuning
The analytics dashboard will expose:
- Per-prompt-pair Imposter catch rate.
- Prompt pairs where catch rate < 30% (too easy for Imposter) → flagged for review/retirement.
- Prompt pairs where catch rate > 85% (too obvious) → flagged for review/retirement.
- Target range: **45–70% catch rate per prompt pair** for optimal tension.

---

## 22. Monetization Strategy

### 22.1 MVP (Free)
The MVP is entirely free. The goal is user acquisition and virality. Revenue is not a constraint in the first 6 months.

### 22.2 Post-MVP Monetization (V2+)

#### Tier 1: Free (Always)
- Core gameplay
- 200 standard prompt pairs
- Up to 8 players
- Standard themes

#### Tier 2: Host Pass (~$4.99 one-time or $2.99/month)
- Unlimited prompt packs (adult/party/custom themes)
- Up to 10 players
- Custom room name
- Extended game history
- Streamer mode (clean overlay)

#### Tier 3: Team/Event License ($19.99/month)
- Custom prompt packs (upload your own questions)
- Branding (logo on shared screen)
- Up to 30 players (lobby split into sub-rooms)
- Analytics export

#### Cosmetic Microtransactions (Optional)
- Custom avatar frames
- Animated reaction packs during debate
- Victory animations (alternative to confetti)
- These are purely cosmetic and do not affect gameplay.

---

## 23. Localization & Internationalization

### 23.1 MVP Languages
- **English (US)** — Primary, launch language
- **Arabic (AR)** — High priority (target audience region); RTL layout support required

### 23.2 RTL Support (Arabic)
- Use CSS `dir="rtl"` on the root element when Arabic is selected.
- All Flexbox/Grid layouts to use `start`/`end` instead of `left`/`right`.
- Framer Motion animations: reverse directional animations for RTL (slide-in from right becomes from left).
- Font: Arabic uses a fallback font stack (`Noto Sans Arabic`, system-ui).
- Number formatting: standard western numerals (١٢٣ → 123) as players submit numbers in standard form.

### 23.3 Post-MVP Languages
- Spanish (ES)
- French (FR)
- German (DE)
- Turkish (TR)
- Indonesian (ID)

### 23.4 i18n Implementation
- Library: `react-i18next`
- All user-facing strings extracted to JSON locale files.
- Date/time formatted using `Intl.DateTimeFormat`.
- Numbers formatted using `Intl.NumberFormat`.
- Language detection: browser `navigator.language`, with manual override in settings.

### 23.5 Content Localization
- Prompt pairs will be translated per language.
- Culturally specific prompts will be replaced with local equivalents (not direct translations).
- The Arabic prompt set will include culturally relevant scenarios.

---

## 24. Testing Strategy

### 24.1 Unit Tests
- Role assignment algorithm (all edge cases: first round, reset cycle, last player standing).
- Vote result calculation (CREW_WIN, IMPOSTER_WIN, TIE).
- Room code generation (format validation, no ambiguous chars).
- Answer validation (regex tests, edge inputs).
- Score calculation (all outcome combinations).

### 24.2 Integration Tests
- Full round lifecycle: room create → join → start → submit → reveal → vote → result.
- Player reconnection during each phase.
- Host kick player.
- Prompt pair consumption and exhaustion.

### 24.3 End-to-End Tests (Playwright)
- Complete 3-round game with 4 players (simulated via headless browsers).
- Mobile viewport tests (375px width).
- QR code display validation.
- Timer expiry handling (answer not submitted, vote not cast).
- Host disconnect and re-host promotion.

### 24.4 Performance Tests
- Load test: 500 concurrent rooms × 10 players = 5,000 concurrent WS connections.
- Stress test: burst to 8,000 connections (verify graceful degradation).
- Lighthouse CI on every pull request.

### 24.5 Accessibility Tests
- axe-core automated accessibility audit on every Playwright E2E run.
- Manual screen reader testing (VoiceOver + NVDA) on the join and answer submission flows.
- Color contrast validation (automated via Storybook a11y addon).

### 24.6 Playtest Protocol
- Internal dogfood sessions: 2 playtests per week during development (minimum 4 players).
- Beta playtest with 20 external users before launch.
- Streamer beta: 3 Twitch streamers given early access 2 weeks before launch.

---

## 25. Go-to-Market & Launch Strategy

### 25.1 Pre-Launch (T-4 weeks)
- [ ] Create a landing page with "Notify me" signup.
- [ ] Produce a 60-second gameplay demo video.
- [ ] Seed on Reddit (r/WebGames, r/boardgames, r/gaming).
- [ ] Reach out to 10 mid-tier Twitch streamers for beta access.
- [ ] Create a Product Hunt draft listing.

### 25.2 Launch Week
- [ ] Post on Product Hunt.
- [ ] Post on Hacker News (Show HN).
- [ ] Post on Twitter/X and TikTok (gameplay clip).
- [ ] Email list activation.
- [ ] Reach out to gaming journalists.

### 25.3 Growth Loops
1. **Viral sharing:** Every game creates a shareable result card with the game URL → organic social spread.
2. **Streamer content:** Streamers playing live creates watch-party demand → viewers join URLs from stream.
3. **Zero-friction onboarding:** < 60 seconds from landing page to playing → low barrier for impulse sharing.
4. **Word-of-mouth at parties:** Physical game night usage → "What was that game?" → next party's host looks it up.

---

## 26. Success Metrics & KPIs

### 26.1 North Star Metric
> **Completed Game Sessions per Week**
> (A completed session = all configured rounds finished with ≥ 4 players)

### 26.2 Primary KPIs

| KPI | Target (Month 1) | Target (Month 3) | Target (Month 6) |
|-----|-----------------|-----------------|------------------|
| Rooms created / week | 500 | 3,000 | 10,000 |
| Completed sessions / week | 300 | 2,000 | 7,000 |
| Average rounds / session | ≥ 5 | ≥ 6 | ≥ 6.5 |
| Average players / room | ≥ 4 | ≥ 5 | ≥ 5.5 |
| Share action rate | 15% | 25% | 35% |
| Day-7 retention (rooms hosted again) | 10% | 20% | 30% |
| Imposter catch rate (per round) | 50–65% | 50–65% | 55–65% |

### 26.3 Quality KPIs

| KPI | Target |
|-----|-------|
| Page load time (LCP) | < 2.5s |
| Game error rate (crashes/errors per session) | < 1% |
| WebSocket reconnection success rate | > 98% |
| Accessibility score (axe) | 0 critical violations |

---

## 27. Product Roadmap

### Phase 1 — MVP (Weeks 1–8)
**Goal:** Playable, polished core game.

| Feature | Week |
|---------|------|
| Project setup (React + Node + Socket.IO + Supabase) | 1 |
| Room creation, join, lobby, QR code sharing | 2 |
| Role assignment engine + WebSocket events | 3 |
| Answer submission UI + server-side collection | 4 |
| Simultaneous reveal animation (Framer Motion) | 5 |
| Voting system + result calculation | 5–6 |
| Scoring, leaderboard, round management | 6 |
| Debate timer + Sus button | 6 |
| Host controls panel | 7 |
| Question database (500 prompt pairs) | 7 |
| Final polish, bug fixes, accessibility audit | 8 |
| Beta testing, feedback integration | 8 |

### Phase 2 — Growth (Weeks 9–16)
**Goal:** Virality, retention, and streamer features.

- Shareable result card (image generation via `html-to-image`)
- Streamer Mode / OBS overlay
- Sound effects (toggleable SFX pack)
- Custom debate timer settings
- "Spectator" join mode
- Arabic localization
- Performance optimization pass
- Analytics dashboard (internal)
- Player reconnection hardening

### Phase 3 — Monetization (Weeks 17–24)
**Goal:** First revenue, content expansion.

- Host Pass payment flow (Stripe)
- Adult/Party prompt packs (18+ gated)
- Custom prompt upload (Host Pass feature)
- Mobile PWA install prompt
- Push notifications for "your game is starting"
- Leaderboard seasons / persistent scores
- Custom avatar selection

### Phase 4 — Scale (Post Month 6)
- Multi-language support (ES, FR, DE, TR)
- Team/Event license
- API for third-party integrations (Twitch extension)
- Native mobile apps (React Native) if demand warrants
- AI-generated prompt pairs

---

## 28. Open Questions & Risks

### 28.1 Open Questions

| # | Question | Owner | Due |
|---|---------|-------|-----|
| Q1 | Should the shared screen require a separate "host opens on laptop" flow, or can the same phone be both controller and display? | Product | Pre-dev |
| Q2 | Should we allow joining mid-game, or strictly lobby-only? | Product | Pre-dev |
| Q3 | What is the target Imposter catch rate for "fun"? (55% feels right; validate with playtest) | Design | Playtest 1 |
| Q4 | Do we need a tutorial/walkthrough for first-time players, or is the UI self-explanatory? | Design | Beta |
| Q5 | Should "Sus" button influence anything (e.g., half-vote weight)? Or strictly visual? | Product | Post-MVP |
| Q6 | Should there be a post-round chat or emoji reaction system? | Product | V2 |

### 28.2 Risks & Mitigations

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| WebSocket performance degrades under load | Medium | High | Redis adapter for horizontal scaling; load test before launch |
| Prompt database runs out of variety quickly (frequent players) | Medium | Medium | Launch with 500+ pairs; analytics to identify repeat usage rate |
| Imposter role is too easy/hard to bluff | Medium | High | Playtesting + per-pair catch rate analytics + rapid prompt tuning |
| Mobile Safari WebSocket incompatibility | Low | High | Test on iOS 15–17; Socket.IO HTTP long-polling fallback |
| Room code collision at scale | Low | Medium | Retry logic on server; code space large enough for 500 concurrent rooms |
| Profanity filter false positives on non-English answers | Medium | Low | Liberal filter in V1; flag-based reporting in V2 |
| Streamer DMCA for sound effects | Low | Medium | Use royalty-free SFX or generate custom sounds |

---

## 29. Appendix

### A. Glossary

| Term | Definition |
|------|------------|
| Crew | All players who are NOT the Imposter in a given round |
| Imposter | The single player assigned a different prompt per round |
| Room | A game session identified by a 6-character code |
| Shared Screen | A single display (TV/laptop/stream) showing the game state for all players to see |
| Phone Controller | Each player's personal phone used to submit answers and vote |
| Prompt Pair | A linked set of two prompts: one for Crew, one for the Imposter |
| Bluff | The Imposter's attempt to justify their answer as if it were a Crew answer |
| Sus | Suspicion; a player marking another as suspicious during the debate phase |
| Role Rotation | The algorithm ensuring every player becomes the Imposter once before repeating |

### B. Design Inspiration References
- **Duolingo** — Button aesthetics, color system, micro-animation style, 3D button press effect
- **Jackbox Games** — Phone-as-controller paradigm, shared TV screen experience
- **Figma** — Card flip transitions as seen in design tool tutorials
- **Among Us** — Imposter role mystery and social deduction mechanics

### C. Technical Dependency Versions (Pinned at Project Start)

```json
{
  "react": "^18.3.0",
  "framer-motion": "^11.0.0",
  "socket.io-client": "^4.7.0",
  "socket.io": "^4.7.0",
  "zustand": "^4.5.0",
  "tailwindcss": "^3.4.0",
  "react-router-dom": "^6.22.0",
  "react-hook-form": "^7.51.0",
  "zod": "^3.22.0",
  "prisma": "^5.11.0",
  "jsonwebtoken": "^9.0.0",
  "qrcode.react": "^3.1.0",
  "canvas-confetti": "^1.9.0",
  "howler": "^2.2.4",
  "bad-words": "^3.0.4",
  "pino": "^8.19.0",
  "express": "^4.18.0",
  "@socket.io/redis-adapter": "^8.3.0"
}
```

### D. Folder Structure (Frontend)
```
src/
├── components/
│   ├── ui/               # Reusable primitives (Button, Input, Card, etc.)
│   ├── game/             # Game-specific components (PlayerCard, VoteButton, etc.)
│   ├── layout/           # Layout wrappers (PhoneLayout, DisplayLayout)
│   └── animations/       # Isolated animation components (CountdownRing, Confetti)
├── screens/
│   ├── Home.tsx
│   ├── Lobby.tsx
│   ├── Display.tsx       # Shared screen / TV view
│   ├── RoleReveal.tsx
│   ├── Submission.tsx
│   ├── Debate.tsx
│   ├── Voting.tsx
│   ├── RoundResult.tsx
│   └── FinalScore.tsx
├── hooks/
│   ├── useSocket.ts
│   ├── useGame.ts
│   ├── useTimer.ts
│   └── useShare.ts
├── store/
│   ├── gameStore.ts      # Zustand store for game state
│   └── playerStore.ts    # Zustand store for local player state
├── lib/
│   ├── socket.ts         # Socket.IO client instance
│   ├── api.ts            # REST API client (fetch wrapper)
│   └── validation.ts     # Zod schemas shared with backend
├── i18n/
│   ├── en.json
│   └── ar.json
└── styles/
    ├── globals.css       # CSS variables, base styles
    └── animations.css    # Keyframe animations
```

### E. Folder Structure (Backend)
```
src/
├── routes/
│   ├── rooms.ts
│   ├── game.ts
│   └── prompts.ts
├── socket/
│   ├── index.ts          # Socket.IO setup, middleware
│   ├── handlers/
│   │   ├── answer.ts
│   │   ├── vote.ts
│   │   ├── host.ts
│   │   └── sus.ts
│   └── emitters.ts       # Typed event emitters
├── services/
│   ├── roomService.ts
│   ├── roundService.ts
│   ├── roleService.ts    # Role assignment engine
│   ├── voteService.ts
│   └── scoreService.ts
├── middleware/
│   ├── auth.ts           # JWT validation
│   ├── rateLimit.ts
│   └── profanity.ts
├── db/
│   ├── prisma/
│   │   └── schema.prisma
│   └── seed.ts           # Seed 500 prompt pairs
├── redis/
│   └── client.ts
└── utils/
    ├── roomCode.ts       # Code generation
    └── timer.ts          # Server-side timer management
```

---

*Document End — Find The Imposter Web Edition PRD v1.0*

*Next step: Engineering kickoff meeting to assign ownership of each Phase 1 feature and confirm stack selections.*