// The site's data rules: database rows into characters, and the character of the week's scoring.
// Kept apart from app.js so tests/test_site_data.mjs can run them in Node.
(function (root) {
  const localKey = t => { const d = new Date(t * 1000); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`; };

  // Database rows into the site's sources: own uploads, friends' relay copies, observations and Blizzard API rows.
  function mergeRows(rows) {
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
      // a copy of someone's stats, received in game by another player. Copies are merged below, newest on top.
      // A copy can't be newer than its upload, so a made-up lastSeen far in the future doesn't win.
      const seen = Math.min(Number(data.lastSeen) || 0, (Date.parse(r.updated_at) || 0) / 1000);
      (relays[r.char_key] ||= []).push({ data, seen });
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
  // Copies only fill in characters that haven't uploaded their own stats. Each friend's copy may hold only the
  // days they happened to receive (a fresh install starts at today), so all copies are merged: the newest
  // copy's profile and days win, older copies fill the days it lacks, and deaths and notables are combined.
  for (const [key, list] of Object.entries(relays)) {
    const id = "c-" + key;
    if (src.chars[id]) continue;
    list.sort((a, b) => a.seen - b.seen || Object.keys(a.data.days || {}).length - Object.keys(b.data.days || {}).length);
    const { days, ...rest } = list[list.length - 1].data;
    const all = f => { const seen = new Set(); return list.flatMap(c => Array.isArray(c.data[f]) ? c.data[f] : [])
      .filter(e => { const k = e && `${e.t}|${e.by || e.item || e.cause || e.boss || e.inst || ""}`; return k && !seen.has(k) && seen.add(k); })
      .sort((a, b) => (a.t || 0) - (b.t || 0)); };
    src.chars[id] = { ...rest, key, relay: true, deaths: all("deaths"), notable: all("notable") };
    src.days[id] = { char: id, days: Object.assign({}, ...list.map(c => c.data.days && typeof c.data.days === "object" ? c.data.days : {})) };
  }
    return { src, updated };
  }

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
      if (a.look && a.look.race) ch.look = a.look; // race, gender and customizations for the 3D model
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

  // A character's numbers summed over the days from..to (day keys, inclusive). Gold and the biggest hit aren't sums.
  function weekTotals(days, from, to) {
    const s = {};
    for (const [k, d] of Object.entries(days || {})) if (k >= from && k <= to) for (const [f, v] of Object.entries(d)) if (typeof v === "number" && f !== "gold" && f !== "maxHit") s[f] = (s[f] || 0) + v;
    return s;
  }
  // The week's winner from [{ s: totals }]: each field scores its share of the week's top value, so leading many
  // things beats topping one. Nothing when fewer than two played or nobody did anything.
  function scorePotw(rows, fields) {
    const top = Object.fromEntries(fields.map(f => [f, Math.max(0, ...rows.map(r => r.s[f] || 0))]));
    const share = (r, f) => top[f] ? (r.s[f] || 0) / top[f] : 0;
    rows.forEach(r => r.score = fields.reduce((a, f) => a + share(r, f), 0));
    const best = rows.slice().sort((a, b) => b.score - a.score)[0];
    return best && best.score && rows.length > 1 ? { best, top, share } : null;
  }

  const api = { localKey, mergeRows, characters, weekTotals, scorePotw };
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.LedgerData = api;
})(this);
