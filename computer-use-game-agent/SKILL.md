---
name: play-game-with-computer-use
description: >-
  Plays a live on-screen game by capturing the screen, analyzing each frame with
  Claude, and executing mouse/keyboard actions in a loop via the Computer Use
  tool. Use when the user wants an agent to play, beat, test, automate, or
  speedrun a game running on their machine; control a game window; drive an
  emulator/browser/desktop game with screenshots; or build a vision-based game
  bot. Covers the computer_20250124 tool, screenshot->action loop, coordinate
  scaling, and keysym handling. Not for reading game memory/RAM, injecting into
  a game process, or non-visual API-level game control.
---

# Play a Game with Claude Computer Use

## Purpose / Outcome
Produce a running agent that drives a real game end-to-end: it screenshots the
screen, sends frames to Claude for analysis, and executes the mouse/keyboard
actions Claude returns — looping until the goal is met or a step cap is hit.

## When to use / When NOT to use
**Use when** the user wants Claude to *visually* play or test a game on their
machine — platformers, puzzles, strategy, menu-driven or point-and-click games,
emulators, browser games.

**Do NOT use when**: the task needs game-memory/RAM reads, process injection, or
a game's own API/network protocol (those are non-visual — this skill only sees
pixels and sends input events); or the game is twitch/frame-perfect where the
screenshot round-trip latency is disqualifying (say so rather than promising it).

## How Computer Use works here (read first)
Computer Use is a **client-side beta tool**. Claude never touches the OS — it
receives screenshots and emits action requests; *your code* executes them and
returns the next frame. The mandatory pieces:

| | |
|---|---|
| Tool type | `computer_20250124` |
| Tool name | `computer` |
| Beta header | `computer-use-2025-01-24` → call `client.beta.messages.*` |
| Model | `claude-opus-4-8` |

The tool definition (display_* must match the resolution of the images you send):

```json
{
  "type": "computer_20250124",
  "name": "computer",
  "display_width_px": 1280,
  "display_height_px": 800,
  "display_number": 1
}
```

## Core procedure
1. **Detect screen size and pick a display resolution.** Downscale the real
   screen so its long edge is ≤1280px, preserving aspect ratio. Declare
   `display_width_px`/`display_height_px` equal to the size of the images you
   will send. Keep one uniform scale factor for mapping coordinates back.
2. **Open the run.** Send a first `user` message: the goal text + an initial
   screenshot (base64 PNG `image` block).
3. **Call the model** with `client.beta.messages.create(... betas=["computer-use-2025-01-24"], tools=[<computer tool>])`.
4. **Handle `stop_reason`:** if `pause_turn`, append the assistant content and
   re-send. If `end_turn` (or no `tool_use` blocks), the agent is finished —
   stop.
5. **Execute every `tool_use` action** via the bundled controller (clicks,
   `key`, `hold_key`, `type`, `scroll`, drag, `wait`). Scale display coords →
   real pixels. Translate xdotool keysyms (`Return`, `space`, `ctrl+Right`) to
   the input library's names.
6. **Return one `tool_result` per `tool_use`**, each carrying a **fresh
   screenshot** so Claude sees the consequence. Return all results in a single
   `user` message.
7. **Append the full assistant `content` verbatim** (including `tool_use` and any
   thinking blocks) to history each turn, then loop to step 3 until `end_turn`
   or `MAX_STEPS`.

## Rules & constraints
- ALWAYS keep `display_width_px`/`display_height_px` byte-identical to the
  dimensions of the screenshots you send — mismatched dims = wrong clicks.
- ALWAYS return a `tool_result` for **every** `tool_use_id` in the turn; on a
  failed action return `is_error: true` with the message, never drop it.
- ALWAYS execute parallel tool calls and return their results in ONE user
  message (splitting them suppresses future parallel actions).
- NEVER assume an action worked — the screenshot returned after it is the proof.
- ALWAYS keep a fail-safe abort (mouse-to-corner) and a `MAX_STEPS` cap.
- This drives the user's real input devices — confirm scope and only run against
  a game the user can see and intends to automate (respect each game's ToS).

## Reference / bundled resources (deterministic offload)
Do not hand-roll screen capture, coordinate math, or keysym tables in prose —
that logic is deterministic and lives in code:
- `controller.py` — `GameController`: screenshot+downscale, coordinate scaling,
  xdotool→pyautogui keysym translation, and the full `computer_20250124` action
  set (clicks, drag, mouse down/up, scroll, key, hold_key, type, wait).
- `game_agent.py` — the runnable agent loop implementing the Core procedure.
- `requirements.txt` — `anthropic`, `pyautogui`, `pillow`.

Run it:
```bash
pip install -r requirements.txt
export ANTHROPIC_API_KEY=sk-ant-...
python game_agent.py "<goal + control description>"
```

## Example
Goal: *"Play this platformer. Reach the flag on the right edge. Move with the
arrow keys, jump with spacebar, avoid the enemies."*

A correct turn looks like:
1. Claude sees the player mid-level, an enemy ahead → emits
   `{action: "hold_key", text: "Right", duration: 0.6}` then `{action: "key", text: "space"}`.
2. Controller holds Right 0.6s, presses space, captures the new frame.
3. The frame returns as a `tool_result` image; Claude sees the player cleared
   the enemy and continues.

Wrong turn (what to avoid): emitting five blind moves in a row without looking at
the screenshots between them, then assuming success — Claude must verify each
frame before committing the next action.
