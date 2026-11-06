-- FunStats: records fun statistics per character into FunStatsDB.
-- Data is written to WTF\Account\<ACCOUNT>\SavedVariables\FunStats.lua
-- on logout or /reload. Sync.lua shares it with other FunStats players in the group.

local ADDON_NAME, ns = ...
local DB_VERSION = 1
local MAX_DEATHS = 300
local MAX_NOTABLE = 200
local MAX_KILL_NAMES = 400

local band = bit.band
local MINE = COMBATLOG_OBJECT_AFFILIATION_MINE or 0x00000001
local TYPE_PLAYER = COMBATLOG_OBJECT_TYPE_PLAYER or 0x00000400

-- WoW Forever (toc 16001) runs the modern client API: these globals moved into namespaces.
local GetItemInfo = GetItemInfo or (C_Item and C_Item.GetItemInfo)
local SendChat = SendChatMessage or (C_ChatInfo and C_ChatInfo.SendChatMessage)
local GetSpecialization = GetSpecialization or (C_SpecializationInfo and C_SpecializationInfo.GetSpecialization)
local GetSpecializationInfo = GetSpecializationInfo or (C_SpecializationInfo and C_SpecializationInfo.GetSpecializationInfo)
local GetNumSkillLines = GetNumSkillLines or (C_SkillInfo and C_SkillInfo.GetNumSkillLines)
local GetSkillLineInfo = GetSkillLineInfo or (C_SkillInfo and function(i)
  local s = C_SkillInfo.GetSkillLineInfo(i)
  if s then return s.name, s.isHeader, nil, s.rank, nil, nil, s.maxRank end
end)
-- Nil on Forever, where addons can't read the combat log: no combat stats there.
local CombatLogInfo = CombatLogGetCurrentEventInfo or (C_CombatLog and C_CombatLog.GetCurrentEventInfo)
-- The game's own damage meter stands in for the combat log there; other clients never touch it.
local DM = not CombatLogInfo and C_DamageMeter

-- Forever reports the server behind the realm ("CAMWOW EU4 Realm 8 PvP"), but one ruleset and region is one realm ("PvP-EU").
local function RealmFromServer(server)
  local region, ruleset = server:match("^.- (%u%u+)%d* Realm %d+ (.+)$")
  return region and (ruleset .. "-" .. region) or server
end
local function GetRealmName() return RealmFromServer(_G.GetRealmName()) end

local frame = CreateFrame("Frame")
local C            -- this character's record
local playerGUID, playerName
local lastHit      -- most recent damage taken, used to explain deaths
local lastMoney, lastXP, lastXPMax
local lastX, lastY, lastInst

---------------------------------------------------------------------------
-- Helpers
---------------------------------------------------------------------------

local function Print(msg)
  DEFAULT_CHAT_FRAME:AddMessage("|cfff0b429FunStats|r: " .. msg)
end

-- WoW Forever names have two parts and no home realm: UnitName returns first name and surname, not name and realm.
local function TwoPartNames()
  return RegionalUniqueNamesEnabled and RegionalUniqueNamesEnabled()
end

-- A unit's whole name, and its realm if it has another one. Nil while the game keeps it secret (inside instances).
local function FullName(unit)
  local name, second = UnitName(unit)
  if hasanysecretvalues and hasanysecretvalues(name, second) then return nil end
  if TwoPartNames() then
    if second and second ~= "" then return name .. " " .. second end
    return name
  end
  return name, second
end
ns.FullName = FullName

-- Is a name from a game message mine? Forever may show "First Surname", "First-Surname" or only the first name.
local function IsMe(name)
  if not name then return false end
  if name == playerName then return true end
  if not TwoPartNames() then return false end
  return (ns.SplitName(name)) == playerName or name == (UnitName("player"))
end

-- Chat events carry the sender's GUID, which can't be mistaken for someone with the same first name.
local function FromMe(author, guid)
  if guid and guid ~= "" then return guid == playerGUID end
  return author ~= nil and Ambiguate(author, "none") == playerName
end

local function Today()
  return date("%Y-%m-%d")
end

local function Day()
  local key = Today()
  local d = C.days[key]
  if not d then
    d = {}
    C.days[key] = d
  end
  return d
end

local function Add(field, n)
  local d = Day()
  d[field] = (d[field] or 0) + (n or 1)
end

local function Max(field, n)
  local d = Day()
  if not d[field] or n > d[field] then d[field] = n end
end

-- Turn a GlobalStrings format like "%s rolls %d (%d-%d)" into a Lua pattern.
local function FormatToPattern(fmt)
  if not fmt then return nil end
  local p = fmt:gsub("([%(%)%.%+%-%*%?%[%]%^%$])", "%%%1")
  p = p:gsub("%%s", "(.+)"):gsub("%%d", "(%%d+)")
  return "^" .. p .. "$"
end

local ROLL_PATTERN = FormatToPattern(RANDOM_ROLL_RESULT)
local LOOT_SELF = FormatToPattern(LOOT_ITEM_SELF)
local LOOT_SELF_MULTI = FormatToPattern(LOOT_ITEM_SELF_MULTIPLE)
local LOOT_PUSHED = FormatToPattern(LOOT_ITEM_PUSHED_SELF)
local LOOT_PUSHED_MULTI = FormatToPattern(LOOT_ITEM_PUSHED_SELF_MULTIPLE)

local QUALITY_BY_COLOR = {
  ff9d9d9d = 0, ffffffff = 1, ff1eff00 = 2,
  ff0070dd = 3, ffa335ee = 4, ffff8000 = 5,
}

local function ItemQuality(link)
  -- The modern client colours links by quality number ("|cnIQ4:") instead of a colour code.
  local iq = tonumber(link:match("|cnIQ(%d)"))
  if iq then return iq end
  local color = link:match("|c(%x%x%x%x%x%x%x%x)")
  return color and QUALITY_BY_COLOR[color:lower()] or 1
end

