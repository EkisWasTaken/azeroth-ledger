"""Draws the 16x16 pixel icons and writes design/pixel-icons.html (a preview sheet).

Each icon is drawn from simple shapes in a 32x32 design space and rasterized onto a
16x16 grid, then gets a dark outline and top-left lighting automatically. The output uses the same format as SPRITES in
site/index.html: one string per row, one character per pixel, plus a palette.
"""
import json
import math
from pathlib import Path

W = 16          # pixels per side
D = 32          # the drawing coordinates below use a 32x32 design space
S = W / D
OUTLINE = "#120c08"
POOL = [c for c in "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz@$%&*+=?"]


def bright(hex_):
    r, g, b = (int(hex_[i:i + 2], 16) / 255 for i in (1, 3, 5))
    return 0.3 * r + 0.59 * g + 0.11 * b > 0.45


def mix(hex_, to, t):
    a = [int(hex_[i:i + 2], 16) for i in (1, 3, 5)]
    b = [int(to[i:i + 2], 16) for i in (1, 3, 5)]
    return "#" + "".join(f"{round(x + (y - x) * t):02x}" for x, y in zip(a, b))


class Icon:
    def __init__(self, pal, flat="", glow=None):
        self.g = [["." for _ in range(W)] for _ in range(W)]
        self.pal = dict(pal)  # char -> colour
        self.flat = set(flat)  # chars that get no lighting (glows, gems, sparks)
        # chars that twinkle on the site: the bright unlit ones unless listed by hand
        self.glow = set(glow) if glow is not None else {c for c in self.flat if bright(self.pal.get(c, "#000000"))}

    def px(self, x, y, c):
        x, y = int(math.floor(x * S)), int(math.floor(y * S))
        if 0 <= x < W and 0 <= y < W:
            self.g[y][x] = c

    def each(self, test, c):
        for y in range(W):
            for x in range(W):
                if test((x + 0.5) / S, (y + 0.5) / S):
                    self.g[y][x] = c

    def rect(self, x0, y0, x1, y1, c):
        for y in range(y0, y1 + 1):
            for x in range(x0, x1 + 1):
                self.px(x, y, c)

    def circle(self, cx, cy, r, c):
        self.each(lambda x, y: (x - cx) ** 2 + (y - cy) ** 2 <= r * r, c)

    def ellipse(self, cx, cy, rx, ry, c):
        self.each(lambda x, y: ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 <= 1, c)

    def ring(self, cx, cy, r0, r1, c):
        self.each(lambda x, y: r0 * r0 < (x - cx) ** 2 + (y - cy) ** 2 <= r1 * r1, c)

    def line(self, x0, y0, x1, y1, c, w=1.0):
        n = int(max(abs(x1 - x0), abs(y1 - y0)) * 3) + 1
        r = w / 2
        for i in range(n + 1):
            t = i / n
            x, y = x0 + (x1 - x0) * t, y0 + (y1 - y0) * t
            if w <= 1:
                self.px(x, y, c)
            else:
                for yy in range(int(y - r) - 1, int(y + r) + 2):
                    for xx in range(int(x - r) - 1, int(x + r) + 2):
                        if (xx + 0.5 - x) ** 2 + (yy + 0.5 - y) ** 2 <= r * r:
                            self.px(xx, yy, c)

    def path(self, pts, c, w=1.0):
        for a, b in zip(pts, pts[1:]):
            self.line(*a, *b, c, w)

    def poly(self, pts, c):
        def inside(x, y):
            hit = False
            for (x0, y0), (x1, y1) in zip(pts, pts[1:] + pts[:1]):
                if (y0 > y) != (y1 > y) and x < x0 + (y - y0) * (x1 - x0) / (y1 - y0):
                    hit = not hit
            return hit
        self.each(inside, c)

    def clear(self, test):
        self.each(test, ".")

    def get(self, x, y):
        return self.g[y][x] if 0 <= x < W and 0 <= y < W else "."

    def finish(self):
        # Outline: empty pixels touching a filled one (4-neighbours).
        out = [row[:] for row in self.g]
        for y in range(W):
            for x in range(W):
                if self.g[y][x] == "." and any(self.get(x + dx, y + dy) not in ".#" for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1))):
                    out[y][x] = "#"
        self.g = out
        # Lighting: edges facing up-left get lighter, edges facing down-right darker.
        free = iter(c for c in POOL if c not in self.pal)
        light, dark = {}, {}
        out = [row[:] for row in self.g]
        for y in range(W):
            for x in range(W):
                c = self.g[y][x]
                if c in ".#" or c in self.flat or c not in self.pal:
                    continue
                if self.get(x - 1, y) in ".#" or self.get(x, y - 1) in ".#":
                    if c not in light:
                        light[c] = next(free)
                        self.pal[light[c]] = mix(self.pal[c], "#ffffff", 0.38)
                    out[y][x] = light[c]
                elif self.get(x + 1, y) in ".#" or self.get(x, y + 1) in ".#":
                    if c not in dark:
                        dark[c] = next(free)
                        self.pal[dark[c]] = mix(self.pal[c], "#000000", 0.38)
                    out[y][x] = dark[c]
        self.g = out
        self.pal["#"] = OUTLINE
        used = {c for row in self.g for c in row}
        return ["".join(r) for r in self.g], {k: v for k, v in self.pal.items() if k in used}, "".join(sorted(self.glow & used))

    def after(self, fn):
        """Draw on top after outlining (sparks, flames that float free)."""
        rows, pal, _ = self.finish()
        self.g = [list(r) for r in rows]
        fn(self)
        used = {c for row in self.g for c in row}
        return ["".join(r) for r in self.g], {k: v for k, v in self.pal.items() if k in used}, "".join(sorted(self.glow & used))


