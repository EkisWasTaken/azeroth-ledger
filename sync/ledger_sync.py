"""Azeroth Ledger sync: publishes FunStats.lua to Supabase so the website can show it.

Optional: anyone can instead upload FunStats.lua on the website. This script just does it
automatically every time WoW saves. It uses the upload code in your FunStats.lua, so your
characters can only be updated by you.

    python ledger_sync.py            publish once
    python ledger_sync.py --watch    keep running; publish whenever WoW saves the file
    python ledger_sync.py --dry-run  show what would be published, send nothing

Works without any setup. config.json next to this script can override the defaults.
Uses only the Python standard library.
"""

import hashlib
import json
import os
import re
import sys
import time
import urllib.error
import urllib.request
from glob import glob
from pathlib import Path

HERE = Path(__file__).resolve().parent
CONFIG_PATH = HERE / "config.json"
# The ledger's public address and public key. Safe to share; anyone with the addon can upload with these.
DEFAULTS = {
    "supabase_url": "https://nznnybzrqplsqyhotlnd.supabase.co",
    "publishable_key": "sb_publishable_RNaALyd2OI4jthFr0FvFRA_2CCRxzRE",
    "savedvariables": [],
    "ignore": [],
}
CACHE_PATH = HERE / ".published.json"
WATCH_EVERY = 20            # seconds between checks for a newer FunStats.lua
KEEPALIVE_EVERY = 6 * 3600  # a small read so Supabase's free tier doesn't pause the project


# ---------------------------------------------------------------- Lua parser

class LuaError(ValueError):
    pass


def parse_lua(src):
    """Parse a WoW SavedVariables file into Python values (dicts, lists, str, float, bool)."""
    i, n = 0, len(src)
    ident = re.compile(r"[A-Za-z_][A-Za-z0-9_]*")
    number = re.compile(r"-?(?:0[xX][0-9a-fA-F]+|(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?)")
    escapes = {"n": "\n", "t": "\t", "r": "\r", "a": "\a", "b": "\b", "f": "\f", "v": "\v",
               "\\": "\\", '"': '"', "'": "'", "\n": "\n"}

    def fail(msg):
        raise LuaError(f"{msg} at character {i}")

    def skip():
        nonlocal i
        while True:
            while i < n and src[i].isspace():
                i += 1
            if src.startswith("--", i):
                m = re.match(r"\[(=*)\[", src[i + 2:i + 40])
                if m:
                    close = "]" + m.group(1) + "]"
                    e = src.find(close, i)
                    i = n if e < 0 else e + len(close)
                else:
                    e = src.find("\n", i)
                    i = n if e < 0 else e + 1
                continue
            return

    def string():
        nonlocal i
        q = src[i]
        i += 1
        out = []
        while i < n and src[i] != q:
            c = src[i]
            i += 1
            if c == "\\":
                c = src[i]
                i += 1
                if c in escapes:
                    out.append(escapes[c])
                elif c.isdigit():
                    d = c
                    while len(d) < 3 and i < n and src[i].isdigit():
                        d += src[i]
                        i += 1
                    out.append(chr(int(d)))
                else:
                    out.append(c)
            else:
                out.append(c)
        if i >= n:
            fail("Unfinished text")
        i += 1
        return "".join(out)

    def value():
        nonlocal i
        skip()
        if i >= n:
            fail("Unexpected end")
        c = src[i]
        if c == "{":
            return table()
        if c in "\"'":
            return string()
        m = number.match(src, i)
        if m and m.group(0) != "-":
            i = m.end()
            t = m.group(0)
            return float(int(t, 16)) if t.lower().startswith(("0x", "-0x")) else float(t)
        m = ident.match(src, i)
        if m:
            i = m.end()
            return {"true": True, "false": False}.get(m.group(0))
        fail("Unexpected symbol")

    def table():
        nonlocal i
        i += 1
        obj, pos, keyed = {}, 1, False
        while True:
            skip()
            if i >= n:
                fail("Unfinished table")
            if src[i] == "}":
                i += 1
                break
            key = None
            if src[i] == "[":
                i += 1
                key = value()
                skip()
                if src[i] != "]":
                    fail("Expected ]")
                i += 1
                skip()
                if src[i] != "=":
                    fail("Expected =")
                i += 1
                keyed = True
            else:
                m = ident.match(src, i)
                if m and re.match(r"\s*=(?!=)", src[m.end():m.end() + 8]):
                    key = m.group(0)
                    i = m.end()
                    skip()
                    i += 1
                    keyed = True
            v = value()
            if key is None:
                key = pos
                pos += 1
            if isinstance(key, float) and key.is_integer():
                key = int(key)
            if v is not None:
                obj[str(key)] = v
            skip()
            if i < n and src[i] in ",;":
                i += 1
        keys = list(obj.keys())
        if keys and all(k == str(idx + 1) for idx, k in enumerate(keys)):
            return [obj[k] for k in keys]
        if not keys and not keyed:
            return []
        return obj

    out = {}
    while True:
        skip()
        if i >= n:
            break
        m = ident.match(src, i)
        if not m:
            fail("Expected a variable name")
        i = m.end()
        skip()
        if i >= n or src[i] != "=":
            fail("Expected =")
        i += 1
        out[m.group(0)] = value()
    return out


