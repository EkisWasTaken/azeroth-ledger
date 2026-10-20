"""The Azeroth Ledger logo (shield with a sword) as one pixel grid.

Writes a preview PNG and the app's .ico (16, 32, 48 and 256 px) with the standard library only.
Usage: logo.py OUT_DIR
"""
import struct
import sys
import zlib
from pathlib import Path

GRID = [
    "......#yy#......",
    ".######hh######.",
    ".#gggg#hh#gggg#.",
    ".#gr#yyyyyy#rg#.",
    ".#gr###ss###rg#.",
    ".#grrr#sw#rrrg#.",
    ".#grrr#sw#rrrg#.",
    ".#grrr#sw#rrrg#.",
    ".#grrr#sw#rrrg#.",
    ".#grrr#sw#rrrg#.",
    "..#grr#sw#rrg#..",
    "..#ggr#sw#rgg#..",
    "...#gg#sw#gg#...",
    "....#g#ss#g#....",
    ".....##ss##.....",
    ".......##.......",
]
# Horde theme colours (the website swaps g/r for the current theme's colours)
PAL = {"#": (0, 0, 0), "g": (255, 176, 46), "r": (140, 28, 16), "y": (255, 210, 122),
       "h": (107, 62, 29), "s": (184, 196, 204), "w": (255, 255, 255)}

assert all(len(r) == 16 for r in GRID) and len(GRID) == 16


def pixels(size):
    k = size // 16
    rows = []
    for y in range(size):
        row = []
        for x in range(size):
            c = GRID[y // k][x // k]
            row.append(PAL[c] + (255,) if c in PAL else (0, 0, 0, 0))
        rows.append(row)
    return rows


def png(size):
    raw = b"".join(b"\x00" + b"".join(struct.pack("BBBB", *p) for p in row) for row in pixels(size))
    def chunk(t, d):
        return struct.pack(">I", len(d)) + t + d + struct.pack(">I", zlib.crc32(t + d) & 0xFFFFFFFF)
    return (b"\x89PNG\r\n\x1a\n" + chunk(b"IHDR", struct.pack(">IIBBBBB", size, size, 8, 6, 0, 0, 0))
            + chunk(b"IDAT", zlib.compress(raw, 9)) + chunk(b"IEND", b""))


def ico(sizes):
    images = [png(s) for s in sizes]
    head = struct.pack("<HHH", 0, 1, len(sizes))
    offset = 6 + 16 * len(sizes)
    entries = b""
    for s, data in zip(sizes, images):
        entries += struct.pack("<BBBBHHII", s % 256, s % 256, 0, 0, 1, 32, len(data), offset)
        offset += len(data)
    return head + entries + b"".join(images)


out = Path(sys.argv[1])
out.mkdir(parents=True, exist_ok=True)
(out / "preview.png").write_bytes(png(256))
(out / "logo.ico").write_bytes(ico([16, 32, 48, 256]))
print("ok")
