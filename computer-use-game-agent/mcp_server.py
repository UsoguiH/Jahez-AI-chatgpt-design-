"""
MCP server that lets **Claude Code** play a game by controlling the screen.

This is the Claude Code path (NOT the Claude API path). Claude Code has no
built-in screen/mouse control, so we expose screen capture + input as MCP tools.
Claude Code's own agent loop then drives the game:

    screenshot()  ->  Claude Code sees the frame  ->  click()/key()/...  ->  repeat

Coordinates are in the pixel space of the image returned by screenshot()
(the real screen downscaled to a long edge <= 1280px). The server scales those
coordinates back to real pixels before acting. Reuses GameController from
controller.py for capture, scaling, and keysym translation.

Run (registered via .mcp.json or `claude mcp add`):
    python mcp_server.py
"""

from __future__ import annotations

import base64

from mcp.server.fastmcp import FastMCP, Image

from controller import GameController

mcp = FastMCP("game-controller")
ctrl = GameController(max_long_edge=1280)


@mcp.tool()
def screen_info() -> str:
    """Return the coordinate space for clicks/moves.

    All x/y coordinates you pass to other tools are in this pixel space,
    matching the screenshot() image. Call this once at the start.
    """
    return (f"Screenshots and all coordinates use a {ctrl.display_w}x"
            f"{ctrl.display_h} pixel grid. (0,0) is top-left; x grows right, "
            f"y grows down.")


@mcp.tool()
def screenshot() -> Image:
    """Capture the current screen and return it as a PNG image.

    Call this to see the game, then again after every action to verify the
    result before deciding the next move.
    """
    png = base64.b64decode(ctrl.screenshot_b64())
    return Image(data=png, format="png")


@mcp.tool()
def move(x: int, y: int) -> str:
    """Move the mouse cursor to (x, y)."""
    ctrl.execute("mouse_move", {"coordinate": [x, y]})
    return f"moved to ({x}, {y})"


@mcp.tool()
def left_click(x: int, y: int) -> str:
    """Left-click at (x, y)."""
    ctrl.execute("left_click", {"coordinate": [x, y]})
    return f"left_click at ({x}, {y})"


@mcp.tool()
def right_click(x: int, y: int) -> str:
    """Right-click at (x, y)."""
    ctrl.execute("right_click", {"coordinate": [x, y]})
    return f"right_click at ({x}, {y})"


@mcp.tool()
def double_click(x: int, y: int) -> str:
    """Double-click at (x, y)."""
    ctrl.execute("double_click", {"coordinate": [x, y]})
    return f"double_click at ({x}, {y})"


@mcp.tool()
def drag(x1: int, y1: int, x2: int, y2: int) -> str:
    """Press the left button at (x1, y1) and drag to (x2, y2)."""
    ctrl.execute("left_click_drag",
                 {"start_coordinate": [x1, y1], "coordinate": [x2, y2]})
    return f"drag ({x1},{y1}) -> ({x2},{y2})"


@mcp.tool()
def key(keys: str) -> str:
    """Press a key or chord. Use xdotool syntax, e.g. 'space', 'Return',
    'Escape', 'Left', 'ctrl+Right'. For sustained movement use hold_key."""
    ctrl.execute("key", {"text": keys})
    return f"key {keys}"


@mcp.tool()
def hold_key(keys: str, duration: float = 1.0) -> str:
    """Hold a key (or chord) down for `duration` seconds, e.g. holding 'Right'
    to run or 'space' to charge. Use this instead of key() for movement."""
    ctrl.execute("hold_key", {"text": keys, "duration": duration})
    return f"held {keys} for {duration}s"


@mcp.tool()
def type_text(text: str) -> str:
    """Type a string of literal text (for name entry, chat, search boxes)."""
    ctrl.execute("type", {"text": text})
    return f"typed {len(text)} chars"


@mcp.tool()
def scroll(x: int, y: int, direction: str = "down", amount: int = 3) -> str:
    """Scroll at (x, y). direction is up/down/left/right; amount is clicks."""
    ctrl.execute("scroll", {"coordinate": [x, y],
                            "scroll_direction": direction,
                            "scroll_amount": amount})
    return f"scroll {direction} {amount} at ({x}, {y})"


if __name__ == "__main__":
    mcp.run()  # stdio transport — Claude Code launches and speaks to this
