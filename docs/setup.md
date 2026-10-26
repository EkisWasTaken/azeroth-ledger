# Azeroth Ledger: setup and reference

Everything about running your own ledger, the app, the database and the Blizzard API. For the overview, see the [README](../README.md); for a test checklist, see [TESTING.md](../TESTING.md).

A public stats site for WoW Forever (and the Anniversary / Classic Era realms while testing): deaths, damage, loot, gear and records for every character and guild that uses the **FunStats** addon.

- **Players** install the **Ledger app** once (Windows) and then just play. It installs the addon and uploads their stats every time they log out.
- **Guild mates without anything installed** still show up, with level, class and gear from guild rosters and the Blizzard armory.
- **The website** is a static page (`site/`) you can host anywhere for free. It reads the stats from Supabase.

## How it works

1. **The addon records stats per character**: combat, deaths, loot, gold, gear, talents, professions and more. WoW saves everything in `FunStats.lua` when you log out or `/reload`.
2. **It also records the guild roster**: every member's name, level and class. That's how members without the addon appear on the guild page.
3. **Addons share with each other in game.** While FunStats players are in the same party, raid or guild, their addons swap stats automatically. Nobody types anything.
4. **The Ledger app uploads the file** each time WoW saves it. Without the app, players can drop the file on the website's **Add stats** page instead. WoW doesn't let addons reach the internet, so a program outside the game has to do the upload.
5. **The Blizzard armory fills the gaps.** A scheduled Supabase function looks up characters on the ledger that don't upload themselves and adds their level, guild and gear.
6. **Each character is protected by an upload code.** The addon creates a private code in your file. The first upload of a character claims it; after that only the same code can update it. Copies of other players' stats and armory data only fill in characters that haven't uploaded their own stats, and never replace them. A copy can't claim to be newer than the moment it was uploaded, and one upload code can store at most 400 copies.

### On the website

- **Realm page:** every character and guild on the chosen realm, with meters, achievements, deaths, loot, records and the **Guilds** list.
- **Guild pages** (`#/g/...`): the roster with leaders, the guild's deeds and latest loot and deaths, plus its own leaderboards and Hall of Fame.
- **Character pages** (`#/c/Name-Realm`): gear (Wowhead icons and tooltips) next to signature stats, then activity charts, records and a **Compare** panel. If the addon saw several characters on the same WoW account, the page lists "Other characters by this player".
- **Search** in the navigation bar finds characters and guilds across all realms.
- **Atlas** (its own page): the **Map of the Fallen** and the **Atlas of Azeroth** (when the group plays, favourite zones). The map shows every death, level-up and rare drop on the game's own world maps of Kalimdor, the Eastern Kingdoms and Outland (Classic Era or TBC art, matching the realm's client), with a replay and the deadliest zones. Hover a zone to see its name and click it to zoom into that zone's own map, fully explored; in a zone, click a capital to open it. Right-click (or **‹ Back to …** above the map) zooms back out to where you were, like the in-game map. Drag to move, Ctrl + scroll or pinch to zoom. FunStats 1.1 and newer save the positions; older records that only have a zone position are placed through the zone's rectangle, as the game does. The maps are built from the client's map art on [wago.tools](https://wago.tools) by `python design/src/make_maps.py` (needs Pillow) into `site/maps/`: each continent, and each zone with all its discovered-area overlays drawn in. It also writes check images with every zone's rectangle drawn over the continent art to `design/maps-check/`. The art is Blizzard's, credited under the map.

Each page is split into a few views: Overview, Meters & Combat, Deaths, Atlas, Loot & Gold, Characters and Add stats on realm and guild pages; Character, Activity, Records and Compare on character pages. Pick them from the tab bar, or from the **View** menu on phones.

## The Ledger app (Windows)

`site/AzerothLedger.exe` (80 KB) is offered on the **Add stats** page. When a player runs it once:

- it copies itself to `%LOCALAPPDATA%\AzerothLedger` and starts with Windows (no admin rights needed);
- it finds World of Warcraft (registry and the usual folders on every drive) and installs or updates the FunStats addon in every game folder except retail;
- it sits in the tray (a small shield) and uploads `FunStats.lua` a few seconds after WoW saves it. Only rows that changed are sent.

Tray menu: status, **Open the Ledger**, **Upload now**, **Show log**, **Start with Windows** and **Quit**. `AzerothLedger.exe --uninstall` turns off autostart. For an unusual install location, add the WoW folder on its own line in `%LOCALAPPDATA%\AzerothLedger\wow-folders.txt`.

**Updates:** at start and every 6 hours, the app reads `app-version.txt` from the website. When it names a newer version, the app downloads `AzerothLedger.exe`, checks it against the SHA-256 hash in that file, and replaces itself. The new app brings the new addon with it. Apps older than 1.1 can't update themselves, so those players download the app once more.

Windows SmartScreen warns about apps from unknown publishers. Players click **More info → Run anyway** once. Only a paid code-signing certificate removes that warning.

