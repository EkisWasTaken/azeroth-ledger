// The site's data rules (site/ledger-data.js), run with: node --test tests
process.env.TZ = "Europe/Stockholm"; // day keys are local dates, as for the friends reading the site
import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";

const require = createRequire(import.meta.url);
const { mergeRows, characters, weekTotals, scorePotw, mostWanted } = require("../site/ledger-data.js");
const FIELDS = ["dmg", "heal", "kb", "quests", "xp", "levels", "goldIn", "dungeons", "played"];

const load = rows => characters(mergeRows(rows).src);
const relay = (who, at, days, extra = {}) => ({ id: `r:${who}:Hero-R`, kind: "relay", char_key: "Hero-R", updated_at: at,
  data: { name: "Hero", lastSeen: Date.parse(at) / 1000, days, ...extra } });
const winner = (chars, from, to) => {
  const r = scorePotw(chars.map(p => ({ p, s: weekTotals(p.days, from, to) })), FIELDS);
  return r && r.best.p.name;
};

test("every friend's relay copy counts: a fresh copy with only today doesn't hide earlier days", () => {
  const [ch] = load([
    relay("a", "2026-11-09T20:00:00Z", { "2026-11-05": { dmg: 100 }, "2026-11-08": { dmg: 50 } }),
    relay("b", "2026-11-10T20:00:00Z", { "2026-11-08": { dmg: 70 }, "2026-11-10": { dmg: 9 } }), // newer: wins its days
  ]);
  assert.deepEqual(ch.days, { "2026-11-05": { dmg: 100 }, "2026-11-08": { dmg: 70 }, "2026-11-10": { dmg: 9 } });
});

test("relay copies with the same time: the one with more days is the newest", () => {
  const at = "2026-11-10T20:00:00Z";
  const [ch] = load([relay("full", at, { "2026-11-09": { dmg: 80 }, "2026-11-10": { dmg: 5 } }, { level: 30 }),
    relay("fresh", at, { "2026-11-10": { dmg: 3 } }, { level: 29 })]);
  assert.equal(ch.level, 30);
  assert.equal(ch.days["2026-11-09"].dmg, 80);
});

test("relay copies combine their deaths without doubles", () => {
  const d1 = { t: 1794000000, cause: "mob", by: "Wolf" }, d2 = { t: 1794100000, cause: "fall" };
  const [ch] = load([relay("a", "2026-11-09T20:00:00Z", {}, { deaths: [d1] }), relay("b", "2026-11-10T20:00:00Z", {}, { deaths: [d1, d2] })]);
  assert.deepEqual(ch.deaths.map(d => d.t), [d1.t, d2.t]);
});

test("a character's own upload beats any relay copy", () => {
  const [ch] = load([
    { id: "c:Hero-R", kind: "char", char_key: "Hero-R", updated_at: "2026-11-01T00:00:00Z", data: { name: "Hero", days: { "2026-11-01": { dmg: 1 } } } },
    relay("a", "2026-11-10T20:00:00Z", { "2026-11-05": { dmg: 999 } }),
  ]);
  assert.deepEqual(ch.days, { "2026-11-01": { dmg: 1 } });
  assert.ok(!ch.relay);
});

test("observations only fill missing days, and two observers of one day count once", () => {
  const obs = (who, days) => ({ id: `o:${who}:Hero-R`, kind: "obs", char_key: "Hero-R", updated_at: "2026-11-10T00:00:00Z", data: { name: "Hero", days } });
  const [ch] = load([
    { id: "c:Hero-R", kind: "char", char_key: "Hero-R", updated_at: "2026-11-10T00:00:00Z", data: { name: "Hero", days: { "2026-11-05": { dmg: 10 } } } },
    obs("a", { "2026-11-05": { dmg: 500 }, "2026-11-06": { dmg: 40 } }), obs("b", { "2026-11-06": { dmg: 60 } }),
  ]);
  assert.equal(ch.days["2026-11-05"].dmg, 10);
  assert.equal(ch.days["2026-11-06"].dmg, 60);
});

