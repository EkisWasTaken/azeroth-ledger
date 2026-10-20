// Azeroth Ledger: armory sync (Supabase Edge Function "armory").
//
// Fills in level, gear and guild from Blizzard's official API for characters that are on the
// ledger but don't run the addon themselves (guild members from rosters, party members seen in
// game, copies received from friends). Runs on a schedule (see supabase/armory.sql); results are
// stored as rows of kind 'api', which the website merges in.
//
// Secrets (Supabase > Edge Functions > Secrets): BLIZZARD_CLIENT_ID, BLIZZARD_CLIENT_SECRET.
// Optional: FOREVER_NAMESPACE (e.g. "profile-forever"), once Blizzard publishes WoW Forever's API.

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? Deno.env.get("SUPABASE_SECRET_KEY") ?? "";
const CLIENT_ID = Deno.env.get("BLIZZARD_CLIENT_ID") ?? "";
const CLIENT_SECRET = Deno.env.get("BLIZZARD_CLIENT_SECRET") ?? "";
const FOREVER_NS = Deno.env.get("FOREVER_NAMESPACE") ?? "";

const PER_RUN = 150;            // characters looked up per run (2 API calls each)
const REFRESH_HOURS = 12;       // look a character up again after this long
const MISSING_HOURS = 72;       // ...or this long if Blizzard didn't know them
const MIN_GAP_MINUTES = 20;     // ignore calls that come sooner than this after the last run

// Known realms and their region. Others are tried in EU first, then US.
const REALM_REGION: Record<string, string> = {
  nightslayer: "us", dreamscythe: "us", doomhowl: "us",
  thunderstrike: "eu", spineshatter: "eu", soulseeker: "eu",
};

const SLOT: Record<string, number> = {
  HEAD: 1, NECK: 2, SHOULDER: 3, SHIRT: 4, CHEST: 5, WAIST: 6, LEGS: 7, FEET: 8, WRIST: 9, HANDS: 10,
  FINGER_1: 11, FINGER_2: 12, TRINKET_1: 13, TRINKET_2: 14, BACK: 15, MAIN_HAND: 16, OFF_HAND: 17, RANGED: 18, TABARD: 19,
};
const QUALITY: Record<string, number> = { POOR: 0, COMMON: 1, UNCOMMON: 2, RARE: 3, EPIC: 4, LEGENDARY: 5, ARTIFACT: 6, HEIRLOOM: 7 };
const CLASS: Record<number, string> = { 1: "WARRIOR", 2: "PALADIN", 3: "HUNTER", 4: "ROGUE", 5: "PRIEST", 7: "SHAMAN", 8: "MAGE", 9: "WARLOCK", 11: "DRUID" };
const RACE: Record<number, string> = { 1: "Human", 2: "Orc", 3: "Dwarf", 4: "NightElf", 5: "Scourge", 6: "Tauren", 7: "Gnome", 8: "Troll", 10: "BloodElf", 11: "Draenei" };

type Json = Record<string, any>;

function db(path: string, init: RequestInit = {}) {
  const headers: Record<string, string> = { apikey: SERVICE_KEY, "Content-Type": "application/json", ...(init.headers as any) };
  if (!SERVICE_KEY.startsWith("sb_")) headers.Authorization = "Bearer " + SERVICE_KEY;
  return fetch(`${SUPABASE_URL}/rest/v1/${path}`, { ...init, headers });
}

async function all(path: string): Promise<Json[]> {
  const out: Json[] = [];
  for (let from = 0; ; from += 1000) {
    const res = await db(`${path}&limit=1000&offset=${from}`);
    if (!res.ok) throw new Error(`database: ${res.status} ${await res.text()}`);
    const page = await res.json();
    out.push(...page);
    if (page.length < 1000) return out;
  }
}

// Which profile namespace a character's game uses: 1.x Classic Era, 2.x TBC Anniversary.
function namespaceFor(game: Json | undefined): string | null {
  const v = String(game?.version ?? "");
  if (v.startsWith("1.")) return "profile-classic1x";
  if (v.startsWith("2.")) return "profile-classicann";
  if (FOREVER_NS) return FOREVER_NS;
  return null;
}

