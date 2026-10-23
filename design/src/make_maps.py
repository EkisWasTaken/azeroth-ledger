"""Builds the Map of the Fallen's continent maps in site/maps/ from the game client's own world map art.

For Classic Era (1.15) and Anniversary (TBC 2.5), each continent's map art is stitched from its 256 px tiles
(UiMapArtTile, via the wago.tools DB2 and file exports) and cropped to the in-game map frame, 1002 x 668.
That frame is exactly the 0-1 map space the game uses for positions on the map (C_Map), which is where the
FunStats addon records deaths, level-ups and loot, so markers placed by percentage line up with the art.

  site/maps/era-1414.webp  Kalimdor           site/maps/tbc-1414.webp  Kalimdor (with the Draenei isles)
  site/maps/era-1415.webp  Eastern Kingdoms   site/maps/tbc-1415.webp  Eastern Kingdoms (with Quel'Thalas)
                                              site/maps/tbc-1945.webp  Outland

For Mists of Pandaria Classic (5.5) the site shows one world map instead, Azeroth, with Kalimdor, the Eastern
Kingdoms, Northrend and Pandaria on it (each opens as its own map):

  site/maps/mop-947.webp  Azeroth             site/maps/mop-12.webp, mop-13.webp, mop-113.webp, mop-424.webp

and every zone and capital on the Classic Era and Anniversary continents the same way, fully explored: a zone's base art is mostly blank parchment,
and the game fills in each area you discover with an overlay (WorldMapOverlay); all of them are drawn in.
  site/maps/<build>-<zone map id>.webp, e.g. tbc-1429.webp (Elwynn Forest)
A zone's map is its own 0-1 map space, the one zone positions (the addon's x, y) are in.

It also writes design/maps-check/<build>-<continent>.png: the same art with every zone's rectangle from
UiMapAssignment drawn on top, to check by eye that zones and art agree (git-ignored).

Usage: python design/src/make_maps.py [era] [tbc] [mop]   (all builds when none is named; needs Pillow: pip install pillow; downloads are cached in design/.map-cache)
The map art is Blizzard Entertainment's; the site credits it under the map.
"""
import csv
import json
import os
import sys
import time
import urllib.request

from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
CACHE = os.path.join(ROOT, "design", ".map-cache")
CHECK = os.path.join(ROOT, "design", "maps-check")
OUT = os.path.join(ROOT, "site", "maps")
BUILDS = {"tbc": "2.5.6.70006", "era": "1.15.9.70003", "mop": "5.5.4.70531"}
# The top maps the site draws per build, and the type of map shown on them: zones (3) or, on Azeroth, continents (2).
TOP = {
    "era": ({1414: "Kalimdor", 1415: "Eastern Kingdoms"}, 3),
    "tbc": ({1414: "Kalimdor", 1415: "Eastern Kingdoms", 1945: "Outland"}, 3),
    "mop": ({947: "Azeroth"}, 2),
}
FRAME = (1002, 668)  # the in-game world map frame inside the 1024 x 768 tile grid: map coordinates 0-1


def fetch(url, path):
    if not os.path.exists(path):
        req = urllib.request.Request(url, headers={"User-Agent": "curl/8.9.1", "Accept": "*/*"})
        data = urllib.request.urlopen(req, timeout=60).read()
        open(path, "wb").write(data)
        time.sleep(0.15)
    return path


def table(build, name):
    path = fetch(f"https://wago.tools/db2/{name}/csv?build={BUILDS[build]}", os.path.join(CACHE, f"{build}_{name}.csv"))
    return list(csv.DictReader(open(path, encoding="utf8")))


def to_map(a, x, y):
    """World x, y (inside assignment a) to 0-1 map coordinates: horizontal is -Y, vertical is -X."""
    u = a["UiMin_0"] + (a["Region_4"] - y) / (a["Region_4"] - a["Region_1"]) * (a["UiMax_0"] - a["UiMin_0"])
    v = a["UiMin_1"] + (a["Region_3"] - x) / (a["Region_3"] - a["Region_0"]) * (a["UiMax_1"] - a["UiMin_1"])
    return u, v


def from_map(a, u, v):
    """0-1 map coordinates (inside assignment a) back to world x, y: the inverse of to_map."""
    y = a["Region_4"] - (u - a["UiMin_0"]) / (a["UiMax_0"] - a["UiMin_0"]) * (a["Region_4"] - a["Region_1"])
    x = a["Region_3"] - (v - a["UiMin_1"]) / (a["UiMax_1"] - a["UiMin_1"]) * (a["Region_3"] - a["Region_0"])
    return x, y


