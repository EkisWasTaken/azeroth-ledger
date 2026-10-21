"""Imports the painted zone maps from design/map-trace/ into the website (see the README there).

For each painting (kalimdor.png, eastern-kingdoms.png, outland.png):
  1. Every pixel becomes water (transparent, white or near-black) or the zone whose palette colour it is.
  2. The painting is shrunk to the site's 450x300 grid (Anniversary frame), and converted into the
     Classic Era frame through the game's own map coordinates (zones Era doesn't have are dropped).
  3. Each zone is checked against its exact rectangle from the game: missing zones and paint far outside
     a zone's rectangle are reported, and <name>-check.png shows the result over the reference map.
  4. The grids are written into site/index.html between the MAP-TRACED markers.

Standard library only:  python design/src/import_map.py
"""
import json
import os
import struct
import sys
import zlib

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
KIT = os.path.join(ROOT, "design", "map-trace")
SITE = os.path.join(ROOT, "site", "index.html")
GW, GH = 450, 300
# Capitals sit inside other zones; painting them is a nice extra, not a must.
CITIES = {"Orgrimmar", "Thunder Bluff", "Darnassus", "The Exodar", "Stormwind City", "Ironforge", "Undercity", "Silvermoon City", "Shattrath City"}


# ---------------------------------------------------------------- PNG (8-bit, non-interlaced)