# ---------------------------------------------------------------- icons

def thunderfury():
    i = Icon({"b": "#6f9ad8", "l": "#fff27a", "w": "#ffffff", "g": "#e0a83a", "h": "#2e4a8c", "c": "#5ae0ff"}, flat="lwc")
    i.line(10.5, 21.5, 27.5, 4.5, "b", 5)
    # The lightning runs down the middle of the blade.
    pts = []
    for n in range(9):
        t = n / 8
        off = (1.3 if n % 2 else -1.3) if 0 < n < 8 else 0
        pts.append((11.5 + 15.5 * t + off * 0.7, 20.5 - 15.5 * t + off * 0.7))
    i.path(pts, "l", 1.4)
    i.path(pts[2:7:2], "w")
    i.path([(5, 16), (8, 16.5), (11.5, 20.5), (15.5, 24), (16, 27)], "g", 2.6)
    i.line(10.5, 21.5, 5, 27, "h", 2.4)
    i.circle(4.5, 27.5, 2, "g")
    i.circle(11, 21, 1.6, "c")

    def bolts(i):
        i.path([(21, 1), (18, 4), (21, 5), (19, 8)], "l")
        i.path([(31, 11), (28, 12), (30, 14), (27, 16)], "l")
        i.path([(1, 13), (3, 11), (4, 13)], "c")
    return i.after(bolts)


def sulfuras():
    i = Icon({"h": "#4a3a36", "d": "#3a2a26", "g": "#c8901a", "r": "#d8381a", "o": "#ff8a1a", "y": "#ffe27a", "k": "#1e1412"},
             flat="roy")
    # Flames rising off the head.
    for x0, x1, top in ((5, 12, 3), (11, 21, 0), (20, 27, 3)):
        mid = (x0 + x1) / 2
        i.poly([(x0, 9), (mid, top), (x1, 9)], "r")
        i.poly([(x0 + 2, 9), (mid, top + 3), (x1 - 2, 9)], "o")
        i.poly([(mid - 1, 9), (mid, top + 5), (mid + 1, 9)], "y")
    # The great stone head, with flared striking faces and bronze bands.
    i.rect(6, 8, 25, 17, "d")
    i.rect(2, 6, 6, 19, "d")
    i.rect(25, 6, 29, 19, "d")
    i.rect(7, 8, 7, 17, "g")
    i.rect(24, 8, 24, 17, "g")
    # Molten seams.
    i.path([(9, 10), (12, 12), (10, 15)], "o")
    i.path([(22, 10), (19, 12), (21, 15)], "o")
    i.line(3, 12, 5, 12, "o")
    i.line(26, 12, 28, 12, "o")
    i.circle(16, 12.5, 3, "o")
    i.circle(16, 12.5, 1.6, "y")
    # Haft with bands and a pommel.
    i.rect(13, 18, 18, 19, "g")
    i.rect(15, 20, 16, 28, "h")
    for y in (22, 25):
        i.rect(15, y, 16, y, "k")
    i.rect(14, 28, 17, 30, "g")
    return i.finish()


def orcaxe():
    i = Icon({"i": "#4e525c", "e": "#c8ccd6", "r": "#b3261e", "h": "#5a3a22", "k": "#2a1a10", "w": "#e8dcc0"}, flat="k")
    # A broad iron cleaver blade on the upper left, its edge hacked with notches.
    i.poly([(16, 15), (24, 7), (21, 1), (14, 1), (7, 3), (3, 8), (3, 14), (7, 18)], "i")
    i.path([(21, 1), (14, 1), (7, 3), (3, 8), (3, 14), (7, 18)], "e", 1.6)
    for x, y in ((12, 0.5), (4.5, 5.5), (2.5, 11.5)):
        i.clear(lambda px, py, x=x, y=y: (px - x) ** 2 + (py - y) ** 2 <= 4.5)
    # Red war paint: two claw marks.
    i.line(9, 8, 14, 13, "r", 1.6)
    i.line(12, 5, 17, 10, "r", 1.6)
    # Bone tusk spikes on the back and the tip.
    i.poly([(21, 12), (30, 14), (24, 9)], "w")
    i.line(24, 6, 29, 1, "w", 2)
    # Leather-wrapped haft.
    i.line(5, 29, 24, 7, "h", 2.6)
    for t in (0.12, 0.22, 0.32):
        x, y = 5 + 19 * t, 29 - 22 * t
        i.line(x - 1.4, y - 1.2, x + 1.4, y + 1.2, "k", 1.2)
    i.line(5, 29, 3, 31, "w", 1.5)
    return i.finish()


def atiesh():
    i = Icon({"h": "#3a2a3a", "s": "#c8ccd8", "k": "#2a2440", "c": "#b46cff", "w": "#f4e8ff"}, flat="cw")
    i.line(5, 30, 19, 14, "h", 2.4)
    for t in (0.25, 0.55):
        x, y = 5 + 14 * t, 30 - 16 * t
        i.line(x - 1.5, y - 1.3, x + 1.5, y + 1.3, "s", 1.5)
    # Raven wings spread above the head.
    i.poly([(19, 9), (12, 1), (13, 6), (9, 4), (12, 9), (8, 9), (16, 13)], "k")
    i.poly([(23, 9), (30, 1), (29, 6), (32, 5), (29, 10), (31, 12), (26, 13)], "k")
    i.ring(21, 12, 4, 5.6, "s")
    i.poly([(20, 7), (21, 2), (22, 7)], "k")
    i.circle(21, 12, 3.8, "c")
    i.circle(20.5, 11.5, 1.6, "w")

    def sparks(i):
        for x, y in [(6, 14), (28, 19), (25, 24), (9, 18)]:
            i.px(x, y, "c")
    return i.after(sparks)


