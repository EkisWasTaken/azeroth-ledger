# Map tracing kit

The website's **Map of the Fallen** draws Kalimdor and the Eastern Kingdoms from zone maps painted by hand
over the game's own map art. This folder has everything needed to paint them, and
`design/src/import_map.py` puts the paintings on the site. Until a continent is painted, the map stays
hidden on the site.

You paint each continent **once**, on the Anniversary (TBC) map: it has everything the Classic Era map has,
plus Quel'Thalas, the Draenei islands and Outland. The import converts your painting into the Classic Era
map through the game's own coordinates, so both kinds of realm get a map from one painting.

**Kalimdor and the Eastern Kingdoms are what matter.** Outland is optional: it only shows on the site once
someone has died, dinged or looted there.

## What's here

| File | What it is |
|---|---|
| `kalimdor.ase`, `eastern-kingdoms.ase`, `outland.ase` | **Ready to paint in LibreSprite**: the game map, your Zones layer and the guides, with the zone palette. Contains Blizzard's art, so it's **not committed**. Never overwritten when the kit is rebuilt. |
| `*-reference.png` | The in-game continent maps, 900 × 600 (not committed, same reason). |
| `*-guides.png` | Each zone's exact rectangle and name, straight from the game's data. |
| `*-draft.png` | An automatic rough trace in the right colours, the starting point in the `.ase` files. |
| `*.gpl` | The zone palettes, for other editors (Aseprite, Pixelorama, GIMP). |
| `zones.json` | Zone ids, colours and map frames, used by the importer. |

If the `.ase` or reference files are missing (for example on another computer), rebuild the kit: see the end.

## Painting in LibreSprite