**Building it:** run `app\build.cmd`. It uses the C# compiler that comes with Windows, bundles the current addon files from `FunStats/` into the exe, and writes three files to `site/`: `AzerothLedger.exe`, `FunStats.zip` and `app-version.txt`. Rebuild after every addon change, and **raise `AssemblyVersion` in `app/LedgerApp.cs` first**: installed apps only update to a higher version number. Push to publish. Diagnostics: `AzerothLedger.exe --find` lists the WoW folders and save files it finds; `--ping` tests the connection to Supabase; `--dry-run FunStats.lua` prints what would be uploaded.

Mac players use the manual upload on the site. `sync/ledger_sync.py` (Python 3) also works on any system.

## One-time setup (site owner)

### 1. Supabase
Already done for this project. For a new project:
1. Create a free project at [supabase.com](https://supabase.com).
2. In **SQL Editor**, run `supabase/setup.sql`, then `supabase/public-uploads.sql`, then (after the armory step below) `supabase/hardening.sql`.
3. In **Project Settings → API Keys**, copy the **Project URL** and the **publishable key** (`sb_publishable_…`) into `site/config.js` and `app/LedgerApp.cs`.

**This project:** if `supabase/hardening.sql` hasn't been run yet, run it once now. Until then the site reads the whole table, and the moderation commands below don't exist.

### 2. Website
The site is live at **https://azeroth-ledger.pages.dev**, on Cloudflare Pages connected to the GitHub repository: every push to `main` publishes the `site` folder (no build step). To check a change before pushing, run `python -m http.server 8000 --directory site` and open http://localhost:8000.

For a new copy of the project:
1. In Cloudflare, **Workers & Pages → Create → Pages → Connect to Git**, pick the repository, leave the build command empty and set the output directory to `site`. (Netlify or GitHub Pages work too.)
2. Put the site's address in `SiteUrl` in `app/LedgerApp.cs` and rebuild. The tray menu gets an **Open the Ledger** item, and the app updates itself from there.
3. Share the link.

Until real stats arrive, the site shows made-up example data on its own "Example data" realms.

### 3. Blizzard API (armory)
1. Sign in at [develop.battle.net](https://develop.battle.net/access/clients) with your Battle.net account and create a client (any name; redirect URL isn't needed). Copy its **Client ID** and **Client Secret**.
2. In Supabase, open **Edge Functions → Deploy a new function → Via Editor**. Name it `armory`, paste `supabase/functions/armory/index.ts`, turn **off** "Verify JWT", and deploy. (The function ignores calls that come within 20 minutes of the last run, so leaving it open is safe.)
3. In **Edge Functions → Secrets**, add `BLIZZARD_CLIENT_ID` and `BLIZZARD_CLIENT_SECRET`.
4. In **SQL Editor**, run `supabase/armory.sql`. It allows armory rows and schedules the function every 3 hours.

To run it right away, open `https://nznnybzrqplsqyhotlnd.supabase.co/functions/v1/armory` in a browser. The answer says how many characters it looked up.

Besides characters, the function looks up each guild's crest (the in-game tabard, shown on guild pages and guild cards) and full-body character renders. Once a week, one run fetches Blizzard's dungeon journal instead (instance art and boss portraits for Classic and Burning Crusade); its answer then says how many instances and bosses it found. After updating the function, open the link above twice, 20 minutes apart: the first run fetches the journal, the second starts on characters and crests.

Which API it asks depends on the client version the addon recorded: 1.x uses Classic Era (`profile-classic1x`), 2.x uses TBC Anniversary (`profile-classicann`). Blizzard's realm lists confirm it: Thunderstrike, Spineshatter, Dreamscythe and Nightslayer are TBC Anniversary realms, while the hardcore realm Soulseeker is listed under Classic Era. Blizzard only has profiles for characters from about level 10.

To test one character without saving anything, open `https://nznnybzrqplsqyhotlnd.supabase.co/functions/v1/armory?check=Name-Realm`. Blizzard hasn't published an API for WoW Forever yet. Once they do, set the secret `FOREVER_NAMESPACE` to its profile namespace. Known realms have their region set in the function; other realms are tried in EU, then US.

## For players

**Windows:** download the app from the site's **Add stats** page and run it. Then just play. It updates itself and the addon (see [Updates](#the-ledger-app-windows)); restart WoW to load a new addon.

**Mac or without the app:**
1. Unzip `FunStats.zip` into the game's AddOns folder, for example `World of Warcraft\_anniversary_\Interface\AddOns`.
2. Play, then log out so WoW saves the file.
3. Upload `WTF\Account\YOUR_ACCOUNT\SavedVariables\FunStats.lua` on the site's **Add stats** page.

In-game commands are all optional:

| Command | What it does |
|---|---|
| `/funstats` | Today's numbers |
| `/funstats sync` | Shows whose stats your addon has received (sharing itself is automatic) |
| `/funstats add group` | Track everyone in your group in combat, even players without the addon |
| `/funstats add Name` / `remove Name` / `friends` | Manage that tracking list |
| `/funstats announce` | Post your deaths in group chat |

## Moderation

Run these in Supabase's **SQL Editor** (they need `supabase/hardening.sql`). The public key can't call them.

| Command | What it does |
|---|---|
| `insert into hidden (char_key, reason) values ('Name-Realm', 'why');` | Hides a character from the site (its own stats, copies and observations) |
| `delete from hidden where char_key = 'Name-Realm';` | Shows it again |
| `select release_character('Name-Realm');` | Frees a character: for a lost upload code, or a name someone else claimed first. The next upload of it claims it. |
| `select block_uploader('Name-Realm');` | Blocks the upload code that claimed this character and removes everything it uploaded |
| `select block_uploader('r:0123456789abcdef:Name-Realm');` | The same, found from a copy (the `id` of a `relay` or `obs` row in the `entries` table) |

The site leaves hidden characters out the next time a visitor loads it.

## Themes, language and realms

Visitors pick a colour theme (Horde, Alliance or Felfire) and a language (English or Svenska) under **Settings**; the site remembers both. Swedish browsers start in Swedish. Game names (mobs, spells, zones, items) stay English. All Swedish text is in one table (`SV`) at the top of `site/app.js`.

Stats are always shown for **one realm at a time**. The **Realm** picker groups realms by game (WoW Forever, Hardcore Forever, Anniversary, Classic Era, ...) and starts on the busiest WoW Forever realm, or the busiest realm overall until WoW Forever has data.

Which game a realm belongs to is set in `site/config.js` under `games` and `defaultGame`. A rule can match realm names, a season id or a client version. Realms named in a rule are always listed in the Realm picker, even before anyone uploads; `hardcoreRealms` puts them under "<game> Hardcore". Anniversary is set up this way (Nightslayer, Dreamscythe, Thunderstrike, Spineshatter, plus Doomhowl and Soulseeker as hardcore). Other Blizzard clients (TBC, Wrath, Cata and MoP Classic, Retail) have their own version rules, so only clients that match nothing count as WoW Forever.

The Anniversary realms run TBC Classic (client 2.5.6) since January 2026. On those realms the site links items to Wowhead's TBC database and plots levels up to 70.

Once WoW Forever is out, check its version with `/run print(GetBuildInfo())`. Add a rule if its realms show up under the wrong game, and add its interface number to `## Interface:` in `FunStats/FunStats.toc`.

## Good to know

- **Upload codes are like passwords for your characters.** They live in your `FunStats.lua`. Don't share that file publicly; uploading it on the site is fine.
- **Lost the file?** The upload code goes with it, and the characters stay claimed by the old code. The site owner can free them with `release_character` (see [Moderation](#moderation)).
- **Supabase's free tier pauses projects after about a week with no activity.** Visits, uploads and the armory schedule count as activity. If it pauses, click **Restore** in the dashboard; no data is lost.
- **Anyone can upload, so anyone could upload made-up stats for a brand-new character,** or claim a name before its real owner does. They can't touch characters that are already claimed. Hide, release or block them with the [moderation](#moderation) commands.
- If the addon shows as "out of date", tick **Load out of date AddOns** on the character screen, or update the `## Interface:` number in `FunStats/FunStats.toc` (and rebuild the app).

## Tests

- `python -m unittest discover tests` checks that the three uploaders (the Python script, the site's **Add stats** page and the Windows app) turn the same save file into the same rows, and that none of them sends the upload code. The site check needs Node.js, and the app check needs a built `site/AzerothLedger.exe`. Each is skipped if it can't run.
- `tests/upload_rules.sql` checks the database rules: claims, copies, the 400-copy limit, hiding, releasing and blocking. Paste it into Supabase's **SQL Editor** and run it. It always ends with an error on purpose, so nothing is saved. "ALL CHECKS PASSED" means everything works; "FAILED: …" names the rule that broke.

## Files

| Path | What it is |
|---|---|
| `FunStats/` | The addon (`FunStats.lua` records, `Sync.lua` shares between players) |
| `app/` | The Ledger app for Windows (`LedgerApp.cs`, `build.cmd`) |
| `site/` | The website: `index.html`, `app.js` (code and Swedish text), `styles.css`, `config.js` (Supabase keys, games and realms), plus `AzerothLedger.exe`, `FunStats.zip` and `app-version.txt` (written by `app\build.cmd`) |
| `sync/` | Python uploader, for Mac/Linux or anyone without the app |
| `supabase/setup.sql`, `supabase/public-uploads.sql`, `supabase/hardening.sql` | Database setup, upload checks, moderation |
| `design/src/make_maps.py`, `site/maps/` | The Map of the Fallen's continent maps, built from the game's map art |
| `tests/` | Checks for the upload rules and the uploaders (see [Tests](#tests)) |
| `supabase/functions/armory/`, `supabase/armory.sql` | Blizzard armory sync |
| `TESTING.md` | Checklist for testing on Anniversary |
