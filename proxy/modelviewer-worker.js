// Cloudflare Worker: serves Wowhead's 3D model viewer to the Ledger site.
// Wowhead's file server refuses requests from other sites, so this fetches them and adds a CORS header.
// Cloudflare caches every answer, so Wowhead sees each file about once a month.
//
//   /modelviewer/<path>    -> https://wow.zamimg.com/modelviewer/<path>  (viewer script, models, textures)
//   /display/<env>/<item>  -> {"slot":1,"display":27606} from Wowhead's item XML (env: forever, classic, tbc or live)
//
// Deploy: `npx wrangler deploy` in this folder (wrangler.toml), or in the Cloudflare dashboard paste this file
// into a new Worker. Then put the worker's address in site/config.js as modelViewer.

// Sites allowed to use this worker: add the Ledger's own address (e.g. "https://ledger.example.com", no trailing slash).
const ALLOWED_ORIGINS = ["https://azeroth-ledger.pages.dev", "http://localhost:8765"];
const MONTH = 30 * 24 * 3600;
const ENV_PATH = { forever: "forever/", classic: "classic/", tbc: "tbc/", live: "" };

export default {
  async fetch(req, env, ctx) {
    const url = new URL(req.url);
    const origin = req.headers.get("Origin");
    const cors = { "Access-Control-Allow-Origin": ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0], Vary: "Origin" };
    if (req.method === "OPTIONS") return new Response(null, { headers: { ...cors, "Access-Control-Allow-Methods": "GET" } });
    if (req.method !== "GET") return new Response("GET only", { status: 405, headers: cors });

    // Cached answers skip Wowhead entirely; the CORS header is added per request, since it depends on the origin.
    const cache = caches.default, key = new Request(url.origin + url.pathname);
    let res = await cache.match(key);
    if (!res) {
      res = await fromWowhead(url.pathname);
      if (!res) return new Response("Not found", { status: 404, headers: cors });
      if (res.ok) ctx.waitUntil(cache.put(key, res.clone()));
    }
    const out = new Response(res.body, res);
    for (const [k, v] of Object.entries(cors)) out.headers.set(k, v);
    return out;
  },
};

async function fromWowhead(path) {
  const ua = { "User-Agent": "Mozilla/5.0 (compatible; AzerothLedger)" };
  // Only the model viewer's own folder: this must not become an open proxy.
  if (/^\/modelviewer\/[\w\-./]+$/.test(path) && !path.includes("..")) {
    const r = await fetch("https://wow.zamimg.com" + path, { headers: ua });
    const headers = new Headers({ "Content-Type": r.headers.get("Content-Type") || "application/octet-stream" });
    headers.set("Cache-Control", r.ok ? `public, max-age=${MONTH}, immutable` : "public, max-age=3600");
    return new Response(r.body, { status: r.status, headers });
  }
  const m = path.match(/^\/display\/(forever|classic|tbc|live)\/(\d{1,7})$/);
  if (m) {
    const xml = await (await fetch(`https://www.wowhead.com/${ENV_PATH[m[1]]}item=${m[2]}&xml`, { headers: ua })).text();
    const display = xml.match(/displayId="(\d+)"/), slot = xml.match(/<inventorySlot id="(\d+)"/);
    const body = display && slot ? { slot: +slot[1], display: +display[1] } : { missing: true };
    return new Response(JSON.stringify(body), { headers: { "Content-Type": "application/json", "Cache-Control": `public, max-age=${display ? MONTH : 86400}` } });
  }
  return null;
}