LibreSprite is free: [libresprite.github.io](https://libresprite.github.io). Download the Windows version,
unzip it and run `libresprite.exe`.

### 1. Open the file

**File → Open** → `design/map-trace/kalimdor.ase`. The zone colours are already in the palette on the left.

At the bottom is the **timeline** with three layers (eye = visible, padlock = locked):

| Layer | What it's for |
|---|---|
| **Guides (zone areas)** | Hidden. Click its eye to see each zone's area and name, in that zone's colour. |
| **Zones** | **Your painting.** Starts with the rough draft. Always click this layer before painting. |
| **Reference (game map)** | The real map at 50 %, locked so you can't paint on it by accident. |

Prefer to start from nothing? Click the **Zones** layer, press **Ctrl+A**, then **Delete**.

### 2. Pick a zone's colour

Each zone has its own colour: see the [tables below](#zone-colours). The quickest ways to get the right one:

- **Alt + click** on a zone in the draft (or on a label in the Guides layer): the eyedropper picks its exact colour.
- Or click the swatch in the palette. Swatches are in the same order as the tables.

Use only palette colours. The importer tells you if a pixel is a colour that isn't in the palette.

### 3. Paint

| Tool | Key | Use it for |
|---|---|---|
| **Pencil** | **B** | Coastlines and borders, pixel by pixel. Brush size 1 for detail, 3–5 for rough areas. |
| **Paint bucket** | **G** | Filling a zone once its edges are closed. In the bar at the top: **Contiguous** on, **Tolerance 0**. |
| **Eraser** | **E** | Water. Erasing makes it transparent, which is what water should be. |
| **Eyedropper** | **Alt + click** | Picking a zone's colour off the map. |

- **Zoom** with the mouse wheel, **move around** by holding **Space** and dragging.
- **Undo** with **Ctrl+Z**.
- Follow the reference: coasts are where the land's colour meets the grey-blue shallow water; zone borders
  are the thin dark lines on the land.
- Don't draw outlines. Where two colours meet *is* the border.
- **Lakes** are water: erase them.
- **Capitals** (Orgrimmar, Thunder Bluff, Darnassus, The Exodar, Stormwind City, Ironforge, Undercity,
  Silvermoon City) are optional little areas inside other zones. Skip them if you like.
- Keep the image in **RGB** mode (Sprite → Color Mode) and don't resize it.

### 4. Save

**Ctrl+S**, keeping the `.ase` format and name. Save often; the importer always reads the latest save.

### 5. See it on the site

From the project folder:

```
python design/src/import_map.py
```

It reads the `.ase` files directly (no exporting needed) and:

- reports zones that are **missing** or painted **outside where the game puts them**: more than a few
  percent outside a zone's area usually means the wrong colour, or paint spilling into a neighbour;
- reports colours that aren't in the palette;
- saves `<name>-check.png`: your zones over the game map with each zone's area outlined, to look over;
- saves `<name>.png`, a plain copy of your Zones layer (this one *is* committed, as a backup of your work);
- puts the maps on the site: open the **Deaths** page to see them.

Run it as often as you like. A file you haven't painted in yet (still exactly the draft) is skipped, so the
draft never reaches the site by accident.

## Other editors

Aseprite opens the same `.ase` files. In any other pixel editor (Pixelorama, Piskel, GIMP): make a 900 × 600
transparent image, put `<name>-reference.png` underneath at half opacity, load `<name>.gpl`, paint the zones
on a layer of their own, and export just that layer as `<name>.png` into this folder. The importer reads it the
same way.

## Zone colours

The `#` is the swatch's position in the palette.

### Kalimdor (kalimdor.ase)

| # | Zone | Colour |
|---|---|---|
| 1 | Ashenvale | `#e6194b` |
| 2 | Azshara | `#3cb44b` |
| 3 | Azuremyst Isle | `#ffe119` |
| 4 | Bloodmyst Isle | `#0082c8` |
| 5 | Darkshore | `#f58230` |
| 6 | Darnassus | `#911eb4` |
| 7 | Desolace | `#46f0f0` |
| 8 | Durotar | `#f032e6` |
| 9 | Dustwallow Marsh | `#d2f53c` |
| 10 | Felwood | `#fabed4` |
| 11 | Feralas | `#008080` |
| 12 | Moonglade | `#dcbeff` |
| 13 | Mulgore | `#aa6e28` |
| 14 | Orgrimmar | `#fffac8` |
| 15 | Silithus | `#800000` |
| 16 | Stonetalon Mountains | `#aaffc3` |
| 17 | Tanaris | `#808000` |
| 18 | Teldrassil | `#ffd7b4` |
| 19 | The Barrens | `#000080` |
| 20 | The Exodar | `#808080` |
| 21 | Thousand Needles | `#b4005a` |
| 22 | Thunder Bluff | `#643c14` |
| 23 | Un'Goro Crater | `#3c6414` |
| 24 | Winterspring | `#143c64` |

### Eastern Kingdoms (eastern-kingdoms.ase)

| # | Zone | Colour |
|---|---|---|
| 1 | Alterac Mountains | `#e6194b` |
| 2 | Arathi Highlands | `#3cb44b` |
| 3 | Badlands | `#ffe119` |
| 4 | Blasted Lands | `#0082c8` |
| 5 | Burning Steppes | `#f58230` |
| 6 | Deadwind Pass | `#911eb4` |
| 7 | Dun Morogh | `#46f0f0` |
| 8 | Duskwood | `#f032e6` |
| 9 | Eastern Plaguelands | `#d2f53c` |
| 10 | Elwynn Forest | `#fabed4` |
| 11 | Eversong Woods | `#008080` |
| 12 | Ghostlands | `#dcbeff` |
| 13 | Hillsbrad Foothills | `#aa6e28` |
| 14 | Ironforge | `#fffac8` |
| 15 | Isle of Quel'Danas | `#800000` |
| 16 | Loch Modan | `#aaffc3` |
| 17 | Redridge Mountains | `#808000` |
| 18 | Searing Gorge | `#ffd7b4` |
| 19 | Silvermoon City | `#000080` |
| 20 | Silverpine Forest | `#808080` |
| 21 | Stormwind City | `#b4005a` |
| 22 | Stranglethorn Vale | `#643c14` |
| 23 | Swamp of Sorrows | `#3c6414` |
| 24 | The Hinterlands | `#143c64` |
| 25 | Tirisfal Glades | `#c86464` |
| 26 | Undercity | `#64c864` |
| 27 | Western Plaguelands | `#6464c8` |
| 28 | Westfall | `#c8c864` |
| 29 | Wetlands | `#64c8c8` |

### Outland (outland.ase)

| # | Zone | Colour |
|---|---|---|
| 1 | Blade's Edge Mountains | `#e6194b` |
| 2 | Hellfire Peninsula | `#3cb44b` |
| 3 | Nagrand | `#ffe119` |
| 4 | Netherstorm | `#0082c8` |
| 5 | Shadowmoon Valley | `#f58230` |
| 6 | Shattrath City | `#911eb4` |
| 7 | Terokkar Forest | `#46f0f0` |
| 8 | Zangarmarsh | `#f032e6` |

## Rebuilding the kit

The reference images, guides and palettes come from the game's data (via wago.tools exports of the client
files). To rebuild them, for example on another computer or for a new game version:

```
pip install pillow
python design/src/make_map_kit.py
```

Downloads are cached in `.cache/` (not committed). Existing `.ase` files are left alone, so a rebuild never
touches your painting; delete one to get a fresh copy.
