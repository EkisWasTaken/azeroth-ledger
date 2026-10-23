"""Renders the README images with headless Chrome: banner, section headings and feature tiles.
Run from the project folder:  python docs/src/make_images.py

Needs Google Chrome and an internet connection (the fonts load from Google Fonts).
"""
import functools
import http.server
import re
import subprocess
import threading
import time
import urllib.parse
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "docs" / "images"
CHROME = next(p for p in [
    Path(r"C:\Program Files\Google\Chrome\Application\chrome.exe"),
    Path(r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"),
    Path(r"C:\Program Files\Microsoft\Edge\Application\msedge.exe"),
    Path(r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"),
] if p.exists())
PORT = 8791

HEADINGS = {
    "features": ("What it tracks", "skull"),
    "how": ("How it works", "gear"),
    "players": ("For players", "sword"),
    "owners": ("Run your own", "crest"),
    "dev": ("Under the hood", "axe"),
}


def build_art():
    """art.html with the site's pixel sprites filled in."""
    site = (ROOT / "site" / "app.js").read_text(encoding="utf-8")
    a = site.index("  const SPRITES = {")
    b = site.index("\n  };", a)
    sprites = site[a + len("  const SPRITES = "):b + 4].strip().rstrip(";")
    art = (ROOT / "docs" / "src" / "art.html").read_text(encoding="utf-8").replace("/*SPRITES*/{}", sprites)
    (ROOT / "site" / "_art.html").write_text(art, encoding="utf-8")


def shot(url, path, w, h, scale=2, wait=6000, transparent=False):
    args = [str(CHROME), "--headless=new", "--disable-gpu", "--hide-scrollbars", f"--window-size={w},{h}",
            f"--force-device-scale-factor={scale}", f"--virtual-time-budget={wait}", f"--screenshot={path}",
            "--lang=en-US", "--user-data-dir=" + str(ROOT / ".chrome-shots")]
    if transparent:
        args.append("--default-background-color=00000000")
    subprocess.run(args + [url], check=True, capture_output=True, timeout=120)
    print("wrote", path.relative_to(ROOT))


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    build_art()
    class Quiet(http.server.SimpleHTTPRequestHandler):
        def log_message(self, *a):
            pass
    handler = functools.partial(Quiet, directory=str(ROOT / "site"))
    srv = http.server.ThreadingHTTPServer(("127.0.0.1", PORT), handler)
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    base = f"http://127.0.0.1:{PORT}"
    try:
        shot(f"{base}/_art.html?mode=banner", OUT / "banner.png", 1280, 400)
        shot(f"{base}/_art.html?mode=tiles", OUT / "tiles.png", 1280, 196)
        for key, (text, icon) in HEADINGS.items():
            shot(f"{base}/_art.html?mode=h&icon={icon}&text={urllib.parse.quote(text)}", OUT / f"h-{key}.png", 1280, 104, transparent=True)
    finally:
        srv.shutdown()
        (ROOT / "site" / "_art.html").unlink(missing_ok=True)


if __name__ == "__main__":
    main()