def ashbringer():
    """Broad glowing blade, golden wings swept toward the tip, red gem."""
    i = Icon({"s": "#dfe4ee", "f": "#ffffff", "g": "#e8b440", "r": "#d0202e", "h": "#3a2a3a", "y": "#fff2a8"}, flat="fry")
    i.line(13, 19, 27, 5, "s", 7)
    i.poly([(24, 4), (31, 1), (28, 8)], "s")
    i.line(14, 18, 28, 4, "f")
    # Wings rise from the guard toward the tip on both sides of the blade.
    i.poly([(11, 21), (4, 17), (1, 8), (7, 11), (14, 18)], "g")
    i.poly([(11, 21), (15, 28), (24, 31), (21, 25), (14, 18)], "g")
    i.circle(11, 21, 2, "r")
    i.line(10, 22, 5, 27, "h", 2.6)
    i.circle(4, 28, 2, "g")

    def glow(i):
        for x, y in [(20, 1), (31, 12), (2, 4)]:
            i.px(x, y, "y")
    return i.after(glow)


def lotus():
    i = Icon({"g": "#2a6a3a", "q": "#7a4aa8", "p": "#2e1440", "m": "#4a2266", "y": "#f0d8ff", "c": "#c58cff"}, flat="yc")
    i.poly([(16, 22), (3, 30), (9, 24)], "g")
    i.poly([(16, 22), (29, 30), (23, 24)], "g")

    def petal(angle, length, width, c):
        a = math.radians(angle)
        ux, uy = math.cos(a), math.sin(a)
        cx, cy = 16, 17
        i.poly([(cx - uy * width, cy + ux * width), (cx + ux * length * 0.6 - uy * width * 1.3, cy + uy * length * 0.6 + ux * width * 1.3),
                (cx + ux * length, cy + uy * length),
                (cx + ux * length * 0.6 + uy * width * 1.3, cy + uy * length * 0.6 - ux * width * 1.3), (cx + uy * width, cy - ux * width)], c)
    for a in range(-162, 20, 36):
        petal(a + 18, 11, 1.8, "q")
    for n, a in enumerate(range(-180, 10, 36)):
        petal(a, 14, 2.1, "pm"[n % 2])
    i.circle(16, 17, 2.6, "y")

    def sparks(i):
        for x, y in [(4, 4), (28, 6), (27, 2)]:
            i.px(x, y, "c")
    return i.after(sparks)


def onyxia():
    i = Icon({"d": "#3a2e3a", "h": "#d8ccb0", "e": "#ff8a1a", "k": "#140c10", "w": "#f4f0e0"}, flat="ekw", glow="e")
    i.path([(10, 8), (6, 4), (3, 0)], "h", 2.6)
    i.path([(22, 8), (26, 4), (29, 0)], "h", 2.6)
    i.poly([(8, 7), (1, 10), (7, 12)], "h")
    i.poly([(24, 7), (31, 10), (25, 12)], "h")
    i.poly([(9, 5), (23, 5), (27, 12), (23, 21), (20, 29), (12, 29), (9, 21), (5, 12)], "d")
    # Brow, eyes, nostrils and teeth.
    i.path([(9, 11), (14, 13)], "k")
    i.path([(23, 11), (18, 13)], "k")
    i.poly([(10, 13), (14, 14.5), (11, 15.5)], "e")
    i.poly([(22, 13), (18, 14.5), (21, 15.5)], "e")
    i.px(14, 25, "k")
    i.px(17, 25, "k")
    for x in (12, 14, 17, 19):
        i.px(x, 28, "w")
    for y in (8, 17, 21):
        i.line(14, y, 17, y, "k")
    return i.finish()


def benediction():
    i = Icon({"v": "#d8d4e8", "g": "#e8b440", "o": "#fffbe0", "y": "#ffe27a", "w": "#ffffff"}, flat="ow")
    i.line(6, 29, 19, 14, "v", 2.4)
    for t in (0.3, 0.6):
        i.line(6 + 13 * t - 1.5, 29 - 15 * t - 1.2, 6 + 13 * t + 1.5, 29 - 15 * t + 1.2, "g", 1.6)
    i.ring(21.5, 10.5, 4.6, 7.4, "g")
    i.path([(16, 6), (14, 3), (17, 4)], "g", 1.6)
    i.path([(27, 15), (30, 17), (28, 14)], "g", 1.6)
    i.circle(21.5, 10.5, 4.9, "y")
    i.circle(21, 10, 2.8, "o")

    def sparks(i):
        for cx, cy in [(28, 3), (10, 10), (29, 22)]:
            for dx, dy in ((0, 0), (1, 0), (-1, 0), (0, 1), (0, -1)):
                i.px(cx + dx, cy + dy, "w")
    return i.after(sparks)


def skull():
    i = Icon({"w": "#e8e0c8", "k": "#24161a", "e": "#7dff5a"}, flat="ke")
    i.circle(16, 13, 10.5, "w")
    i.rect(10, 19, 22, 27, "w")
    # Coordinates sit on even numbers so each detail lands on whole 16x16 pixels.
    i.rect(10, 12, 13, 15, "k")
    i.rect(18, 12, 21, 15, "k")
    i.rect(10, 14, 11, 15, "e")
    i.rect(20, 14, 21, 15, "e")
    i.rect(14, 18, 17, 19, "k")
    i.rect(12, 22, 21, 23, "k")
    i.rect(14, 22, 15, 23, "w")
    i.rect(18, 22, 19, 23, "w")
    i.rect(16, 4, 17, 7, "k")
    return i.finish()


