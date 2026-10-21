# Azeroth Ledger: setup and reference

Everything about running your own ledger, the app, the database and the Blizzard API. For the overview, see the [README](../README.md); for a test checklist, see [TESTING.md](../TESTING.md).

A public stats site for WoW Forever (and the Anniversary / Classic Era realms while testing): deaths, damage, loot, gear and records for every character and guild that uses the **FunStats** addon.

- **Players** install the **Ledger app** once (Windows) and then just play. It installs the addon and uploads their stats every time they log out.
- **Guild mates without anything installed** still show up, with level, class and gear from guild rosters and the Blizzard armory.
- **The website** is a single page you can host anywhere for free. It reads the stats from Supabase.

## How it works

1. **The addon records stats per character**: combat, deaths, loot, gold, gear, talents, professions and more. WoW saves everything in `FunStats.lua` when you log out or `/reload`.
2. **It also records the guild roster**: every member's name, level and class. That's how members without the addon appear on the guild page.
3. **Addons share with each other in game.** While FunStats players are in the same party, raid or guild, their addons swap stats automatically. Nobody types anything.
4. **The Ledger app uploads the file** each time WoW saves it. Without the app, players can drop the file on the website's **Add stats** page instead. WoW doesn't let addons reach the internet, so a program outside the game has to do the upload.
5. **The Blizzard armory fills the gaps.** A scheduled Supabase function looks up characters on the ledger that don't upload themselves and adds their level, guild and gear.
6. **Each character is protected by an upload code.** The addon creates a private code in your file. The first upload of a character claims it; after that only the same code can update it. Copies of other players' stats and armory data only fill in characters that haven't uploaded their own stats, and never replace them.

### On the website

- **Realm page:** every character and guild on the chosen realm, with meters, achievements, deaths, loot, records and the **Guilds** list.
- **Guild pages** (`#/g/...`): the roster with leaders, the guild's deeds and latest loot and deaths, plus its own leaderboards and Hall of Fame.
- **Character pages** (`#/c/Name-Realm`): gear (Wowhead icons and tooltips) next to signature stats, then activity charts, records and a **Compare** panel. If the addon saw several characters on the same WoW account, the page lists "Other characters by this player".
- **Search** in the navigation bar finds characters and guilds across all realms.
- **Map of the Fallen** (on the Deaths view): every death, level-up and rare drop on pixel maps of Kalimdor, the Eastern Kingdoms and Outland, with a replay and the deadliest zones. Drag to move, Ctrl + scroll or pinch to zoom. FunStats 1.1 and newer save the positions (older deaths are converted at the next login). The continents are painted by hand over the game's own map art with the kit in [design/map-trace](../design/map-trace/README.md); the map appears on the site once a continent has been painted and imported.

Each page is split into a few views: Overview, Meters & Combat, Deaths, Loot & World, Characters and Add stats on realm and guild pages; Character, Activity, Records and Compare on character pages. Pick them from the tab bar, or from the **View** menu on phones.

## The Ledger app (Windows)

`site/AzerothLedger.exe` (80 KB) is offered on the **Add stats** page. When a player runs it once:

- it copies itself to `%LOCALAPPDATA%\AzerothLedger` and starts with Windows (no admin rights needed);
- it finds World of Warcraft (registry and the usual folders on every drive) and installs or updates the FunStats addon in every game folder except retail;
- it sits in the tray (a small shield) and uploads `FunStats.lua` a few seconds after WoW saves it. Only rows that changed are sent.

Tray menu: status, **Upload now**, **Show log**, **Start with Windows** and **Quit**. `AzerothLedger.exe --uninstall` turns off autostart. For an unusual install location, add the WoW folder on its own line in `%LOCALAPPDATA%\AzerothLedger\wow-folders.txt`.

Windows SmartScreen warns about apps from unknown publishers. Players click **More info → Run anyway** once. Only a paid code-signing certificate removes that warning.

**Building it:** run `app\build.cmd`. It uses the C# compiler that comes with Windows, bundles the current addon files from `FunStats/` into the exe, and copies the result to `site/`. Rebuild after every addon change so the app hands out the new version. Diagnostics: `AzerothLedger.exe --find` lists the WoW folders and save files it finds; `--ping` tests the connection to Supabase; `--dry-run FunStats.lua` prints what would be uploaded.

Mac players use the manual upload on the site. `sync/ledger_sync.py` (Python 3) also works on any system.

## One-time setup (site owner)

