# Claude Computer Use — Game-Playing Agent

A minimal agent that **captures the screen, sends it to Claude for analysis, and
executes the mouse/keyboard actions Claude chooses** — in a loop — to play a game
running on your machine.

It uses the Claude **Computer Use** tool, which is a *client-side* beta tool:
Claude only sees screenshots and emits action requests; **your code** (this repo)
performs the actual clicks and keypresses and feeds back the resulting frame.

| | |
|---|---|
| Tool type | `computer_20250124` |
| Tool name | `computer` |
| Beta header | `computer-use-2025-01-24` (via `client.beta.messages.*`) |
| Model | `claude-opus-4-8` |

## How it works

```
 ┌─────────────┐  screenshot (base64 PNG)   ┌──────────────────────┐
 │ controller  │ ─────────────────────────▶ │ Claude (beta msgs)   │
 │ (your OS)   │                            │ computer_20250124    │
 │  pyautogui  │ ◀───────────────────────── │ → mouse/keyboard act │
 └─────────────┘   tool_use: {action, ...}  └──────────────────────┘
        │  execute action, grab new frame, return as tool_result ↺
```

1. `game_agent.py` sends the goal + an initial screenshot.
2. Claude replies with one or more `computer` tool calls (`left_click`,
   `key`, `hold_key`, `type`, `scroll`, `screenshot`, …) in **display
   coordinates**.
3. `controller.py` scales those coordinates to the real screen, executes the
   action with `pyautogui`, and captures a fresh screenshot.
4. The screenshot goes back as a `tool_result`; the loop repeats until Claude
   ends its turn (goal reached / game over) or `MAX_STEPS` is hit.

`controller.py` handles two things people usually get wrong:

- **Coordinate scaling.** The real screen is downscaled so its long edge is
  ≤1280px (Anthropic's recommended range — larger displays hurt accuracy and
  cost more image tokens). The declared `display_width_px`/`display_height_px`
  match the sent image exactly, and a single uniform factor maps Claude's
  coordinates back to real pixels.
- **Keysym translation.** Claude emits xdotool-style keys (`Return`, `space`,
  `ctrl+shift+Right`); these are translated to `pyautogui` names before
  execution.

## Setup

```bash
pip install -r requirements.txt
export ANTHROPIC_API_KEY=sk-ant-...
```

> Linux needs an X server for `pyautogui`. On headless/CI use a virtual display
> (e.g. `xvfb-run`).

## Run

```bash
python game_agent.py "Play this platformer. Reach the flag on the right edge. \
Move with the arrow keys, jump with the spacebar, avoid the enemies."
```

Open/focus the game window first; the agent drives whatever is on screen.

## Safety & scope

- **Fail-safe is on:** slam the mouse into a screen corner to abort instantly
  (`pyautogui.FAILSAFE`).
- The agent controls your real mouse and keyboard. Run it against a windowed
  game you can see, ideally on a spare machine or VM. Don't leave it unattended
  with sensitive apps open.
- This is intended for legitimate automation (your own games, bots for games
  that permit them, research/testing). Respect each game's terms of service.

## Tuning

- `MAX_STEPS` / `MAX_TOKENS` / `MODEL` — top of `game_agent.py`.
- `settle_seconds` (`GameController`) — pause after each action before the next
  screenshot; raise it for slow-rendering games, lower it for snappy reflex
  games.
- `max_long_edge` — screenshot resolution Claude sees; lower = cheaper/faster,
  higher = more visual detail.
- For fast real-time games, consider enabling adaptive thinking
  (`thinking={"type": "adaptive"}`) and/or batching a short action sequence per
  turn — but every extra screenshot adds latency, which is the main limiter for
  twitch gameplay.