def scroll():
    i = Icon({"p": "#ecd9a8", "q": "#c9a86a", "k": "#7a5a32", "m": "#b0242a", "y": "#ffd84a"}, flat="k")
    i.rect(8, 6, 24, 25, "p")
    i.rect(6, 3, 26, 6, "q")
    i.rect(6, 25, 26, 28, "q")
    for y, x1 in ((10, 21), (13, 19), (16, 21), (19, 16)):
        i.line(11, y, x1, y, "k")
    i.circle(21.5, 22.5, 3.4, "m")
    i.poly([(19, 25), (18, 30), (20.5, 28)], "m")
    i.poly([(23, 25), (25, 30), (22.5, 28)], "m")
    i.rect(2, 9, 3, 15, "y")
    i.rect(2, 17, 3, 18, "y")
    return i.finish()


def coins():
    """A pile of gold coin stacks."""
    i = Icon({"y": "#ffd84a", "Y": "#b07a10", "w": "#fff6c8"}, flat="w")
    # Two separate stacks, the tall one behind.
    for cx, tops in ((22, (27, 23, 19, 15, 11, 7)), (8, (27, 23, 19))):
        for cy in tops:
            i.ellipse(cx, cy + 2, 6.5, 3.2, "Y")
            i.ellipse(cx, cy, 6.5, 3.2, "y")

    def shine(i):
        for x, y in [(28, 4), (4, 12)]:
            i.px(x, y, "w")
    return i.after(shine)


def hourglass():
    i = Icon({"f": "#b07a3a", "g": "#bfe3ef", "y": "#e8c060", "c": "#5ad1ff"}, flat="c")
    i.poly([(11, 6), (21, 6), (21, 9), (17, 15.5), (17, 16.5), (21, 23), (21, 26), (11, 26), (11, 23), (15, 16.5), (15, 15.5), (11, 9)], "g")
    i.poly([(12.5, 11), (19.5, 11), (16.5, 15), (15.5, 15)], "y")
    i.poly([(16, 20), (20.5, 24), (20.5, 26), (11.5, 26), (11.5, 24)], "y")
    i.line(16, 16, 16, 20, "y")
    i.rect(7, 2, 25, 5, "f")
    i.rect(7, 27, 25, 30, "f")
    i.rect(8, 6, 9, 26, "f")
    i.rect(23, 6, 24, 26, "f")
    i.px(16, 3, "c")
    i.px(16, 28, "c")
    return i.finish()


def horseshoe():
    """A horse head in profile (riding mounts): mane, ear, eye and a bridle."""
    i = Icon({"b": "#9a6236", "m": "#3a2418", "k": "#140c08", "g": "#e0a83a"}, flat="k")
    i.path([(21, 3), (28, 12), (31, 22), (31, 31)], "m", 6)
    i.poly([(3, 22), (5, 16), (11, 9), (17, 4), (22, 5), (27, 12), (29, 20), (29, 31), (14, 31), (14, 24), (10, 23), (6, 25)], "b")
    i.poly([(17, 6), (20, 0), (22, 6)], "b")
    i.rect(14, 10, 15, 11, "k")
    i.rect(6, 20, 7, 21, "k")
    i.line(8, 18, 18, 12, "g", 1.6)
    i.line(18, 12, 17, 24, "g", 1.6)
    return i.finish()


def rocketboots():
    i = Icon({"b": "#2f8a4a", "s": "#b8bcc8", "k": "#3a2414", "o": "#ff7a1a", "y": "#ffe27a"}, flat="koy")
    i.poly([(10, 3), (21, 3), (21, 14), (27, 16), (29, 19), (29, 22), (9, 22), (9, 17)], "b")
    i.rect(9, 3, 22, 6, "s")
    i.poly([(23, 15.5), (27, 16), (29, 19), (29, 22), (24, 22)], "s")
    i.rect(9, 21, 29, 23, "k")
    for y in (9, 12, 15):
        i.line(17, y, 20, y, "k")
    i.rect(11, 24, 16, 26, "s")

    def flame(i):
        i.poly([(10.5, 27), (16.5, 27), (13.5, 32)], "o")
        i.poly([(12, 27), (15, 27), (13.5, 30.5)], "y")
    return i.after(flame)


def key():
    i = Icon({"g": "#d9a43a", "c": "#c03ad0", "y": "#fff0a8"}, flat="cy")
    i.ring(9.5, 9.5, 3.4, 7, "g")
    for a in range(0, 360, 90):
        r = math.radians(a + 45)
        i.circle(9.5 + math.cos(r) * 7.2, 9.5 + math.sin(r) * 7.2, 1.7, "g")
    i.circle(9.5, 9.5, 1.6, "c")
    i.line(14, 14, 27, 27, "g", 2.8)
    i.line(22, 22, 26, 18, "g", 2.4)
    i.line(26, 26, 29.5, 22.5, "g", 2.4)
    i.line(15, 13.5, 26, 24.5, "y")
    return i.finish()


def shield(field="#2c4fa8"):
    i = Icon({"r": "#e0a83a", "f": field, "w": "#fff2c0"}, flat="")
    i.poly([(4, 3), (28, 3), (28, 14), (25, 22), (16, 30), (7, 22), (4, 14)], "r")
    i.poly([(7, 6), (25, 6), (25, 14), (22.5, 20.5), (16, 26.5), (9.5, 20.5), (7, 14)], "f")
    # Plain field: the site prints the achievement points on top.
    i.rect(15, 3, 17, 4, "w")
    return i.finish()


