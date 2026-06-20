# Computer Use — Game-Playing Agent

Captures the screen, analyzes each frame with Claude, and executes mouse/keyboard
actions in a loop to play a game on your machine.

## Two ways to run it — pick one

| | **Claude Code** (MCP) | **Claude API** (standalone script) |
|---|---|---|
| Entry point | `mcp_server.py` + `.mcp.json` | `game_agent.py` |
| Who runs the loop | Claude Code's own agent loop | the hand-written loop in the script |
| The tool | MCP tools (`screenshot`, `left_click`, `key`, …) | the `computer_20250124` API tool |
| You need | Claude Code installed | an `ANTHROPIC_API_KEY` |

👉 **If you want Claude Code, use the MCP server** (next section). Claude Code has
no built-in screen/mouse control, so we expose it as MCP tools and let Claude
Code drive. The `computer_20250124` tool and `game_agent.py` are the **API**
path — different mechanism, same `controller.py` underneath.

---

## A) Use it with Claude Code (recommended for you)

`mcp_server.py` is an MCP server exposing `screenshot`, `left_click`,
`right_click`, `double_click`, `drag`, `move`, `key`, `hold_key`, `type_text`,
`scroll`, and `screen_info`. Claude Code calls them in its normal agent loop:
it takes a screenshot, *sees the image*, decides, acts, screenshots again.

```bash
pip install -r requirements.txt          # installs the `mcp` package too
```

Register the server with Claude Code, either way:

- **Project config (committed):** a `.mcp.json` is included in this folder.
  Launch `claude` from inside `computer-use-game-agent/` and approve the
  `game-controller` server when prompted.
- **CLI:** from this folder run
  ```bash
  claude mcp add game-controller -- python mcp_server.py
  ```

Then just ask Claude Code to play, e.g.:

> Use the game-controller tools to play this game. First call screen_info and
> screenshot to see the screen. Goal: reach the flag on the right — move with
> the arrow keys (hold_key "Right"), jump with `key "space"`, avoid enemies.
> After every action, take a screenshot and verify before the next move.

Claude Code handles the loop; you watch it play.

> The `SKILL.md` in this folder documents the same workflow as a reusable Claude
> skill (trigger conditions, procedure, rules).

---

## B) Use it with the Claude API (standalone script)

`game_agent.py` runs the loop itself via the **Computer Use** tool — a
*client-side* beta tool where Claude sees screenshots and emits action requests
and the script performs the clicks/keypresses.

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
