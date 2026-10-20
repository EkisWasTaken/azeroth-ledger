-- FunStats sync: shares each player's own stats with other FunStats players
-- in the party, raid or guild, so every player's SavedVariables ends up holding
-- the whole group's stats. Only one person then needs to publish to the website.
--
-- Protocol (addon messages, prefix "FunStats1"):
--   h  hello     broadcast: for each of my characters, my newest day and its played seconds
--   r  request   whisper:   "send me character X from day S onwards"
--   m  meta      whisper:   character profile, records and all-time tables
--   d  day       whisper:   one day's numbers plus that day's deaths and notable loot
-- Messages are encoded as JSON and split into chunks of "id:index:total:body".

local ADDON_NAME, ns = ...

local PREFIX = "FunStats1"
local CHUNK = 220
local HELLO_INTERVAL = 600
local MAX_QUEUE = 1500

---------------------------------------------------------------------------
-- JSON encode / decode (decoding never runs code)
---------------------------------------------------------------------------

local function EncodeString(s)
  return '"' .. (s:gsub('[%c"\\|]', function(c) return string.format("\\u%04x", c:byte()) end)) .. '"'
end

local function Encode(v, depth)
  depth = depth or 0
  if depth > 12 then return "null" end
  local t = type(v)
  if t == "number" then
    if v ~= v or v == math.huge or v == -math.huge then return "0" end
    if v == math.floor(v) and math.abs(v) < 1e15 then return string.format("%.0f", v) end
    return string.format("%.6g", v)
  elseif t == "string" then
    return EncodeString(v)
  elseif t == "boolean" then
    return v and "true" or "false"
  elseif t == "table" then
    local count = 0
    for _ in pairs(v) do count = count + 1 end
    local parts = {}
    if count > 0 and count == #v then
      for i = 1, #v do parts[i] = Encode(v[i], depth + 1) end
      return "[" .. table.concat(parts, ",") .. "]"
    end
    for k, val in pairs(v) do
      local tk, tv = type(k), type(val)
      if (tk == "string" or tk == "number") and (tv == "number" or tv == "string" or tv == "boolean" or tv == "table") then
        parts[#parts + 1] = EncodeString(tostring(k)) .. ":" .. Encode(val, depth + 1)
      end
    end
    return "{" .. table.concat(parts, ",") .. "}"
  end
  return "null"
end

local function Decode(s)
  local pos, len, depth = 1, #s, 0
  local value

  local function ws()
    pos = s:find("[^ \t\r\n]", pos) or (len + 1)
  end

  local function str()
    pos = pos + 1
    local out = {}
    while true do
      local c = s:sub(pos, pos)
      if c == "" then error("unfinished text") end
      if c == '"' then pos = pos + 1; break end
      if c == "\\" then
        local e = s:sub(pos + 1, pos + 1)
        if e == "u" then
          local code = tonumber(s:sub(pos + 2, pos + 5), 16)
          if not code or code > 255 then error("bad escape") end
          out[#out + 1] = string.char(code)
          pos = pos + 6
        else
          out[#out + 1] = (e == "n" and "\n") or e
          pos = pos + 2
        end
      else
        local j = s:find('["\\]', pos) or (len + 1)
        out[#out + 1] = s:sub(pos, j - 1)
        pos = j
      end
    end
    return table.concat(out)
  end

  function value()
    ws()
    local c = s:sub(pos, pos)
    if c == "{" or c == "[" then
      depth = depth + 1
      if depth > 14 then error("too deep") end
      local close = c == "{" and "}" or "]"
      local t = {}
      pos = pos + 1
      ws()
      if s:sub(pos, pos) == close then
        pos = pos + 1
      else
        while true do
          if c == "{" then
            ws()
            if s:sub(pos, pos) ~= '"' then error("expected key") end
            local k = str()
            ws()
            if s:sub(pos, pos) ~= ":" then error("expected colon") end
            pos = pos + 1
            t[k] = value()
          else
            local v = value()
            if v ~= nil then t[#t + 1] = v end
          end
          ws()
          local d = s:sub(pos, pos)
          pos = pos + 1
          if d == close then break end
          if d ~= "," then error("expected comma") end
        end
      end
      depth = depth - 1
      return t
    elseif c == '"' then
      return str()
    elseif s:sub(pos, pos + 3) == "true" then
      pos = pos + 4; return true
    elseif s:sub(pos, pos + 4) == "false" then
      pos = pos + 5; return false
    elseif s:sub(pos, pos + 3) == "null" then
      pos = pos + 4; return nil
    end
    local num = s:match("^-?%d+%.?%d*[eE]?[-+]?%d*", pos)
    local n = num and tonumber(num)
    if not n then error("expected value") end
    pos = pos + #num
    return n
  end

  local ok, result = pcall(value)
  if ok then return result end
end

ns.Encode, ns.Decode = Encode, Decode

---------------------------------------------------------------------------
-- Sending, with a gentle rate limit (about one message per second after a burst)
---------------------------------------------------------------------------

local queue, qHead, qTail = {}, 1, 0
local tokens, lastRefill = 8, 0
local msgSeq = 0

local function Pump()
  local now = GetTime()
  tokens = math.min(8, tokens + (now - lastRefill))
  lastRefill = now
  while tokens >= 1 and qHead <= qTail do
    local m = queue[qHead]
    queue[qHead] = nil
    qHead = qHead + 1
    C_ChatInfo.SendAddonMessage(PREFIX, m[1], m[2], m[3])
    tokens = tokens - 1
  end
end

local function Send(t, channel, target)
  local body = Encode(t)
  local total = math.ceil(#body / CHUNK)
  if total > 400 or (qTail - qHead + 1) + total > MAX_QUEUE then return false end
  msgSeq = (msgSeq % 4095) + 1
  local id = string.format("%x", msgSeq)
  for i = 1, total do
    qTail = qTail + 1
    queue[qTail] = { id .. ":" .. i .. ":" .. total .. ":" .. body:sub((i - 1) * CHUNK + 1, i * CHUNK), channel, target }
  end
  return true
end

local function Broadcast(t)
  if IsInRaid() then Send(t, "RAID") elseif IsInGroup() then Send(t, "PARTY") end
  if IsInGuild() then Send(t, "GUILD") end
end

---------------------------------------------------------------------------
-- Helpers over the saved data
---------------------------------------------------------------------------

local function OwnChars()
  return (FunStatsDB and FunStatsDB.chars) or {}
end

local function LatestDay(days)
  local best
  for k in pairs(days or {}) do
    if type(k) == "string" and (not best or k > best) then best = k end
  end
  return best
end

local function Top(map, n)
  local arr = {}
  for k, v in pairs(map or {}) do
    if type(v) == "number" then arr[#arr + 1] = { k, v } end
  end
  table.sort(arr, function(a, b) return a[2] > b[2] end)
  local out = {}
  for i = 1, math.min(n, #arr) do out[arr[i][1]] = arr[i][2] end
  return out
end

local PROFILE = {
  "name", "realm", "class", "race", "faction", "level", "guild", "lastSeen", "firstSeen",
  "peakGold", "gold", "playedTotal",
}

local function Meta(ch)
  local m = {}
  for _, f in ipairs(PROFILE) do m[f] = ch[f] end
  m.owner = FunStatsDB.id
  m.best, m.levels, m.levelPlayed = ch.best, ch.levels, ch.levelPlayed
  m.heat, m.duels, m.instances = ch.heat, ch.duels, ch.instances
  m.gear, m.gearAt, m.talents, m.professions = ch.gear, ch.gearAt, ch.talents, ch.professions
  m.game = ch.game
  m.kills = Top(ch.kills, 40)
  m.spellDmg = Top(ch.spellDmg, 30)
  m.casts = Top(ch.casts, 30)
  m.zones = Top(ch.zones, 30)
  m.healers = Top(ch.healers, 20)
  return m
end

local function OnDay(list, day)
  local out = {}
  for _, d in ipairs(list or {}) do
    if type(d) == "table" and d.t and date("%Y-%m-%d", d.t) == day then out[#out + 1] = d end
  end
  return out
end

local function ValidKey(key)
  return type(key) == "string" and #key < 80 and key:find("^[^%-]+%-.+$") and not OwnChars()[key]
end

local function Replica(key)
  local rep = FunStatsDB.synced[key]
  if not rep then
    rep = { days = {}, deaths = {}, notable = {} }
    FunStatsDB.synced[key] = rep
  end
  rep.days = rep.days or {}
  rep.deaths = rep.deaths or {}
  rep.notable = rep.notable or {}
  return rep
end

-- Add entries we don't have yet (matched by timestamp + text), keeping the list sorted and capped.
local function MergeEvents(list, incoming, cap)
  local seen = {}
  for _, e in ipairs(list) do
    if type(e) == "table" then seen[tostring(e.t) .. (e.by or e.item or e.cause or "")] = true end
  end
  for _, e in ipairs(incoming) do
    if type(e) == "table" and tonumber(e.t) then
      local id = tostring(e.t) .. (e.by or e.item or e.cause or "")
      if not seen[id] then
        seen[id] = true
        list[#list + 1] = e
      end
    end
  end
  table.sort(list, function(a, b) return (tonumber(a.t) or 0) < (tonumber(b.t) or 0) end)
  while #list > cap do table.remove(list, 1) end
end

---------------------------------------------------------------------------
-- Protocol
---------------------------------------------------------------------------

local function SendHello()
  if not FunStatsDB or not FunStatsDB.chars then return end
  local c = {}
  for key, ch in pairs(OwnChars()) do
    local d = LatestDay(ch.days)
    if d then c[key] = { d = d, p = ch.days[d].played or 0 } end
  end
  if next(c) then Broadcast({ k = "h", o = FunStatsDB.id, c = c }) end
end

local function OnHello(msg, sender)
  if type(msg.c) ~= "table" then return end
  for key, info in pairs(msg.c) do
    if ValidKey(key) and type(info) == "table" and type(info.d) == "string" then
      local rep = FunStatsDB.synced[key]
      local have = rep and rep.days and rep.days[info.d]
      if not have or (have.played or 0) < (tonumber(info.p) or 0) then
        Send({ k = "r", c = key, s = (rep and LatestDay(rep.days)) or "" }, "WHISPER", sender)
      end
    end
  end
end

local served = {}

local function OnRequest(msg, sender)
  local key = msg.c
  local ch = type(key) == "string" and OwnChars()[key]
  if not ch then return end
  local tag = sender .. "|" .. key
  if served[tag] and GetTime() - served[tag] < 60 then return end
  served[tag] = GetTime()

  if not Send({ k = "m", c = key, v = Meta(ch) }, "WHISPER", sender) then return end
  local since = type(msg.s) == "string" and msg.s or ""
  local days = {}
  for day in pairs(ch.days or {}) do
    if type(day) == "string" and day >= since then days[#days + 1] = day end
  end
  table.sort(days)
  for _, day in ipairs(days) do
    local ok = Send({
      k = "d", c = key, d = day, v = ch.days[day],
      x = OnDay(ch.deaths, day), n = OnDay(ch.notable, day),
    }, "WHISPER", sender)
    if not ok then break end -- queue full; the rest follows on the next hello
  end
end

local function OnMeta(msg)
  if not ValidKey(msg.c) or type(msg.v) ~= "table" then return end
  local rep = Replica(msg.c)
  for k, v in pairs(msg.v) do
    if k ~= "days" and k ~= "deaths" and k ~= "notable" then rep[k] = v end
  end
  rep.syncedAt = time()
end

local function OnDayMessage(msg)
  if not ValidKey(msg.c) or type(msg.d) ~= "string" or not msg.d:find("^%d%d%d%d%-%d%d%-%d%d$") then return end
  if type(msg.v) ~= "table" then return end
  local clean = {}
  for k, v in pairs(msg.v) do
    if type(k) == "string" and (type(v) == "number" or (type(v) == "string" and #v < 100)) then clean[k] = v end
  end
  local rep = Replica(msg.c)
  rep.days[msg.d] = clean
  if type(msg.x) == "table" then MergeEvents(rep.deaths, msg.x, 300) end
  if type(msg.n) == "table" then MergeEvents(rep.notable, msg.n, 200) end
  rep.syncedAt = time()
end

---------------------------------------------------------------------------
-- Receiving
---------------------------------------------------------------------------

local buffers = {}

local function OnAddonMessage(prefix, text, channel, sender)
  if prefix ~= PREFIX or not FunStatsDB or not FunStatsDB.synced or not sender then return end
  if Ambiguate(sender, "none") == UnitName("player") then return end
  local id, i, n, body = text:match("^(%x+):(%d+):(%d+):(.*)$")
  i, n = tonumber(i), tonumber(n)
  if not id or not i or not n or n < 1 or n > 400 or i < 1 or i > n then return end

  local bkey = sender .. ":" .. id
  local buf = buffers[bkey]
  if not buf or buf.n ~= n then
    buf = { n = n, got = 0, parts = {}, t = GetTime() }
    buffers[bkey] = buf
  end
  if not buf.parts[i] then
    buf.parts[i] = body
    buf.got = buf.got + 1
  end
  if buf.got < n then return end
  buffers[bkey] = nil

  local msg = Decode(table.concat(buf.parts))
  if type(msg) ~= "table" then return end
  if msg.k == "h" then OnHello(msg, sender)
  elseif msg.k == "r" then OnRequest(msg, sender)
  elseif msg.k == "m" then OnMeta(msg)
  elseif msg.k == "d" then OnDayMessage(msg) end
end

local function Cleanup()
  local now = GetTime()
  for k, buf in pairs(buffers) do
    if now - buf.t > 180 then buffers[k] = nil end
  end
  for k, t in pairs(served) do
    if now - t > 120 then served[k] = nil end
  end
end

---------------------------------------------------------------------------
-- Wiring
---------------------------------------------------------------------------

function ns.SyncStatus()
  local names, count = {}, 0
  for key, rep in pairs(FunStatsDB.synced or {}) do
    count = count + 1
    local days = 0
    for _ in pairs(rep.days or {}) do days = days + 1 end
    names[#names + 1] = ("%s (%d days%s)"):format(key:match("^[^%-]+") or key, days,
      rep.syncedAt and (", updated " .. date("%b %d %H:%M", rep.syncedAt)) or "")
  end
  table.sort(names)
  if count == 0 then
    return "no stats received yet. Group up with a friend who has FunStats; syncing starts within a minute."
  end
  local pending = qTail - qHead + 1
  return ("holding stats for %d character%s: %s.%s"):format(count, count == 1 and "" or "s",
    table.concat(names, ", "), pending > 0 and (" Sending " .. pending .. " messages.") or "")
end

C_ChatInfo.RegisterAddonMessagePrefix(PREFIX)

local frame = CreateFrame("Frame")
local helloPending = false

local function HelloSoon(delay)
  if helloPending then return end
  helloPending = true
  C_Timer.After(delay, function()
    helloPending = false
    SendHello()
  end)
end

frame:SetScript("OnEvent", function(_, event, ...)
  if event == "CHAT_MSG_ADDON" then
    OnAddonMessage(...)
  elseif event == "PLAYER_LOGIN" then
    lastRefill = GetTime()
    C_Timer.NewTicker(0.25, Pump)
    C_Timer.NewTicker(60, Cleanup)
    C_Timer.NewTicker(HELLO_INTERVAL, function()
      if IsInGroup() or IsInGuild() then SendHello() end
    end)
    HelloSoon(15)
  elseif event == "GROUP_ROSTER_UPDATE" then
    if IsInGroup() then HelloSoon(6) end
  end
end)
frame:RegisterEvent("CHAT_MSG_ADDON")
frame:RegisterEvent("PLAYER_LOGIN")
frame:RegisterEvent("GROUP_ROSTER_UPDATE")