def cog():
    i = Icon({"s": "#8fa0c0", "c": "#5ad1ff"}, flat="c")

    def gear(x, y):
        dx, dy = x - 16, y - 16
        d = math.hypot(dx, dy)
        a = (math.atan2(dy, dx) / (2 * math.pi) * 8 + 0.25) % 1
        return 4 < d <= 10 or (4 < d <= 13.5 and a < 0.5)
    i.each(gear, "s")
    i.ring(16, 16, 4, 5.4, "c")
    return i.finish()


def hearthstone():
    i = Icon({"s": "#8e8e9a", "c": "#5ad1ff", "w": "#e8fbff"}, flat="cw")
    i.ellipse(16, 17, 12, 12.5, "s")
    i.ring(16, 17, 4.6, 6.2, "c")
    i.line(16, 9, 16, 25, "c")
    i.line(10, 17, 22, 17, "c")
    i.circle(16, 17, 1.6, "w")
    return i.finish()


def bag():
    """A classic leather backpack with a flap and a gold buckle."""
    i = Icon({"b": "#8a5a30", "B": "#6a3e1e", "g": "#e0a83a", "k": "#3a2414"}, flat="k")
    i.ring(16, 7, 3, 5.5, "B")
    i.poly([(6, 12), (9, 9), (23, 9), (26, 12), (27, 29), (5, 29)], "b")
    i.poly([(5, 11), (9, 8), (23, 8), (27, 11), (27, 18), (16, 22), (5, 18)], "B")
    i.rect(14, 17, 17, 22, "g")
    i.rect(8, 24, 23, 25, "k")
    return i.finish()


def sword_at(i, x0, y0, x1, y1, blade, guard, grip):
    """A one-handed sword from hilt (x0, y0) to tip (x1, y1)."""
    ux, uy = x1 - x0, y1 - y0
    n = math.hypot(ux, uy)
    ux, uy = ux / n, uy / n
    gx, gy = x0 + ux * 4, y0 + uy * 4
    i.line(gx, gy, x1, y1, blade, 3.2)
    i.line(gx - uy * 4, gy + ux * 4, gx + uy * 4, gy - ux * 4, guard, 2)
    i.line(gx, gy, x0, y0, grip, 2)
    i.circle(x0, y0, 1.5, guard)


def warrior():
    i = Icon({"s": "#c8ccd8", "g": "#c79c6e", "h": "#5a3a22"})
    sword_at(i, 5, 27, 27, 5, "s", "g", "h")
    sword_at(i, 27, 27, 5, 5, "s", "g", "h")
    return i.finish()


def paladin():
    i = Icon({"g": "#e8c050", "s": "#d8dce4", "w": "#fffbe0", "p": "#f58cba"}, flat="wp")
    i.rect(8, 4, 24, 12, "g")
    i.rect(5, 3, 8, 13, "g")
    i.rect(24, 3, 27, 13, "g")
    i.circle(16, 8, 2.6, "w")
    i.rect(15, 13, 17, 27, "s")
    i.rect(14, 27, 18, 29, "g")

    def glow(i):
        for x, y in [(3, 18), (29, 18), (9, 20), (23, 22), (16, 1)]:
            i.px(x, y, "p")
    return i.after(glow)


def hunter():
    i = Icon({"h": "#8a5a2a", "a": "#c8a070", "s": "#c8ccd8", "r": "#c8402a", "k": "#3a2414", "w": "#e8e6e1"}, flat="w", glow="")
    i.each(lambda x, y: 169 < (x - 4) ** 2 + (y - 16) ** 2 <= 240 and x > 8, "h")
    i.rect(17, 14, 19, 18, "k")
    i.line(9, 2.5, 9, 29.5, "w")
    i.line(6, 16, 26, 16, "a", 1.2)
    i.poly([(25, 13), (31, 16), (25, 19)], "s")
    i.poly([(3, 12), (8, 16), (5, 16)], "r")
    i.poly([(3, 20), (8, 16), (5, 16)], "r")
    return i.finish()


def rogue():
    """Two crossed daggers in a reverse grip (points down, unlike the warrior's swords), dripping poison."""
    i = Icon({"s": "#d0d4de", "k": "#2a2228", "g": "#fff569", "p": "#7dff5a"}, flat="p")
    sword_at(i, 5, 4, 25, 25, "s", "k", "k")
    sword_at(i, 27, 4, 7, 25, "s", "k", "k")
    i.circle(5, 4, 1.8, "g")
    i.circle(27, 4, 1.8, "g")

    def drops(i):
        for x, y in [(4, 28), (4, 30), (28, 28), (28, 30)]:
            i.px(x, y, "p")
    return i.after(drops)


def priest():
    i = Icon({"g": "#ffd84a", "y": "#fff2b0", "w": "#ffffff"}, flat="w")
    for a in range(0, 360, 45):
        r = math.radians(a)
        far = 14 if a % 90 == 0 else 11
        i.line(16 + math.cos(r) * 7, 16 + math.sin(r) * 7, 16 + math.cos(r) * far, 16 + math.sin(r) * far, "g", 2)
    i.circle(16, 16, 6.4, "y")
    i.rect(15, 12, 16, 19, "w")
    i.rect(13, 14, 18, 15, "w")
    return i.finish()


