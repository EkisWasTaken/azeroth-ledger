"""The three uploaders (sync/ledger_sync.py, the site's Add stats page in site/app.js and the Windows app)
must turn a FunStats.lua into the same rows, and none of them may send an upload code.

Run from the Azeroth Ledger folder:  python -m unittest discover tests
The site's check needs Node.js; the app's check needs Windows and a built site/AzerothLedger.exe.
Either is skipped when it can't run.
"""

import importlib.util
import json
import os
import shutil
import subprocess
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
FIXTURE = ROOT / "tests" / "fixtures" / "FunStats.lua"
SECRETS = ("0123456789abcdef0123456789abcdef-test-only", "never-upload-this")
EXPECTED = [("char", "Ekossan-Spineshatter"), ("char", "Guttob-Spineshatter"),
            ("obs", "Albrus-Spineshatter"), ("relay", "Rale-Spineshatter")]

# Runs the site's own parseLua and buildUploadRows (cut out of site/app.js) on the fixture.
NODE_SCRIPT = r"""
const fs = require("fs");
const app = fs.readFileSync(process.argv[1], "utf8");
const a = app.indexOf("  function parseLua(src) {"), b = app.indexOf("  async function uploadFile(");
if (a < 0 || b < a) throw new Error("parseLua/buildUploadRows not found in app.js");
const { parseLua, buildUploadRows } = new Function(app.slice(a, b) + "\nreturn { parseLua, buildUploadRows };")();
const db = parseLua(fs.readFileSync(process.argv[2], "utf8")).FunStatsDB;
process.stdout.write(JSON.stringify(buildUploadRows(db)));
"""


def load_sync():
    spec = importlib.util.spec_from_file_location("ledger_sync", ROOT / "sync" / "ledger_sync.py")
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


def python_rows():
    sync = load_sync()
    db = sync.parse_lua(FIXTURE.read_text(encoding="utf-8"))["FunStatsDB"]
    return sync.build_rows(db, [])


def by_key(rows):
    return {(r["kind"], r["char_key"]): r["data"] for r in rows}


class Uploaders(unittest.TestCase):
    def check(self, rows):
        self.assertEqual(sorted(by_key(rows)), EXPECTED)
        text = json.dumps(rows, ensure_ascii=False)
        for s in SECRETS:
            self.assertNotIn(s, text)
        for data in by_key(rows).values():
            for private in ("secret", "settings", "killNames"):
                self.assertNotIn(private, data)

    def test_python(self):
        rows = python_rows()
        self.check(rows)
        data = by_key(rows)
        self.assertEqual(data[("char", "Ekossan-Spineshatter")]["owner"], "acct-7f3a")
        self.assertEqual(data[("char", "Guttob-Spineshatter")]["name"], "Guttob")
        self.assertEqual(data[("relay", "Rale-Spineshatter")]["owner"], "acct-other")
        self.assertEqual(data[("obs", "Albrus-Spineshatter")]["deaths"][0]["by"], 'Murloc "Tidehunter"')

    @unittest.skipUnless(shutil.which("node"), "Node.js not installed")
    def test_site_matches_python(self):
        out = subprocess.run(["node", "-e", NODE_SCRIPT, str(ROOT / "site" / "app.js"), str(FIXTURE)],
                             capture_output=True, text=True, encoding="utf-8", check=True).stdout
        rows = json.loads(out)
        self.check(rows)
        self.assertEqual(by_key(rows), by_key(python_rows()))

    @unittest.skipUnless(os.name == "nt" and (ROOT / "site" / "AzerothLedger.exe").exists(), "needs Windows and a built app")
    def test_app_matches_python(self):
        out = subprocess.run([str(ROOT / "site" / "AzerothLedger.exe"), "--dry-run", str(FIXTURE)],
                             capture_output=True, check=True, timeout=60).stdout.decode("utf-8")
        rows = [json.loads(line) for line in out.splitlines() if line.strip()]
        self.check(rows)
        self.assertEqual(by_key(rows), by_key(python_rows()))


if __name__ == "__main__":
    unittest.main()