def zone_rects(build, cont, kind=3, ids=False):
    """Each zone's (or, on Azeroth, continent's) rectangle on the parent map (0-1), the same numbers as
    C_Map.GetMapRectOnMap: the child map's own 0-1 frame carried through the world onto the parent."""
    maps = {int(r["ID"]): r for r in table(build, "UiMap")}
    assign = {}
    for r in table(build, "UiMapAssignment"):
        assign.setdefault(int(r["UiMapID"]), []).append({k: float(v) for k, v in r.items() if k.startswith(("Ui", "Region")) or k == "MapID"})
    out = []
    for mid, m in maps.items():
        if int(m["ParentUiMapID"]) != cont or int(m["Type"]) != kind or mid not in assign:
            continue
        za = assign[mid][0]
        cx, cy = (za["Region_0"] + za["Region_3"]) / 2, (za["Region_1"] + za["Region_4"]) / 2
        ca = [a for a in assign[cont] if a["MapID"] == za["MapID"] and a["Region_0"] <= cx <= a["Region_3"] and a["Region_1"] <= cy <= a["Region_4"]]
        if not ca:
            continue
        u0, v0 = to_map(ca[0], *from_map(za, 0, 0))
        u1, v1 = to_map(ca[0], *from_map(za, 1, 1))
        rect = (m["Name_lang"], min(u0, u1), min(v0, v1), max(u0, u1), max(v0, v1))
        out.append((mid,) + rect if ids else rect)
    return out


def blp(build, file_id):
    path = fetch(f"https://wago.tools/api/casc/{file_id}?version={BUILDS[build]}&download", os.path.join(CACHE, f"{build}_{file_id}.blp"))
    return Image.open(path)


def zone_ids(build, cont, kind=3):
    """The zones and capitals shown on a continent, or the continents on Azeroth (the same ones zone_rects lists)."""
    return [r[0] for r in zone_rects(build, cont, kind, ids=True)]


def art(build, ui_map):
    """A map's art (continent or zone), stitched from its tiles with every discovered-area overlay drawn in,
    cropped to the map frame (None if the build lacks it)."""
    xart = {int(r["UiMapID"]): int(r["UiMapArtID"]) for r in table(build, "UiMapXMapArt")}
    if ui_map not in xart:
        return None
    art_id = xart[ui_map]
    tiles = [r for r in table(build, "UiMapArtTile") if int(r["UiMapArtID"]) == art_id and r["LayerIndex"] == "0"]
    if not tiles:
        return None
    im = Image.new("RGB", (1024, 768))
    for r in tiles:
        im.paste(blp(build, int(r["FileDataID"])).convert("RGB"), (int(r["ColIndex"]) * 256, int(r["RowIndex"]) * 256))
    pieces = {}
    for r in table(build, "WorldMapOverlayTile"):
        if r["LayerIndex"] == "0":
            pieces.setdefault(int(r["WorldMapOverlayID"]), []).append(r)
    for o in table(build, "WorldMapOverlay"):
        if int(o["UiMapArtID"]) != art_id:
            continue
        w, h = int(o["TextureWidth"]), int(o["TextureHeight"])
        ov = Image.new("RGBA", (w + 256, h + 256))
        for r in pieces.get(int(o["ID"]), []):
            ov.paste(blp(build, int(r["FileDataID"])).convert("RGBA"), (int(r["ColIndex"]) * 256, int(r["RowIndex"]) * 256))
        ov = ov.crop((0, 0, w, h))
        im.paste(ov, (int(o["OffsetX"]), int(o["OffsetY"])), ov)
    return im.crop((0, 0) + FRAME)


def write_index():
    """site/maps/index.json: the zone maps that exist, per build, so the site only lets those be opened."""
    index = {}
    for f in sorted(os.listdir(OUT)):
        build, _, rest = f.partition("-")
        if f.endswith(".webp") and rest[:-5].isdigit() and build in TOP and int(rest[:-5]) not in TOP[build][0]:
            index.setdefault(build, []).append(int(rest[:-5]))
    json.dump(index, open(os.path.join(OUT, "index.json"), "w"), separators=(",", ":"))


def main():
    for d in (CACHE, CHECK, OUT):
        os.makedirs(d, exist_ok=True)
    font = ImageFont.load_default(size=12)
    for build in [b for b in BUILDS if b in sys.argv[1:]] or BUILDS:
        tops, kind = TOP[build]
        for cont, name in tops.items():
            im = art(build, cont)
            if im is None:
                continue
            path = os.path.join(OUT, f"{build}-{cont}.webp")
            im.save(path, "WEBP", quality=90, method=6)
            check = im.copy()
            g = ImageDraw.Draw(check)
            for n, x0, y0, x1, y1 in zone_rects(build, cont, kind):
                box = [x0 * FRAME[0], y0 * FRAME[1], x1 * FRAME[0], y1 * FRAME[1]]
                g.rectangle(box, outline=(255, 40, 40), width=1)
                g.text(((box[0] + box[2]) / 2, (box[1] + box[3]) / 2), n, font=font, fill=(255, 255, 0), anchor="mm", stroke_width=2, stroke_fill=(0, 0, 0))
            check.save(os.path.join(CHECK, f"{build}-{cont}.png"))
            print(f"{build} {name}: {os.path.getsize(path) // 1024} KB")
            for zone in zone_ids(build, cont, kind):
                zim = art(build, zone)
                if zim is not None:
                    zim.save(os.path.join(OUT, f"{build}-{zone}.webp"), "WEBP", quality=86, method=6)
                    write_index()
            print(f"  {len(zone_ids(build, cont, kind))} {'continents' if kind == 2 else 'zones'}")


if __name__ == "__main__":
    main()