def shaman():
    i = Icon({"h": "#8a5a2a", "b": "#0070de", "r": "#c8402a", "k": "#2a1a10", "y": "#ffd84a"}, flat="ky")
    i.poly([(12, 5), (3, 1), (5, 7), (2, 9), (12, 10)], "r")
    i.poly([(20, 5), (29, 1), (27, 7), (30, 9), (20, 10)], "r")
    i.rect(11, 3, 20, 28, "h")
    i.poly([(14, 3), (16, 0), (18, 3)], "y")
    # Two carved faces.
    for y in (7, 18):
        i.rect(13, y, 14, y + 1, "k")
        i.rect(17, y, 18, y + 1, "k")
        i.rect(14, y + 4, 17, y + 4, "k")
    i.rect(11, 14, 20, 15, "b")
    i.rect(11, 25, 20, 26, "b")
    i.rect(8, 28, 23, 30, "h")
    return i.finish()


def mage():
    i = Icon({"b": "#2a4fb0", "g": "#e0a83a", "y": "#ffe27a", "c": "#69ccf0"}, flat="yc")
    i.ellipse(16, 25, 14, 3.6, "b")
    i.poly([(9, 24), (23, 24), (20, 12), (24, 5), (27, 4), (21, 3), (15, 9), (12, 15)], "b")
    i.rect(10, 21, 22, 23, "g")
    for x, y in [(16, 15), (19, 9)]:
        for dx, dy in ((0, 0), (1, 0), (-1, 0), (0, 1), (0, -1)):
            i.px(x + dx, y + dy, "y")

    def sparks(i):
        for x, y in [(29, 1), (30, 7), (4, 14)]:
            i.px(x, y, "c")
    return i.after(sparks)


def warlock():
    i = Icon({"p": "#7a3ad0", "P": "#4a1a8a", "c": "#c58cff", "f": "#8cff4a"}, flat="Pcf")
    i.poly([(16, 2), (23, 10), (20, 28), (12, 28), (9, 10)], "p")
    i.path([(16, 3), (16, 27)], "P")
    i.path([(10, 10), (16, 14), (22, 10)], "P")
    i.circle(14, 16, 1.6, "c")

    def fel(i):
        for x, y in [(5, 6), (6, 5), (27, 14), (26, 20), (5, 22), (4, 23), (27, 4)]:
            i.px(x, y, "f")
    return i.after(fel)


def druid():
    i = Icon({"b": "#b8662a"})
    i.ellipse(16, 22, 9, 7, "b")
    # Spaced so each toe gets its own pixels with a dark gap between.
    for cx, cy in ((5, 13), (11, 7), (21, 7), (27, 13)):
        i.circle(cx, cy, 3.2, "b")
    return i.finish()


# ---------------------------------------------------------------- achievement icons

def crit():
    """Critical Mass: a crit starburst."""
    i = Icon({"o": "#ff8a1a", "y": "#ffe27a", "w": "#ffffff"}, flat="yw")

    def star(r_out, r_in, c):
        pts = []
        for n in range(16):
            a = math.radians(n * 22.5 - 90)
            r = r_out if n % 2 == 0 else r_in
            pts.append((16 + math.cos(a) * r, 16 + math.sin(a) * r))
        i.poly(pts, c)
    star(15.5, 7, "o")
    star(10, 4.5, "y")
    i.rect(14, 14, 17, 17, "w")
    return i.finish()


def tomb():
    """Overkill: a gravestone on a patch of grass."""
    i = Icon({"g": "#9a9aa6", "k": "#3a3a48", "v": "#4a8a3a"}, flat="k")
    i.circle(16, 12, 9, "g")
    i.rect(7, 12, 24, 27, "g")
    i.rect(2, 26, 29, 29, "v")
    i.rect(14, 8, 17, 19, "k")
    i.rect(10, 11, 21, 12, "k")
    return i.finish()


def ghost():
    """Professional Ghost: a spirit-healer blue ghost."""
    i = Icon({"w": "#cfe8ff", "k": "#1a2a4a"}, flat="k")
    i.circle(16, 13, 10.5, "w")
    i.rect(6, 13, 26, 27, "w")
    for x in (10, 18):
        i.clear(lambda px, py, x=x: py > 25 and abs(px - x) < 2.5)
    i.rect(10, 10, 13, 15, "k")
    i.rect(18, 10, 21, 15, "k")
    i.rect(14, 18, 17, 21, "k")
    return i.finish()


def feather():
    """Gravity's Favorite: a feather, as in Feather Fall."""
    i = Icon({"f": "#f0f0f4", "h": "#a07850", "b": "#a8d0ff"}, flat="b")
    i.line(9, 24, 26, 6, "f", 8)
    i.line(4, 29, 25, 7, "h", 1.4)
    for x, y in ((12, 15), (18, 9), (20, 20)):
        i.clear(lambda px, py, x=x, y=y: (px - x) ** 2 + (py - y) ** 2 <= 2.5)

    def air(i):
        for x, y in ((26, 24), (28, 26), (22, 28)):
            i.px(x, y, "b")
    return i.after(air)


def dice():
    """Lucky Roller: a need-roll die."""
    i = Icon({"w": "#efe8d8", "k": "#2a1a1a", "r": "#b0242a"}, flat="kr")
    i.rect(5, 5, 26, 26, "w")
    for x, y in ((8, 8), (20, 8), (8, 20), (20, 20)):
        i.rect(x, y, x + 3, y + 3, "k")
    i.rect(14, 14, 17, 17, "r")
    return i.finish()


