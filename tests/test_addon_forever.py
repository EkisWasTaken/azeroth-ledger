"""FunStats must keep loading on WoW Forever (toc 16001), whose client removed these Classic globals.

Run from the Azeroth Ledger folder:  python -m unittest discover tests
No Lua interpreter here, so this reads the source: every removed global may appear only in its alias at the top.
"""

import re
import unittest
from pathlib import Path

ADDON = Path(__file__).resolve().parent.parent / "FunStats"
ALIASED = ("GetItemInfo", "GetSpecialization", "GetSpecializationInfo", "GetNumSkillLines", "GetSkillLineInfo")
NEVER_CALLED = ("SendChatMessage", "CombatLogGetCurrentEventInfo")


class Forever(unittest.TestCase):
    def setUp(self):
        self.lua = re.sub(r"--.*", "", (ADDON / "FunStats.lua").read_text(encoding="utf-8"))

    def test_toc_lists_forever(self):
        toc = (ADDON / "FunStats.toc").read_text(encoding="utf-8")
        self.assertIn("16001", re.search(r"## Interface:(.*)", toc).group(1))

    def test_removed_globals_are_aliased_before_use(self):
        for name in ALIASED:
            alias = re.search(rf"^local {name} = {name} or ", self.lua, re.M)
            self.assertTrue(alias, name)
            self.assertLess(alias.start(), self.lua.index(f"{name}(") if f"{name}(" in self.lua else len(self.lua))

    def test_removed_globals_are_never_called_directly(self):
        for name in NEVER_CALLED:
            self.assertNotRegex(self.lua, rf"(?<![\w.]){name}\s*\(", name)

    def test_combat_log_only_registered_when_readable(self):
        self.assertIn("if CombatLogInfo then handlers.COMBAT_LOG_EVENT_UNFILTERED", self.lua)

    def test_damage_meter_only_where_the_combat_log_is_closed(self):
        self.assertIn("local DM = not CombatLogInfo and C_DamageMeter", self.lua)
        self.assertRegex(self.lua, r"if not DM or not C or UnitAffectingCombat")
        self.assertRegex(self.lua, r"if DM then\s+function handlers\.PLAYER_REGEN_ENABLED")

    def test_local_functions_are_defined_before_use(self):
        # Lua would quietly look up a global instead, and it would only blow up in game.
        for name in re.findall(r"^local function (\w+)", self.lua, re.M):
            first = re.search(rf"(?<![\w.:\"]){name}\b", self.lua)
            self.assertEqual(self.lua[first.start() - 15:first.start()], "local function ", name)

    def test_chunk_stays_under_luas_local_limit(self):
        # Lua refuses to load a file with more than 200 locals at the top level.
        count = 0
        for line in self.lua.splitlines():
            m = re.match(r"local (function )?([\w, ]+)", line)
            if m:
                count += 1 if m.group(1) else m.group(2).count(",") + 1
        self.assertLess(count, 200)

    def test_every_block_closes(self):
        # A syntax error would stop the addon on every client, and the app ships it to everyone.
        for name in ("FunStats.lua", "Sync.lua"):
            src = (ADDON / name).read_text(encoding="utf-8")
            src = re.sub(r"\"(?:\\.|[^\"\\\n])*\"|'(?:\\.|[^'\\\n])*'", '""', src)
            src = re.sub(r"--.*", "", src)
            words = re.findall(r"\b\w+\b", src)
            # "while/for ... do" open one block through their "do"; "repeat" closes with "until".
            opens = sum(words.count(w) for w in ("function", "do", "then")) - words.count("elseif")
            self.assertEqual(opens, words.count("end"), name)


if __name__ == "__main__":
    unittest.main()
