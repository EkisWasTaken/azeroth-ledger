<p align="center">
  <img src="docs/images/banner.png" alt="Azeroth Ledger: fun stats for WoW Forever. Deaths, damage, loot and glory for you, your friends and your guild." width="100%">
</p>

<p align="center">
  <b>A WoW addon, a tiny Windows app and a website that turn your adventures into leaderboards, charts and bragging rights.</b><br>
  Built for <b>WoW Forever</b> (launching Nov 4, 2026). Works on the Anniversary and Classic Era realms today.
</p>

<p align="center">
  <a href="#for-players">Get started</a> ·
  <a href="#how-it-works">How it works</a> ·
  <a href="docs/setup.md">Setup guide</a> ·
  <a href="TESTING.md">Testing checklist</a>
</p>

<br>

<img src="docs/images/h-features.png" alt="What it tracks" width="100%">

<img src="docs/images/tiles.png" alt="Example stat tiles: 47 deaths, 2.4M damage dealt, 312 gold looted, 18,204 jumps" width="100%">

The **FunStats** addon quietly records everything worth laughing about, per character:

| | |
|---|---|
| ⚔️ **Combat** | damage, healing, crits, overkill, killing blows, biggest hits, damage by ability |
| 💀 **Deaths** | who or what killed you, where, at what level, falling and drowning included, plus your nemeses |
| 💰 **Loot & gold** | rare drops, gold looted and spent, repairs, your richest moment |
| 🗺️ **The world** | zones, distance run, jumps (yes, every one), time played, hearthstones, dungeon runs |
| 🛡️ **Your character** | gear with Wowhead icons and tooltips, talents, professions, level-ups |
| 🏆 **Glory** | achievements like *Can't stop jumping* and *Spends ages dead*, personal bests, a Hall of Fame |

Everything is shown **per realm**, with **guild pages**, **search**, **character comparisons**, **weekly and all-time** views, three themes (**Horde**, **Alliance**, **Felfire**) and **English or Swedish**.

<br>

<img src="docs/images/h-how.png" alt="How it works" width="100%">

<a name="how-it-works"></a>

```mermaid
flowchart LR
    A["🎮 FunStats addon<br>records your stats in game"] -->|"WoW saves on logout"| B["🛡️ Ledger app<br>uploads in the background"]
    A <-->|"shares with your party,<br>raid and guild"| A2["🎮 Friends' addons"]
    B --> C[("Supabase<br>database")]
    D["🌐 Blizzard API<br>gear for everyone else"] -->|"every 3 hours"| C
    C --> E["📜 The website<br>leaderboards, charts, pages"]
```

1. **The addon records** your stats per character, and the **guild roster**, so every guild mate appears on the site even without the addon.
2. **Addons share with each other.** While FunStats players group up or share a guild, their addons swap stats automatically.
3. **The Ledger app uploads** your stats a few seconds after every logout. WoW doesn't let addons reach the internet, so a small app outside the game does it.
4. **The Blizzard API** fills in level, guild and gear for guild members who don't run the addon.
5. **Your characters are yours.** Each install has a private upload code. The first upload claims a character, and nobody else can overwrite it.

<br>

<img src="docs/images/h-players.png" alt="For players" width="100%">

<a name="for-players"></a>

**Windows:** download **AzerothLedger.exe** from the website's *Add stats* page and run it once. That's it. It installs the addon, starts with Windows, and uploads after every play session. Then just play.

> Windows may warn about an unknown publisher the first time: click **More info → Run anyway**.

**Mac, or without the app:** download `FunStats.zip`, put the `FunStats` folder in `World of Warcraft\_anniversary_\Interface\AddOns` (or your WoW Forever folder), play, then drop `WTF\Account\<ACCOUNT>\SavedVariables\FunStats.lua` on the *Add stats* page.

In-game commands are optional: `/funstats` shows today's numbers, and `/funstats sync` shows whose stats your addon has received.

<br>

<img src="docs/images/h-owners.png" alt="Run your own" width="100%">

The website is a static page, live at **[azeroth-ledger.pages.dev](https://azeroth-ledger.pages.dev)** on Cloudflare Pages, backed by a free Supabase project. Every push to `main` publishes it. The **[setup guide](docs/setup.md)** walks through the database, hosting, the Blizzard API and building the app. The **[testing checklist](TESTING.md)** covers a full test run on an Anniversary realm.

<br>

<img src="docs/images/h-dev.png" alt="Under the hood" width="100%">

| Folder | What's inside |
|---|---|
| [`FunStats/`](FunStats) | The WoW addon (Lua): `FunStats.lua` records, `Sync.lua` shares stats between players |
| [`app/`](app) | The Windows app (C#, built with the compiler that ships with Windows: `app\build.cmd`) |
| [`site/`](site) | The website: `index.html`, `app.js`, `styles.css` and `config.js` (vanilla JS, Chart.js, Wowhead tooltips), plus the downloads |
| [`supabase/`](supabase) | Database setup (SQL) and the `armory` Edge Function for the Blizzard API |
| [`sync/`](sync) | A Python uploader for Mac and Linux |
| [`tests/`](tests) | Checks for the upload rules and the uploaders |
| [`docs/`](docs) | The setup guide, and the README artwork (`docs/src/make_images.py` regenerates it) |

The pixel logo lives in [`app/logo.py`](app/logo.py) as a 16×16 grid and is shared by the app icon, the website and this README.

<br>

<p align="center">
  <sub>A fan project for friends and guilds. Not affiliated with or endorsed by Blizzard Entertainment.<br>World of Warcraft and Blizzard Entertainment are trademarks of Blizzard Entertainment, Inc.</sub>
</p>
