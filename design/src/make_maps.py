"""Builds the Map of the Fallen's continent maps in site/maps/ from the game client's own world map art.

For Classic Era (1.15) and Anniversary (TBC 2.5), each continent's map art is stitched from its 256 px tiles
(UiMapArtTile, via the wago.tools DB2 and file exports) and cropped to the in-game map frame, 1002 x 668.
That frame is exactly the 0-1 map space the game uses for positions on the map (C_Map), which is where the
FunStats addon records deaths, level-ups and loot, so markers placed by percentage line up with the art.

  site/maps/era-1414.webp  Kalimdor           site/maps/tbc-1414.webp  Kalimdor (with the Draenei isles)
  site/maps/era-1415.webp  Eastern Kingdoms   site/maps/tbc-1415.webp  Eastern Kingdoms (with Quel'Thalas)
                                              site/maps/tbc-1945.webp  Outland

and every zone and capital on them the same way, fully explored: a zone's base art is mostly blank parchment,
and the game fills in each area you discover with an overlay (WorldMapOverlay); all of them are drawn in.
  site/maps/<build>-<zone map id>.webp, e.g. tbc-1429.webp (Elwynn Forest)
A zone's map is its own 0-1 map space, the one zone positions (the addon's x, y) are in.

It also writes design/maps-check/<build>-<continent>.png: the same art with every zone's rectangle from
UiMapAssignment drawn on top, to check by eye that zones and art agree (git-ignored).

Usage: python design/src/make_maps.py   (needs Pillow: pip install pillow; downloads are cached in design/.map-cache)
The map art is Blizzard Entertainment's; the site credits it under the map.
"""
import csv
import json
import os
import time
import urllib.request

from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
CACHE = os.path.join(ROOT, "design", ".map-cache")
CHECK = os.path.join(ROOT, "design", "maps-check")
OUT = os.path.join(ROOT, "site", "maps")
BUILDS = {"tbc": "2.5.6.70006", "era": "1.15.9.70003"}
CONTINENTS = {1414: "Kalimdor", 1415: "Eastern Kingdoms", 1945: "Outland"}
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


def zone_rects(build, cont):
    """Each zone's rectangle on the continent map (0-1), the same numbers as C_Map.GetMapRectOnMap."""
    maps = {int(r["ID"]): r for r in table(build, "UiMap")}
    assign = {}
    for r in table(build, "UiMapAssignment"):
        assign.setdefault(int(r["UiMapID"]), []).append({k: float(v) for k, v in r.items() if k.startswith(("Ui", "Region")) or k == "MapID"})
    out = []
    for mid, m in maps.items():
        if int(m["ParentUiMapID"]) != cont or int(m["Type"]) != 3 or mid not in assign:
            continue
        za = assign[mid][0]
        cx, cy = (za["Region_0"] + za["Region_3"]) / 2, (za["Region_1"] + za["Region_4"]) / 2
        ca = [a for a in assign[cont] if a["MapID"] == za["MapID"] and a["Region_0"] <= cx <= a["Region_3"] and a["Region_1"] <= cy <= a["Region_4"]]
        if not ca:
            continue
        u0, v0 = to_map(ca[0], za["Region_3"], za["Region_4"])
        u1, v1 = to_map(ca[0], za["Region_0"], za["Region_1"])
        out.append((m["Name_lang"], min(u0, u1), min(v0, v1), max(u0, u1), max(v0, v1)))
    return out


def blp(build, file_id):
    path = fetch(f"https://wago.tools/api/casc/{file_id}?version={BUILDS[build]}&download", os.path.join(CACHE, f"{build}_{file_id}.blp"))
    return Image.open(path)


def zone_ids(build, cont):
    """The zones and capitals shown on a continent (the same ones zone_rects lists)."""
    return [int(r["ID"]) for r in table(build, "UiMap") if int(r["ParentUiMapID"]) == cont and int(r["Type"]) == 3]


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
        if f.endswith(".webp") and rest[:-5].isdigit() and int(rest[:-5]) not in CONTINENTS:
            index.setdefault(build, []).append(int(rest[:-5]))
    json.dump(index, open(os.path.join(OUT, "index.json"), "w"), separators=(",", ":"))


def main():
    for d in (CACHE, CHECK, OUT):
        os.makedirs(d, exist_ok=True)
    font = ImageFont.load_default(size=12)
    for build in BUILDS:
        for cont, name in CONTINENTS.items():
            im = art(build, cont)
            if im is None:
                continue
            path = os.path.join(OUT, f"{build}-{cont}.webp")
            im.save(path, "WEBP", quality=90, method=6)
            check = im.copy()
            g = ImageDraw.Draw(check)
            for n, x0, y0, x1, y1 in zone_rects(build, cont):
                box = [x0 * FRAME[0], y0 * FRAME[1], x1 * FRAME[0], y1 * FRAME[1]]
                g.rectangle(box, outline=(255, 40, 40), width=1)
                g.text(((box[0] + box[2]) / 2, (box[1] + box[3]) / 2), n, font=font, fill=(255, 255, 0), anchor="mm", stroke_width=2, stroke_fill=(0, 0, 0))
            check.save(os.path.join(CHECK, f"{build}-{cont}.png"))
            print(f"{build} {name}: {os.path.getsize(path) // 1024} KB")
            for zone in zone_ids(build, cont):
                zim = art(build, zone)
                if zim is not None:
                    zim.save(os.path.join(OUT, f"{build}-{zone}.webp"), "WEBP", quality=86, method=6)
                    write_index()
            print(f"  {len(zone_ids(build, cont))} zones")


if __name__ == "__main__":
    main()