def tidy(v):
    """Turn whole-number floats back into ints so the JSON stays small and exact."""
    if isinstance(v, float) and v.is_integer():
        return int(v)
    if isinstance(v, dict):
        return {k: tidy(x) for k, x in v.items()}
    if isinstance(v, list):
        return [tidy(x) for x in v]
    return v


# ---------------------------------------------------------------- building rows

def as_list(v):
    if isinstance(v, list):
        return v
    if isinstance(v, dict):
        return list(v.values())
    return []


def build_rows(db, ignore):
    """Rows for one save file: each own character ('char'), copies of other players received
    in game ('relay') and combat observations of friends without the addon ('obs')."""
    ignore = {s.lower() for s in ignore}
    account = db.get("id") or "unknown"
    rows = []
    own_keys = set()

    def skip_char(key):
        return key.lower() in ignore or key.split("-")[0].lower() in ignore

    def char_data(key, c, owner_fallback):
        data = dict(c)
        for private in ("settings", "killNames", "secret"):
            data.pop(private, None)
        data["key"] = key
        data["name"] = data.get("name") or key.split("-")[0]
        data["owner"] = data.get("owner") or owner_fallback
        data["deaths"] = as_list(data.get("deaths"))
        data["notable"] = as_list(data.get("notable"))
        data["days"] = data.get("days") if isinstance(data.get("days"), dict) else {}
        return tidy(data)

    for key, c in (db.get("chars") or {}).items():
        if isinstance(c, dict) and not skip_char(key):
            own_keys.add(key)
            rows.append({"kind": "char", "char_key": key, "data": char_data(key, c, account)})

    for key, c in (db.get("synced") or {}).items():
        if isinstance(c, dict) and key not in own_keys and not skip_char(key):
            rows.append({"kind": "relay", "char_key": key, "data": char_data(key, c, "char:" + key)})

    for key, o in (db.get("observed") or {}).items():
        if not isinstance(o, dict) or key in own_keys or skip_char(key):
            continue
        data = tidy(dict(o))
        data["key"] = key
        data["name"] = data.get("name") or key.split("-")[0]
        data["deaths"] = as_list(data.get("deaths"))
        rows.append({"kind": "obs", "char_key": key, "data": data})
    return rows


# ---------------------------------------------------------------- Supabase

def headers(key):
    h = {"apikey": key, "Content-Type": "application/json"}
    if not key.startswith("sb_"):
        h["Authorization"] = "Bearer " + key  # older JWT-style keys
    return h


def request(cfg, method, path, body=None, extra=None):
    url = cfg["supabase_url"].rstrip("/") + path
    data = json.dumps(body).encode() if body is not None else None
    req = urllib.request.Request(url, data=data, method=method, headers={**headers(cfg["publishable_key"]), **(extra or {})})
    try:
        with urllib.request.urlopen(req, timeout=60) as r:
            return r.status, r.read()
    except urllib.error.HTTPError as e:
        detail = e.read().decode(errors="replace")[:400]
        raise RuntimeError(f"Supabase answered {e.code}: {detail}") from None
    except urllib.error.URLError as e:
        raise RuntimeError(f"Couldn't reach Supabase: {e.reason}") from None


