"""The Windows app reading WoW Forever combat log files. The log lines follow the layout seen in a Forever 1.60.1 beta log.

Run from the Azeroth Ledger folder:  python -m unittest discover tests
Needs Windows and a built site/AzerothLedger.exe; skipped otherwise.
"""

import json
import os
import shutil
import subprocess
import tempfile
import time
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
EXE = ROOT / "site" / "AzerothLedger.exe"

ME = "Player-4700-00000A01"
ME2 = "Player-4700-00000A02"
OTHER = "Player-4700-00000B01"
WOLF = "Creature-0-4621-0-116-525-00003C82EE"
HEADER = "COMBAT_LOG_VERSION,22,ADVANCED_LOG_ENABLED,0,BUILD_VERSION,1.60.1,PROJECT_ID,18"
DAY = "2026-11-05"


def me(guid=ME, name="John Smith-PvE-"):
    return f'{guid},"{name}",0x511,0x80000000'


def other(guid=OTHER, name="Eve Lind-PvE-"):
    return f'{guid},"{name}",0x518,0x80000000'


def wolf():
    return f'{WOLF},"Mangy Wolf",0x10a48,0x80000000'


def nobody():
    return "0000000000000000,nil,0x80000000,0x80000000"


def block(guid=ME):
    return f"{guid},0000000000000000,497,497,345,0,492,0,0,0,0,621,621,0,-9253.20,446.55,1429,2.5477,10"


def line(body, second=0):
    return f"11/5/2026 20:00:{second:02d}.000+1  {body}"


SAVE = f"""
FunStatsDB = {{
	["id"] = "acct",
	["secret"] = "0123456789abcdef0123456789abcdef-test-only",
	["chars"] = {{
		["John Smith-PvE"] = {{
			["guid"] = "{ME}",
			["name"] = "John Smith",
			["realm"] = "PvE",
			["game"] = {{ ["version"] = "1.60.1", ["toc"] = 16001 }},
			["days"] = {{
				["{DAY}"] = {{ ["dmg"] = 5000, ["heal"] = 1, ["kb"] = 99, ["played"] = 600 }},
			}},
			["kills"] = {{ ["Mangy Wolf"] = 99, ["Old Boar"] = 3 }},
			["spellDmg"] = {{ ["Fireball"] = 9000 }},
			["best"] = {{}},
		}},
	}},
}}
"""

STANDARD = [
    line(HEADER),
    line(f"SWING_DAMAGE,{me()},{wolf()},{block()},67,70,-1,1,0,0,0,nil,nil,nil"),
    line(f"SWING_DAMAGE_LANDED,{me()},{wolf()},{block(WOLF)},67,70,-1,1,0,0,0,nil,nil,nil"),
    line(f'SPELL_DAMAGE,{me()},{wolf()},145,"Fireball",0x4,{block(WOLF)},115,180,20,4,0,0,0,1,nil,nil,ST', 1),
    line(f"SWING_MISSED,{me()},{wolf()},MISS,nil", 2),
    line(f"SWING_MISSED,{wolf()},{me()},DODGE,nil", 3),
    line(f'SPELL_MISSED,{wolf()},{me()},13322,"Frostbolt",0x10,RESIST,nil,ST', 3),
    line(f"SWING_DAMAGE,{wolf()},{me()},{block(WOLF)},30,30,-1,1,0,0,0,nil,nil,nil", 4),
    line(f'SPELL_HEAL,{me()},{me()},2061,"Flash Heal",0x2,{block()},100,100,25,0,nil', 5),
    line(f'SPELL_HEAL,{other()},{me()},139,"Renew",0x2,{block(OTHER)},40,40,0,0,nil', 5),
    line(f'SPELL_CAST_SUCCESS,{me()},{nobody()},8690,"Hearthstone",0x8,{block()}', 6),
    line(f"ENVIRONMENTAL_DAMAGE,{nobody()},{me()},{block()},Falling,19,19,0,1,0,0,0,nil,nil,nil", 7),
    line(f"PARTY_KILL,{me()},{wolf()},0", 8),
    # Everyone else nearby stays out of it.
    line(f"SWING_DAMAGE,{other()},{wolf()},{block(OTHER)},999,999,-1,1,0,0,0,nil,nil,nil", 9),
    line(f"PARTY_KILL,{other()},{wolf()},0", 9),
]