### 1. Supabase
Already done for this project. For a new project:
1. Create a free project at [supabase.com](https://supabase.com).
2. In **SQL Editor**, run `supabase/setup.sql`, then `supabase/public-uploads.sql`.
3. In **Project Settings → API Keys**, copy the **Project URL** and the **publishable key** (`sb_publishable_…`) into the top of `site/index.html` and `app/LedgerApp.cs`.

### 2. Website
1. Put the `site` folder online, for free:
   - **Netlify Drop:** drag the `site` folder onto [app.netlify.com/drop](https://app.netlify.com/drop), then sign up to keep it.
   - **GitHub Pages** or **Cloudflare Pages** work too.
2. Optional: put the site's address in `SiteUrl` in `app/LedgerApp.cs` and rebuild, so the tray menu gets an **Open the Ledger** item.
3. Share the link.

Until real stats arrive, the site shows made-up example data on its own "Example data" realms.

### 3. Blizzard API (armory)
1. Sign in at [develop.battle.net](https://develop.battle.net/access/clients) with your Battle.net account and create a client (any name; redirect URL isn't needed). Copy its **Client ID** and **Client Secret**.
2. In Supabase, open **Edge Functions → Deploy a new function → Via Editor**. Name it `armory`, paste `supabase/functions/armory/index.ts`, turn **off** "Verify JWT", and deploy. (The function ignores calls that come within 20 minutes of the last run, so leaving it open is safe.)
3. In **Edge Functions → Secrets**, add `BLIZZARD_CLIENT_ID` and `BLIZZARD_CLIENT_SECRET`.
4. In **SQL Editor**, run `supabase/armory.sql`. It allows armory rows and schedules the function every 3 hours.

To run it right away, open `https://nznnybzrqplsqyhotlnd.supabase.co/functions/v1/armory` in a browser. The answer says how many characters it looked up.

Which API it asks depends on the client version the addon recorded: 1.x uses Classic Era (`profile-classic1x`), 2.x uses TBC Anniversary (`profile-classicann`). Blizzard's realm lists confirm it: Thunderstrike, Spineshatter, Dreamscythe and Nightslayer are TBC Anniversary realms, while the hardcore realm Soulseeker is listed under Classic Era. Blizzard only has profiles for characters from about level 10.

To test one character without saving anything, open `https://nznnybzrqplsqyhotlnd.supabase.co/functions/v1/armory?check=Name-Realm`. Blizzard hasn't published an API for WoW Forever yet. Once they do, set the secret `FOREVER_NAMESPACE` to its profile namespace. Known realms have their region set in the function; other realms are tried in EU, then US.

## For players

**Windows:** download the app from the site's **Add stats** page and run it. Then just play.

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

## Themes, language and realms

Visitors pick a colour theme (Horde, Alliance or Felfire) and a language (English or Svenska) under **Settings**; the site remembers both. Swedish browsers start in Swedish. Game names (mobs, spells, zones, items) stay English. All Swedish text is in one table (`SV`) near the top of the script in `site/index.html`.

Stats are always shown for **one realm at a time**. The **Realm** picker groups realms by game (WoW Forever, Hardcore Forever, Anniversary, Classic Era, ...) and starts on the busiest WoW Forever realm, or the busiest realm overall until WoW Forever has data.

Which game a realm belongs to is set at the top of `site/index.html` under `games` and `defaultGame`. A rule can match realm names, a season id or a client version. Realms named in a rule are always listed in the Realm picker, even before anyone uploads; `hardcoreRealms` puts them under "<game> Hardcore". Anniversary is set up this way (Nightslayer, Dreamscythe, Thunderstrike, Spineshatter, plus Doomhowl and Soulseeker as hardcore).

The Anniversary realms run TBC Classic (client 2.5.6) since January 2026. On those realms the site links items to Wowhead's TBC database and plots levels up to 70.

Once WoW Forever is out, check its version with `/run print(GetBuildInfo())`. Add a rule if its realms show up under the wrong game, and add its interface number to `## Interface:` in `FunStats/FunStats.toc`.

## Good to know

- **Upload codes are like passwords for your characters.** They live in your `FunStats.lua`. Don't share that file publicly; uploading it on the site is fine.
- **Lost the file?** The upload code goes with it, and the characters stay claimed by the old code. The site owner can release a character by deleting its row from the `claims` table in Supabase.
- **Supabase's free tier pauses projects after about a week with no activity.** Visits, uploads and the armory schedule count as activity. If it pauses, click **Restore** in the dashboard; no data is lost.
- **Anyone can upload, so anyone could upload made-up stats for a brand-new character.** They can't touch characters that are already claimed.
- If the addon shows as "out of date", tick **Load out of date AddOns** on the character screen, or update the `## Interface:` number in `FunStats/FunStats.toc` (and rebuild the app).

## Files

| Path | What it is |
|---|---|
| `FunStats/` | The addon (`FunStats.lua` records, `Sync.lua` shares between players) |
| `FunStats.zip` | The addon, zipped (also in `site/` for download) |
| `app/` | The Ledger app for Windows (`LedgerApp.cs`, `build.cmd`) |
| `site/` | The website (`index.html`), plus `AzerothLedger.exe` and `FunStats.zip` for download |
| `sync/` | Python uploader, for Mac/Linux or anyone without the app |
| `supabase/setup.sql`, `supabase/public-uploads.sql` | Database setup |
| `supabase/functions/armory/`, `supabase/armory.sql` | Blizzard armory sync |
| `TESTING.md` | Checklist for testing on Anniversary |
