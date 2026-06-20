"""
Screen capture + input execution for a Claude Computer Use game agent.

This is the CLIENT side of the computer-use tool. Claude never touches the OS;
it emits `computer` tool calls (mouse/keyboard actions in *display* coordinates),
and this controller executes them on the real screen and returns a fresh
screenshot as visual feedback.

Coordinate model
----------------
Claude sees screenshots at a *declared* resolution (display_width_px /
display_height_px). We downscale the real screen to that size, keeping aspect
ratio, so a single uniform scale factor maps display coords -> real pixels.
Anthropic recommends keeping the long edge around 1280px (XGA/WXGA): bigger
displays hurt accuracy and inflate image tokens.
"""

from __future__ import annotations

import base64
import io
import time

import pyautogui
from PIL import Image

# Move the mouse to a screen corner to abort. Keep this ON for a game agent.
pyautogui.FAILSAFE = True
pyautogui.PAUSE = 0.0  # we manage our own timing


# xdotool / X11 keysyms (what Claude emits) -> pyautogui key names.
# Claude is trained on xdotool syntax, so translate before sending to pyautogui.
_KEYSYM_TO_PYAUTOGUI = {
    "return": "enter",
    "kp_enter": "enter",
    "escape": "esc",
    "backspace": "backspace",
    "delete": "delete",
    "tab": "tab",
    "space": "space",
    "up": "up",
    "down": "down",
    "left": "left",
    "right": "right",
    "page_up": "pageup",
    "page_down": "pagedown",
    "home": "home",
    "end": "end",
    "insert": "insert",
    "ctrl": "ctrl",
    "control": "ctrl",
    "alt": "alt",
    "shift": "shift",
    "super": "win",
    "meta": "win",
    "minus": "-",
    "equal": "=",
    "plus": "+",
    "comma": ",",
    "period": ".",
    "slash": "/",
}


def _translate_key(combo: str) -> list[str]:
    """Turn 'ctrl+shift+Right' into ['ctrl', 'shift', 'right'] for pyautogui."""
    keys = []
    for part in combo.split("+"):
        token = part.strip()
        low = token.lower()
        if low in _KEYSYM_TO_PYAUTOGUI:
            keys.append(_KEYSYM_TO_PYAUTOGUI[low])
        elif low.startswith("f") and low[1:].isdigit():  # F1..F24
            keys.append(low)
        else:
            keys.append(low if len(token) == 1 else token)
    return keys


class GameController:
    def __init__(self, max_long_edge: int = 1280, settle_seconds: float = 0.4):
        self.real_w, self.real_h = pyautogui.size()
        # Downscale so the long edge <= max_long_edge, preserving aspect ratio.
        scale = min(1.0, max_long_edge / max(self.real_w, self.real_h))
        self.display_w = round(self.real_w * scale)
        self.display_h = round(self.real_h * scale)
        # display -> real (uniform because aspect ratio is preserved)
        self._sx = self.real_w / self.display_w
        self._sy = self.real_h / self.display_h
        self.settle_seconds = settle_seconds

    # --- coordinate mapping -------------------------------------------------
    def _to_real(self, coord: list[int]) -> tuple[int, int]:
        x, y = coord
        return round(x * self._sx), round(y * self._sy)

    # --- screen capture -----------------------------------------------------
    def screenshot_b64(self) -> str:
        img = pyautogui.screenshot().resize(
            (self.display_w, self.display_h), Image.LANCZOS
        )
        buf = io.BytesIO()
        img.save(buf, format="PNG")
        return base64.standard_b64encode(buf.getvalue()).decode()

    # --- action dispatch ----------------------------------------------------
    def execute(self, action: str, params: dict) -> None:
        """Run one `computer` tool action. params is the tool_use input dict."""
        coord = params.get("coordinate")

        if action == "screenshot":
            return  # caller always returns a fresh screenshot afterward

        elif action == "mouse_move":
            pyautogui.moveTo(*self._to_real(coord))

        elif action in ("left_click", "right_click", "middle_click",
                        "double_click", "triple_click"):
            button = {"left_click": "left", "right_click": "right",
                      "middle_click": "middle", "double_click": "left",
                      "triple_click": "left"}[action]
            clicks = {"double_click": 2, "triple_click": 3}.get(action, 1)
            if coord:
                pyautogui.moveTo(*self._to_real(coord))
            # 20250124 allows modifier keys held during a click via `text`
            mods = _translate_key(params["text"]) if params.get("text") else []
            for m in mods:
                pyautogui.keyDown(m)
            pyautogui.click(button=button, clicks=clicks,
                            interval=0.05 if clicks > 1 else 0.0)
            for m in reversed(mods):
                pyautogui.keyUp(m)

        elif action == "left_click_drag":
            start = params.get("start_coordinate")
            if start:
                pyautogui.moveTo(*self._to_real(start))
            pyautogui.dragTo(*self._to_real(coord), duration=0.3, button="left")

        elif action == "left_mouse_down":
            if coord:
                pyautogui.moveTo(*self._to_real(coord))
            pyautogui.mouseDown(button="left")

        elif action == "left_mouse_up":
            if coord:
                pyautogui.moveTo(*self._to_real(coord))
            pyautogui.mouseUp(button="left")

        elif action == "scroll":
            if coord:
                pyautogui.moveTo(*self._to_real(coord))
            amount = int(params.get("scroll_amount", 3))
            direction = params.get("scroll_direction", "down")
            if direction in ("up", "down"):
                pyautogui.scroll(amount * (1 if direction == "up" else -1))
            else:  # left / right
                pyautogui.hscroll(amount * (1 if direction == "right" else -1))

        elif action == "key":
            keys = _translate_key(params["text"])
            pyautogui.hotkey(*keys) if len(keys) > 1 else pyautogui.press(keys[0])

        elif action == "hold_key":
            keys = _translate_key(params["text"])
            duration = float(params.get("duration", 1.0))
            for k in keys:
                pyautogui.keyDown(k)
            time.sleep(duration)
            for k in reversed(keys):
                pyautogui.keyUp(k)

        elif action == "type":
            pyautogui.write(params["text"], interval=0.01)

        elif action == "wait":
            time.sleep(float(params.get("duration", 1.0)))

        elif action == "cursor_position":
            return  # reported back implicitly via the next screenshot

        else:
            raise ValueError(f"Unsupported computer action: {action!r}")

        # Let the game render the result before the next screenshot.
        if action not in ("wait", "hold_key"):
            time.sleep(self.settle_seconds)
