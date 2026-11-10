"""Runs the real FunStats.lua and Sync.lua in Lua 5.1 against a stand-in for the WoW API, as Forever and as Classic.

Run from the Azeroth Ledger folder:  python -m unittest discover tests
Needs the dev-only package lupa (pip install lupa); skipped without it. WoW itself can't run here, so this
proves the addon's own logic and that it calls nothing the stand-in leaves out, not how the live client behaves.
"""

import unittest
from pathlib import Path

try:
    from lupa.lua51 import LuaRuntime
except ImportError:
    LuaRuntime = None

ADDON = Path(__file__).resolve().parent.parent / "FunStats"

# Anything the addon calls that isn't defined here fails the test, so Forever's removed globals stay removed.
STUBS = r"""
secretMark = {}
function issecretvalue(v) return v == secretMark end
function hasanysecretvalues(...)
  for i = 1, select("#", ...) do if select(i, ...) == secretMark then return true end end
  return false
end
SECRET_API = true

now, timers, frames, sent = 1000, {}, {}, {}
function GetTime() return now end
time = time or os.time
date = date or os.date
function wipe(t) for k in pairs(t) do t[k] = nil end return t end
function tContains(t, v) for _, x in ipairs(t) do if x == v then return true end end return false end
function strtrim(s) return (s:gsub("^%s+", ""):gsub("%s+$", "")) end
function strsplit(sep, s)
  local a, b = s:match("^([^" .. sep .. "]*)" .. sep .. "(.*)$")
  if a then return a, b end
  return s
end
bit = { band = function(a, b) local r, m = 0, 1
  while a > 0 and b > 0 do if a % 2 == 1 and b % 2 == 1 then r = r + m end
    a, b, m = math.floor(a / 2), math.floor(b / 2), m * 2 end
  return r end }
function hooksecurefunc() end
function JumpOrAscendStart() end
SlashCmdList = {}
DEFAULT_CHAT_FRAME = { AddMessage = function(_, m) printed = (printed or "") .. m .. "\n" end }
Enum = { UIMapType = { Continent = 2 } }
LOOT_ITEM_SELF = "You receive loot: %s."
LOOT_ITEM_SELF_MULTIPLE = "You receive loot: %sx%d."
LOOT_ITEM_PUSHED_SELF = "You receive item: %s."
LOOT_ITEM_PUSHED_SELF_MULTIPLE = "You receive item: %sx%d."
RANDOM_ROLL_RESULT = "%s rolls %d (%d-%d)"
DUEL_WINNER_KNOCKOUT = "%1$s has defeated %2$s in a duel"
DUEL_WINNER_RETREAT = "%2$s has fled from %1$s in a duel"
INSTANCE_RESET_SUCCESS = "%s has been reset."
UNKNOWNOBJECT = "Unknown"
COMBATLOG_XPGAIN_FIRSTPERSON = "%s dies, you gain %d experience."
WOW_PROJECT_ID = 18

local Frame = {}
Frame.__index = Frame
function Frame:SetScript(n, f) self[n] = f end
function Frame:RegisterEvent(e) self.events[e] = true end
function Frame:RegisterUnitEvent(e) self.events[e] = true end
function CreateFrame() local f = setmetatable({ events = {} }, Frame); frames[#frames + 1] = f; return f end
function fire(event, ...)
  for _, f in ipairs(frames) do
    if f.events[event] then f.OnEvent(f, event, ...) end
  end
end
C_Timer = {
  After = function(d, fn) timers[#timers + 1] = { at = now + d, fn = fn } end,
  NewTicker = function() end,
}
function runTimers()
  now = now + 60
  local due = timers
  timers = {}
  for _, t in ipairs(due) do t.fn() end
end
C_ChatInfo = {
  RegisterAddonMessagePrefix = function() end,
  SendAddonMessage = function(...) sent[#sent + 1] = { ... }; return 0 end,
}
C_Map = {
  GetBestMapForUnit = function() return nil end, GetMapInfo = function() return nil end,
  GetMapChildrenInfo = function() return {} end, GetMapRectOnMap = function() return 0, 1, 0, 1 end,
  GetPlayerMapPosition = function() return nil end,
}
C_FriendList = { IsFriend = function() return false end }
C_GuildInfo = { GuildRoster = function() end }
C_GameRules = { IsHardcoreActive = function() return false end }
function Ambiguate(n) return (n:gsub("%-.*", "")) end
function GetGuildInfo() return inGuild and "Guild" or nil end
function IsInGuild() return inGuild end
function GetNumGuildMembers() return #roster end
function GetGuildRosterInfo(i) local r = roster[i]; return r[1], "", 0, r[2], "", "", "", "", true, 0, r[3] end
function GetGuildRosterLastOnline() return 0, 0, 0, 0 end
function GetInstanceInfo() return "Deadmines", "party", 1, "Normal" end
function GetInventoryItemLink(_, slot) return slot == 1 and helmLink or nil end
function GetMoney() return 500 end
function GetNumGroupMembers() return 0 end
function GetNumSubgroupMembers() return 0 end
function GetPlayerInfoByGUID(guid)
  local p = players[guid]
  if p then return "Warrior", "WARRIOR", "Human", "Human", 2, p[1], p[2] end
end
function GetRealZoneText() return "Elwynn" end
function GetSubZoneText() return "" end
function GetRealmName() return "PvE" end
function GetNormalizedRealmName() return "PvE" end
function GetRepairAllCost() return 0 end
function IsFalling() return false end
function IsInGroup() return false end
function IsInRaid() return false end
function IsInInstance() return inInstance, inInstance and "party" or "none" end
function IsSwimming() return false end
function UnitAffectingCombat() return inCombat end
function UnitClass() return "Warrior", "WARRIOR" end
function UnitFactionGroup() return "Alliance" end
function UnitGUID(u) return u == "player" and "Player-1-AAA" or nil end
function UnitIsAFK() return false end
function UnitIsConnected() return true end
function UnitIsDeadOrGhost() return false end
function UnitIsFeignDeath() return false end
function UnitIsInMyGuild() return false end
function UnitIsPlayer() return true end
function UnitIsUnit(a, b) return a == b end
function UnitLevel() return 10 end
function UnitName(u) return myFirst, mySecond end
function UnitOnTaxi() return false end
function UnitPosition() return nil end
function UnitRace() return "Human", "Human" end
function UnitXP() return 0 end
function UnitXPMax() return 100 end
function GetProfessions() return nil end
function GetProfessionInfo() end
"""

