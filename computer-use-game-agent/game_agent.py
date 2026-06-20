"""
Claude Computer Use game agent.

Loop: take a screenshot -> ask Claude what to do -> Claude returns `computer`
tool calls (mouse/keyboard) -> execute them -> feed the resulting screenshot
back -> repeat until Claude ends its turn (goal reached) or we hit a step cap.

Computer use is a CLIENT-side beta tool:
  - tool type : computer_20250124
  - tool name : computer
  - beta flag : computer-use-2025-01-24   (use client.beta.messages.*)
The model issues actions in *display* coordinates; controller.py executes them
on the real screen.

Usage:
  export ANTHROPIC_API_KEY=sk-ant-...
  python game_agent.py "Play this platformer. Reach the flag on the right. \
Move with the arrow keys and jump with the spacebar."
"""

from __future__ import annotations

import sys

import anthropic

from controller import GameController

MODEL = "claude-opus-4-8"
COMPUTER_USE_BETA = "computer-use-2025-01-24"
MAX_STEPS = 60          # hard cap on screenshot->action cycles
MAX_TOKENS = 4096

SYSTEM_PROMPT = """You are an expert game-playing agent driving a live screen \
via the `computer` tool. Each turn you receive a screenshot of the current game \
state and must act toward the stated goal.

Operating rules:
- Read the screenshot carefully before acting: HUD, score, health, timers, \
enemies, the player's position, and what changed since the last frame.
- Prefer keyboard controls for action games (arrow keys, WASD, space). Use \
`hold_key` for sustained movement (e.g. holding Right to run) and `key` for \
discrete inputs (jump, fire, confirm). Use clicks for menus and point-and-click \
games.
- Take ONE deliberate action (or a short tight sequence) per turn, then look at \
the next screenshot to see the result. Do not assume an action worked — verify.
- React to danger first (avoid enemies/hazards), then pursue the objective.
- If a menu, dialog, or "Press Start" screen appears, navigate it to resume play.
- When the goal is clearly achieved (win screen, flag reached, level cleared), \
state that you are done and end your turn. If you are stuck or the game is over \
(game-over screen with no continue), report it and end your turn."""


def run(goal: str) -> None:
    client = anthropic.Anthropic()
    controller = GameController(max_long_edge=1280)

    tools = [{
        "type": "computer_20250124",
        "name": "computer",
        "display_width_px": controller.display_w,
        "display_height_px": controller.display_h,
        "display_number": 1,
    }]

    # First turn: the goal plus an initial screenshot of the game.
    messages = [{
        "role": "user",
        "content": [
            {"type": "text", "text": f"Goal: {goal}\n\nHere is the current screen:"},
            {"type": "image", "source": {
                "type": "base64", "media_type": "image/png",
                "data": controller.screenshot_b64(),
            }},
        ],
    }]

    for step in range(1, MAX_STEPS + 1):
        response = client.beta.messages.create(
            model=MODEL,
            max_tokens=MAX_TOKENS,
            system=SYSTEM_PROMPT,
            tools=tools,
            betas=[COMPUTER_USE_BETA],
            messages=messages,
        )

        # Server-side tool loop paused — resend to let it continue.
        if response.stop_reason == "pause_turn":
            messages.append({"role": "assistant", "content": response.content})
            continue

        # Echo Claude's narration; preserve the FULL content (incl. tool_use).
        for block in response.content:
            if block.type == "text" and block.text.strip():
                print(f"[step {step}] {block.text.strip()}")
        messages.append({"role": "assistant", "content": response.content})

        tool_uses = [b for b in response.content if b.type == "tool_use"]
        if response.stop_reason == "end_turn" or not tool_uses:
            print("[done] Claude ended its turn.")
            return

        # Execute each requested action, then return a fresh screenshot so
        # Claude sees the consequence. Parallel tool calls are returned together.
        tool_results = []
        for tu in tool_uses:
            action = tu.input.get("action", "")
            try:
                controller.execute(action, tu.input)
                error = None
            except Exception as exc:  # surface failures to Claude, don't crash
                error = f"Action {action!r} failed: {exc}"
                print(f"[step {step}] ! {error}")

            if error:
                tool_results.append({
                    "type": "tool_result", "tool_use_id": tu.id,
                    "content": error, "is_error": True,
                })
            else:
                tool_results.append({
                    "type": "tool_result", "tool_use_id": tu.id,
                    "content": [{"type": "image", "source": {
                        "type": "base64", "media_type": "image/png",
                        "data": controller.screenshot_b64(),
                    }}],
                })

        messages.append({"role": "user", "content": tool_results})

    print(f"[stop] Reached MAX_STEPS ({MAX_STEPS}) without an end_turn.")


if __name__ == "__main__":
    if len(sys.argv) < 2:
        sys.exit('Usage: python game_agent.py "<goal / control description>"')
    run(" ".join(sys.argv[1:]))