def wing():
    """Frequent Flyer: a gryphon wing, a curved bone with feathers hanging from it."""
    i = Icon({"w": "#f4ecd8", "g": "#d9a43a", "b": "#8a6a3a"})
    for x0, y0, x1, y1 in ((7, 11, 5, 25), (13, 8, 12, 28), (19, 6, 19, 29), (25, 5, 26, 25), (30, 4, 31, 19)):
        i.line(x0, y0, x1, y1, "w", 4)
        i.line(x1, y1 - 3, x1, y1, "g", 4)
    i.path([(2, 14), (12, 7), (30, 3)], "b", 3.5)
    return i.finish()


def speech():
    """Chatterbox: a speech bubble."""
    i = Icon({"w": "#e8e6e1", "k": "#3a3a48"}, flat="k")
    i.rect(3, 6, 28, 21, "w")
    i.rect(5, 4, 26, 23, "w")
    i.poly([(8, 22), (5, 30), (16, 22)], "w")
    for x in (8, 14, 20):
        i.rect(x, 12, x + 3, 15, "k")
    return i.finish()


def flag():
    """Apology Tour: a white flag."""
    i = Icon({"h": "#8a5a2a", "w": "#f4f4f0"})
    i.poly([(10, 4), (28, 5), (25, 11), (29, 17), (10, 17)], "w")
    i.rect(6, 2, 9, 30, "h")
    return i.finish()


def bandage():
    """Life Support: a first-aid bandage."""
    i = Icon({"w": "#f0e8d8", "r": "#c8242a"}, flat="r")
    i.line(7, 25, 25, 7, "w", 11)
    i.rect(14, 10, 17, 21, "r")
    i.rect(10, 14, 21, 17, "r")
    return i.finish()


def zzz():
    """Professional AFK: a big Z and a small one, apart."""
    i = Icon({"c": "#a8d0ff"})
    for x0, y0, sz, w in ((16, 15, 13, 3.2), (2, 2, 7, 2.4)):
        i.line(x0, y0, x0 + sz, y0, "c", w)
        i.line(x0 + sz, y0, x0, y0 + sz, "c", w)
        i.line(x0, y0 + sz, x0 + sz, y0 + sz, "c", w)
    return i.finish()


def bunny():
    """Bunny Hopper: a rabbit."""
    i = Icon({"b": "#b8a088", "p": "#f0a0b0", "k": "#1a1010"}, flat="pk")
    i.ellipse(11, 9, 3.5, 8, "b")
    i.ellipse(21, 9, 3.5, 8, "b")
    i.circle(16, 21, 9.5, "b")
    i.rect(10, 4, 11, 13, "p")
    i.rect(20, 4, 21, 13, "p")
    i.rect(10, 18, 11, 19, "k")
    i.rect(20, 18, 21, 19, "k")
    i.rect(14, 22, 17, 23, "p")
    return i.finish()


def anvil():
    """Repair Bill: an anvil with sparks."""
    i = Icon({"i": "#6a6e78", "y": "#ffd84a"}, flat="y")
    i.poly([(2, 10), (22, 10), (30, 13), (22, 16), (20, 16), (20, 21), (25, 25), (25, 28), (7, 28), (7, 25), (12, 21), (12, 16), (6, 16), (2, 13)], "i")

    def sparks(i):
        for x, y in ((24, 4), (28, 6), (20, 2), (30, 2)):
            i.px(x, y, "y")
    return i.after(sparks)


def map_():
    """Explorer: a folded map with a dotted route."""
    i = Icon({"p": "#ecd9a8", "q": "#c9a86a", "r": "#c8242a"}, flat="r")
    i.rect(3, 6, 28, 26, "p")
    i.rect(12, 6, 19, 26, "q")
    for x, y in ((6, 22), (10, 18), (14, 16), (18, 14)):
        i.rect(x, y, x + 1, y + 1, "r")
    i.line(21, 8, 25, 12, "r", 2)
    i.line(25, 8, 21, 12, "r", 2)
    return i.finish()


def meat():
    """Meat Shield: a meat drumstick."""
    i = Icon({"m": "#b0502a", "w": "#efe6d4"})
    i.line(12, 20, 5, 27, "w", 4)
    i.circle(4, 25, 2.6, "w")
    i.circle(7, 29, 2.6, "w")
    i.ellipse(19, 13, 10.5, 9.5, "m")
    return i.finish()


ACHS = [
    ("crit", crit, "Critical Strike", "Crit numbers", "rare", "Critical Mass"),
    ("tomb", tomb, "Here Lies a Mob", "Gravestones", "uncommon", "Overkill"),
    ("ghost", ghost, "Restless Spirit", "Ghost form", "uncommon", "Professional Ghost"),
    ("feather", feather, "Light Feather", "Feather Fall", "uncommon", "Gravity's Favorite"),
    ("dice", dice, "Need Roll", "Need and greed dice", "uncommon", "Lucky Roller"),
    ("wing", wing, "Gryphon Wing", "Flight paths", "rare", "Frequent Flyer"),
    ("speech", speech, "Trade Chat", "Chat bubbles", "common", "Chatterbox"),
    ("flag", flag, "White Flag", "Surrender", "common", "Apology Tour"),
    ("bandage", bandage, "Heavy Linen Bandage", "First Aid", "common", "Life Support"),
    ("zzz", zzz, "Away From Keyboard", "AFK", "poor", "Professional AFK"),
    ("bunny", bunny, "Hopping Critter", "Elwynn rabbits", "common", "Bunny Hopper"),
    ("anvil", anvil, "Blacksmith's Anvil", "Repair vendors", "common", "Repair Bill"),
    ("map", map_, "Explorer's Map", "Exploration", "uncommon", "Explorer"),
    ("meat", meat, "Haunch of Meat", "Food", "common", "Meat Shield"),
]