def publish(cfg, uploads, dry_run=False):
    """uploads: list of (upload code, rows) — one per save file / WoW account."""
    cache = {}
    if CACHE_PATH.exists():
        try:
            cache = json.loads(CACHE_PATH.read_text(encoding="utf-8"))
        except ValueError:
            cache = {}
    any_sent = False
    for secret, rows in uploads:
        changed = []
        for row in rows:
            cache_key = row["kind"] + ":" + row["char_key"] + ":" + secret[:8]
            digest = hashlib.sha1(json.dumps(row, sort_keys=True).encode()).hexdigest()
            if cache.get(cache_key) != digest:
                changed.append((row, cache_key, digest))
        if not changed:
            continue
        any_sent = True
        names = ", ".join(sorted({r["data"].get("name", r["char_key"]) for r, _, _ in changed}))
        if dry_run:
            size = sum(len(json.dumps(r)) for r, _, _ in changed)
            log(f"Would publish {len(changed)} row(s), {size // 1024} KB: {names}")
            continue
        saved = skipped = 0
        for start in range(0, len(changed), 10):
            batch = [r for r, _, _ in changed[start:start + 10]]
            _, body = request(cfg, "POST", "/rest/v1/rpc/upload_ledger", {"p_secret": secret, "p_rows": batch})
            result = json.loads(body or b"{}")
            saved += result.get("saved", 0)
            skipped += result.get("skipped", 0)
        for _, cache_key, digest in changed:
            cache[cache_key] = digest
        CACHE_PATH.write_text(json.dumps(cache), encoding="utf-8")
        note = f" ({skipped} skipped: those characters were claimed by another upload code)" if skipped else ""
        log(f"Published {saved} row(s): {names}{note}")
    if not any_sent:
        log("Nothing new to publish.")


# ---------------------------------------------------------------- files & config

def log(msg):
    print(time.strftime("[%H:%M:%S] ") + msg, flush=True)


def find_savedvariables():
    roots = [os.environ.get("ProgramFiles(x86)", r"C:\Program Files (x86)"), os.environ.get("ProgramFiles", r"C:\Program Files"),
             r"C:\Games", r"D:\Games", r"D:\\", r"E:\\"]
    found = []
    for root in roots:
        found += glob(os.path.join(root, "World of Warcraft", "_*_", "WTF", "Account", "*", "SavedVariables", "FunStats.lua"))
    found.sort(key=lambda p: os.path.getmtime(p), reverse=True)
    return found


def load_config():
    cfg = dict(DEFAULTS)
    if CONFIG_PATH.exists():
        cfg.update(json.loads(CONFIG_PATH.read_text(encoding="utf-8")))
    cfg.pop("secret_key", None)  # no longer used; uploads only need the public key
    for k in ("supabase_url", "publishable_key"):
        if not cfg.get(k) or "YOUR" in cfg[k]:
            sys.exit(f'config.json is missing "{k}".')
    paths = cfg.get("savedvariables") or []
    if isinstance(paths, str):
        paths = [paths]
    if not paths:
        # Every WoW install (Anniversary, Classic Era, WoW Forever...) has its own save file; publish them all.
        paths = find_savedvariables()
        if not paths:
            sys.exit('Couldn\'t find FunStats.lua. Put its full path in config.json under "savedvariables".')
        for found in paths:
            log(f"Using {found}")
    cfg["savedvariables"] = paths
    cfg.setdefault("ignore", [])
    return cfg


def read_rows(cfg):
    """One (upload code, rows) pair per save file."""
    uploads = []
    for path in cfg["savedvariables"]:
        text = Path(path).read_text(encoding="utf-8", errors="replace")
        db = parse_lua(text).get("FunStatsDB")
        if not isinstance(db, dict):
            raise LuaError(f"{path} has no FunStats data yet. Log in once with the addon, then /reload.")
        secret = db.get("secret")
        if not isinstance(secret, str) or len(secret) < 32:
            raise LuaError(f"{path} was saved by an older FunStats. Update the addon, log in once and /reload.")
        uploads.append((secret, build_rows(db, cfg["ignore"])))
    return uploads


def main():
    args = set(sys.argv[1:])
    cfg = load_config()
    dry = "--dry-run" in args

    def run_once():
        try:
            publish(cfg, read_rows(cfg), dry)
        except (LuaError, RuntimeError, OSError) as e:
            log(f"Not published: {e}")

    if "--watch" not in args:
        run_once()
        return
    log("Watching for WoW to save FunStats.lua (after /reload or logout). Close this window to stop.")
    last = {}
    last_ping = 0
    while True:
        try:
            stamps = {p: os.path.getmtime(p) for p in cfg["savedvariables"] if os.path.exists(p)}
        except OSError:
            stamps = {}
        if stamps != last:
            if last:
                time.sleep(3)  # let WoW finish writing
            last = stamps
            run_once()
        if not dry and time.time() - last_ping > KEEPALIVE_EVERY:
            last_ping = time.time()
            try:
                request(cfg, "GET", "/rest/v1/entries?select=id&limit=1")
            except RuntimeError as e:
                log(f"Keep-alive failed: {e}")
        time.sleep(WATCH_EVERY)


if __name__ == "__main__":
    main()
