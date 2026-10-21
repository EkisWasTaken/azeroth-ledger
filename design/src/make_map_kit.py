"""Builds the map tracing kit in design/map-trace/ (see the README there).

For each continent, from the game client's own data (via the wago.tools DB2 and file exports):
  <name>-reference.png   the in-game continent map, 900x600, to trace over (git-ignored: Blizzard's art)
  <name>-guides.png      each zone's exact rectangle and name, from UiMapAssignment (transparent layer)
  <name>.gpl             one named colour per zone (Aseprite, LibreSprite, Pixelorama, GIMP)
and zones.json, which design/src/import_map.py uses to read the paintings.

The paintings are done on the Anniversary (TBC) maps, which include everything the Classic Era maps have
plus Quel'Thalas, the Draenei islands and Outland; the importer converts them into the Era frames.

Needs Pillow (pip install pillow) to read the game's BLP textures. Downloads go to design/map-trace/.cache.
"""
import csv
import io
import json
import os
import time
import urllib.request

from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
KIT = os.path.join(ROOT, "map-trace")
CACHE = os.path.join(KIT, ".cache")
BUILDS = {"tbc": "2.5.6.70006", "era": "1.15.9.70003"}
CONTINENTS = {1414: "kalimdor", 1415: "eastern-kingdoms", 1945: "outland"}
SIZE = (900, 600)  # painting size: 2x the site's 450x300 grid, same 3:2 shape as the in-game map frame
FRAME = (1002, 668)  # the in-game map frame the art is drawn in

# Distinct colours, one per zone (water is left transparent). No white or near-black: the importer
# treats those as water too, since editors often use them for an empty background.
COLOURS = [(230, 25, 75), (60, 180, 75), (255, 225, 25), (0, 130, 200), (245, 130, 48), (145, 30, 180), (70, 240, 240),
           (240, 50, 230), (210, 245, 60), (250, 190, 212), (0, 128, 128), (220, 190, 255), (170, 110, 40), (255, 250, 200),
           (128, 0, 0), (170, 255, 195), (128, 128, 0), (255, 215, 180), (0, 0, 128), (128, 128, 128), (180, 0, 90),
           (100, 60, 20), (60, 100, 20), (20, 60, 100), (200, 100, 100), (100, 200, 100), (100, 100, 200), (200, 200, 100),
           (100, 200, 200), (200, 100, 200), (0, 200, 150), (160, 200, 255)]


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


def frames_and_zones(build):
    """Each continent's assignments (world box -> map rectangle) and its zones' rectangles on it."""
    maps = {int(r["ID"]): r for r in table(build, "UiMap")}
    assign = {}
    for r in table(build, "UiMapAssignment"):
        assign.setdefault(int(r["UiMapID"]), []).append({k: float(v) for k, v in r.items() if k.startswith(("Ui", "Region")) or k == "MapID"})
    out = {}
    for cont in CONTINENTS:
        if cont not in maps or cont not in assign:
            continue
        frame = [a for a in assign[cont]]
        zones = []
        for mid, m in maps.items():
            if int(m["ParentUiMapID"]) != cont or int(m["Type"]) != 3 or mid not in assign:
                continue
            za = assign[mid][0]
            cx, cy = (za["Region_0"] + za["Region_3"]) / 2, (za["Region_1"] + za["Region_4"]) / 2
            ca = [a for a in frame if a["MapID"] == za["MapID"] and a["Region_0"] <= cx <= a["Region_3"] and a["Region_1"] <= cy <= a["Region_4"]]
            if not ca:
                continue
            u0, v0 = to_map(ca[0], za["Region_3"], za["Region_4"])
            u1, v1 = to_map(ca[0], za["Region_0"], za["Region_1"])
            zones.append({"id": mid, "n": m["Name_lang"], "x0": round(min(u0, u1) * 100, 2), "x1": round(max(u0, u1) * 100, 2),
                          "y0": round(min(v0, v1) * 100, 2), "y1": round(max(v0, v1) * 100, 2)})
        out[cont] = {"n": maps[cont]["Name_lang"], "frame": frame, "zones": sorted(zones, key=lambda z: z["n"])}
    return out


def to_map(a, x, y):
    """World x, y (on a's world map) to 0-1 map coordinates: horizontal is -Y, vertical is -X."""
    u = a["UiMin_0"] + (a["Region_4"] - y) / (a["Region_4"] - a["Region_1"]) * (a["UiMax_0"] - a["UiMin_0"])
    v = a["UiMin_1"] + (a["Region_3"] - x) / (a["Region_3"] - a["Region_0"]) * (a["UiMax_1"] - a["UiMin_1"])
    return u, v


def reference(build, cont):
    """The continent's map art stitched from its tiles into the in-game frame."""
    xart = {int(r["UiMapID"]): int(r["UiMapArtID"]) for r in table(build, "UiMapXMapArt")}
    tiles = [r for r in table(build, "UiMapArtTile") if int(r["UiMapArtID"]) == xart[cont] and r["LayerIndex"] == "0"]
    im = Image.new("RGB", (1024, 768))
    for r in tiles:
        f = int(r["FileDataID"])
        path = fetch(f"https://wago.tools/api/casc/{f}?version={BUILDS[build]}&download", os.path.join(CACHE, f"{build}_{f}.blp"))
        im.paste(Image.open(path).convert("RGB"), (int(r["ColIndex"]) * 256, int(r["RowIndex"]) * 256))
    return im.crop((0, 0) + FRAME).resize(SIZE, Image.LANCZOS)


def main():
    os.makedirs(CACHE, exist_ok=True)
    tbc, era = frames_and_zones("tbc"), frames_and_zones("era")
    font = ImageFont.load_default(size=13)
    kit = {"size": SIZE, "continents": {}}
    for cont, name in CONTINENTS.items():
        if cont not in tbc:
            continue
        zones = tbc[cont]["zones"]
        for z, col in zip(zones, COLOURS):
            z["color"] = col
        reference("tbc", cont).save(os.path.join(KIT, f"{name}-reference.png"))

        guides = Image.new("RGBA", SIZE, (0, 0, 0, 0))
        g = ImageDraw.Draw(guides)
        for z in zones:
            box = [z["x0"] / 100 * SIZE[0], z["y0"] / 100 * SIZE[1], z["x1"] / 100 * SIZE[0], z["y1"] / 100 * SIZE[1]]
            g.rectangle(box, outline=z["color"] + (255,), width=1)
            cx, cy = (box[0] + box[2]) / 2, (box[1] + box[3]) / 2
            g.text((cx, cy), z["n"], font=font, fill=z["color"] + (255,), anchor="mm", stroke_width=2, stroke_fill=(0, 0, 0, 255))
        guides.save(os.path.join(KIT, f"{name}-guides.png"))

        with open(os.path.join(KIT, f"{name}.gpl"), "w", encoding="utf8", newline="\n") as f:
            f.write(f"GIMP Palette\nName: {tbc[cont]['n']} zones\nColumns: 4\n#\n")
            for z in zones:
                r, gr, b = z["color"]
                f.write(f"{r:3d} {gr:3d} {b:3d}\t{z['n']}\n")

        kit["continents"][name] = {
            "id": cont, "n": tbc[cont]["n"], "zones": zones,
            "frames": {"tbc": tbc[cont]["frame"], "era": era[cont]["frame"] if cont in era else None},
            "era_zones": [z for z in era[cont]["zones"]] if cont in era else [],
        }
        print(name, len(zones), "zones")
    json.dump(kit, open(os.path.join(KIT, "zones.json"), "w", encoding="utf8"), ensure_ascii=False, indent=1)


if __name__ == "__main__":
    main()