# key, draw, name, inspired by, rarity (or class colour), what it's for
STATS = [
    ("skull", skull, "Skull of the Fallen", "Skull of Impending Doom", "epic", "skull · Deaths"),
    ("sword", thunderfury, "Windseeker's Blade", "Thunderfury, Blessed Blade", "legendary", "sword · Damage dealt"),
    ("heart", benediction, "Staff of Blessing", "Benediction", "epic", "heart · Healing done"),
    ("axe", orcaxe, "Warchief's Cleaver", "Orcish war axes", "epic", "axe · Killing blows"),
    ("scroll", scroll, "Sealed Orders", "Quest scrolls", "uncommon", "scroll · Quests completed"),
    ("coin", coins, "Hoard of the Ledger", "Stacks of gold coins", "rare", "coin · Gold looted"),
    ("clock", hourglass, "Bronze Hourglass", "Hourglass Sand", "rare", "clock · Time played"),
    ("boot", horseshoe, "Swift Steed", "Riding mounts", "rare", "boot · Distance"),
    ("spring", rocketboots, "Rocket Treads", "Goblin Rocket Boots", "rare", "spring · Jumps"),
    ("gate", key, "Key of the Deep Halls", "Dungeon keys", "epic", "gate · Dungeon runs"),
    ("shield", shield, "Bulwark of Glory", "Heroic shields", "epic", "shield · Hall of Fame"),
    ("shieldBad", lambda: shield("#8c1c10"), "Bulwark of Shame", "Heroic shields", "poor", "shieldBad · Hall of Shame"),
    ("gear", cog, "Arcane Cog", "Gnomish engineering", "uncommon", "gear · Settings"),
    ("hearth", hearthstone, "Hearthstone", "Hearthstone", "common", "new · hearthstones"),
    ("loot", bag, "Traveler's Pack", "Traveler's Backpack", "rare", "Loot"),
]
LEGENDS = [
    ("sulfuras", sulfuras, "Hand of the Firelord", "Sulfuras, Hand of Ragnaros", "legendary", "legendary loot, top ranks"),
    ("atiesh", atiesh, "Greatstaff of the Watcher", "Atiesh, Greatstaff of the Guardian", "legendary", "legendary loot, top ranks"),
    ("ashbringer", ashbringer, "Lightbringer's Edge", "The Ashbringer", "legendary", "achievements, Hall of Fame"),
    ("onyxia", onyxia, "Head of the Brood Mother", "Head of Onyxia", "epic", "raid kills, boss stats"),
    ("lotus", lotus, "Night Lotus", "Black Lotus", "epic", "rare drops, gathering"),
]
CLASSES = [
    ("warrior", warrior, "Warrior", "Crossed blades", "#c79c6e", "class"),
    ("paladin", paladin, "Paladin", "Holy hammer", "#f58cba", "class"),
    ("hunter", hunter, "Hunter", "Bow and arrow", "#abd473", "class"),
    ("rogue", rogue, "Rogue", "Two poisoned daggers", "#fff569", "class"),
    ("priest", priest, "Priest", "Holy light", "#ffffff", "class"),
    ("shaman", shaman, "Shaman", "Totem", "#0070de", "class"),
    ("mage", mage, "Mage", "Wizard's hat", "#69ccf0", "class"),
    ("warlock", warlock, "Warlock", "Soul shard", "#9482c9", "class"),
    ("druid", druid, "Druid", "Bear paw", "#ff7d0a", "class"),
]
GROUPS = [("Stats", STATS), ("Legendaries", LEGENDS), ("Achievements", ACHS), ("Classes", CLASSES)]

RARITY = {"poor": "#9d9d9d", "common": "#ffffff", "uncommon": "#1eff00", "rare": "#0070dd", "epic": "#a335ee", "legendary": "#ff8000"}


def main():
    root = Path(__file__).resolve().parents[1]
    sprites, meta = {}, []
    for group, icons in GROUPS:
        for key_, fn, name, inspired, rarity, replaces in icons:
            rows, pal, glow = fn()
            assert len(rows) == W and all(len(r) == W for r in rows), key_
            sprites[key_] = [rows, pal, glow] if glow else [rows, pal]
            meta.append({"group": group, "key": key_, "name": name, "inspired": inspired, "rarity": rarity,
                         "color": RARITY.get(rarity, rarity), "replaces": replaces})
    (root / "icons16.json").write_text(json.dumps(sprites, separators=(",", ":")), encoding="utf8")
    html = (root / "src" / "pixel-icons.template.html").read_text(encoding="utf8")
    html = html.replace("/*SPRITES*/", json.dumps(sprites, separators=(",", ":")))
    html = html.replace("/*META*/", json.dumps(meta))
    html = html.replace("/*RARITY*/", json.dumps(RARITY))
    (root / "pixel-icons.html").write_text(html, encoding="utf8")
    update_site(root.parent / "site" / "index.html", sprites)
    print("wrote", len(sprites), "icons")


def update_site(path, sprites):
    """Replaces the icon entries in SPRITES in site/index.html, keeping the crest logo."""
    with open(path, encoding="utf8", newline="") as f:
        lines = f.read().split("\n")
    start = next(n for n, l in enumerate(lines) if l.strip() == "const SPRITES = {") + 1
    crest = next(n for n in range(start, len(lines)) if lines[n].lstrip().startswith("crest:"))
    eol = "\r" if lines[start].endswith("\r") else ""  # keep the file's CRLF line endings
    entries = [f"    {k}: {json.dumps(v, separators=(',', ':'))},{eol}" for k, v in sprites.items()]
    lines[start:crest] = entries
    path.write_text("\n".join(lines), encoding="utf8", newline="")


if __name__ == "__main__":
    main()