@unittest.skipUnless(os.name == "nt" and EXE.exists(), "needs Windows and a built app")
class CombatLog(unittest.TestCase):
    def setUp(self):
        self.dir = Path(tempfile.mkdtemp())
        self.logs = self.dir / "Logs"
        self.logs.mkdir()
        self.save = self.dir / "FunStats.lua"
        self.save.write_text(SAVE, encoding="utf-8")
        self.totals = self.dir / "totals.txt"
        self.addCleanup(shutil.rmtree, self.dir, True)

    def write(self, lines, name="WoWCombatLog-110526_200000.txt", mode="w"):
        with open(self.logs / name, mode, encoding="utf-8", newline="\r\n") as f:
            f.write("\n".join(lines) + "\n")

    def age(self, days, name="WoWCombatLog-110526_200000.txt"):
        then = time.time() - days * 86400
        os.utime(self.logs / name, (then, then))

    def run_app(self, *flags):
        out = subprocess.run([str(EXE), "--logs-dry-run", str(self.save), str(self.logs), str(self.totals), *flags],
                             capture_output=True, check=True, timeout=60).stdout.decode("utf-8")
        self.notes = [l for l in out.splitlines() if l.startswith("# ")]
        rows = [json.loads(l) for l in out.splitlines() if l.strip() and not l.startswith("# ")]
        return rows[0]["data"]

    def test_reads_own_stats_and_ignores_everyone_else(self):
        self.write(STANDARD)
        d = self.run_app()
        day = d["days"][DAY]
        self.assertEqual(day["hits"], 2)  # the LANDED copy and Eve's 999 don't count
        self.assertEqual(day["crits"], 1)
        self.assertEqual(day["overkill"], 20)
        self.assertEqual(day["maxHit"], 115)
        self.assertEqual(day["maxHitSpell"], "Fireball")
        self.assertEqual(day["maxHitTarget"], "Mangy Wolf")
        self.assertEqual((day["whiffs"], day["dodges"], day["resists"]), (1, 1, 1))
        self.assertEqual(day["taken"], 49)
        self.assertEqual(day["fallDmg"], 19)
        self.assertEqual(day["overheal"], 25)
        self.assertEqual(day["healedBy"], 40)
        self.assertEqual(d["healers"]["Eve Lind"], 40)
        self.assertEqual((day["casts"], day["hearth"]), (1, 1))
        self.assertEqual(d["casts"]["Hearthstone"], 1)
        self.assertEqual(d["best"]["hit"]["amt"], 115)
        self.assertEqual(d["best"]["hit"]["target"], "Mangy Wolf")
        self.assertIs(d["best"]["hit"]["crit"], True)
        self.assertEqual(d["best"]["heal"]["amt"], 75)
        self.assertEqual(d["best"]["hit"]["t"], 1793905201)

    def test_higher_number_wins_and_exact_kills_replace_the_estimate(self):
        self.write(STANDARD)
        d = self.run_app()
        day = d["days"][DAY]
        self.assertEqual(day["dmg"], 5000)  # the meter's total is higher than this short log
        self.assertEqual(day["heal"], 75)  # the log's is higher here
        self.assertEqual(day["played"], 600)
        self.assertEqual(day["kb"], 1)  # exact, not the estimated 99
        self.assertEqual(d["kills"]["Mangy Wolf"], 1)
        self.assertEqual(d["kills"]["Old Boar"], 3)  # from a day the log doesn't cover
        self.assertEqual(d["spellDmg"]["Fireball"], 9000)
        self.assertEqual(d["spellDmg"]["Melee"], 67)

    def test_reading_twice_counts_nothing_twice(self):
        self.write(STANDARD)
        first = self.run_app()
        second = self.run_app()
        self.assertEqual(first, second)

    def test_only_new_lines_are_added(self):
        self.write(STANDARD)
        self.run_app()
        self.write([line(f"SWING_DAMAGE,{me()},{wolf()},{block()},10,10,-1,1,0,0,0,nil,nil,nil", 30)], mode="a")
        self.assertEqual(self.run_app()["days"][DAY]["hits"], 3)

    def test_half_written_line_waits_for_the_rest(self):
        self.write(STANDARD)
        whole = line(f"SWING_DAMAGE,{me()},{wolf()},{block()},10,10,-1,1,0,0,0,nil,nil,nil", 30)
        with open(self.logs / "WoWCombatLog-110526_200000.txt", "a", encoding="utf-8", newline="") as f:
            f.write(whole[:40])
        self.assertEqual(self.run_app()["days"][DAY]["hits"], 2)
        with open(self.logs / "WoWCombatLog-110526_200000.txt", "a", encoding="utf-8", newline="") as f:
            f.write(whole[40:] + "\r\n")
        self.assertEqual(self.run_app()["days"][DAY]["hits"], 3)

    def test_lines_longer_than_a_read_chunk_keep_the_position_right(self):
        long_name = "X" * 70000  # bigger than the app's 64 KB read buffer
        self.write(STANDARD + [line(f'SPELL_AURA_APPLIED,{me()},{wolf()},1,"{long_name}",0x1,DEBUFF', 20),
                               line(f"SWING_DAMAGE,{me()},{wolf()},{block()},10,10,-1,1,0,0,0,nil,nil,nil", 21)])
        self.assertEqual(self.run_app()["days"][DAY]["hits"], 3)
        self.assertEqual(self.run_app()["days"][DAY]["hits"], 3)

    def test_two_characters_in_one_file_stay_apart(self):
        self.write(STANDARD + [line(HEADER, 40), line(f"SWING_DAMAGE,{me(ME2, 'Anna Berg-PvE-')},{wolf()},{block(ME2)},500,500,-1,1,0,0,0,nil,nil,nil", 41)])
        day = self.run_app()["days"][DAY]
        self.assertEqual(day["hits"], 2)
        self.assertEqual(day["maxHit"], 115)

    def test_unknown_log_version_is_skipped_and_noted(self):
        self.write(["11/5/2026 20:00:00.000+1  COMBAT_LOG_VERSION,23,ADVANCED_LOG_ENABLED,0,BUILD_VERSION,1.60.1,PROJECT_ID,18"] + STANDARD[1:])
        d = self.run_app()
        self.assertNotIn("hits", d["days"][DAY])
        self.assertTrue(any("unknown combat log format" in n for n in self.notes), self.notes)

    def test_classic_log_is_skipped(self):
        self.write(["11/5/2026 20:00:00.000+1  COMBAT_LOG_VERSION,9,ADVANCED_LOG_ENABLED,1,BUILD_VERSION,2.5.6,PROJECT_ID,5"] + STANDARD[1:])
        self.assertNotIn("hits", self.run_app()["days"][DAY])

    def test_changed_layout_is_refused_whole(self):
        # If Blizzard adds a field to the unit details, amounts would shift: nothing may reach the site.
        shifted = [line(HEADER)] + [line(f"SWING_DAMAGE,{me()},{wolf()},{block()},7,67,70,-1,1,0,0,0,nil,nil,nil", s) for s in range(20)]
        self.write(shifted)
        d = self.run_app()
        self.assertNotIn("hits", d["days"][DAY])
        self.assertTrue(any("didn't fit" in n for n in self.notes), self.notes)

    # ---- old logs

    def test_old_log_is_deleted_after_counting_and_its_stats_stay(self):
        self.write(STANDARD)
        self.age(15)
        d = self.run_app("--delete-old-logs")
        self.assertEqual(d["days"][DAY]["hits"], 2)
        self.assertEqual(list(self.logs.iterdir()), [])
        self.assertTrue(any("Deleted old combat log" in n for n in self.notes), self.notes)
        self.assertEqual(self.run_app()["days"][DAY]["hits"], 2)

    def test_restored_log_is_not_counted_twice(self):
        self.write(STANDARD)
        self.age(15)
        self.run_app("--delete-old-logs")
        self.write(STANDARD)
        self.assertEqual(self.run_app()["days"][DAY]["hits"], 2)

    def test_dry_run_only_says_what_it_would_delete(self):
        self.write(STANDARD)
        self.age(15)
        self.run_app()
        self.assertEqual(len(list(self.logs.iterdir())), 1)
        self.assertTrue(any("Would delete old combat log" in n for n in self.notes), self.notes)

    def test_recent_log_stays(self):
        self.write(STANDARD)
        self.age(13)
        self.run_app("--delete-old-logs")
        self.assertEqual(len(list(self.logs.iterdir())), 1)

    def test_logs_that_were_never_counted_stay(self):
        self.write(["11/5/2026 20:00:00.000+1  COMBAT_LOG_VERSION,23,ADVANCED_LOG_ENABLED,0,BUILD_VERSION,1.60.1,PROJECT_ID,18"] + STANDARD[1:], name="WoWCombatLog-1.txt")
        self.write([line(HEADER)] + [line(f"SWING_DAMAGE,{me()},{wolf()},{block()},7,67,70,-1,1,0,0,0,nil,nil,nil", s) for s in range(20)], name="WoWCombatLog-2.txt")
        self.age(30, "WoWCombatLog-1.txt")
        self.age(30, "WoWCombatLog-2.txt")
        self.run_app("--delete-old-logs")
        self.assertEqual(len(list(self.logs.iterdir())), 2)

    def test_players_with_logging_off_keep_their_logs(self):
        self.save.write_text(SAVE.replace('["id"] = "acct",', '["id"] = "acct",\n\t["logging"] = false,'), encoding="utf-8")
        self.write(STANDARD)
        self.age(30)
        self.run_app("--delete-old-logs")
        self.assertEqual(len(list(self.logs.iterdir())), 1)

    def test_other_files_in_the_folder_stay(self):
        self.write(STANDARD, name="WoWCombatLog.txt")
        (self.logs / "Client.log").write_text("x")
        self.age(30, "WoWCombatLog.txt")
        self.age(30, "Client.log")
        self.run_app("--delete-old-logs")
        self.assertEqual(len(list(self.logs.iterdir())), 2)

    def test_no_logs_and_no_guid_change_nothing(self):
        d = self.run_app()
        self.assertEqual(d["days"][DAY]["dmg"], 5000)
        self.assertNotIn("hits", d["days"][DAY])

    def test_classic_save_never_reads_logs(self):
        self.save.write_text(SAVE.replace('"1.60.1"', '"2.5.6"'), encoding="utf-8")
        self.write(STANDARD)
        self.assertNotIn("hits", self.run_app()["days"][DAY])
        self.assertFalse(self.totals.exists())


if __name__ == "__main__":
    unittest.main()