def read_png(path):
    """Returns (width, height, rows of (r, g, b, a) tuples)."""
    data = open(path, "rb").read()
    assert data[:8] == b"\x89PNG\r\n\x1a\n", f"{path} is not a PNG"
    pos, idat, plte, trns = 8, b"", None, None
    while pos < len(data):
        n, kind = struct.unpack(">I4s", data[pos:pos + 8])
        chunk = data[pos + 8:pos + 8 + n]
        if kind == b"IHDR":
            w, h, depth, ctype, _, _, interlace = struct.unpack(">IIBBBBB", chunk)
        elif kind == b"PLTE":
            plte = [tuple(chunk[i:i + 3]) for i in range(0, n, 3)]
        elif kind == b"tRNS":
            trns = chunk
        elif kind == b"IDAT":
            idat += chunk
        pos += 12 + n
    if depth != 8 or interlace:
        sys.exit(f"{os.path.basename(path)}: please export as an 8-bit, non-interlaced PNG")
    bpp = {0: 1, 2: 3, 3: 1, 4: 2, 6: 4}[ctype]
    raw, stride, prev, rows, off = zlib.decompress(idat), w * bpp, bytearray(w * bpp), [], 0
    for _ in range(h):
        f, line = raw[off], bytearray(raw[off + 1:off + 1 + stride])
        off += 1 + stride
        for i in range(stride):
            a = line[i - bpp] if i >= bpp else 0
            b, c = prev[i], prev[i - bpp] if i >= bpp else 0
            if f == 1: line[i] = (line[i] + a) & 255
            elif f == 2: line[i] = (line[i] + b) & 255
            elif f == 3: line[i] = (line[i] + (a + b) // 2) & 255
            elif f == 4:
                pa, pb, pc = abs(b - c), abs(a - c), abs(a + b - 2 * c)
                line[i] = (line[i] + (a if pa <= pb and pa <= pc else b if pb <= pc else c)) & 255
        prev = line
        if ctype == 6: px = [tuple(line[i:i + 4]) for i in range(0, stride, 4)]
        elif ctype == 2: px = [tuple(line[i:i + 3]) + (255,) for i in range(0, stride, 3)]
        elif ctype == 3: px = [plte[v] + ((trns[v] if trns and v < len(trns) else 255),) for v in line]
        elif ctype == 4: px = [(line[i],) * 3 + (line[i + 1],) for i in range(0, stride, 2)]
        else: px = [(v, v, v, 255) for v in line]
        rows.append(px)
    return w, h, rows


def write_png(path, w, h, rows):
    raw = b"".join(b"\x00" + bytes(v for p in row for v in p[:3]) for row in rows)
    chunk = lambda t, d: struct.pack(">I", len(d)) + t + d + struct.pack(">I", zlib.crc32(t + d) & 0xffffffff)
    open(path, "wb").write(b"\x89PNG\r\n\x1a\n" + chunk(b"IHDR", struct.pack(">IIBBBBB", w, h, 8, 2, 0, 0, 0))
                           + chunk(b"IDAT", zlib.compress(raw, 9)) + chunk(b"IEND", b""))


# ---------------------------------------------------------------- map coordinates

def to_world(a, u, v):
    """0-1 map coordinates on assignment a to world x, y (the inverse of the game's mapping)."""
    y = a["Region_4"] - (u - a["UiMin_0"]) / (a["UiMax_0"] - a["UiMin_0"]) * (a["Region_4"] - a["Region_1"])
    x = a["Region_3"] - (v - a["UiMin_1"]) / (a["UiMax_1"] - a["UiMin_1"]) * (a["Region_3"] - a["Region_0"])
    return x, y


def to_map(a, x, y):
    u = a["UiMin_0"] + (a["Region_4"] - y) / (a["Region_4"] - a["Region_1"]) * (a["UiMax_0"] - a["UiMin_0"])
    v = a["UiMin_1"] + (a["Region_3"] - x) / (a["Region_3"] - a["Region_0"]) * (a["UiMax_1"] - a["UiMin_1"])
    return u, v


def era_to_tbc(cont, u, v):
    """A point on the Classic Era continent map as a point on the Anniversary one (or None)."""
    for a in cont["frames"]["era"] or []:
        if a["UiMin_0"] <= u <= a["UiMax_0"] and a["UiMin_1"] <= v <= a["UiMax_1"]:
            x, y = to_world(a, u, v)
            for b in cont["frames"]["tbc"]:
                if b["MapID"] == a["MapID"] and b["Region_0"] <= x <= b["Region_3"] and b["Region_1"] <= y <= b["Region_4"]:
                    return to_map(b, x, y)
    return None


# ---------------------------------------------------------------- import

def labels_of(path, cont):
    """The painting as a full-size grid of zone indices (-1 water), plus counts of odd colours."""
    w, h, rows = read_png(path)
    if abs(w / h - 1.5) > .01:
        sys.exit(f"{os.path.basename(path)} is {w}x{h}; it should be 3:2, like the reference (900x600)")
    pal = [tuple(z["color"]) for z in cont["zones"]]
    cache, odd, grid = {}, {}, []
    for row in rows:
        out = []
        for r, g, b, a in row:
            key = (r, g, b, a >= 128)
            if key not in cache:
                if a < 128 or (r > 245 and g > 245 and b > 245) or (r < 30 and g < 30 and b < 30):
                    cache[key] = -1
                else:
                    d, i = min(((r - c[0]) ** 2 + (g - c[1]) ** 2 + (b - c[2]) ** 2, i) for i, c in enumerate(pal))
                    cache[key] = i
                    if d > 35 ** 2:
                        odd[(r, g, b)] = odd.get((r, g, b), 0) + 1
            out.append(cache[key])
        grid.append(out)
    return w, h, grid, odd


def shrink(w, h, full):
    """Each grid cell takes the most common label among the painting's pixels it covers."""
    grid = []
    for gy in range(GH):
        y0, y1 = gy * h // GH, max(gy * h // GH + 1, (gy + 1) * h // GH)
        row = []
        for gx in range(GW):
            x0, x1 = gx * w // GW, max(gx * w // GW + 1, (gx + 1) * w // GW)
            counts = {}
            for y in range(y0, y1):
                for x in range(x0, x1):
                    l = full[y][x]
                    counts[l] = counts.get(l, 0) + 1
            row.append(max(counts, key=counts.get))
        grid.append(row)
    return grid


def check(name, grid, zones, keep):
    """Reports zones that are missing or painted well outside their game rectangle."""
    problems, optional = [], []
    for i, z in enumerate(zones):
        if i not in keep:
            continue
        cells = [(x, y) for y, row in enumerate(grid) for x, l in enumerate(row) if l == i]
        if not cells:
            (optional if z["n"] in CITIES else problems).append(z["n"] if z["n"] in CITIES else f"  missing: {z['n']}")
            continue
        m = 1.5  # percent of slack: the rectangles are exact, painting isn't
        out = sum(1 for x, y in cells if not (z["x0"] - m <= (x + .5) / GW * 100 <= z["x1"] + m and z["y0"] - m <= (y + .5) / GH * 100 <= z["y1"] + m))
        if out / len(cells) > .03:
            problems.append(f"  {z['n']}: {out / len(cells):.0%} of it is outside where the game puts {z['n']}")
    print(f"{name}: " + ("all zones look right" if not problems else f"{len(problems)} to check"))
    for p in problems:
        print(p)
    if optional:
        print("  capitals not painted (optional, they sit inside other zones): " + ", ".join(optional))
    return not problems


def preview(name, grid, zones):
    """<name>-check.png: the zones over the reference map, with each zone's game rectangle."""
    ref = os.path.join(KIT, f"{name}-reference.png")
    W2, H2 = GW * 2, GH * 2
    if os.path.exists(ref):
        rw, rh, rrows = read_png(ref)
        base = [[rrows[y * rh // H2][x * rw // W2] for x in range(W2)] for y in range(H2)]
    else:
        base = [[(20, 30, 45, 255)] * W2 for _ in range(H2)]
    out = []
    for y in range(H2):
        row = []
        for x in range(W2):
            l = grid[y // 2][x // 2]
            p = base[y][x]
            if l >= 0:
                c = zones[l]["color"]
                edge = (x // 2 + 1 < GW and grid[y // 2][x // 2 + 1] != l) or (y // 2 + 1 < GH and grid[y // 2 + 1][x // 2] != l)
                p = (0, 0, 0) if edge else tuple((p[i] + c[i] * 2) // 3 for i in range(3))
            row.append(p)
        out.append(row)
    for z in zones:
        x0, x1, y0, y1 = (int(z[k] / 100 * (W2 if k[0] == "x" else H2)) for k in ("x0", "x1", "y0", "y1"))
        for x in range(max(0, x0), min(W2, x1)):
            for y in (y0, y1 - 1):
                if 0 <= y < H2: out[y][x] = tuple(z["color"])
        for y in range(max(0, y0), min(H2, y1)):
            for x in (x0, x1 - 1):
                if 0 <= x < W2: out[y][x] = tuple(z["color"])
    write_png(os.path.join(KIT, f"{name}-check.png"), W2, H2, out)


def rle(grid, ids):
    rows = []
    for row in grid:
        runs, prev, n = [], row[0], 0
        for v in row + [None]:
            if v == prev:
                n += 1
                continue
            val = "" if prev < 0 else str(ids.index(prev))
            runs.append(f"{val}*{n}" if n > 1 else val)
            prev, n = v, 1
        rows.append(",".join(runs))
    return "/".join(rows)


def main():
    kit = json.load(open(os.path.join(KIT, "zones.json"), encoding="utf8"))
    traced = {"tbc": {}, "era": {}}
    ok = True
    for name, cont in kit["continents"].items():
        path = os.path.join(KIT, f"{name}.png")
        if not os.path.exists(path):
            print(f"{name}: no {name}.png yet, skipped")
            continue
        w, h, full, odd = labels_of(path, cont)
        if odd:
            print(f"{name}: {sum(odd.values())} pixels in colours that aren't in the palette (matched to the closest zone):")
            for c, n in sorted(odd.items(), key=lambda kv: -kv[1])[:5]:
                print(f"  rgb{c}: {n} pixels")
        zones = cont["zones"]
        tbc = shrink(w, h, full)
        ok &= check(f"{name} (Anniversary)", tbc, zones, set(range(len(zones))))
        preview(name, tbc, zones)
        ids = sorted({l for row in tbc for l in row if l >= 0})
        traced["tbc"][str(cont["id"])] = {"ids": [zones[i]["id"] for i in ids], "rle": rle(tbc, ids)}

        # Classic Era: the same painting through the game's coordinates, without the Anniversary-only zones
        if cont["frames"]["era"]:
            era_ids = {z["id"] for z in cont["era_zones"]}
            keep = {i for i, z in enumerate(zones) if z["id"] in era_ids}
            era = []
            for gy in range(GH):
                row = []
                for gx in range(GW):
                    p = era_to_tbc(cont, (gx + .5) / GW, (gy + .5) / GH)
                    l = -1
                    if p and 0 <= p[0] < 1 and 0 <= p[1] < 1:
                        l = full[int(p[1] * h)][int(p[0] * w)]
                    row.append(l if l in keep else -1)
                era.append(row)
            era_zones = [dict(z, **next(e for e in cont["era_zones"] if e["id"] == z["id"])) if z["id"] in era_ids else z for z in zones]
            ok &= check(f"{name} (Classic Era)", era, era_zones, keep)
            ids = sorted({l for row in era for l in row if l >= 0})
            traced["era"][str(cont["id"])] = {"ids": [zones[i]["id"] for i in ids], "rle": rle(era, ids)}

    s = open(SITE, encoding="utf8", newline="").read()
    a, b = s.index("  // MAP-TRACED-START"), s.index("  // MAP-TRACED-END")
    eol = "\r\n" if "\r\n" in s else "\n"
    block = ("  // MAP-TRACED-START: the painted zone maps, written by design/src/import_map.py (don't edit by hand)" + eol
             + "  const TRACED = " + json.dumps(traced, separators=(",", ":")) + ";" + eol)
    open(SITE, "w", encoding="utf8", newline="").write(s[:a] + block + s[b:])
    print("site/index.html updated" + ("" if ok else " (see the notes above; the map still works, but check those zones)"))


if __name__ == "__main__":
    main()
