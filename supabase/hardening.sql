-- Azeroth Ledger: hardening and moderation. Run once in Supabase > SQL Editor, after
-- public-uploads.sql and armory.sql. Safe to run again.
--
-- What it adds:
--   * Copies of other players' stats (kind 'relay') and observations ('obs') can no longer claim to be
--     from the future, so a made-up copy can't outrank the real one forever.
--   * Each upload code can store at most 400 copies and observations.
--   * The character name always matches the character key, so nobody can dress up "Ekossan2" as "Ekossan".
--   * Moderation: hide a character from the site, release a character, block an upload code.
--   * A lighter way for the site to read the ledger: the map data that every character carries
--     ('atlas', identical for everyone on a client) is read once per realm instead of once per character.
--
-- Moderation, from the SQL Editor:
--   insert into hidden (char_key, reason) values ('Name-Realm', 'why');  -- hide from the site
--   delete from hidden where char_key = 'Name-Realm';                    -- show again
--   select release_character('Name-Realm');  -- lost upload code or squatted name: frees it for the next upload
--   select block_uploader('Name-Realm');     -- blocks the code that claimed it, and removes everything it uploaded
--   select block_uploader('r:0123456789abcdef:Name-Realm');  -- the same, by the id of a copy it uploaded

-- 1. characters hidden from the site (readable by everyone, so the site can leave them out)
create table if not exists public.hidden (
  char_key   text primary key,
  reason     text,
  created_at timestamptz not null default now()
);
alter table public.hidden enable row level security;
grant select on public.hidden to anon, authenticated;
drop policy if exists "Hidden list is readable by everyone" on public.hidden;
create policy "Hidden list is readable by everyone"
  on public.hidden for select
  to anon, authenticated
  using (true);