const slug = (realm: string) => realm.toLowerCase().replace(/['’]/g, "").replace(/\s+/g, "-");

async function token(): Promise<string> {
  const res = await fetch("https://oauth.battle.net/token", {
    method: "POST",
    headers: { Authorization: "Basic " + btoa(`${CLIENT_ID}:${CLIENT_SECRET}`), "Content-Type": "application/x-www-form-urlencoded" },
    body: "grant_type=client_credentials",
  });
  if (!res.ok) throw new Error(`Blizzard login failed: ${res.status} ${await res.text()}`);
  return (await res.json()).access_token;
}

async function lookUp(tok: string, name: string, realm: string, ns: string, region: string) {
  const base = `https://${region}.api.blizzard.com/profile/wow/character/${encodeURIComponent(slug(realm))}/${encodeURIComponent(name.toLowerCase())}`;
  const q = `?namespace=${ns}-${region}&locale=en_US`;
  const get = (path: string) => fetch(base + path + q, { headers: { Authorization: "Bearer " + tok } });
  const res = await get("");
  if (res.status === 404 || res.status === 403) return { status: res.status };
  if (!res.ok) throw new Error(`Blizzard ${res.status} for ${name}-${realm}`);
  const p = await res.json();
  const gear: Json = {};
  const eq = await get("/equipment");
  if (eq.ok) {
    for (const it of (await eq.json()).equipped_items ?? []) {
      const s = SLOT[it?.slot?.type];
      if (!s) continue;
      gear["s" + s] = { id: it.item?.id, n: it.name, q: QUALITY[it.quality?.type] ?? 1, il: it.level?.value };
    }
  }
  return {
    status: 200,
    data: {
      name: p.name ?? name, realm, region, level: p.level,
      class: CLASS[p.character_class?.id] ?? undefined, race: RACE[p.race?.id] ?? undefined,
      guild: p.guild?.name ?? null, faction: p.faction?.type, ilvl: p.equipped_item_level ?? p.average_item_level,
      lastLogin: p.last_login_timestamp ? Math.floor(p.last_login_timestamp / 1000) : undefined,
      gear, fetched: Math.floor(Date.now() / 1000),
    },
  };
}

Deno.serve(async (req) => {
  try {
    if (!SERVICE_KEY) return Response.json({ error: "No service key in the function's environment (SUPABASE_SERVICE_ROLE_KEY)." }, { status: 500 });
    if (!CLIENT_ID || !CLIENT_SECRET) return Response.json({ error: "Set BLIZZARD_CLIENT_ID and BLIZZARD_CLIENT_SECRET under Edge Functions > Secrets." }, { status: 500 });

    // Test mode: ?check=Name-Realm looks one character up and shows what Blizzard returns (nothing is saved).
    const check = new URL(req.url).searchParams.get("check");
    if (check && check.includes("-")) {
      const name = check.slice(0, check.indexOf("-")), realm = check.slice(check.indexOf("-") + 1);
      const tok = await token();
      const tried: Json[] = [];
      for (const ns of ["profile-classicann", "profile-classic1x"]) {
        for (const region of REALM_REGION[realm.toLowerCase()] ? [REALM_REGION[realm.toLowerCase()]] : ["eu", "us"]) {
          const r: any = await lookUp(tok, name, realm, ns, region);
          tried.push({ namespace: `${ns}-${region}`, status: r.status, level: r.data?.level, guild: r.data?.guild, gear: r.data ? Object.keys(r.data.gear).length : undefined });
          if (r.status === 200) return Response.json({ login: "ok", tried });
        }
      }
      return Response.json({ login: "ok", tried });
    }

    // Throttle: this endpoint is public (the schedule calls it), so extra calls are ignored.
    const last = await (await db("entries?kind=eq.api&select=updated_at&order=updated_at.desc&limit=1")).json();
    if (last[0] && Date.now() - Date.parse(last[0].updated_at) < MIN_GAP_MINUTES * 60_000) {
      return Response.json({ skipped: "ran recently" });
    }

    const rows = await all("entries?select=kind,char_key,data->realm,data->name,data->game&kind=in.(char,relay,obs)&order=id");
    const known = await all("entries?select=char_key,data->fetched,data->missing,data->region&kind=eq.api&order=id");
    const done = new Map(known.map(r => [r.char_key, r]));

    // Characters without their own addon upload, newest information about their game first.
    const people = new Map<string, Json>();
    const hasOwn = new Set(rows.filter(r => r.kind === "char").map(r => r.char_key));
    for (const r of rows) {
      if (hasOwn.has(r.char_key)) continue;
      const p = people.get(r.char_key) ?? { key: r.char_key };
      p.name ||= r.name || r.char_key.split("-")[0];
      p.realm ||= r.realm || r.char_key.slice(r.char_key.indexOf("-") + 1);
      p.game ||= r.game;
      people.set(r.char_key, p);
    }
    const now = Date.now() / 1000;
    const due = [...people.values()].filter(p => {
      const d = done.get(p.key);
      if (!d) return true;
      return now - (d.fetched ?? 0) > (d.missing ? MISSING_HOURS : REFRESH_HOURS) * 3600;
    }).sort((a, b) => (done.get(a.key)?.fetched ?? 0) - (done.get(b.key)?.fetched ?? 0)).slice(0, PER_RUN);

    if (!due.length) return Response.json({ looked_up: 0 });
    const tok = await token();
    const out: Json[] = [];
    let found = 0, missing = 0;
    for (const p of due) {
      const ns = namespaceFor(p.game);
      if (!ns) continue; // e.g. WoW Forever before its API exists
      const home = REALM_REGION[String(p.realm).toLowerCase()] ?? done.get(p.key)?.region;
      let result: any = null;
      for (const region of home ? [home] : ["eu", "us"]) {
        result = await lookUp(tok, p.name, p.realm, ns, region);
        if (result.status === 200) break;
      }
      const data = result?.status === 200 ? result.data : { name: p.name, realm: p.realm, missing: true, fetched: Math.floor(now) };
      if (result?.status === 200) found++; else missing++;
      out.push({ id: "a:" + p.key, kind: "api", char_key: p.key, data, updated_at: new Date().toISOString() });
    }
    for (let i = 0; i < out.length; i += 100) {
      const res = await db("entries?on_conflict=id", {
        method: "POST", headers: { Prefer: "resolution=merge-duplicates,return=minimal" }, body: JSON.stringify(out.slice(i, i + 100)),
      });
      if (!res.ok) throw new Error(`saving: ${res.status} ${await res.text()}`);
    }
    return Response.json({ looked_up: out.length, found, missing });
  } catch (e) {
    return Response.json({ error: e instanceof Error ? e.message : String(e) }, { status: 500 });
  }
});
