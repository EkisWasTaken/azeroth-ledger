// Azeroth Ledger: armory sync (Supabase Edge Function "armory").
//
// Fills in level, gear and guild from Blizzard's official API for characters that are on the
// ledger but don't run the addon themselves (guild members from rosters, party members seen in
// game, copies received from friends), plus the face and full-body renders for every character,
// addon users included. It also looks up each guild's crest (tabard) and, once a week, Blizzard's
// dungeon journal for instance art and boss portraits. Runs on a schedule (see supabase/armory.sql); results are stored as rows
// of kind 'api', which the website merges in.
//
// Secrets (Supabase > Edge Functions > Secrets): BLIZZARD_CLIENT_ID, BLIZZARD_CLIENT_SECRET.
// Optional: FOREVER_NAMESPACE (e.g. "profile-forever"), once Blizzard publishes WoW Forever's API.

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? Deno.env.get("SUPABASE_SECRET_KEY") ?? "";
const CLIENT_ID = Deno.env.get("BLIZZARD_CLIENT_ID") ?? "";
const CLIENT_SECRET = Deno.env.get("BLIZZARD_CLIENT_SECRET") ?? "";
const FOREVER_NS = Deno.env.get("FOREVER_NAMESPACE") ?? "";

const PER_RUN = 150;            // characters looked up per run (up to 3 API calls each)
const REFRESH_HOURS = 12;       // look a character up again after this long
const MISSING_HOURS = 72;       // ...or this long if Blizzard didn't know them
const MIN_GAP_MINUTES = 20;     // ignore calls that come sooner than this after the last run
const VERSION = 3;              // saved with each lookup; older rows are looked up again (2 added face renders, 3 full-body renders)
const GUILDS_PER_RUN = 40;      // guild crests looked up per run (up to 3 API calls each)
const GUILD_HOURS = 72;         // look a guild's crest up again after this long
const JOURNAL_DAYS = 7;         // refresh the dungeon journal (instance art, boss portraits) this often

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
  const media: any = await lookUpMedia(tok, name, realm, ns, region);
  return {
    status: 200,
    data: {
      name: p.name ?? name, realm, region, level: p.level,
      class: CLASS[p.character_class?.id] ?? undefined, race: RACE[p.race?.id] ?? undefined,
      guild: p.guild?.name ?? null, faction: p.faction?.type, ilvl: p.equipped_item_level ?? p.average_item_level,
      lastLogin: p.last_login_timestamp ? Math.floor(p.last_login_timestamp / 1000) : undefined,
      gear, avatar: media.assets?.avatar, render: renderOf(media.assets), v: VERSION, fetched: Math.floor(Date.now() / 1000),
    },
  };
}

// Addon users bring their own stats, so for them only the face render is looked up.
async function lookUpFace(tok: string, name: string, realm: string, ns: string, region: string) {
  const media: any = await lookUpMedia(tok, name, realm, ns, region);
  if (media.status !== 200 || !media.assets?.avatar) return { status: media.status === 200 ? 404 : media.status };
  return { status: 200, data: { name, realm, region, avatar: media.assets.avatar, render: renderOf(media.assets), faceOnly: true, v: VERSION, fetched: Math.floor(Date.now() / 1000) } };
}

// Rendered images of a character (face avatar, bust, full body), if Blizzard has them for this game.
async function lookUpMedia(tok: string, name: string, realm: string, ns: string, region: string) {
  const url = `https://${region}.api.blizzard.com/profile/wow/character/${encodeURIComponent(slug(realm))}/${encodeURIComponent(name.toLowerCase())}/character-media?namespace=${ns}-${region}&locale=en_US`;
  const res = await fetch(url, { headers: { Authorization: "Bearer " + tok } });
  if (!res.ok) return { status: res.status };
  const m = await res.json();
  // Newer responses list assets as [{ key, value }]; older ones use avatar_url, bust_url and render_url.
  const assets: Json = {};
  for (const a of m.assets ?? []) assets[a.key] = a.value;
  for (const k of ["avatar_url", "bust_url", "render_url"]) if (m[k]) assets[k] = m[k];
  return { status: 200, assets };
}

// The full-body render: "main-raw" has a transparent background; older responses only have render_url.
const renderOf = (assets: Json | undefined) => assets?.["main-raw"] ?? assets?.main ?? assets?.render_url;

const api = (tok: string, url: string) => fetch(url, { headers: { Authorization: "Bearer " + tok } });
// A media link's image URL (Blizzard returns the link first, the image behind it).
const image = async (tok: string, href: string | undefined, key: string) => {
  if (!href) return undefined;
  const res = await api(tok, href);
  if (!res.ok) return undefined;
  const assets = (await res.json()).assets ?? [];
  return (assets.find((a: Json) => a.key === key) ?? assets[0])?.value;
};
const rgba = (c: Json | undefined) => c?.rgba ? `rgba(${c.rgba.r},${c.rgba.g},${c.rgba.b},${c.rgba.a ?? 1})` : undefined;