FOREVER = r"""
function GetBuildInfo() return "1.60.1", "70755", "Oct 1 2026", 16001 end
function RegionalUniqueNamesEnabled() return true end
myFirst, mySecond = "John", "Smith"
C_Item = { GetItemInfo = function(l) return "Helm", l, 3, 20, 1, "", "", 1, "", 1, 1, 1, 1, 2 end }
C_ChatInfo.SendChatMessage = function(...) announced = { ... } end
C_SpecializationInfo = { GetSpecialization = function() return 1 end,
  GetSpecializationInfo = function() return 71, "Arms" end }
C_SkillInfo = { GetNumSkillLines = function() return 2 end, GetSkillLineInfo = function(i)
  return ({ { name = "Professions", isHeader = true, rank = 0, maxRank = 0 },
            { name = "Mining", isHeader = false, rank = 40, maxRank = 75 } })[i] end }
C_Spell = { GetSpellName = function(id) return "Spell" .. id end }
meterOn = true
sessions = {}
C_DamageMeter = {
  IsDamageMeterAvailable = function() return meterOn, "" end,
  GetAvailableCombatSessions = function()
    local out = {}
    for id in pairs(sessions) do out[#out + 1] = { sessionID = id } end
    return out
  end,
  GetCombatSessionFromID = function(id, kind)
    local s = sessions[id]
    return { combatSources = s and s[kind] or {} }
  end,
  GetCombatSessionSourceFromID = function(id) local s = sessions[id]; return { combatSpells = s and s.spells or {} } end,
}
C_DeathRecap = { GetRecapEvents = function() return recap or {} end }
loggingCalls = 0
function LoggingCombat(state)
  loggingCalls = loggingCalls + 1
  if loggingLimited then return nil end
  loggingState = state
  return state
end
function GetNumLootItems() return #lootSlots end
function GetLootSlotLink(i) return lootSlots[i] end
"""

CLASSIC = r"""
function GetBuildInfo() return "2.5.6", "1", "Oct 1 2026", 20506 end
myFirst, mySecond = "Oldname", nil
function GetItemInfo(l) return "Helm", l, 3, 20, 1, "", "", 1, "", 1, 1, 1, 1, 2 end
function SendChatMessage(...) announced = { ... } end
function GetNumTalentTabs() return 0 end
function GetTalentTabInfo() end
function GetNumSkillLines() return 0 end
function GetSkillLineInfo() end
combatInfo = {}
function CombatLogGetCurrentEventInfo() return unpack(combatInfo) end
"""

HELM = "|cnIQ3:|Hitem:123::::::::|h[Helm]|h|r"


