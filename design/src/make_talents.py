"""Builds site/talents/forever.json: WoW Forever's talent trees, for the talent trees on character pages.

Forever keeps the classic talent trees in the game's trait system: one trait tree per class, with the three specs
side by side, four columns each and seven rows. The FunStats addon saves a character's tree and its "node:rank"
pairs (C_Traits); this file says where each node sits, its ranks, its spell, and the arrows between nodes.

Layout comes from the game client's tables (wago.tools DB2 exports of the wowf build), names and icons from
Wowhead's Forever tooltips. Spec names come from the classic Talent and TalentTab tables, matched by spell.

  {"<trait tree id>": {"class": "WARRIOR", "specs": [{"n": "Arms", "nodes": [[node, col, row, maxRank, spell, name, icon], ...]}, ...],
                       "edges": [[from node, to node], ...]}}

Usage: python design/src/make_talents.py   (downloads are cached in design/.map-cache, like make_maps.py)
"""
import collections
import csv
import json
import os
import time
import urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
CACHE = os.path.join(ROOT, "design", ".map-cache")
OUT = os.path.join(ROOT, "site", "talents", "forever.json")
BUILD = "1.60.1.70790"
CLASS_BITS = {1: "WARRIOR", 2: "PALADIN", 4: "HUNTER", 8: "ROGUE", 16: "PRIEST", 64: "SHAMAN", 128: "MAGE", 256: "WARLOCK", 1024: "DRUID"}


def fetch(url, path):
    if not os.path.exists(path):
        req = urllib.request.Request(url, headers={"User-Agent": "curl/8.9.1", "Accept": "*/*"})
        data = urllib.request.urlopen(req, timeout=60).read()
        open(path, "wb").write(data)
        time.sleep(0.15)
    return path


def table(name):
    path = fetch(f"https://wago.tools/db2/{name}/csv?build={BUILD}", os.path.join(CACHE, f"forever_{name}.csv"))
    return list(csv.DictReader(open(path, encoding="utf8")))


def spell_info(spell):
    """Name and icon from Wowhead's Forever tooltip."""
    path = fetch(f"https://nether.wowhead.com/forever/tooltip/spell/{spell}", os.path.join(CACHE, f"forever_spell_{spell}.json"))
    d = json.load(open(path, encoding="utf8"))
    return d.get("name", ""), d.get("icon", "")


# The three specs sit side by side, each four columns of 600 units starting here, and rows go down from 2130.
# Positions are snapped to the nearest cell (Hunter has a row 10 units off; Warlock leaves a column empty).
BLOCKS, ROW0, STEP = (1020, 5020, 9080), 2130, 600


def cell(x, y):
    block = max(i for i, b in enumerate(BLOCKS) if x >= b - STEP / 2)
    col, row = round((x - BLOCKS[block]) / STEP), round((y - ROW0) / STEP)
    assert 0 <= col <= 3 and 0 <= row <= 6, (x, y)
    return block, col, row


def build():
    os.makedirs(CACHE, exist_ok=True)
    trees = {int(r["TraitTreeID"]) for r in table("SkillLineXTraitTree")}
    # a node's first entry (lowest _Index; Forever numbers them 100, 200, ...)
    entry_of = {}
    for r in sorted(table("TraitNodeXTraitNodeEntry"), key=lambda r: -int(r["_Index"])):
        entry_of[int(r["TraitNodeID"])] = int(r["TraitNodeEntryID"])
    entries = {int(r["ID"]): r for r in table("TraitNodeEntry")}
    spells = {int(r["ID"]): int(r["SpellID"]) for r in table("TraitDefinition")}
    tabs = {int(r["ID"]): r for r in table("TalentTab")}
    # rank 1 spell -> its classic talent tab, for the spec's name and the class
    tab_of = {int(t["SpellRank_0"]): tabs.get(int(t["TabID"])) for t in table("Talent") if t["SpellRank_0"] != "0"}
    out = {}
    nodes = [n for n in table("TraitNode") if int(n["TraitTreeID"]) in trees]
    for tree in sorted(trees):
        # Hunter's tree has a node far off the grid (not shown in game) and one row 10 units off: skip and snap.
        mine = [n for n in nodes if int(n["TraitTreeID"]) == tree and int(n["PosX"]) < 20000 and int(n["PosY"]) < 20000]
        specs = [{"n": collections.Counter(), "nodes": []} for _ in range(3)]
        cls = None
        for n in mine:
            entry = entries[entry_of[int(n["ID"])]]
            spell = spells[int(entry["TraitDefinitionID"])]
            block, col, row = cell(int(n["PosX"]), int(n["PosY"]))
            name, icon = spell_info(spell)
            spec = specs[block]
            spec["nodes"].append([int(n["ID"]), col, row, int(entry["MaxRanks"]), spell, name, icon])
            tab = tab_of.get(spell)
            if tab:
                spec["n"][tab["Name_lang"]] += 1  # most of a block's talents come from its classic tab
                cls = cls or CLASS_BITS.get(int(tab["ClassMask"]))
        for s in specs:
            s["nodes"].sort(key=lambda r: (r[2], r[1]))
            print("   ", dict(s["n"]))
            assert s["n"], (tree, s["nodes"][:2])
            s["n"] = s["n"].most_common(1)[0][0]
        ids = {n["ID"] for n in mine}
        edges = sorted({(int(e["LeftTraitNodeID"]), int(e["RightTraitNodeID"])) for e in table("TraitEdge") if e["LeftTraitNodeID"] in ids})
        out[str(tree)] = {"class": cls, "specs": specs, "edges": [list(e) for e in edges]}
        print(cls, [f'{s["n"]} {len(s["nodes"])}' for s in specs], len(edges), "arrows")
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    json.dump(out, open(OUT, "w", encoding="utf8"), ensure_ascii=False, separators=(",", ":"))
    print(f"{OUT}: {os.path.getsize(OUT) // 1024} KB")


if __name__ == "__main__":
    build()