// A guild's crest: emblem and border images (white shapes the site tints) with their colours, and the background colour.
async function lookUpGuild(tok: string, guild: string, realm: string, ns: string, region: string) {
  const res = await api(tok, `https://${region}.api.blizzard.com/data/wow/guild/${encodeURIComponent(slug(realm))}/${encodeURIComponent(slug(guild))}?namespace=${ns}-${region}&locale=en_US`);
  if (!res.ok) return { status: res.status };
  const g = await res.json();
  const c = g.crest ?? {};
  return {
    status: 200,
    data: {
      guild, realm, region, faction: g.faction?.type, members: g.member_count,
      emblem: c.emblem && { img: await image(tok, c.emblem.media?.key?.href, "image"), color: rgba(c.emblem.color) },
      border: c.border && { img: await image(tok, c.border.media?.key?.href, "image"), color: rgba(c.border.color) },
      bg: rgba(c.background?.color), v: VERSION, fetched: Math.floor(Date.now() / 1000),
    },
  };
}

// Run fn over items, a few at a time.
async function eachLimit<T, R>(items: T[], n: number, fn: (x: T) => Promise<R>): Promise<R[]> {
  const out: R[] = [];
  for (let i = 0; i < items.length; i += n) out.push(...await Promise.all(items.slice(i, i + n).map(fn)));
  return out;
}

// Classic and Burning Crusade instances from Blizzard's dungeon journal (retail data, which still has them):
// each instance's art and each boss's portrait, by name.
async function lookUpJournal(tok: string) {
  const base = "https://eu.api.blizzard.com/data/wow", q = "namespace=static-eu&locale=en_US";
  const get = async (path: string) => { const r = await api(tok, `${base}/${path}?${q}`); return r.ok ? r.json() : null; };
  const tiers = (await get("journal-expansion/index"))?.tiers ?? [];
  const instances: Json[] = [];
  for (const t of tiers.filter((t: Json) => /^(classic|burning crusade)$/i.test(t.name ?? ""))) {
    const x = await get(`journal-expansion/${t.id}`);
    instances.push(...(x?.dungeons ?? []), ...(x?.raids ?? []));
  }
  const inst: Json = {}, boss: Json = {};
  await eachLimit(instances, 8, async (i: Json) => {
    const [full, media] = await Promise.all([get(`journal-instance/${i.id}`), get(`media/journal-instance/${i.id}`)]);
    const tile = media?.assets?.find((a: Json) => a.key === "tile")?.value;
    if (tile) inst[i.name] = tile;
    await eachLimit(full?.encounters ?? [], 4, async (e: Json) => {
      const enc = await get(`journal-encounter/${e.id}`);
      const display = enc?.creatures?.[0]?.creature_display?.id;
      const zoom = display && (await get(`media/creature-display/${display}`))?.assets?.find((a: Json) => a.key === "zoom")?.value;
      if (zoom) boss[e.name] = zoom;
    });
  });
  return { inst, boss, v: VERSION, fetched: Math.floor(Date.now() / 1000) };
}

async function save(out: Json[]) {
  for (let i = 0; i < out.length; i += 100) {
    const res = await db("entries?on_conflict=id", {
      method: "POST", headers: { Prefer: "resolution=merge-duplicates,return=minimal" }, body: JSON.stringify(out.slice(i, i + 100)),
    });
    if (!res.ok) throw new Error(`saving: ${res.status} ${await res.text()}`);
  }
}