@unittest.skipUnless(LuaRuntime, "lupa not installed")
class Addon(unittest.TestCase):
    def start(self, game):
        self.lua = LuaRuntime(unpack_returned_tuples=True)
        self.lua.execute(STUBS)
        self.lua.execute(game)
        self.lua.execute(f"helmLink = {HELM!r}; players = {{}}; roster = {{}}; lootSlots = {{}}; inGuild = false; "
                         "inInstance = false; inCombat = false")
        self.lua.globals().ADDON_TABLE = self.lua.table()
        for name in ("FunStats.lua", "Sync.lua"):
            source = (ADDON / name).read_text(encoding="utf-8")
            self.load(source, name)
        self.fire("PLAYER_LOGIN")
        self.lua.execute("runTimers()")

    def load(self, source, name):
        g = self.lua.globals()
        g.SOURCE, g.SOURCE_NAME = source, name
        self.lua.execute('assert(loadstring(SOURCE, SOURCE_NAME))("FunStats", ADDON_TABLE)')

    def fire(self, event, *args):
        self.lua.globals().fire(event, *args)

    def test_forever_server_name_becomes_the_realm_and_old_saves_move(self):
        # Seen on the live client: GetRealmName is the server, the combat log says "Legolars-Grönblad-PvP-EU".
        realm = 'function GetRealmName() return "CAMWOW EU4 Realm 8 PvP" end; '
        save = ('FunStatsDB = { chars = { ["John Smith-CAMWOW EU4 Realm 8 PvP"] = '
                '{ realm = "CAMWOW EU4 Realm 8 PvP", lastSeen = 5, days = { ["2026-11-05"] = { dmg = 77 } } } } }; ')
        self.start(FOREVER + "\n" + realm + save)
        key, c = self.char()
        self.assertEqual(key, "John Smith-PvP-EU")
        self.assertEqual(c.realm, "PvP-EU")
        self.assertEqual(self.today("dmg"), 77)
        self.assertEqual(self.run_lua('select("#", ADDON_TABLE.SplitName("Eve-Lind-PvP-EU"))'), 2)
        self.assertEqual(self.run_lua('(ADDON_TABLE.SplitName("Eve-Lind-PvP-EU"))'), "Eve Lind")

    def test_a_failing_event_is_noted_and_recording_goes_on(self):
        self.start(FOREVER)
        self.lua.execute('fire("CHAT_MSG_SYSTEM", {})')  # the handler can't read this message
        self.assertIsNotNone(self.run_lua("FunStatsDB.errors.CHAT_MSG_SYSTEM"))
        self.fire("CHAT_MSG_SYSTEM", "John Smith rolls 50 (1-100)")  # the next one still counts
        self.assertEqual(self.today("rolls"), 1)

    def run_lua(self, code):
        return self.lua.eval(code)

    def char(self):
        return self.run_lua("(function() for k, c in pairs(FunStatsDB.chars) do return k, c end end)()")

    def today(self, field):
        return self.run_lua(f"(function() local _, c = next(FunStatsDB.chars); local n = 0 "
                            f"for _, d in pairs(c.days) do n = n + (d.{field} or 0) end return n end)()")

    def session(self, sid, damage=0, healing=0, taken=0, spells=""):
        me = "{{ isLocalPlayer = true, totalAmount = %d, sourceGUID = 'Player-1-AAA' }}"
        self.lua.execute(f"sessions[{sid}] = {{ [0] = {me % damage}, [2] = {me % healing}, [7] = {me % taken}, spells = {{ {spells} }} }}")

    # ---- Forever: names

    def test_forever_key_keeps_the_surname(self):
        self.start(FOREVER)
        key, c = self.char()
        self.assertEqual(key, "John Smith-PvE")
        self.assertEqual(c.name, "John Smith")
        self.assertEqual(c.realm, "PvE")

    def test_forever_chat_counts_only_my_guid(self):
        self.start(FOREVER)
        none = [None] * 8  # the GUID is the event's 12th argument
        self.fire("CHAT_MSG_SAY", "sorry", "John-Brown", None, *none, "Player-1-BBB")
        self.assertEqual(self.today("msgs"), 0)
        self.fire("CHAT_MSG_SAY", "sorry", "John-Smith", None, *none, "Player-1-AAA")
        self.assertEqual(self.today("msgs"), 1)
        self.assertEqual(self.today("sorry"), 1)

    def test_forever_roster_names_never_become_realms(self):
        self.start(FOREVER)
        self.lua.execute('inGuild = true; roster = { { "Anna-Berg", 5, "MAGE" }, { "Bo Ek-PvE", 7, "ROGUE" }, { "Cid Lund", 9, "DRUID" } }')
        self.fire("GUILD_ROSTER_UPDATE")
        for key, name in (("Anna Berg-PvE", "Anna Berg"), ("Bo Ek-PvE", "Bo Ek"), ("Cid Lund-PvE", "Cid Lund")):
            self.assertEqual(self.run_lua(f'FunStatsDB.observed["{key}"].name'), name)
            self.assertEqual(self.run_lua(f'FunStatsDB.observed["{key}"].realm'), "PvE")

    def test_forever_sync_tells_me_from_a_namesake(self):
        self.start(FOREVER)
        split = self.lua.globals().ADDON_TABLE.SplitName
        self.assertEqual(split("John-Smith")[0], "John Smith")
        self.assertNotEqual(split("John-Brown")[0], "John Smith")

    def test_forever_my_rolls_and_duels_count_but_namesakes_dont(self):
        self.start(FOREVER)
        self.fire("CHAT_MSG_SYSTEM", "John Brown rolls 50 (1-100)")
        self.assertEqual(self.today("rolls"), 0)
        self.fire("CHAT_MSG_SYSTEM", "John-Smith rolls 50 (1-100)")
        self.assertEqual(self.today("rolls"), 1)
        self.fire("CHAT_MSG_SYSTEM", "John Smith has defeated Eve Lind in a duel")
        self.assertEqual(self.today("duelsWon"), 1)

    # ---- Forever: gear, spec, professions

    def test_forever_sheet_is_recorded(self):
        self.start(FOREVER)
        _, c = self.char()
        self.assertEqual(c.gear.s1.q, 3)
        self.assertEqual(c.spec, "Arms")
        self.assertEqual(c.professions[1].n, "Mining")

    TRAITS = r"""
    C_SpecializationInfo.GetActiveSpecGroup = function() return 1 end
    C_SpecializationInfo.GetCombatConfigIDForSpecGroup = function(g) return g == 1 and 77 or nil end
    traitRanks = { [105958] = 3, [105957] = 2, [105956] = 0 }
    C_Traits = {
      GetConfigInfo = function(id) return id == 77 and { treeIDs = { 1117 } } or nil end,
      GetTreeNodes = function(tree) return tree == 1117 and { 105958, 105957, 105956 } or {} end,
      GetNodeInfo = function(_, node) return { ranksPurchased = traitRanks[node] } end,
    }
    """

    def test_forever_talents_come_from_the_trait_tree(self):
        self.start(FOREVER + self.TRAITS)
        _, c = self.char()
        self.assertEqual(c.traits.tree, 1117)
        self.assertEqual(c.traits.r, "105958:3 105957:2")
        self.assertIsNone(c.spec)  # Forever has trees, not a specialization
        self.lua.execute("traitRanks[105956] = 1")
        self.fire("TRAIT_CONFIG_UPDATED", 77)
        self.lua.execute("runTimers()")
        self.assertEqual(self.char()[1].traits.r, "105958:3 105957:2 105956:1")

    def test_secret_talents_keep_the_last_snapshot(self):
        self.start(FOREVER + self.TRAITS)
        self.lua.execute("traitRanks[105958] = secretMark")
        self.fire("TRAIT_CONFIG_UPDATED", 77)
        self.lua.execute("runTimers()")
        self.assertEqual(self.char()[1].traits.r, "105958:3 105957:2")

    # ---- Forever: damage meter

    def test_meter_counts_each_session_once(self):
        self.start(FOREVER)
        self.session(1, damage=100, healing=20, taken=30, spells="{ spellID = 6603, totalAmount = 60 }, { spellID = 9, totalAmount = 40 }")
        self.fire("PLAYER_REGEN_ENABLED")
        self.lua.execute("runTimers()")
        self.assertEqual((self.today("dmg"), self.today("heal"), self.today("taken")), (100, 20, 30))
        _, c = self.char()
        self.assertEqual((c.spellDmg["Melee"], c.spellDmg["Spell9"]), (60, 40))
        # Read again, then more damage lands in the same session, then a new one.
        self.fire("PLAYER_REGEN_ENABLED")
        self.lua.execute("runTimers()")
        self.assertEqual(self.today("dmg"), 100)
        self.session(1, damage=150, spells="{ spellID = 6603, totalAmount = 110 }")
        self.session(2, damage=5)
        self.fire("PLAYER_LOGOUT")
        self.assertEqual(self.today("dmg"), 155)
        self.assertEqual(c.spellDmg["Melee"], 110)

    def test_meter_ignores_sessions_kept_over_a_reload(self):
        self.start(FOREVER)
        self.session(1, damage=100)
        self.lua.execute("meterOn = true")
        # A second addon load over the same client, as after /reload: the old session is already there.
        self.lua.execute("frames = {}")
        self.load((ADDON / "FunStats.lua").read_text(encoding="utf-8"), "FunStats.lua")
        self.fire("PLAYER_LOGIN")
        self.lua.execute("runTimers()")
        self.assertEqual(self.today("dmg"), 0)

    def test_meter_reads_nothing_in_combat_or_secret(self):
        self.start(FOREVER)
        self.lua.execute("inCombat = true")
        self.session(1, damage=100)
        self.lua.execute("runTimers()")
        self.fire("PLAYER_REGEN_ENABLED")
        self.lua.execute("runTimers()")
        self.assertEqual(self.today("dmg"), 0)
        # Out of combat but still secret: nothing counted, no error, counted once it reads as a number.
        self.lua.execute("inCombat = false; sessions[1][0][1].totalAmount = secretMark")
        self.fire("PLAYER_REGEN_ENABLED")
        self.lua.execute("runTimers()")
        self.assertEqual(self.today("dmg"), 0)
        self.lua.execute("sessions[1][0][1].totalAmount = 100")
        self.fire("PLAYER_REGEN_ENABLED")
        self.lua.execute("runTimers()")
        self.assertEqual(self.today("dmg"), 100)
        self.assertIsNone(self.run_lua("FunStatsDB.meterError"))

    def test_reset_doesnt_lose_new_sessions(self):
        self.start(FOREVER)
        self.session(1, damage=100)
        self.fire("PLAYER_LOGOUT")
        self.lua.execute("sessions = {}")
        self.fire("DAMAGE_METER_RESET")
        self.session(1, damage=40)
        self.fire("PLAYER_LOGOUT")
        self.assertEqual(self.today("dmg"), 140)

    def test_boss_fight_gets_its_meter_after_combat(self):
        self.start(FOREVER)
        self.lua.execute("""inInstance = true; inCombat = true
          players["Player-1-AAA"] = { "John", "Smith" }; players["Player-1-CCC"] = { "Eve", "Lind" }""")
        self.fire("PLAYER_ENTERING_WORLD")
        self.fire("ENCOUNTER_START", 7, "Boss", 1, 5)
        self.lua.execute("now = now + 20")
        self.lua.execute("""sessions[3] = {
          [0] = { { isLocalPlayer = true, totalAmount = 200, sourceGUID = "Player-1-AAA" },
                  { totalAmount = 300, sourceGUID = "Player-1-CCC" }, { totalAmount = 9, sourceGUID = "Creature-1" } },
          [2] = { { totalAmount = 50, sourceGUID = "Player-1-CCC" } }, [7] = {} }""")
        self.fire("ENCOUNTER_END", 7, "Boss", 1, 5, 1)
        self.lua.execute("inCombat = false")
        self.fire("PLAYER_REGEN_ENABLED")
        self.lua.execute("runTimers()")
        fights = self.run_lua("(function() local _, c = next(FunStatsDB.chars); return c.fights[1] end)()")
        self.assertEqual(fights.dmg, 200)
        self.assertEqual(fights.who[1].n, "Eve Lind")
        self.assertEqual(fights.who[1].d, 300)
        self.assertEqual(fights.who[2].n, "John Smith")
        self.assertEqual(len(list(fights.who.keys())), 2)
        self.assertEqual(self.run_lua('(function() local _, c = next(FunStatsDB.chars); return c.bosses["7:1"].dps end)()'), 10)
        self.assertEqual(self.today("bossKills"), 1)

    # ---- Forever: casts and kills

    def test_casts_and_hearthstones_count(self):
        self.start(FOREVER)
        self.fire("UNIT_SPELLCAST_SUCCEEDED", "player", "cast-1", 133)
        self.fire("UNIT_SPELLCAST_SUCCEEDED", "player", "cast-2", 133)
        self.fire("UNIT_SPELLCAST_SUCCEEDED", "player", "cast-3", 8690)
        self.fire("UNIT_SPELLCAST_SUCCEEDED", "party1", "cast-4", 133)
        self.lua.execute('fire("UNIT_SPELLCAST_SUCCEEDED", "player", "cast-5", secretMark)')
        self.assertEqual(self.today("casts"), 3)
        self.assertEqual(self.today("hearth"), 1)
        self.assertEqual(self.char()[1].casts["Spell133"], 2)

    def test_xp_lines_count_kills_by_name(self):
        self.start(FOREVER)
        self.fire("CHAT_MSG_COMBAT_XP_GAIN", "Mangy Wolf dies, you gain 12 experience.")
        self.fire("CHAT_MSG_COMBAT_XP_GAIN", "Mangy Wolf dies, you gain 14 experience. (+7 exp Rested bonus)")
        self.fire("CHAT_MSG_COMBAT_XP_GAIN", "You gain 300 experience.")
        self.lua.execute('fire("CHAT_MSG_COMBAT_XP_GAIN", secretMark)')
        self.assertEqual(self.today("kb"), 2)
        self.assertEqual(self.char()[1].kills["Mangy Wolf"], 2)

    # ---- Forever: combat logging for the app

    def test_logging_only_with_the_app_and_not_after_opting_out(self):
        self.lua = LuaRuntime(unpack_returned_tuples=True)
        self.start(FOREVER)  # no App.lua: the zip download
        self.assertEqual(self.run_lua("loggingCalls"), 0)
        self.lua.globals().ADDON_TABLE.hasApp = True
        self.fire("PLAYER_LOGIN")
        self.lua.execute("runTimers()")
        self.assertEqual(self.run_lua("loggingCalls"), 1)
        self.assertEqual(self.char()[1].guid, "Player-1-AAA")
        self.lua.execute('SlashCmdList.FUNSTATS("logging off")')
        self.assertIs(self.run_lua("loggingState"), False)
        calls = self.run_lua("loggingCalls")
        self.fire("PLAYER_LOGIN")
        self.lua.execute("runTimers()")
        self.assertEqual(self.run_lua("loggingCalls"), calls)

    def test_logging_retries_once_when_rate_limited(self):
        self.start(FOREVER)
        self.lua.globals().ADDON_TABLE.hasApp = True
        self.lua.execute("loggingLimited = true")
        self.fire("PLAYER_LOGIN")
        self.lua.execute("runTimers(); runTimers(); runTimers()")
        self.assertEqual(self.run_lua("loggingCalls"), 2)

    # ---- Forever: deaths

    def death(self):
        self.fire("PLAYER_DEAD")
        self.lua.execute("runTimers()")
        return self.run_lua("(function() local _, c = next(FunStatsDB.chars); return c.deaths[#c.deaths] end)()")

    def test_death_cause_from_recap(self):
        self.start(FOREVER)
        self.lua.execute("""recap = { { timestamp = 1, event = "SPELL_DAMAGE", sourceName = "Old", spellName = "Bolt", amount = 1 },
          { timestamp = 2, event = "SWING_DAMAGE", sourceName = "Wolf", amount = 30, sourceGUID = "Creature-1", causedDeath = true } }""")
        d = self.death()
        self.assertEqual((d.cause, d.by, d.spell, d.amt), ("mob", "Wolf", "Melee", 30))
        d.t = d.t - 60  # a later death, not the same one again
        self.lua.execute("""recap = { { timestamp = 1, event = "ENVIRONMENTAL_DAMAGE", environmentalType = "Falling", amount = 90 } }""")
        d = self.death()
        self.assertEqual(d.cause, "fall")
        self.assertEqual(self.today("deaths_fall"), 1)

    def test_player_dead_twice_is_one_death(self):
        self.start(FOREVER)
        self.death()
        self.death()
        self.assertEqual(self.run_lua("(function() local _, c = next(FunStatsDB.chars); return #c.deaths end)()"), 1)
        self.assertEqual(self.today("deaths"), 1)

    def test_secret_recap_leaves_the_death_recorded(self):
        self.start(FOREVER)
        self.lua.execute('recap = { { timestamp = 1, event = "SWING_DAMAGE", sourceName = secretMark, amount = 3 } }')
        d = self.death()
        self.assertEqual(d.cause, "unknown")
        self.assertEqual(self.today("deaths"), 1)

    # ---- Forever: loot

    def test_loot_chat_outside_instances_reads_modern_links(self):
        self.start(FOREVER)
        self.fire("CHAT_MSG_LOOT", f"You receive loot: {HELM}.")
        self.assertEqual(self.today("q3"), 1)
        c = self.char()[1]
        self.assertEqual(c.notable[1].item, "Helm")
        self.assertEqual(c.notable[1].id, 123)

    def test_quest_rewards_are_not_world_drops(self):
        self.start(FOREVER)
        self.fire("CHAT_MSG_LOOT", f"You receive item: {HELM}.")
        self.fire("CHAT_MSG_LOOT", f"You receive loot: {HELM}.")
        reward, drop = self.char()[1].notable[1], self.char()[1].notable[2]
        self.assertTrue(reward.quest)
        self.assertIsNone(reward.world)
        self.assertIsNone(drop.quest)
        self.assertTrue(drop.world)

    def test_loot_inside_instances_comes_from_the_loot_window_once(self):
        self.start(FOREVER)
        self.lua.execute(f"inInstance = true; lootSlots = {{ {HELM!r} }}")
        self.fire("LOOT_READY")
        self.fire("CHAT_MSG_LOOT", f"You receive loot: {HELM}.")  # readable after all: still one item
        self.fire("LOOT_SLOT_CLEARED", 1)
        self.fire("LOOT_SLOT_CLEARED", 1)
        self.assertEqual(self.today("q3"), 1)

    def test_secret_chat_is_skipped(self):
        self.start(FOREVER)
        self.lua.execute('fire("CHAT_MSG_LOOT", secretMark)')
        self.lua.execute('fire("CHAT_MSG_SAY", secretMark, secretMark)')
        self.lua.execute('fire("CHAT_MSG_SYSTEM", secretMark)')
        self.lua.execute('fire("CHAT_MSG_ADDON", "FunStats", secretMark, "PARTY", secretMark)')
        self.assertEqual(self.today("msgs"), 0)

    def test_announce_goes_through_the_new_chat_call(self):
        self.start(FOREVER)
        self.lua.execute("IsInGroup = function() return true end")
        self.run_lua("(function() local _, c = next(FunStatsDB.chars); c.settings.announce = true end)()")
        self.death()
        self.assertIn("John Smith", self.run_lua("announced[1]"))

    def test_forever_never_listens_for_the_combat_log(self):
        self.start(FOREVER)
        self.assertFalse(self.run_lua("frames[1].events.COMBAT_LOG_EVENT_UNFILTERED") or False)

    def test_honor_stats_are_recorded_and_secret_ones_skipped(self):
        honor = ('function GetPVPLifetimeStats() return 120, 3, 8 end; function GetPVPThisWeekStats() return 14, 900 end; '
                 'function UnitPVPRank() return 7 end; function GetPVPRankInfo(r) return ({ [7] = "Corporal", [8] = "Sergeant" })[r], r - 4 end')
        self.start(CLASSIC + "\n" + honor)
        p = self.char()[1].pvp
        self.assertEqual((p.hk, p.dk, p.weekHK, p.weekHonor), (120, 3, 14, 900))
        self.assertEqual((p.rankName, p.bestName), ("Corporal", "Sergeant"))
        self.assertEqual(self.today("honorKills"), 0)  # the first count is only where counting starts
        self.lua.execute("function GetPVPLifetimeStats() return 123, 3, 8 end")
        self.fire("PLAYER_PVP_KILLS_CHANGED")
        self.assertEqual(self.today("honorKills"), 3)
        self.lua.execute("function GetPVPLifetimeStats() return secretMark, 3, 8 end")
        self.fire("PLAYER_PVP_KILLS_CHANGED")
        self.assertEqual(self.char()[1].pvp.hk, 123)
        self.lua.execute("function GetPVPLifetimeStats() return 124, 3, 8 end")
        self.fire("PLAYER_PVP_KILLS_CHANGED")
        self.assertEqual(self.today("honorKills"), 4)

    def test_gold_is_sorted_by_the_open_window(self):
        self.start(CLASSIC)

        def money(amount):
            self.lua.execute(f"function GetMoney() return {amount} end")
            self.fire("PLAYER_MONEY")

        self.fire("MERCHANT_SHOW")
        money(300)  # bought something for 200
        money(400)  # sold something for 100
        self.fire("MERCHANT_CLOSED")
        self.fire("TAXIMAP_OPENED")
        self.fire("TAXIMAP_CLOSED")
        money(350)  # the flight is paid just after the map closes
        self.lua.execute("now = now + 5")
        money(450)  # looted later, with no window open
        self.assertEqual((self.today("outVendor"), self.today("inVendor")), (200, 100))
        self.assertEqual(self.today("outTaxi"), 50)
        self.assertEqual(self.today("inOther"), 100)
        self.assertEqual((self.today("goldIn"), self.today("goldOut")), (200, 250))

    def test_a_dungeon_run_counts_once_and_a_quick_look_not_at_all(self):
        self.start(CLASSIC + "\nclock = os.time(); time = function() return clock end; "
                   "tickers = {}; C_Timer.NewTicker = function(_, fn) tickers[#tickers + 1] = fn end")

        def enter(name, after):
            self.lua.execute(f"clock = clock + {after}; for _, fn in ipairs(tickers) do fn() end; inInstance = true; "
                             f"function GetInstanceInfo() return {name!r}, 'party', 1, 'Normal' end")
            self.fire("ZONE_CHANGED_NEW_AREA")

        enter("Deadmines", 0)
        enter("Stockade", 60)  # a minute in the Deadmines without a pull: just a look
        enter("Stockade", 30)  # a zone change inside the same dungeon
        enter("Deadmines", 400)  # 7 minutes in the Stockade: a real run
        self.assertEqual(self.today("dungeons"), 1)

    def test_old_dungeon_counts_are_recounted_from_saved_runs(self):
        save = ('local t = os.time(); local day = date("%Y-%m-%d", t); FunStatsDB = { chars = { ["Oldname-PvE"] = { '
                'days = { [day] = { dungeons = 9 }, ["2000-01-01"] = { dungeons = 2 } }, '
                'runs = { { inst = "Deadmines", t = t, dur = 900 }, { inst = "Deadmines", t = t + 905, dur = 600 }, '
                '{ inst = "Stockade", t = t + 3000, dur = 900 } } } } }')
        self.start(CLASSIC + "\n" + save)
        days = self.char()[1].days
        self.assertEqual(self.run_lua('FunStatsDB.chars["Oldname-PvE"].days[date("%Y-%m-%d", os.time())].dungeons'), 2)
        self.assertEqual(days["2000-01-01"].dungeons, 2)  # before the first saved run: left alone

    def test_a_lower_honor_count_for_a_moment_counts_nothing_twice(self):
        self.start(CLASSIC + "\nfunction GetPVPLifetimeStats() return 120, 0, 0 end")
        for hk in (0, 120, 123):
            self.lua.execute(f"function GetPVPLifetimeStats() return {hk}, 0, 0 end")
            self.fire("PLAYER_PVP_KILLS_CHANGED")
        self.assertEqual(self.today("honorKills"), 3)
        self.assertEqual(self.char()[1].pvp.hk, 123)

    def test_honor_counts_read_while_logging_out_are_ignored(self):
        # Seen on WoW Forever: playing it says 3 honorable, 0 dishonorable; the save written at logout said 0 and 90.
        self.start(CLASSIC + "\nfunction GetPVPLifetimeStats() return 3, 0 end")
        self.lua.execute("function GetPVPLifetimeStats() return 0, 90 end")
        self.fire("PLAYER_LOGOUT")
        p = self.char()[1].pvp
        self.assertEqual((p.hk, p.dk), (3, 0))

    BG = ('function GetInstanceInfo() return "Warsong Gulch", "pvp", 0, "" end; bgWinner = nil; '
          'function GetBattlefieldWinner() return bgWinner end; function GetNumBattlefieldScores() return 2 end; '
          'function GetBattlefieldScore(i) return unpack(({ { "Someone-Other", 9, 9, 9, 99, 0 }, '
          '{ "Oldname", 3, 12, 2, 150, 1 } })[i]) end')

    def test_a_finished_battleground_counts_once(self):
        self.start(CLASSIC + "\n" + self.BG)
        self.fire("UPDATE_BATTLEFIELD_SCORE")  # still playing: no winner yet
        self.assertIsNone(self.char()[1].bg["Warsong Gulch"])
        self.lua.execute("bgWinner = 1")  # Alliance, my side in the score
        for _ in range(3):
            self.fire("UPDATE_BATTLEFIELD_SCORE")
        b = self.char()[1].bg["Warsong Gulch"]
        self.assertEqual((b.n, b.w, b.l, b.kb, b.hk, b.deaths, b.honor), (1, 1, 0, 3, 12, 2, 150))
        self.assertEqual((self.today("bgs"), self.today("bgWins")), (1, 1))
        self.lua.execute("bgWinner = nil")  # the next match starts
        self.fire("UPDATE_BATTLEFIELD_SCORE")
        self.lua.execute("bgWinner = 0")
        self.fire("UPDATE_BATTLEFIELD_SCORE")
        b = self.char()[1].bg["Warsong Gulch"]
        self.assertEqual((b.n, b.w, b.l, b.kb), (2, 1, 1, 6))
        self.assertEqual((self.today("bgs"), self.today("bgWins")), (2, 1))

    def test_secret_or_missing_battleground_scores_count_nothing(self):
        self.start(FOREVER)
        self.fire("UPDATE_BATTLEFIELD_SCORE")  # a client without the scoreboard calls
        self.assertEqual(self.today("bgs"), 0)
        self.lua.execute(self.BG.replace("return bgWinner", "return secretMark"))
        self.fire("UPDATE_BATTLEFIELD_SCORE")
        self.assertEqual(self.today("bgs"), 0)

    HONOR = ('COMBATLOG_HONORGAIN = "%s dies, honorable kill Rank: %s (Estimated Honor Points: %d)"; '
             'function GetPVPLifetimeStats() return pvpHK, 0 end; pvpHK = 10')

    def test_an_honorable_kill_remembers_who_and_where(self):
        self.start(CLASSIC + "\n" + self.HONOR)
        self.lua.execute("pvpHK = 11")
        self.fire("CHAT_MSG_COMBAT_HONOR_GAIN", "Gankalot dies, honorable kill Rank: Private (Estimated Honor Points: 12)")
        self.fire("PLAYER_PVP_KILLS_CHANGED")  # the same kill, seen through the count: not a second record
        kills = self.char()[1].pvpKills
        self.assertEqual(len(kills), 1)
        self.assertEqual((kills[1].name, kills[1].zone), ("Gankalot", "Elwynn"))
        self.assertEqual(self.today("honorKills"), 1)

    def test_without_the_honor_message_a_dead_enemy_target_is_the_kill(self):
        self.start(CLASSIC + "\n" + self.HONOR)
        self.lua.execute('function UnitName(u) if u == "target" then return "Shadowknife" end return myFirst, mySecond end; '
                         'function UnitIsDeadOrGhost(u) return u == "target" end; function UnitIsEnemy() return true end; pvpHK = 11')
        self.fire("PLAYER_PVP_KILLS_CHANGED")
        self.fire("CHAT_MSG_COMBAT_HONOR_GAIN", "Shadowknife dies, honorable kill Rank: Private (Estimated Honor Points: 12)")
        kills = self.char()[1].pvpKills
        self.assertEqual(len(kills), 1)
        self.assertEqual(kills[1].name, "Shadowknife")

    def test_a_kill_with_no_name_to_find_is_only_counted(self):
        self.start(CLASSIC + "\n" + self.HONOR)
        self.lua.execute("pvpHK = 12")
        self.fire("PLAYER_PVP_KILLS_CHANGED")
        self.assertEqual(len(self.char()[1].pvpKills), 0)
        self.assertEqual(self.today("honorKills"), 2)

    def test_honor_kills_recounted_by_old_versions_are_dropped_once(self):
        save = ('local day = date("%Y-%m-%d", os.time()); FunStatsDB = { chars = { ["Oldname-PvE"] = { '
                'days = { [day] = { honorKills = 9, quests = 1 } }, pvp = { hk = 3 } } } }')
        self.start(CLASSIC + "\nfunction GetPVPLifetimeStats() return 3, 0 end\n" + save)
        self.assertEqual(self.today("honorKills"), 0)
        self.assertEqual(self.today("quests"), 1)
        self.lua.execute("function GetPVPLifetimeStats() return 5, 0 end")
        self.fire("PLAYER_PVP_KILLS_CHANGED")
        self.assertEqual(self.today("honorKills"), 2)  # new kills still count after the cleanup

    def test_deaths_saved_twice_by_old_versions_are_cleaned_up(self):
        save = ('local t = os.time(); local day = date("%Y-%m-%d", t); FunStatsDB = { chars = { ["Oldname-PvE"] = { '
                'days = { [day] = { deaths = 4, deaths_fall = 2 } }, '
                'deaths = { { t = t, cause = "fall" }, { t = t + 2, cause = "fall" }, { t = t + 600, cause = "mob" }, '
                '{ t = t + 606, cause = "mob" } } } } }')
        self.start(CLASSIC + "\n" + save)
        c = self.char()[1]
        self.assertEqual(len(c.deaths), 2)
        self.assertEqual((self.today("deaths"), self.today("deaths_fall")), (2, 1))

    def test_no_honor_calls_no_pvp_record(self):
        self.start(FOREVER)
        self.assertIsNone(self.char()[1].pvp)

    # ---- Classic stays as it was

    def test_classic_is_untouched(self):
        self.start(CLASSIC)
        key, c = self.char()
        self.assertEqual(key, "Oldname-PvE")
        self.assertTrue(self.run_lua("frames[1].events.COMBAT_LOG_EVENT_UNFILTERED"))
        self.assertFalse(self.run_lua("frames[1].events.PLAYER_REGEN_ENABLED") or False)
        self.assertFalse(self.run_lua("frames[1].events.LOOT_READY") or False)
        self.assertFalse(self.run_lua("frames[1].events.UNIT_SPELLCAST_SUCCEEDED") or False)
        self.assertFalse(self.run_lua("frames[1].events.CHAT_MSG_COMBAT_XP_GAIN") or False)
        self.fire("CHAT_MSG_LOOT", "You receive loot: |cff0070dd|Hitem:5::::|h[Blue]|h|r.")
        self.assertEqual(self.today("q3"), 1)
        none = [None] * 8
        self.fire("CHAT_MSG_SAY", "hi", "Oldname-PvE", None, *none, "Player-1-AAA")
        self.assertEqual(self.today("msgs"), 1)
        self.lua.execute('inGuild = true; roster = { { "Anna-Mirage", 5, "MAGE" } }')
        self.fire("GUILD_ROSTER_UPDATE")
        self.assertEqual(self.run_lua('FunStatsDB.observed["Anna-Mirage"].realm'), "Mirage")


if __name__ == "__main__":
    unittest.main()