-- 2. upload codes that may no longer upload (by the first 16 characters of the code's hash; not readable by the public key)
create table if not exists public.blocked_uploaders (
  hash_prefix text primary key,
  reason      text,
  created_at  timestamptz not null default now()
);
alter table public.blocked_uploaders enable row level security;

-- 3. the upload function, with the new checks
create or replace function public.upload_ledger(p_secret text, p_rows jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  r jsonb;
  v_data jsonb;
  v_hash text;
  v_prefix text;
  v_kind text;
  v_key text;
  v_id text;
  v_owner text;
  v_seen numeric;
  v_now bigint := extract(epoch from now())::bigint;
  n_extra int;
  n_saved int := 0;
  n_skipped int := 0;
begin
  if p_secret is null or length(p_secret) < 16 or length(p_secret) > 200 then
    raise exception 'missing or invalid upload code';
  end if;
  if jsonb_typeof(p_rows) is distinct from 'array' or jsonb_array_length(p_rows) > 60 then
    raise exception 'expected a list of at most 60 rows';
  end if;
  if octet_length(p_rows::text) > 4000000 then
    raise exception 'upload too large';
  end if;

  v_hash := encode(digest(p_secret, 'sha256'), 'hex');
  v_prefix := left(v_hash, 16);
  if exists (select 1 from blocked_uploaders where hash_prefix = v_prefix) then
    raise exception 'this upload code is blocked';
  end if;

  -- copies and observations this code has stored so far
  select count(*) into n_extra from entries
  where left(id, 19) in ('r:' || v_prefix || ':', 'o:' || v_prefix || ':');

  for r in select value from jsonb_array_elements(p_rows) loop
    v_kind := r->>'kind';
    v_key := r->>'char_key';
    v_data := r->'data';
    if v_key is null or length(v_key) > 80 or v_key !~ '^[^-]+-.+$' or jsonb_typeof(v_data) is distinct from 'object' then
      n_skipped := n_skipped + 1;
      continue;
    end if;
    -- the name shown on the site is always the one in the key
    v_data := v_data || jsonb_build_object('key', v_key, 'name', split_part(v_key, '-', 1));

    if v_kind = 'char' then
      insert into claims (char_key, secret_hash) values (v_key, v_hash) on conflict (char_key) do nothing;
      select secret_hash into v_owner from claims where char_key = v_key;
      if v_owner is distinct from v_hash then
        n_skipped := n_skipped + 1;   -- someone else's character
        continue;
      end if;
      v_id := 'c:' || v_key;
    elsif v_kind in ('relay', 'obs') then
      v_id := (case when v_kind = 'relay' then 'r:' else 'o:' end) || v_prefix || ':' || v_key;
      if not exists (select 1 from entries where id = v_id) then
        if n_extra >= 400 then
          n_skipped := n_skipped + 1;   -- this code already stores plenty of copies
          continue;
        end if;
        n_extra := n_extra + 1;
      end if;
      -- a copy can't be newer than the moment it arrives
      v_seen := case when jsonb_typeof(v_data->'lastSeen') = 'number' then (v_data->>'lastSeen')::numeric else 0 end;
      v_data := jsonb_set(v_data, '{lastSeen}', to_jsonb(least(v_seen, v_now)::bigint));
    else
      n_skipped := n_skipped + 1;
      continue;
    end if;

    insert into entries (id, kind, char_key, data, updated_at)
    values (v_id, v_kind, v_key, v_data, now())
    on conflict (id) do update set data = excluded.data, updated_at = now();
    n_saved := n_saved + 1;
  end loop;

  return jsonb_build_object('saved', n_saved, 'skipped', n_skipped);
end;
$$;

revoke all on function public.upload_ledger(text, jsonb) from public;
grant execute on function public.upload_ledger(text, jsonb) to anon, authenticated;

-- 4. moderation helpers (only for the site owner in the SQL Editor; the public key can't call them)
create or replace function public.release_character(p_char_key text)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  n int;
begin
  delete from claims where char_key = p_char_key;
  get diagnostics n = row_count;
  delete from entries where id = 'c:' || p_char_key;
  return case when n > 0 then 'released ' || p_char_key || '; the next upload of it claims it'
              else p_char_key || ' was not claimed' end;
end;
$$;
revoke all on function public.release_character(text) from public, anon, authenticated;

-- Takes a character key (blocks the code that claimed it) or the id of a copy or observation
-- ('r:<16 hex>:Name-Realm' or 'o:<16 hex>:Name-Realm').
create or replace function public.block_uploader(p_target text, p_reason text default null)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_prefix text;
  n_chars int;
  n_rows int;
begin
  if p_target ~ '^[ro]:[0-9a-f]{16}:' then
    v_prefix := substr(p_target, 3, 16);
  else
    select left(secret_hash, 16) into v_prefix from claims where char_key = p_target;
  end if;
  if v_prefix is null then
    return 'nothing found for ' || p_target;
  end if;

  insert into blocked_uploaders (hash_prefix, reason) values (v_prefix, p_reason) on conflict (hash_prefix) do nothing;
  delete from entries where id in (select 'c:' || char_key from claims where left(secret_hash, 16) = v_prefix);
  get diagnostics n_chars = row_count;
  delete from claims where left(secret_hash, 16) = v_prefix;
  delete from entries where left(id, 19) in ('r:' || v_prefix || ':', 'o:' || v_prefix || ':');
  get diagnostics n_rows = row_count;
  return format('blocked %s: removed %s characters and %s copies', v_prefix, n_chars, n_rows);
end;
$$;
revoke all on function public.block_uploader(text, text) from public, anon, authenticated;

-- 5. lighter reads for the site
-- Everything except hidden characters, with the map data left out (security_invoker: the reader's own rights apply).
create or replace view public.entries_lite with (security_invoker = true) as
  select e.id, e.kind, e.char_key, e.data - 'atlas' as data, e.updated_at
  from public.entries e
  where not exists (select 1 from public.hidden h where h.char_key = e.char_key);
grant select on public.entries_lite to anon, authenticated;

-- The newest map data per realm (the site reads it when the map of the fallen is drawn).
create or replace view public.realm_atlas with (security_invoker = true) as
  select distinct on (e.data->>'realm') e.data->>'realm' as realm, e.data->'atlas' as atlas
  from public.entries e
  where e.kind in ('char', 'relay') and jsonb_typeof(e.data->'atlas') = 'object'
  order by e.data->>'realm', e.kind = 'char' desc, e.updated_at desc;
grant select on public.realm_atlas to anon, authenticated;
