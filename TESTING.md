# Testing on Anniversary

A checklist for trying FunStats, the Ledger app and the site on an Anniversary realm before WoW Forever launches on Nov 4. It takes about an hour with a friend.

The Anniversary realms run TBC Classic (client 2.5.6) since January 2026, so that's what this tests. Uploads go to the real Supabase database, so everything you upload shows on the site. Step 8 cleans it up before launch.

## 1. Open the site

The site is live at https://azeroth-ledger.pages.dev. To test changes you haven't pushed yet, run it on your PC instead, from the `Azeroth Ledger` folder:

```bash
python -m http.server 8000 --directory site
```

and open http://localhost:8000.

## 2. Install with the Ledger app

1. Run `site\AzerothLedger.exe` (or download it from **Add stats** on the site). If Windows says it protected your PC, click **More info → Run anyway**.
2. A tray message says "Azeroth Ledger is running", and a small shield icon appears in the tray (it may be hidden under the **^** arrow).
3. Right-click the shield and choose **Show log**. It should say it installed `FunStats.toc`, `FunStats.lua` and `Sync.lua` in `_anniversary_` (and `_classic_era_`).

**Check:** start WoW. On the character screen, **AddOns** lists FunStats without "out of date". On login, chat shows a FunStats line saying it's tracking your character.

If something goes wrong in game, type `/console scriptErrors 1`, then `/reload`. Note any red error text (a screenshot is fine).

## 3. Play for 20–30 minutes

Do a bit of everything, so every stat gets something:

- [ ] Kill some mobs (damage, killing blows, crits)
- [ ] Heal yourself or someone else, if your class can
- [ ] Finish a quest and loot some gold
- [ ] Jump around and run between zones (jumps, distance, zones)
- [ ] Die once, to a mob and if possible from falling (deaths, causes of death)
- [ ] Loot something green or better
- [ ] Duel a friend (duels)

Type `/funstats`. The numbers should be going up.

### Dungeon bosses

Boss fights are recorded from the game's own encounter events. These always fire in raids. For the old leveling dungeons this needs checking, so run one if you can (Ragefire Chasm or the Deadmines are quick):

- [ ] Kill a boss, then type `/funstats bosses`. It should list the boss with 1 kill and the fight's length, and "this run" should count it.
- [ ] If a boss is missing, note which dungeon and boss. Type `/console scriptErrors 1` first, in case it's an error rather than a missing event.
- [ ] Die and run back in as a ghost: `/funstats bosses` still shows the same run.
- [ ] Leave, and after 10 minutes outside the run is finished.

**Check on the site:** **Dungeons & Raids** lists the fight under **The Boss Log** (open it for the damage meter) and the run under **Dungeon Runs**. Your character's **Records** page lists the boss under **Bosses defeated**.

## 4. Log out, and check the upload

Log out (or `/reload`). Within about 20 seconds the tray status (right-click the shield) should change to "Uploaded …", and **Show log** lists your character.

**Check on the site** (reload it):
- [ ] The Realm menu shows your realm under Anniversary (or Anniversary Hardcore), with your character. The example data is gone.
- [ ] **Character view:** gear with Wowhead icons (hover an item for its TBC tooltip), talents, professions, signature stats and Lately.
- [ ] **Activity:** charts, recent deaths with the right cause, zones, loot. The level chart goes to 70.
- [ ] **Records** and **Compare** (Compare needs a second character).

## 5. Check the guild roster

If your character is in a guild, stay online for a minute after login so the addon records the roster, then log out.

**Check:** click the guild's name on the site. The guild page lists **every member** (with level and class, even those without the addon), the **Leaders** list and **Lately**.

## 6. Test with a friend

1. Your friend runs the app too and plays a bit. You don't need to play at the same time.

   **Check:** after they log out, their character appears on the site by itself.
2. Group up for a few minutes, then both log out.

   **Check:** your character still shows your own numbers. Their copy of your stats never replaces your own upload.

Optional: `/funstats sync` shows whose stats your addon has received in game. It only shows; sharing is automatic.

## 7. Blizzard armory (after setting it up)

Do the README's "Blizzard API" steps first. Then open `https://nznnybzrqplsqyhotlnd.supabase.co/functions/v1/armory`.

**Check:** the answer looks like `{"looked_up": 12, "found": 11, "missing": 1}`, and guild members without the addon now show gear on their character pages ("Gear from the Blizzard armory").

If it says `"found": 0`, Blizzard probably doesn't serve these realms under the namespace the function guesses. Send me the answer and a character name, and I'll adjust it.

## 8. Before WoW Forever launches: clear the test data

In Supabase, open **Table Editor**. Delete all rows in **entries**, then all rows in **claims** (and in **hidden** and **blocked_uploaders**, if you used them). Deleting the claims frees the test characters' names, so they can be claimed again.

The app can stay installed: it picks up the WoW Forever folder by itself and installs the addon there too.

## What to report back

- Any Lua errors (screenshot plus what you were doing)
- Numbers that look wrong (for example "I died 3 times but it says 1")
- A realm listed under the wrong game
- App trouble: the last lines of **Show log**
- Anything on the site that's confusing or broken, with the page and phone/desktop