local function PushCapped(list, entry, cap)
  list[#list + 1] = entry
  while #list > cap do table.remove(list, 1) end
end

local function MapPosition(unit)
  unit = unit or "player"
  local mapID = C_Map and C_Map.GetBestMapForUnit and C_Map.GetBestMapForUnit(unit)
  if not mapID then return nil end
  local pos = C_Map.GetPlayerMapPosition(mapID, unit)
  if not pos then return mapID end
  local x, y = pos:GetXY()
  return mapID, math.floor(x * 1000) / 10, math.floor(y * 1000) / 10
end

-- Continent maps the website draws: Kalimdor, Eastern Kingdoms, Outland. Clients with the newer map ids
-- (Mists of Pandaria Classic) don't have these; there the website draws Azeroth with its continents on it.
local CONTINENTS = { 1414, 1415, 1945 }
local AZEROTH = 947
local CONTINENT_TYPE = Enum and Enum.UIMapType and Enum.UIMapType.Continent or 2
-- Mists of Pandaria Classic (5.x) and later, and WoW Forever (1.x, toc 16001): specializations and the newer profession list.
local TOC = select(4, GetBuildInfo()) or 0
local MODERN = TOC >= 50000 or (TOC > 16000 and TOC < 20000)

-- The continent a map (zone, subzone, city) belongs to.
local function ContinentOf(mapID)
  local info = mapID and C_Map.GetMapInfo(mapID)
  while info and info.mapType and info.mapType > CONTINENT_TYPE and info.parentMapID and info.parentMapID > 0 do
    info = C_Map.GetMapInfo(info.parentMapID)
  end
  if info and info.mapType == CONTINENT_TYPE then return info.mapID end
end

-- A zone position (0-100) as a position on its continent map (0-100).
local function OnContinent(mapID, x, y)
  if not (mapID and x and y and C_Map.GetMapRectOnMap) then return nil end
  local cont = ContinentOf(mapID)
  if not cont then return nil end
  local ok, minX, maxX, minY, maxY = pcall(C_Map.GetMapRectOnMap, mapID, cont)
  if not ok or not minX or maxX <= minX then return nil end
  local cx = (minX + (maxX - minX) * x / 100) * 100
  local cy = (minY + (maxY - minY) * y / 100) * 100
  return cont, math.floor(cx * 10) / 10, math.floor(cy * 10) / 10
end

-- Where a unit is: zone, zone position and continent position, for the website's maps.
local function Spot(unit)
  local mapID, x, y = MapPosition(unit)
  local cont, cx, cy = OnContinent(mapID, x, y)
  return { zone = GetRealZoneText(), map = mapID, x = x, y = y, cont = cont, cx = cx, cy = cy }
end

-- Every zone's rectangle on each continent (or each continent's on Azeroth), so the website can draw them.
local function BuildAtlas()
  if not (C_Map.GetMapChildrenInfo and C_Map.GetMapRectOnMap) then return nil end
  local zoneType = Enum and Enum.UIMapType and Enum.UIMapType.Zone or 3
  local atlas = { v = select(4, GetBuildInfo()) }
  local maps, kidType = CONTINENTS, zoneType
  if not C_Map.GetMapInfo(CONTINENTS[1]) then maps, kidType = { AZEROTH }, CONTINENT_TYPE end
  for _, cont in ipairs(maps) do
    local info = C_Map.GetMapInfo(cont)
    local kids = info and C_Map.GetMapChildrenInfo(cont, kidType)
    if kids and #kids > 0 then
      local zones = {}
      for _, z in ipairs(kids) do
        local ok, minX, maxX, minY, maxY = pcall(C_Map.GetMapRectOnMap, z.mapID, cont)
        if ok and minX and maxX > minX then
          local r = function(v) return math.floor(v * 1000 + 0.5) / 10 end
          zones[#zones + 1] = { id = z.mapID, n = z.name, x0 = r(minX), x1 = r(maxX), y0 = r(minY), y1 = r(maxY) }
        end
      end
      atlas[tostring(cont)] = { n = info.name, zones = zones }
    end
  end
  return atlas
end

-- The group unit token ("party2", "raid14") for a GUID, if they're in the group.
local function GroupUnitFor(guid)
  local raid = IsInRaid()
  for i = 1, raid and GetNumGroupMembers() or GetNumSubgroupMembers() do
    local u = (raid and "raid" or "party") .. i
    if UnitGUID(u) == guid then return u end
  end
end

---------------------------------------------------------------------------
-- Character setup
---------------------------------------------------------------------------

-- Which game this is: client version, Hardcore rules and season, so the website can
-- separate WoW Forever, Hardcore Forever, Classic Era and so on.
local function GameInfo()
  local version, _, _, toc = GetBuildInfo()
  local hardcore = C_GameRules and C_GameRules.IsHardcoreActive and C_GameRules.IsHardcoreActive() or nil
  local season = C_Seasons and C_Seasons.GetActiveSeason and C_Seasons.GetActiveSeason() or nil
  return {
    version = version, toc = toc, project = WOW_PROJECT_ID,
    hardcore = hardcore and true or nil, season = season,
  }
end
ns.GameInfo = GameInfo

-- While logging in or out the game briefly reports "not in a guild", so the guild is only
-- cleared when asked to (canClear), well after login.
local function UpdateGuild(canClear)
  local old = C.guild
  local g = GetGuildInfo("player")
  if g then C.guild = g elseif canClear and not IsInGuild() then C.guild = nil end
  if not old or old == C.guild then return end
  -- Left a guild: forget its roster, unless another of my characters on this realm is still in it.
  local realm = GetRealmName()
  for _, c in pairs(FunStatsDB.chars) do
    if c.guild == old and c.realm == realm then return end
  end
  for key, O in pairs(FunStatsDB.observed) do
    if O.roster and O.guild == old and O.realm == realm and not next(O.days or {}) then FunStatsDB.observed[key] = nil end
  end
end

local function UpdateProfile()
  C.game = GameInfo()
  C.guid = playerGUID -- how the Ledger app knows this character in the combat log files
  C.name = playerName
  C.realm = GetRealmName()
  local _, classToken = UnitClass("player")
  C.class = classToken
  local _, raceToken = UnitRace("player")
  C.race = raceToken
  C.faction = UnitFactionGroup("player")
  -- Characters never lose levels, but the game can report an old level while logging out (seen on Mists of
  -- Pandaria Classic), so the level only goes up.
  local level = UnitLevel("player")
  if level and level > (C.level or 0) then C.level = level end
  UpdateGuild()
  C.lastSeen = time()
  C.owner = FunStatsDB.id
end

-- Saves from before 1.7.2 are keyed by server name: move them to the realm name, keeping the newest if there are several.
local function MoveServerKeys(list)
  local moved = {}
  for key in pairs(list) do
    local name, server = key:match("^([^%-]+)%-(.+)$")
    if server and RealmFromServer(server) ~= server then moved[key] = name .. "-" .. RealmFromServer(server) end
  end
  for old, new in pairs(moved) do
    local entry = list[old]
    list[old] = nil
    if type(entry) == "table" and entry.realm then entry.realm = RealmFromServer(entry.realm) end
    if not list[new] or (entry.lastSeen or 0) > (list[new].lastSeen or 0) then list[new] = entry end
  end
end

local function InitCharacter()
  FunStatsDB = FunStatsDB or {}
  FunStatsDB.v = DB_VERSION
  FunStatsDB.chars = FunStatsDB.chars or {}
  FunStatsDB.friends = FunStatsDB.friends or {}
  FunStatsDB.observed = FunStatsDB.observed or {}
  FunStatsDB.synced = FunStatsDB.synced or {}   -- other players' stats, received by Sync.lua
  MoveServerKeys(FunStatsDB.chars)
  MoveServerKeys(FunStatsDB.observed)
  MoveServerKeys(FunStatsDB.synced)
  -- Random id for this WoW account, so the website can tell observers apart.
  FunStatsDB.id = FunStatsDB.id or ("a" .. time() .. math.random(100000, 999999))
  -- Private upload code: proves on the website that this install's characters are yours.
  -- It never leaves this file except when you upload; it is not shared in game.
  if type(FunStatsDB.secret) ~= "string" or #FunStatsDB.secret < 32 then
    local hex = {}
    for i = 1, 40 do hex[i] = string.format("%x", math.random(0, 15)) end
    FunStatsDB.secret = table.concat(hex)
  end

  playerGUID = UnitGUID("player")
  playerName = FullName("player")
  local key = playerName .. "-" .. GetRealmName()
  C = FunStatsDB.chars[key] or {}
  FunStatsDB.chars[key] = C

  C.days = C.days or {}
  C.deaths = C.deaths or {}
  C.kills = C.kills or {}
  C.killNames = C.killNames or 0
  C.instances = C.instances or {}
  C.levels = C.levels or {}
  C.notable = C.notable or {}
  C.best = C.best or {}
  C.firstSeen = C.firstSeen or time()
  C.settings = C.settings or { announce = false }
  C.spellDmg = C.spellDmg or {}     -- damage per spell, all time
  C.casts = C.casts or {}           -- casts per spell, all time
  C.heat = C.heat or {}             -- seconds played per "weekday-hour"
  C.zones = C.zones or {}           -- seconds spent per zone
  C.levelPlayed = C.levelPlayed or {} -- played seconds when each level was reached
  C.duels = C.duels or {}           -- opponent -> { w, l }
  C.healers = C.healers or {}       -- who healed me, total effective healing
  C.playedTotal = C.playedTotal or 0
  C.dingAt = C.dingAt or {}         -- where each level was reached: zone and map positions
  C.bosses = C.bosses or {}         -- "encounterID:difficultyID" -> kills, wipes, fastest kill, best DPS
  C.fights = C.fights or {}         -- recent boss fights, with the group's damage and healing
  C.runs = C.runs or {}             -- finished dungeon and raid runs; C.run is the one in progress
  -- Deaths saved before continent positions existed get them now.
  for _, d in ipairs(C.deaths) do
    if type(d) == "table" and d.map and d.x and not d.cx then d.cont, d.cx, d.cy = OnContinent(d.map, d.x, d.y) end
  end
  -- Rebuilt for a new client, or when an older FunStats saved one without any maps (Mists of Pandaria Classic).
  local hasMaps = false
  for k in pairs(C.atlas or {}) do if k ~= "v" then hasMaps = true end end
  if not hasMaps or C.atlas.v ~= select(4, GetBuildInfo()) then C.atlas = BuildAtlas() end
  UpdateProfile()

  lastMoney = GetMoney()
  C.gold = lastMoney
  lastXP, lastXPMax = UnitXP("player"), UnitXPMax("player")
  C.peakGold = math.max(C.peakGold or 0, lastMoney)
  C.days[date("%Y-%m-%d")] = C.days[date("%Y-%m-%d")] or {}
  C.days[date("%Y-%m-%d")].gold = lastMoney
end

-- Add n to map[key], allowing at most `cap` distinct keys.
local function CountIn(map, key, n, cap)
  if not key then return end
  if map[key] then
    map[key] = map[key] + (n or 1)
  else
    local size = 0
    for _ in pairs(map) do size = size + 1; if size >= cap then return end end
    map[key] = n or 1
  end
end

---------------------------------------------------------------------------
-- Friends: guild mates, WoW friends and players added with /funstats add are
-- recorded as we see them in the combat log, so they get stats without the addon.
---------------------------------------------------------------------------

local ENV_CAUSE = {
  FALLING = "fall", Falling = "fall",
  DROWNING = "drown", Drowning = "drown",
  FATIGUE = "fatigue", Fatigue = "fatigue",
  FIRE = "fire", Fire = "fire",
  LAVA = "lava", Lava = "lava",
  SLIME = "slime", Slime = "slime",
}

local MAX_FRIEND_DEATHS = 150
local friendByGUID = {}   -- guid -> "Name-Realm" or false
local friendLastHit = {}  -- guid -> last damage taken

local function SplitName(full)
  if TwoPartNames() then
    -- A name is always two words here, whatever follows it: the game also writes "First-Surname-PvP-EU".
    local first, last = full:match("^([^%- ]+)[%- ]([^%- ]+)")
    return first and (first .. " " .. last) or full, GetRealmName()
  end
  local base, realm = strsplit("-", full)
  return base, (realm and realm ~= "") and realm or GetRealmName()
end
ns.SplitName = SplitName

local function Observed(key)
  local O = FunStatsDB.observed[key]
  if not O then
    O = { days = {}, deaths = {} }
    FunStatsDB.observed[key] = O
  end
  return O
end

local function ODay(key)
  local O = Observed(key)
  local k = Today()
  local d = O.days[k]
  if not d then d = {}; O.days[k] = d end
  O.lastSeen = time()
  return d, O
end

local function OAdd(key, field, n)
  local d = ODay(key)
  d[field] = (d[field] or 0) + (n or 1)
end

-- Guild mates and WoW friends are tracked on their own; anyone else only once added by hand.
local function Tracked(guid, base)
  if FunStatsDB.friends[base:lower()] then return true end
  if IsGuildMember then
    local ok, member = pcall(IsGuildMember, guid)
    if ok and member then return true end
  end
  return C_FriendList and C_FriendList.IsFriend and C_FriendList.IsFriend(guid) or false
end

-- Returns the friend's "Name-Realm" for a combat log unit, or nil.
local function FriendKey(guid, name)
  if not guid or not name or guid == playerGUID then return nil end
  local cached = friendByGUID[guid]
  if cached ~= nil then return cached or nil end
  if not guid:find("^Player%-") then friendByGUID[guid] = false; return nil end
  local base, realm = SplitName(name)
  if not Tracked(guid, base) then friendByGUID[guid] = false; return nil end
  local key = base .. "-" .. realm
  friendByGUID[guid] = key
  local O = Observed(key)
  O.name, O.realm = base, realm
  O.game = GameInfo()  -- friends we see are in the same game and mode as us
  local _, classToken, _, raceToken = GetPlayerInfoByGUID(guid)
  O.class, O.race = classToken or O.class, raceToken or O.race
  return key
end

local function OnFriendDeath(guid, name, key)
  -- Hunters' Feign Death also fires UNIT_DIED; check a moment later.
  C_Timer.After(0.3, function()
    if UnitIsFeignDeath and UnitIsFeignDeath(name) then return end
    local hit = friendLastHit[guid]
    local cause, by, spell, amt = "unknown", nil, nil, nil
    if hit and GetTime() - hit.t < 15 then
      if hit.env then cause = hit.env else cause = hit.pvp and "player" or "mob"; by, spell = hit.by, hit.spell end
      amt = hit.amt
    end
    OAdd(key, "deaths")
    if cause ~= "mob" and cause ~= "player" and cause ~= "unknown" then OAdd(key, "deaths_" .. cause) end
    local _, O = ODay(key)
    local lvl = UnitLevel(name)
    if lvl and lvl > 0 then O.level = lvl end
    local unit = GroupUnitFor(guid)
    local spot = unit and Spot(unit) or {}
    PushCapped(O.deaths, {
      t = time(), lvl = O.level, zone = GetRealZoneText(),
      inst = IsInInstance() and (GetInstanceInfo()) or nil,
      map = spot.map, x = spot.x, y = spot.y, cont = spot.cont, cx = spot.cx, cy = spot.cy,
      cause = cause, by = by, spell = spell, amt = amt,
    }, MAX_FRIEND_DEATHS)
    friendLastHit[guid] = nil
  end)
end

local function OnFriendCombat(sub, srcGUID, srcName, srcFlags, dstGUID, dstName, a12, a13, a15, a16)
  local src = FriendKey(srcGUID, srcName)
  if src and dstGUID ~= srcGUID then
    if sub == "SWING_DAMAGE" then
      OAdd(src, "dmg", a12)
    elseif sub == "SPELL_DAMAGE" or sub == "SPELL_PERIODIC_DAMAGE" or sub == "RANGE_DAMAGE" or sub == "DAMAGE_SHIELD" then
      OAdd(src, "dmg", a15)
    elseif sub == "PARTY_KILL" then
      OAdd(src, "kb")
    end
  end
  if src and (sub == "SPELL_HEAL" or sub == "SPELL_PERIODIC_HEAL") then
    local effective = a15 - (a16 or 0)
    if effective > 0 then OAdd(src, "heal", effective) end
  end

  local dst = FriendKey(dstGUID, dstName)
  if not dst then return end
  if sub == "UNIT_DIED" then
    OnFriendDeath(dstGUID, dstName, dst)
    return
  end
  local amount, spell, env
  if sub == "SWING_DAMAGE" then
    amount, spell = a12, "Melee"
  elseif sub == "SPELL_DAMAGE" or sub == "SPELL_PERIODIC_DAMAGE" or sub == "RANGE_DAMAGE" then
    amount, spell = a15, a13
  elseif sub == "ENVIRONMENTAL_DAMAGE" then
    amount, env = a13, ENV_CAUSE[a12] or "environment"
  end
  if amount and amount > 0 then
    OAdd(dst, "taken", amount)
    local pvp = srcFlags and band(srcFlags, TYPE_PLAYER) ~= 0 and not FriendKey(srcGUID, srcName) and srcGUID ~= playerGUID
    friendLastHit[dstGUID] = { by = srcName, spell = spell, amt = amount, env = env, pvp = pvp, t = GetTime() }
  end
end

-- Every few seconds: refresh grouped friends' level and count time played together.
local groupTick = 0
local function GroupTick()
  groupTick = groupTick + 1
  if groupTick % 5 ~= 0 or not IsInGroup() then return end
  local prefix, count = "party", GetNumGroupMembers() - 1
  if IsInRaid() then prefix, count = "raid", GetNumGroupMembers() end
  for i = 1, count do
    local unit = prefix .. i
    local name, realm = FullName(unit)
    if name and not UnitIsUnit(unit, "player") and (FunStatsDB.friends[name:lower()] or UnitIsInMyGuild(unit)
      or (C_FriendList and C_FriendList.IsFriend and C_FriendList.IsFriend(UnitGUID(unit)))) then
      local key = name .. "-" .. ((realm and realm ~= "") and realm or GetRealmName())
      local d, O = ODay(key)
      O.name, O.realm = name, (realm and realm ~= "") and realm or GetRealmName()
      local lvl = UnitLevel(unit)
      if lvl and lvl > 0 then O.level = lvl end
      local _, classToken = UnitClass(unit)
      O.class = classToken or O.class
      O.guild = GetGuildInfo(unit) or O.guild
      if UnitIsConnected(unit) then d.together = (d.together or 0) + 5 end
    end
  end
end

---------------------------------------------------------------------------
-- Boss fights and dungeon runs. The game marks each boss fight with
-- ENCOUNTER_START and ENCOUNTER_END; the group's damage and healing in between
-- is that fight's meter. A run lasts from entering a dungeon or raid until
-- being outside it for a while, so running back as a ghost is the same run.
---------------------------------------------------------------------------

local MAX_FIGHTS = 150
local MAX_RUNS = 150
local RUN_GRACE = 600            -- seconds outside the instance before the run is over
local GROUP = 0x00000007         -- combat log affiliation: mine, party or raid
local fight                      -- the boss fight in progress
local petOwner = {}              -- pet guid -> owner guid, so pets count for their owner

local function MapPets()
  wipe(petOwner)
  local mine = UnitGUID("pet")
  if mine then petOwner[mine] = playerGUID end
  local raid = IsInRaid()
  for i = 1, raid and GetNumGroupMembers() or GetNumSubgroupMembers() do
    local pet = UnitGUID((raid and "raidpet" or "partypet") .. i)
    if pet then petOwner[pet] = UnitGUID((raid and "raid" or "party") .. i) end
  end
end

-- The group member a combat log source belongs to (pets and my guardians count for their owner), or nil.
local function FightActor(guid, flags)
  if not guid or not flags or band(flags, GROUP) == 0 then return nil end
  if guid:find("^Player%-") then return guid end
  if band(flags, MINE) ~= 0 then return playerGUID end
  return petOwner[guid]
end

local function FightTally(sub, srcGUID, srcFlags, dstGUID, dstName, dstFlags, a12, a15, a16)
  local f = fight
  if sub == "UNIT_DIED" then
    if dstGUID and dstGUID:find("^Player%-") and dstFlags and band(dstFlags, GROUP) ~= 0 then
      -- Hunters' Feign Death also fires UNIT_DIED; check a moment later.
      C_Timer.After(0.3, function()
        if f ~= fight or (UnitIsFeignDeath and UnitIsFeignDeath(dstName)) then return end
        f.deaths = f.deaths + 1
      end)
    end
    return
  end
  local who = FightActor(srcGUID, srcFlags)
  if not who then return end
  if sub == "SPELL_HEAL" or sub == "SPELL_PERIODIC_HEAL" then
    local effective = (a15 or 0) - (a16 or 0)
    if effective > 0 then f.heal[who] = (f.heal[who] or 0) + effective end
    return
  end
  local amount
  if sub == "SWING_DAMAGE" then
    amount = a12
  elseif sub == "SPELL_DAMAGE" or sub == "SPELL_PERIODIC_DAMAGE" or sub == "RANGE_DAMAGE" or sub == "DAMAGE_SHIELD" then
    amount = a15
  end
  if amount and amount > 0 and not (dstFlags and band(dstFlags, GROUP) ~= 0) then
    f.dmg[who] = (f.dmg[who] or 0) + amount
  end
end

-- The fight's top ten damage dealers and top five healers, so a raid fight still fits in a sync message.
local function FightMeter(f)
  local rows, seen = {}, {}
  local function top(map, n)
    local list = {}
    for guid in pairs(map) do list[#list + 1] = guid end
    table.sort(list, function(a, b) return map[a] > map[b] end)
    for i = 1, math.min(n, #list) do
      local guid = list[i]
      if not seen[guid] then
        seen[guid] = true
        local _, classToken, _, _, _, name, second = GetPlayerInfoByGUID(guid)
        if name and second and second ~= "" and TwoPartNames() then name = name .. " " .. second end
        rows[#rows + 1] = { n = name or "?", c = classToken, d = math.floor(f.dmg[guid] or 0), h = math.floor(f.heal[guid] or 0) }
      end
    end
  end
  top(f.dmg, 10)
  top(f.heal, 5)
  table.sort(rows, function(a, b) return a.d > b.d end)
  return rows
end

-- Everyone else in a party, added to the run as they show up. Raids are too many to list.
local function AddMates(r)
  if IsInRaid() or not IsInGroup() then return end
  r.with = r.with or {}
  for i = 1, GetNumSubgroupMembers() do
    local name = FullName("party" .. i)
    if name and name ~= UNKNOWNOBJECT and #r.with < 8 and not tContains(r.with, name) then r.with[#r.with + 1] = name end
  end
end

local function EndRun()
  local r = C.run
  if not r then return end
  C.run = nil
  r.dur = math.max(0, (r.left or r.last or r.t) - r.t)
  r.left, r.last = nil, nil
  -- A quick look inside without a single boss pull isn't a run worth listing.
  if r.bosses == 0 and r.wipes == 0 and r.dur < 300 then return end
  PushCapped(C.runs, r, MAX_RUNS)
end

local function OnZone()
  local inInstance, kind = IsInInstance()
  local r = C.run
  if inInstance and (kind == "party" or kind == "raid") then
    local name, _, diffID, diffName = GetInstanceInfo()
    if not name then return end
    if r and r.inst == name and r.d == diffID then
      r.left = nil -- back inside: a ghost run back, or a reload
      return
    end
    EndRun()
    r = {
      t = time(), last = time(), inst = name, kind = kind, d = diffID, dn = diffName ~= "" and diffName or nil,
      lvl = UnitLevel("player"), bosses = 0, wipes = 0, deaths = 0,
    }
    AddMates(r)
    C.run = r
    Add("dungeons")
    C.instances[name] = (C.instances[name] or 0) + 1
  elseif r and not r.left then
    -- After logging out inside, the run ended when we were last seen there.
    r.left = math.min(time(), r.last or time())
  end
end

local function RunTick()
  local r = C.run
  if not r then return end
  if not r.left then r.last = time() elseif time() - r.left > RUN_GRACE then EndRun() end
end

-- Boss fights waiting for their damage meter numbers, which stay secret until combat ends.
local pendingFights = {}

local function NewestSession()
  local newest
  for _, s in ipairs(DM.GetAvailableCombatSessions()) do
    if not newest or s.sessionID > newest then newest = s.sessionID end
  end
  return newest
end

local function OnEncounterStart(id, name, diffID, size)
  MapPets()
  fight = { id = id, start = GetTime(), t = time(), dmg = {}, heal = {}, deaths = 0 }
end

local function OnEncounterEnd(id, name, diffID, size, success)
  local f = fight
  fight = nil
  if f and f.id ~= id then f = nil end
  local secs = f and math.floor(GetTime() - f.start + 0.5)
  local won = success == 1 or success == true
  -- A pull that resets at once (the boss ran home) isn't a wipe.
  if not won and secs and secs < 8 then return end
  local mine = f and math.floor(f.dmg[playerGUID] or 0) or 0
  local myHeal = f and math.floor(f.heal[playerGUID] or 0) or 0
  local inst, _, _, diffName = GetInstanceInfo()
  diffName = diffName ~= "" and diffName or nil

  local key = tostring(id) .. ":" .. tostring(diffID or 0)
  local b = C.bosses[key]
  if not b then
    b = { n = name, inst = inst, d = diffID, dn = diffName, kills = 0, wipes = 0 }
    C.bosses[key] = b
  end
  b.dmg = (b.dmg or 0) + mine
  b.heal = (b.heal or 0) + myHeal
  if won then
    b.kills = b.kills + 1
    b.first = b.first or time()
    b.lvl = b.lvl or UnitLevel("player") -- level at the first kill
    b.last = time()
    if secs and secs > 0 then
      if not b.fast or secs < b.fast then b.fast = secs end
      b.dps = math.max(b.dps or 0, math.floor(mine / secs))
      b.hps = math.max(b.hps or 0, math.floor(myHeal / secs))
    end
    Add("bossKills")
  else
    b.wipes = b.wipes + 1
    Add("wipes")
  end

  local r = C.run
  if r and r.inst == inst then
    if won then r.bosses = r.bosses + 1; r.lastBoss = name else r.wipes = r.wipes + 1 end
    AddMates(r)
  end
  if f then
    local entry = {
      t = f.t, boss = name, inst = inst, d = diffID, dn = diffName, size = size, ok = won or nil, dur = secs,
      dmg = mine, heal = myHeal, deaths = f.deaths > 0 and f.deaths or nil, lvl = UnitLevel("player"), who = FightMeter(f),
    }
    PushCapped(C.fights, entry, MAX_FIGHTS)
    if DM then
      local ok, session = pcall(NewestSession)
      if ok and session then
        pendingFights[#pendingFights + 1] = { entry = entry, boss = b, won = won, secs = secs, session = session }
      end
    end
  end
end

---------------------------------------------------------------------------
-- Combat log
---------------------------------------------------------------------------

local function RecordHit(amount, spell, target, crit, overkill)
  if not amount or amount <= 0 then return end
  Add("dmg", amount)
  Add("hits")
  if crit then Add("crits") end
  if overkill and overkill > 0 then Add("overkill", overkill) end
  CountIn(C.spellDmg, spell or "Unknown", amount, 200)
  local d = Day()
  if not d.maxHit or amount > d.maxHit then
    d.maxHit, d.maxHitSpell, d.maxHitTarget = amount, spell, target
  end
  local b = C.best.hit
  if not b or amount > b.amt then
    C.best.hit = { amt = amount, spell = spell, target = target, crit = crit or nil, t = time() }
  end
end

local function RecordHeal(amount, over, spell)
  local effective = amount - (over or 0)
  Add("heal", effective)
  if over and over > 0 then Add("overheal", over) end
  local b = C.best.heal
  if not b or effective > b.amt then
    C.best.heal = { amt = effective, spell = spell, t = time() }
  end
end

local function RecordKill(name)
  Add("kb")
  if not name then return end
  if C.kills[name] then
    C.kills[name] = C.kills[name] + 1
  elseif C.killNames < MAX_KILL_NAMES then
    C.kills[name] = 1
    C.killNames = C.killNames + 1
  end
end

local function OnCombatLog()
  local _, sub, _, srcGUID, srcName, srcFlags, _, dstGUID, dstName, dstFlags, _,
    a12, a13, a14, a15, a16, a17, a18, a19, a20, a21 = CombatLogInfo()

  local fromMe = srcFlags and band(srcFlags, MINE) ~= 0
  local toMe = dstGUID == playerGUID

  -- Damage and healing done by me or my pet
  if fromMe and dstGUID ~= playerGUID then
    if sub == "SWING_DAMAGE" then
      RecordHit(a12, "Melee", dstName, a18, a13)
    elseif sub == "SPELL_DAMAGE" or sub == "SPELL_PERIODIC_DAMAGE"
        or sub == "RANGE_DAMAGE" or sub == "DAMAGE_SHIELD" then
      RecordHit(a15, a13, dstName, a21, a16)
    elseif sub == "SWING_MISSED" or sub == "SPELL_MISSED" or sub == "RANGE_MISSED" then
      Add("whiffs")
      local missType = sub == "SWING_MISSED" and a12 or a15
      if missType == "RESIST" then Add("resisted") end
    elseif sub == "PARTY_KILL" then
      RecordKill(dstName)
      if dstFlags and band(dstFlags, TYPE_PLAYER) ~= 0 then Add("hk") end
    end
  end
  if fromMe and (sub == "SPELL_HEAL" or sub == "SPELL_PERIODIC_HEAL") then
    RecordHeal(a15, a16, a13)
  end
  if srcGUID == playerGUID and sub == "SPELL_CAST_SUCCESS" and a13 then
    Add("casts")
    CountIn(C.casts, a13, 1, 200)
    if a13 == "Hearthstone" then Add("hearth") end
  end

  -- Healing I received from someone else
  if toMe and not fromMe and (sub == "SPELL_HEAL" or sub == "SPELL_PERIODIC_HEAL") then
    local effective = (a15 or 0) - (a16 or 0)
    if effective > 0 then
      Add("healedBy", effective)
      CountIn(C.healers, srcName, effective, 100)
    end
  end

  -- Attacks I avoided
  if toMe and (sub == "SWING_MISSED" or sub == "SPELL_MISSED" or sub == "RANGE_MISSED") then
    local missType = sub == "SWING_MISSED" and a12 or a15
    if missType == "DODGE" then Add("dodges")
    elseif missType == "PARRY" then Add("parries")
    elseif missType == "BLOCK" then Add("blocks")
    elseif missType == "RESIST" then Add("resists")
    else Add("avoided") end
  end

  -- Damage taken, remembered so deaths can be explained
  if toMe then
    local amount, spell, env
    if sub == "SWING_DAMAGE" then
      amount, spell = a12, "Melee"
    elseif sub == "SPELL_DAMAGE" or sub == "SPELL_PERIODIC_DAMAGE" or sub == "RANGE_DAMAGE" then
      amount, spell = a15, a13
    elseif sub == "ENVIRONMENTAL_DAMAGE" then
      amount, env = a13, ENV_CAUSE[a12] or "environment"
      if env == "fall" then Add("fallDmg", amount) end
    end
    if amount and amount > 0 then
      Add("taken", amount)
      local pvp = srcFlags and band(srcFlags, TYPE_PLAYER) ~= 0 and not fromMe
      lastHit = { by = srcName, spell = spell, amt = amount, env = env, pvp = pvp, t = GetTime() }
    end
  end

  if fight then
    FightTally(sub, srcGUID, srcFlags, dstGUID, dstName, dstFlags, a12, a15, a16)
  end

  OnFriendCombat(sub, srcGUID, srcName, srcFlags, dstGUID, dstName, a12, a13, a15, a16)
end

---------------------------------------------------------------------------
-- Damage meter (clients where addons can't read the combat log)
---------------------------------------------------------------------------

-- Enum.DamageMeterType.
local METER_DAMAGE, METER_HEALING, METER_TAKEN = 0, 2, 7
local AUTO_ATTACK = 6603
-- Every fight is a numbered session. This keeps what's already counted from each, so reading one twice adds nothing.
local meterSeen = {}
local meterReady = false -- the first read only notes what's there: a /reload can keep the sessions

local function MeterNew(key, total)
  if issecretvalue and issecretvalue(total) then return 0 end -- left uncounted, so the next read picks it up
  local seen = meterSeen[key] or 0
  meterSeen[key] = total
  if total < seen then seen = 0 end -- the number was used again after a reset
  return meterReady and math.floor(total - seen) or 0
end

local function MeterSources(session, kind)
  local s = DM.GetCombatSessionFromID(session, kind)
  return s and s.combatSources or {}
end

local function CountMeter(session, kind, field)
  for _, src in ipairs(MeterSources(session, kind)) do
    if src.isLocalPlayer then
      local new = MeterNew(session .. ":" .. kind, src.totalAmount)
      if new > 0 then Add(field, new) end
    end
  end
end

local function CountMeterSpells(session)
  local me = DM.GetCombatSessionSourceFromID(session, METER_DAMAGE, playerGUID)
  for _, s in ipairs(me and me.combatSpells or {}) do
    local new = MeterNew(session .. ":s" .. s.spellID, s.totalAmount)
    if new > 0 then
      local name = s.spellID == AUTO_ATTACK and "Melee" or C_Spell.GetSpellName(s.spellID)
      CountIn(C.spellDmg, name or "Unknown", new, 200)
    end
  end
end

local function MeterGroup(session, kind)
  local map = {}
  for _, src in ipairs(MeterSources(session, kind)) do
    if src.sourceGUID and src.sourceGUID:find("^Player%-") then map[src.sourceGUID] = src.totalAmount end
  end
  return map
end

local function FillFight(p)
  local f = { dmg = MeterGroup(p.session, METER_DAMAGE), heal = MeterGroup(p.session, METER_HEALING) }
  local mine, myHeal = math.floor(f.dmg[playerGUID] or 0), math.floor(f.heal[playerGUID] or 0)
  p.entry.dmg, p.entry.heal, p.entry.who = mine, myHeal, FightMeter(f)
  local b = p.boss
  b.dmg, b.heal = (b.dmg or 0) + mine, (b.heal or 0) + myHeal
  if p.won and p.secs and p.secs > 0 then
    b.dps = math.max(b.dps or 0, math.floor(mine / p.secs))
    b.hps = math.max(b.hps or 0, math.floor(myHeal / p.secs))
  end
end

local function ReadMeterNow()
  if not DM.IsDamageMeterAvailable() then return end
  for _, s in ipairs(DM.GetAvailableCombatSessions()) do
    CountMeter(s.sessionID, METER_DAMAGE, "dmg")
    CountMeter(s.sessionID, METER_HEALING, "heal")
    CountMeter(s.sessionID, METER_TAKEN, "taken")
    CountMeterSpells(s.sessionID)
  end
  meterReady = true
  while #pendingFights > 0 do FillFight(table.remove(pendingFights)) end
end

-- My own casts stay readable even where the combat log is closed.
local HEARTHSTONE = 8690

local function OnSpellcast(unit, _, spellID)
  if hasanysecretvalues and hasanysecretvalues(unit, spellID) then return end
  local name = unit == "player" and C_Spell.GetSpellName(spellID)
  if not name then return end
  Add("casts")
  CountIn(C.casts, name, 1, 200)
  if spellID == HEARTHSTONE then Add("hearth") end
end

-- shortcut: "X dies, you gain Y experience" stands in for killing blows, so group kills count, and grey mobs, level cap and
-- instances (chat is hidden there) don't; upgrade to the combat log file if the stat needs to be exact.
local XP_PREFIX = (COMBATLOG_XPGAIN_FIRSTPERSON or ""):match("^(.-)%%d")
local KILL_PATTERN = XP_PREFIX and XP_PREFIX:find("%%s") and FormatToPattern(XP_PREFIX):sub(1, -2)

local function OnXPGain(msg)
  local name = KILL_PATTERN and msg:match(KILL_PATTERN)
  if name then RecordKill(name) end
end

-- The Ledger app reads the combat log file for what addons can't see on Forever, so the game has to write one.
-- Only with the app (App.lua): nothing else would ever read the files. /funstats logging off stops it.
local function StartLogging(retried)
  if not (DM and ns.hasApp and LoggingCombat) or FunStatsDB.logging == false then return end
  local ok, on = pcall(LoggingCombat, true)
  if ok and on == nil and not retried then -- rate limited: the game shares the limit between addons
    C_Timer.After(11, function() StartLogging(true) end)
    return
  end
  if ok and on and not FunStatsDB.loggingNoticed then
    FunStatsDB.loggingNoticed = true
    Print("combat logging is on, so the Ledger app can add crits, biggest hits and more. Only your own totals are uploaded, never the log, and the app deletes logs after 14 days. /funstats logging off stops both.")
  end
end

-- The amounts are secret during combat. pcall: a secret anywhere else shouldn't break recording; the save file keeps the reason.
local function ReadMeter()
  if not DM or not C or UnitAffectingCombat("player") then return end
  local ok, err = pcall(ReadMeterNow)
  if not ok then FunStatsDB.meterError = tostring(err) end
end

---------------------------------------------------------------------------
-- Deaths
---------------------------------------------------------------------------

-- What killed me, from the game's death recap: the damage meter doesn't say.
local function RecapDeath(entry)
  local last
  for _, e in ipairs(C_DeathRecap.GetRecapEvents() or {}) do
    if e.causedDeath then last = e; break end
    if not last or (e.timestamp or 0) > (last.timestamp or 0) then last = e end
  end
  if not last or (hasanysecretvalues and hasanysecretvalues(last.sourceName, last.spellName, last.amount, last.environmentalType)) then return end
  entry.amt = last.amount
  if last.event == "ENVIRONMENTAL_DAMAGE" then
    entry.cause = ENV_CAUSE[last.environmentalType] or "environment"
    Add("deaths_" .. entry.cause)
  else
    entry.cause = last.sourceGUID and last.sourceGUID:find("^Player%-") and "player" or "mob"
    entry.by = not last.hideCaster and last.sourceName or nil
    entry.spell = last.event == "SWING_DAMAGE" and "Melee" or last.spellName
  end
end

local function OnDeath()
  Add("deaths")
  local cause, by, spell, amt = "unknown", nil, nil, nil
  if lastHit and GetTime() - lastHit.t < 15 then
    if lastHit.env then
      cause = lastHit.env
    else
      cause = lastHit.pvp and "player" or "mob"
      by, spell = lastHit.by, lastHit.spell
    end
    amt = lastHit.amt
  end
  if cause ~= "mob" and cause ~= "player" and cause ~= "unknown" then
    Add("deaths_" .. cause)
  end

  local inInstance = IsInInstance()
  local mapID, x, y = MapPosition()
  local cont, cx, cy = OnContinent(mapID, x, y)
  PushCapped(C.deaths, {
    t = time(),
    lvl = UnitLevel("player"),
    zone = GetRealZoneText(),
    sub = GetSubZoneText() ~= "" and GetSubZoneText() or nil,
    inst = inInstance and (GetInstanceInfo()) or nil,
    map = mapID, x = x, y = y, cont = cont, cx = cx, cy = cy,
    cause = cause, by = by, spell = spell, amt = amt,
    grouped = IsInGroup() or nil,
  }, MAX_DEATHS)
  if DM and C_DeathRecap then
    local entry = C.deaths[#C.deaths]
    -- pcall: the recap's fields aren't documented and may be secret inside instances; the death itself is already saved.
    C_Timer.After(1, function() pcall(RecapDeath, entry) end)
  end
  lastHit = nil
  if C.run and not C.run.left then C.run.deaths = C.run.deaths + 1 end

  if C.settings.announce and IsInGroup() then
    local total = #C.deaths
    local why = by and ("to " .. by) or (cause == "fall" and "to gravity") or (cause == "drown" and "by drowning") or ""
    -- pcall: Forever may refuse addon chat inside instances.
    pcall(SendChat, ("[FunStats] %s died %s. Death #%d."):format(playerName, why, total), IsInRaid() and "RAID" or "PARTY")
  end
end

---------------------------------------------------------------------------
-- Money, XP, levels, loot, rolls, chat
---------------------------------------------------------------------------

local function OnMoney()
  local now = GetMoney()
  local diff = now - lastMoney
  if diff > 0 then Add("goldIn", diff) elseif diff < 0 then Add("goldOut", -diff) end
  lastMoney = now
  if now > (C.peakGold or 0) then C.peakGold = now end
  C.gold = now
  Day().gold = now
end

local function OnXP()
  local cur, max = UnitXP("player"), UnitXPMax("player")
  local gained
  if cur >= lastXP then gained = cur - lastXP else gained = (lastXPMax - lastXP) + cur end
  if gained > 0 then Add("xp", gained) end
  lastXP, lastXPMax = cur, max
end

local function OnLevelUp(level)
  C.levels[tostring(level)] = time()
  C.levelPlayed[tostring(level)] = C.playedTotal
  local spot = Spot()
  C.dingAt[tostring(level)] = { zone = spot.zone, cont = spot.cont, cx = spot.cx, cy = spot.cy }
  Add("levels")
  if level > (C.level or 0) then C.level = level end
end

local function RecordLoot(link)
  local q = ItemQuality(link)
  Add("q" .. q)
  if q >= 3 then
    local spot = Spot()
    local bindType = select(14, GetItemInfo(link)) -- 2 = binds when equipped; nil while the item isn't cached yet
    local inInstance = IsInInstance()
    PushCapped(C.notable, { t = time(), q = q, item = link:match("%[(.-)%]"), id = tonumber(link:match("item:(%d+)")),
      boe = bindType == 2 or nil, world = not inInstance or nil, inst = inInstance and (GetInstanceInfo()) or nil,
      zone = spot.zone, cont = spot.cont, cx = spot.cx, cy = spot.cy }, MAX_NOTABLE)
  end
end

local function OnLoot(msg)
  if DM and IsInInstance() then return end -- counted from the loot window there, see below
  local link = msg:match(LOOT_SELF_MULTI) or msg:match(LOOT_SELF)
    or (LOOT_PUSHED_MULTI and msg:match(LOOT_PUSHED_MULTI)) or (LOOT_PUSHED and msg:match(LOOT_PUSHED))
  if link and link:find("|Hitem:") then RecordLoot(link) end
end

-- Forever hides chat from addons inside instances, so what I take from the loot window is counted instead.
-- shortcut: items won by group loot rolls never pass through my loot window and go uncounted; upgrade if the first dungeons show they matter.
local lootWindow = {}

local function OnLootReady()
  wipe(lootWindow)
  if not IsInInstance() then return end
  for slot = 1, GetNumLootItems() do
    local link = GetLootSlotLink(slot)
    if link and not (issecretvalue and issecretvalue(link)) then lootWindow[slot] = link end
  end
end

local function OnLootSlotCleared(slot)
  local link = lootWindow[slot]
  lootWindow[slot] = nil
  if link and link:find("|Hitem:") then RecordLoot(link) end
end

-- Patterns for strings with numbered arguments, like "%1$s has defeated %2$s in a duel".
-- Returns the pattern and the argument number of each capture.
local function PositionalPattern(fmt)
  if not fmt then return nil end
  local order = {}
  local p = fmt:gsub("([%(%)%.%+%-%*%?%[%]%^%$])", "%%%1")
  p = p:gsub("%%(%d)%%%$s", function(n) order[#order + 1] = tonumber(n); return "(.+)" end)
  p = p:gsub("%%s", function() order[#order + 1] = #order + 1; return "(.+)" end)
  return "^" .. p .. "$", order
end

local DUEL_PATTERNS = {}
for _, fmt in ipairs({ DUEL_WINNER_KNOCKOUT, DUEL_WINNER_RETREAT }) do
  local pat, order = PositionalPattern(fmt)
  if pat then DUEL_PATTERNS[#DUEL_PATTERNS + 1] = { pat, order } end
end

local function OnDuel(msg)
  for _, dp in ipairs(DUEL_PATTERNS) do
    local caps = { msg:match(dp[1]) }
    if #caps >= 2 then
      local args = {}
      for i, n in ipairs(dp[2]) do args[n] = caps[i] end
      local winner, loser = args[1], args[2]
      if IsMe(winner) and loser then
        Add("duelsWon")
        C.duels[loser] = C.duels[loser] or { w = 0, l = 0 }
        C.duels[loser].w = C.duels[loser].w + 1
      elseif IsMe(loser) and winner then
        Add("duelsLost")
        C.duels[winner] = C.duels[winner] or { w = 0, l = 0 }
        C.duels[winner].l = C.duels[winner].l + 1
      end
      return true
    end
  end
end

local RESET_PATTERN = FormatToPattern(INSTANCE_RESET_SUCCESS)

local function OnSystem(msg)
  if OnDuel(msg) then return end
  -- The group leader reset the dungeon we just left: going back in is a new run.
  local reset = RESET_PATTERN and msg:match(RESET_PATTERN)
  if reset and C.run and C.run.left and C.run.inst == reset then EndRun() return end
  if not ROLL_PATTERN then return end
  local who, roll, lo, hi = msg:match(ROLL_PATTERN)
  if not IsMe(who) then return end
  roll, lo, hi = tonumber(roll), tonumber(lo), tonumber(hi)
  if lo ~= 1 or hi ~= 100 then return end
  Add("rolls")
  Add("rollSum", roll)
  if roll == 100 then Add("roll100") end
  if roll == 1 then Add("roll1") end
  C.best.rollHi = math.max(C.best.rollHi or 0, roll)
  C.best.rollLo = math.min(C.best.rollLo or 101, roll)
end

local WORDS = {
  sorry = { "sorry", "sry", "my bad", "mb" },
  lol = { "lol", "lmao", "haha", "rofl" },
  oops = { "oops", "whoops", "oh no" },
}

local function OnChat(msg, author, ...)
  if not FromMe(author, (select(10, ...))) then return end
  Add("msgs")
  local text = " " .. msg:lower() .. " "
  for field, list in pairs(WORDS) do
    for _, w in ipairs(list) do
      for _ in text:gmatch("%f[%w]" .. w .. "%f[%W]") do Add(field) end
    end
  end
end

---------------------------------------------------------------------------
-- Character sheet: equipped gear, talent points, professions
---------------------------------------------------------------------------

-- Gear is keyed "s1".."s19" (inventory slot ids) so it never turns into a list.
local function SnapshotGear(retries)
  if not C then return end
  local gear, missing = {}, false
  for slot = 1, 19 do
    local link = GetInventoryItemLink("player", slot)
    if link then
      local _, _, quality, ilvl = GetItemInfo(link)
      if not ilvl then missing = true end
      gear["s" .. slot] = {
        id = tonumber(link:match("item:(%d+)")),
        n = link:match("%[(.-)%]"),
        q = quality or ItemQuality(link),
        il = ilvl,
      }
    end
  end
  C.gear = gear
  C.gearAt = time()
  -- Item info can arrive late from the server; try again a few times.
  retries = retries or 0
  if missing and retries < 5 then
    C_Timer.After(5, function() SnapshotGear(retries + 1) end)
  end
end

-- WoW Forever keeps the classic talent trees in the game's trait system: one trait tree per class, the three
-- specs side by side. Saved as the tree and "node:rank" pairs; the website draws the trees from Forever's game data.
local function ReadTraits()
  local SI = C_SpecializationInfo
  local configID = SI.GetCombatConfigIDForSpecGroup(SI.GetActiveSpecGroup and SI.GetActiveSpecGroup() or 1)
  local config = configID and C_Traits.GetConfigInfo(configID)
  local treeID = config and config.treeIDs and config.treeIDs[1]
  if not treeID then return nil end
  local picks = {}
  for _, nodeID in ipairs(C_Traits.GetTreeNodes(treeID) or {}) do
    local node = C_Traits.GetNodeInfo(configID, nodeID)
    local rank = node and node.ranksPurchased or 0
    if hasanysecretvalues and hasanysecretvalues(rank) then return nil end
    if rank > 0 then picks[#picks + 1] = nodeID .. ":" .. rank end
  end
  return { tree = treeID, r = table.concat(picks, " ") }
end

local function SnapshotTalents()
  if not C then return end
  if C_Traits and C_SpecializationInfo and C_SpecializationInfo.GetCombatConfigIDForSpecGroup then
    -- pcall: an unreadable tree (secret inside instances) keeps the last good snapshot.
    local ok, traits = pcall(ReadTraits)
    if ok and traits then
      C.traits, C.talents, C.spec = traits, nil, nil
      return
    end
  end
  -- Mists of Pandaria and later: a specialization instead of talent trees.
  if MODERN and GetSpecialization and GetSpecializationInfo then
    local index = GetSpecialization()
    local _, name = GetSpecializationInfo(index or 0)
    -- Before choosing a specialization the game names it after the class: "Hunter Hunter".
    C.spec = index and name ~= UnitClass("player") and name or nil
    C.talents = nil
    return
  end
  if not GetNumTalentTabs then return end
  local tabs = {}
  for tab = 1, GetNumTalentTabs() do
    -- Classic Era returns name, icon, pointsSpent; later clients return id, name, description, icon, pointsSpent.
    local a, b, c, _, e = GetTalentTabInfo(tab)
    local name = type(a) == "string" and a or b
    local points = (type(c) == "number" and c) or (type(e) == "number" and e) or 0
    tabs[#tabs + 1] = { n = name, p = points }
  end
  C.talents = tabs
end

local PROFESSION_HEADERS = {
  [TRADE_SKILLS or "Professions"] = true, ["Professions"] = true,
  [SECONDARY_SKILLS or "Secondary Skills"] = true, ["Secondary Skills"] = true,
}

local function SnapshotProfessions()
  if not C then return end
  -- Cataclysm and later list professions with GetProfessions instead of the skill lines.
  if MODERN and GetProfessions and GetProfessionInfo then
    local out = {}
    for _, index in pairs({ GetProfessions() }) do
      local name, _, rank, maxRank = GetProfessionInfo(index)
      if name then out[#out + 1] = { n = name, r = rank, m = maxRank } end
    end
    if #out > 0 then C.professions = out; return end
  end
  if not GetNumSkillLines then return end
  local out, section = {}, nil
  for i = 1, GetNumSkillLines() do
    local name, isHeader, _, rank, _, _, maxRank = GetSkillLineInfo(i)
    if isHeader then
      section = name
    elseif name and section and PROFESSION_HEADERS[section] then
      out[#out + 1] = { n = name, r = rank, m = maxRank }
    end
  end
  if #out > 0 then C.professions = out end
end

local function SnapshotSheet()
  SnapshotGear()
  SnapshotTalents()
  SnapshotProfessions()
end

---------------------------------------------------------------------------
-- Once-per-second sampling: time, distance, states
---------------------------------------------------------------------------

local function Tick()
  if not C then return end
  Add("played")
  C.playedTotal = C.playedTotal + 1
  local hk = date("%w") .. "-" .. tonumber(date("%H"))
  C.heat[hk] = (C.heat[hk] or 0) + 1
  local zone = GetRealZoneText()
  if zone and zone ~= "" then CountIn(C.zones, zone, 1, 150) end
  if UnitIsDeadOrGhost("player") then Add("ghost") end
  if UnitIsAFK("player") then Add("afk") end
  if UnitAffectingCombat("player") then Add("combat") end
  if IsSwimming() then Add("swim") end
  GroupTick()
  RunTick()

  if UnitOnTaxi("player") then
    Add("taxi")
    lastX = nil
    return
  end
  local y, x, _, inst = UnitPosition("player")
  if x and lastX and inst == lastInst then
    local dist = math.sqrt((x - lastX) ^ 2 + (y - lastY) ^ 2)
    if dist > 0.5 and dist < 40 then Add("dist", dist) end
  end
  lastX, lastY, lastInst = x, y, inst
end

---------------------------------------------------------------------------
-- Events
---------------------------------------------------------------------------

local handlers = {}
local loginTime = 0

function handlers.PLAYER_LOGIN()
  loginTime = GetTime()
  InitCharacter()
  C_Timer.NewTicker(1, Tick)
  C_Timer.After(5, SnapshotSheet)
  C_Timer.After(5, ReadMeter)
  C_Timer.After(3, StartLogging)
  -- Ask the server for the guild roster now and then; GUILD_ROSTER_UPDATE then records it.
  local function RequestRoster()
    if not IsInGuild() then return end
    if C_GuildInfo and C_GuildInfo.GuildRoster then C_GuildInfo.GuildRoster() elseif GuildRoster then GuildRoster() end
  end
  C_Timer.After(12, RequestRoster)
  -- By now guild info has loaded, so a character that left its guild while offline loses it.
  C_Timer.After(30, function() UpdateGuild(true) end)
  C_Timer.NewTicker(900, RequestRoster)
  hooksecurefunc("JumpOrAscendStart", function()
    if C and not IsFalling() then Add("jumps") end
  end)
  if RepairAllItems then
    hooksecurefunc("RepairAllItems", function(guild)
      local cost = GetRepairAllCost()
      if cost and cost > 0 and not guild then Add("repair", cost) end
    end)
  end
  Print("recording " .. playerName .. ". Nothing to set up; /funstats shows today's numbers and the options.")
end

function handlers.PLAYER_LOGOUT()
  if C then
    ReadMeter()
    UpdateProfile() -- gold stays as PLAYER_MONEY left it: the game reports 0 while logging out
  end
end

if CombatLogInfo then handlers.COMBAT_LOG_EVENT_UNFILTERED = OnCombatLog end
if DM then
  function handlers.PLAYER_REGEN_ENABLED() C_Timer.After(1, ReadMeter) end
  function handlers.DAMAGE_METER_RESET() wipe(meterSeen) end
  handlers.LOOT_READY = OnLootReady
  handlers.LOOT_SLOT_CLEARED = OnLootSlotCleared
  handlers.CHAT_MSG_COMBAT_XP_GAIN = OnXPGain
end
handlers.PLAYER_DEAD = OnDeath
handlers.PLAYER_MONEY = OnMoney
handlers.PLAYER_XP_UPDATE = OnXP
handlers.PLAYER_LEVEL_UP = OnLevelUp
handlers.CHAT_MSG_LOOT = OnLoot
handlers.CHAT_MSG_SYSTEM = OnSystem
handlers.ZONE_CHANGED_NEW_AREA = OnZone
handlers.PLAYER_ENTERING_WORLD = OnZone
handlers.ENCOUNTER_START = OnEncounterStart
handlers.ENCOUNTER_END = OnEncounterEnd

local sheetPending = false
local function SheetSoon()
  if sheetPending then return end
  sheetPending = true
  C_Timer.After(2, function() sheetPending = false; SnapshotSheet() end)
end
-- Guild roster: every member's name, level and class, so the whole guild shows on the website,
-- including members without the addon. Stored with the observed players.
local lastRosterScan = 0
local function ScanGuild()
  if not C or not IsInGuild() then return end
  local guild = GetGuildInfo("player")
  local n = GetNumGuildMembers and GetNumGuildMembers() or 0
  if not guild or n == 0 then return end
  C.guild = guild
  if GetTime() - lastRosterScan < 60 then return end
  lastRosterScan = GetTime()
  local now, game, myRealm = time(), GameInfo(), GetRealmName()
  local present = {}
  for i = 1, math.min(n, 1000) do
    local full, _, _, level, _, _, _, _, online, _, classToken = GetGuildRosterInfo(i)
    if full then
      local base, realm = SplitName(full)
      local key = base .. "-" .. realm
      present[key] = true
      if not FunStatsDB.chars[key] then
        local O = Observed(key)
        local seen = now
        if not online and GetGuildRosterLastOnline then
          local y, m, d, hr = GetGuildRosterLastOnline(i)
          seen = now - ((((y or 0) * 365 + (m or 0) * 30 + (d or 0)) * 24 + (hr or 0)) * 3600)
        end
        O.name, O.realm, O.guild, O.roster, O.game = base, realm, guild, true, game
        O.class = classToken or O.class
        if level and level > 0 and (seen >= (O.lastSeen or 0) or not O.level) then O.level = level end
        if seen > (O.lastSeen or 0) then O.lastSeen = seen end
      end
    end
  end
  -- Members who left the guild no longer belong to it.
  for key, O in pairs(FunStatsDB.observed) do
    if O.roster and O.guild == guild and O.realm == myRealm and not present[key] then O.guild = nil end
  end
end

-- Guild info often arrives a few seconds after login; keep the character's guild current.
function handlers.PLAYER_GUILD_UPDATE()
  UpdateGuild(GetTime() - loginTime > 30)
end
function handlers.GUILD_ROSTER_UPDATE()
  UpdateGuild()
  ScanGuild()
  wipe(friendByGUID) -- someone may have joined or left: look them up again
end
function handlers.FRIENDLIST_UPDATE()
  wipe(friendByGUID)
end
handlers.PLAYER_EQUIPMENT_CHANGED = SheetSoon
handlers.CHARACTER_POINTS_CHANGED = SheetSoon
handlers.SKILL_LINES_CHANGED = SheetSoon
handlers.PLAYER_SPECIALIZATION_CHANGED = SheetSoon
handlers.TRAIT_CONFIG_UPDATED = SheetSoon

function handlers.QUEST_TURNED_IN()
  Add("quests")
end

function handlers.CHAT_MSG_TEXT_EMOTE(_, author, ...)
  if FromMe(author, (select(10, ...))) then Add("emotes") end
end

for _, ev in ipairs({
  "CHAT_MSG_SAY", "CHAT_MSG_YELL", "CHAT_MSG_PARTY", "CHAT_MSG_PARTY_LEADER",
  "CHAT_MSG_RAID", "CHAT_MSG_RAID_LEADER", "CHAT_MSG_GUILD", "CHAT_MSG_WHISPER_INFORM",
}) do
  handlers[ev] = OnChat
end

frame:SetScript("OnEvent", function(_, event, ...)
  if event ~= "PLAYER_LOGIN" and not C then return end
  -- shortcut: Forever hides chat from addons inside instances, so loot and chat there go uncounted; upgrade if a loot API can replace it.
  if event:find("^CHAT_MSG_") and hasanysecretvalues and hasanysecretvalues(...) then return end
  -- pcall: one event failing on the live client shouldn't stop the rest. The save file keeps the reason for bug reports.
  local ok, err = pcall(handlers[event], ...)
  if not ok then
    FunStatsDB = FunStatsDB or {}
    FunStatsDB.errors = FunStatsDB.errors or {}
    FunStatsDB.errors[event] = tostring(err):sub(1, 300)
  end
end)
-- pcall: not every event exists in every client (specializations arrived with Mists of Pandaria).
for event in pairs(handlers) do pcall(frame.RegisterEvent, frame, event) end
-- Only my own casts, not every unit's nearby.
if DM then
  handlers.UNIT_SPELLCAST_SUCCEEDED = OnSpellcast
  frame:RegisterUnitEvent("UNIT_SPELLCAST_SUCCEEDED", "player")
end

---------------------------------------------------------------------------
-- Slash command
---------------------------------------------------------------------------

local function Gold(copper)
  copper = copper or 0
  return ("%dg %ds %dc"):format(copper / 10000, (copper / 100) % 100, copper % 100)
end

local function AddFriend(name)
  local base = SplitName(name)
  if not base or base == "" or base:lower() == playerName:lower() then return end
  FunStatsDB.friends[base:lower()] = base
  wipe(friendByGUID)
  Print("now tracking " .. base .. " whenever you see them in combat.")
end

local function GroupNames()
  local names = {}
  if not IsInGroup() then return names end
  local prefix, count = "party", GetNumGroupMembers() - 1
  if IsInRaid() then prefix, count = "raid", GetNumGroupMembers() end
  for i = 1, count do
    local unit = prefix .. i
    if not UnitIsUnit(unit, "player") then names[#names + 1] = (FullName(unit)) end
  end
  return names
end

local function FriendCommand(cmd, rest)
  if cmd == "add" then
    if rest == "group" then
      local names = GroupNames()
      if #names == 0 then Print("you're not in a group.") end
      for _, n in ipairs(names) do AddFriend(n) end
    elseif rest ~= "" then
      AddFriend(rest)
    elseif UnitIsPlayer("target") and not UnitIsUnit("target", "player") then
      AddFriend((FullName("target")))
    else
      Print("usage: /funstats add Name, /funstats add group, or target a player and type /funstats add")
    end
  elseif cmd == "remove" then
    local base = SplitName(rest)
    if base and FunStatsDB.friends[base:lower()] then
      FunStatsDB.friends[base:lower()] = nil
      wipe(friendByGUID)
      Print("stopped tracking " .. base .. ". Their stats so far are kept.")
    else
      Print("no friend called " .. rest .. ". Type /funstats friends to see the list.")
    end
  else
    local list = {}
    for _, display in pairs(FunStatsDB.friends) do list[#list + 1] = display end
    table.sort(list)
    Print(#list > 0 and ("tracking " .. table.concat(list, ", ")) or "nobody added by hand. Guild mates and WoW friends are tracked automatically.")
  end
end

SLASH_FUNSTATS1 = "/funstats"
SlashCmdList.FUNSTATS = function(input)
  if not C then return end
  input = strtrim(input or "")
  local cmd, rest = input:match("^(%S*)%s*(.-)$")
  cmd = (cmd or ""):lower()
  if cmd == "add" or cmd == "remove" or cmd == "friends" then
    FriendCommand(cmd, rest)
    return
  end
  if cmd == "sync" then
    Print(ns.SyncStatus and ns.SyncStatus() or "sync isn't running.")
    return
  end
  if cmd == "bosses" then
    local list = {}
    for _, b in pairs(C.bosses) do list[#list + 1] = b end
    table.sort(list, function(a, b) return (a.last or a.first or 0) > (b.last or b.first or 0) end)
    if #list == 0 then Print("no boss fights recorded yet.") end
    for i = 1, math.min(8, #list) do
      local b = list[i]
      Print(("%s (%s): %d kills, %d wipes%s"):format(b.n or "?", b.inst or "?", b.kills, b.wipes,
        b.fast and (", fastest " .. b.fast .. "s, best " .. (b.dps or 0) .. " DPS") or ""))
    end
    local r = C.run
    if r then Print(("this run: %s, %d bosses, %d wipes, %d deaths"):format(r.inst, r.bosses, r.wipes, r.deaths)) end
    return
  end
  if cmd == "logging" then
    if rest == "off" or rest == "on" then
      FunStatsDB.logging = rest == "on"
      if LoggingCombat then pcall(LoggingCombat, rest == "on") end
    end
    Print("combat logging for the Ledger app is " .. (FunStatsDB.logging == false and "off" or "on") .. ". /funstats logging on or off changes it.")
    return
  end
  if cmd == "announce" then
    C.settings.announce = not C.settings.announce
    Print("death announcements in group chat are now " .. (C.settings.announce and "ON" or "OFF"))
    return
  end
  if cmd ~= "" then Print("unknown command '" .. cmd .. "'.") end
  local d = Day()
  Print(("Today: %d damage, %d healing, %d deaths, %d killing blows, %d jumps, earned %s"):format(
    d.dmg or 0, d.heal or 0, d.deaths or 0, d.kb or 0, d.jumps or 0, Gold(d.goldIn)))
  Print("Everything is automatic: stats save when you log out, the Ledger app uploads them, and guild mates and friends are tracked too.")
  Print("Optional: |cffffd100/funstats bosses|r boss kills and this run, |cffffd100/funstats sync|r stats received from others, "
    .. "|cffffd100/funstats announce|r deaths in group chat (" .. (C.settings.announce and "on" or "off") .. "), "
    .. "|cffffd100/funstats add Name|r track someone else, |cffffd100/funstats friends|r list them.")
end
