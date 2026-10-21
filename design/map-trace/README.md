# Map tracing kit

The website's **Map of the Fallen** draws Kalimdor and the Eastern Kingdoms from zone maps painted by hand
over the game's own map art. This folder has everything needed to paint them, and
`design/src/import_map.py` puts the paintings on the site. Until a continent is painted, the map stays
hidden on the site.

You paint each continent **once**, on the Anniversary (TBC) map: it has everything the Classic Era map has,
plus Quel'Thalas, the Draenei islands and Outland. The import converts your painting into the Classic Era
map through the game's own coordinates, so both kinds of realm get a map from one painting.

## What's here

| File | What it is |
|---|---|
| `kalimdor-reference.png`, `eastern-kingdoms-reference.png`, `outland-reference.png` | The in-game continent maps, 900 × 600, to trace over. Made from the game files; **not committed** (Blizzard's art). Rebuild with `make_map_kit.py` if missing. |
| `*-guides.png` | A transparent layer with each zone's exact rectangle and name, straight from the game's data. Each zone's paint should sit inside its rectangle. |
| `*-draft.png` | An automatic rough trace in the right colours, if you'd rather fix than start from nothing. Optional. |
| `kalimdor.gpl`, `eastern-kingdoms.gpl`, `outland.gpl` | One named colour per zone. |
| `zones.json` | Zone ids, colours and map frames, used by the importer. |

## Painting

Any pixel editor with layers works: **Aseprite** (best), **LibreSprite** or **Pixelorama** (free),
**Piskel** (free, in the browser).

1. **New image, 900 × 600, transparent background.** (Any 3:2 size works; 900 × 600 matches the kit.)
2. **Load the palette**, e.g. `kalimdor.gpl`:
   Aseprite: palette menu ☰ → *Load Palette*. LibreSprite: same. Pixelorama: *Palettes* → *Import*.
   Each colour is named after its zone.
3. **Layers, bottom to top:**
   - `kalimdor-reference.png`, at 40–60 % opacity, locked.
   - **Zones**: your painting layer.
   - `kalimdor-guides.png` (toggle it on when you're unsure which zone is which).
   - Optional: start the Zones layer from `kalimdor-draft.png` and correct it.
4. **Paint each zone in its palette colour**, following the coasts and the dark border lines in the
   reference:
   - **Pencil only, anti-aliasing off.** Every pixel must be exactly a palette colour.
   - **Water stays transparent.** That includes lakes. (Pure white or black also count as water.)
   - No outlines: where two colours meet is the border.
   - Outline a zone at high zoom, then fill the inside with the bucket (contiguous on).
   - **Capitals** (Orgrimmar, Stormwind City, ...) are optional small areas inside other zones.
5. **Export only the Zones layer** as PNG (hide the reference and guides), named exactly:
   `kalimdor.png`, `eastern-kingdoms.png` (and `outland.png` if you do Outland), in this folder.

Roughly an hour or two per continent. Kalimdor and the Eastern Kingdoms are what matter; Outland only shows
on the site once someone has died, dinged or looted there.

## Importing

```
python design/src/import_map.py
```

It needs nothing beyond Python. For each painting it:

- reports zones that are **missing** or painted **outside where the game puts them** (more than a few
  percent outside the zone's rectangle usually means the wrong colour was used, or paint spilled into
  a neighbour),
- reports colours that aren't in the palette (often anti-aliasing),
- writes `<name>-check.png`: your zones over the reference map with each zone's game rectangle, to look over,
- writes the maps into `site/index.html`.

Fix and run it again as often as you like; open the site's **Deaths** page to see the result.

## Rebuilding the kit

The reference images and palettes come from the game's data (via wago.tools exports of the client files).
To rebuild them, for example for a new game version:

```
pip install pillow
python design/src/make_map_kit.py
```

Downloads are cached in `.cache/` (not committed).
