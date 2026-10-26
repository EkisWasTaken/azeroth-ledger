(() => {
  // ---------- language ----------
  // English is written inline in the code; this table holds the Swedish for each English string.
  // {0}, {1} are placeholders. Game names (mobs, spells, zones, items) stay English, like the game itself.
  const SV = {
    // header, tabs, banners
    "Every death, every crit, every greedy roll. A chronicle of our deeds in WoW Forever.": "Varje död, varje crit, varje girig roll. En krönika över våra dåd i WoW Forever.",
    "Every death, every crit, every greedy roll.": "Varje död, varje crit, varje girig roll.",
    "This Week": "Denna vecka", "All Time": "Totalt", "Join the Ledger": "Gå med i liggaren", "Game &amp; realm": "Spel &amp; realm", "Realm": "Realm",
    "Time range": "Tidsperiod", "Previous week": "Föregående vecka", "Week": "Vecka", "Next week": "Nästa vecka", "Colour theme": "Färgtema", "Language": "Språk",
    "Stat shown in the meter": "Statistik i mätaren", "per hour": "per timme",
    "{0} friend, {1}.": "{0} vän, {1}.", "{0} friends, {1}.": "{0} vänner, {1}.", "{0} character": "{0} karaktär", "{0} characters": "{0} karaktärer",
    " Updated {0}.": " Uppdaterad {0}.",
    "Opening the ledger…": "Öppnar liggaren…",
    "<strong>Example data.</strong> This site isn't connected to Supabase yet. Add your project URL and publishable key in <code>config.js</code>.": "<strong>Exempeldata.</strong> Sidan är inte kopplad till Supabase än. Lägg in projektets URL och publishable key i <code>config.js</code>.",
    "<strong>Couldn't reach the ledger.</strong> Showing example data instead. Try reloading in a minute.": "<strong>Kunde inte nå liggaren.</strong> Visar exempeldata i stället. Försök ladda om om en minut.",
    "<strong>The ledger is connected but still empty.</strong> Stats appear after the first sync. Until then, this is example data.": "<strong>Liggaren är kopplad men fortfarande tom.</strong> Statistiken dyker upp efter första synken. Tills dess är det här exempeldata.",
    "All time": "Totalt", "Week of {0} – {1}": "Vecka {0} – {1}", "Other": "Övrigt", "Unknown realm": "Okänd realm",

    // section headings (static page)
    "‹ Back to the Ledger": "‹ Tillbaka till liggaren", "Back to the Ledger": "Tillbaka till liggaren",
    "Signature Stats": "Signaturstatistik", "Where they stand out from the group": "Där de sticker ut från gruppen",
    "Character Sheet": "Karaktärsblad", "Achievements Held": "Achievements", "all time": "totalt",
    "Damage and healing per day": "Damage och healing per dag", "last 30 days played": "senaste 30 speldagarna",
    "Level progress": "Levelprogress", "Damage by ability": "Damage per spell", "Causes of death": "Dödsorsaker", "Nemeses": "Ärkefiender",
    "Personal Bests": "Personliga rekord", "Recent deaths": "Senaste dödsfall", "When they play": "När de spelar",
    "Favorite zones": "Favoritzoner", "hours": "timmar", "Best loot": "Bästa lootet", "rare and better": "rare och bättre",
    "Ledger of Deeds": "Dådens liggare", "Achievements Earned": "Achievements", "Glory for some, shame for others": "Ära för vissa, skam för andra",
    "The Meters": "Mätarna", "Who's pumping, who's padding": "Vem pumpar, vem paddar", "Damage Done": "Damage", "Damage per day": "Damage per dag",
    "The Race to 60": "Racet till 60", "Every ding, plotted": "Varje ding, inritat", "By date": "Per datum", "By /played": "Per /played",
    "The Spirit Healer's Log": "Spirit Healerns logg", "Combat log": "Combat log", "most recent first": "senaste först",
    "Deaths by level": "Dödsfall per level", "Most Wanted": "Mest efterlysta", "The creatures that killed us most": "Mobsen som dödat oss mest",
    "Deadliest places": "Dödligaste platserna", "Combat Analysis": "Stridsanalys", "Crits, whiffs and the art of not getting hit": "Crits, bom och konsten att inte bli träffad",
    "Playstyle": "Spelstil", "each stat scaled to the group's best": "varje värde jämfört med gruppens bästa",
    "Crit rate": "Crit rate", "Damage taken vs healing received": "Tagen damage mot mottagen healing", "Combat sheet": "Stridsblad",
    "Loot Council": "Lootrådet", "Mostly grey, occasionally purple": "Mest grått, ibland lila", "Loot by quality": "Loot per kvalitet",
    "green or better drops": "gröna eller bättre", "Gold earned and spent": "Guld intjänat och spenderat", "Notable drops": "Anmärkningsvärda drops",
    "The Treasury": "Skattkammaren", "Gold in the bags, day by day": "Guld i väskorna, dag för dag", "Gold held": "Guld i väskorna",
    "all characters combined": "alla karaktärer sammanlagt", "Atlas of Azeroth": "Azeroths atlas", "When we play and where we go": "När vi spelar och vart vi går",
    "When the group plays": "När gruppen spelar", "time played, by weekday and hour": "speltid per veckodag och timme", "less": "mindre", "more": "mer",
    "hours spent": "timmar", "The Spellbook": "Spellbook", "Where everyone's damage comes from": "Var allas damage kommer ifrån",
    "Bonds of the Guild": "Guildens band", "Rivalries and guardian angels": "Rivaliteter och skyddsänglar", "Duel rivalries": "Duellrivaliteter",
    "row's wins – losses against column": "radens vinster – förluster mot kolumnen", "Guardian angels": "Skyddsänglar", "who healed whom the most": "vem som healade vem mest",
    "Hall of Fame": "Hederssalen", "All-time records. Some to be proud of.": "Rekord genom tiderna. Vissa att vara stolt över.",
    "The Full Ledger": "Hela liggaren", "The Guild Roster": "Guildens roster", "Every friend, their main and their alts": "Alla vänner, deras main och deras alts",
    "Weeks start on Tuesday, matching the US weekly reset. Dates use each player's own computer clock.": "Veckor börjar på tisdag, som den amerikanska veckoåterställningen. Datum följer varje spelares egen datorklocka.",

    // metric and column names
    "Healing Done": "Healing", "Killing Blows": "Killing blows", "Deaths": "Dödsfall", "Damage Taken": "Tagen damage", "Healing Received": "Mottagen healing",
    "Experience": "XP", "Quests Completed": "Avklarade quests", "Gold Looted": "Lootat guld", "Repair Bills": "Reparationer",
    "Distance Traveled": "Tillryggalagd sträcka", "Jumps": "Hopp", "Time Played": "Speltid", "Time as a Ghost": "Tid som spöke",
    "Time on Flight Paths": "Tid på flygrutter", "Time Swimming": "Tid i vattnet", "Time AFK": "Tid AFK", "Time Grouped": "Tid i grupp",
    "Dungeon Runs": "Dungeon runs", "Spells Cast": "Castade spells", "Overkill": "Overkill", "Missed Attacks": "Missade attacker",
    "Chat Messages": "Chattmeddelanden", "Apologies": "Ursäkter", "lols": "lols", "Emotes": "Emotes", "Hearthstones": "Hearthstones",
    "Damage": "Damage", "Healing": "Healing", "KBs": "KB", "XP": "XP", "Quests": "Quests", "Gold +": "Guld +", "Gold −": "Guld −", "Repairs": "Reparationer",
    "Distance": "Distans", "Played": "Spelat", "Grouped": "I grupp", "Ghost": "Spöke", "Flying": "Flygtid", "Dungeons": "Dungeons", "Rares": "Rares",
    "Epics": "Epics", "Rolls": "Rolls", "Duels won": "Vunna dueller", "Messages": "Meddelanden", "Sorrys": "Förlåt", "Hearths": "Hearths", "Friend": "Vän",
    "{0} / hour": "{0} / timme", "{0} per week": "{0} per vecka", "{0} per day": "{0} per dag",

    // causes, loot quality
    "Slain by creatures": "Dödad av mobs", "Fell to their death": "Föll till döds", "Drowned": "Drunknade", "Burned": "Brann upp", "Lava": "Lava",
    "Slime": "Slem", "Fatigue": "Fatigue", "Killed by a player": "Dödad av en spelare", "Environment": "Miljön", "Mystery": "Mysterium",
    "Poor": "Poor", "Common": "Common", "Uncommon": "Uncommon", "Rare": "Rare", "Epic": "Epic", "Legendary": "Legendary",

    // stat tiles
    "Damage dealt": "Damage", "{0} as ghosts": "{0} som spöke", "{0} hits, {1} crits": "{0} träffar, {1} crits", "Healing done": "Healing",
    "{0} overhealed": "{0} overheal", "Killing blows": "Killing blows", "Quests completed": "Avklarade quests", "{0} XP earned": "{0} XP intjänat",
    "Gold looted": "Lootat guld", "spent {0}": "spenderat {0}", "Time played": "Speltid", "{0} grouped up": "{0} i grupp",
    "about {0} miles": "ungefär {0} km", "{0} per hour": "{0} per timme", "Dungeon runs": "Dungeon runs", "{0} hearthstones": "{0} hearthstones",

    // achievements
    "Spirit Healer's Regular": "Spirit Healerns stamkund", "Died {0} times": "Dog {0} gånger", "Big Pumper": "Storpumparen", "Dealt {0} damage": "Gjorde {0} damage",
    "Lifebinder": "Livsbindaren", "Healed {0}": "Healade {0}", "Executioner": "Bödeln", "{0} killing blows": "{0} killing blows",
    "One-Hit Wonder": "Engångsundret", "Hit for {0} with {1}": "Träffade för {0} med {1}", " on {0}": " på {0}", "something": "något",
    "Critical Mass": "Kritisk massa", "{0} of hits were crits": "{0} av träffarna var crits", "{0} damage past dead": "{0} damage efter döden",
    "Gravity's Favorite": "Gravitationens favorit", "{0} deaths from falling": "{0} dödsfall från fall", "Took {0} fall damage": "Tog {0} fall damage",
    "Professional Ghost": "Professionellt spöke", "Spent {0} dead": "Låg död i {0}", "Meat Shield": "Köttsköld", "Took {0} damage": "Tog {0} damage",
    "Untouchable": "Oberörbar", "Dodged, parried or blocked {0} attacks": "Dodgade, parryade eller blockade {0} attacker",
    "Life Support": "Livsuppehållande", "Needed {0} healing from friends": "Behövde {0} healing från vänner", "Loremaster": "Loremaster",
    "{0} quests turned in": "{0} quests inlämnade", "Bunny Hopper": "Kaninhopparen", "{0} jumps": "{0} hopp", "Explorer": "Utforskaren",
    "{0} yards on foot": "{0} yards till fots", "Goblin Tycoon": "Goblinmagnaten", "Looted {0}": "Lootade {0}", "Repair Bill": "Reparationsnotan",
    "Paid {0} in repairs": "Betalade {0} i reparationer", "Apology Tour": "Ursäktsturnén", "Said sorry {0} times": "Sa förlåt {0} gånger",
    "Chatterbox": "Pratkvarnen", "{0} chat messages": "{0} chattmeddelanden", "Loot Goblin": "Lootgoblinen", "{0} rare or better drops": "{0} rare eller bättre drops",
    "Vendor Trash Collector": "Skräpsamlaren", "{0} grey items looted": "{0} grå items lootade", "Lucky Roller": "Tärningslyckan",
    "Averaged {0} over {1} rolls": "Snitt {0} på {1} rolls", "Duelist": "Duellanten", "Won {0} duels": "Vann {0} dueller",
    "Dungeon Crawler": "Dungeonkrälaren", "{0} dungeon runs": "{0} dungeon runs", "Frequent Flyer": "Flitig flygare", "{0} on flight paths": "{0} på flygrutter",
    "Professional AFK": "Professionell AFK", "{0} away from keyboard": "{0} borta från tangentbordet",
    "+{0} tied": "+{0} delad", "Unkillable": "Odödlig", "Only {0} deaths": "Bara {0} dödsfall", "Didn't die once": "Dog inte en enda gång", "{0} in {1}": "{0} på {1}",
    "No achievements yet. They appear as soon as someone uploads.": "Inga achievements än. De dyker upp så fort någon har laddat upp.",
    "Nobody on the meter yet.": "Ingen på mätaren än.",

    // charts
    "hours played": "speltimmar", "level": "level", "Level {0}": "Level {0}", "{0} played": "{0} spelat", "{0}% of the best": "{0} % av bästa",
    "{0}% crits ({1} of {2} hits)": "{0} % crits ({1} av {2} träffar)", "Damage taken": "Tagen damage", "Healing received": "Mottagen healing",
    "Also {0} grey and {1} white items": "Plus {0} grå och {1} vita items", "Looted & earned": "Lootat & intjänat", "Spent": "Spenderat",
    "{0} damage ({1}%)": "{0} damage ({1} %)", "{0} casts": "{0} casts",
    "Survival": "Överlevnad", "Exploration": "Utforskande", "Wealth": "Rikedom", "Questing": "Questande", "Chatter": "Prat",
    "Charts couldn't load. Check your connection and reload.": "Diagrammen kunde inte laddas. Kontrollera anslutningen och ladda om.",
    "Nothing recorded yet.": "Inget registrerat än.",

    // deaths
    "fell to their death": "föll till döds", "drowned": "drunknade", "burned to death": "brann ihjäl", "fell into lava": "föll i lava",
    "dissolved in slime": "löstes upp i slem", "succumbed to fatigue": "dukade under av utmattning", "was killed by the world itself": "dödades av världen själv",
    "died under mysterious circumstances": "dog under mystiska omständigheter", "died": "dog",
    "was slain by {0}'s {1}": "dödades av {0}s {1}", "was slain by {0}": "dödades av {0}", " in {0}": " i {0}",
    "{0} death": "{0} dödsfall", "{0} deaths": "{0} dödsfall", "Nobody died. Suspicious.": "Ingen dog. Misstänkt.",
    "Wanted": "Efterlyst", "for the murder of {0} hero": "för mordet på {0} hjälte", "for the murder of {0} heroes": "för mordet på {0} hjältar",
    "Victims: {0}": "Offer: {0}", "Last seen in {0}": "Senast sedd i {0}", "Reward: {0} gold": "Belöning: {0} guld",
    "No creature has claimed a victim yet.": "Ingen mob har krävt ett offer än.", "No deaths, no dangerous places.": "Inga dödsfall, inga farliga platser.",

    // combat sheet
    "Hits": "Träffar", "Avg hit": "Snittträff", "Biggest": "Största", "Misses": "Missar", "Resisted": "Resists", "Dodges": "Dodges",
    "Parries": "Parries", "Blocks": "Blocks", "Taken": "Tagen", "Healed by others": "Healad av andra", "Overheal": "Overheal",
    "Casts": "Casts", "Fall damage": "Fall damage", "Nobody on the roster yet.": "Ingen på listan än.",

    // loot, bonds, fame
    "receives loot:": "får loot:", "No rare drops yet. Keep rolling Need.": "Inga rare drops än. Fortsätt rolla Need.",
    "No duels between friends yet. Someone challenge someone.": "Inga dueller mellan vänner än. Någon får utmana någon.",
    "was kept alive by": "hölls vid liv av", "Nobody has been healed by a friend yet.": "Ingen har blivit healad av en vän än.",
    "Records appear after the first upload.": "Rekorden dyker upp efter första synken.",
    "Most damage in one day": "Mest damage på en dag", "Most healing in one day": "Mest healing på en dag", "Most deaths in one day": "Flest dödsfall på en dag",
    "Most killing blows in one day": "Flest killing blows på en dag", "Most quests in one day": "Flest quests på en dag", "Most XP in one day": "Mest XP på en dag",
    "Longest day of play": "Längsta speldagen", "Most jumps in one day": "Flest hopp på en dag", "Longest journey in one day": "Längsta resan på en dag",
    "Biggest haul in one day": "Största bytet på en dag", "Most levels in one day": "Flest levels på en dag", "Hardest hit ever": "Hårdaste träffen någonsin",
    "Deepest pockets": "Djupaste fickorna", "most gold held at once": "mest guld på en gång", "Most hunted creature": "Mest farmade mob",
    "by one friend": "av en vän", "Highest level": "Högsta level",

    // roster and profiles
    "Lvl {0}": "Lvl {0}", "Main": "Main", "seen by friends": "sedd av vänner", "Biggest hit": "Största träff",
    "Most gold held": "Mest guld", "Most killed": "Mest dödade",
    "Recorded by friends' addons. Installing FunStats adds jumps, gold, loot and more.": "Registrerad av vänners addons. Med FunStats installerad kommer hopp, guld, loot och mer.",
    "Nobody here yet. Friends appear once their stats have been synced.": "Ingen här än. Vänner dyker upp när deras statistik har synkats.",
    "Not found": "Hittades inte", "There's nobody with that link on this realm.": "Det finns ingen med den länken på den här realmen.",
    "Adventurer": "Äventyrare", "Known for: {0}": "Känd för: {0}", "highest level": "högsta level", "played": "spelat", "damage": "damage", "deaths": "dödsfall",
    "character": "karaktär", "characters": "karaktärer", "Where {0} stands out from the group, all time": "Där {0} sticker ut från gruppen, totalt",
    "{0}'s biggest numbers so far": "{0}s största siffror hittills", "#{0} of {1}": "#{0} av {1}", " · {0}× the others' average": " · {0}× de andras snitt",
    "Only friend with this stat so far": "Enda vännen med det här hittills", "No stats yet. They appear after {0}'s first synced session.": "Ingen statistik än. Den dyker upp efter {0}s första synkade session.",
    "No characters yet.": "Inga karaktärer än.", "(tied)": "(delad)", "No achievements held yet. Someone else is ahead on everything, for now.": "Inga achievements än. Någon annan leder allt, för tillfället.",
    "No creature has killed {0} yet.": "Ingen mob har dödat {0} än.", "Personal bests appear after the first synced session.": "Personliga rekord dyker upp efter första synkade sessionen.",
    "{0} hasn't died yet. Impressive.": "{0} har inte dött än. Imponerande.", "Zones appear once {0} has played with the addon.": "Zoner dyker upp när {0} har spelat med addonen.",
    "on {0}": "på {0}", "No rare drops yet.": "Inga rare drops än.",
    "Level {0} {1} {2}": "Level {0} {1} {2}", "avg item level": "snitt-ilvl", "item level {0}": "ilvl {0}",
    "Gear appears after this character logs in with the latest FunStats.": "Gear syns när karaktären loggar in med senaste FunStats.",
    "Gear is only recorded for friends who have the addon.": "Gear sparas bara för vänner som har addonen.",
    "Head": "Huvud", "Neck": "Hals", "Shoulder": "Axlar", "Shirt": "Skjorta", "Chest": "Bröst", "Waist": "Midja", "Legs": "Ben", "Feet": "Fötter",
    "Wrist": "Handleder", "Hands": "Händer", "Finger": "Finger", "Trinket": "Trinket", "Back": "Rygg", "Main Hand": "Main hand", "Off Hand": "Off hand",
    "Ranged": "Ranged", "Tabard": "Tabard",

    // signature stats
    "Hits the hardest": "Slår hårdast", "Keeps everyone alive": "Håller alla vid liv", "Steals the kills": "Snor alla kills", "Dies the most": "Dör mest",
    "Actually reads the quests": "Läser faktiskt questtexterna", "Experience earned": "XP", "Levels like mad": "Levlar som en galning",
    "Richest of the bunch": "Rikast i gänget", "Distance traveled": "Tillryggalagd sträcka", "Always running somewhere": "Springer alltid någonstans",
    "Can't stop jumping": "Kan inte sluta hoppa", "Basically lives in Azeroth": "Bor i princip i Azeroth", "Time as a ghost": "Tid som spöke",
    "Spends ages dead": "Ligger död en evighet", "Time on flight paths": "Tid på flygrutter", "Loves a flight path": "Älskar flygrutter",
    "Always AFK": "Alltid AFK", "Dungeon regular": "Stamgäst i dungeons", "Damage sponge": "Damagesvamp", "Needs the most healing": "Behöver mest healing",
    "Keeps hitting dead things": "Fortsätter slå på döda saker", "Swings at air": "Slår i luften", "Slippery": "Hal som en ål",
    "Chat messages": "Chattmeddelanden", "Never stops talking": "Slutar aldrig prata", "Always apologizing": "Ber alltid om ursäkt",
    "Laughs at everything": "Skrattar åt allt", "Emotes constantly": "Emotar hela tiden", "Hearths home a lot": "Hearthar hem ofta",
    "Epic drops": "Epic drops", "Purple luck": "Lila tur", "Grey items looted": "Grå items lootade", "Hoards vendor trash": "Samlar på skräp",
    "Repair bills": "Reparationer", "Breaks all the gear": "Har sönder all utrustning", "Duel champion": "Duellmästare", "Spells cast": "Castade spells",
    "Button masher": "Knappdängare", "Gravity's best friend": "Gravitationens bästa vän", "Crits like crazy": "Critar som en galning",
    "Missed attacks": "Missade attacker",
    // characters, guilds, search, upload
    "Search characters or guilds": "Sök karaktärer eller guilds", "Guild": "Guild", "Guilds": "Guilds",
    "Every guild on this realm with FunStats players": "Alla guilds på den här realmen med FunStats-spelare",
    "No guild": "Ingen guild", "{0} member": "{0} medlem", "{0} members": "{0} medlemmar", "{0} guild": "{0} guild", "{0} guilds": "{0} guilds",
    "Top damage": "Mest damage", "Open guild page": "Öppna guildsidan", "No guilds yet.": "Inga guilds än.",
    "Top level {0}": "Högsta level {0}", "No stats yet.": "Ingen statistik än.",
    "Previous page": "Föregående sida", "Next page": "Nästa sida",
    "Gold": "Guld", "Ctrl + scroll to zoom · drag to move": "Ctrl + scrolla för att zooma · dra för att flytta", "Zoom in": "Zooma in", "Zoom out": "Zooma ut",
    "Show the whole continent": "Visa hela kontinenten", "Map of the Fallen": "De fallnas karta", "Every death, ding and drop, where it happened": "Varje död, ding och drop, där det hände",
    "Level-ups": "Dings", "Rare loot": "Rare loot", "Who": "Vem", "Everyone": "Alla", "Replay": "Spela upp", "Deadliest places": "Dödligaste platserna",
    "Top killer: {0}": "Värsta mördaren: {0}", "No deaths in this range. Impressive.": "Inga dödsfall här. Imponerande.", "reached level {0}": "dingade {0}",
    "killed by {0}": "dödad av {0}", "fell to their death": "föll till sin död", "looted": "lootade", "Unknown": "Okänt",
    "{0} deaths happened before positions were saved (FunStats 1.1), so they're only counted, not placed.": "{0} dödsfall skedde innan positioner sparades (FunStats 1.1), så de räknas men placeras inte ut.", "Animations": "Animationer", "On": "På", "Off": "Av", "New record": "Nytt rekord", "A record fell!": "Ett rekord föll!", "{0} records fell!": "{0} rekord föll!", "last 7 days": "senaste 7 dagarna",
    "Beat {0}'s {1} from {2}": "Slog {0}s {1} från {2}", "Topped their own {0} from {1}": "Slog sitt eget {0} från {1}",
    "Characters": "Karaktärer", "Guild Roster": "Guildens roster", "Everyone on this realm with FunStats": "Alla på den här realmen med FunStats",
    "Every member with FunStats": "Alla medlemmar med FunStats", "Get the addon": "Hämta addonen",
    "On your phone? Open this page on the PC where you play WoW to download.": "På mobilen? Öppna den här sidan på datorn där du spelar WoW för att ladda ner.",
    "Anyone with the addon can join": "Alla med addonen kan vara med",
    "Play. Your stats are recorded per character, and shared with your group and guild members who also have FunStats.": "Spela. Din statistik sparas per karaktär och delas med gruppen och guildmedlemmar som också har FunStats.",
    "Type <code>/reload</code> or log out so WoW saves the file.": "Skriv <code>/reload</code> eller logga ut så sparar WoW filen.",
    "Drop this file here: <code>World of Warcraft\\_anniversary_\\WTF\\Account\\YOUR_ACCOUNT\\SavedVariables\\FunStats.lua</code>": "Släpp den här filen här: <code>World of Warcraft\\_anniversary_\\WTF\\Account\\DITT_KONTO\\SavedVariables\\FunStats.lua</code>",
    "Your file contains a private upload code, so only you can update your characters. Stats it received from guild mates fill in their pages too, until they upload their own.": "Filen innehåller en privat uppladdningskod, så bara du kan uppdatera dina karaktärer. Statistik den fått från guildmedlemmar fyller också i deras sidor, tills de laddar upp sin egen.",
    "Drop FunStats.lua here": "Släpp FunStats.lua här", "or click to choose the file": "eller klicka för att välja filen",
    "{0}: couldn't read this file.": "{0}: kunde inte läsa filen.",
    "{0} has no FunStats data. Pick FunStats.lua from WTF\\Account\\YOUR_ACCOUNT\\SavedVariables after logging out once.": "{0} innehåller ingen FunStats-data. Välj FunStats.lua i WTF\\Account\\DITT_KONTO\\SavedVariables efter att du loggat ut en gång.",
    "This file is from an older FunStats. Update the addon, log in once, type /reload and try again.": "Filen kommer från en äldre FunStats. Uppdatera addonen, logga in en gång, skriv /reload och försök igen.",
    "Upload failed. Try again in a minute.": "Uppladdningen misslyckades. Försök igen om en minut.", "Uploading {0}…": "Laddar upp {0}…",
    "Saved {0}.": "Sparade {0}.", "{0} characters were skipped because another upload already claimed them.": "{0} karaktärer hoppades över eftersom någon annan redan har gjort anspråk på dem.",
    "Other characters by this player": "Andra karaktärer av samma spelare",
    "How {0} compares with the rest of <{1}>, all time": "Hur {0} står sig mot resten av <{1}>, totalt",
    "How {0} compares with everyone on this realm, all time": "Hur {0} står sig mot alla på den här realmen, totalt",
    "Only one with this stat so far": "Enda med det här hittills", "Compare": "Jämför", "Compare with": "Jämför med", "Level": "Level",
    "No characters or guilds match.": "Inga karaktärer eller guilds matchar.", "‹ Guild": "‹ Guilden",
    "Nobody here yet. Characters appear once their stats have been uploaded.": "Ingen här än. Karaktärer dyker upp när deras statistik har laddats upp.",
    "This guild has no characters on this realm yet.": "Den här guilden har inga karaktärer på den här realmen än.",
    "There's no character with that link.": "Det finns ingen karaktär med den länken.",
    "<strong>The ledger is connected but still empty.</strong> Stats appear after the first upload. Until then, this is example data.": "<strong>Liggaren är kopplad men fortfarande tom.</strong> Statistiken dyker upp efter första uppladdningen. Tills dess är det här exempeldata.",
    "Others ({0})": "Övriga ({0})", "View": "Vy", "Pages": "Sidor", "World": "Världen", "Records": "Rekord", "Gear": "Gear",
    "History": "Historik", "Activity": "Aktivitet", "Meters & Combat": "Mätare & strid", "Loot & World": "Loot & världen", "Lately": "På sistone", "This week": "Denna vecka", "Last week": "Förra veckan", "updated {0}": "uppdaterad {0}",
    "Windows: get the Ledger app": "Windows: hämta Ledger-appen", "recommended": "rekommenderas", "One download, then just play.": "En nedladdning, sedan är det bara att spela.",
    "Download the app and run it once. It installs itself and the FunStats addon in every WoW folder it finds.": "Ladda ner appen och kör den en gång. Den installerar sig själv och FunStats-addonen i varje WoW-mapp den hittar.",
    "It updates itself: new versions of the app and the addon arrive on their own. Restart WoW to load a new addon.": "Den uppdaterar sig själv: nya versioner av appen och addonen kommer av sig själva. Starta om WoW för att ladda en ny addon.",
    "Already have it? Nothing to do, it keeps itself up to date. Only apps from before version 1.1 need one more download.": "Har du den redan? Då behöver du inte göra något, den håller sig uppdaterad. Bara appar från före version 1.1 behöver laddas ner en gång till.",
    "Without the app, the addon doesn't update itself: download FunStats.zip again now and then, and upload your file after you play.": "Utan appen uppdateras inte addonen av sig själv: ladda ner FunStats.zip igen då och då, och ladda upp din fil efter att du har spelat.",
    "It starts with Windows and waits quietly in the tray.": "Den startar med Windows och väntar tyst i aktivitetsfältet.",
    "Every time you log out of WoW, your stats appear here.": "Varje gång du loggar ut ur WoW dyker din statistik upp här.",
    "Download for Windows": "Ladda ner för Windows",
    "If Windows says it protected your PC, click <b>More info</b>, then <b>Run anyway</b>. The app is small and only uploads your FunStats file.": "Om Windows säger att datorn skyddades, klicka på <b>Mer information</b> och sedan <b>Kör ändå</b>. Appen är liten och laddar bara upp din FunStats-fil.",
    "If WoW lists FunStats as <b>out of date</b>, tick <b>Load out of date AddOns</b> on the character screen. It works fine; that just means a WoW patch came out before our next update.": "Om WoW visar FunStats som <b>out of date</b>, bocka i <b>Load out of date AddOns</b> på karaktärsskärmen. Den fungerar ändå; det betyder bara att en WoW-patch kom ut före vår nästa uppdatering.",
    "To stop it: right-click the shield icon in the tray and untick <b>Start with Windows</b>, or choose <b>Quit</b>.": "Stäng av den: högerklicka på sköldikonen i aktivitetsfältet och bocka ur <b>Start with Windows</b>, eller välj <b>Quit</b>.",
    "Mac, or without the app": "Mac, eller utan appen",
    "Download <a href=\"FunStats.zip\">FunStats.zip</a> and put the <code>FunStats</code> folder in <code>World of Warcraft\\_anniversary_\\Interface\\AddOns</code>.": "Ladda ner <a href=\"FunStats.zip\">FunStats.zip</a> och lägg mappen <code>FunStats</code> i <code>World of Warcraft\\_anniversary_\\Interface\\AddOns</code>.",
    "Play, then log out so WoW saves your stats.": "Spela och logga sedan ut så att WoW sparar din statistik.",
    "Drop <code>WTF\\Account\\YOUR_ACCOUNT\\SavedVariables\\FunStats.lua</code> here:": "Släpp <code>WTF\\Account\\DITT_KONTO\\SavedVariables\\FunStats.lua</code> här:",
    "Guild mates without the addon still show up: with their level and class from the guild roster, and their gear from the Blizzard armory.": "Guildmedlemmar utan addonen syns ändå: med level och class från guildens roster och gear från Blizzards armory.",
    "Gear appears once this character has the Ledger app, or after the next armory update.": "Gear syns när karaktären har Ledger-appen, eller efter nästa armory-uppdatering.",
    "Gear from the Blizzard armory. Fun stats need the FunStats addon.": "Gear från Blizzards armory. Den roliga statistiken kräver FunStats-addonen.", "The Race to {0}": "Racet till {0}", "No deaths yet.": "Inga dödsfall än.", "Leaders": "Ledare", "newest first": "nyast först", "Example data": "Exempeldata",
    "<strong>Example data.</strong> These characters are made up so you can see how the site works. Pick your realm in the Realm menu, or get the addon to add your own.": "<strong>Exempeldata.</strong> Karaktärerna är påhittade så att du kan se hur sidan fungerar. Välj din realm i Realm-menyn, eller hämta addonen och lägg till din egen.",
    "<strong>No stats on {0} yet.</strong> Be the first: get the addon and play.": "<strong>Ingen statistik på {0} än.</strong> Bli först: hämta addonen och spela.",
    // navigation
    "Pages": "Sidor", "Open menu": "Öppna menyn", "Close menu": "Stäng menyn",
    "Breadcrumb": "Du är här", "Combat output": "Strid", "Group momentum": "Gruppens fart", "Risk assessment": "Riskbedömning", "Fatality report": "Dödsrapport",
    "Details ›": "Detaljer ›", "The company": "Sällskapet", "Hero standings": "Hjältarnas ställning", "View all ›": "Visa alla ›", "Spoils collected": "Loot",
    "Loot quality": "Lootkvalitet", "Most wanted": "Mest efterlyst", "Responsible for {0} death": "Ansvarig för {0} dödsfall", "Responsible for {0} deaths": "Ansvarig för {0} dödsfall",
    "The Graveyard": "Kyrkogården", "Fallen heroes": "Fallna hjältar", "death is permanent": "döden är permanent", "Still standing": "Fortfarande vid liv",
    "highest level first": "högst level först", "Fallen": "Fallen", "Alive": "Vid liv", "Hardcore": "Hardcore", "Average level at death": "Snittlevel vid döden",
    "highest: {0}, level {1}": "högst: {0}, level {1}", "{0} survival rate": "{0} har överlevt", "Nobody has fallen. Yet.": "Ingen har fallit. Än.", "Everyone has fallen.": "Alla har fallit.",
    "{0} of {1} fallen": "{0} av {1} fallna", "Still alive. Death is permanent in Hardcore.": "Fortfarande vid liv. Döden är permanent i Hardcore.",
    "Hero": "Hjälte", "{0} drop": "{0} drop", "{0} drops": "{0} drops", "Best drop": "Bästa dropen", "death": "dödsfall", "deaths": "dödsfall",
    "You are here": "Du är här", "Realm ledger": "Realmens liggare", "Go back": "Tillbaka", "Realm pages": "Realmens sidor", "Guild pages": "Guildens sidor",
    "{0}'s pages": "{0}s sidor", "Change realm": "Byt realm",
    "Map of {0}": "Karta över {0}", "Map art © Blizzard Entertainment.": "Kartbilder © Blizzard Entertainment.",
    "Atlas": "Atlas", "Loot & Gold": "Loot & guld", "Back to {0}": "Tillbaka till {0}",
    "Click a zone to open its map. Right-click to zoom back out.": "Klicka på en zon för att öppna dess karta. Högerklicka för att zooma ut igen.",
    "Choose a friend": "Välj en vän", "Settings": "Inställningar", "Theme": "Tema", "Overview": "Översikt",
    "Achievements": "Achievements", "Meters": "Mätare", "Race to 60": "Racet till 60", "Combat": "Strid", "Loot": "Loot",
    "Treasury": "Skattkammaren", "Atlas": "Atlas", "Spellbook": "Spellbook", "Bonds": "Band", "Full Ledger": "Hela liggaren",
    "Roster": "Roster", "Join": "Gå med", "Signature": "Signatur", "Character": "Karaktär", "Charts": "Diagram", "Bests": "Rekord",
    "‹ Ledger": "‹ Liggaren", "Previous friend": "Föregående vän", "Next friend": "Nästa vän", "Sections": "Sektioner", "Site": "Webbplats",
    // dungeons & raids
    "Dungeons & Raids": "Dungeons & raids", "The Boss Log": "Bossloggen", "Recent boss fights": "Senaste bossfighterna",
    "open one for its damage meter": "öppna en för dess damage meter", "Boss tally": "Bossräkning", "Dungeon Runs": "Dungeon runs",
    "Dungeon records": "Dungeonrekord", "fastest clear: quickest run that killed the most bosses": "snabbaste clear: snabbaste runnen som dödade flest bossar",
    "Recent runs": "Senaste runs", "Bosses defeated": "Besegrade bossar", "Kill": "Kill","Wipe": "Wipe", "({0}/s)": "({0}/s)",
    "top damage: {0}": "mest damage: {0}", "No meter for this fight.": "Ingen mätare för den här fighten.",
    "No boss fights yet. They're recorded from FunStats 1.3 on.": "Inga bossfighter än. De sparas från FunStats 1.3 och framåt.",
    "Horde": "Horde", "Alliance": "Alliance", "All": "Alla",
    "In game": "I spelet", "nothing to type": "inget att skriva",
    "FunStats records on its own. It shares stats with group and guild mates who have it, and also tracks guild mates and WoW friends who don't.": "FunStats sparar allt av sig själv. Den delar statistik med grupp- och guildmedlemmar som har den, och följer även guildmedlemmar och WoW-vänner som inte har den.",
    "Today's numbers and these options": "Dagens siffror och de här valen",
    "Your latest boss kills and the dungeon run you're in": "Dina senaste boss kills och dungeon runnen du är i",
    "Whose stats your addon has received": "Vems statistik din addon har tagit emot",
    "Post your deaths in group chat (off until you turn it on)": "Skriv dina dödsfall i gruppchatten (av tills du slår på den)",
    "Also track someone outside your guild and friends list; <code>friends</code> lists them, <code>remove Name</code> stops": "Följ även någon utanför guilden och vänlistan; <code>friends</code> listar dem, <code>remove Namn</code> slutar",
    "Boss": "Boss", "Kills": "Kills", "Wipes": "Wipes", "Fastest": "Snabbast", "Best DPS": "Bästa DPS", "Best HPS": "Bästa HPS",
    "Last kill": "Senaste kill", "First kill": "Första kill", "No bosses fought in this range.": "Inga bossar under den här perioden.",
    "Fastest clear": "Snabbaste clear", "Runs": "Runs", "Average time": "Snitt-tid", "Bosses": "Bossar", "up to {0}": "upp till {0}",
    "Most runs": "Flest runs", "No dungeon runs yet. They're recorded from FunStats 1.3 on.": "Inga dungeon runs än. De sparas från FunStats 1.3 och framåt.",
    "{0} boss": "{0} boss", "{0} bosses": "{0} bossar", "{0} wipe": "{0} wipe", "{0} wipes": "{0} wipes", "No runs in this range.": "Inga runs under den här perioden.",
    "No bosses defeated yet. They're recorded from FunStats 1.3 on.": "Inga besegrade bossar än. De sparas från FunStats 1.3 och framåt.",
  };
  let LANG = (() => {
    try { const s = new URLSearchParams(location.search).get("lang") || localStorage.getItem("ledger-lang"); if (s === "en" || s === "sv") return s; } catch (e) { /* remembering is optional */ }
    return (navigator.language || "").toLowerCase().startsWith("sv") ? "sv" : "en";
  })();
  const tr = (s, ...args) => {
    let out = (LANG === "sv" && SV[s]) || s;
    args.forEach((v, i) => { out = out.split("{" + i + "}").join(v); });
    return out;
  };
  const LOC = () => LANG === "sv" ? "sv-SE" : "en-US";
  const dec = (n, d) => { const s = n.toFixed(d); return LANG === "sv" ? s.replace(".", ",") : s; };

  // ---------- constants ----------
  const CLASS = {
    WARRIOR: ["Warrior", "#c79c6e"], PALADIN: ["Paladin", "#f58cba"], HUNTER: ["Hunter", "#abd473"],
    ROGUE: ["Rogue", "#fff569"], PRIEST: ["Priest", "#f2f2f2"], SHAMAN: ["Shaman", "#2a8cf0"],
    MAGE: ["Mage", "#69ccf0"], WARLOCK: ["Warlock", "#9482c9"], DRUID: ["Druid", "#ff7d0a"],
    DEATHKNIGHT: ["Death Knight", "#c41f3b"], MONK: ["Monk", "#00ff96"],
  };
  const RACE = { Human: "Human", Dwarf: "Dwarf", NightElf: "Night Elf", Gnome: "Gnome", Orc: "Orc", Scourge: "Undead", Tauren: "Tauren", Troll: "Troll", BloodElf: "Blood Elf", Draenei: "Draenei", Goblin: "Goblin", Worgen: "Worgen", Pandaren: "Pandaren" };
  const CAUSE = {
    mob: ["Slain by creatures", "#c0392b"], fall: ["Fell to their death", "#a78bfa"], drown: ["Drowned", "#3b82f6"],
    fire: ["Burned", "#f97316"], lava: ["Lava", "#fb923c"], slime: ["Slime", "#84cc16"], fatigue: ["Fatigue", "#14b8a6"],
    player: ["Killed by a player", "#eab308"], environment: ["Environment", "#64748b"], unknown: ["Mystery", "#78716c"],
  };
  const QUAL = [["Poor", "#9d9d9d"], ["Common", "#ffffff"], ["Uncommon", "#1eff00"], ["Rare", "#0070dd"], ["Epic", "#a335ee"], ["Legendary", "#ff8000"]];
  const DOW_EN = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], DOW_SV = ["sön", "mån", "tis", "ons", "tor", "fre", "lör"];
  const dow = i => (LANG === "sv" ? DOW_SV : DOW_EN)[i];

  const num = n => Math.round(n || 0).toLocaleString(LOC());
  const compact = n => {
    n = n || 0;
    if (n >= 1e6) return dec(n / 1e6, n >= 1e7 ? 0 : 1) + "M";
    if (n >= 1e4) return dec(n / 1e3, n >= 1e5 ? 0 : 1) + "k";
    return num(n);
  };
  const goldText = c => {
    c = Math.round(c || 0);
    const g = Math.floor(c / 10000), s = Math.floor(c / 100) % 100, cp = c % 100;
    if (g) return `${g.toLocaleString(LOC())}g ${s}s`;
    if (s) return `${s}s ${cp}c`;
    return `${cp}c`;
  };
  const goldHTML = c => {
    c = Math.round(c || 0);
    const g = Math.floor(c / 10000), s = Math.floor(c / 100) % 100, cp = c % 100;
    const parts = [];
    if (g) parts.push(`<span class="coin g">${g.toLocaleString(LOC())}${sprite("coinG", 1)}</span>`);
    if (g || s) parts.push(`<span class="coin s">${s}${sprite("coinS", 1)}</span>`);
    if (!g) parts.push(`<span class="coin c">${cp}${sprite("coinC", 1)}</span>`);
    return `<span class="coins">${parts.join("")}</span>`;
  };
  const dur = s => {
    s = Math.round(s || 0);
    const d = Math.floor(s / 86400), h = Math.floor(s / 3600) % 24, m = Math.floor(s / 60) % 60;
    if (LANG === "sv") {
      if (d) return `${d} d ${h} h`;
      return Math.floor(s / 3600) ? `${Math.floor(s / 3600)} h ${m} min` : `${m} min`;
    }
    if (d) return `${d}d ${h}h`;
    return Math.floor(s / 3600) ? `${Math.floor(s / 3600)}h ${m}m` : `${m}m`;
  };
  const yards = y => `${compact(y)} yd`;
  const pct = v => LANG === "sv" ? `${dec(v * 100, 1)} %` : `${(v * 100).toFixed(1)}%`;
  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const classOf = ch => CLASS[ch.class] || ["Adventurer", "#b9b2a6"];
  // The class icon for a character, or the plain colour dot when the class is unknown.
  const classIcon = (ch, px = 1) => {
    const k = String(ch && ch.class || "").toLowerCase();
    return CLASS[ch && ch.class] ? `<span class="cicon" title="${classOf(ch)[0]}">${zam("classicon_" + k, px * 16)}</span>` : `<span class="dot" style="background:${classOf(ch)[1]}"></span>`;
  };

  const METRICS = [
    { k: "dmg", label: "Damage Done", fmt: compact, full: num },
    { k: "heal", label: "Healing Done", fmt: compact, full: num },
    { k: "kb", label: "Killing Blows", fmt: num },
    { k: "deaths", label: "Deaths", fmt: num },
    { k: "taken", label: "Damage Taken", fmt: compact, full: num },
    { k: "healedBy", label: "Healing Received", fmt: compact, full: num },
    { k: "xp", label: "Experience", fmt: compact, full: num },
    { k: "quests", label: "Quests Completed", fmt: num },
    { k: "goldIn", label: "Gold Looted", fmt: goldText, html: goldHTML },
    { k: "repair", label: "Repair Bills", fmt: goldText, html: goldHTML },
    { k: "dist", label: "Distance Traveled", fmt: yards },
    { k: "jumps", label: "Jumps", fmt: num },
    { k: "played", label: "Time Played", fmt: dur, noRate: true },
    { k: "ghost", label: "Time as a Ghost", fmt: dur },
    { k: "taxi", label: "Time on Flight Paths", fmt: dur },
    { k: "swim", label: "Time Swimming", fmt: dur },
    { k: "afk", label: "Time AFK", fmt: dur },
    { k: "together", label: "Time Grouped", fmt: dur },
    { k: "dungeons", label: "Dungeon Runs", fmt: num },
    { k: "casts", label: "Spells Cast", fmt: compact, full: num },
    { k: "overkill", label: "Overkill", fmt: compact, full: num },
    { k: "whiffs", label: "Missed Attacks", fmt: num },
    { k: "msgs", label: "Chat Messages", fmt: num },
    { k: "sorry", label: "Apologies", fmt: num },
    { k: "lol", label: "lols", fmt: num },
    { k: "emotes", label: "Emotes", fmt: num },
    { k: "hearth", label: "Hearthstones", fmt: num },
  ];
  const TABLE_COLS = [
    ["dmg", "Damage", num], ["heal", "Healing", num], ["kb", "KBs", num], ["deaths", "Deaths", num], ["xp", "XP", num],
    ["quests", "Quests", num], ["goldIn", "Gold +", goldHTML], ["goldOut", "Gold −", goldHTML], ["repair", "Repairs", goldHTML],
    ["dist", "Distance", yards], ["jumps", "Jumps", num], ["played", "Played", dur], ["together", "Grouped", dur], ["ghost", "Ghost", dur],
    ["taxi", "Flying", dur], ["dungeons", "Dungeons", num], ["q3", "Rares", num], ["q4", "Epics", num], ["rolls", "Rolls", num],
    ["duelsWon", "Duels won", num], ["msgs", "Messages", num], ["sorry", "Sorrys", num], ["lol", "lols", num], ["hearth", "Hearths", num],
  ];

  // ---------- dates & weeks (Tuesday reset) ----------
  const parseDay = k => { const [y, m, d] = k.split("-").map(Number); return new Date(Date.UTC(y, m - 1, d)); };
  const fmtKey = dt => dt.toISOString().slice(0, 10);
  const weekOf = k => { const dt = parseDay(k); const off = (dt.getUTCDay() - 2 + 7) % 7; dt.setUTCDate(dt.getUTCDate() - off); return fmtKey(dt); };
  const addDays = (k, n) => { const dt = parseDay(k); dt.setUTCDate(dt.getUTCDate() + n); return fmtKey(dt); };
  const shortDate = k => parseDay(k).toLocaleDateString(LOC(), { month: "short", day: "numeric", timeZone: "UTC" });
  const localKey = t => { const d = new Date(t * 1000); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`; };
  const todayKey = () => localKey(Date.now() / 1000);

  // ---------- state ----------
  const state = {
    data: { chars: {}, days: {}, obs: {}, players: {} },
    status: "loading",
    updated: 0,
    demo: false,
    view: "week",
    week: null,
    metric: "dmg",
    perHour: false,
    raceMode: "date",
    spellWho: null,
    sort: { k: "dmg", dir: -1 },
    userPickedWeek: false,
    people: [],
    realm: (() => { try { return localStorage.getItem("ledger-realm-v2") || ""; } catch (e) { return ""; } })(),
  };

  const enc = new TextEncoder();
  const charId = key => "c-" + [...enc.encode(key)].map(b => b.toString(16).padStart(2, "0")).join("");
  const stable = v => {
    if (Array.isArray(v)) return "[" + v.map(stable).join(",") + "]";
    if (v && typeof v === "object") return "{" + Object.keys(v).sort().map(k => JSON.stringify(k) + ":" + stable(v[k])).join(",") + "}";
    return JSON.stringify(v);
  };

  // Combine char docs, month docs and other players' observations into one object per character.
  // A character's own upload always wins; observations only fill days the character's own addon didn't record,
  // and several observers of the same day are combined with max (not sum) so nothing is counted twice.
  function characters(src) {
    const out = {};
    for (const [id, c] of Object.entries(src.chars || {})) {
      // the highest level reached counts even if the upload's level lags behind it (older FunStats on Mists of Pandaria)
      const dinged = Math.max(0, ...Object.keys(c.levels && typeof c.levels === "object" ? c.levels : {}).map(Number).filter(n => n > 0 && n < 200));
      out[id] = { ...c, id, level: Math.max(+c.level || 0, dinged) || c.level, days: {}, deaths: (c.deaths || []).filter(Boolean), self: true };
    }
    for (const d of Object.values(src.days || {})) {
      const ch = out[d.char];
      if (ch && d.days) Object.assign(ch.days, d.days);
    }
    const obsBy = {};
    for (const o of Object.values(src.obs || {})) {
      if (!o || !o.char) continue;
      let ch = out[o.char];
      if (!ch) ch = out[o.char] = { id: o.char, key: o.key, name: o.name, realm: o.realm, class: o.class, race: o.race, level: o.level, lastSeen: o.lastSeen, game: o.game, guild: o.guild, days: {}, deaths: [], self: false };
      else if (!ch.self && (o.lastSeen || 0) > (ch.lastSeen || 0)) { ch.level = o.level || ch.level; ch.lastSeen = o.lastSeen; }
      if (!ch.self) { ch.class ||= o.class; ch.race ||= o.race; }
      (obsBy[o.char] ||= []).push(o);
    }
    for (const [cid, list] of Object.entries(obsBy)) {
      const ch = out[cid];
      const selfDays = new Set(Object.keys(ch.days));
      const merged = {};
      for (const o of list) for (const [k, d] of Object.entries(o.days || {})) {
        if (selfDays.has(k)) continue;
        const t = merged[k] ||= { observed: true };
        for (const [f, v] of Object.entries(d)) if (typeof v === "number") t[f] = Math.max(t[f] || 0, v);
      }
      Object.assign(ch.days, merged);
      const extra = [];
      for (const o of list) for (const d of o.deaths || []) {
        if (!d || !d.t || selfDays.has(localKey(d.t))) continue;
        if (extra.some(x => Math.abs(x.t - d.t) < 10)) continue;
        extra.push({ ...d, observed: true });
      }
      ch.deaths = ch.deaths.concat(extra);
    }
    for (const [cid, a] of Object.entries(src.api || {})) {
      const ch = out[cid];
      if (!ch) continue;
      if (a.avatar) ch.avatar = a.avatar; // Blizzard's face render, addon users included
      if (a.render) ch.render = a.render; // and the full-body one
      if (ch.self || a.faceOnly) continue;
      if (a.gear && Object.keys(a.gear).length && !(ch.gear && Object.keys(ch.gear).length)) { ch.gear = a.gear; ch.armory = true; ch.ilvl = a.ilvl; }
      ch.class ||= a.class;
      ch.race ||= a.race;
      if ((a.lastLogin || 0) >= (ch.lastSeen || 0)) {
        if (a.level) ch.level = a.level;
        if (a.guild !== undefined) ch.guild = a.guild || ch.guild;
        if (a.lastLogin) ch.lastSeen = a.lastLogin;
      }
    }
    return Object.values(out).sort((a, b) => String(a.name).localeCompare(String(b.name)));
  }

  // ---------- roster: friends own characters ----------
  // A roster entry is "Name-Realm" (exact character) or just "Name" (any realm).
  const keyMatch = (entry, ch) => {
    const e = String(entry || "").trim().toLowerCase();
    if (!e) return false;
    return e.includes("-") ? e === String(ch.key || "").toLowerCase() : e === String(ch.name || "").toLowerCase();
  };

  function mergeDays(chars) {
    const days = {};
    for (const ch of chars) for (const [k, d] of Object.entries(ch.days)) {
      const t = days[k] ||= {};
      for (const [f, v] of Object.entries(d)) {
        if (typeof v !== "number" || f === "gold") continue;
        if (f === "maxHit") { if (!t.maxHit || v > t.maxHit) { t.maxHit = v; t.maxHitSpell = d.maxHitSpell; t.maxHitTarget = d.maxHitTarget; } }
        else t[f] = (t[f] || 0) + v;
      }
    }
    return days;
  }
  // Lua lists can arrive as objects ({"1": …}) after a round trip through the save file.
  const asArr = v => Array.isArray(v) ? v : (v && typeof v === "object" ? Object.values(v) : []);
  const mergeMaps = (chars, field) => {
    const out = {};
    for (const ch of chars) for (const [k, v] of Object.entries(ch[field] || {})) if (typeof v === "number") out[k] = (out[k] || 0) + v;
    return out;
  };

  function shade(hex, amt) {
    const n = parseInt(hex.slice(1), 16);
    const t = amt < 0 ? 0 : 255, a = Math.abs(amt);
    const ch = v => Math.round(v + (t - v) * a).toString(16).padStart(2, "0");
    return "#" + ch(n >> 16) + ch((n >> 8) & 255) + ch(n & 255);
  }

  function buildPeople(chars, players) {
    const used = new Set();
    const people = Object.entries(players || {}).map(([pid, p]) => {
      const entries = (Array.isArray(p.chars) ? p.chars : []).map(String);
      const rows = entries.map(e => {
        const mine = chars.filter(ch => !used.has(ch.id) && keyMatch(e, ch));
        mine.forEach(ch => used.add(ch.id));
        return { e, chars: mine };
      });
      const owned = rows.flatMap(r => r.chars);
      const main = owned[0];
      const duels = {};
      owned.forEach(ch => Object.entries(ch.duels || {}).forEach(([opp, r]) => {
        const d = duels[opp] ||= { w: 0, l: 0 }; d.w += (r && r.w) || 0; d.l += (r && r.l) || 0;
      }));
      return {
        id: pid, name: String(p.name || "Friend"), class: main ? main.class : "", rows, chars: owned, raw: p,
        days: mergeDays(owned),
        deaths: owned.flatMap(ch => ch.deaths.map(d => ({ ...d, _char: ch.name }))),
        spellDmg: mergeMaps(owned, "spellDmg"), casts: mergeMaps(owned, "casts"), heat: mergeMaps(owned, "heat"),
        zones: mergeMaps(owned, "zones"), healers: mergeMaps(owned, "healers"), kills: mergeMaps(owned, "kills"), duels,
        notable: owned.flatMap(ch => (ch.notable || []).filter(Boolean).map(n => ({ ...n, _char: ch.name }))),
        fights: owned.flatMap(ch => asArr(ch.fights).filter(f => f && f.t && f.boss)),
        runs: owned.flatMap(ch => asArr(ch.runs).filter(r => r && r.t && r.inst)),
        bosses: owned.flatMap(ch => Object.values(ch.bosses && typeof ch.bosses === "object" ? ch.bosses : {}).filter(b => b && b.n)),
        peakGold: Math.max(0, ...owned.map(ch => ch.peakGold || 0)),
        bestHit: owned.map(ch => ch.best && ch.best.hit).filter(Boolean).sort((a, b) => b.amt - a.amt)[0],
      };
    }).sort((a, b) => a.name.localeCompare(b.name));
    const seen = {};
    people.forEach(p => {
      let c = classOf(p)[1];
      const n = seen[c] = (seen[c] || 0) + 1;
      if (n > 1) c = shade(c, n % 2 ? -0.3 * Math.floor(n / 2) : 0.35 * (n / 2));
      p.color = c;
    });
    return { people, unassigned: chars.filter(ch => !used.has(ch.id)) };
  }

  function inRange(dayKey) {
    if (state.view === "all") return true;
    return dayKey >= state.week && dayKey <= addDays(state.week, 6);
  }

  function sumFor(p, allTime) {
    const s = {};
    for (const [k, d] of Object.entries(p.days)) {
      if (!allTime && !inRange(k)) continue;
      for (const [f, v] of Object.entries(d)) {
        if (typeof v !== "number") continue;
        if (f === "maxHit") {
          if (!s.maxHit || v > s.maxHit) { s.maxHit = v; s.maxHitSpell = d.maxHitSpell; s.maxHitTarget = d.maxHitTarget; }
        } else s[f] = (s[f] || 0) + v;
      }
    }
    s.loot = (s.q3 || 0) + (s.q4 || 0) + (s.q5 || 0);
    s.avgRoll = s.rolls ? s.rollSum / s.rolls : 0;
    s.critRate = s.hits ? (s.crits || 0) / s.hits : 0;
    return s;
  }

  function weeksAvailable(people) {
    const set = new Set();
    for (const p of people) for (const k of Object.keys(p.days)) set.add(weekOf(k));
    return [...set].sort();
  }

  // ---------- example data (shown only when nothing has been uploaded) ----------
  const DEMO_TALENTS = {
    WARRIOR: [["Arms", 31], ["Fury", 20], ["Protection", 0]], PRIEST: [["Discipline", 21], ["Holy", 0], ["Shadow", 30]],
    MAGE: [["Arcane", 10], ["Fire", 0], ["Frost", 41]], SHAMAN: [["Elemental", 30], ["Enhancement", 21], ["Restoration", 0]],
    WARLOCK: [["Affliction", 30], ["Demonology", 21], ["Destruction", 0]], DRUID: [["Balance", 0], ["Feral Combat", 31], ["Restoration", 20]],
  };
  const DEMO_PROFS = [
    [["Mining", 240], ["Blacksmithing", 225], ["First Aid", 300]], [["Tailoring", 260], ["Enchanting", 230], ["Cooking", 150]],
    [["Herbalism", 200], ["Alchemy", 210], ["Fishing", 75]], [["Skinning", 180], ["Leatherworking", 190]],
    [["Tailoring", 220], ["Enchanting", 200]], [["Herbalism", 250], ["Skinning", 230], ["Cooking", 180]],
  ];
  // Made-up item names for the example; real profiles use the item ids the addon records.
  const DEMO_GEAR = {
    plate: { 1: "Battleforge Helm", 3: "Battleforge Pauldrons", 5: "Battleforge Breastplate", 6: "Battleforge Girdle", 7: "Battleforge Legguards", 8: "Battleforge Boots", 9: "Battleforge Wristguards", 10: "Battleforge Gauntlets" },
    cloth: { 1: "Silksoul Cowl", 3: "Silksoul Mantle", 5: "Silksoul Robe", 6: "Silksoul Cord", 7: "Silksoul Leggings", 8: "Silksoul Slippers", 9: "Silksoul Cuffs", 10: "Silksoul Gloves" },
    mail: { 1: "Stormbound Coif", 3: "Stormbound Spaulders", 5: "Stormbound Hauberk", 6: "Stormbound Belt", 7: "Stormbound Legplates", 8: "Stormbound Greaves", 9: "Stormbound Bracers", 10: "Stormbound Grips" },
  };
  const DEMO_WEAPONS = {
    WARRIOR: { 16: "Ironjaw Greatsword", 18: "Heavy Recurve Bow" }, PRIEST: { 16: "Staff of Quiet Vigil", 18: "Wand of Pale Fire" },
    MAGE: { 16: "Frostfire Spire", 18: "Wand of Biting Cold" }, SHAMAN: { 16: "Smite's Mighty Hammer", 17: "Ancestral Totem Shield", 18: "Totem of Rage" },
    WARLOCK: { 16: "Staff of Withering Shadow", 18: "Wand of Smoldering Ash" }, DRUID: { 16: "Moonglade Greatstaff", 18: "Idol of the Wild" },
  };
  function demoGear(cls, level, ri) {
    const set = DEMO_GEAR[cls === "WARRIOR" ? "plate" : cls === "SHAMAN" ? "mail" : "cloth"];
    const names = { ...set, 2: "Pendant of the Wanderer", 11: "Band of the Unbroken", 12: "Signet of Old Lordaeron", 13: "Lucky Rabbit's Foot", 15: "Cloak of the Long Road", 4: "Simple Linen Shirt", ...DEMO_WEAPONS[cls] };
    const gear = {};
    Object.entries(names).forEach(([slot, n]) => {
      const it = { n, q: slot === "4" ? 1 : ri(2, 3) + (ri(0, 9) === 0 ? 1 : 0), il: slot === "4" ? 1 : Math.max(5, level + ri(-4, 3)) };
      if (n === "Smite's Mighty Hammer") Object.assign(it, { id: 7230, q: 3, il: 24 });
      gear["s" + slot] = it;
    });
    return gear;
  }

  function demoData() {
    let seed = 11;
    const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    const ri = (a, b) => Math.floor(a + rnd() * (b - a + 1));
    const pickOne = arr => arr[ri(0, arr.length - 1)];
    const roster = [
      ["Grimtusk", "WARRIOR", "Orc", { "Heroic Strike": 3, "Melee": 6, "Cleave": 2, "Rend": 1, "Thunder Clap": 1 }, 1.0],
      ["Mirelle", "PRIEST", "Scourge", { "Smite": 4, "Shadow Word: Pain": 3, "Mind Blast": 3, "Melee": 1 }, 0.9],
      ["Bonksworth", "MAGE", "Troll", { "Fireball": 6, "Frostbolt": 4, "Arcane Missiles": 2, "Fire Blast": 2, "Melee": 0.3 }, 1.1],
      ["Tidepaw", "SHAMAN", "Tauren", { "Lightning Bolt": 4, "Earth Shock": 2, "Melee": 3, "Flame Shock": 2 }, 0.6],
      ["Felbrew", "WARLOCK", "Gnome", { "Shadow Bolt": 5, "Corruption": 3, "Immolate": 2, "Melee": 0.3 }, 0.95],
      ["Stonehoof", "DRUID", "NightElf", { "Wrath": 2, "Moonfire": 2, "Melee": 5, "Claw": 3 }, 0.85],
    ];
    const mobs = ["Defias Pillager", "Murloc Tidehunter", "Kobold Geomancer", "Riverpaw Mystic", "Hogger", "Harvest Golem", "Razormane Hunter", "Venture Co. Enforcer"];
    const zones = ["Durotar", "The Barrens", "Westfall", "Redridge Mountains", "Stonetalon Mountains", "Ashenvale", "Hillsbrad Foothills", "Orgrimmar"];
    const dungeons = ["Ragefire Chasm", "The Deadmines", "Wailing Caverns", "Shadowfang Keep"];
    const loot = ["Cruel Barb", "Smite's Mighty Hammer", "Cookie's Tenderizer", "Staff of the Friar", "Serpent's Shoulders", "Glowing Lizardscale Cloak", "Thief's Blade"];
    const chars = {}, days = {};
    const today = todayKey();
    const SPAN = 34;
    roster.forEach(([name, cls, race, spells, pace], pi) => {
      const key = name + "-Example", id = charId(key);
      const dmap = {}, deaths = [], levels = {}, levelPlayed = {}, dingAt = {}, heat = {}, zoneT = {}, spellDmg = {}, casts = {}, healers = {};
      let level = 1, played = 0, goldNow = ri(0, 500);
      for (let back = SPAN - 1; back >= 0; back--) {
        const k = addDays(today, -back);
        if (rnd() < 0.22) continue;
        const hours = ri(1, 5), secs = hours * 3600;
        const dow = parseDay(k).getUTCDay();
        const start = ri(16, 21);
        for (let h = 0; h < hours; h++) { const hk = `${dow}-${(start + h) % 24}`; heat[hk] = (heat[hk] || 0) + 3600; }
        const z1 = zones[Math.min(zones.length - 1, Math.floor(level / 6) + ri(0, 1))];
        zoneT[z1] = (zoneT[z1] || 0) + secs * 0.7; zoneT["Orgrimmar"] = (zoneT["Orgrimmar"] || 0) + secs * 0.3;
        const gain = Math.min(60 - level, Math.max(0, Math.round(hours * pace * (level < 20 ? 1.1 : 0.55) + rnd() - 0.4)));
        for (let g = 0; g < gain; g++) { level++; played += secs / Math.max(1, gain); levels[level] = Math.floor(parseDay(k).getTime() / 1000) + 3600 * (start + g); levelPlayed[level] = Math.round(played); dingAt[level] = { zone: z1, ...fallbackSpot(z1, rnd) }; }
        played += gain ? 0 : secs;
        const scale = 1 + level / 12;
        const dmg = Math.round(ri(5000, 9000) * hours * scale * (cls === "PRIEST" ? 0.45 : cls === "SHAMAN" ? 0.8 : 1));
        const hits = Math.round(dmg / (40 * scale));
        const nd = ri(0, cls === "MAGE" ? 4 : 2) * (pi === 5 ? 0 : 1); // Stonehoof is still alive on the hardcore demo realm
        const goldIn = Math.round(ri(400, 2200) * hours * scale), goldOut = Math.round(goldIn * (0.4 + rnd() * 0.5));
        goldNow = Math.max(0, goldNow + goldIn - goldOut);
        const q0 = ri(8, 30) * hours, q1 = ri(4, 12) * hours, q2 = ri(0, 3) * hours, q3 = rnd() < 0.35 ? 1 : 0, q4 = rnd() < 0.05 ? 1 : 0;
        const d = {
          dmg, heal: Math.round((cls === "PRIEST" ? 9000 : cls === "SHAMAN" ? 4000 : 150) * hours * scale),
          hits, crits: Math.round(hits * (0.04 + rnd() * 0.08 + (cls === "MAGE" ? 0.05 : 0))), overkill: Math.round(dmg * 0.06),
          deaths: nd, kb: ri(25, 70) * hours, xp: ri(5000, 12000) * hours, quests: ri(2, 9) * hours, goldIn, goldOut, gold: goldNow,
          repair: ri(50, 900) * Math.ceil(scale), dist: ri(3000, 8000) * hours, jumps: ri(80, 500) * (pi === 2 ? 3 : 1), played: secs,
          ghost: nd * ri(60, 220), taxi: ri(0, 900), swim: ri(0, 400), afk: ri(0, 1200), together: Math.round(secs * (0.5 + rnd() * 0.5)),
          dungeons: rnd() < 0.3 ? 1 : 0, casts: ri(300, 900) * hours, whiffs: ri(20, 80) * hours, resisted: ri(0, 20),
          taken: Math.round(dmg * (cls === "WARRIOR" ? 1.1 : 0.55)), healedBy: Math.round(dmg * (cls === "WARRIOR" ? 0.7 : 0.2)),
          dodges: ri(10, 40) * hours, parries: cls === "WARRIOR" ? ri(10, 30) * hours : 0, blocks: cls === "WARRIOR" || cls === "SHAMAN" ? ri(5, 25) * hours : 0,
          msgs: ri(10, 60), sorry: ri(0, pi === 1 ? 7 : 2), lol: ri(0, 14), emotes: ri(0, 8), hearth: ri(0, 2),
          q0, q1, q2, q3, q4, rolls: ri(0, 4), duelsWon: rnd() < 0.2 ? 1 : 0, levels: gain,
          maxHit: Math.round(ri(150, 400) * scale), maxHitSpell: Object.keys(spells)[0], maxHitTarget: pickOne(mobs),
        };
        d.rollSum = d.rolls * ri(25, 75);
        if (nd && rnd() < 0.35) d.deaths_fall = 1;
        if (d.dungeons) d.dungeonName = pickOne(dungeons);
        dmap[k] = d;
        const tot = Object.values(spells).reduce((a, b) => a + b, 0);
        Object.entries(spells).forEach(([s, w]) => { spellDmg[s] = (spellDmg[s] || 0) + Math.round(dmg * w / tot); casts[s] = (casts[s] || 0) + Math.round(d.casts * w / tot / 3); });
        for (let j = 0; j < nd; j++) {
          const fall = j === 0 && d.deaths_fall;
          const drown = !fall && rnd() < 0.08;
          deaths.push({
            t: Math.floor(parseDay(k).getTime() / 1000) + 3600 * start + ri(600, 3000 * hours), lvl: Math.max(1, level - ri(0, 1)),
            zone: z1, cause: fall ? "fall" : drown ? "drown" : "mob", by: fall || drown ? undefined : pickOne(mobs.slice(0, 5 + Math.floor(level / 10))),
            spell: fall || drown ? undefined : pickOne(["Melee", "Shadow Bolt", "Frostbolt", "Lightning Bolt", "Rend"]), amt: ri(30, 60) * Math.ceil(scale),
            ...fallbackSpot(z1, rnd),
          });
        }
      }
      const others = roster.filter((_, i) => i !== pi);
      others.forEach(([n]) => { healers[n] = ri(2000, 40000) * (n === "Mirelle" ? 4 : 1); });
      const duels = {};
      if (pi < 3) others.slice(0, 2).forEach(([n]) => { duels[n] = { w: ri(0, 5), l: ri(0, 5) }; });
      const hc = pi === 3 || pi === 5;
      if (pi === 3) { deaths.splice(1); if (deaths[0]) { level = deaths[0].lvl; Object.keys(levels).forEach(l => { if (+l > level) delete levels[l]; }); }
        Object.entries(dmap).forEach(([k, d]) => { d.deaths = deaths[0] && localKey(deaths[0].t) === k ? 1 : 0; d.deaths_fall = 0; }); } // Tidepaw died once, for good
      chars[id] = {
        key, name, realm: hc ? "Demo Hardcore" : "Demo Realm", class: cls, race, level,
        guild: pi >= 4 ? "Murloc Mafia" : "Example Guild", owner: pi === 2 || pi === 3 ? "demo-player-jordan" : "demo-player-" + pi,
        game: { demo: true, hardcore: hc || undefined },
        lastSeen: Date.now() / 1000, peakGold: goldNow * 1.4, gold: goldNow, deaths, levels, levelPlayed, dingAt, heat, zones: zoneT, spellDmg, casts, healers, duels,
        best: { hit: { amt: ri(900, 1500), spell: Object.keys(spells)[0], target: "Hogger", t: Date.now() / 1000 - 86400 * ri(1, 20) } },
        kills: Object.fromEntries(mobs.map(m => [m, ri(5, 90)])),
        gear: demoGear(cls, level, ri),
        talents: DEMO_TALENTS[cls].map(([n, pts]) => ({ n, p: Math.round(pts * Math.max(0, level - 9) / 51) })),
        professions: DEMO_PROFS[pi].map(([n, r]) => ({ n, r: Math.min(r, level * 5), m: 300 })),
        notable: [...Array(ri(3, 7))].map(() => { const zone = pickOne(zones); return { t: Date.now() / 1000 - 86400 * ri(0, SPAN), q: rnd() < 0.15 ? 4 : 3, item: pickOne(loot), zone, ...fallbackSpot(zone, rnd) }; }),
      };
      days[id + "_x"] = { char: id, days: dmap };
    });
    // Dungeon runs done together, so each run and boss fight is in several characters' saves, like the real thing.
    const DEMO_BOSSES = {
      "Ragefire Chasm": ["Oggleflint", "Taragaman the Hungerer", "Jergosh the Invoker", "Bazzalan"],
      "The Deadmines": ["Rhahk'Zor", "Sneed", "Gilnid", "Mr. Smite", "Captain Greenskin", "Edwin VanCleef"],
      "Wailing Caverns": ["Lady Anacondra", "Lord Cobrahn", "Kresh", "Lord Pythas", "Skum", "Lord Serpentis", "Verdan the Everliving", "Mutanus the Devourer"],
      "Shadowfang Keep": ["Rethilgore", "Razorclaw the Butcher", "Baron Silverlaine", "Commander Springvale", "Odo the Blindwatcher", "Fenrus the Devourer", "Wolf Master Nandos", "Archmage Arugal"],
    };
    const DPS = { WARRIOR: 34, PRIEST: 14, MAGE: 42, SHAMAN: 26, WARLOCK: 38, DRUID: 24 };
    const ids = Object.keys(chars);
    ids.forEach(id => Object.assign(chars[id], { fights: [], runs: [], bosses: {} }));
    for (let i = 0; i < 16; i++) {
      const inst = pickOne(dungeons), list = DEMO_BOSSES[inst];
      const group = ids.filter(() => rnd() < 0.65).slice(0, 5);
      if (group.length < 2) continue;
      const t0 = Math.floor(Date.now() / 1000) - 86400 * ri(0, SPAN - 1) - ri(0, 30000);
      const killed = rnd() < 0.75 ? list.length : ri(1, list.length - 1);
      const fights = [];
      let t = t0 + ri(180, 500), wipes = 0;
      for (let b = 0; b < killed; b++) {
        const tries = rnd() < 0.12 ? 2 : 1;
        for (let k = 1; k <= tries; k++) {
          const ok = k === tries, secs = ok ? ri(30, 150) : ri(20, 90);
          if (!ok) wipes++;
          const who = group.map(gid => {
            const c = chars[gid], healer = c.class === "PRIEST" || (c.class === "DRUID" && rnd() < 0.5);
            return { n: c.name, c: c.class, d: Math.round(DPS[c.class] * secs * (0.7 + rnd() * 0.6) * (healer ? 0.3 : 1)), h: healer ? Math.round(secs * ri(25, 45)) : Math.round(secs * ri(0, 3)) };
          });
          fights.push({ t, boss: list[b], inst, ok: ok || undefined, dur: secs, size: 5, deaths: ok ? (rnd() < 0.2 ? 1 : undefined) : ri(3, 5), who });
          t += secs + ri(90, 420);
        }
      }
      group.forEach(gid => {
        const c = chars[gid];
        c.runs.push({ t: t0, inst, kind: "party", dur: t - t0 + ri(30, 240), bosses: killed, wipes, deaths: ri(0, 2), lvl: c.level, lastBoss: list[killed - 1], with: group.filter(x => x !== gid).map(x => chars[x].name) });
        fights.forEach(f => {
          const me = f.who.find(w => w.n === c.name);
          c.fights.push({ ...f, dmg: me.d, heal: me.h, lvl: c.level });
          const key = `${f.boss}:${inst}`, b = c.bosses[key] ||= { n: f.boss, inst, kills: 0, wipes: 0 };
          if (!f.ok) { b.wipes++; return; }
          b.kills++; b.first = Math.min(b.first || Infinity, f.t); b.last = Math.max(b.last || 0, f.t); b.lvl ||= c.level;
          b.fast = Math.min(b.fast || Infinity, f.dur); b.dps = Math.max(b.dps || 0, Math.round(me.d / f.dur)); b.hps = Math.max(b.hps || 0, Math.round(me.h / f.dur));
        });
      });
    }
    const players = {
      ex1: { name: "Alex", chars: ["Grimtusk-Example"] },
      ex2: { name: "Sam", chars: ["Mirelle-Example"] },
      ex3: { name: "Jordan", chars: ["Bonksworth-Example", "Tidepaw-Example"] },
    };
    return { chars, days, obs: {}, players };
  }

  // ---------- map of the fallen ----------
  // Zone rectangles on each continent map (percent), exactly as the game places them: computed from the
  // client's UiMapAssignment table (Classic Era 1.15.9 and Anniversary 2.5.6), the same numbers behind
  // C_Map.GetMapRectOnMap. The addon also uploads them (ch.atlas); these are used until it has.
  const Z = (id, n, x0, x1, y0, y1) => ({ id, n, x0, x1, y0, y1 });
  const ATLAS_ERA = { v: "era-builtin",
    "947": { n: "Azeroth", zones: [Z(1415, "Eastern Kingdoms", 37.1, 115.9, 8.2, 86.9), Z(1414, "Kalimdor", -18.6, 63.4, 6.8, 88.8)] },
    "1414": { n: "Kalimdor", zones: [Z(1440, "Ashenvale", 41.8, 57.4, 33.1, 48.8), Z(1447, "Azshara", 55.3, 69.1, 30.4, 44.2), Z(1439, "Darkshore", 38.4, 56.2, 18.2, 36.0), Z(1457, "Darnassus", 38.4, 41.3, 10.4, 13.3), Z(1443, "Desolace", 34.9, 47.1, 50.3, 62.6), Z(1411, "Durotar", 51.7, 66.1, 44.8, 59.2), Z(1445, "Dustwallow Marsh", 49.0, 63.3, 60.5, 74.7), Z(1448, "Felwood", 41.9, 57.5, 23.1, 38.7), Z(1444, "Feralas", 31.6, 50.5, 61.8, 80.7), Z(1450, "Moonglade", 50.1, 56.4, 17.6, 23.8), Z(1412, "Mulgore", 40.8, 54.8, 53.3, 67.2), Z(1454, "Orgrimmar", 56.4, 60.2, 42.9, 46.7), Z(1451, "Silithus", 39.5, 48.9, 76.5, 85.9), Z(1442, "Stonetalon Mountains", 37.6, 50.8, 40.3, 53.6), Z(1446, "Tanaris", 47.0, 65.7, 76.1, 94.9), Z(1438, "Teldrassil", 36.0, 49.8, 3.9, 17.8), Z(1413, "The Barrens", 39.2, 66.8, 45.6, 73.1), Z(1441, "Thousand Needles", 47.6, 59.5, 68.3, 80.3), Z(1456, "Thunder Bluff", 45.0, 47.8, 55.6, 58.5), Z(1449, "Un'Goro Crater", 44.9, 55.0, 76.5, 86.5), Z(1452, "Winterspring", 47.2, 66.5, 17.4, 36.7)] },
    "1415": { n: "Eastern Kingdoms", zones: [Z(1416, "Alterac Mountains", 43.2, 51.2, 25.4, 33.4), Z(1417, "Arathi Highlands", 47.9, 58.1, 32.4, 42.6), Z(1418, "Badlands", 51.4, 58.4, 56.9, 64.0), Z(1419, "Blasted Lands", 49.0, 58.5, 76.8, 86.4), Z(1428, "Burning Steppes", 46.2, 54.5, 61.8, 70.1), Z(1430, "Deadwind Pass", 47.8, 54.9, 73.9, 81.0), Z(1426, "Dun Morogh", 40.3, 54.3, 48.3, 62.3), Z(1431, "Duskwood", 43.1, 50.8, 73.2, 80.9), Z(1423, "Eastern Plaguelands", 51.7, 62.7, 15.6, 26.6), Z(1429, "Elwynn Forest", 41.1, 51.0, 65.7, 75.5), Z(1424, "Hillsbrad Foothills", 42.4, 51.5, 30.1, 39.2), Z(1455, "Ironforge", 47.5, 49.7, 51.3, 53.5), Z(1432, "Loch Modan", 51.1, 59.0, 50.9, 58.8), Z(1433, "Redridge Mountains", 49.9, 56.1, 68.4, 74.5), Z(1427, "Searing Gorge", 46.4, 52.7, 57.8, 64.2), Z(1421, "Silverpine Forest", 35.7, 47.6, 24.7, 36.6), Z(1453, "Stormwind City", 41.5, 45.4, 67.1, 70.9), Z(1434, "Stranglethorn Vale", 39.1, 57.3, 79.4, 97.5), Z(1435, "Swamp of Sorrows", 51.8, 58.3, 72.8, 79.3), Z(1425, "The Hinterlands", 49.9, 60.9, 25.6, 36.5), Z(1420, "Tirisfal Glades", 36.8, 49.7, 15.5, 28.3), Z(1458, "Undercity", 43.0, 45.7, 23.8, 26.5), Z(1422, "Western Plaguelands", 44.3, 56.5, 17.5, 29.7), Z(1436, "Westfall", 36.9, 46.8, 71.9, 81.8), Z(1437, "Wetlands", 46.6, 58.3, 41.0, 52.7)] },
  };
  const ATLAS_TBC = { v: "tbc-builtin",
    "947": { n: "Azeroth", zones: [Z(1415, "Eastern Kingdoms", 32.5, 123.6, 1.0, 92.2), Z(1414, "Kalimdor", -18.6, 63.4, 6.8, 88.8)] },
    "1414": { n: "Kalimdor", zones: [Z(1440, "Ashenvale", 41.8, 57.4, 33.1, 48.8), Z(1447, "Azshara", 55.3, 69.1, 30.4, 44.2), Z(1943, "Azuremyst Isle", 27.1, 38.1, 21.8, 33.1), Z(1950, "Bloodmyst Isle", 25.9, 34.8, 13.4, 22.4), Z(1439, "Darkshore", 38.4, 56.2, 18.2, 36.0), Z(1457, "Darnassus", 38.4, 41.3, 10.4, 13.3), Z(1443, "Desolace", 34.9, 47.1, 50.3, 62.6), Z(1411, "Durotar", 51.7, 66.1, 44.8, 59.2), Z(1445, "Dustwallow Marsh", 49.0, 63.3, 60.5, 74.7), Z(1448, "Felwood", 41.9, 57.5, 23.1, 38.7), Z(1444, "Feralas", 31.6, 50.5, 61.8, 80.7), Z(1450, "Moonglade", 50.1, 56.4, 17.6, 23.8), Z(1412, "Mulgore", 40.8, 54.8, 53.3, 67.2), Z(1454, "Orgrimmar", 56.4, 60.2, 42.9, 46.7), Z(1451, "Silithus", 39.5, 48.9, 76.5, 85.9), Z(1442, "Stonetalon Mountains", 37.6, 50.8, 40.3, 53.6), Z(1446, "Tanaris", 47.0, 65.7, 76.1, 94.9), Z(1438, "Teldrassil", 36.0, 49.8, 3.9, 17.8), Z(1413, "The Barrens", 39.2, 66.8, 45.6, 73.1), Z(1947, "The Exodar", 28.6, 31.5, 25.2, 28.1), Z(1441, "Thousand Needles", 47.6, 59.5, 68.3, 80.3), Z(1456, "Thunder Bluff", 45.0, 47.8, 55.6, 58.5), Z(1449, "Un'Goro Crater", 44.9, 55.0, 76.5, 86.5), Z(1452, "Winterspring", 47.2, 66.5, 17.4, 36.7)] },
    "1415": { n: "Eastern Kingdoms", zones: [Z(1416, "Alterac Mountains", 42.7, 49.6, 35.6, 42.5), Z(1417, "Arathi Highlands", 46.7, 55.6, 41.7, 50.5), Z(1418, "Badlands", 49.7, 55.8, 62.9, 69.0), Z(1419, "Blasted Lands", 47.7, 55.9, 80.1, 88.3), Z(1428, "Burning Steppes", 45.3, 52.4, 67.1, 74.3), Z(1430, "Deadwind Pass", 46.6, 52.8, 77.5, 83.6), Z(1426, "Dun Morogh", 40.2, 52.3, 55.4, 67.5), Z(1431, "Duskwood", 42.6, 49.2, 77.0, 83.6), Z(1423, "Eastern Plaguelands", 50.0, 59.5, 27.2, 36.7), Z(1429, "Elwynn Forest", 40.8, 49.4, 70.4, 78.9), Z(1941, "Eversong Woods", 49.8, 62.1, 9.3, 21.4), Z(1942, "Ghostlands", 51.8, 60.0, 19.6, 27.7), Z(1424, "Hillsbrad Foothills", 42.0, 49.8, 39.7, 47.6), Z(1455, "Ironforge", 46.4, 48.3, 58.0, 59.9), Z(1957, "Isle of Quel'Danas", 51.8, 60.1, 0.0, 8.2), Z(1432, "Loch Modan", 49.5, 56.3, 57.7, 64.5), Z(1433, "Redridge Mountains", 48.5, 53.8, 72.7, 78.1), Z(1427, "Searing Gorge", 45.4, 50.9, 63.6, 69.1), Z(1954, "Silvermoon City", 54.6, 57.6, 12.6, 15.6), Z(1421, "Silverpine Forest", 36.1, 46.4, 35.0, 45.3), Z(1453, "Stormwind City", 41.2, 44.5, 71.7, 75.0), Z(1434, "Stranglethorn Vale", 39.2, 54.8, 82.3, 98.0), Z(1435, "Swamp of Sorrows", 50.1, 55.7, 76.6, 82.2), Z(1425, "The Hinterlands", 48.5, 57.9, 35.8, 45.2), Z(1420, "Tirisfal Glades", 37.2, 48.2, 27.0, 38.1), Z(1458, "Undercity", 42.5, 44.8, 34.2, 36.6), Z(1422, "Western Plaguelands", 43.6, 54.1, 28.8, 39.3), Z(1436, "Westfall", 37.2, 45.8, 75.8, 84.4), Z(1437, "Wetlands", 45.6, 55.7, 49.1, 59.2)] },
    "1945": { n: "Outland", zones: [Z(1949, "Blade's Edge Mountains", 23.8, 54.8, 12.1, 43.2), Z(1944, "Hellfire Peninsula", 42.7, 72.3, 37.3, 66.9), Z(1951, "Nagrand", 15.5, 47.1, 49.6, 81.3), Z(1953, "Netherstorm", 43.0, 74.9, 3.1, 35.1), Z(1948, "Shadowmoon Valley", 50.2, 81.7, 66.7, 98.2), Z(1955, "Shattrath City", 39.3, 46.8, 62.7, 70.1), Z(1952, "Terokkar Forest", 33.9, 64.8, 58.6, 89.5), Z(1946, "Zangarmarsh", 20.2, 48.9, 33.4, 62.2)] },
  };
  // Mists of Pandaria Classic (5.5): one map of Azeroth with the continents on it, from the client's UiMapAssignment
  // (5.5.4) like the ones above. Positions recorded on a continent are carried onto it through the continent's rectangle.
  const ATLAS_MOP = { v: "mop-builtin",
    "947": { n: "Azeroth", zones: [Z(13, "Eastern Kingdoms", 49.2, 120.6, 12.1, 83.4), Z(12, "Kalimdor", -11.7, 50.7, 17.1, 79.5), Z(113, "Northrend", 36.7, 68.3, 2.3, 33.9), Z(424, "Pandaria", 37.5, 66.7, 67.9, 97.1)] },
  };
  // The realm's own uploaded atlas if there is one with this game's maps, otherwise the built-in one for its game.
  // Maps the upload lacks (Azeroth, on Classic Era and Anniversary) come from the built-in one.
  const mapGame = () => {
    const vs = (state.allChars || []).filter(realmMatch).map(c => String((c.game || {}).version || ""));
    return vs.some(v => v.startsWith("5.")) ? "mop" : vs.some(v => v.startsWith("2.")) ? "tbc" : "era";
  };
  const pickAtlas = () => {
    const game = mapGame(), fits = a => a && MAP_ART[game].some(c => a[c] && (a[c].zones || []).length);
    const builtin = { era: ATLAS_ERA, tbc: ATLAS_TBC, mop: ATLAS_MOP }[game];
    const shared = (state.atlases || {})[String(state.realm || "").split("|")[1]];
    if (fits(shared)) return { ...builtin, ...shared };
    const up = (state.allChars || []).filter(c => realmMatch(c) && fits(c.atlas)).sort((a, b) => (b.lastSeen || 0) - (a.lastSeen || 0))[0];
    return up ? { ...builtin, ...up.atlas } : builtin;
  };
  // A spot somewhere inside a zone (example data only).
  function fallbackSpot(zone, rnd) {
    for (const [cont, a] of Object.entries(ATLAS_ERA)) {
      const z = a.zones && a.zones.find(q => q.n === zone);
      if (z) return { cont, cx: z.x0 + (z.x1 - z.x0) * (.3 + .4 * rnd()), cy: z.y0 + (z.y1 - z.y0) * (.3 + .4 * rnd()) };
    }
    return {};
  }

  // The continents' map art from the game client, built by design/src/make_maps.py into site/maps/. Each image is
  // the in-game map frame, so a position's percentages on it are the game's own map coordinates, the same ones the
  // addon records and the zone rectangles above use.
  const MAP_ART = { era: ["1414", "1415", "947"], tbc: ["1414", "1415", "1945", "947"], mop: ["947"] };
  // The maps with a tab of their own: Azeroth (where every map starts), and Outland, which isn't on it.
  // Kalimdor and the Eastern Kingdoms open from Azeroth, and right-clicking them goes back out to it.
  const MAP_TABS = ["947", "1945"];
  // The world map a continent opens from (Azeroth), if it has one.
  const worldOf = id => {
    const w = pickAtlas()["947"];
    return id !== "947" && w && (w.zones || []).some(z => String(z.id) === id) ? "947" : null;
  };
  const CITY = /orgrimmar|thunder bluff|darnassus|stormwind|ironforge|undercity|silvermoon|exodar|shattrath/i;

  // ---------- map zoom and pan ----------
  // Each map (continent, zone or city) keeps its own view, starting fully zoomed out.
  const mapKey = () => state.map.zone || state.map.cont;
  const mapView = () => { const m = state.map; return ((m.views ||= {})[mapKey()] ||= { z: 1, x: 0, y: 0 }); };
  // free: no limits, for the zoom into and out of a zone (which goes far past the usual 4x)
  function applyMapView(free) {
    const v = mapView(), box = $("map"), W = box.clientWidth, H = box.clientHeight;
    if (!free) {
      v.z = Math.min(4, Math.max(1, v.z));
      v.x = Math.min(0, Math.max(W - W * v.z, v.x));
      v.y = Math.min(0, Math.max(H - H * v.z, v.y));
    }
    const w = $("mapWorld").style;
    w.width = v.z * 100 + "%"; w.height = v.z * 100 + "%"; w.left = v.x + "px"; w.top = v.y + "px";
    box.classList.toggle("z2", v.z >= 1.8);
    box.classList.toggle("zoomed", v.z > 1.01);
  }
  function zoomMap(f, cx, cy) {
    const v = mapView(), box = $("map");
    if (cx == null) { cx = box.clientWidth / 2; cy = box.clientHeight / 2; }
    const nz = Math.min(6, Math.max(1, v.z * f));
    v.x = cx - (cx - v.x) * nz / v.z; v.y = cy - (cy - v.y) * nz / v.z; v.z = nz;
    $("mapTip").hidden = true;
    applyMapView();
  }
  // ---------- zones: click one to zoom into its own map, right-click to zoom back out (as the game's map does) ----------
  const zoneById = id => (((pickAtlas()[state.map.cont] || {}).zones) || []).find(z => z.id === +id);
  // a zone's rectangle in the open map's 0-100 space (the continent's own, or relative to the open zone)
  function rectOnOpen(z) {
    const p = state.map.zone && zoneById(state.map.zone);
    if (!p) return z;
    const sx = 100 / (p.x1 - p.x0), sy = 100 / (p.y1 - p.y0);
    return { x0: (z.x0 - p.x0) * sx, x1: (z.x1 - p.x0) * sx, y0: (z.y0 - p.y0) * sy, y1: (z.y1 - p.y0) * sy };
  }
  // What a click at x, y (0-100 on the open map) opens: on a continent the smallest zone there (capitals are
  // opened from their zone, as in the game); in a zone, a capital inside it; in a capital, nothing.
  function mapHit(x, y) {
    const m = state.map, zones = ((pickAtlas()[m.cont] || {}).zones) || [], open = m.zone && zoneById(m.zone);
    if (open && CITY.test(open.n)) return null;
    const cx = open ? open.x0 + (open.x1 - open.x0) * x / 100 : x, cy = open ? open.y0 + (open.y1 - open.y0) * y / 100 : y;
    const built = ((state.mapIndex || {})[mapGame()] || []).concat(MAP_ART[mapGame()].map(Number));
    const hits = zones.filter(z => z !== open && built.includes(z.id) && CITY.test(z.n) === !!open && cx >= z.x0 && cx <= z.x1 && cy >= z.y0 && cy <= z.y1);
    // continents' rectangles on Azeroth overlap over the sea, so there the nearest one wins; elsewhere the smallest
    const size = z => m.cont === "947" && !open ? Math.hypot((z.x0 + z.x1) / 2 - cx, (z.y0 + z.y1) / 2 - cy) : (z.x1 - z.x0) * (z.y1 - z.y0);
    return hits.sort((a, b) => size(a) - size(b))[0] || null;
  }
  const mapSrc = id => `maps/${mapGame()}-${id}.webp`;
  // which zone maps were built (site/maps/index.json, written by make_maps.py): only those can be opened
  fetch("maps/index.json").then(r => (r.ok ? r.json() : {})).then(ix => { state.mapIndex = ix; }).catch(() => { state.mapIndex = {}; });
  const loadArt = src => { const im = new Image(); im.src = src; return (im.decode ? im.decode() : Promise.resolve()).catch(() => {}); };
  // Runs a change of view as a glide (or at once, with reduced motion or Settings > Animations off).
  async function glide(change) {
    const w = $("mapWorld"), still = reduceMotion || document.documentElement.classList.contains("calm");
    if (!still) { w.classList.add("anim"); void w.offsetWidth; }
    change();
    if (!still) { await new Promise(r => setTimeout(r, 380)); w.classList.remove("anim"); }
  }
  // The view that makes a rectangle (0-100 on the open map) fill the box.
  function viewOnto(r) {
    const W = $("map").clientWidth, H = $("map").clientHeight, z = Math.min(100 / (r.x1 - r.x0), 100 / (r.y1 - r.y0));
    return { z, x: W / 2 - (r.x0 + r.x1) / 200 * W * z, y: H / 2 - (r.y0 + r.y1) / 200 * H * z };
  }
  let mapBusy = false;
  async function openZone(z) {
    if (mapBusy) return;
    if (MAP_ART[mapGame()].includes(String(z.id))) {
      Object.assign(state.map, { cont: String(z.id), zone: "", trail: [] });
      render();
      return;
    }
    mapBusy = true;
    $("mapTip").hidden = true; $("mapHover").hidden = true;
    const m = state.map;
    await loadArt(mapSrc(z.id)); // straight in once its art is ready; the map underneath keeps its view for the way back
    (m.trail ||= []).push(m.zone || "");
    m.zone = String(z.id);
    m.views[m.zone] = { z: 1, x: 0, y: 0 };
    mapBusy = false;
    render();
  }
  // Back out one level: a zone to its continent, a continent to Azeroth.
  async function closeZone() {
    const m = state.map, up = !m.zone && worldOf(m.cont);
    if (mapBusy || (!m.zone && !up)) return;
    mapBusy = true;
    $("mapTip").hidden = true; $("mapHover").hidden = true;
    const from = m.zone || m.cont;
    if (m.zone) m.zone = (m.trail || []).pop() || "";
    else Object.assign(m, { cont: up, trail: [] });
    const child = zoneById(from);
    const view = mapView(), back = { ...view };
    render();
    // start on the zone's rectangle, then glide back to where the map was before
    if (child) { Object.assign(view, viewOnto(rectOnOpen(child))); applyMapView(true); }
    await glide(() => { Object.assign(view, back); applyMapView(); });
    mapBusy = false;
  }

  // Drag, pinch, Ctrl + scroll and the zoom buttons (wired up once the page helpers exist).
  function initMapZoom() {
    const box = $("map"), pts = new Map();
    let last = null, moved = false, pinch = 0, hintT = 0;
    const rel = (x, y) => { const r = box.getBoundingClientRect(); return [x - r.left, y - r.top]; };
    box.addEventListener("pointerdown", e => {
      if (e.target.closest(".mapzoom")) return;
      pts.set(e.pointerId, [e.clientX, e.clientY]);
      if (pts.size === 1) { last = [e.clientX, e.clientY]; moved = false; }
    });
    box.addEventListener("pointermove", e => {
      if (!pts.has(e.pointerId)) return;
      pts.set(e.pointerId, [e.clientX, e.clientY]);
      if (pts.size === 2) {
        const [a, b] = [...pts.values()], d = Math.hypot(a[0] - b[0], a[1] - b[1]);
        if (pinch) zoomMap(d / pinch, ...rel((a[0] + b[0]) / 2, (a[1] + b[1]) / 2));
        pinch = d; moved = true;
        return;
      }
      if (!last) return;
      const dx = e.clientX - last[0], dy = e.clientY - last[1];
      if (!moved && Math.hypot(dx, dy) < 4) return;
      if (!moved) { moved = true; box.setPointerCapture(e.pointerId); box.classList.add("dragging"); $("mapTip").hidden = true; }
      const v = mapView();
      v.x += dx; v.y += dy; last = [e.clientX, e.clientY];
      applyMapView();
    });
    const up = e => {
      pts.delete(e.pointerId);
      if (pts.size < 2) pinch = 0;
      if (!pts.size) { last = null; box.classList.remove("dragging"); }
    };
    box.addEventListener("pointerup", up);
    box.addEventListener("pointercancel", up);
    // A drag isn't a click on whatever marker it started on.
    box.addEventListener("click", e => { if (moved) { e.stopPropagation(); moved = false; } }, true);
    // Plain scrolling keeps scrolling the page; Ctrl + scroll (or a trackpad pinch) zooms.
    box.addEventListener("wheel", e => {
      if (!(e.ctrlKey || e.metaKey)) {
        $("mapHint").hidden = false; clearTimeout(hintT); hintT = setTimeout(() => { $("mapHint").hidden = true; }, 1400);
        return;
      }
      e.preventDefault();
      zoomMap(Math.exp(-e.deltaY * .0025), ...rel(e.clientX, e.clientY));
    }, { passive: false });
    // where the pointer is on the open map, 0-100
    const at = e => { const [rx, ry] = rel(e.clientX, e.clientY), v = mapView(); return [(rx - v.x) / (box.clientWidth * v.z) * 100, (ry - v.y) / (box.clientHeight * v.z) * 100]; };
    let hovered = null;
    box.addEventListener("mousemove", e => {
      if (pts.size || mapBusy) return;
      const z = e.target.closest(".mapzoom, .mk") ? null : mapHit(...at(e));
      box.classList.toggle("can-open", !!z);
      if (z === hovered) return;
      hovered = z;
      $("mapHover").hidden = !z;
      if (z) { $("mapHover").textContent = z.n; loadArt(mapSrc(z.id)); }
    });
    box.addEventListener("mouseleave", () => { hovered = null; $("mapHover").hidden = true; box.classList.remove("can-open"); });
    box.addEventListener("click", e => {
      if (e.target.closest(".mapzoom, .mk")) return;
      const z = mapHit(...at(e));
      if (z) openZone(z);
    });
    box.addEventListener("contextmenu", e => { if (state.map.zone || worldOf(state.map.cont)) { e.preventDefault(); closeZone(); } });
    box.addEventListener("dblclick", e => { if (!e.target.closest(".mapzoom, .mk") && !mapHit(...at(e))) zoomMap(1.6, ...rel(e.clientX, e.clientY)); });
    box.querySelector(".mapzoom").addEventListener("click", e => {
      const b = e.target.closest("[data-zoom]");
      if (!b) return;
      if (b.dataset.zoom === "fit") { Object.assign(mapView(), { z: 1, x: 0, y: 0 }); applyMapView(); }
      else zoomMap(b.dataset.zoom === "in" ? 1.5 : 1 / 1.5);
    });
    if (window.ResizeObserver) new ResizeObserver(() => { if (state.map) applyMapView(); }).observe(box);
  }

  const MAP_ICON = { deaths: () => "skull", dings: () => "crit", loot: e => (e.d.q >= 4 ? "lotus" : "loot") };
  // Where on its continent something happened: the addon's own continent position, or, for records uploaded
  // without one, the zone position placed through the zone's rectangle (what C_Map.GetMapRectOnMap does in game).
  function contSpot(d, atlas) {
    if (d.cx != null) return onTop(d.cont, d.cx, d.cy, atlas);
    if (d.map == null || d.x == null || d.y == null) return null;
    return onTop(d.map, d.x, d.y, atlas);
  }
  // A position on map `id` (0-100) as a position on one of the drawn maps: as is when `id` is one of them,
  // else through its rectangle there (a zone on a continent, or a continent on Azeroth).
  function onTop(id, x, y, atlas) {
    if (atlas[String(id)] && atlas[String(id)].zones) return { cont: String(id), x, y };
    for (const [cont, a] of Object.entries(atlas)) {
      const z = a && a.zones && a.zones.find(q => q.id === +id);
      if (z) return { cont, x: z.x0 + (z.x1 - z.x0) * x / 100, y: z.y0 + (z.y1 - z.y0) * y / 100 };
    }
    return null;
  }
  // Everything with a continent position in the chosen range, oldest first.
  function mapEvents(people) {
    const out = [], ok = t => t && inRange(localKey(t)), atlas = pickAtlas();
    for (const p of people) {
      for (const d of p.deaths) { const at = ok(d.t) && contSpot(d, atlas); if (at) out.push({ kind: "deaths", p, t: d.t, ...at, d }); }
      for (const n of p.notable) { const at = n.cx != null && ok(n.t) && onTop(n.cont, n.cx, n.cy, atlas); if (at) out.push({ kind: "loot", p, t: n.t, ...at, d: n }); }
      for (const ch of p.chars) for (const [lvl, sp] of Object.entries(ch.dingAt || {})) {
        const t = (ch.levels || {})[lvl], at = sp && sp.cx != null && ok(t) && onTop(sp.cont, sp.cx, sp.cy, atlas);
        if (at) out.push({ kind: "dings", p, t, ...at, d: { ...sp, lvl: +lvl, _char: ch.name } });
      }
    }
    return out.sort((a, b) => a.t - b.t);
  }
  function mapTip(e) {
    const who = esc(e.d._char || nameTxt(e.p)), when = shortDate(localKey(e.t)), where = esc(e.d.zone || "");
    if (e.kind === "deaths") {
      const how = e.d.cause === "fall" ? tr("fell to their death") : e.d.cause === "drown" ? tr("drowned")
        : e.d.by ? tr("killed by {0}", esc(e.d.by)) + (e.d.spell ? ` (${esc(e.d.spell)}${e.d.amt ? " " + num(e.d.amt) : ""})` : "") : tr("died");
      return `<b>${who}</b> ${how}<br><span class="muted">${[e.d.lvl ? tr("Lvl {0}", e.d.lvl) : "", where, when].filter(Boolean).join(" · ")}</span>`;
    }
    if (e.kind === "dings") return `<b>${who}</b> ${tr("reached level {0}", e.d.lvl)}<br><span class="muted">${[where, when].filter(Boolean).join(" · ")}</span>`;
    return `<b>${who}</b> ${tr("looted")} <span class="q${e.d.q}">[${esc(e.d.item || "")}]</span><br><span class="muted">${[where, when].filter(Boolean).join(" · ")}</span>`;
  }

  function renderMap(people) {
    const m = (state.map ||= { cont: "", layers: { deaths: true, dings: true, loot: true }, who: "" });
    const atlas = pickAtlas(), game = mapGame();
    if (!people.some(p => p.id === m.who)) m.who = "";
    const all = mapEvents(m.who ? people.filter(p => p.id === m.who) : people);
    // Kalimdor and the Eastern Kingdoms always; Outland (TBC clients only) once something happened there; Azeroth on Mists of Pandaria.
    const conts = MAP_ART[game].filter(c => atlas[c] && (c !== "1945" || all.some(e => e.cont === c)));
    $("s-map").classList.toggle("nosec", !conts.length);
    if (!conts.length) return;
    // Each realm starts on Azeroth (or, without it, on the continent where most happened).
    if (m.realm !== state.realm || !conts.includes(m.cont)) {
      const busiest = conts.map(c => [c, all.filter(e => e.cont === c).length]).sort((a, b) => b[1] - a[1])[0];
      m.cont = conts.includes("947") ? "947" : busiest ? busiest[0] : conts[0] || "";
      m.zone = ""; m.trail = []; m.realm = state.realm;
    }
    if (m.zone && !zoneById(m.zone)) { m.zone = ""; m.trail = []; }
    const open = m.zone ? zoneById(m.zone) : null;
    const tabs = conts.filter(c => MAP_TABS.includes(c) || !worldOf(c));
    $("mapConts").innerHTML = tabs.map(c => `<button type="button" class="chip" data-cont="${c}" aria-pressed="${c === (worldOf(m.cont) || m.cont)}">${esc(atlas[c].n)}</button>`).join("");
    document.querySelectorAll("#s-map [data-layer]").forEach(b => b.setAttribute("aria-pressed", String(!!m.layers[b.dataset.layer])));
    $("mapWho").innerHTML = `<option value="">${tr("Everyone")}</option>` + people.map(p => `<option value="${esc(p.id)}">${esc(nameTxt(p))}</option>`).join("");
    $("mapWho").value = m.who;

    const art = $("mapArt"), src = mapSrc(m.zone || m.cont);
    if (art.getAttribute("src") !== src) art.src = src;
    art.alt = tr("Map of {0}", open ? open.n : atlas[m.cont].n);
    // the way back up: Azeroth, continent, zone, capital
    const world = worldOf(m.cont);
    const path = [...(world ? [atlas[world].n] : []), atlas[m.cont].n, ...[...(m.trail || []), m.zone].filter(Boolean).map(id => zoneById(id).n)];
    $("mapCrumbs").innerHTML = path.length > 1
      ? `<button type="button" class="linkbtn" data-mapup="1">‹ ${esc(tr("Back to {0}", path[path.length - 2]))}</button><span>${path.map(esc).join(" › ")}</span>`
      : "";
    // zone names (shown once zoomed in) in the middle of each zone's rectangle; a zone's own map has its names in the art
    $("mapLabels").innerHTML = open ? "" : (atlas[m.cont].zones || []).map(z => {
      const cls = CITY.test(z.n) ? "city" : z.x1 - z.x0 < 9 ? "small" : "";
      return `<span class="${cls}" style="left:${(z.x0 + z.x1) / 2}%;top:${(z.y0 + z.y1) / 2}%">${esc(z.n)}</span>`;
    }).join("");
    // On a zone's map: the zone position when it was recorded in that zone, else the continent position through the zone's rectangle.
    const place = e => {
      if (!open) {
        if (e.cont === m.cont) return e;
        const c = (atlas[m.cont].zones || []).find(z => String(z.id) === e.cont);
        return c ? { ...e, x: c.x0 + (c.x1 - c.x0) * e.x / 100, y: c.y0 + (c.y1 - c.y0) * e.y / 100 } : null;
      }
      if (e.d.map != null && +e.d.map === open.id && e.d.x != null) return { ...e, x: e.d.x, y: e.d.y };
      if (e.cont !== m.cont) return null;
      const x = (e.x - open.x0) / (open.x1 - open.x0) * 100, y = (e.y - open.y0) / (open.y1 - open.y0) * 100;
      return x >= 0 && x <= 100 && y >= 0 && y <= 100 ? { ...e, x, y } : null;
    };
    const shown = all.filter(e => m.layers[e.kind]).map(place).filter(Boolean);
    state.mapShown = shown;
    $("mapMarks").classList.remove("replaying");
    $("mapMarks").innerHTML = shown.map((e, i) =>
      `<button type="button" class="mk" data-i="${i}" style="left:${e.x}%;top:${e.y}%;--d:${(i / Math.max(1, shown.length) * 6).toFixed(2)}s" aria-label="${esc(e.d._char || e.p.name)}">${sprite(MAP_ICON[e.kind](e), 1)}</button>`).join("");
    $("mapTip").hidden = true;
    $("mapReplay").hidden = shown.length < 2;
    applyMapView();

    // Deadliest zones, counting every death in range (with or without a position).
    const deaths = (m.who ? people.filter(p => p.id === m.who) : people).flatMap(p => p.deaths).filter(d => d.t && inRange(localKey(d.t)));
    const byZone = {}, byFoe = {};
    deaths.forEach(d => { const z = d.inst || d.zone || tr("Unknown"); byZone[z] = (byZone[z] || 0) + 1; if (d.by) byFoe[d.by] = (byFoe[d.by] || 0) + 1; });
    const top = Object.entries(byZone).sort((a, b) => b[1] - a[1]).slice(0, 6), max = top.length ? top[0][1] : 1;
    const foe = Object.entries(byFoe).sort((a, b) => b[1] - a[1])[0];
    $("mapSide").innerHTML = top.length
      ? top.map(([z, n]) => `<div class="zl"><span>${esc(z)}</span><span class="n">${num(n)}</span><span class="bar"><i style="width:${n / max * 100}%"></i></span></div>`).join("")
        + (foe ? `<p class="muted" style="margin-top:6px">${tr("Top killer: {0}", `<b style="color:var(--ink)">${esc(foe[0])}</b> (${num(foe[1])})`)}</p>` : "")
      : `<p class="empty">${tr("No deaths in this range. Impressive.")}</p>`;
    const unplaced = deaths.filter(d => !contSpot(d, pickAtlas())).length;
    $("mapNote").textContent = [
      unplaced ? tr("{0} deaths happened before positions were saved (FunStats 1.1), so they're only counted, not placed.", num(unplaced)) : "",
    ].filter(Boolean).join(" ");
  }
  function showMapTip(btn) {
    const e = (state.mapShown || [])[+btn.dataset.i], tip = $("mapTip");
    if (!e) return;
    tip.innerHTML = mapTip(e);
    tip.hidden = false;
    const box = $("map").getBoundingClientRect(), r = btn.getBoundingClientRect();
    const x = r.left - box.left + r.width / 2, y = r.top - box.top;
    tip.style.left = Math.max(4, Math.min(x - tip.offsetWidth / 2, box.width - tip.offsetWidth - 4)) + "px";
    tip.style.top = (y - tip.offsetHeight - 8 < 4 ? y + r.height + 8 : y - tip.offsetHeight - 8) + "px";
  }
  document.addEventListener("click", e => {
    const c = e.target.closest("#mapConts [data-cont]"), l = e.target.closest("#s-map [data-layer]"), mk = e.target.closest(".mk");
    if (c) { state.map.cont = c.dataset.cont; state.map.zone = ""; state.map.trail = []; render(); }
    if (e.target.closest("[data-mapup]")) closeZone();
    if (l) { state.map.layers[l.dataset.layer] = !state.map.layers[l.dataset.layer]; render(); }
    if (mk) showMapTip(mk);
    else if (!e.target.closest("#mapTip")) { const t = document.getElementById("mapTip"); if (t) t.hidden = true; }
    if (e.target.closest("#mapReplay")) { const box = $("mapMarks"); box.classList.remove("replaying"); void box.offsetWidth; box.classList.add("replaying"); }
  });
  document.addEventListener("mouseover", e => { const mk = e.target.closest(".mk"); if (mk) showMapTip(mk); });
  document.addEventListener("focusin", e => { const mk = e.target.closest(".mk"); if (mk) showMapTip(mk); });

  // ---------- charts ----------
  const $ = id => document.getElementById(id);
  const charts = {};
  const hasChart = typeof window.Chart === "function";
  const css = name => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

  // Chart colours and fonts follow the active theme; called again whenever the theme changes.
  function applyChartTheme() {
    if (!hasChart) return;
    const C = window.Chart;
    C.defaults.color = css("--muted");
    C.defaults.borderColor = "rgba(255,255,255,.05)";
    C.defaults.font.family = '"DM Sans", system-ui, sans-serif';
    C.defaults.font.size = 11;
    C.defaults.maintainAspectRatio = false;
    C.defaults.animation = false;          // instant updates; no lag when switching stats, weeks or themes
    C.defaults.resizeDelay = 120;          // don't redraw on every pixel while a window is being resized
    C.defaults.normalized = true;
    Object.assign(C.defaults.plugins.tooltip, {
      backgroundColor: css("--ink"), borderWidth: 0, cornerRadius: 8, padding: { x: 12, y: 9 },
      caretSize: 6, caretPadding: 8, titleColor: css("--bg"), bodyColor: css("--bg"), titleMarginBottom: 6,
      titleFont: { family: '"DM Sans", sans-serif', weight: "700", size: 12 }, bodyFont: { family: '"DM Sans", sans-serif', size: 12 },
      boxWidth: 8, boxHeight: 8, boxPadding: 6, usePointStyle: true,
      filter: item => item.raw !== 0 && item.raw !== null,   // skip rows with nothing to say
    });
    Object.assign(C.defaults.plugins.legend.labels, {
      usePointStyle: true, pointStyle: "circle", boxWidth: 7, boxHeight: 7, padding: 14, color: css("--muted"),
      font: { family: '"DM Sans", sans-serif', size: 12, weight: "500" },
    });
    C.defaults.plugins.legend.align = "start";
  }
  applyChartTheme();

  const alpha = (c, a) => typeof c === "string" && /^#[0-9a-f]{6}$/i.test(c) ? c + a : c;
  // A soft fade under a single line, from the line's colour to nothing.
  const fadeFill = c => ({ chart }) => {
    const area = chart.chartArea;
    if (!area) return alpha(c, "22");
    const g = chart.ctx.createLinearGradient(0, area.top, 0, area.bottom);
    g.addColorStop(0, alpha(c, "44"));
    g.addColorStop(1, alpha(c, "00"));
    return g;
  };

  // One clean look for every chart: solid rounded bars, smooth lines, thin rings, hairline grids.
  function polish(config) {
    const type = config.type;
    const o = config.options ||= {};
    const horizontal = o.indexAxis === "y";
    const stacked = !!(o.scales && Object.values(o.scales).some(s => s && s.stacked));
    const sets = config.data.datasets || [];
    for (const ds of sets) {
      if (type === "bar") {
        Object.assign(ds, {
          borderSkipped: stacked ? "start" : false, borderRadius: stacked ? 0 : 6,
          borderWidth: stacked ? 1 : 0, borderColor: css("--panel"),
          maxBarThickness: horizontal ? 16 : 36, categoryPercentage: .7, barPercentage: .9,
        });
        if (!ds.hoverBackgroundColor) ds.hoverBackgroundColor = ds.backgroundColor;
      } else if (type === "line") {
        ds._c = ds.borderColor;
        const filled = sets.length === 1 || ds.area;
        Object.assign(ds, {
          // a series with only a point or two shows its dots, or there would be nothing to see
          tension: .35, cubicInterpolationMode: "monotone", borderWidth: 2, pointRadius: ds.data.length < 3 ? 4 : 0, pointHoverRadius: 5, pointHitRadius: 10,
          pointBackgroundColor: ds._c, pointBorderColor: css("--panel"), pointBorderWidth: 2,
          fill: filled ? "origin" : false, backgroundColor: filled ? fadeFill(ds._c) : ds._c,
          borderWidth: ds.borderDash ? 1.8 : 2.5,
        });
      } else if (type === "doughnut") {
        Object.assign(ds, { borderColor: css("--panel"), borderWidth: 3, hoverOffset: 4, borderRadius: 4 });
        o.cutout = "76%";
      } else if (type === "radar") {
        Object.assign(ds, { borderWidth: 2, pointRadius: 0, pointHoverRadius: 4, backgroundColor: alpha(ds.borderColor, "14") });
      }
    }
    if (type === "radar" && o.scales && o.scales.r && o.scales.r.pointLabels) o.scales.r.pointLabels.color = css("--muted");
    if (type === "line") {
      // One line at a time: the nearest line is highlighted and the others fade back.
      o.interaction = { mode: "nearest", intersect: false, axis: "xy" };
      o.plugins ||= {};
      o.plugins.tooltip = { ...(o.plugins.tooltip || {}), mode: "nearest", intersect: false };
      if (o.scales && o.scales.x) o.scales.x.grid = { display: false };
      if (o.scales && o.scales.x && o.scales.x.ticks) o.scales.x.ticks.maxTicksLimit = Math.min(o.scales.x.ticks.maxTicksLimit || 6, 6);
      if (sets.length > 1) o.onHover = (evt, els, chart) => {
        const idx = els.length ? els[0].datasetIndex : -1;
        if (chart.$hl === idx) return;
        chart.$hl = idx;
        chart.data.datasets.forEach((d, i) => {
          d.borderColor = idx < 0 || i === idx ? d._c : alpha(d._c, "38");
          d.borderWidth = i === idx ? 3 : d.borderDash ? 1.8 : 2.5;
        });
        chart.update("none");
      };
    }
    return config;
  }

  // Charts show at most this many characters; everyone else is grouped as "Others".
  const MAX_SERIES = 8;
  const OTHERS_COLOR = "#6f7180";
  function topSeries(people, score) {
    const ranked = people.map(p => ({ p, v: score(p) })).filter(x => x.v > 0).sort((a, b) => b.v - a.v);
    return { top: ranked.slice(0, MAX_SERIES).map(x => x.p), rest: ranked.slice(MAX_SERIES).map(x => x.p) };
  }

  // Charts below the screen are only drawn once you scroll near them, and existing charts are
  // updated in place instead of being rebuilt, so switching stats, weeks or pages stays instant.
  const pendingCharts = new Map();
  const watched = new WeakSet();
  const chartObserver = "IntersectionObserver" in window ? new IntersectionObserver(entries => {
    for (const e of entries) {
      if (!e.isIntersecting || !pendingCharts.has(e.target.id)) continue;
      const cfg = pendingCharts.get(e.target.id);
      pendingCharts.delete(e.target.id);
      paintChart(e.target, cfg);
    }
  }, { rootMargin: "400px 0px" }) : null;
  const nearScreen = el => {
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.bottom > -400 && r.top < window.innerHeight + 400;
  };

  function paintChart(canvas, config) {
    const id = canvas.id;
    const cfg = polish(config);
    const ch = charts[id];
    if (ch && ch.config.type === cfg.type) {
      ch.data = cfg.data;
      ch.options = cfg.options || {};
      ch.$hl = undefined;
      ch.update("none");
      return;
    }
    if (ch) ch.destroy();
    charts[id] = new window.Chart(canvas, cfg);
  }

  function drawChart(id, config) {
    const canvas = $(id);
    if (!canvas) return;
    const box = canvas.parentElement;
    const msg = box.querySelector(".nochart");
    if (msg) msg.remove();
    if (!hasChart || !config) {
      pendingCharts.delete(id);
      if (charts[id]) { charts[id].destroy(); delete charts[id]; }
      canvas.hidden = true;
      const p = document.createElement("p");
      p.className = "nochart";
      p.textContent = !hasChart ? tr("Charts couldn't load. Check your connection and reload.") : (config === null ? tr("Nothing recorded yet.") : "");
      box.appendChild(p);
      return;
    }
    canvas.hidden = false;
    if (chartObserver && !nearScreen(canvas)) {
      pendingCharts.set(id, config);
      if (!watched.has(canvas)) { watched.add(canvas); chartObserver.observe(canvas); }
      return;
    }
    pendingCharts.delete(id);
    paintChart(canvas, config);
  }
  // Theme changes need fresh charts (colours are baked in when a chart is created).
  function resetCharts() { Object.keys(charts).forEach(id => { charts[id].destroy(); delete charts[id]; }); }
  const gridX = { grid: { display: false }, border: { display: false }, ticks: { padding: 6 } };
  const gridY = { grid: { color: "rgba(255,255,255,.05)", drawTicks: false }, border: { display: false }, ticks: { maxTicksLimit: 5, padding: 8 } };

  // ---------- pixel sprites ----------
  // Each string is one row; each character is one pixel, coloured by the palette.
  // The 32x32 icons are generated by design/src/make_icons.py (re-run it to change them); the crest is drawn by hand.
  const SPRITES = {
    skull: [["......####......",".....#0000#.....","....#0wwkw0#....","...#0wwwkww0#...","..#0wwwwwwww0#..","..#0wwwwwwww1#..","..#0wkkwwkkw1#..","..#0wekwwkew1#..","..#0wwwwwwww1#..","...#0wwkkww1#...","....#0wwwww1#...","....#0kwkwk1#...","....#0wwwww1#...","....#0111111#...",".....#######....","................"],{"w":"#e8e0c8","k":"#24161a","e":"#7dff5a","0":"#f1ecdd","1":"#908b7c","#":"#120c08"},"e"],
    sword: [["..........l.###.",".........l.#000#",".........ll0bl1#",".........llwll1#","........#lwll1#.",".c.....#0wll1#ll","ccc##.#0wwb1#.l.",".#222#0wwl1#.lll",".#23g2blb1#..l..","..##2gll1#......","...#4cg3#.......","..#4h53g2#......",".#4h5##23#......","#2g5#.#23#......",".#2#...##.......","..#............."],{"b":"#6f9ad8","l":"#fff27a","w":"#ffffff","g":"#e0a83a","h":"#2e4a8c","c":"#5ae0ff","0":"#a6c0e7","1":"#455f86","2":"#ecc985","3":"#8b6824","4":"#7d8fb8","5":"#1d2e57","#":"#120c08"},"clw"],
    heart: [["......###.......",".....#000####ww.","......#0g0000#w.","......#0gyyyg0#.",".....w#0yoooy1#.","....ww#0yoooy1#.","......#0gyyyyg0#",".......#0gyyg11#","......#2v1111#00",".....#0v3####.##","....#2g1#.....w.","...#0v3#......ww","..#2g1#.........","..#23#..........",".#23#...........","..##............"],{"v":"#d8d4e8","g":"#e8b440","o":"#fffbe0","y":"#ffe27a","w":"#ffffff","0":"#f1d089","1":"#907028","2":"#e7e4f1","3":"#868390","#":"#120c08"},"ow"],
    axe: [["...#0##0000##11#","..#0e02iii3#1w4#","..#0irriiii1w4#.",".##2rirriiih5#..","#02irrirrih5#...",".#2iirrirhh51#..",".#2iiirrhh5##1#.","#0eii3ihh5#..#..",".#0e3#6h5#......","..#0#6h5#.......","...#kk5#........","..#kkkk#........",".#kkkk#.........",".#6kk#..........","#1w5#...........","#14#............"],{"i":"#4e525c","e":"#c8ccd6","r":"#b3261e","h":"#5a3a22","k":"#2a1a10","w":"#e8dcc0","0":"#dddfe6","1":"#f1e9d8","2":"#91949a","3":"#303339","4":"#908877","5":"#382415","6":"#998576","#":"#120c08"}],
    scroll: [["...###########..","..#00000000000#.","..#0qqqqqqqqq1#.",".##0qqqqqqqqq1#.","#2##3ppppppp4#..","#2##3kkkkkkp4#..","#2##3kkkkkpp4#..","#2##3ppppppp4#..","#2##3kkkkkkp4#..","#2##3kkkkppp4#..",".#.#3ppppmmm4#..","...#3ppppmmm4#..","..#0qqqqqqmmq0#.","..#0qqqqqmqmq1#.","..#01111151111#.","...###########.."],{"p":"#ecd9a8","q":"#c9a86a","k":"#7a5a32","m":"#b0242a","0":"#dec9a3","1":"#7d6842","2":"#ffe78f","3":"#f3e7c9","4":"#928768","5":"#6d161a","#":"#120c08"}],
    coin: [["................","........######..",".......#000000w.",".......#0yyyy1#.",".......#0yyyy1#.",".......#2YYYY3#.","..w....#0yyyy1#.",".#######2YYYY3#.","#000000#0yyyy1#.","#0yyyy1#2YYYY3#.","#0yyyy1#0yyyy1#.","#2YYYY3#2YYYY3#.","#0yyyy1#0yyyy1#.","#2YYYY3#2YYYY3#.","#0yyyy1#0yyyy1#.","#233333#233333#."],{"y":"#ffd84a","Y":"#b07a10","w":"#fff6c8","0":"#ffe78f","1":"#9e862e","2":"#cead6b","3":"#6d4c0a","#":"#120c08"},"w"],
    clock: [["...##########...","..#00000c0000#..","..#0ffffff1f1#..","...#0gggg2#01#..","...#02ggg2#01#..","...#0#3yy4#01#..","...#0##34##01#..","...#0##52##01#..","...#0##54##01#..","...#0##54##01#..","...#0#5yy5#01#..","...#05yyy4#01#..","...#0gyyy4#01#..","..#0ffffff0f1#..","..#0ffffcfff1#..","..#0111111111#.."],{"f":"#b07a3a","g":"#bfe3ef","y":"#e8c060","c":"#5ad1ff","0":"#cead85","1":"#6d4c24","2":"#768d94","3":"#f1d89c","4":"#90773c","5":"#d7eef5","#":"#120c08"},"c"],
    boot: [["........#000#...","........#1mm0#..",".......#1bbmm0#.",".....##1bbbbm2#.","....#11bbbbbmm0#","....#1bkggbbbmm0","...#1bbgggbbbbm2","..#1bgggggbbbbm2",".#1gggbbgbbbbbm2",".#1ggbbbgbbbbbm2",".#1kbbbbgbbbbbm2",".#13333bgbbbbbm2","..#####1gbbbbbm2","......#1bbbbbbm2","......#1333333m2",".......#######02"],{"b":"#9a6236","m":"#3a2418","k":"#140c08","g":"#e0a83a","0":"#857770","1":"#c09e82","2":"#24160f","3":"#5f3d21","#":"#120c08"}],
    spring: [["....########....","...#00000000#...","...#0ssssss1#...","...#0ssssss1#...","....#2bbkkk#....","....#2bbb3#.....","....#2bbkkk#....","....#2bbkkk2##..","...#2bbbbbbb00#.","...#2bbbbbbbs1#.","...#kkkkkkkkkkk#","...#kkkkkkkkkkk#","....#0ss1######.","....#oyo1#......",".....#yo#.......","......o........."],{"b":"#2f8a4a","s":"#b8bcc8","k":"#3a2414","o":"#ff7a1a","y":"#ffe27a","0":"#d3d5dd","1":"#72757c","2":"#7eb68f","3":"#1d562e","#":"#120c08"},"oy"],
    gate: [["..####.#........",".#0000#0#.......","#0gg1101#.......","#0g1##01#.......","#01#ccg1#.......","#01#c#01#.......",".#00g0gy#.......","#011111yy#..##..",".######0yy##00#.",".......#0yy0g1#.","........#0yy1#0#",".........#0yy0g0","..........#0yy1#","...........#01#.","............##..","................"],{"g":"#d9a43a","c":"#c03ad0","y":"#fff0a8","0":"#e7c785","1":"#876624","#":"#120c08"},"y"],
    shield: [["..############..",".#000001100000#.",".#0rrrrwwrrrr2#.",".#0fffffffffr2#.",".#0fffffffffr2#.",".#0fffffffffr2#.",".#0fffffffffr2#.",".#0rffffffffr2#.","..#0ffffffff2#..","..#0ffffffff2#..","..#0rffffffr2#..","...#0rffffr2#...","....#0rffr2#....",".....#0rr2#.....","......#02#......",".......##......."],{"r":"#e0a83a","f":"#2c4fa8","w":"#fff2c0","0":"#ecc985","1":"#fff7d8","2":"#8b6824","#":"#120c08"}],
    shieldBad: [["..############..",".#000001100000#.",".#0rrrrwwrrrr2#.",".#0fffffffffr2#.",".#0fffffffffr2#.",".#0fffffffffr2#.",".#0fffffffffr2#.",".#0rffffffffr2#.","..#0ffffffff2#..","..#0ffffffff2#..","..#0rffffffr2#..","...#0rffffr2#...","....#0rffr2#....",".....#0rr2#.....","......#02#......",".......##......."],{"r":"#e0a83a","f":"#8c1c10","w":"#fff2c0","0":"#ecc985","1":"#fff7d8","2":"#8b6824","#":"#120c08"}],
    gear: [[".......##.......","......#00#......","...##.#01#.##...","..#00#0ss0#00#..","..#0s0ssss0s1#..","...#0ssccss1#...",".##0ssc##css0##.","#00ssc#..#css00#","#01ssc#..#css11#",".##0ssc##css1##.","...#0ssccss1#...","..#0s1ssss1s0#..","..#01#0ss1#01#..","...##.#01#.##...","......#01#......",".......##......."],{"s":"#8fa0c0","c":"#5ad1ff","0":"#bac4d8","1":"#596377","#":"#120c08"},"c"],
    hearth: [["................","......####......","....##0000##....","...#00ssss00#...","..#0sssscsss0#..","..#0sssccsss1#..",".#0ssscsccsss0#.",".#0sscsscscss1#.",".#0ssccwwcccs1#.",".#0sscsscscss1#.",".#0ssscsccsss1#.","..#0sssccsss1#..","..#0sssscsss1#..","...#01ssss11#...","....##0111##....","......####......"],{"s":"#8e8e9a","c":"#5ad1ff","w":"#e8fbff","0":"#b9b9c0","1":"#58585f","#":"#120c08"},"cw"],
    loot: [["......####......",".....#0000#.....","....#01##00#....","....#0####0#....","..##0B0000B0#...",".#00BBBBBBBB0#..",".#0BBBBBBBBB1#..",".#0BBBBBBBBB1#..",".#0BBBBggBBB1#..","..#2BBBggBBB3#..","..#2bbbggbbb3#..","..#2bbbggbbb3#..","..#2kkkkkkkk3#..","..#2333333333#..","...##########...","................"],{"b":"#8a5a30","B":"#6a3e1e","g":"#e0a83a","k":"#3a2414","0":"#a38774","1":"#422613","2":"#b6997f","3":"#56381e","#":"#120c08"}],
    sulfuras: [[".......##.......","....#.#rr#.#....",".###r##or##r###.","#000r#roor#o000#","#0dgd0dddd0dgd1#","#0dgoodooooogd1#","#oogdooyyoodgoo#","#0dgdodoododgd1#","#0dg11dddd11gd1#","#011##2gg3##011#",".###..#45#..###.","......#67#......","......#67#......","......#45#......","......#23#......","......#23#......"],{"d":"#3a2a26","g":"#c8901a","r":"#d8381a","o":"#ff8a1a","y":"#ffe27a","0":"#857b78","1":"#241a18","2":"#ddba71","3":"#7c5910","4":"#8f8582","5":"#2e2421","6":"#746d6c","7":"#130c0b","#":"#120c08"},"oy"],
    atiesh: [["......#...#...#.",".....#0#.#0#.#0#",".....#00##0##01#","....#0kk02s20k1#","...#01kkscccsk1#","....##01swwcs11#","......##2cwc3##.","...c...#2ccc3#..",".....##4h333#...","....c24h5###..c.","....#2s5#.......","...#4h33#.......","..#2s5##....c...","..#433#.........",".#45##..........",".#4#............"],{"h":"#3a2a3a","s":"#c8ccd8","k":"#2a2440","c":"#b46cff","w":"#f4e8ff","0":"#7b7789","1":"#1a1628","2":"#dddfe7","3":"#7c7e86","4":"#857b85","5":"#241a24","#":"#120c08"},"cw"],
    ashbringer: [["..........y.###.","...........#000#",".y........#0sff#",".........#0sfs1#",".##.....#0sfs1#.","#22#...#0sfs1#..","#2g2#.#0sfs1#..y",".#2g2#0sfs1#....",".#23g2sfs1#.....","..##2rgf1#......","...#4hr3#.......","..#4h53g2#......",".#4h5##2g2#.....","#2g5#.#23g2#....","#23#...##23#....",".##......##....."],{"s":"#dfe4ee","f":"#ffffff","g":"#e8b440","r":"#d0202e","h":"#3a2a3a","y":"#fff2a8","0":"#ebeef4","1":"#8a8d94","2":"#f1d089","3":"#907028","4":"#857b85","5":"#241a24","#":"#120c08"},"fy"],
    onyxia: [["#00#........#00#","#0h0########0h1#",".#0h22222220h1#.","..#0dddddddd1#..",".#0ddddkkdddd0#.",".#0dkkddddkkd1#.","..#2dkkkdkkd3#..","..#2dedddded3#..","...#2ddkkdd3#...","...#2dddddd3#...","...#2ddkkd3#....","....#2dddd3#....","....#2dkkd3#....",".....#2dd3#.....",".....#wwww#.....","......####......"],{"d":"#3a2e3a","h":"#d8ccb0","e":"#ff8a1a","k":"#140c10","w":"#f4f0e0","0":"#e7dfce","1":"#867e6d","2":"#857d85","3":"#241d24","#":"#120c08"},"e"],
    lotus: [["................",".............c..","..c...#..#......","..#..#0##1#..#c.",".#1##0p01m1##0#.","..#11mppmmp00#..","..#1mmpmmppp2#..",".##0mmpyymmm3##.","#00pppmyymmmm11#",".##0222yymmm3##.","...######455#...","....##6##6#4#...","...#66#..#67#...","..#6##....##6#..","...#........#...","................"],{"p":"#2e1440","m":"#4a2266","y":"#f0d8ff","c":"#c58cff","0":"#7d6d89","1":"#8f76a0","2":"#1d0c28","3":"#2e153f","4":"#ad8fc9","5":"#4c2e68","6":"#7ba385","7":"#1a4224","#":"#120c08"},"cy"],
    crit: [["................",".......##.......","...#..#00#..#...","..#0###01###0#..","...#y0#01#0y#...","...#0y0yy0y1#...","..###0yyyy1###..",".#000yywwyy000#.",".#011yywwyy111#.","..###0yyyy1###..","...#0y1yy1y0#...","...#y1#01#0y#...","..#0###01###0#..","...#..#01#..#...",".......##.......","................"],{"y":"#ffe27a","w":"#ffffff","0":"#ffb671","1":"#9e5610","#":"#120c08"},"wy"],
    tomb: [["................",".....######.....","....#000000#....","...#0gggggg0#...","...#0ggkkgg1#...","...#0kkkkkk1#...","..#0gkkkkkkg0#..","..#0gggkkggg1#..","..#0gggkkggg1#..","..#0gggkkggg1#..","..#0gggggggg1#..","..#0gggggggg1#..",".##0gggggggg1##.","#22vvvvvvvvvv22#","#23333333333333#",".##############."],{"g":"#9a9aa6","k":"#3a3a48","v":"#4a8a3a","0":"#c0c0c8","1":"#5f5f67","2":"#8fb685","3":"#2e5624","#":"#120c08"}],
    ghost: [["......####......",".....#0000#.....","....#0wwww0#....","...#0wwwwww0#...","..#0wwwwwwww0#..","..#0wkkwwkkw1#..","..#0wkkwwkkww0#.","..#0wkkwwkkww1#.","..#0wwwwwwwww1#.","..#0wwwkkwwww1#.","..#0wwwkkwwww1#.","..#0wwwwwwwww1#.","..#011ww11www1#.","..#0##01##0111#.","...#..##..####..","................"],{"w":"#cfe8ff","k":"#1a2a4a","0":"#e1f1ff","1":"#80909e","#":"#120c08"}],
    feather: [["...........####.","..........#0000#",".........#0fff1#","........#0ffhf1#",".......###0hhf1#","......#000hhf1#.",".....#0ffhhf1#..",".....##0hhf1#...","....#00hh11#....","...#0fhh1##.....","..#0fhhf1#......",".#0fhhf1#.......",".#0hhf1#.....b..",".#2311#.......b.",".#2###.....b....","..#............."],{"f":"#f0f0f4","h":"#a07850","b":"#a8d0ff","0":"#f6f6f8","1":"#959597","2":"#c4ab92","3":"#634a32","#":"#120c08"},"b"],
    dice: [["................","..############..",".#000000000000#.",".#0wwwwwwwwww1#.",".#0wkkwwwwkkw1#.",".#0wkkwwwwkkw1#.",".#0wwwwwwwwww1#.",".#0wwwwrrwwww1#.",".#0wwwwrrwwww1#.",".#0wwwwwwwwww1#.",".#0wkkwwwwkkw1#.",".#0wkkwwwwkkw1#.",".#0wwwwwwwwww1#.",".#011111111111#.","..############..","................"],{"w":"#efe8d8","k":"#2a1a1a","r":"#b0242a","0":"#f5f1e7","1":"#949086","#":"#120c08"}],
    wing: [["..........####00",".....#####0000b1","....#00000bbbbb1","..##0bbbbbbwwww2",".#00bbbwwwwwwww2","#0bbbwwwwwwwwww2","0bbbwwwwwwwwwww2","01ww2wwwwww2wwg3","##42#4w2ww2#4wg3",".#42#42#4w2#4w33","#5g3#42#4w2#53#5","#5g3#53#4w2#53##","#5g3#53#5g3#53#.",".#5##53#5g3#53#.","..#.#53#5g3###..",".....##.#5#....."],{"w":"#f4ecd8","g":"#d9a43a","b":"#8a6a3a","0":"#b6a385","1":"#564224","2":"#979286","3":"#876624","4":"#f8f3e7","5":"#e7c785","#":"#120c08"}],
    speech: [["................","..############..",".#000000000000#.","#0wwwwwwwwwwww0#","#0wwwwwwwwwwww1#","#0wwwwwwwwwwww1#","#0wwkkwkkwkkww1#","#0wwkkwkkwkkww1#","#0wwwwwwwwwwww1#","#0wwwwwwwwwwww1#","#0wwwwwwwwwwww1#",".#0www11111111#.","..#0w1########..","..#01#..........","...##...........","................"],{"w":"#e8e6e1","k":"#3a3a48","0":"#f1f0ec","1":"#908f8c","#":"#120c08"}],
    flag: [["...##...........","..#00#########..","..#0h111111111#.","..#0hwwwwwww2#..","..#0hwwwwwww2#..","..#0hwwwwww2#...","..#0hwwwwwww1#..","..#0h222222221#.","..#03#########..","..#03#..........","..#03#..........","..#03#..........","..#03#..........","..#03#..........","..#03#..........","..#03#.........."],{"h":"#8a5a2a","w":"#f4f4f0","0":"#b6997b","1":"#f8f8f6","2":"#979795","3":"#56381a","#":"#120c08"}],
    bandage: [["..........#####.",".........#00000#","........#0wwww1#",".......#0wwwww1#","......#0wwwwww1#",".....#0rrwwwww1#","....#0wrrwwww1#.","...#0rrrrrrw1#..","..#0wrrrrrr1#...",".#0wwwwrrw1#....","#0wwwwwrr1#.....","#0wwwwww1#......","#0wwwww1#.......","#0wwww1#........","#01111#.........",".#####.........."],{"w":"#f0e8d8","r":"#c8242a","0":"#f6f1e7","1":"#959086","#":"#120c08"}],
    zzz: [["00000#..........","01cc1#..........","##01#...........","#01##...........","01100#..........","#####..########.","......#00000000#","......#0ccccccc0","......#0111ccc1#",".......####0c1#.",".........#0c1#..","........#0c1#...",".......#0c1#####","......#0ccc00000","......#011111111",".......#########"],{"c":"#a8d0ff","0":"#c9e2ff","1":"#68819e","#":"#120c08"}],
    bunny: [["....#0#..#0#....","...#0b0##0b0#...","...#0p1##0p1#...","...#0p1##0p1#...","...#0p1##0p1#...","...#0p1##0p1#...","...#0pb00bp1#...","...#0bbbbbb1#...","...#0bbbbbb1#...","..#0bkbbbbkb0#..","..#0bbbbbbbb1#..","..#0bbbppbbb1#..","...#0bbbbbb1#...","...#0bbbbbb1#...","....#011111#....",".....######....."],{"b":"#b8a088","p":"#f0a0b0","k":"#1a1010","0":"#d3c4b5","1":"#726354","#":"#120c08"},"p"],
    anvil: [["................","..........y....y","............y...","..............y.",".###########....","#00000000000###.","#0iiiiiiiiii000#",".#0111iiii11###.","..####0ii1##....",".....#0ii1#.....",".....#0ii1#.....","...##0iiii0#....","..#00iiiiii0#...","..#011111111#...","...#########....","................"],{"i":"#6a6e78","y":"#ffd84a","0":"#a3a5ab","1":"#42444a","#":"#120c08"},"y"],
    map: [["................","................",".##############.","#000001111r0r00#","#0ppppqqqqrrrp2#","#0ppppqqqqrrrp2#","#0ppppqqqqrprp2#","#0ppppqqqrpppp2#","#0ppppqrqqpppp2#","#0ppprqqqqpppp2#","#0ppppqqqqpppp2#","#0prppqqqqpppp2#","#0ppppqqqqpppp2#","#02222333322222#",".##############.","................"],{"p":"#ecd9a8","q":"#c9a86a","r":"#c8242a","0":"#f3e7c9","1":"#dec9a3","2":"#928768","3":"#7d6842","#":"#120c08"}],
    meat: [["................",".......#####....",".....##00000##..","....#00mmmmm00#.","....#0mmmmmmm1#.","...#0mmmmmmmmm0#","...#0mmmmmmmmm1#","...#0mmmmmmmmm1#","....#0mmmmmmm1#.","....#0mmmmmm11#.",".###2w311111##..","#222w3######....","#2ww3#..........","#2w3#...........",".#2w2#..........","..#2#..........."],{"m":"#b0502a","w":"#efe6d4","0":"#ce927b","1":"#6d321a","2":"#f5f0e4","3":"#948f83","#":"#120c08"}],
    warrior: [["..#..........#..",".#0#........#0#.","#0s0#......#0s0#",".#0s0#....#0s1#.","..#0s0#..#0s1#..","...#0s0##0s1#...","....#0s00s1#....",".....#0ss1#.....",".....#0ss1#.....","..###0s11s0###..",".#220s1##0s022#.",".#2hh1#..#0hh3#.",".#4hh3#..#2hh5#.",".#2533#..#2353#.","..####....####..","................"],{"s":"#c8ccd8","h":"#5a3a22","0":"#dddfe7","1":"#7c7e86","2":"#dcc2a5","3":"#7b6144","4":"#998576","5":"#382415","#":"#120c08"}],
    paladin: [["..###...p...##..",".#000#######00#.",".#0gg0000000g1#.",".#0ggggwwgggg1#.",".#0ggggwwgggg1#.",".#0gggggggggg1#.",".#01111ss11111#.","..#####23#####..","......#23#......",".p....#23#....p.","....p.#23#......","......#23#.p....","......#23#......","......#0g0#.....","......#011#.....",".......###......"],{"g":"#e8c050","s":"#d8dce4","w":"#fffbe0","p":"#f58cba","0":"#f1d892","1":"#907732","2":"#e7e9ee","3":"#86888d","#":"#120c08"},"pw"],
    hunter: [["....##..........","...#w0#.........","...#w10#........","...#w##0#.......","...#w##00#......","...#w#.#0#......","..##w###00####..",".#23a333aa3344#.",".#25a555aa5566#.","..##w###78####..","...#w#.#0#......","...#w##01#......","...#w##0#.......","...#w00#........","...#w1#.........","....##.........."],{"a":"#c8a070","w":"#e8e6e1","0":"#b6997b","1":"#56381a","2":"#dd897b","3":"#ddc4a6","4":"#dddfe7","5":"#7c6345","6":"#7c7e86","7":"#85776d","8":"#24160c","#":"#120c08"}],
    rogue: [["..#..#....#..#..",".#0##1#..#1##0#.",".#0112#..#1113#.","..#1k4#..#5k2#..",".#12s4#..#5s21#.",".#1#5s5##5s4#1#.","..#.#5s55s4#.#..",".....#5ss4#.....",".....#5ss4#.....","....#5s44s5#....","...#5s4##5s5#...","..#5s4#..#5s5#..",".#5s4#....#5s5#.","..#5#......#5#..","..p#........#.p.","..p...........p."],{"s":"#d0d4de","k":"#2a2228","p":"#7dff5a","0":"#fff9a2","1":"#7b767a","2":"#1a1519","3":"#9e9841","4":"#81838a","5":"#e2e4eb","#":"#120c08"},"p"],
    priest: [["......#00#......","......#01#......","....#.#01#.#....","...#0##01##0#...","..#0g0#01#0g0#..","...#0g2yy2g1#...","#####2ywwy3#####","00000ywwwwy00000","01111yywwyy11111","#####2ywwy3#####","...#0g3yy3g0#...","..#0g1#01#0g0#..","...#0##01##0#...","....#.#01#.#....","......#01#......","......#01#......"],{"g":"#ffd84a","y":"#fff2b0","w":"#ffffff","0":"#ffe78f","1":"#9e862e","2":"#fff7ce","3":"#9e966d","#":"#120c08"},"w"],
    shaman: [["..##.######.##..",".#00#111111#00#.",".#0r0hhhhhh0r2#.",".#0rrhkkkkhr2##.","#0222hkkkkh2200#",".####1hkkh3####.","....#1hhhh3#....","....#4bbbb5#....","....#1hhhh3#....","....#1kkkk3#....","....#1hhhh3#....","....#1hkkh3#....","....#4bbbb5#....","....#4bbbb5#....","...#1hhhhhh1#...","...#13333333#..."],{"h":"#8a5a2a","b":"#0070de","r":"#c8402a","k":"#2a1a10","0":"#dd897b","1":"#b6997b","2":"#7c281a","3":"#56381a","4":"#61a6eb","5":"#00458a","#":"#120c08"}],
    mage: [["..............c.",".........###....","........#000#...",".......#0b1#...c","......#0byy#....","......#0by#.....",".....#0bb1#.....","..c..#0yy1#.....",".....#0byb0#....","....#0bbbb1#....","..###2ggggg2##..",".#000ggggggg00#.","#0bbbbbbbbbbbb0#",".#011111111111#.","..############..","................"],{"b":"#2a4fb0","g":"#e0a83a","y":"#ffe27a","c":"#69ccf0","0":"#7b92ce","1":"#1a316d","2":"#ecc985","#":"#120c08"},"cy"],
    warlock: [["........#.......",".......#P#......","...f..#0P#...f..","..f..#0pP0#.....","....#0ppPp0#....","....#PPpPPPP#...","....#0PPPP1#....","....#0ccPp1#.f..","....#0ccPp1#....","....#0ppPp1#....","....#0ppPp1#.f..","..f..#0pP1#.....",".....#0pP1#.....",".....#01P1#.....","......####......","................"],{"p":"#7a3ad0","P":"#4a1a8a","c":"#c58cff","f":"#8cff4a","0":"#ad85e2","1":"#4c2481","#":"#120c08"},"cf"],
    druid: [["................","....###..###....","...#000##000#...","...#0b1##0b1#...",".###011##011###.","#000###..###000#","#0b1#......#0b1#","#011########011#",".####000000####.","...#0bbbbbb0#...","...#0bbbbbb1#...","...#0bbbbbb1#...","...#0bbbbbb1#...","....#011111#....",".....######.....","................"],{"b":"#b8662a","0":"#d3a07b","1":"#723f1a","#":"#120c08"}],
    crest: [["......#yy#......", ".######hh######.", ".#gggg#hh#gggg#.", ".#gr#yyyyyy#rg#.", ".#gr###ss###rg#.", ".#grrr#sw#rrrg#.", ".#grrr#sw#rrrg#.", ".#grrr#sw#rrrg#.", ".#grrr#sw#rrrg#.", ".#grrr#sw#rrrg#.", "..#grr#sw#rrg#..", "..#ggr#sw#rgg#..", "...#gg#sw#gg#...", "....#g#ss#g#....", ".....##ss##.....", ".......##......."], { "#": "#000", g: "#ffb02e", r: "#8c1c10", y: "#ffd27a", h: "#6b3e1d", s: "#b8c4cc", w: "#fff" }],
    // the gold dragon sitting on the top-right border of Hall of Fame cards (drawn for this site, after the elite frame).
    // Its body's centre row is 6 sprite pixels from the top and 14 from the right: .rec .elite lines that up with the rim.
    elite: [[".............#........................................", "............#y######.#.##.##.#.##.....................", "...........#yd#yyyyy#y#yy#yy#y#yy#....############....", "..........#yggygggggygyggyd#ygybd#...#yyyyyyyyyyyy#...", ".#########yggggggggggggggggyggggby####yggggggddd##....", "#yyyyyyyyrggggggggggggggggggggggggyyyygggggbdbd#......", ".#ydddgggggggggggggggggggggggggggggggggggggggyyy###...", "..####yggggbggbbbbbbbbbbbbbbbbbbbbbbgggggggggddbyyy##.", "....##ybbbbdbbggddddddddddddddddddddbbgggggbddbydddyy#", "...#yyddddd#ydbd####################ybbgggggbydb###y#.", "....#######.##yd#...................#ybgggggdbyy#..#..", "..............##....................#ybgggbddybby#....", "....................................#ybgggbbydybby#...", ".....................................#bgggdbdbdydby#..", ".....................................#bgbdbybybd#yby#.", ".....................................#bgbddybbyb##ydy#", ".....................................#bggbydybd#..##yy", ".....................................#bggbdbdyby#...##", ".....................................#ybgbddbdyd#.....", ".....................................#ybgbd###yby#....", ".....................................#ybgbd#..#yd#....", ".....................................#ybggby#..#yy#...", ".....................................#ybggbd#..#yby#..", ".....................................#ybggbd#...#yd#..", ".....................................#ygggdd#....#yy#.", ".....................................#ygbd#yy#...#yd#.", ".....................................#ygbd#yd#....##..", ".....................................#ygggydd#........", ".....................................#ygbd##y#........", ".....................................#ygbd#.#.........", ".....................................#yggby#..........", ".....................................#ygbd#...........", ".....................................#ygbd#...........", ".....................................#yggdy#..........", ".....................................#ybd##...........", ".....................................#ybd#............", ".....................................#ybd#............", ".....................................#ybd#............", ".....................................#ybd#............", ".....................................#ybd#............", ".....................................#ybd#............", "......................................#y#.............", "......................................#y#.............", ".......................................#.............."], { "#": "#2a1800", y: "#ffe58a", g: "#e8b440", b: "#c08a28", d: "#8a5810", r: "#ff3b1f" }, "r"],
    // Coins for gold, silver and copper (hand-drawn, 8x8).
    coinG: [["..####..",".#hlll#.","#hllmmd#","#llmmmd#","#lmmmmd#","#mmmmdd#",".#dddd#.","..####.."],{"#":"#5a3a00","h":"#fff6c8","l":"#ffe27a","m":"#ffc72e","d":"#c8901a"}],
    coinS: [["..####..",".#hlll#.","#hllmmd#","#llmmmd#","#lmmmmd#","#mmmmdd#",".#dddd#.","..####.."],{"#":"#33363e","h":"#ffffff","l":"#e8ebf2","m":"#c3c7d3","d":"#8a90a0"}],
    coinC: [["..####..",".#hlll#.","#hllmmd#","#llmmmd#","#lmmmmd#","#mmmmdd#",".#dddd#.","..####.."],{"#":"#4a2410","h":"#ffd2b0","l":"#f0a070","m":"#d07a40","d":"#9a4f22"}],
  };
  SPRITES.grave = SPRITES.tomb; // the pixel gravestone, for icon(): WOWICON's "tomb" is a ghoul's face
  function sprite(name, px = 3) {
    const [rows, pal, glow = ""] = SPRITES[name]; // glow: colours that twinkle (see the Motion CSS)
    const w = rows[0].length, hgt = rows.length;
    let rects = "";
    rows.forEach((r, y) => [...r].forEach((ch, x) => { if (pal[ch]) rects += `<rect x="${x}" y="${y}" width="1" height="1" fill="${pal[ch]}"${glow.includes(ch) ? ' class="gl"' : ""}/>`; }));
    return `<svg class="sprite" width="${w * px}" height="${hgt * px}" viewBox="0 0 ${w} ${hgt}" shape-rendering="crispEdges" aria-hidden="true">${rects}</svg>`;
  }
  // Real game icons (Wowhead's icon server) for the content; the pixel sprites stay for navigation and as the fallback.
  const WOWICON = {
    skull: "inv_misc_bone_humanskull_01", sword: "inv_sword_04", heart: "spell_holy_flashheal", axe: "inv_axe_02",
    scroll: "inv_misc_note_01", coin: "inv_misc_coin_01", clock: "inv_misc_pocketwatch_01", boot: "inv_boots_01",
    spring: "spell_magic_featherfall", gate: "inv_misc_key_04", shield: "inv_shield_06", hearth: "inv_misc_rune_01",
    loot: "inv_misc_bag_10", sulfuras: "inv_hammer_unique_sulfuras", atiesh: "inv_staff_medivh", ashbringer: "inv_sword_2h_artifactashbringer_d_01",
    onyxia: "inv_misc_head_dragon_01", lotus: "inv_misc_herb_blacklotus", crit: "ability_criticalstrike", tomb: "spell_shadow_raisedead",
    ghost: "spell_holy_resurrection", feather: "spell_magic_featherfall", dice: "inv_misc_dice_01", wing: "ability_mount_wyvern_01",
    speech: "inv_letter_15", flag: "inv_bannerpvp_02", bandage: "inv_misc_bandage_15", zzz: "spell_nature_sleep",
    bunny: "spell_magic_polymorphrabbit", anvil: "trade_blacksmithing", map: "inv_misc_map_01", meat: "inv_misc_food_14",
    horde: "inv_bannerpvp_01", alliance: "inv_bannerpvp_02",
  };
  const zam = (file, size) => `<img class="wicon" src="https://wow.zamimg.com/images/wow/icons/large/${file}.jpg" width="${size}" height="${size}" alt="" loading="lazy">`;
  const icon = (name, px = 2) => WOWICON[name] ? zam(WOWICON[name], px * 16) : sprite(name, px);

  // Horde or Alliance, from Blizzard's crest when there is one, else from the members' races (most of them wins).
  const HORDE = new Set(["Orc", "Scourge", "Tauren", "Troll", "BloodElf", "Goblin"]);
  const ALLIANCE = new Set(["Human", "Dwarf", "NightElf", "Gnome", "Draenei", "Worgen"]);
  const crestOf = (realm, guild) => ((state.data && state.data.crests) || {})[`${String(realm).split("|").pop()}|${guild}`.toLowerCase()];
  function factionOf(list, crest) {
    const f = String(crest && crest.faction || "").toLowerCase();
    if (f === "horde" || f === "alliance") return f;
    const h = list.filter(c => HORDE.has(c.race)).length, a = list.filter(c => ALLIANCE.has(c.race)).length;
    return h || a ? (h >= a ? "horde" : "alliance") : "";
  }
  // Only Blizzard's render server and plain rgba() colours make it into the page.
  const blizzImg = u => typeof u === "string" && /^https:\/\/render\.worldofwarcraft\.com\/[\w\-./]+$/.test(u) ? u : "";
  const rgbaOk = c => typeof c === "string" && /^rgba\(\d{1,3},\d{1,3},\d{1,3},[\d.]+\)$/.test(c) ? c : "";
  // The guild's in-game tabard: Blizzard's emblem and border, tinted with the guild's colours. Without one, the faction banner.
  function guildCrest(realm, guild, list, size) {
    const c = crestOf(realm, guild);
    const em = c && c.emblem && blizzImg(c.emblem.img), bo = c && c.border && blizzImg(c.border.img);
    const fac = factionOf(list, c);
    if (!em) return `<span class="tabard plain">${zam(WOWICON[fac] || WOWICON.shield, size)}</span>`;
    return `<span class="tabard" style="--s:${size}px;--bg:${rgbaOk(c.bg) || "#2a2a2a"};--ec:${rgbaOk(c.emblem.color) || "#fff"};--bc:${rgbaOk(c.border && c.border.color) || "#c9a24a"}">`
      + (bo ? `<i class="tb-b" style="--m:url('${bo}')"></i>` : "") + `<i class="tb-e" style="--m:url('${em}')"></i></span>`;
  }

  // The crest picks up the current theme's colours.
  function crestHTML(px = 7) {
    SPRITES.crest[1] = { "#": "#000", g: css("--accent") || "#ffb02e", r: css("--accent2") || "#8c1c10", y: "#ffd27a", h: "#6b3e1d", s: "#b8c4cc", w: "#fff" };
    return sprite("crest", px);
  }

  // ---------- rendering helpers ----------
  // Routes: #/c/<Name-Realm> character page, #/g/<game|realm>/<guild> guild page, anything else the realm page.
  const decodePart = s => { try { return decodeURIComponent(s); } catch (e) { return s; } };
  function parseRoute() {
    let m = location.hash.match(/^#\/(?:c|p)\/(.+)$/);
    if (m) return { kind: "char", key: decodePart(m[1]) };
    m = location.hash.match(/^#\/g\/([^/]+)\/(.+)$/);
    if (m) return { kind: "guild", realm: decodePart(m[1]), guild: decodePart(m[2]) };
    return { kind: "main" };
  }
  const charHref = key => "#/c/" + encodeURIComponent(key);
  const profileHref = p => charHref(p.id);
  const guildHref = (realm, guild) => "#/g/" + encodeURIComponent(realm) + "/" + encodeURIComponent(guild);
  const guildLink = ch => ch.guild ? `<a class="glink" href="${guildHref(realmKey(ch), ch.guild)}">&lt;${esc(ch.guild)}&gt;</a>` : "";
  // Works for a person or a single character: both carry .fallen on Hardcore realms.
  const ripHTML = (p, px = 1) => p.fallen ? `<span class="rip" title="${tr("Fallen")}" aria-label="${tr("Fallen")}">${sprite("tomb", px)}</span>` : "";
  // Where only text fits (chart labels, dropdowns, tooltips).
  const nameTxt = p => (p.fallen ? "🪦 " : "") + p.name;
  const nameHTML = p => p.id
    ? `<a class="plink" href="${profileHref(p)}"><span class="dot" style="background:${p.color || classOf(p)[1]}"></span><span class="cname" style="--cc:${p.color || classOf(p)[1]}">${esc(p.name)}</span>${ripHTML(p)}</a>`
    : `<span class="dot" style="background:${p.color || classOf(p)[1]}"></span><span class="cname" style="--cc:${p.color || classOf(p)[1]}">${esc(p.name)}</span>${ripHTML(p)}`;
  const rangeLabel = () => state.view === "all" ? tr("All time") : tr("Week of {0} – {1}", shortDate(state.week), shortDate(addDays(state.week, 6)));

  function renderWeekSelect(people) {
    const weeks = weeksAvailable(people);
    const cur = weekOf(todayKey());
    if (!weeks.includes(cur)) weeks.push(cur);
    weeks.sort();
    state.firstWeek = weeks[0];
    if (!state.userPickedWeek || !state.week) {
      const withData = weeksAvailable(people);
      state.week = withData.includes(cur) || !withData.length ? cur : withData[withData.length - 1];
    }
    // One menu: this week, last week, earlier weeks by date, then all time.
    const label = w => w === cur ? tr("This week") : w === addDays(cur, -7) ? tr("Last week") : `${shortDate(w)} – ${shortDate(addDays(w, 6))}`;
    const sel = $("weekSel");
    sel.innerHTML = weeks.slice().reverse().map(w => `<option value="${w}">${esc(label(w))}</option>`).join("")
      + `<option disabled>──────</option><option value="all">${esc(tr("All time"))}</option>`;
    sel.value = state.view === "all" ? "all" : state.week;
    const idx = weeks.slice().reverse().indexOf(state.week);
    $("prevWeek").disabled = state.view === "all" || idx >= weeks.length - 1;
    $("nextWeek").disabled = state.view === "all" || idx <= 0;
  }

  const tileHTML = ([ic, l, v, f, mod]) => `<div class="frame tile${mod ? " " + mod : ""}"><span class="ticon">${icon(ic, 2)}</span><span class="tbody"><span class="lbl">${l}</span><span class="val">${v}</span><span class="foot">${f || ""}</span></span></div>`;
  function renderTiles(rows, people) {
    const t = {};
    rows.forEach(r => Object.entries(r.s).forEach(([k, v]) => { if (typeof v === "number") t[k] = (t[k] || 0) + v; }));
    let deathsN = 0;
    people.forEach(p => p.deaths.forEach(d => { if (d.t && inRange(localKey(d.t))) deathsN++; }));
    const kills = {};
    if (state.view === "all") people.forEach(p => Object.entries(p.kills).forEach(([m, c]) => kills[m] = (kills[m] || 0) + c));
    const topKill = Object.entries(kills).sort((a, b) => b[1] - a[1])[0];
    const tiles = [
      ["skull", tr("Deaths"), num(Math.max(deathsN, t.deaths || 0)), state.hc ? tr("{0} of {1} fallen", num(people.filter(p => p.fallen).length), num(people.length)) : t.ghost ? tr("{0} as ghosts", dur(t.ghost)) : "", state.hc && people.some(p => p.fallen) ? "dead" : ""],
      ["sword", tr("Damage dealt"), compact(t.dmg), t.hits ? tr("{0} hits, {1} crits", num(t.hits), pct((t.crits || 0) / t.hits)) : ""],
      ["heart", tr("Healing done"), compact(t.heal), t.overheal ? tr("{0} overhealed", compact(t.overheal)) : ""],
      ["axe", tr("Killing blows"), num(t.kb), topKill ? `${num(topKill[1])}× ${esc(topKill[0])}` : ""],
      ["scroll", tr("Quests completed"), num(t.quests), t.xp ? tr("{0} XP earned", compact(t.xp)) : ""],
      ["coin", tr("Gold looted"), goldHTML(t.goldIn), t.goldOut ? tr("spent {0}", goldHTML(t.goldOut)) : ""],
      ["clock", tr("Time played"), dur(t.played), t.together ? tr("{0} grouped up", dur(t.together)) : ""],
      ["boot", tr("Distance"), yards(t.dist), t.dist ? tr("about {0} miles", num(LANG === "sv" ? t.dist * 0.0009144 : t.dist / 1760)) : ""],
      ["spring", tr("Jumps"), num(t.jumps), t.played ? tr("{0} per hour", num((t.jumps || 0) / Math.max(1, t.played / 3600))) : ""],
      ["gate", tr("Dungeon runs"), num(t.dungeons), t.hearth ? tr("{0} hearthstones", num(t.hearth)) : ""],
    ];
    // Stats nobody has touched yet are left out; deaths always show (zero deaths is worth bragging about).
    const raw = [1, t.dmg, t.heal, t.kb, t.quests, t.goldIn, t.played, t.dist, t.jumps, t.dungeons];
    $("tiles").innerHTML = tiles.filter((_, i) => raw[i]).map(tileHTML).join("");
  }

  const ACH = [
    { t: "Spirit Healer's Regular", i: "skull", pts: 10, k: s => s.deaths, v: s => tr("Died {0} times", num(s.deaths)), shame: true },
    { t: "Big Pumper", i: "sword", pts: 50, k: s => s.dmg, v: s => tr("Dealt {0} damage", num(s.dmg)) },
    { t: "Lifebinder", i: "heart", pts: 50, k: s => s.heal, v: s => tr("Healed {0}", num(s.heal)) },
    { t: "Executioner", i: "axe", pts: 25, k: s => s.kb, v: s => tr("{0} killing blows", num(s.kb)) },
    { t: "One-Hit Wonder", i: "sulfuras", pts: 25, k: s => s.maxHit, v: s => tr("Hit for {0} with {1}", num(s.maxHit), esc(s.maxHitSpell || tr("something"))) }, // the target is on the Hardest hit card
    { t: "Critical Mass", i: "crit", pts: 25, k: s => s.hits >= 100 ? s.critRate : 0, v: s => tr("{0} of hits were crits", pct(s.critRate)) },
    { t: "Overkill", i: "tomb", pts: 10, k: s => s.overkill, v: s => tr("{0} damage past dead", num(s.overkill)) },
    { t: "Gravity's Favorite", i: "feather", pts: 10, k: s => (s.deaths_fall || 0) * 1e6 + (s.fallDmg || 0), v: s => s.deaths_fall ? tr("{0} deaths from falling", num(s.deaths_fall)) : tr("Took {0} fall damage", num(s.fallDmg)), shame: true },
    { t: "Professional Ghost", i: "ghost", pts: 10, k: s => s.ghost, v: s => tr("Spent {0} dead", dur(s.ghost)), shame: true },
    { t: "Meat Shield", i: "meat", pts: 25, k: s => s.taken, v: s => tr("Took {0} damage", num(s.taken)) },
    { t: "Untouchable", i: "rogue", pts: 25, k: s => (s.dodges || 0) + (s.parries || 0) + (s.blocks || 0), v: s => tr("Dodged, parried or blocked {0} attacks", num((s.dodges || 0) + (s.parries || 0) + (s.blocks || 0))) },
    { t: "Life Support", i: "bandage", pts: 10, k: s => s.healedBy, v: s => tr("Needed {0} healing from friends", num(s.healedBy)), shame: true },
    { t: "Loremaster", i: "scroll", pts: 25, k: s => s.quests, v: s => tr("{0} quests turned in", num(s.quests)) },
    { t: "Bunny Hopper", i: "bunny", pts: 10, k: s => s.jumps, v: s => tr("{0} jumps", num(s.jumps)) },
    { t: "Explorer", i: "map", pts: 25, k: s => s.dist, v: s => tr("{0} yards on foot", num(s.dist)) },
    { t: "Goblin Tycoon", i: "coin", pts: 25, k: s => s.goldIn, v: s => tr("Looted {0}", goldHTML(s.goldIn)) },
    { t: "Repair Bill", i: "anvil", pts: 10, k: s => s.repair, v: s => tr("Paid {0} in repairs", goldHTML(s.repair)), shame: true },
    { t: "Apology Tour", i: "flag", pts: 10, k: s => s.sorry, v: s => tr("Said sorry {0} times", num(s.sorry)), shame: true },
    { t: "Chatterbox", i: "speech", pts: 10, k: s => s.msgs, v: s => tr("{0} chat messages", num(s.msgs)) },
    { t: "Loot Goblin", i: "lotus", pts: 25, k: s => s.loot, v: s => tr("{0} rare or better drops", num(s.loot)) },
    { t: "Vendor Trash Collector", i: "loot", pts: 10, k: s => s.q0, v: s => tr("{0} grey items looted", num(s.q0)) },
    { t: "Lucky Roller", i: "dice", pts: 10, k: s => s.rolls >= 3 ? s.avgRoll : 0, v: s => tr("Averaged {0} over {1} rolls", dec(s.avgRoll, 1), s.rolls) },
    { t: "Duelist", i: "warrior", pts: 25, k: s => s.duelsWon, v: s => tr("Won {0} duels", num(s.duelsWon)) },
    { t: "Dungeon Crawler", i: "gate", pts: 25, k: s => s.dungeons, v: s => tr("{0} dungeon runs", num(s.dungeons)) },
    { t: "Frequent Flyer", i: "wing", pts: 10, k: s => s.taxi, v: s => tr("{0} on flight paths", dur(s.taxi)) },
    { t: "Professional AFK", i: "zzz", pts: 10, k: s => s.afk, v: s => tr("{0} away from keyboard", dur(s.afk)), shame: true },
  ];
  // Each achievement shows its icon in a frame coloured by how big it is: gold, silver or copper (red for shame).
  const TIER = { 50: "gold", 25: "silver", 10: "copper" };
  const achIcon = a => `<div class="achic ${a.shame ? "shame" : TIER[a.pts]}">${icon(a.i, 2)}</div>`;
  // On the overview the frame shows the winner's face instead (their class icon until it loads, or without one).
  function achFace(a, p) {
    const ch = (state.allChars || []).find(c => c.key === p.id);
    if (!ch || (!ch.avatar && !CLASS[ch.class])) return achIcon(a);
    const alt = CLASS[ch.class] ? classIcon(ch, 2) : icon(a.i, 2);
    const face = ch.avatar ? `<canvas class="face" width="32" height="32" data-src="${esc(ch.avatar)}" role="img" aria-label="${esc(ch.name)}"></canvas><span class="alt" hidden>${alt}</span>` : alt;
    const tier = a.shame ? "shame" : TIER[a.pts];
    return `<div class="achwrap"><div class="achic ${tier}">${face}</div><span class="achbadge ${tier}">${icon(a.i, 1)}</span></div>`;
  }

  function renderAchievements(rows) {
    const cards = [];
    for (const a of ACH) {
      let best = 0, winners = [];
      for (const r of rows) {
        const v = a.k(r.s) || 0;
        if (v > best) { best = v; winners = [r]; } else if (v === best && v > 0) winners.push(r);
      }
      if (!best) continue;
      const w = winners[0];
      cards.push(`<div data-pts="${a.pts}" class="ach${a.shame ? " shame" : ""}">${achFace(a, w.p)}
        <div><div class="t">${tr(a.t)}</div><div class="who">${nameHTML(w.p)}${winners.length > 1 ? `<span class="muted" style="font-weight:400;font-size:13px">${tr("+{0} tied", winners.length - 1)}</span>` : ""}</div><div class="d">${a.v(w.s)}</div></div></div>`);
    }
    const played = rows.filter(r => (r.s.played || 0) >= 3600);
    if (played.length > 1) {
      const min = Math.min(...played.map(r => r.s.deaths || 0));
      const w = played.find(r => (r.s.deaths || 0) === min);
      cards.splice(1, 0, `<div data-pts="50" class="ach">${achFace({ i: "paladin", pts: 50 }, w.p)}<div><div class="t">${tr("Unkillable")}</div><div class="who">${nameHTML(w.p)}</div>
        <div class="d">${tr("{0} in {1}", min ? tr("Only {0} deaths", num(min)) : tr("Didn't die once"), dur(w.s.played))}</div></div></div>`);
    }
    // Biggest achievements first (the sort keeps the list order among equals).
    const pts = c => +c.match(/data-pts="(\d+)"/)[1];
    cards.sort((a, b) => pts(b) - pts(a));
    const none = `<p class="empty">${tr("No achievements yet. They appear as soon as someone uploads.")}</p>`;
    $("achievements").innerHTML = cards.slice(0, OVERVIEW_CARDS).join("") || none;
    $("achAll").innerHTML = cards.join("") || none;
    drawFaces($("achievements"));
    drawFaces($("achAll"));
    carUpdateAll();
  }
  document.addEventListener("click", e => {
    const j = e.target.closest("[data-jump]");
    if (!j) return;
    $("recNews").open = false;
    if (j.dataset.jump === "s-glory-fame") { state.sub.glory = "s-glory-fame"; setPage("glory"); }
    $(j.dataset.jump).scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
  });

  function renderMeter(rows) {
    const m = METRICS.find(x => x.k === state.metric) || METRICS[0];
    const rate = state.perHour && !m.noRate;
    $("meterTitle").textContent = rate ? tr("{0} / hour", tr(m.label)) : tr(m.label);
    const val = r => { const v = r.s[m.k] || 0; return rate ? v / Math.max(1, (r.s.played || 0) / 3600) : v; };
    const sorted = rows.slice().sort((a, b) => val(b) - val(a));
    const max = Math.max(1e-9, ...sorted.map(val));
    const total = sorted.reduce((a, r) => a + val(r), 0) || 1;
    $("meterRows").innerHTML = sorted.map((r, i) => {
      const v = val(r);
      const shown = m.html && !rate ? m.html(v) : (rate ? (m.fmt === dur ? dur(v) : (m.fmt === goldText ? goldText(v) : compact(v))) : m.fmt(v));
      return `<a class="mrow" href="${profileHref(r.p)}" data-tip="${esc(nameTxt(r.p))}|${esc(rate ? "" : (m.full || m.fmt)(v))}"><div class="bar" style="width:${(v / max) * 100}%;--cc:${r.p.color}"></div>
        <div class="txt"><span class="rk">${i + 1}.</span><span class="nm">${esc(r.p.name)}${ripHTML(r.p)}</span><span class="v">${shown}</span><span class="pct">${rate ? "" : ((v / total) * 100).toFixed(1) + "%"}</span></div></a>`;
    }).join("") || `<p class="empty" style="padding:8px">${tr("Nobody on the meter yet.")}</p>`;
  }

  function renderDaily(people) {
    const m = METRICS.find(x => x.k === state.metric) || METRICS[0];
    $("dailyTitle").textContent = state.view === "all" ? tr("{0} per week", tr(m.label)) : tr("{0} per day", tr(m.label));
    const { labels, keys } = periodDays(people);
    if (!people.length || !labels.length) return drawChart("cDaily", null);
    const isGold = m.fmt === goldText, isDur = m.fmt === dur;
    const scale = v => isGold ? v / 10000 : isDur ? v / 3600 : v;
    const series = p => keys.map(ks => scale(ks.reduce((a, k) => a + ((p.days[k] && p.days[k][m.k]) || 0), 0)));
    const { top, rest } = topSeries(people, p => series(p).reduce((a, b) => a + b, 0));
    const datasets = top.map(p => ({ label: nameTxt(p), backgroundColor: p.color, data: series(p) }));
    if (rest.length) {
      const sums = rest.map(series);
      datasets.push({ label: tr("Others ({0})", rest.length), backgroundColor: OTHERS_COLOR, data: keys.map((_, i) => sums.reduce((a, s) => a + s[i], 0)) });
    }
    if (!datasets.length) return drawChart("cDaily", null);
    drawChart("cDaily", {
      type: "bar", data: { labels, datasets },
      options: {
        interaction: { mode: "index", intersect: false },
        scales: { x: { ...gridX, stacked: true }, y: { ...gridY, stacked: true, ticks: { callback: v => isGold ? v + "g" : isDur ? v + " h" : compact(v) } } },
        plugins: { tooltip: { callbacks: { label: c => ` ${c.dataset.label}: ${isGold ? goldText(c.raw * 10000) : isDur ? dur(c.raw * 3600) : num(c.raw)}` } } },
      },
    });
  }

  // The chart columns for the time range: one per day of the week, or one per week for all time (each a list of days).
  function periodDays(people) {
    if (state.view === "all") {
      const ws = weeksAvailable(people);
      return { keys: ws.map(w => [...Array(7)].map((_, i) => addDays(w, i))), labels: ws.map(shortDate) };
    }
    const keys = [...Array(7)].map((_, i) => [addDays(state.week, i)]);
    return { keys, labels: keys.map(([k]) => dow(parseDay(k).getUTCDay()) + " " + parseDay(k).getUTCDate()) };
  }

  // Overview: everyone's damage (a filled line) and healing (dashed) across the time range.
  function renderMomentum(people) {
    const { labels, keys } = periodDays(people);
    const sum = f => keys.map(ks => people.reduce((a, p) => a + ks.reduce((b, k) => b + ((p.days[k] && p.days[k][f]) || 0), 0), 0));
    const dmg = sum("dmg"), heal = sum("heal");
    drawChart("cMomentum", labels.length && (dmg.some(Boolean) || heal.some(Boolean)) ? {
      type: "line",
      data: { labels, datasets: [
        { label: tr("Damage"), data: dmg, borderColor: css("--accent"), area: true },
        { label: tr("Healing"), data: heal, borderColor: css("--good"), borderDash: [5, 5] },
      ] },
      options: { scales: { x: gridX, y: { ...gridY, beginAtZero: true, ticks: { ...gridY.ticks, callback: v => compact(v) } } },
        plugins: { legend: { display: false }, tooltip: { callbacks: { label: c => ` ${c.dataset.label}: ${num(c.raw)}` } } } },
    } : null);
  }

  // Overview: the characters ranked by damage, with level and deaths, each row opening the character.
  function renderStandings(rows) {
    const list = rows.filter(r => r.s.dmg || r.s.played).sort((a, b) => (b.s.dmg || 0) - (a.s.dmg || 0));
    $("standAll").hidden = list.length <= 6;
    $("standings").innerHTML = list.length
      ? `<div class="st-head"><span>${tr("Hero")}</span><span>${tr("Level")}</span><span>${tr("Damage")}</span><span>${tr("Deaths")}</span><span></span></div>` +
        list.slice(0, 6).map((r, i) => {
          const ch = r.p.chars[0] || {}, deaths = r.s.deaths || 0;
          return `<a class="st-row" href="${profileHref(r.p)}"><span class="st-hero"><b>${i + 1}</b><span class="st-av" style="--c:${r.p.color}">${classIcon(ch, 2)}</span><span class="st-nm"><strong>${esc(r.p.name)}${ripHTML(r.p)}</strong><small>${esc(RACE[ch.race] || ch.race || "")} ${classOf(ch)[0]}</small></span></span><span class="st-lvl">${esc(ch.level || "–")}</span><strong class="st-n">${compact(r.s.dmg)}</strong><span class="st-n${deaths >= 5 ? " red" : ""}">${num(deaths)}</span><span class="st-go" aria-hidden="true">›</span></a>`;
        }).join("")
      : `<p class="empty">${tr("No stats yet.")}</p>`;
  }

  // Overview: green-or-better drops by quality as one bar, and the best drop of the time range.
  function renderLootQuality(rows, people) {
    const qs = [5, 4, 3, 2].map(q => ({ q, n: rows.reduce((a, r) => a + (r.s["q" + q] || 0), 0) })).filter(x => x.n);
    const total = qs.reduce((a, x) => a + x.n, 0);
    $("lootTotal").textContent = total ? tr(total === 1 ? "{0} drop" : "{0} drops", num(total)) : "";
    const best = [];
    people.forEach(p => p.notable.forEach(n => { if (n.t && n.q >= 3 && inRange(localKey(n.t))) best.push({ p, n }); }));
    best.sort((a, b) => b.n.q - a.n.q || b.n.t - a.n.t);
    const b = best[0];
    $("lootQ").innerHTML = (total
      ? `<div class="qbar">${qs.map(x => `<i style="width:${(x.n / total) * 100}%;background:${QUAL[x.q][1]}"></i>`).join("")}</div>
        <div class="qlegend">${qs.map(x => `<div><i style="background:${QUAL[x.q][1]}"></i><span>${tr(QUAL[x.q][0])}</span><strong>${num(x.n)}</strong><small>${Math.round((x.n / total) * 100)}%</small></div>`).join("")}</div>`
      : `<p class="empty">${tr("No rare drops yet. Keep rolling Need.")}</p>`)
      + (b ? `<div class="bestdrop"><span class="bd-icon">${icon("loot", 2)}</span><div><span>${tr("Best drop")}</span><strong class="q${b.n.q}">${esc(b.n.item)}</strong><p>${esc(b.p.name)}${b.n.zone ? " · " + esc(b.n.zone) : ""}</p></div><b class="q${b.n.q}">${tr(QUAL[b.n.q][0])}</b></div>` : "");
  }

  function renderRace(people, canvasId = "cRace", mode = state.raceMode) {
    if (canvasId === "cRace") document.querySelectorAll("#raceMode .chip").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.mode === mode)));
    const best = p => p.chars.slice().sort((a, b) => (b.level || 0) - (a.level || 0))[0];
    const ranked = people.length > 1 ? topSeries(people, p => (best(p) && best(p).level) || 0).top : people;
    const datasets = ranked.map(p => {
      const ch = best(p);
      if (!ch) return null;
      let pts = Object.entries(ch.levels || {}).map(([l, t]) => ({
        x: mode === "date" ? t * 1000 : ((ch.levelPlayed || {})[l] || 0) / 3600, y: +l,
      })).filter(pt => pt.x > 0 || mode === "played").sort((a, b) => a.y - b.y);
      if (mode === "date" && ch.level && ch.lastSeen && (!pts.length || pts[pts.length - 1].y < ch.level)) pts.push({ x: ch.lastSeen * 1000, y: ch.level });
      if (!pts.length) return null;
      return {
        label: p.name === ch.name ? nameTxt(p) : `${nameTxt(p)} (${ch.name})`, data: pts, borderColor: p.color, backgroundColor: p.color,
      };
    }).filter(Boolean);
    if (!datasets.length) return drawChart(canvasId, null);
    drawChart(canvasId, {
      type: "line", data: { datasets },
      options: {
        parsing: false,
        scales: {
          x: { type: "linear", ...gridY, title: { display: mode === "played", text: tr("hours played") },
            ticks: { maxTicksLimit: 8, callback: v => mode === "date" ? new Date(v).toLocaleDateString(LOC(), { month: "short", day: "numeric" }) : v + " h" } },
          y: { ...gridY, min: 1, max: state.cap || 60, ticks: { stepSize: 10 }, title: { display: true, text: tr("level") } },
        },
        plugins: { tooltip: { callbacks: {
          title: items => items.length ? tr("Level {0}", items[0].raw.y) : "",
          label: c => ` ${c.dataset.label} · ${mode === "date" ? new Date(c.raw.x).toLocaleDateString(LOC(), { month: "short", day: "numeric" }) : tr("{0} played", dur(c.raw.x * 3600))}`,
        } } },
      },
    });
  }

  const DEATH_VERB = {
    fall: "fell to their death", drown: "drowned", fire: "burned to death", lava: "fell into lava", slime: "dissolved in slime",
    fatigue: "succumbed to fatigue", environment: "was killed by the world itself", unknown: "died under mysterious circumstances",
  };
  function deathLine(p, d, withDay) {
    const when = new Date(d.t * 1000).toLocaleString(LOC(), withDay
      ? { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit", hour12: false }
      : { weekday: "short", hour: "2-digit", minute: "2-digit", hour12: false });
    const alt = d._char && d._char !== p.name ? ` <span class="alt">(${esc(d._char)})</span>` : "";
    return `<div class="ln"><span class="ts">[${esc(when)}]</span>${nameHTML(p)}${alt} ${deathWhat(d)}. <span class="lvl">${tr("Level {0}", esc(d.lvl || "?"))}</span></div>`;
  }
  function deathWhat(d) {
    let what;
    if (d.cause === "mob" || d.cause === "player") {
      const mob = `<span class="mob">${esc(d.by || tr("something"))}</span>`;
      what = (d.spell && d.spell !== "Melee" ? tr("was slain by {0}'s {1}", mob, `<span class="sp">${esc(d.spell)}</span>`) : tr("was slain by {0}", mob))
        + (d.amt ? ` <span class="dmg">(${num(d.amt)})</span>` : "");
    } else what = tr(DEATH_VERB[d.cause] || "died");
    const where = d.inst || d.zone;
    return what + (where ? tr(" in {0}", `<span class="where">${esc(where)}</span>`) : "");
  }
  const fullDate = t => new Date(t * 1000).toLocaleDateString(LOC(), { year: "numeric", month: "short", day: "numeric" });

  function causeChart(canvasId, deaths, legendPos = "right") {
    const causes = {};
    deaths.forEach(d => { causes[d.cause || "unknown"] = (causes[d.cause || "unknown"] || 0) + 1; });
    const ck = Object.keys(causes).sort((a, b) => causes[b] - causes[a]);
    const mid = $(canvasId + "Mid"), legend = $(canvasId + "Legend");
    if (mid) mid.innerHTML = ck.length ? `<strong>${num(deaths.length)}</strong><span>${tr(deaths.length === 1 ? "death" : "deaths")}</span>` : "";
    if (legend) legend.innerHTML = ck.map(c => `<div><i style="background:${(CAUSE[c] || CAUSE.unknown)[1]}"></i><span>${tr((CAUSE[c] || CAUSE.unknown)[0])}</span><strong>${num(causes[c])}</strong></div>`).join("");
    drawChart(canvasId, ck.length ? {
      type: "doughnut",
      data: { labels: ck.map(c => tr((CAUSE[c] || CAUSE.unknown)[0])), datasets: [{ data: ck.map(c => causes[c]), backgroundColor: ck.map(c => (CAUSE[c] || CAUSE.unknown)[1]) }] },
      options: { plugins: { legend: { display: !legend, position: legendPos } } },
    } : null);
  }

  function renderDeaths(people) {
    const all = [];
    people.forEach(p => p.deaths.forEach(d => { if (d && d.t && inRange(localKey(d.t))) all.push({ p, d }); }));
    all.sort((a, b) => b.d.t - a.d.t);
    $("clog").innerHTML = all.slice(0, 80).map(({ p, d }) => deathLine(p, d)).join("") || `<p class="empty">${tr("Nobody died. Suspicious.")}</p>`;
    causeChart("cCause", all.map(x => x.d));
    causeChart("cOCause", all.map(x => x.d));

    // deaths by level bracket, stacked by friend
    const brackets = [...Array(state.cap / 10)].map((_, i) => i ? `${i * 10}–${i * 10 + 9}` : "1–9").concat(String(state.cap));
    const bIdx = l => Math.min(brackets.length - 1, Math.floor((l || 1) / 10));
    drawChart("cDeathLvl", all.length ? {
      type: "bar",
      data: { labels: brackets, datasets: (() => {
        const counts = p => brackets.map((_, i) => all.filter(x => x.p === p && bIdx(x.d.lvl) === i).length);
        const { top, rest } = topSeries(people, p => all.filter(x => x.p === p).length);
        const ds = top.map(p => ({ label: nameTxt(p), backgroundColor: p.color, data: counts(p) }));
        if (rest.length) { const c = rest.map(counts); ds.push({ label: tr("Others ({0})", rest.length), backgroundColor: OTHERS_COLOR, data: brackets.map((_, i) => c.reduce((a, s) => a + s[i], 0)) }); }
        return ds;
      })() },
      options: { interaction: { mode: "index", intersect: false }, scales: { x: { ...gridX, stacked: true }, y: { ...gridY, stacked: true, ticks: { precision: 0 } } }, plugins: { legend: { display: false } } },
    } : null);

    // wanted posters
    const killers = {};
    all.forEach(({ p, d }) => {
      if (!d.by) return;
      const k = killers[d.by] ||= { n: 0, victims: new Set(), zones: {} };
      k.n++; k.victims.add(p.name); if (d.zone) k.zones[d.zone] = (k.zones[d.zone] || 0) + 1;
    });
    const top = Object.entries(killers).sort((a, b) => b[1].n - a[1].n).slice(0, 8);
    const mw = top[0];
    $("oWanted").innerHTML = mw ? `<div class="mostwanted"><span class="mw-icon">${icon("skull", 2)}</span><div><p>${tr("Most wanted")}</p><strong>${esc(mw[0])}</strong><span>${tr(mw[1].n === 1 ? "Responsible for {0} death" : "Responsible for {0} deaths", num(mw[1].n))}</span></div><b>×${num(mw[1].n)}</b></div>` : "";
    $("wanted").innerHTML = top.map(([name, k], i) => {
      const zone = Object.entries(k.zones).sort((a, b) => b[1] - a[1])[0];
      return `<div class="poster" style="--r:${[-1.5, 1, -0.5, 1.5, -1, 0.5, 1.2, -0.8][i]}deg"><div class="w">${tr("Wanted")}</div><div class="m">${esc(name)}</div>
        <div class="f">${tr(k.n === 1 ? "for the murder of {0} hero" : "for the murder of {0} heroes", num(k.n))}</div>
        <div class="f">${tr("Victims: {0}", [...k.victims].map(esc).join(", "))}</div>
        ${zone ? `<div class="f">${tr("Last seen in {0}", esc(zone[0]))}</div>` : ""}
        <div class="r">${tr("Reward: {0} gold", num(k.n * 15))}</div></div>`;
    }).join("") || `<p class="empty">${tr("No creature has claimed a victim yet.")}</p>`;

    // deadliest zones
    const dz = {};
    all.forEach(({ d }) => { const z = d.inst || d.zone; if (z) dz[z] = (dz[z] || 0) + 1; });
    const zs = Object.entries(dz).sort((a, b) => b[1] - a[1]).slice(0, 8);
    const zmax = Math.max(1, ...zs.map(z => z[1]));
    $("deadZones").innerHTML = zs.map(([z, n]) => `<div class="hbar bad" data-tip="${esc(z)}|${esc(tr(n === 1 ? "{0} death" : "{0} deaths", n))}"><span>${esc(z)}</span><span class="track"><span class="fill" style="display:block;width:${(n / zmax) * 100}%"></span></span><span class="num">${n}</span></div>`).join("")
      || `<p class="empty">${tr("No deaths, no dangerous places.")}</p>`;
  }

  // Hardcore: death is permanent, so who has fallen matters more than how often. Always all time.
  function renderGraveyard(people) {
    $("s-grave").classList.toggle("nosec", !state.hc);
    if (!state.hc) return;
    const lvl = p => Math.max(0, ...p.chars.map(c => +c.level || 0));
    const fallen = people.filter(p => p.fallen).sort((a, b) => b.fallen.t - a.fallen.t);
    const alive = people.filter(p => !p.fallen).sort((a, b) => lvl(b) - lvl(a));
    const avg = fallen.reduce((s, p) => s + (+p.fallen.lvl || 0), 0) / Math.max(1, fallen.length);
    const best = fallen.slice().sort((a, b) => (b.fallen.lvl || 0) - (a.fallen.lvl || 0))[0];
    $("hcTiles").innerHTML = [
      ["heart", tr("Still standing"), num(alive.length), alive[0] ? tr("highest: {0}, level {1}", esc(alive[0].name), lvl(alive[0])) : ""],
      ["grave", tr("Fallen"), num(fallen.length), people.length ? tr("{0} survival rate", pct(alive.length / people.length)) : "", fallen.length ? "dead" : ""],
      ["skull", tr("Average level at death"), fallen.length ? dec(avg, 1) : "–", best ? tr("highest: {0}, level {1}", esc(best.name), esc(best.fallen.lvl || "?")) : ""],
    ].map(tileHTML).join("");
    $("hcFallen").innerHTML = fallen.map(p => `<div class="grave"><span class="gicon">${sprite("tomb", 2)}</span><div>
        <div class="gname">${nameHTML(p)}</div><div class="gwhat">${deathWhat(p.fallen)}.</div>
        <div class="gwhen">${tr("Level {0}", esc(p.fallen.lvl || "?"))} · ${fullDate(p.fallen.t)}</div></div></div>`).join("")
      || `<p class="empty">${tr("Nobody has fallen. Yet.")}</p>`;
    $("hcAlive").innerHTML = alive.map(p => `<a class="chip" href="${profileHref(p)}">${classIcon(p.chars[0])}${esc(p.name)} <span class="muted">${tr("Lvl {0}", lvl(p))}</span></a>`).join("")
      || `<p class="empty">${tr("Everyone has fallen.")}</p>`;
  }

  // ---------- dungeons & raids ----------
  const bossKey = x => `${x.boss || x.n}|${x.inst || ""}|${x.d || 0}`;
  // Fight and run lengths: 2:05 under an hour, otherwise hours and minutes.
  const clock = s => {
    if (s == null || !(s >= 0)) return "–";
    s = Math.round(s);
    return s >= 3600 ? dur(s) : `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  };
  const dayText = t => new Date(t * 1000).toLocaleDateString(LOC(), { month: "short", day: "numeric" });
  // A name from a fight's meter: a link when that character is on the site, otherwise just the class colour.
  const whoHTML = (w, people) => {
    const p = people.find(x => x.name === w.n);
    return p ? nameHTML(p) : `<span class="dot" style="background:${(CLASS[w.c] || classOf({}))[1]}"></span><span class="cname">${esc(w.n)}</span>`;
  };
  // The difficulty only shows for instances that were run on more than one.
  function instLabeler(records) {
    const diffs = {};
    records.forEach(r => (diffs[r.inst] ||= new Set()).add(r.d || 0));
    return r => esc(r.inst || "?") + (r.dn && diffs[r.inst] && diffs[r.inst].size > 1 ? ` <span class="muted">(${esc(r.dn)})</span>` : "");
  }

  // A fight seen by several characters in the group is one fight: the same boss within half a minute.
  // Their meters are combined with max, so nobody's damage counts twice.
  function groupFights(people) {
    const all = [];
    people.forEach(p => p.fights.forEach(f => { if (inRange(localKey(f.t))) all.push({ p, f }); }));
    all.sort((a, b) => a.f.t - b.f.t);
    const byBoss = {}, out = [];
    for (const { p, f } of all) {
      const key = bossKey(f), list = byBoss[key] ||= [];
      let g = list.find(x => Math.abs(x.t - f.t) < 30);
      if (!g) { g = { key, boss: f.boss, inst: f.inst, d: f.d, dn: f.dn, t: f.t, dur: f.dur, ok: false, deaths: 0, who: {}, seen: [] }; list.push(g); out.push(g); }
      g.ok = g.ok || !!f.ok;
      if (f.dur > (g.dur || 0)) g.dur = f.dur;
      g.deaths = Math.max(g.deaths, +f.deaths || 0);
      g.seen.push(p);
      const add = r => {
        if (!r || !r.n) return;
        const w = g.who[r.n] ||= { n: String(r.n), c: r.c, d: 0, h: 0 };
        w.d = Math.max(w.d, +r.d || 0); w.h = Math.max(w.h, +r.h || 0); w.c ||= r.c;
      };
      asArr(f.who).forEach(add);
      add({ n: p.name, c: p.class, d: f.dmg, h: f.heal }); // in case their own meter left them out
    }
    return out.sort((a, b) => b.t - a.t);
  }

  // Runs work the same way: one group run per dungeon within 15 minutes of entering.
  function groupRuns(people) {
    const all = [];
    people.forEach(p => p.runs.forEach(r => { if (inRange(localKey(r.t))) all.push({ p, r }); }));
    all.sort((a, b) => a.r.t - b.r.t);
    const byInst = {}, out = [];
    for (const { p, r } of all) {
      const list = byInst[`${r.inst}|${r.d || 0}`] ||= [];
      let g = list.find(x => Math.abs(x.t - r.t) < 900);
      if (!g) { g = { inst: r.inst, d: r.d, dn: r.dn, kind: r.kind, t: r.t, lvl: r.lvl, dur: 0, bosses: 0, wipes: 0, deaths: 0, people: [], names: new Set() }; list.push(g); out.push(g); }
      g.dur = Math.max(g.dur, +r.dur || 0); g.bosses = Math.max(g.bosses, +r.bosses || 0); g.wipes = Math.max(g.wipes, +r.wipes || 0);
      g.deaths += +r.deaths || 0;
      g.lastBoss ||= r.lastBoss;
      g.people.push(p); g.names.add(p.name);
      asArr(r.with).forEach(n => g.names.add(String(n)));
    }
    return { runs: out.sort((a, b) => b.t - a.t), all };
  }

  // Journal names and the game's names differ in small ways ("The Deadmines" / "Deadmines"), so both are simplified.
  const jkey = n => String(n || "").toLowerCase().replace(/^the\s+/, "").replace(/[^a-z0-9]/g, "");
  const journalArt = (kind, name) => {
    const j = state.data && state.data.journal && state.data.journal[kind];
    if (!j) return "";
    if (!j._k) Object.defineProperty(j, "_k", { value: Object.fromEntries(Object.entries(j).map(([n, u]) => [jkey(n), u])) });
    return blizzImg(j._k[jkey(name)]);
  };
  const bossPic = name => { const u = journalArt("boss", name); return u ? `<img class="bosspic" src="${u}" alt="" loading="lazy">` : ""; };
  function renderDungeons(people) {
    const fights = groupFights(people);
    const label = instLabeler(fights.concat(people.flatMap(p => p.bosses.map(b => ({ ...b, boss: b.n })))));

    $("fightLog").innerHTML = fights.slice(0, 60).map(g => {
      const who = Object.values(g.who);
      const dmg = who.filter(w => w.d > 0).sort((a, b) => b.d - a.d);
      const heal = who.filter(w => w.h > 0).sort((a, b) => b.h - a.h).slice(0, 5);
      const bars = (list, f) => {
        const max = Math.max(1, ...list.map(f));
        return list.map(w => `<div class="hbar" style="--c:${(CLASS[w.c] || classOf({}))[1]}"><span>${whoHTML(w, people)}</span><span class="track"><span class="fill" style="display:block;width:${(f(w) / max) * 100}%"></span></span><span class="num">${compact(f(w))}${g.dur ? ` <span class="muted">${tr("({0}/s)", compact(f(w) / g.dur))}</span>` : ""}</span></div>`).join("");
      };
      const sub = [label(g), clock(g.dur), g.deaths ? tr(g.deaths === 1 ? "{0} death" : "{0} deaths", g.deaths) : "", dmg[0] ? tr("top damage: {0}", esc(dmg[0].n)) : ""].filter(Boolean).join(" · ");
      return `<details class="fight"><summary><span class="res${g.ok ? "" : " wipe"}">${tr(g.ok ? "Kill" : "Wipe")}</span><span class="boss">${bossPic(g.boss)}${esc(g.boss)}</span><span class="when">${dayText(g.t)}</span><span class="sub">${sub}</span></summary>
        <div class="meter">${dmg.length ? `<span class="lh">${tr("Damage")}</span>${bars(dmg, w => w.d)}` : ""}${heal.length ? `<span class="lh">${tr("Healing")}</span>${bars(heal, w => w.h)}` : ""}${!dmg.length && !heal.length ? `<p class="empty">${tr("No meter for this fight.")}</p>` : ""}</div></details>`;
    }).join("") || `<p class="empty">${tr("No boss fights yet. They're recorded from FunStats 1.3 on.")}</p>`;

    // The tally: this range's fights, plus (all time) each character's own totals, which go back further than the fight list.
    const tally = {};
    const row = x => tally[bossKey(x)] ||= { boss: x.boss || x.n, inst: x.inst, d: x.d, dn: x.dn, kills: 0, wipes: 0, fast: null, dps: null, last: 0 };
    for (const g of fights) {
      const r = row(g);
      if (!g.ok) { r.wipes++; continue; }
      r.kills++;
      r.last = Math.max(r.last, g.t);
      if (g.dur && (r.fast == null || g.dur < r.fast)) r.fast = g.dur;
      if (g.dur) for (const w of Object.values(g.who)) if (!r.dps || w.d / g.dur > r.dps.v) r.dps = { v: w.d / g.dur, w };
    }
    if (state.view === "all") for (const p of people) for (const b of p.bosses) {
      const r = row(b);
      r.kills = Math.max(r.kills, +b.kills || 0);
      r.wipes = Math.max(r.wipes, +b.wipes || 0);
      if (b.fast && (r.fast == null || b.fast < r.fast)) r.fast = b.fast;
      if (b.dps && (!r.dps || b.dps > r.dps.v)) r.dps = { v: b.dps, w: { n: p.name, c: p.class } };
      r.last = Math.max(r.last, +b.last || 0);
    }
    const trows = Object.values(tally).sort((a, b) => b.last - a.last || b.wipes - a.wipes);
    $("bossTallyNote").textContent = rangeLabel();
    $("tBosses").tHead.innerHTML = `<tr><th>${tr("Boss")}</th><th>${tr("Kills")}</th><th>${tr("Wipes")}</th><th>${tr("Fastest")}</th><th>${tr("Best DPS")}</th><th>${tr("Last kill")}</th></tr>`;
    $("tBosses").tBodies[0].innerHTML = trows.map(r => `<tr><td class="bosscell">${bossPic(r.boss)}<b>${esc(r.boss)}</b><br><span class="muted" style="font-size:12px">${label(r)}</span></td><td>${num(r.kills)}</td><td>${num(r.wipes)}</td><td>${clock(r.fast)}</td>
        <td>${r.dps ? `<span class="nm">${whoHTML(r.dps.w, people)} ${num(r.dps.v)}</span>` : "–"}</td><td>${r.last ? dayText(r.last) : "–"}</td></tr>`).join("")
      || `<tr><td colspan="6" class="empty">${tr("No bosses fought in this range.")}</td></tr>`;

    // Dungeon records and the latest runs.
    const { runs, all } = groupRuns(people);
    const runLabel = instLabeler(runs);
    const byInst = {};
    runs.forEach(g => (byInst[`${g.inst}|${g.d || 0}`] ||= []).push(g));
    $("runCards").innerHTML = Object.values(byInst).sort((a, b) => b.length - a.length).map(list => {
      const most = Math.max(...list.map(g => g.bosses));
      const clears = list.filter(g => g.bosses === most && most > 0 && g.dur > 0).sort((a, b) => a.dur - b.dur);
      const best = clears[0];
      const runners = {};
      all.forEach(({ p, r }) => { if (r.inst === list[0].inst && (r.d || 0) === (list[0].d || 0)) runners[p.name] = (runners[p.name] || 0) + 1; });
      const top = Object.entries(runners).sort((a, b) => b[1] - a[1])[0];
      const topP = top && people.find(p => p.name === top[0]);
      const art = journalArt("inst", list[0].inst);
      return `<div class="runcard${art ? " has-art" : ""}"${art ? ` style="--art:url('${art}')"` : ""}><h3>${runLabel(list[0])}</h3>
        <span class="lh">${tr("Fastest clear")}</span><span class="big">${best ? clock(best.dur) : "–"}</span>
        ${best ? `<span class="muted" style="font-size:13px">${esc([...best.names].slice(0, 5).join(", "))} · ${dayText(best.t)}</span>` : ""}
        <dl class="kv"><dt>${tr("Runs")}</dt><dd>${num(list.length)}</dd>
          <dt>${tr("Average time")}</dt><dd>${clock(list.reduce((a, g) => a + g.dur, 0) / list.length)}</dd>
          <dt>${tr("Bosses")}</dt><dd>${tr("up to {0}", most)}</dd>
          <dt>${tr("Deaths")}</dt><dd>${num(list.reduce((a, g) => a + g.deaths, 0))}</dd>
          ${top ? `<dt>${tr("Most runs")}</dt><dd>${topP ? nameHTML(topP) : esc(top[0])} ×${top[1]}</dd>` : ""}</dl></div>`;
    }).join("") || `<p class="empty">${tr("No dungeon runs yet. They're recorded from FunStats 1.3 on.")}</p>`;
    $("runLog").innerHTML = runs.slice(0, 60).map(g => {
      const bits = [clock(g.dur), tr(g.bosses === 1 ? "{0} boss" : "{0} bosses", g.bosses)];
      if (g.wipes) bits.push(tr(g.wipes === 1 ? "{0} wipe" : "{0} wipes", g.wipes));
      if (g.deaths) bits.push(tr(g.deaths === 1 ? "{0} death" : "{0} deaths", g.deaths));
      return `<div class="ln"><span class="ts">${dayText(g.t)}</span><b class="where">${runLabel(g)}</b> · ${bits.join(" · ")}
        <span class="alt">· ${esc([...g.names].join(", "))}</span>${g.lvl ? ` <span class="lvl">${tr("Lvl {0}", esc(g.lvl))}</span>` : ""}</div>`;
    }).join("") || `<p class="empty">${tr("No runs in this range.")}</p>`;
  }

  function renderCombat(rows) {
    const R = [
      [tr("Damage"), s => s.dmg || 0], [tr("Healing"), s => s.heal || 0], [tr("Killing blows"), s => s.kb || 0],
      [tr("Survival"), s => (s.played || 0) / 3600 / Math.max(1, s.deaths || 0)], [tr("Exploration"), s => s.dist || 0],
      [tr("Wealth"), s => s.goldIn || 0], [tr("Questing"), s => s.quests || 0], [tr("Chatter"), s => (s.msgs || 0) + (s.emotes || 0)],
    ];
    const maxes = R.map(([, f]) => Math.max(1e-9, ...rows.map(r => f(r.s))));
    drawChart("cRadar", rows.length ? {
      type: "radar",
      data: { labels: R.map(r => r[0]), datasets: rows.slice().sort((a, b) => (b.s.dmg || 0) - (a.s.dmg || 0)).slice(0, 6).map(r => ({
        label: nameTxt(r.p), data: R.map(([, f], i) => Math.round((f(r.s) / maxes[i]) * 100)),
        borderColor: r.p.color, backgroundColor: r.p.color + "1f", pointBackgroundColor: r.p.color,
      })) },
      options: {
        scales: { r: { min: 0, max: 100, ticks: { display: false, stepSize: 25 }, grid: { color: "rgba(255,255,255,.08)" }, angleLines: { color: "rgba(255,255,255,.08)" },
          pointLabels: { color: css("--accent"), font: { family: '"Inter", sans-serif', size: 12, weight: "700" } } } },
        plugins: { tooltip: { callbacks: { label: c => ` ${c.dataset.label}: ${tr("{0}% of the best", c.raw)}` } } },
      },
    } : null);

    const cr = rows.filter(r => (r.s.hits || 0) > 0).sort((a, b) => b.s.critRate - a.s.critRate).slice(0, 10);
    drawChart("cCrit", cr.length ? {
      type: "bar",
      data: { labels: cr.map(r => nameTxt(r.p)), datasets: [{ label: tr("Crit rate"), data: cr.map(r => +(r.s.critRate * 100).toFixed(1)), backgroundColor: cr.map(r => r.p.color), borderRadius: 4 }] },
      options: { indexAxis: "y", scales: { x: { ...gridY, ticks: { callback: v => v + "%" } }, y: gridX }, plugins: { legend: { display: false }, tooltip: { callbacks: { label: c => " " + tr("{0}% crits ({1} of {2} hits)", dec(c.raw, 1), num(cr[c.dataIndex].s.crits), num(cr[c.dataIndex].s.hits)) } } } },
    } : null);

    const tk = rows.filter(r => r.s.taken || r.s.healedBy).sort((a, b) => (b.s.taken || 0) - (a.s.taken || 0)).slice(0, 10);
    drawChart("cTaken", tk.length ? {
      type: "bar",
      data: { labels: tk.map(r => nameTxt(r.p)), datasets: [
        { label: tr("Damage taken"), data: tk.map(r => r.s.taken || 0), backgroundColor: "#c0392b", borderRadius: 3 },
        { label: tr("Healing received"), data: tk.map(r => r.s.healedBy || 0), backgroundColor: "#4ade80", borderRadius: 3 },
      ] },
      options: { interaction: { mode: "index", intersect: false }, scales: { x: gridX, y: { ...gridY, ticks: { callback: v => compact(v) } } },
        plugins: { tooltip: { callbacks: { label: c => ` ${c.dataset.label}: ${num(c.raw)}` } } } },
    } : null);

    const cols = [
      ["Crit rate", s => s.hits ? pct(s.critRate) : "–"], ["Hits", s => num(s.hits)], ["Avg hit", s => s.hits ? num(s.dmg / s.hits) : "–"],
      ["Biggest", s => num(s.maxHit)], ["Overkill", s => num(s.overkill)], ["Misses", s => num(s.whiffs)], ["Resisted", s => num(s.resisted)],
      ["Dodges", s => num(s.dodges)], ["Parries", s => num(s.parries)], ["Blocks", s => num(s.blocks)], ["Taken", s => num(s.taken)],
      ["Healed by others", s => num(s.healedBy)], ["Overheal", s => num(s.overheal)], ["Casts", s => num(s.casts)], ["Fall damage", s => num(s.fallDmg)],
    ];
    $("tCombat").tHead.innerHTML = `<tr><th>${tr("Friend")}</th>${cols.map(c => `<th>${tr(c[0])}</th>`).join("")}</tr>`;
    $("tCombat").tBodies[0].innerHTML = rows.map(r => `<tr><td><span class="nm">${nameHTML(r.p)}</span></td>${cols.map(c => `<td>${c[1](r.s)}</td>`).join("")}</tr>`).join("")
      || `<tr><td colspan="${cols.length + 1}" class="empty">${tr("Nobody on the roster yet.")}</td></tr>`;
  }

  function renderLoot(rows, people) {
    const lr = rows.filter(r => [2, 3, 4, 5].some(q => r.s["q" + q])).sort((a, b) => (b.s.loot || 0) + (b.s.q2 || 0) - (a.s.loot || 0) - (a.s.q2 || 0)).slice(0, 10);
    drawChart("cLoot", lr.length ? {
      type: "bar",
      data: { labels: lr.map(r => nameTxt(r.p)), datasets: [2, 3, 4, 5].map(q => ({
        label: tr(QUAL[q][0]), backgroundColor: QUAL[q][1], borderColor: "#17141b", borderWidth: 1, borderRadius: 2,
        data: lr.map(r => r.s["q" + q] || 0),
      })) },
      options: { indexAxis: "y", interaction: { mode: "index", intersect: false },
        scales: { x: { ...gridY, stacked: true, ticks: { precision: 0 } }, y: { ...gridX, stacked: true } },
        plugins: { tooltip: { callbacks: {
          label: c => ` ${c.dataset.label}: ${num(c.raw)}`,
          footer: items => { const s = lr[items[0].dataIndex].s; return tr("Also {0} grey and {1} white items", num(s.q0), num(s.q1)); },
        } } } },
    } : null);

    const gr = rows.filter(r => r.s.goldIn || r.s.goldOut).sort((a, b) => (b.s.goldIn || 0) - (a.s.goldIn || 0)).slice(0, 10);
    drawChart("cGold", gr.length ? {
      type: "bar",
      data: { labels: gr.map(r => nameTxt(r.p)), datasets: [
        { label: tr("Looted & earned"), data: gr.map(r => (r.s.goldIn || 0) / 10000), backgroundColor: "#ffd100", borderRadius: 3 },
        { label: tr("Spent"), data: gr.map(r => -((r.s.goldOut || 0) / 10000)), backgroundColor: "#c87533", borderRadius: 3 },
        { label: tr("Repairs"), data: gr.map(r => -((r.s.repair || 0) / 10000)), backgroundColor: "#8b8f99", borderRadius: 3 },
      ] },
      options: { interaction: { mode: "index", intersect: false }, scales: { x: gridX, y: { ...gridY, ticks: { callback: v => v + "g" } } },
        plugins: { tooltip: { callbacks: { label: c => ` ${c.dataset.label}: ${goldText(Math.abs(c.raw) * 10000)}` } } } },
    } : null);

    const feed = [];
    people.forEach(p => p.notable.forEach(n => { if (n.t && inRange(localKey(n.t)) && n.q >= 3) feed.push({ p, n }); }));
    feed.sort((a, b) => b.n.t - a.n.t);
    $("lootFeed").innerHTML = feed.slice(0, 24).map(({ p, n }) =>
      `<div>${nameHTML(p)} ${tr("receives loot:")} <span class="q${n.q}">[${esc(n.item)}]</span> <span class="muted" style="font-size:13px">${new Date(n.t * 1000).toLocaleDateString(LOC(), { month: "short", day: "numeric" })}</span></div>`).join("")
      || `<p class="empty">${tr("No rare drops yet. Keep rolling Need.")}</p>`;
  }

  function renderWealth(people) {
    const all = new Set();
    people.forEach(p => p.chars.forEach(ch => Object.entries(ch.days).forEach(([k, d]) => { if (typeof d.gold === "number") all.add(k); })));
    const labels = [...all].sort();
    if (!labels.length) return drawChart("cWealth", null);
    const datasets = people.map(p => {
      const per = p.chars.map(ch => { let last = null; return labels.map(k => { const d = ch.days[k]; if (d && typeof d.gold === "number") last = d.gold; return last; }); });
      const data = labels.map((_, i) => { let s = 0, any = false; per.forEach(a => { if (a[i] != null) { s += a[i]; any = true; } }); return any ? +(s / 10000).toFixed(2) : null; });
      return { label: nameTxt(p), data, borderColor: p.color, backgroundColor: p.color, spanGaps: true, _last: data.filter(v => v != null).pop() || 0 };
    }).filter(d => d.data.some(v => v != null)).sort((a, b) => b._last - a._last).slice(0, MAX_SERIES);
    drawChart("cWealth", datasets.length ? {
      type: "line", data: { labels: labels.map(shortDate), datasets },
      options: { scales: { x: { ...gridX, ticks: { maxTicksLimit: 6 } }, y: { ...gridY, ticks: { callback: v => v + "g", maxTicksLimit: 6 } } },
        plugins: { tooltip: { callbacks: { label: c => ` ${c.dataset.label} · ${goldText(c.raw * 10000)}` } } } },
    } : null);
  }

  function heatHTML(heat) {
    const max = Math.max(1, ...Object.values(heat));
    let html = `<span></span>` + [...Array(24)].map((_, h) => `<span class="h">${h % 3 === 0 ? h : ""}</span>`).join("");
    for (let d = 0; d < 7; d++) {
      html += `<span class="d">${dow(d)}</span>`;
      for (let h = 0; h < 24; h++) {
        const v = heat[`${d}-${h}`] || 0;
        html += `<span class="c" style="--a:${v ? (0.08 + 0.92 * v / max).toFixed(3) : 0}" data-tip="${dow(d)} ${String(h).padStart(2, "0")}:00|${esc(tr("{0} played", dur(v)))}"></span>`;
      }
    }
    return html;
  }

  function renderWorld(people) {
    const heat = {};
    people.forEach(p => Object.entries(p.heat).forEach(([k, v]) => heat[k] = (heat[k] || 0) + v));
    $("heat").innerHTML = heatHTML(heat);

    const zones = {};
    people.forEach(p => Object.entries(p.zones).forEach(([z, v]) => zones[z] = (zones[z] || 0) + v));
    const top = Object.entries(zones).sort((a, b) => b[1] - a[1]).slice(0, 12).map(z => z[0]);
    drawChart("cZones", top.length ? {
      type: "bar",
      data: { labels: top, datasets: (() => {
        const hours = p => top.map(z => +(((p.zones[z]) || 0) / 3600).toFixed(1));
        const { top: tp, rest } = topSeries(people, p => Object.values(p.zones).reduce((a, b) => a + b, 0));
        const ds = tp.map(p => ({ label: nameTxt(p), backgroundColor: p.color, data: hours(p) }));
        if (rest.length) { const hs = rest.map(hours); ds.push({ label: tr("Others ({0})", rest.length), backgroundColor: OTHERS_COLOR, data: top.map((_, i) => +hs.reduce((a, s) => a + s[i], 0).toFixed(1)) }); }
        return ds;
      })() },
      options: { indexAxis: "y", interaction: { mode: "index", intersect: false }, scales: { x: { ...gridY, stacked: true, ticks: { callback: v => v + " h" } }, y: { ...gridX, stacked: true } },
        plugins: { tooltip: { callbacks: { label: c => ` ${c.dataset.label}: ${dur(c.raw * 3600)}` } } } },
    } : null);
  }

  function renderSpells(people) {
    const withSpells = people.filter(p => Object.keys(p.spellDmg).length);
    if (!withSpells.find(p => p.id === state.spellWho)) state.spellWho = withSpells[0] && withSpells[0].id;
    $("spellWho").innerHTML = withSpells.map(p => `<button type="button" class="chip" data-pid="${esc(p.id)}" aria-pressed="${p.id === state.spellWho}"><span class="dot" style="background:${p.color}"></span>${esc(p.name)}${ripHTML(p)}</button>`).join("");
    const p = withSpells.find(x => x.id === state.spellWho);
    if (!p) return drawChart("cSpells", null);
    const sp = Object.entries(p.spellDmg).sort((a, b) => b[1] - a[1]).slice(0, 12);
    const tot = Object.values(p.spellDmg).reduce((a, b) => a + b, 0) || 1;
    drawChart("cSpells", {
      type: "bar",
      data: { labels: sp.map(s => s[0]), datasets: [{ label: tr("Damage"), data: sp.map(s => s[1]), backgroundColor: p.color, borderRadius: 4 }] },
      options: { indexAxis: "y", scales: { x: { ...gridY, ticks: { callback: v => compact(v) } }, y: { ...gridX, ticks: { color: css("--accent") } } },
        plugins: { legend: { display: false }, tooltip: { callbacks: {
          label: c => " " + tr("{0} damage ({1}%)", num(c.raw), dec((c.raw / tot) * 100, 1)),
          afterLabel: c => { const n = p.casts[sp[c.dataIndex][0]]; return n ? " " + tr("{0} casts", num(n)) : ""; },
        } } } },
    });
  }

  function renderBonds(people) {
    const ownerOf = name => people.find(p => p.chars.some(ch => String(ch.name).toLowerCase() === String(name).toLowerCase()));
    const grid = {};
    people.forEach(p => Object.entries(p.duels).forEach(([opp, r]) => {
      const o = ownerOf(opp); if (!o || o === p) return;
      const c = (grid[p.id] ||= {})[o.id] ||= { w: 0, l: 0 };
      c.w += r.w; c.l += r.l;
    }));
    const any = Object.keys(grid).length;
    $("tDuels").tHead.innerHTML = any ? `<tr><th></th>${people.map(p => `<th style="text-align:center">${esc(p.name)}${ripHTML(p)}</th>`).join("")}</tr>` : "";
    $("tDuels").tBodies[0].innerHTML = any ? people.map(a => `<tr><td><span class="nm">${nameHTML(a)}</span></td>${people.map(b => {
      if (a === b) return `<td class="cell even">—</td>`;
      const c = grid[a.id] && grid[a.id][b.id];
      if (!c) return `<td class="cell even">·</td>`;
      return `<td class="cell ${c.w > c.l ? "win" : c.w < c.l ? "lose" : "even"}">${c.w}–${c.l}</td>`;
    }).join("")}</tr>`).join("") : `<tr><td class="empty">${tr("No duels between friends yet. Someone challenge someone.")}</td></tr>`;

    $("angels").innerHTML = people.filter(p => Object.keys(p.healers).length).map(p => {
      const hs = Object.entries(p.healers).sort((a, b) => b[1] - a[1]).slice(0, 3);
      const mx = Math.max(1, ...hs.map(h => h[1]));
      return `<div class="angel"><div class="who">${nameHTML(p)} <span class="muted" style="font-weight:400">${tr("was kept alive by")}</span></div>
        ${hs.map(([n, v]) => `<div class="hbar"><span>${esc(n)}</span><span class="track"><span class="fill" style="display:block;width:${(v / mx) * 100}%"></span></span><span class="num">${compact(v)}</span></div>`).join("")}</div>`;
    }).join("") || `<p class="empty">${tr("Nobody has been healed by a friend yet.")}</p>`;
  }

  const OVERVIEW_CARDS = 6; // Hall of Fame and achievement cards on the overview
  function renderFame(people) {
    const recs = fameRecords(people).sort((a, b) => !!b.fresh - !!a.fresh); // new records first
    const fresh = recs.filter(r => r.fresh);
    // New records sit in a small pill in the page bar; it opens a list that jumps to the Hall of Fame.
    $("recNews").hidden = !fresh.length;
    if (!fresh.length) $("recNews").open = false;
    $("recNews").innerHTML = fresh.length ? `<summary>${sprite("sulfuras", 1)}${tr(fresh.length === 1 ? "A record fell!" : "{0} records fell!", fresh.length)}</summary><div class="menu"><small>${state.view === "all" ? tr("last 7 days") : rangeLabel()}</small>` +
      fresh.map(r => `<button type="button" class="recchip" data-jump="s-glory-fame">${esc(r.p.name)}${ripHTML(r.p)} · ${r.t} · <b>${r.v}</b></button>`).join("") + `</div>` : "";
    const none = `<p class="empty">${tr("Records appear after the first upload.")}</p>`;
    // The overview shows a handful; the Hall of Fame page has them all, each with the runners-up.
    $("fame").innerHTML = recordsHTML(recs.slice(0, OVERVIEW_CARDS)) || none;
    $("fameAll").innerHTML = recordsHTML(recs, true) || none;
    carUpdateAll();
  }
  // A short "when" (a date) sits after the name; a long one (a spell and its target) gets its own line.
  const longWhen = r => String(r.when || "").replace(/<[^>]+>/g, "").length > 14;
  const recordsHTML = (recs, podium) => recs.map(r => `<div class="rec${r.fresh ? " fresh" : ""}"><span class="elite">${sprite("elite", 1)}</span><span class="t">${r.t}</span>`
    + `<span class="v">${r.v}${r.fresh ? `<span class="newrec">${tr("New record")}</span>` : ""}</span>`
    + `<span class="w">${nameHTML(r.p)}${r.when && !longWhen(r) ? `<span class="muted">· ${r.when}</span>` : ""}</span>`
    + (r.when && longWhen(r) ? `<span class="when">${r.when}</span>` : "")
    + (r.fresh ? `<span class="beat">${beatText(r)}</span>` : "")
    + (podium && r.top && r.top.length > 1 ? `<ol class="podium">${r.top.map((x, i) => `<li><span class="rk">${i + 1}</span><span class="nm">${nameHTML(x.p)}</span><span class="pv">${x.v}</span></li>`).join("")}</ol>` : "")
    + `</div>`).join("");
  const beatText = r => r.beat.p === r.p
    ? tr("Topped their own {0} from {1}", r.beat.v, shortDate(r.beat.k))
    : tr("Beat {0}'s {1} from {2}", esc(r.beat.p.name) + ripHTML(r.beat.p), r.beat.v, shortDate(r.beat.k));

  // Every time a daily record was raised, oldest first: who set it, on which day, and what it beat.
  function recordHistory(people, f) {
    const days = [];
    people.forEach(p => Object.entries(p.days).forEach(([k, d]) => { if ((d[f] || 0) > 0) days.push({ p, k, v: d[f] }); }));
    days.sort((a, b) => (a.k < b.k ? -1 : a.k > b.k ? 1 : 0));
    const out = [];
    let best = null;
    for (const x of days) if (!best || x.v > best.v) { out.push({ ...x, prev: best }); best = x; }
    return out;
  }
  // A record is new when it was beaten in the chosen week (the last 7 days on "all time").
  // The very first holder of a record beat nobody, so that doesn't count.
  const freshDay = k => state.view === "all" ? k >= addDays(todayKey(), -6) : inRange(k);
  const newRecord = (k, prev) => (k && prev && freshDay(k) ? { fresh: true, beat: prev } : {});

  // The best three characters for a record: each character's own best, highest first.
  // Daily records then move their holder (the first to reach it) to the front, so a tie can't show someone else at #1.
  const podiumOf = (people, best, fmt) => people.map(p => ({ p, n: best(p) })).filter(x => x.n > 0)
    .sort((a, b) => b.n - a.n).slice(0, 3).map(x => ({ p: x.p, v: fmt(x.n) }));
  const bestDay = (p, f) => Math.max(0, ...Object.values(p.days).map(d => d[f] || 0));

  function fameRecords(people) {
    const DAY = [
      ["dmg", "Most damage in one day", num], ["heal", "Most healing in one day", num], ["deaths", "Most deaths in one day", num],
      ["kb", "Most killing blows in one day", num], ["quests", "Most quests in one day", num], ["xp", "Most XP in one day", num],
      ["played", "Longest day of play", dur], ["jumps", "Most jumps in one day", num], ["dist", "Longest journey in one day", yards],
      ["goldIn", "Biggest haul in one day", goldHTML], ["levels", "Most levels in one day", num],
    ];
    const recs = [];
    DAY.forEach(([f, t, fmt]) => {
      const hist = recordHistory(people, f), best = hist[hist.length - 1];
      if (best) recs.push({ t: tr(t), v: fmt(best.v), p: best.p, when: shortDate(best.k), top: podiumOf(people, p => bestDay(p, f), fmt).sort((a, b) => (b.p === best.p) - (a.p === best.p)), ...newRecord(best.k, best.prev && { p: best.prev.p, v: fmt(best.prev.v), k: best.prev.k }) });
    });
    // Only each character's best hit is kept, so the hit it beat is the biggest one landed before it.
    const hits = people.map(p => ({ p, h: p.bestHit })).filter(x => x.h).sort((a, b) => b.h.amt - a.h.amt), hit = hits[0];
    if (hit) {
      const before = hit.h.t && hits.find(x => x.h.t && x.h.t < hit.h.t);
      recs.unshift({ t: tr("Hardest hit ever"), v: num(hit.h.amt), p: hit.p, top: hits.slice(0, 3).map(x => ({ p: x.p, v: num(x.h.amt) })), when: esc(hit.h.spell || "") + (hit.h.target ? tr(" on {0}", esc(hit.h.target)) : ""),
        ...newRecord(hit.h.t && localKey(hit.h.t), before && { p: before.p, v: num(before.h.amt), k: localKey(before.h.t) }) });
    }
    const rich = people.filter(p => p.peakGold).sort((a, b) => b.peakGold - a.peakGold)[0];
    if (rich) recs.push({ t: tr("Deepest pockets"), v: goldHTML(rich.peakGold), p: rich, top: podiumOf(people, p => p.peakGold, goldHTML), when: tr("most gold held at once") });
    let mob = null;
    people.forEach(p => Object.entries(p.kills).forEach(([m, c]) => { if (!mob || c > mob.c) mob = { p, m, c }; }));
    if (mob) {
      // each character's most hunted creature
      const fav = p => Object.entries(p.kills).sort((a, b) => b[1] - a[1])[0] || ["", 0];
      const top = people.map(p => ({ p, f: fav(p) })).filter(x => x.f[1] > 0).sort((a, b) => b.f[1] - a.f[1]).slice(0, 3)
        .map(x => ({ p: x.p, v: `${num(x.f[1])}× ${esc(x.f[0])}` }));
      recs.push({ t: tr("Most hunted creature"), v: `${num(mob.c)}× ${esc(mob.m)}`, p: mob.p, when: tr("by one friend"), top });
    }
    const lvls = people.map(p => ({ p, ch: p.chars.slice().sort((a, b) => (b.level || 0) - (a.level || 0))[0] })).filter(x => x.ch).sort((a, b) => (b.ch.level || 0) - (a.ch.level || 0));
    const lvl = lvls[0];
    if (lvl) recs.push({ t: tr("Highest level"), v: tr("Level {0}", lvl.ch.level || "?"), p: lvl.p, when: esc(lvl.ch.name),
      top: lvls.slice(0, 3).map(x => ({ p: x.p, v: tr("Level {0}", x.ch.level || "?") })) });
    return recs;
  }

  function renderTable(rows) {
    const { k, dir } = state.sort;
    const sorted = rows.slice().sort((a, b) => k === "name" ? dir * a.p.name.localeCompare(b.p.name) : dir * ((a.s[k] || 0) - (b.s[k] || 0)));
    const ariaSort = key => key === k ? ` aria-sort="${dir > 0 ? "ascending" : "descending"}"` : "";
    $("statTable").tHead.innerHTML = `<tr><th data-k="name"${ariaSort("name")}>${tr("Friend")}</th>` + TABLE_COLS.map(([ck, label]) => `<th data-k="${ck}"${ariaSort(ck)}>${tr(label)}</th>`).join("") + `</tr>`;
    $("statTable").tBodies[0].innerHTML = sorted.map(r =>
      `<tr><td><span class="nm">${nameHTML(r.p)}</span></td>` + TABLE_COLS.map(([ck, , f]) => `<td>${f(r.s[ck])}</td>`).join("") + `</tr>`).join("") ||
      `<tr><td colspan="${TABLE_COLS.length + 1}" class="empty">${tr("Nobody on the roster yet.")}</td></tr>`;
  }

  function charLine(ch) {
    const bits = [tr("Lvl {0}", esc(ch.level || "?")), esc(RACE[ch.race] || ch.race || ""), classOf(ch)[0]];
    if (ch.realm) bits.push("· " + esc(ch.realm));
    const g = gameName(ch.game, ch.realm);
    return bits.filter(Boolean).join(" ") + ` <span class="realm-tag">${esc(g === "Other" ? tr("Other") : g)}</span>`;
  }

  // ---------- games & realms ----------
  // TBC clients (2.x, e.g. the Anniversary realms since 2026) use Wowhead's TBC database and level 70;
  // Mists of Pandaria Classic (5.x) its MoP Classic database and level 90.
  const isTBC = ch => /^2\./.test(String(ch && ch.game && ch.game.version || ""));
  const isMoP = ch => /^5\./.test(String(ch && ch.game && ch.game.version || ""));
  function realmExpansion(realmChars) {
    state.mop = realmChars.some(isMoP);
    state.tbc = !state.mop && realmChars.some(isTBC);
    state.cap = state.mop || realmChars.some(c => (c.level || 0) > 70) ? 90 : state.tbc || realmChars.some(c => (c.level || 0) > 60) ? 70 : 60;
  }
  const whDomain = () => state.mop ? "mop-classic" : state.tbc ? "tbc" : "classic";
  const whItem = id => `href="https://www.wowhead.com/${whDomain()}/item=${encodeURIComponent(id)}" data-wowhead="item=${encodeURIComponent(id)}&domain=${whDomain()}"`;

  function gameName(g, realm) {
    if (g && g.demo) return "Example data";
    const v = g && g.version ? String(g.version) : "";
    const r = String(realm || "").toLowerCase();
    const rule = (CONFIG.games || []).find(x =>
      (Array.isArray(x.realms) && x.realms.some(n => String(n).toLowerCase() === r)) ||
      (Array.isArray(x.seasons) && g && x.seasons.includes(g.season)) ||
      (x.version && v && v.startsWith(String(x.version))));
    if (!rule && !v) return "Other";  // translated where it's shown
    const base = rule ? rule.name : (CONFIG.defaultGame || "WoW Forever");
    const hcRealm = rule && Array.isArray(rule.hardcoreRealms) && rule.hardcoreRealms.some(n => String(n).toLowerCase() === r);
    if (!(g && g.hardcore) && !hcRealm) return base;
    return base === "WoW Forever" ? "Hardcore Forever" : base + " Hardcore";
  }
  const realmKey = ch => gameName(ch.game, ch.realm) + "|" + (ch.realm || "Unknown realm");
  // Stats are always shown for one realm at a time. The default is the busiest realm of the default game (WoW Forever).
  const realmMatch = ch => realmKey(ch) === state.realm;
  function renderRealmPicker(allChars, live) {
    const realms = {};
    const add = (game, realm, n, last) => {
      const k = game + "|" + realm;
      const r = realms[k] ||= { game, realm, n: 0, last: 0 };
      r.n += n;
      r.last = Math.max(r.last, last || 0);
    };
    allChars.forEach(ch => add(gameName(ch.game, ch.realm), ch.realm || "Unknown realm", 1, ch.lastSeen));
    const def = CONFIG.defaultGame || "WoW Forever";
    const keys = Object.keys(realms);
    if (!keys.includes(state.realm)) {
      const withData = keys.filter(k => realms[k].n > 0 && (live ? realms[k].game !== "Example data" : true));
      withData.sort((x, y) => (realms[x].game === "Example data") - (realms[y].game === "Example data")
        || (realms[y].game === def) - (realms[x].game === def) || realms[y].n - realms[x].n || realms[y].last - realms[x].last);
      state.realm = live ? (withData[0] || keys[0] || "") : (keys.find(k => realms[k].game === "Example data" && realms[k].n) || withData[0] || keys[0] || "");
    }
    const order = g => g === def ? 0 : g === "Example data" ? 2 : 1;
    const games = [...new Set(Object.values(realms).map(r => r.game))].sort((x, y) => order(x) - order(y) || x.localeCompare(y));
    const sel = $("realmSel");
    sel.innerHTML = games.map(g => `<optgroup label="${esc(g === "Other" || g === "Example data" ? tr(g) : g)}">` +
      Object.entries(realms).filter(([, r]) => r.game === g).sort((x, y) => (y[1].n > 0) - (x[1].n > 0) || x[1].realm.localeCompare(y[1].realm))
        .map(([k, r]) => `<option value="${esc(k)}">${esc(r.realm === "Unknown realm" ? tr("Unknown realm") : r.realm)}${r.n ? ` (${r.n})` : ""}</option>`).join("") + `</optgroup>`).join("");
    sel.value = state.realm;
  }
  const realmLabel = () => !state.realm ? "" : state.realm.replace("|", " · ");

  // ---------- profile pages ----------
  const SIG = [
    ["dmg", "Damage dealt", compact, "Hits the hardest"], ["heal", "Healing done", compact, "Keeps everyone alive"],
    ["kb", "Killing blows", num, "Steals the kills"], ["deaths", "Deaths", num, "Dies the most"],
    ["quests", "Quests completed", num, "Actually reads the quests"], ["xp", "Experience earned", compact, "Levels like mad"],
    ["goldIn", "Gold looted", goldHTML, "Richest of the bunch"], ["dist", "Distance traveled", yards, "Always running somewhere"],
    ["jumps", "Jumps", num, "Can't stop jumping"], ["played", "Time played", dur, "Basically lives in Azeroth"],
    ["ghost", "Time as a ghost", dur, "Spends ages dead"], ["taxi", "Time on flight paths", dur, "Loves a flight path"],
    ["afk", "Time AFK", dur, "Always AFK"], ["dungeons", "Dungeon runs", num, "Dungeon regular"],
    ["taken", "Damage taken", compact, "Damage sponge"], ["healedBy", "Healing received", compact, "Needs the most healing"],
    ["overkill", "Overkill", compact, "Keeps hitting dead things"], ["whiffs", "Missed attacks", num, "Swings at air"],
    ["dodges", "Dodges", num, "Slippery"], ["msgs", "Chat messages", num, "Never stops talking"],
    ["sorry", "Apologies", num, "Always apologizing"], ["lol", "lols", num, "Laughs at everything"],
    ["emotes", "Emotes", num, "Emotes constantly"], ["hearth", "Hearthstones", num, "Hearths home a lot"],
    ["q4", "Epic drops", num, "Purple luck"], ["q0", "Grey items looted", num, "Hoards vendor trash"],
    ["repair", "Repair bills", goldHTML, "Breaks all the gear"], ["duelsWon", "Duels won", num, "Duel champion"],
    ["casts", "Spells cast", compact, "Button masher"], ["fallDmg", "Fall damage", num, "Gravity's best friend"],
    ["critRate", "Crit rate", pct, "Crits like crazy", s => (s.hits || 0) >= 100],
  ];

  // Stats where this friend is furthest ahead of everyone else.
  function signatureStats(p, rowsAll) {
    const mine = rowsAll.find(r => r.p === p);
    if (!mine) return [];
    const others = rowsAll.filter(r => r !== mine);
    const out = [];
    for (const [k, label, fmt, tag, ok] of SIG) {
      const v = mine.s[k] || 0;
      if (!v || (ok && !ok(mine.s))) continue;
      const vals = rowsAll.filter(r => !ok || ok(r.s)).map(r => r.s[k] || 0).sort((a, b) => b - a);
      const rank = vals.indexOf(v) + 1;
      const otherVals = others.filter(r => !ok || ok(r.s)).map(r => r.s[k] || 0);
      const avg = otherVals.length ? otherVals.reduce((a, b) => a + b, 0) / otherVals.length : 0;
      const ratio = avg > 0 ? v / avg : (otherVals.length ? 10 : 1);
      const score = ratio * (rank === 1 && otherVals.length ? 1.5 : 1);
      out.push({ k, label: tr(label), value: fmt(v), tag: tr(tag), rank, total: vals.length, ratio, avg, score });
    }
    return out.sort((a, b) => b.score - a.score);
  }

  function achievementsHeld(p, rowsAll) {
    const held = [];
    for (const a of ACH) {
      let best = 0, winners = [];
      for (const r of rowsAll) {
        const v = a.k(r.s) || 0;
        if (v > best) { best = v; winners = [r]; } else if (v === best && v > 0) winners.push(r);
      }
      const w = winners.find(r => r.p === p);
      if (best && w) held.push({ a, s: w.s, tied: winners.length > 1 });
    }
    return held;
  }

  const SLOT_NAMES = { 1: "Head", 2: "Neck", 3: "Shoulder", 4: "Shirt", 5: "Chest", 6: "Waist", 7: "Legs", 8: "Feet", 9: "Wrist", 10: "Hands",
    11: "Finger", 12: "Finger", 13: "Trinket", 14: "Trinket", 15: "Back", 16: "Main Hand", 17: "Off Hand", 18: "Ranged", 19: "Tabard" };
  const QCOL = ["#9d9d9d", "#ffffff", "#1eff00", "#3d9bff", "#c06cff", "#ff8000"];
  function slotHTML(gear, slot) {
    const it = gear["s" + slot];
    const slotName = tr(SLOT_NAMES[slot]);
    if (!it || !it.n) return `<div class="slot empty"><span class="ic">${slotName.slice(0, 2)}</span><span class="it"><span class="nm">${slotName}</span></span></div>`;
    const qc = QCOL[it.q] || QCOL[1];
    const name = it.id
      ? `<a ${whItem(it.id)} data-wh-icon-size="small" target="_blank" rel="noopener">${esc(it.n)}</a>`
      : `<span class="nm">${esc(it.n)}</span>`;
    return `<div class="slot" style="--qc:${qc}"><span class="ic">${slotName.slice(0, 2)}</span><span class="it">${name}<small>${slotName}${it.il ? " · " + tr("item level {0}", esc(it.il)) : ""}</small></span></div>`;
  }

  // Blizzard's face render, pixelated to match the site (drawn by drawFaces); the class icon when there is none.
  function portraitHTML(ch) {
    const lvl = `<b class="lvl">${esc(ch.level || "?")}</b>`;
    if (!ch.avatar && !CLASS[ch.class]) return `<div class="emblem">${esc(ch.level || "?")}</div>`;
    const icon = CLASS[ch.class] ? classIcon(ch, 4) : "";
    if (!ch.avatar) return `<div class="emblem portrait">${icon}${lvl}</div>`;
    return `<div class="emblem portrait"><canvas class="face" width="32" height="32" data-src="${esc(ch.avatar)}" role="img" aria-label="${esc(ch.name)}"></canvas><span class="alt" hidden>${icon}</span>${lvl}</div>`;
  }
  function drawFaces(root) {
    root.querySelectorAll("canvas.face[data-src]").forEach(cv => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => { const g = cv.getContext("2d"); g.imageSmoothingQuality = "high"; g.drawImage(img, 0, 0, 32, 32); };
      img.onerror = () => { cv.hidden = true; cv.nextElementSibling.hidden = false; };
      img.src = cv.dataset.src;
    });
  }

  function sheetHTML(ch, color) {
    const gear = ch.gear && typeof ch.gear === "object" ? ch.gear : {};
    const items = Object.entries(gear).filter(([s, it]) => it && it.il && s !== "s4" && s !== "s19");
    const avgIlvl = items.length ? Math.round(items.reduce((a, [, it]) => a + it.il, 0) / items.length) : 0;
    const talents = Array.isArray(ch.talents) ? ch.talents.filter(t => t && t.n) : [];
    const spec = talents.slice().sort((a, b) => (b.p || 0) - (a.p || 0))[0];
    const profs = Array.isArray(ch.professions) ? ch.professions.filter(x => x && x.n) : [];
    const [cname] = classOf(ch);
    const head = `<div class="sheet-head">
        <span>${classIcon(ch)} <b>${esc(ch.name)}</b>${ripHTML(ch)} <span class="muted">${tr("Level {0} {1} {2}", esc(ch.level || "?"), esc(RACE[ch.race] || ch.race || ""), cname)}${ch.realm ? " · " + esc(ch.realm) : ""}${ch.guild ? " · &lt;" + esc(ch.guild) + "&gt;" : ""}</span></span>
        ${talents.length ? `<span class="talents">${spec && spec.p ? `<span class="spec">${esc(spec.n)} ${esc(cname)}</span>` : ""}${talents.map(t => `<span class="talent">${esc(t.n)} <b>${num(t.p)}</b></span>`).join("")}</span>`
          : ch.spec ? `<span class="talents"><span class="spec">${esc(ch.spec)} ${esc(cname)}</span></span>` : ""}
      </div>`;
    if (!Object.keys(gear).length) {
      return head + `<div class="mid solo" style="--c:${color}">${portraitHTML(ch)}</div><p class="empty">${ch.self ? tr("Gear appears after this character logs in with the latest FunStats.") : tr("Gear appears once this character has the Ledger app, or after the next armory update.")}</p>`;
    }
    const left = [1, 2, 3, 15, 5, 4, 19, 9], right = [10, 6, 7, 8, 11, 12, 13, 14];
    return head + `<div class="doll" style="--c:${color}">
        <div class="slots">${left.map(s => slotHTML(gear, s)).join("")}</div>
        <div class="mid">${portraitHTML(ch)}<div class="ilvl"><b>${avgIlvl || ch.ilvl || "–"}</b><span>${tr("avg item level")}</span></div></div>
        <div class="slots">${right.map(s => slotHTML(gear, s)).join("")}</div>
      </div>
      <div class="weapons">${[16, 17, 18].map(s => slotHTML(gear, s)).join("")}</div>
      ${ch.armory ? `<p class="muted" style="font-size:13px">${tr("Gear from the Blizzard armory. Fun stats need the FunStats addon.")}</p>` : ""}
      ${profs.length ? `<div class="profs">${profs.map(x => `<div class="prof"><span>${esc(x.n)}</span><span class="track"><span class="fill" style="width:${Math.min(100, (x.r / Math.max(1, x.m || 300)) * 100)}%"></span></span><span class="num">${num(x.r)} / ${num(x.m || 300)}</span></div>`).join("")}</div>` : ""}`;
  }

  function renderProfile(people, pid) {
    const p = people.find(x => x.id === pid);
    if (!p) {
      $("pHero").innerHTML = `<h2>${tr("Not found")}</h2><p class="muted">${tr("There's no character with that link.")} <a class="back" href="#">${tr("Back to the Ledger")}</a></p>`;
      $("p-compare").classList.add("is-empty");
      ["pSig", "pAch", "pSheet", "pBests", "pDeaths", "pHeat", "pZones", "pLoot", "pNemesis", "pCharPick", "pLately"].forEach(id => $(id).innerHTML = "");
      ["cPDaily", "cPRace", "cPSpells", "cPCause"].forEach(id => drawChart(id, null));
      $("pBosses").tHead.innerHTML = $("pBosses").tBodies[0].innerHTML = "";
      return;
    }
    document.title = `${nameTxt(p)} · Azeroth Ledger`;
    const rowsAll = people.map(x => ({ p: x, s: sumFor(x, true) }));
    const s = rowsAll.find(r => r.p === p).s;
    const sig = signatureStats(p, rowsAll);
    const top = p.chars.slice().sort((a, b) => (b.level || 0) - (a.level || 0))[0];
    const main = p.chars[0];

    $("pHero").style.setProperty("--c", p.color);
    $("profile").classList.toggle("fallen", !!p.fallen);
    const render = main && blizzImg(main.render);
    $("pHero").classList.toggle("has-render", !!render);
    $("pHero").style.setProperty("--render", render ? `url('${render}')` : "none");
    // "Same player" uses the addon's public account id; it never links accounts the addon didn't see.
    const otherChars = (state.allChars || []).filter(c => main && main.owner && !String(main.owner).startsWith("char:") && c.owner === main.owner && c.key !== main.key);
    $("pHero").innerHTML = `
      <span class="eyebrow">${main ? `${tr("Lvl {0}", esc(main.level || "?"))} ${esc(RACE[main.race] || main.race || "")} ${classOf(main)[0]}` : tr("Adventurer")}${main && main.guild ? ` · ${guildLink(main)}` : ""} · ${esc(realmLabel())}</span>
      <h2 id="pName">${main ? classIcon(main, 4) : ""}${esc(p.name)}${ripHTML(p, 2)}</h2>
      ${sig[0] ? `<p class="known">${tr("Known for: {0}", esc(sig[0].tag))}</p>` : ""}
      ${p.fallen ? `<div class="rip-banner"><span class="gicon">${sprite("tomb", 3)}</span><div><b>${tr("Fallen")}</b><span>${deathWhat(p.fallen)}.</span><span class="gwhen">${tr("Level {0}", esc(p.fallen.lvl || "?"))} · ${fullDate(p.fallen.t)}</span></div></div>`
        : state.hc ? `<p class="known">${tr("Still alive. Death is permanent in Hardcore.")}</p>` : ""}
      <div class="facts">
        <div><b>${top ? esc(top.level || "?") : "–"}</b><span>${tr("highest level")}</span></div>
        <div><b>${dur(s.played)}</b><span>${tr("played")}</span></div>
        <div><b>${compact(s.dmg)}</b><span>${tr("damage")}</span></div>
        ${state.hc ? `<div${p.fallen ? ` class="dead"` : ""}><b>${tr(p.fallen ? "Fallen" : "Alive")}</b><span>${tr("Hardcore")}</span></div>` : `<div><b>${num(p.deaths.length || s.deaths)}</b><span>${tr("deaths")}</span></div>`}
      </div>
      ${otherChars.length ? `<div style="display:grid;gap:6px"><span class="eyebrow">${tr("Other characters by this player")}</span><div class="chips">${otherChars.map(c => `<a class="chip" href="${charHref(c.key)}">${classIcon(c)}${esc(c.name)}${ripHTML(c)} <span class="muted">${tr("Lvl {0}", esc(c.level || "?"))} · ${esc(c.realm || "")}</span></a>`).join("")}</div></div>` : ""}`;
    renderCompare(p, people);

    $("pSig").innerHTML = sig.slice(0, 6).map(x => `<div class="frame sigc" style="--c:${p.color}">
        <span class="lbl">${x.label}</span><span class="val">${x.value}</span>
        <span class="tag">${x.rank === 1 && x.total > 1 ? `<span class="rank1">#1</span>` : ""}${esc(x.tag)}</span>
        <span class="cmp">${x.total > 1 ? tr("#{0} of {1}", x.rank, x.total) + (x.avg > 0 ? tr(" · {0}× the others' average", x.ratio >= 10 ? dec(x.ratio, 0) : dec(x.ratio, 1)) : "") : tr("Only one with this stat so far")}</span>
      </div>`).join("") || `<p class="empty">${tr("No stats yet. They appear after {0}'s first synced session.", esc(p.name))}</p>`;

    // character sheet with a picker for alts
    if (!p.chars.some(ch => ch.key === state.profileChar)) state.profileChar = main && main.key;
    $("pCharPick").innerHTML = p.chars.length > 1 ? p.chars.map(ch => `<button type="button" class="chip" data-key="${esc(ch.key)}" aria-pressed="${ch.key === state.profileChar}">${classIcon(ch)}${esc(ch.name)}${ripHTML(ch)}</button>`).join("") : "";
    const ch = p.chars.find(c => c.key === state.profileChar);
    $("pSheet").innerHTML = ch ? sheetHTML(ch, p.color) : `<p class="empty">${tr("No characters yet.")}</p>`;
    drawFaces($("pSheet"));

    const held = achievementsHeld(p, rowsAll);
    $("pAch").innerHTML = held.map(({ a, s: hs, tied }) => `<div class="ach${a.shame ? " shame" : ""}">${achIcon(a)}
      <div><div class="t">${tr(a.t)}${tied ? ` <span class="muted" style="font-size:12px">${tr("(tied)")}</span>` : ""}</div><div class="d">${a.v(hs)}</div></div></div>`).join("")
      || `<p class="empty">${tr("No achievements held yet. Someone else is ahead on everything, for now.")}</p>`;

    // daily damage & healing, last 30 days played
    const days = Object.keys(p.days).sort().slice(-30);
    drawChart("cPDaily", days.length ? {
      type: "line",
      data: { labels: days.map(shortDate), datasets: [
        { label: tr("Damage"), data: days.map(k => p.days[k].dmg || 0), borderColor: p.color, area: true },
        { label: tr("Healing"), data: days.map(k => p.days[k].heal || 0), borderColor: "#4ade80", borderDash: [5, 5] },
      ] },
      options: { scales: { x: gridX, y: { ...gridY, beginAtZero: true, ticks: { ...gridY.ticks, callback: v => compact(v) } } },
        plugins: { tooltip: { callbacks: { label: c => ` ${c.dataset.label}: ${num(c.raw)}` } } } },
    } : null);
    renderRace([p], "cPRace", "date");

    const sp = Object.entries(p.spellDmg).sort((a, b) => b[1] - a[1]).slice(0, 10);
    const spTot = Object.values(p.spellDmg).reduce((a, b) => a + b, 0) || 1;
    drawChart("cPSpells", sp.length ? {
      type: "bar",
      data: { labels: sp.map(x => x[0]), datasets: [{ label: tr("Damage"), data: sp.map(x => x[1]), backgroundColor: p.color, borderRadius: 4 }] },
      options: { indexAxis: "y", scales: { x: { ...gridY, ticks: { callback: v => compact(v) } }, y: { ...gridX, ticks: { color: css("--accent") } } },
        plugins: { legend: { display: false }, tooltip: { callbacks: {
          label: c => " " + tr("{0} damage ({1}%)", num(c.raw), dec((c.raw / spTot) * 100, 1)),
          afterLabel: c => { const n = p.casts[sp[c.dataIndex][0]]; return n ? " " + tr("{0} casts", num(n)) : ""; },
        } } } },
    } : null);

    causeChart("cPCause", p.deaths, "right");
    const killers = {};
    p.deaths.forEach(d => { if (d.by) killers[d.by] = (killers[d.by] || 0) + 1; });
    const kTop = Object.entries(killers).sort((a, b) => b[1] - a[1]).slice(0, 5);
    const kMax = Math.max(1, ...kTop.map(k => k[1]));
    $("pNemesis").innerHTML = kTop.map(([n, c]) => `<div class="hbar bad"><span>${esc(n)}</span><span class="track"><span class="fill" style="display:block;width:${(c / kMax) * 100}%"></span></span><span class="num">${c}</span></div>`).join("")
      || `<p class="empty">${tr("No creature has killed {0} yet.", esc(p.name))}</p>`;

    // Bosses in the order they first fell, so a leveling character's list reads like their journey.
    const pLabel = instLabeler(p.bosses);
    const bosses = p.bosses.slice().sort((a, b) => (a.first || Infinity) - (b.first || Infinity));
    $("pBosses").tHead.innerHTML = `<tr><th>${tr("Boss")}</th><th>${tr("Kills")}</th><th>${tr("Wipes")}</th><th>${tr("Fastest")}</th><th>${tr("Best DPS")}</th><th>${tr("Best HPS")}</th><th>${tr("First kill")}</th></tr>`;
    $("pBosses").tBodies[0].innerHTML = bosses.map(b => `<tr><td><b>${esc(b.n)}</b><br><span class="muted" style="font-size:12px">${pLabel(b)}</span></td><td>${num(b.kills)}</td><td>${num(b.wipes)}</td>
        <td>${clock(b.fast)}</td><td>${b.dps ? num(b.dps) : "–"}</td><td>${b.hps ? num(b.hps) : "–"}</td><td>${b.first ? dayText(b.first) + (b.lvl ? ` <span class="muted">${tr("Lvl {0}", esc(b.lvl))}</span>` : "") : "–"}</td></tr>`).join("")
      || `<tr><td colspan="7" class="empty">${tr("No bosses defeated yet. They're recorded from FunStats 1.3 on.")}</td></tr>`;

    $("pBests").innerHTML = recordsHTML(fameRecords([p])) ||`<p class="empty">${tr("Personal bests appear after the first synced session.")}</p>`;
    $("pDeaths").innerHTML = p.deaths.slice().sort((a, b) => b.t - a.t).slice(0, 30).map(d => deathLine(p, d, true)).join("") || `<p class="empty">${tr("{0} hasn't died yet. Impressive.", esc(p.name))}</p>`;
    $("pHeat").innerHTML = heatHTML(p.heat);
    const zs = Object.entries(p.zones).sort((a, b) => b[1] - a[1]).slice(0, 8);
    const zMax = Math.max(1, ...zs.map(z => z[1]));
    $("pZones").innerHTML = zs.map(([z, v]) => `<div class="hbar acc" data-tip="${esc(z)}|${dur(v)}"><span>${esc(z)}</span><span class="track"><span class="fill" style="display:block;width:${(v / zMax) * 100}%"></span></span><span class="num">${dec(v / 3600, 1)} h</span></div>`).join("")
      || `<p class="empty">${tr("Zones appear once {0} has played with the addon.", esc(p.name))}</p>`;
    const loot = p.notable.filter(n => n.q >= 3).sort((a, b) => (b.t || 0) - (a.t || 0)).slice(0, 30);
    const lootLine = n => {
      const name = n.id ? `<a class="q${n.q}" ${whItem(n.id)} target="_blank" rel="noopener">[${esc(n.item)}]</a>` : `<span class="q${n.q}">[${esc(n.item)}]</span>`;
      return `<div>${name}${n._char && n._char !== p.name ? ` <span class="muted">${tr("on {0}", esc(n._char))}</span>` : ""} <span class="muted" style="font-size:13px">${n.t ? new Date(n.t * 1000).toLocaleDateString(LOC(), { month: "short", day: "numeric" }) : ""}</span></div>`;
    };
    $("pLoot").innerHTML = loot.map(lootLine).join("") || `<p class="empty">${tr("No rare drops yet.")}</p>`;
    // Lately: fills the space beside the gear with the newest loot and deaths.
    const lastDeaths = p.deaths.slice().sort((a, b) => b.t - a.t).slice(0, 3);
    $("pLately").innerHTML =
      `<div class="lh">${tr("Best loot")}</div><div class="loot">${loot.slice(0, 5).map(lootLine).join("") || `<p class="empty">${tr("No rare drops yet.")}</p>`}</div>` +
      `<div class="lh">${tr("Recent deaths")}</div><div class="clog">${lastDeaths.map(d => deathLine(p, d, true)).join("") || `<p class="empty">${tr("{0} hasn't died yet. Impressive.", esc(p.name))}</p>`}</div>`;

    if (window.$WowheadPower && window.$WowheadPower.refreshLinks) { try { window.$WowheadPower.refreshLinks(); } catch (e) { /* tooltips are optional */ } }
  }

  // Two characters side by side, all time.
  function renderCompare(p, people) {
    const others = people.filter(x => x !== p);
    $("p-compare").classList.toggle("is-empty", !others.length);
    if (!others.length) return;
    const dmgAll = x => sumFor(x, true).dmg || 0;
    if (!others.some(x => x.id === state.compareWith)) state.compareWith = others.slice().sort((a, b) => dmgAll(b) - dmgAll(a))[0].id;
    $("cmpSel").innerHTML = others.map(x => `<option value="${esc(x.id)}">${esc(nameTxt(x))}</option>`).join("");
    $("cmpSel").value = state.compareWith;
    const q = others.find(x => x.id === state.compareWith);
    const a = sumFor(p, true), b = sumFor(q, true);
    const ROWS = [
      ["Level", x => (x.chars[0] && x.chars[0].level) || 0, v => v], ["Time played", "played", dur], ["Damage dealt", "dmg", num],
      ["Healing done", "heal", num], ["Killing blows", "kb", num], ["Deaths", "deaths", num], ["Quests completed", "quests", num],
      ["Gold looted", "goldIn", goldHTML], ["Jumps", "jumps", num], ["Distance", "dist", yards], ["Crit rate", "critRate", pct],
      ["Biggest hit", "maxHit", num], ["Dungeon runs", "dungeons", num], ["Duels won", "duelsWon", num],
    ];
    const cell = (side, v, max, fmt, win, color) => `<div class="side ${side}${win ? " win" : ""}"><span class="val">${fmt(v)}</span><span class="bar" style="width:${max ? Math.max(2, (v / max) * 100) : 2}%;--cc:${color}"></span></div>`;
    $("cmpBody").innerHTML = `<span class="who l">${nameHTML(p)}</span><span></span><span class="who">${nameHTML(q)}</span>` + ROWS.map(([label, f, fmt]) => {
      const va = typeof f === "function" ? f(p) : a[f] || 0, vb = typeof f === "function" ? f(q) : b[f] || 0;
      const max = Math.max(va, vb);
      return cell("l", va, max, fmt, va > vb, p.color) + `<span class="lab">${tr(label)}</span>` + cell("r", vb, max, fmt, vb > va, q.color);
    }).join("");
  }

  function renderGroup(people) {
    $("chars").innerHTML = people.map(p => {
      const total = {};
      for (const d of Object.values(p.days)) for (const [f, v] of Object.entries(d)) if (typeof v === "number" && f !== "maxHit") total[f] = (total[f] || 0) + v;
      const topKills = Object.entries(p.kills).sort((a, b) => b[1] - a[1]).slice(0, 3);
      const loot = p.notable.filter(x => x.q >= 3).sort((a, b) => (b.t || 0) - (a.t || 0)).slice(0, 4);
      const onlyObserved = p.chars.length && p.chars.every(ch => !ch.self);
      const rowsHTML = p.chars.map((ch, i) => `<li><span class="cn">${classIcon(ch)}${esc(ch.name)}${ripHTML(ch)}</span>${p.chars.length > 1 && i === 0 ? `<span class="badge">${tr("Main")}</span>` : ""}<span class="meta">${charLine(ch)}${ch.guild ? " · " + guildLink(ch) : ""}${ch.self ? "" : " · " + tr("seen by friends")}</span></li>`).join("");
      return `<div class="frame char" style="--c:${p.color}">
        <div><h3><a class="plink" href="${profileHref(p)}"><span class="cname">${esc(p.name)}</span>${ripHTML(p)}</a></h3><span class="muted">${tr(p.deaths.length === 1 ? "{0} death" : "{0} deaths", num(p.deaths.length))}${total.played ? " · " + tr("{0} played", dur(total.played)) : ""}</span></div>
        <ul class="alts">${rowsHTML}</ul>
        <dl class="kv">
          <dt>${tr("Damage dealt")}</dt><dd>${num(total.dmg)}</dd>
          <dt>${tr("Healing done")}</dt><dd>${num(total.heal)}</dd>
          <dt>${tr("Killing blows")}</dt><dd>${num(total.kb)}</dd>
          <dt>${tr("Biggest hit")}</dt><dd>${p.bestHit ? `${num(p.bestHit.amt)} ${esc(p.bestHit.spell || "")}` : "–"}</dd>
          ${onlyObserved ? "" : `<dt>${tr("Most gold held")}</dt><dd>${goldHTML(p.peakGold)}</dd><dt>${tr("Quests")}</dt><dd>${num(total.quests)}</dd>`}
        </dl>
        ${onlyObserved ? `<p class="muted" style="font-size:13px">${tr("Recorded by friends' addons. Installing FunStats adds jumps, gold, loot and more.")}</p>` : ""}
        ${topKills.length ? `<div><span class="eyebrow">${tr("Most killed")}</span><div class="loot">${topKills.map(([n, c]) => `<span>${esc(n)} <span class="muted">×${c}</span></span>`).join("")}</div></div>` : ""}
        ${loot.length ? `<div><span class="eyebrow">${tr("Best loot")}</span><div class="loot">${loot.map(l => `<span class="q${l.q}">[${esc(l.item)}]</span>`).join("")}</div></div>` : ""}
      </div>`;
    }).join("") || `<p class="empty" style="text-align:center">${tr("Nobody here yet. Characters appear once their stats have been uploaded.")}</p>`;
  }

  // Guild overview: the roster beside the deeds, plus the guild's newest loot and deaths.
  // Who leads each stat in the chosen range.
  const LEAD = [["sword", "Damage dealt", "dmg", compact], ["heart", "Healing done", "heal", compact], ["axe", "Killing blows", "kb", num],
    ["skull", "Deaths", "deaths", num], ["scroll", "Quests completed", "quests", num], ["coin", "Gold looted", "goldIn", goldHTML],
    ["clock", "Time played", "played", dur], ["spring", "Jumps", "jumps", num], ["boot", "Distance", "dist", yards]];
  // The guild page leaves out the <guild> tag, since everyone there shares it.
  const leadsHTML = (rows, n = LEAD.length, guilds = true) => LEAD.slice(0, n).map(([icon, label, f, fmt]) => {
    const best = rows.slice().sort((a, b) => (b.s[f] || 0) - (a.s[f] || 0))[0];
    const g = guilds && best && best.p.chars[0] && best.p.chars[0].guild ? guildLink(best.p.chars[0]) : "";
    return best && best.s[f] ? `<div class="glead${guilds ? " wg" : ""}">${zam(WOWICON[icon], 18)}<span class="lbl">${tr(label)}</span>${guilds ? `<span class="gtag">${g}</span>` : ""}<a class="plink" href="${profileHref(best.p)}"><span class="cname" style="--cc:${classOf(best.p.chars[0])[1]}">${esc(best.p.name)}</span></a><span class="n">${fmt(best.s[f])}</span></div>` : "";
  }).join("");

  function renderGuildSide(rows, people) {
    const list = rows.slice().sort((a, b) => (b.s.dmg || 0) - (a.s.dmg || 0) || (b.p.chars[0].level || 0) - (a.p.chars[0].level || 0));
    $("gRoster").innerHTML = list.map(({ p, s }) => {
      const ch = p.chars[0];
      const deaths = p.deaths.filter(d => d.t && inRange(localKey(d.t))).length || s.deaths || 0;
      return `<div class="grow">
        <span class="who"><a class="plink" href="${profileHref(p)}">${classIcon(ch)}<span class="cname" style="--cc:${classOf(ch)[1]}">${esc(p.name)}</span>${ripHTML(p)}</a>
          <small>${[tr("Lvl {0}", esc(ch.level || "?")), esc(RACE[ch.race] || ch.race || ""), classOf(ch)[0]].filter(Boolean).join(" ")}</small></span>
        <span class="n">${compact(s.dmg)}<small>${tr("damage")}</small></span>
        <span class="n${deaths ? " red" : ""}">${num(deaths)}<small>${tr("deaths")}</small></span>
      </div>`;
    }).join("") || `<p class="empty">${tr("Nobody here yet. Characters appear once their stats have been uploaded.")}</p>`;
    $("gCount").textContent = tr(list.length === 1 ? "{0} member" : "{0} members", num(list.length));
    $("oLeads").innerHTML = leadsHTML(rows, LEAD.length, false) || `<p class="empty">${tr("No stats yet.")}</p>`;

    const loot = people.flatMap(p => p.notable.filter(n => n.q >= 3).map(n => ({ n, p }))).sort((a, b) => (b.n.t || 0) - (a.n.t || 0)).slice(0, 5);
    const deaths = people.flatMap(p => p.deaths.filter(d => d.t).map(d => ({ d, p }))).sort((a, b) => b.d.t - a.d.t).slice(0, 4);
    const item = n => n.id
      ? `<a class="q${n.q}" ${whItem(n.id)} target="_blank" rel="noopener">[${esc(n.item)}]</a>`
      : `<span class="q${n.q}">[${esc(n.item)}]</span>`;
    $("gLately").innerHTML =
      `<div class="lh">${tr("Best loot")}</div><div class="loot">${loot.map(({ n, p }) => `<div>${item(n)} <span class="muted">${tr("on {0}", esc(n._char || p.name))}</span></div>`).join("") || `<p class="empty">${tr("No rare drops yet.")}</p>`}</div>` +
      `<div class="lh">${tr("Recent deaths")}</div><div class="clog">${deaths.map(({ d, p }) => deathLine(p, d, true)).join("") || `<p class="empty">${tr("No deaths yet.")}</p>`}</div>`;
  }

  const profileRoute = () => { const r = parseRoute(); return r.kind === "char" ? r.key : null; };

  // One-line card texts that are a little too long shrink to fit (down to 10.5px) instead of being cut off;
  // whatever still doesn't fit keeps its ellipsis and shows the full text on hover.
  const FIT = ".tile .foot, .ach .t, .ach .d, .rec .t, .rec .w .muted, .rec .when, .rec .beat, .glead .lbl, .sigc .cmp, .sec-head p";
  function fitText() {
    document.querySelectorAll(FIT).forEach(el => {
      if (!el.offsetWidth) return;
      el.style.fontSize = "";
      let size = parseFloat(getComputedStyle(el).fontSize);
      while (el.scrollWidth > el.clientWidth + 1 && size > 10.5) { size -= .5; el.style.fontSize = size + "px"; }
      if (el.scrollWidth > el.clientWidth + 1) el.title = el.textContent.trim(); else el.removeAttribute("title");
    });
  }
  let fitTimer = 0;
  window.addEventListener("resize", () => { clearTimeout(fitTimer); fitTimer = setTimeout(fitText, 150); });

  function render() {
    // No example data while the ledger loads: show the loader until there's something real to draw.
    document.body.classList.toggle("loading", state.status === "loading");
    if (state.status === "loading") { $("loaderText").textContent = tr("Opening the ledger…"); return; }
    requestAnimationFrame(fitText); // after this render has laid the page out
    const d = state.data;
    const real = characters(d);
    // ?demo shows only the example data (for screenshots and trying the site out)
    const demoOnly = /[?&]demo\b/.test(location.search);
    const live = state.status === "ok" && real.length > 0 && !demoOnly;
    // Example characters are only added while nobody has uploaded yet, on their own "Example data" realms.
    const allChars = live ? real : (demoOnly ? [] : real).concat(characters(demoData()));
    state.allChars = allChars;
    // Hardcore: a character's first death is its last.
    allChars.forEach(c => {
      const hc = /Hardcore/.test(gameName(c.game, c.realm)) || /Hardcore/.test(c.realm || "") || (c.game && c.game.hardcore);
      c.fallen = hc ? c.deaths.reduce((a, d) => d && d.t && (!a || d.t < a.t) ? d : a, null) : null;
    });

    // Character and guild links carry their own realm.
    const route = parseRoute();
    if (route.kind === "char") { const c = allChars.find(x => x.key === route.key); if (c) state.realm = realmKey(c); }
    if (route.kind === "guild") state.realm = route.realm;
    renderRealmPicker(allChars, live);
    const realmChars = allChars.filter(realmMatch);
    realmExpansion(realmChars);
    $("h-race").textContent = tr("The Race to {0}", state.cap);
    state.demo = state.realm.startsWith("Example data|");

    // Who the stats are compared against: the realm, the guild, or (on a character page) its guild.
    let scope = realmChars, focus = null;
    state.scopeGuild = null;
    if (route.kind === "guild") scope = realmChars.filter(c => (c.guild || "") === route.guild);
    if (route.kind === "char") {
      focus = realmChars.find(c => c.key === route.key) || null;
      const mates = focus && focus.guild ? realmChars.filter(c => c.guild === focus.guild) : [];
      if (mates.length > 1) { scope = mates; state.scopeGuild = focus.guild; }
    }

    const theme = document.documentElement.dataset.theme || "fel";
    document.querySelectorAll(".theme-btn").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.theme === theme)));
    document.querySelectorAll(".lang-btn").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.lang === LANG)));

    // Every character stands on its own.
    const players = Object.fromEntries(scope.map(c => [c.key, { name: c.name, chars: [c.key] }]));
    const people = buildPeople(scope, players).people.filter(p => p.chars.length);
    state.hc = /Hardcore/.test(state.realm) || realmChars.some(c => c.game && c.game.hardcore);
    people.forEach(p => { p.fallen = p.chars.map(c => c.fallen).find(Boolean) || null; });
    state.people = people;
    renderNav(people, route);

    const banner = {
      unconfigured: tr("<strong>Example data.</strong> This site isn't connected to Supabase yet. Add your project URL and publishable key in <code>config.js</code>."),
      error: tr("<strong>Couldn't reach the ledger.</strong> Showing example data instead. Try reloading in a minute."),
    }[state.status] || (state.demo
      ? tr("<strong>Example data.</strong> These characters are made up so you can see how the site works. Pick your realm in the Realm menu, or get the addon to add your own.")
      : !realmChars.length ? tr("<strong>No stats on {0} yet.</strong> Be the first: get the addon and play.", esc(realmLabel())) : "");
    $("demoBanner").hidden = !banner;
    $("bannerText").innerHTML = banner;

    $("app").dataset.route = route.kind === "char" ? "profile" : route.kind;
    renderScopeHead(route, people);
    if (route.kind === "char") {
      renderProfile(people, route.key);
      return;
    }
    document.title = route.kind === "guild" ? `<${route.guild}> · Azeroth Ledger` : "Azeroth Ledger";

    $("app").dataset.view = state.view;
    document.body.dataset.view = state.view;
    renderWeekSelect(people);

    const rows = people.map(p => ({ p, s: sumFor(p) }));
    const active = rows.filter(r => Object.keys(r.s).length > 5);
    renderTiles(rows, people);
    if (route.kind === "guild") renderGuildSide(rows, people);
    if (route.kind === "main") {
      renderGuilds(realmChars);
      $("oLeads").innerHTML = leadsHTML(rows, 7) || `<p class="empty">${tr("No stats yet.")}</p>`;
    }
    renderMomentum(people);
    renderStandings(rows);
    renderLootQuality(rows, people);
    renderAchievements(active);
    renderMeter(active.length ? active : rows);
    renderDaily(people);
    renderDeaths(people);
    renderGraveyard(people);
    renderDungeons(people);
    renderMap(people);
    renderCombat(active);
    renderLoot(active, people);
    renderTable(rows);
    renderRace(people);
    renderWealth(people);
    renderWorld(people);
    renderSpells(people);
    renderBonds(people);
    renderFame(people);
    renderGroup(people);
    $("charH").textContent = tr(route.kind === "guild" ? "Guild Roster" : "Characters");

    // Next to the week picker: just the dates the page covers.
    $("subtitle").textContent = state.view === "week"
      ? `${shortDate(state.week)} – ${shortDate(addDays(state.week, 6))}`
      : `${shortDate(state.firstWeek || todayKey())} – ${shortDate(todayKey())}`;
    applySubs(state.page); // the map hides itself when there's nothing to plot, after the page was laid out
  }

  function renderScopeHead(route, people) {
    if (route.kind !== "guild") { $("scopeHead").innerHTML = ""; return; }
    if (!people.length) {
      $("scopeHead").innerHTML = `<div class="frame ghero"><h2>&lt;${esc(route.guild)}&gt;</h2><p class="muted">${tr("This guild has no characters on this realm yet.")}</p></div>`;
      return;
    }
    const t = {};
    people.forEach(p => { const s = sumFor(p, true); ["played", "dmg", "deaths", "quests"].forEach(f => t[f] = (t[f] || 0) + (s[f] || 0)); });
    const top = Math.max(0, ...people.map(p => p.chars[0].level || 0));
    const chars = people.map(p => p.chars[0]);
    const fac = factionOf(chars, crestOf(state.realm, route.guild));
    $("scopeHead").innerHTML = `<div class="frame ghero ${fac}">
        <span class="gcrest">${guildCrest(state.realm, route.guild, chars, 96)}</span>
        <span class="eyebrow">${fac ? tr(fac === "horde" ? "Horde" : "Alliance") + " " : ""}${tr("Guild")} · ${esc(realmLabel())}</span>
        <h2>&lt;${esc(route.guild)}&gt;</h2>
        <div class="facts">
          <div><b>${num(people.length)}</b><span>${tr(people.length === 1 ? "{0} member" : "{0} members", "").trim()}</span></div>
          <div><b>${top || "–"}</b><span>${tr("highest level")}</span></div>
          <div><b>${dur(t.played)}</b><span>${tr("played")}</span></div>
          <div><b>${compact(t.dmg)}</b><span>${tr("damage")}</span></div>
          <div><b>${num(t.deaths)}</b><span>${tr("deaths")}</span></div>
        </div>
      </div>`;
  }

  // A member's icon on the guild card: hover or focus shows who it is, like an in-game tooltip.
  const faceLink = c => {
    const [cls, color] = classOf(c), meta = [tr("Lvl {0}", esc(c.level || "?")), cls].join(" ");
    const pic = CLASS[c.class] ? zam("classicon_" + String(c.class).toLowerCase(), 32) : `<span class="dot" style="background:${color}"></span>`;
    return `<a class="face${c.fallen ? " fallen" : ""}" href="${charHref(c.key)}" aria-label="${esc(c.name)}, ${meta}${c.fallen ? ", " + tr("Fallen") : ""}">${pic}<span class="tip" aria-hidden="true"><b style="color:${color}">${esc(c.name)}</b>${ripHTML(c)}<small>${meta}</small></span></a>`;
  };
  const FAC_ORDER = { alliance: 0, horde: 1, "": 2 };
  document.addEventListener("click", e => {
    const b = e.target.closest(".facbtn");
    if (b) { state.gfac = b.dataset.fac; render(); }
  });
  function renderGuilds(realmChars) {
    const groups = {};
    realmChars.forEach(c => (groups[c.guild || ""] ||= []).push(c));
    const cards = Object.entries(groups).map(([g, list]) => {
      const tot = {};
      const dmgOf = c => Object.entries(c.days).reduce((a, [k, d]) => a + (inRange(k) ? d.dmg || 0 : 0), 0);
      list.forEach(c => { for (const [k, d] of Object.entries(c.days)) { if (!inRange(k)) continue; for (const f of ["dmg", "heal", "deaths", "quests", "goldIn", "played"]) tot[f] = (tot[f] || 0) + (d[f] || 0); } });
      const top = list.map(c => ({ c, v: dmgOf(c) })).sort((a, b) => b.v - a.v)[0];
      return { g, list: list.slice().sort((a, b) => dmgOf(b) - dmgOf(a)), tot, top, fac: g ? factionOf(list, crestOf(state.realm, g)) : "" };
    }).sort((a, b) => (a.g === "") - (b.g === "") || FAC_ORDER[a.fac] - FAC_ORDER[b.fac] || b.list.length - a.list.length || a.g.localeCompare(b.g));
    // Alliance and Horde guilds get their own tab once a realm has both.
    const counts = { alliance: cards.filter(c => c.fac === "alliance").length, horde: cards.filter(c => c.fac === "horde").length };
    const split = counts.alliance && counts.horde;
    if (!split || !counts[state.gfac]) state.gfac = "all";
    $("facPick").hidden = !split;
    $("facPick").innerHTML = split ? [["all", tr("All"), ""], ["alliance", tr("Alliance"), icon("alliance", 1)], ["horde", tr("Horde"), icon("horde", 1)]]
      .map(([f, label, ic]) => `<button type="button" class="facbtn ${f}" data-fac="${f}" aria-pressed="${state.gfac === f}">${ic}${label}${f !== "all" ? ` <small>${counts[f]}</small>` : ""}</button>`).join("") : "";
    $("guilds").innerHTML = cards.filter(c => state.gfac === "all" || c.fac === state.gfac).map(({ g, list, tot, top, fac }) => {
      const name = g ? `&lt;${esc(g)}&gt;` : esc(tr("No guild"));
      const lvl = Math.max(0, ...list.map(c => c.level || 0));
      const stat = (v, label, raw) => raw ? `<div><b>${v}</b><span>${tr(label)}</span></div>` : "";
      return `<div class="frame gcard ${fac}">
        ${fac ? `<span class="facband">${tr(fac === "horde" ? "Horde" : "Alliance")}</span>` : ""}
        <div class="ghead">${g ? guildCrest(state.realm, g, list, 44) : ""}<div>${g ? `<a class="gname" href="${guildHref(state.realm, g)}">${name}</a>` : `<span class="gname">${name}</span>`}
          <span class="muted">${[tr(list.length === 1 ? "{0} member" : "{0} members", list.length), lvl ? tr("Top level {0}", lvl) : ""].filter(Boolean).join(" · ")}</span></div></div>
        <div class="gstats">${stat(compact(tot.dmg), "Damage", tot.dmg)}${stat(compact(tot.heal), "Healing", tot.heal)}${stat(num(tot.deaths), "Deaths", 1)}
          ${stat(num(tot.quests), "Quests", tot.quests)}${stat(goldHTML(tot.goldIn), "Gold", tot.goldIn)}${stat(dur(tot.played), "Played", tot.played)}</div>
        ${top && top.v ? `<div class="gmvp">${tr("Top damage")}: <a class="plink" href="${charHref(top.c.key)}">${classIcon(top.c)}<span class="cname" style="--cc:${classOf(top.c)[1]}">${esc(top.c.name)}</span>${ripHTML(top.c)}</a></div>` : ""}
        <div class="gfaces">${list.slice(0, 24).map(c => faceLink(c)).join("")}${list.length > 24 ? `<span class="muted" style="align-self:center">+${list.length - 24}</span>` : ""}</div>
        ${g ? `<a class="btn" href="${guildHref(state.realm, g)}">${tr("Open guild page")}</a>` : ""}
      </div>`;
    }).join("") || `<p class="empty">${tr("No guilds yet.")}</p>`;
    carUpdateAll();
  }

  // ---------- carousels (guilds, achievements, Hall of Fame) ----------
  // A row that scrolls a page at a time. Drag it with the mouse or swipe it; ‹ › appear on hover and the dots in the
  // heading show (and pick) the page. Nothing shows when everything fits.
  const carStep = list => {
    const cs = getComputedStyle(list);
    return list.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight) + (parseFloat(cs.columnGap) || 0);
  };
  const carMax = list => list.scrollWidth - list.clientWidth;
  const carGo = (list, left) => list.scrollTo({ left: Math.max(0, Math.min(left, carMax(list))), behavior: reduceMotion ? "auto" : "smooth" });
  function carUpdate(dots) {
    const list = $(dots.dataset.for), step = carStep(list), max = carMax(list);
    const pages = max > 2 ? Math.ceil(max / step - .05) + 1 : 1;
    const at = list.scrollLeft >= max - 2 ? pages - 1 : Math.min(pages - 1, Math.round(list.scrollLeft / step));
    dots.hidden = pages < 2;
    if (dots.children.length !== (pages < 2 ? 0 : pages))
      dots.innerHTML = pages < 2 ? "" : [...Array(pages)].map((_, i) => `<button type="button" data-page="${i}" aria-label="${i + 1} / ${pages}"></button>`).join("");
    [...dots.children].forEach((b, i) => b.setAttribute("aria-current", String(i === at)));
    const car = list.parentElement;
    car.querySelector(".car-arrow.prev").hidden = pages < 2 || at === 0;
    car.querySelector(".car-arrow.next").hidden = pages < 2 || at === pages - 1;
  }
  const carUpdateAll = () => document.querySelectorAll(".car-dots[data-for]").forEach(carUpdate);
  document.querySelectorAll(".car-dots[data-for]").forEach(dots => {
    const list = $(dots.dataset.for), car = list.parentElement;
    car.insertAdjacentHTML("beforeend", `<button type="button" class="car-arrow prev" data-car="-1" aria-label="Previous page">‹</button><button type="button" class="car-arrow next" data-car="1" aria-label="Next page">›</button>`);
    car.addEventListener("click", e => {
      const b = e.target.closest(".car-arrow");
      if (b) carGo(list, list.scrollLeft + +b.dataset.car * carStep(list));
    });
    dots.addEventListener("click", e => {
      const b = e.target.closest("[data-page]");
      if (b) carGo(list, +b.dataset.page * carStep(list));
    });
    list.addEventListener("scroll", () => carUpdate(dots), { passive: true });
    if (window.ResizeObserver) new ResizeObserver(() => carUpdate(dots)).observe(list);

    // Mouse drag: the row follows the pointer, then settles on a page (the next one once you've pulled a little).
    // A drag never counts as a click on the card under it.
    let drag = null, dragged = false;
    list.addEventListener("dragstart", e => e.preventDefault());
    list.addEventListener("pointerdown", e => {
      if (e.pointerType !== "mouse" || e.button !== 0 || carMax(list) < 2) return;
      drag = { x: e.clientX, left: list.scrollLeft, moved: false, id: e.pointerId };
    });
    list.addEventListener("pointermove", e => {
      if (!drag) return;
      const dx = e.clientX - drag.x;
      if (!drag.moved) {
        if (Math.abs(dx) < 5) return;
        drag.moved = true;
        list.classList.add("dragging", "settling");
        list.setPointerCapture(drag.id);
      }
      list.scrollLeft = drag.left - dx;
    });
    const endDrag = () => {
      const d = drag;
      drag = null;
      if (!d || !d.moved) return;
      dragged = true;
      setTimeout(() => { dragged = false; }, 0);
      list.classList.remove("dragging");
      const step = carStep(list), pulled = list.scrollLeft - d.left, from = Math.round(d.left / step);
      carGo(list, (Math.abs(pulled) > step * .12 ? from + Math.sign(pulled) : from) * step);
      // snapping stays off until the glide is done, or it would pull the row back halfway
      clearTimeout(list._settle);
      list._settle = setTimeout(() => list.classList.remove("settling"), 600);
    };
    list.addEventListener("pointerup", endDrag);
    list.addEventListener("pointercancel", endDrag);
    list.addEventListener("click", e => { if (dragged) { e.preventDefault(); e.stopPropagation(); } }, true);
  });

  // ---------- loading from Supabase ----------
  const CONFIG = window.LEDGER_CONFIG || {};
  async function loadLedger() {
    state.lastLoad = Date.now();
    const url = String(CONFIG.supabaseUrl || "").replace(/\/$/, "");
    const key = String(CONFIG.publishableKey || "");
    if (!url || !key || url.includes("YOUR") || key.includes("YOUR")) { state.status = "unconfigured"; render(); return; }
    const headers = { apikey: key };
    if (!key.startsWith("sb_")) headers.Authorization = "Bearer " + key;
    const readAll = async table => {
      const rows = [];
      for (let from = 0; ; from += 1000) {
        const res = await fetch(`${url}/rest/v1/${table}?select=id,kind,char_key,data,updated_at&order=id&limit=1000&offset=${from}`, { headers });
        if (!res.ok) throw new Error("HTTP " + res.status);
        const page = await res.json();
        rows.push(...page);
        if (page.length < 1000) break;
      }
      return rows;
    };
    try {
      // entries_lite and realm_atlas come from supabase/hardening.sql; until it has run, read the whole table.
      let rows;
      try {
        rows = await readAll("entries_lite");
        const res = await fetch(`${url}/rest/v1/realm_atlas?select=realm,atlas`, { headers });
        const atlases = {};
        if (res.ok) for (const a of await res.json()) if (a.realm && a.atlas && typeof a.atlas === "object") atlases[a.realm] = a.atlas;
        state.atlases = atlases;
      } catch (e) {
        rows = await readAll("entries");
      }
      const src = { chars: {}, days: {}, obs: {}, players: {}, api: {}, crests: {}, journal: null };
      const relays = {};
      let updated = 0;
      for (const r of rows) {
        const data = r.data && typeof r.data === "object" ? r.data : {};
        const id = "c-" + r.char_key;
        if (r.kind === "char") {
          const { days, ...rest } = data;
          src.chars[id] = { ...rest, key: r.char_key, deaths: Array.isArray(rest.deaths) ? rest.deaths : [], notable: Array.isArray(rest.notable) ? rest.notable : [] };
          src.days[id] = { char: id, days: days && typeof days === "object" ? days : {} };
        } else if (r.kind === "relay") {
          // a copy of someone's stats, received in game by another player; newest copy wins.
          // A copy can't be newer than its upload, so a made-up lastSeen far in the future doesn't win.
          const seen = Math.min(Number(data.lastSeen) || 0, (Date.parse(r.updated_at) || 0) / 1000);
          const prev = relays[r.char_key];
          if (!prev || seen > prev.seen) relays[r.char_key] = { data, seen };
        } else if (r.kind === "obs") {
          src.obs[r.id] = { ...data, char: id, key: r.char_key, deaths: Array.isArray(data.deaths) ? data.deaths : [] };
        } else if (r.kind === "api" && !data.missing) {
          // level, gear and guild from Blizzard's API; plus guild crests and the dungeon journal (art and boss portraits)
          if (String(r.id).startsWith("g:")) src.crests[`${data.realm}|${data.guild}`.toLowerCase()] = data;
          else if (r.id === "j:journal") src.journal = data;
          else src.api[id] = data;
        }
        updated = Math.max(updated, Date.parse(r.updated_at) || 0);
      }
      // Copies only fill in characters that haven't uploaded their own stats.
      for (const [key, { data }] of Object.entries(relays)) {
        const id = "c-" + key;
        if (src.chars[id]) continue;
        const { days, ...rest } = data;
        src.chars[id] = { ...rest, key, relay: true, deaths: Array.isArray(rest.deaths) ? rest.deaths : [], notable: Array.isArray(rest.notable) ? rest.notable : [] };
        src.days[id] = { char: id, days: days && typeof days === "object" ? days : {} };
      }
      state.data = src;
      state.updated = updated;
      state.status = "ok";
    } catch (e) {
      if (state.status !== "ok") state.status = "error";
    }
    render();
  }

  // ---------- navigation ----------
  // Pages: [id, label, icon]. Each page shows only the sections tagged with its data-pg.
  const MAIN_PAGES = [
    ["overview", "Overview", "scroll"], ["meters", "Meters & Combat", "sword"], ["dungeons", "Dungeons & Raids", "gate"], ["deaths", "Deaths", "skull"],
    ["atlas", "Atlas", "map"], ["loot", "Loot & Gold", "loot"], ["glory", "Hall of Fame", "sulfuras"], ["characters", "Characters", "ashbringer"], ["join", "Get the addon", "spring"],
  ];
  const PROFILE_PAGES = [
    ["p-overview", "Character", "ashbringer"], ["p-activity", "Activity", "clock"], ["p-records", "Records", "shield"], ["p-compare", "Compare", "sword"],
  ];
  // Every visit, and every guild or character page you open, starts on its first page and first tabs.
  state.page = "overview";
  state.ppage = "p-overview";
  function applyPages(kind) {
    const pg = kind === "profile" ? state.ppage : state.page;
    document.body.dataset.page = pg;
    document.querySelectorAll("#app [data-pg]").forEach(el => { el.hidden = !el.dataset.pg.split(" ").includes(pg); });
    applySubs(kind === "profile" ? null : pg);
  }
  // A page with several sections shows one at a time, picked from tabs in the page bar, so it fits on one screen.
  // The section's own heading is then the tab, so it's hidden.
  state.sub = {};
  function applySubs(pg) {
    const secs = pg && pg !== "overview"
      ? [...document.querySelectorAll("#app > section[data-pg]")].filter(s => !s.hidden && !s.classList.contains("nosec") && s.querySelector(".sec-head h2"))
      : [];
    const box = $("subTabs"), multi = secs.length > 1;
    $("app").classList.toggle("subbed", multi);
    document.querySelectorAll("#app > section.subhide").forEach(s => s.classList.remove("subhide"));
    box.hidden = !multi;
    if (!multi) { box.innerHTML = ""; return; }
    const cur = secs.find(s => s.id === (state.sub || {})[pg]) || secs[0];
    secs.forEach(s => s.classList.toggle("subhide", s !== cur));
    box.innerHTML = secs.map(s => `<button type="button" class="subtab" role="tab" data-sub="${s.id}" aria-selected="${s === cur}">${esc(s.querySelector(".sec-head h2").textContent)}</button>`).join("");
  }
  $("subTabs").addEventListener("click", e => {
    const b = e.target.closest(".subtab");
    if (!b) return;
    state.sub[state.page] = b.dataset.sub;
    applySubs(state.page);
    fitText();
  });
  function setPage(pg) {
    const profile = pg.startsWith("p-");
    if (profile) state.ppage = pg; else state.page = pg;
    window.scrollTo(0, 0);
    render();
  }
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function renderNav(people, route) {
    const kind = route.kind === "char" ? "profile" : route.kind;
    document.body.dataset.route = kind;
    $("navCrest").innerHTML = crestHTML(2);
    // the browser tab icon follows the theme too
    const fav = crestHTML(1).replace("<svg ", '<svg xmlns="http://www.w3.org/2000/svg" ');
    if (fav !== state.favSvg) { state.favSvg = fav; $("favicon").href = "data:image/svg+xml," + encodeURIComponent(fav); }
    $("gearIcon").innerHTML = sprite("gear", 1);
    const pages = kind === "profile" ? PROFILE_PAGES : MAIN_PAGES;
    if (kind === "profile" && !pages.some(x => x[0] === state.ppage)) state.ppage = pages[0][0];
    if (kind !== "profile" && !pages.some(x => x[0] === state.page)) state.page = pages[0][0];
    const cur = kind === "profile" ? state.ppage : state.page;
    $("pageTabs").innerHTML = pages.map(([id, label, icon]) =>
      `<button type="button" class="pagetab" role="tab" data-pg="${id}" aria-selected="${id === cur}">${sprite(icon, 1)}${esc(tr(label))}</button>`).join("");
    $("pageSel").innerHTML = pages.map(([id, label]) => `<option value="${id}">${esc(tr(label))}</option>`).join("");
    $("pageSel").value = cur;
    $("realmIcon").innerHTML = crestHTML(2);
    const pageName = tr((pages.find(x => x[0] === cur) || pages[0])[1]);
    const realmName = String(state.realm || "").split("|")[1] || "";

    // Where you are: the realm's ledger, then the guild, then the character. The sidebar lists them top down with
    // the current one highlighted; the ones above it, and the breadcrumbs in the top bar, link back up.
    const focusChar = route.kind === "char" ? (state.allChars || []).find(c => c.key === route.key) : null;
    const guildName = route.kind === "guild" ? route.guild : focusChar && focusChar.guild;
    const levels = [{ label: tr("Realm ledger"), name: realmName, href: "#", icon: crestHTML(1) }];
    if (guildName) levels.push({ label: tr("Guild"), name: `<${guildName}>`, href: guildHref(state.realm, guildName),
      icon: guildCrest(state.realm, guildName, (state.allChars || []).filter(c => c.guild === guildName && realmMatch(c)), 18) });
    if (focusChar) levels.push({ label: tr("Character"), name: focusChar.name, href: charHref(route.key), icon: classIcon(focusChar, 1), rip: ripHTML(focusChar) });
    const at = levels.length - 1;
    const lvlInner = l => `<span class="lvl-ic">${l.icon}</span><span class="lvl-t"><small>${esc(l.label)}</small><b>${esc(l.name)}${l.rip || ""}</b></span>`;
    $("scope").innerHTML = `<span class="nav-label">${tr("You are here")}</span>` + levels.map((l, i) => i === at
      ? `<span class="lvl here" aria-current="page">${lvlInner(l)}</span>`
      : `<a class="lvl" href="${l.href}">${lvlInner(l)}<span class="lvl-back">‹ ${tr("Go back")}</span></a>`).join("");
    $("navLabel").textContent = kind === "profile" ? tr("{0}'s pages", focusChar ? focusChar.name : "") : tr(kind === "guild" ? "Guild pages" : "Realm pages");
    $("crumbs").innerHTML = levels.map((l, i) => i === at ? `<span>${esc(l.name)}${l.rip || ""}</span>` : `<a href="${l.href}">${esc(l.name)}${l.rip || ""}</a>`)
      .concat(`<strong>${esc(pageName)}</strong>`).join('<span class="sep" aria-hidden="true">›</span>');
    $("pageTitle").textContent = cur !== "overview" ? pageName : route.kind === "main" ? realmName : "";
    const pid = route.kind === "char" ? route.key : null;
    const i = people.findIndex(p => p.id === pid);
    const multi = pid && i >= 0 && people.length > 1;
    $("prevFriend").hidden = $("nextFriend").hidden = !multi;
    if (multi) {
      const prev = people[(i - 1 + people.length) % people.length], next = people[(i + 1) % people.length];
      $("prevFriend").dataset.pid = prev.id; $("prevFriend").title = prev.name;
      $("nextFriend").dataset.pid = next.id; $("nextFriend").title = next.name;
    }
    applyPages(kind);
  }

  // Pages switch from the tab bar or (on narrow screens) the View menu.
  document.addEventListener("click", e => {
    const a = e.target.closest('a[href="#join"]');
    if (!a) return;
    e.preventDefault();
    setMenu(false);
    state.page = "join";
    if (parseRoute().kind === "char") location.hash = ""; else setPage("join");
  });
  $("pageTabs").addEventListener("click", e => { const b = e.target.closest(".pagetab"); if (b) { setMenu(false); setPage(b.dataset.pg); } });
  // "Details" and "View all" on the overview's cards open their page.
  document.addEventListener("click", e => {
    const g = e.target.closest("[data-goto]");
    if (!g) return;
    if (g.dataset.sub) state.sub[g.dataset.goto] = g.dataset.sub; // open the page on the matching section
    setPage(g.dataset.goto);
  });

  // Phones: the sidebar slides in from the menu button and closes on a page, the dimmed backdrop or Escape.
  function setMenu(open) {
    document.body.classList.toggle("menu-open", open);
    $("menuBtn").setAttribute("aria-expanded", String(open));
  }
  $("menuBtn").addEventListener("click", () => setMenu(!document.body.classList.contains("menu-open")));
  $("scrim").addEventListener("click", () => setMenu(false));
  document.addEventListener("keydown", e => { if (e.key === "Escape") setMenu(false); });
  window.addEventListener("hashchange", () => setMenu(false));
  $("pageSel").addEventListener("change", e => setPage(e.target.value));

  // Keep the sticky bar's height in a CSS variable.
  const setNavH = () => document.documentElement.style.setProperty("--navh", $("topnav").offsetHeight + "px");
  if (window.ResizeObserver) new ResizeObserver(setNavH).observe($("topnav"));
  setNavH();

  ["prevFriend", "nextFriend"].forEach(id => $(id).addEventListener("click", e => {
    location.hash = charHref(e.currentTarget.dataset.pid);
  }));
  $("brandLink").addEventListener("click", e => {
    e.preventDefault();
    if (parseRoute().kind !== "main") location.hash = "";
    else window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  });

  // ---------- search ----------
  const closeSearch = () => { $("searchResults").hidden = true; $("searchBox").value = ""; $("searchBox").blur(); };
  function runSearch(q) {
    const box = $("searchResults");
    q = q.trim().toLowerCase();
    if (!q) { box.hidden = true; box.innerHTML = ""; return; }
    const all = state.allChars || [];
    const guilds = {};
    all.forEach(c => {
      if (c.guild && c.guild.toLowerCase().includes(q)) {
        const g = guilds[realmKey(c) + "|" + c.guild] ||= { realm: realmKey(c), guild: c.guild, n: 0 };
        g.n++;
      }
    });
    const gl = Object.values(guilds).sort((a, b) => b.n - a.n).slice(0, 5);
    const cl = all.filter(c => String(c.name).toLowerCase().includes(q))
      .sort((a, b) => String(a.name).toLowerCase().startsWith(q) ? -1 : String(b.name).toLowerCase().startsWith(q) ? 1 : 0).slice(0, 8);
    box.innerHTML = [
      ...gl.map(g => `<a class="sr" href="${guildHref(g.realm, g.guild)}"><span class="sr-k">${tr("Guild")}</span><b>&lt;${esc(g.guild)}&gt;</b><span class="muted">${esc(g.realm.replace("|", " · "))} · ${tr(g.n === 1 ? "{0} member" : "{0} members", g.n)}</span></a>`),
      ...cl.map(c => `<a class="sr" href="${charHref(c.key)}">${classIcon(c)}<b>${esc(c.name)}</b>${ripHTML(c)}<span class="muted">${tr("Lvl {0}", esc(c.level || "?"))} ${classOf(c)[0]} · ${esc(c.realm || "")}${c.guild ? " · &lt;" + esc(c.guild) + "&gt;" : ""}</span></a>`),
    ].join("") || `<p class="empty" style="padding:8px 10px">${tr("No characters or guilds match.")}</p>`;
    box.hidden = false;
  }
  $("searchBox").addEventListener("input", e => runSearch(e.target.value));
  $("searchBox").addEventListener("focus", e => runSearch(e.target.value));
  $("searchBox").addEventListener("keydown", e => {
    if (e.key === "Escape") closeSearch();
    if (e.key === "Enter") { const a = $("searchResults").querySelector("a"); if (a) { location.hash = a.getAttribute("href"); closeSearch(); } }
  });
  $("searchResults").addEventListener("click", e => { if (e.target.closest("a")) setTimeout(closeSearch, 0); });
  document.addEventListener("click", e => { if (!$("searchWrap").contains(e.target)) $("searchResults").hidden = true; });

  // ---------- upload in the browser ----------
  // Reads a WoW SavedVariables file (Lua tables) into plain objects. Never runs any code from the file.
  function parseLua(src) {
    let i = 0;
    const n = src.length;
    const IDENT = /[A-Za-z_][A-Za-z0-9_]*/y;
    const NUM = /-?(?:0[xX][0-9a-fA-F]+|(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?)/y;
    const fail = msg => { throw new Error(`${msg} (at character ${i})`); };
    function skip() {
      for (;;) {
        while (i < n && /\s/.test(src[i])) i++;
        if (src.startsWith("--", i)) {
          const lb = src.slice(i + 2, i + 40).match(/^\[(=*)\[/);
          if (lb) { const close = "]" + lb[1] + "]"; const e = src.indexOf(close, i); i = e < 0 ? n : e + close.length; }
          else { const e = src.indexOf("\n", i); i = e < 0 ? n : e + 1; }
          continue;
        }
        break;
      }
    }
    function str() {
      const q = src[i++]; let out = "";
      while (i < n && src[i] !== q) {
        let c = src[i++];
        if (c === "\\") {
          c = src[i++];
          const map = { n: "\n", t: "\t", r: "\r", a: "\x07", b: "\b", f: "\f", v: "\v", "\\": "\\", '"': '"', "'": "'", "\n": "\n" };
          if (c in map) out += map[c];
          else if (/\d/.test(c)) { let d = c; while (d.length < 3 && /\d/.test(src[i])) d += src[i++]; out += String.fromCharCode(+d); }
          else out += c;
        } else out += c;
      }
      if (src[i] !== q) fail("Unfinished text");
      i++;
      return out;
    }
    function value() {
      skip();
      const c = src[i];
      if (c === "{") return table();
      if (c === '"' || c === "'") return str();
      NUM.lastIndex = i;
      const m = NUM.exec(src);
      if (m && m[0] !== "-") { i += m[0].length; return Number(m[0]); }
      IDENT.lastIndex = i;
      const id = IDENT.exec(src);
      if (id) {
        i += id[0].length;
        if (id[0] === "true") return true;
        if (id[0] === "false") return false;
        return null;
      }
      fail("Unexpected symbol");
    }
    function table() {
      i++;
      const obj = {}; let pos = 1, keyed = false;
      for (;;) {
        skip();
        if (i >= n) fail("Unfinished table");
        if (src[i] === "}") { i++; break; }
        let key;
        if (src[i] === "[") {
          i++; key = value(); skip();
          if (src[i] !== "]") fail("Expected ]"); i++; skip();
          if (src[i] !== "=") fail("Expected ="); i++;
          keyed = true;
        } else {
          IDENT.lastIndex = i;
          const id = IDENT.exec(src);
          if (id && /^\s*=(?!=)/.test(src.slice(i + id[0].length, i + id[0].length + 8))) {
            key = id[0]; i += id[0].length; skip(); i++; keyed = true;
          }
        }
        const v = value();
        if (key === undefined) key = pos++;
        if (v !== null) obj[key] = v;
        skip();
        if (src[i] === "," || src[i] === ";") i++;
      }
      const keys = Object.keys(obj);
      if (keys.length && keys.every((k, idx) => k === String(idx + 1))) return keys.map(k => obj[k]);
      if (!keys.length && !keyed) return [];
      return obj;
    }
    const out = {};
    for (;;) {
      skip();
      if (i >= n) break;
      IDENT.lastIndex = i;
      const id = IDENT.exec(src);
      if (!id) fail("Expected a variable name");
      i += id[0].length; skip();
      if (src[i] !== "=") fail("Expected =");
      i++;
      out[id[0]] = value();
    }
    return out;
  }

  // The same rows the sync script sends: own characters, copies received in game, and observations.
  function buildUploadRows(db) {
    const asList = v => Array.isArray(v) ? v : (v && typeof v === "object" ? Object.values(v) : []);
    const account = db.id || "unknown";
    const rows = [], own = new Set();
    const charData = (key, c, fallback) => {
      const data = { ...c };
      delete data.settings; delete data.killNames; delete data.secret;
      return Object.assign(data, {
        key, name: data.name || key.split("-")[0], owner: data.owner || fallback,
        deaths: asList(data.deaths), notable: asList(data.notable),
        days: data.days && typeof data.days === "object" && !Array.isArray(data.days) ? data.days : {},
      });
    };
    for (const [key, c] of Object.entries(db.chars || {})) {
      if (c && typeof c === "object") { own.add(key); rows.push({ kind: "char", char_key: key, data: charData(key, c, account) }); }
    }
    for (const [key, c] of Object.entries(db.synced || {})) {
      if (c && typeof c === "object" && !own.has(key)) rows.push({ kind: "relay", char_key: key, data: charData(key, c, "char:" + key) });
    }
    for (const [key, o] of Object.entries(db.observed || {})) {
      if (o && typeof o === "object" && !own.has(key)) rows.push({ kind: "obs", char_key: key, data: { ...o, key, name: o.name || key.split("-")[0], deaths: asList(o.deaths) } });
    }
    return rows;
  }

  async function uploadFile(file) {
    const log = (text, cls) => { const p = document.createElement("p"); if (cls) p.className = cls; p.textContent = text; $("upLog").prepend(p); };
    let db;
    try { db = parseLua(await file.text()).FunStatsDB; }
    catch (e) { log(tr("{0}: couldn't read this file.", file.name) + " " + e.message, "err"); return; }
    if (!db || typeof db !== "object" || !db.chars) { log(tr("{0} has no FunStats data. Pick FunStats.lua from WTF\\Account\\YOUR_ACCOUNT\\SavedVariables after logging out once.", file.name), "err"); return; }
    if (typeof db.secret !== "string" || db.secret.length < 32) { log(tr("This file is from an older FunStats. Update the addon, log in once, type /reload and try again."), "err"); return; }
    const url = String(CONFIG.supabaseUrl || "").replace(/\/$/, "");
    const key = String(CONFIG.publishableKey || "");
    const headers = { apikey: key, "Content-Type": "application/json" };
    if (!key.startsWith("sb_")) headers.Authorization = "Bearer " + key;
    const rows = buildUploadRows(db);
    const own = rows.filter(r => r.kind === "char");
    log(tr("Uploading {0}…", own.map(r => r.data.name).join(", ")));
    // Send in batches of about 1.5 MB.
    const batches = [[]];
    let size = 0;
    for (const r of rows) {
      const s = JSON.stringify(r).length;
      if (batches[batches.length - 1].length && (size + s > 1.5e6 || batches[batches.length - 1].length >= 40)) { batches.push([]); size = 0; }
      batches[batches.length - 1].push(r);
      size += s;
    }
    let skipped = 0;
    try {
      for (const batch of batches) {
        const res = await fetch(`${url}/rest/v1/rpc/upload_ledger`, { method: "POST", headers, body: JSON.stringify({ p_secret: db.secret, p_rows: batch }) });
        if (!res.ok) throw new Error(await res.text());
        const r = await res.json();
        skipped += r.skipped || 0;
      }
    } catch (e) {
      log(tr("Upload failed. Try again in a minute."), "err");
      return;
    }
    log(tr("Saved {0}.", own.map(r => r.data.name).join(", ")) + (skipped ? " " + tr("{0} characters were skipped because another upload already claimed them.", skipped) : ""), "ok");
    await loadLedger();
    if (own.length) location.hash = charHref(own[0].char_key);
  }

  const drop = $("drop");
  ["dragenter", "dragover"].forEach(ev => drop.addEventListener(ev, e => { e.preventDefault(); drop.classList.add("over"); }));
  ["dragleave", "drop"].forEach(ev => drop.addEventListener(ev, e => { e.preventDefault(); drop.classList.remove("over"); }));
  drop.addEventListener("drop", e => { const f = e.dataTransfer.files && e.dataTransfer.files[0]; if (f) uploadFile(f); });
  $("fileIn").addEventListener("change", e => { const f = e.target.files[0]; if (f) uploadFile(f); e.target.value = ""; });

  $("cmpSel").addEventListener("change", e => { state.compareWith = e.target.value; render(); });
  // Close the settings menu when clicking anywhere else.
  document.addEventListener("click", e => {
    if (!$("settings").contains(e.target)) $("settings").open = false;
    if (!$("recNews").contains(e.target)) $("recNews").open = false;
  });

  // ---------- static page text ----------
  // Elements whose whole content is a known English string get swapped for Swedish (and back).
  const staticText = [], staticAria = [];
  document.querySelectorAll("#app *, #topnav *, #sidebar *, footer").forEach(el => {
    if (el.closest("script, style")) return;
    const html = el.innerHTML.trim();
    if (html && SV[html]) staticText.push([el, html]);
    const aria = el.getAttribute("aria-label");
    if (aria && SV[aria]) staticAria.push([el, aria]);
  });
  function translateStatic() {
    document.documentElement.lang = LANG;
    staticText.forEach(([el, en]) => { el.innerHTML = tr(en); });
    staticAria.forEach(([el, en]) => el.setAttribute("aria-label", tr(en)));
  }
  translateStatic();
  // Mac players see the manual install first; the Windows app is no use to them.
  if (/Mac/i.test(navigator.platform || "")) document.body.classList.add("is-mac");
  // The Get the addon page shows the app's current version, from app-version.txt ("1.2.0.0 <sha256>", written by app\build.cmd).
  fetch("app-version.txt", { cache: "no-cache" }).then(r => (r.ok ? r.text() : "")).then(t => {
    const v = t.split(" ")[0].replace(/(\.0)+$/, "");
    if (/^\d+(\.\d+)*$/.test(v)) document.getElementById("appVer").textContent = "v" + v;
  }).catch(() => {});
  document.querySelectorAll(".lang-btn").forEach(b => b.addEventListener("click", () => {
    LANG = b.dataset.lang;
    try { localStorage.setItem("ledger-lang", LANG); } catch (err) { /* remembering is optional */ }
    translateStatic();
    fillMetricSel();
    render();
  }));

  // ---------- controls ----------
  const fillMetricSel = () => { $("metricSel").innerHTML = METRICS.map(m => `<option value="${m.k}">${tr(m.label)}</option>`).join(""); $("metricSel").value = state.metric; };
  fillMetricSel();
  $("metricSel").addEventListener("change", e => { state.metric = e.target.value; render(); });
  $("perHour").addEventListener("change", e => { state.perHour = e.target.checked; render(); });
  $("weekSel").addEventListener("change", e => {
    if (e.target.value === "all") state.view = "all";
    else { state.view = "week"; state.week = e.target.value; state.userPickedWeek = true; }
    render();
  });
  const step = d => {
    const weeks = [...$("weekSel").options].map(o => o.value).filter(v => /^\d{4}-/.test(v));
    const i = weeks.indexOf(state.week) + d;
    if (state.view === "week" && i >= 0 && i < weeks.length) { state.week = weeks[i]; state.userPickedWeek = true; render(); }
  };
  $("prevWeek").addEventListener("click", () => step(1));
  $("nextWeek").addEventListener("click", () => step(-1));
  $("raceMode").addEventListener("click", e => { const b = e.target.closest(".chip"); if (!b) return; state.raceMode = b.dataset.mode; render(); });
  $("spellWho").addEventListener("click", e => { const b = e.target.closest(".chip"); if (!b) return; state.spellWho = b.dataset.pid; render(); });
  // When Wowhead finds an item, move its icon into the slot's square, like the in-game character sheet.
  new MutationObserver(() => {
    document.querySelectorAll("#pSheet .slot a[data-wh-icon-added]").forEach(a => {
      const small = a.querySelector(".iconsmall");
      const ins = small && small.querySelector("ins");
      const box = a.closest(".slot").querySelector(".ic");
      if (!ins || !box || !ins.style.backgroundImage) return;
      box.style.backgroundImage = ins.style.backgroundImage.replace("/icons/small/", "/icons/medium/");
      box.style.backgroundSize = "cover";
      box.textContent = "";
      small.remove();
    });
  }).observe($("pSheet"), { subtree: true, childList: true, attributes: true, attributeFilter: ["data-wh-icon-added"] });
  initMapZoom();
  $("mapWho").addEventListener("change", e => { state.map.who = e.target.value; render(); });
  $("realmSel").addEventListener("change", e => {
    state.realm = e.target.value;
    try { localStorage.setItem("ledger-realm-v2", state.realm); } catch (err) { /* remembering is optional */ }
    // a guild or character belongs to its own realm, so another realm opens that realm's ledger
    if (parseRoute().kind !== "main") { location.hash = ""; return; }
    render();
  });
  // ---------- ambient motes ----------
  // Small pixel squares drifting up behind the page in the theme's two highlight colours.
  // Paused while the tab is hidden, and off with reduced motion or Settings > Animations.
  const ambient = (() => {
    const cv = $("ambient"), g = cv.getContext("2d"), calmQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let motes = [], w = 0, h = 0, cols = [], last = 0, raf = 0;
    const spawn = anywhere => ({ x: Math.random() * w, y: anywhere ? Math.random() * h : h + 8, s: Math.random() < .3 ? 3 : 2,
      v: 6 + Math.random() * 16, ph: Math.random() * 6.28, a: .12 + Math.random() * .2, c: Math.random() < .7 ? 0 : 1, age: anywhere ? 9 : 0 });
    const size = () => {
      w = cv.width = innerWidth; h = cv.height = innerHeight;
      const n = Math.min(36, Math.round(w * h / 40000)); // a few faint motes; enough to feel alive, not enough to distract
      motes = motes.slice(0, n);
      while (motes.length < n) motes.push(spawn(true));
    };
    function frame(t) {
      raf = requestAnimationFrame(frame);
      const dt = last ? Math.min(.05, (t - last) / 1000) : 0;
      last = t;
      g.clearRect(0, 0, w, h);
      for (const m of motes) {
        m.y -= m.v * dt; m.ph += dt; m.age += dt;
        if (m.y < -8) Object.assign(m, spawn(false));
        const y = Math.round(m.y);
        g.globalAlpha = m.a * Math.min(1, m.age / 2, y / 140) * (.65 + .35 * Math.sin(m.ph * 2.3));
        g.fillStyle = cols[m.c];
        g.fillRect(Math.round(m.x + Math.sin(m.ph * .7) * 6), y, m.s, m.s);
      }
    }
    function sync() {
      cancelAnimationFrame(raf);
      g.clearRect(0, 0, w, h);
      if (calmQuery.matches || document.documentElement.classList.contains("calm") || document.hidden) return;
      cols = [css("--accent"), css("--good")];
      last = 0;
      raf = requestAnimationFrame(frame);
    }
    window.addEventListener("resize", size);
    document.addEventListener("visibilitychange", sync);
    calmQuery.addEventListener("change", sync);
    size();
    sync();
    return sync;
  })();
  const setAnimations = on => {
    document.documentElement.classList.toggle("calm", !on);
    document.querySelectorAll(".anim-btn").forEach(b => b.setAttribute("aria-pressed", String((b.dataset.anim === "on") === on)));
    ambient();
  };
  setAnimations(!document.documentElement.classList.contains("calm"));
  document.querySelectorAll(".anim-btn").forEach(b => b.addEventListener("click", () => {
    setAnimations(b.dataset.anim === "on");
    try { localStorage.setItem("ledger-anim", b.dataset.anim); } catch (err) { /* remembering is optional */ }
  }));

  document.querySelectorAll(".theme-btn").forEach(b => b.addEventListener("click", () => {
    document.documentElement.dataset.theme = b.dataset.theme;
    try { localStorage.setItem("ledger-theme", b.dataset.theme); } catch (err) { /* remembering is optional */ }
    applyChartTheme();
    resetCharts();
    render();
    ambient(); // new theme colours for the motes (the map redraws in render())
  }));
  $("pCharPick").addEventListener("click", e => { const b = e.target.closest(".chip"); if (!b) return; state.profileChar = b.dataset.key; render(); });
  const pageKey = () => /^#\//.test(location.hash) ? location.hash : "";
  let lastRoute = pageKey();
  window.addEventListener("hashchange", () => {
    const now = pageKey();
    if (now === lastRoute) return; // plain #section anchors
    // Leaving the Ledger for a guild or character remembers where you were, for coming back.
    if (!lastRoute && now) state.mainSpot = { scroll: window.scrollY, page: state.page, sub: state.sub };
    if (now) { state.page = "overview"; state.ppage = "p-overview"; state.sub = {}; }
    else if (state.mainSpot) { state.page = state.mainSpot.page; state.sub = state.mainSpot.sub; }
    lastRoute = now;
    render();
    const y = now ? 0 : (state.mainSpot ? state.mainSpot.scroll : 0);
    window.scrollTo(0, y);
    requestAnimationFrame(() => window.scrollTo(0, y));  // again once charts have laid out
  });
  $("statTable").addEventListener("click", e => {
    const th = e.target.closest("th"); if (!th) return;
    const k = th.dataset.k;
    state.sort = { k, dir: state.sort.k === k ? -state.sort.dir : (k === "name" ? 1 : -1) };
    render();
  });

  // WoW-style tooltip for HTML bars and the heatmap
  const tip = $("tip");
  document.addEventListener("pointermove", e => {
    const el = e.target.closest("[data-tip]");
    if (!el) { tip.hidden = true; return; }
    const rows = el.dataset.tip.split(";").map(r => r.split("|"));
    tip.innerHTML = rows.map(([a, b]) => `<div class="row"><span>${esc(a)}</span><span>${esc(b || "")}</span></div>`).join("");
    tip.hidden = false;
    const r = tip.getBoundingClientRect();
    let x = e.clientX + 14, y = e.clientY + 14;
    if (x + r.width > innerWidth - 8) x = e.clientX - r.width - 14;
    if (y + r.height > innerHeight - 8) y = e.clientY - r.height - 14;
    tip.style.left = Math.max(8, x) + "px"; tip.style.top = Math.max(8, y) + "px";
  });

  render();
  loadLedger();
  setInterval(() => { if (!document.hidden) loadLedger(); }, 5 * 60 * 1000);
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden && Date.now() - (state.lastLoad || 0) > 60000) loadLedger();
  });
})();