test("a newer relay copy never lowers a finished week (real data)", () => {
  const rows = JSON.parse(readFileSync(new URL("./fixtures/ledger-2026-11-10.json", import.meta.url), "utf8"));
  const total = chars => Object.fromEntries(chars.map(c => [c.key, weekTotals(c.days, "2026-11-03", "2026-11-09").dmg || 0]));
  const before = total(load(rows.filter(r => !(r.kind === "relay" && r.updated_at > "2026-11-10T22:00"))));
  const after = total(load(rows));
  for (const [key, dmg] of Object.entries(before)) assert.ok(after[key] >= dmg, `${key}: ${dmg} -> ${after[key]}`);
});

test("character of the week Nov 3-9 is Flexus Maximus (real data, the week the relay bug crowned someone else)", () => {
  const rows = JSON.parse(readFileSync(new URL("./fixtures/ledger-2026-11-10.json", import.meta.url), "utf8"));
  const chars = load(rows);
  const flexus = chars.find(c => c.name === "Flexus Maximus");
  assert.equal(weekTotals(flexus.days, "2026-11-03", "2026-11-09").kb, 2396);
  assert.equal(winner(chars, "2026-11-03", "2026-11-09"), "Flexus Maximus");
});

test("leading many stats beats topping one; nobody wins alone or with nothing done", () => {
  const p = (name, s) => ({ p: { name }, s });
  assert.equal(scorePotw([p("A", { dmg: 100 }), p("B", { dmg: 90, quests: 5, xp: 5 })], FIELDS).best.p.name, "B");
  assert.equal(scorePotw([p("A", { dmg: 100 })], FIELDS), null);
  assert.equal(scorePotw([p("A", {}), p("B", {})], FIELDS), null);
});

test("Most Wanted: everyone with 2+ kills on us in the last 7 days, older kills drop off", () => {
  const now = 1794000000, day = 86400, a = { name: "Ann" }, b = { name: "Bo" };
  const kill = (p, by, ago) => ({ p, d: { t: now - ago * day, cause: "player", by } });
  const board = mostWanted([
    kill(a, "Gank", 1), kill(b, "Gank", 2),           // two heroes: tops the board
    kill(a, "Stab", 1), kill(a, "Stab", 3), kill(a, "Stab", 4), // one hero, three times
    kill(a, "Once", 1),                               // one kill: not wanted
    kill(a, "Old", 8), kill(b, "Old", 9), kill(a, "Old", 6), // only one kill this week
    { p: a, d: { t: now - day, cause: "mob", by: "Wolf" } }, { p: b, d: { t: now - day, cause: "mob", by: "Wolf" } },
  ], now);
  assert.deepEqual(board.map(([n]) => n), ["Gank", "Stab"]);
  assert.equal(board[1][1].n, 3);
});

test("loot showcase: the newest epic, BoE and equipped drops; mailed copies and plain rares left out", () => {
  const { showcaseDrops } = require("../site/ledger-data.js");
  const [a, b] = [{ name: "A" }, { name: "B" }];
  const d = (p, item, q, t, extra = {}, worn = false) => ({ p, n: { item, id: item.length, q, t, ...extra }, worn });
  const names = list => showcaseDrops(list).map(x => x.n.item);
  const list = [
    d(a, "Quest Chest", 3, 90, { quest: true }, true),   // a worn quest reward is not a drop: left out
    d(a, "Old Epic", 4, 5),
    d(a, "Gloves", 3, 20, { boe: true, world: true }),   // looted by A...
    d(b, "Gloves", 3, 30, { boe: true, quest: true }),   // ...and mailed to B: not a second drop
    d(b, "New Helm", 3, 40, {}, true),
    d(a, "Rare Blade", 3, 25, { boe: true }),
  ];
  assert.deepEqual(names(list), ["New Helm", "Rare Blade", "Gloves"]);
  assert.deepEqual(names([d(a, "Quest Chest", 3, 50, { quest: true }), d(a, "Old Rare", 3, 1)]), ["Quest Chest"]);
  assert.deepEqual(names([]), []);
});