Deno.serve(async (req) => {
  try {
    if (!SERVICE_KEY) return Response.json({ error: "No service key in the function's environment (SUPABASE_SERVICE_ROLE_KEY)." }, { status: 500 });
    if (!CLIENT_ID || !CLIENT_SECRET) return Response.json({ error: "Set BLIZZARD_CLIENT_ID and BLIZZARD_CLIENT_SECRET under Edge Functions > Secrets." }, { status: 500 });

    // Test mode: ?check=Name-Realm looks one character up and shows what Blizzard returns, including any
    // rendered images under "media" (nothing is saved).
    const check = new URL(req.url).searchParams.get("check");
    if (check && check.includes("-")) {
      const name = check.slice(0, check.indexOf("-")), realm = check.slice(check.indexOf("-") + 1);
      const tok = await token();
      const tried: Json[] = [];
      for (const ns of ["profile-classicann", "profile-classic1x"]) {
        for (const region of REALM_REGION[realm.toLowerCase()] ? [REALM_REGION[realm.toLowerCase()]] : ["eu", "us"]) {
          const r: any = await lookUp(tok, name, realm, ns, region);
          tried.push({ namespace: `${ns}-${region}`, status: r.status, level: r.data?.level, guild: r.data?.guild, gear: r.data ? Object.keys(r.data.gear).length : undefined });
          if (r.status === 200) return Response.json({ login: "ok", tried, media: await lookUpMedia(tok, name, realm, ns, region) });
        }
      }
      return Response.json({ login: "ok", tried });
    }

    // Throttle: this endpoint is public (the schedule calls it), so extra calls are ignored.
    const last = await (await db("entries?kind=eq.api&select=updated_at&order=updated_at.desc&limit=1")).json();
    if (last[0] && Date.now() - Date.parse(last[0].updated_at) < MIN_GAP_MINUTES * 60_000) {
      return Response.json({ skipped: "ran recently" });
    }

    // Once a week, a run refreshes the dungeon journal instead of looking characters up.
    const journal = (await (await db("entries?id=eq.j:journal&select=fetched:data->fetched")).json())[0];
    if (!journal || Date.now() / 1000 - (journal.fetched ?? 0) > JOURNAL_DAYS * 86400) {
      const data = await lookUpJournal(await token());
      await save([{ id: "j:journal", kind: "api", char_key: "journal", data, updated_at: new Date().toISOString() }]);
      return Response.json({ journal: { instances: Object.keys(data.inst).length, bosses: Object.keys(data.boss).length } });
    }

    const rows = await all("entries?select=kind,char_key,data->realm,data->name,data->game,data->guild&kind=in.(char,relay,obs)&order=id");
    const known = await all("entries?select=id,char_key,data->fetched,data->missing,data->region,data->v,data->guild,data->realm&kind=eq.api&order=id");
    const done = new Map(known.map(r => [r.char_key, r]));

    // Everyone on the ledger: a full lookup for characters without their own addon upload,
    // just the face render for addon users (their own upload is the best source for the rest).
    const people = new Map<string, Json>();
    const hasOwn = new Set(rows.filter(r => r.kind === "char").map(r => r.char_key));
    for (const r of rows) {
      const own = hasOwn.has(r.char_key);
      if (own && r.kind !== "char") continue;
      const p = people.get(r.char_key) ?? { key: r.char_key, own };
      p.name ||= r.name || r.char_key.split("-")[0];
      p.realm ||= r.realm || r.char_key.slice(r.char_key.indexOf("-") + 1);
      p.game ||= r.game;
      people.set(r.char_key, p);
    }
    const now = Date.now() / 1000;
    const due = [...people.values()].filter(p => {
      const d = done.get(p.key);
      if (!d || (!d.missing && d.v !== VERSION)) return true;
      return now - (d.fetched ?? 0) > (d.missing ? MISSING_HOURS : REFRESH_HOURS) * 3600;
    }).sort((a, b) => (done.get(a.key)?.fetched ?? 0) - (done.get(b.key)?.fetched ?? 0)).slice(0, PER_RUN);

    // Guilds seen on the ledger (from uploads and earlier lookups), with a member's game for the namespace.
    const games = new Map(rows.map(r => [r.char_key, r.game]));
    const guilds = new Map<string, Json>();
    for (const r of [...rows, ...known]) {
      if (!r.guild || !r.realm || String(r.id ?? "").startsWith("g:")) continue;
      const k = `${r.realm}|${r.guild}`;
      if (!guilds.has(k)) guilds.set(k, { key: k, guild: r.guild, realm: r.realm, game: r.game ?? games.get(r.char_key), region: r.region });
    }
    const dueGuilds = [...guilds.values()].filter(g => {
      const d = done.get("guild:" + g.key);
      return !d || now - (d.fetched ?? 0) > (d.missing ? MISSING_HOURS : GUILD_HOURS) * 3600;
    }).slice(0, GUILDS_PER_RUN);

    if (!due.length && !dueGuilds.length) return Response.json({ looked_up: 0 });
    const tok = await token();
    const out: Json[] = [];
    let found = 0, missing = 0;
    for (const p of due) {
      const ns = namespaceFor(p.game);
      if (!ns) continue; // e.g. WoW Forever before its API exists
      const home = REALM_REGION[String(p.realm).toLowerCase()] ?? done.get(p.key)?.region;
      let result: any = null;
      for (const region of home ? [home] : ["eu", "us"]) {
        result = await (p.own ? lookUpFace : lookUp)(tok, p.name, p.realm, ns, region);
        if (result.status === 200) break;
      }
      const data = result?.status === 200 ? result.data : { name: p.name, realm: p.realm, missing: true, fetched: Math.floor(now) };
      if (result?.status === 200) found++; else missing++;
      out.push({ id: "a:" + p.key, kind: "api", char_key: p.key, data, updated_at: new Date().toISOString() });
    }
    let crests = 0;
    for (const g of dueGuilds) {
      const ns = namespaceFor(g.game);
      if (!ns) continue;
      const home = REALM_REGION[String(g.realm).toLowerCase()] ?? g.region;
      let result: any = null;
      for (const region of home ? [home] : ["eu", "us"]) {
        result = await lookUpGuild(tok, g.guild, g.realm, ns, region);
        if (result.status === 200) break;
      }
      if (result?.status === 200) crests++;
      const data = result?.status === 200 ? result.data : { guild: g.guild, realm: g.realm, missing: true, fetched: Math.floor(now) };
      out.push({ id: "g:" + g.key, kind: "api", char_key: "guild:" + g.key, data, updated_at: new Date().toISOString() });
    }
    await save(out);
    return Response.json({ looked_up: out.length, found, missing, crests });
  } catch (e) {
    return Response.json({ error: e instanceof Error ? e.message : String(e) }, { status: 500 });
  }
});
