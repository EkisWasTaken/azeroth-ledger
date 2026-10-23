// Fill these in from Supabase > Project Settings > API Keys.
// The publishable key is safe to put on a public site. Never put the secret key here.
window.LEDGER_CONFIG = {
  supabaseUrl: "https://nznnybzrqplsqyhotlnd.supabase.co",
  publishableKey: "sb_publishable_RNaALyd2OI4jthFr0FvFRA_2CCRxzRE",
  // Which game a character belongs to, for the Realm picker. Rules are checked top to bottom;
  // a rule matches on realm name (realms), the game's season id (seasons) or client version (version).
  // Characters matching nothing count as defaultGame. Hardcore characters get "Hardcore" added
  // (WoW Forever + Hardcore shows as "Hardcore Forever").
  // If your Anniversary realm isn't listed, add its name to the first rule.
  // The Realm menu only lists realms someone has uploaded from; realm names here only decide the game a realm
  // belongs to (Season of Discovery shares Classic Era's client version), and hardcoreRealms show as "<game> Hardcore".
  // WoW Forever has no named realms (one world per ruleset and region): add a rule once its realm name is known.
  games: [
    { name: "Anniversary", realms: ["Nightslayer", "Dreamscythe", "Doomhowl", "Maladath", "Thunderstrike", "Spineshatter", "Soulseeker"], hardcoreRealms: ["Doomhowl", "Soulseeker"] },
    { name: "Season of Discovery", realms: ["Crusader Strike", "Chaos Bolt", "Lava Lash", "Living Flame", "Lone Wolf", "Wild Growth", "Penance", "Shadowstrike"] },
    { name: "Classic Era", realms: ["Skull Rock", "Defias Pillager", "Nek'Rosh", "Stitches"], hardcoreRealms: ["Skull Rock", "Defias Pillager", "Nek'Rosh", "Stitches"] },
    { version: "1.13", name: "Classic Era" },
    { version: "1.14", name: "Classic Era" },
    { version: "1.15", name: "Classic Era" },
    // Other Blizzard clients the addon can run on, so they never count as WoW Forever.
    { version: "2.5", name: "Anniversary" },
    { version: "3.4", name: "Wrath Classic" },
    { version: "4.4", name: "Cataclysm Classic" },
    { version: "5.5", name: "Mists of Pandaria Classic" },
    { version: "10.", name: "Retail" },
    { version: "11.", name: "Retail" },
    { version: "12.", name: "Retail" },
  ],
  defaultGame: "WoW Forever",
};
