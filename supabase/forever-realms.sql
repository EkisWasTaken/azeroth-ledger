-- WoW Forever reports the server behind a realm ("CAMWOW EU4 Realm 8 PvP"), but one ruleset and region is one realm ("PvP-EU").
-- Run once in the SQL Editor, after hardening.sql. Safe to run again.
-- It teaches the upload function to use the realm name, also for apps and addons that haven't updated yet, and moves rows already uploaded.

-- 1. "Name Surname-CAMWOW EU4 Realm 8 PvP" -> "Name Surname-PvP-EU"; anything else stays as it is.
create or replace function public.forever_realm_key(p_key text)
returns text
language sql
immutable
as $$
  select regexp_replace(p_key, '^([^-]+)-(.* )?([A-Z]{2,})[0-9]* Realm [0-9]+ (.+)$', '\1-\4-\3');
$$;

-- 2. move what's already there
do $$
declare
  c record;
  v_new text;
  v_id text;
begin
  -- who owns a character moves with it; an owner of the new key stays the owner
  for c in select char_key, secret_hash from claims loop
    v_new := forever_realm_key(c.char_key);
    if v_new <> c.char_key then
      insert into claims (char_key, secret_hash) values (v_new, c.secret_hash) on conflict (char_key) do nothing;
      delete from claims where char_key = c.char_key;
    end if;
  end loop;

  for c in select id, char_key from entries order by updated_at loop
    v_new := forever_realm_key(c.char_key);
    if v_new <> c.char_key then
      v_id := replace(c.id, c.char_key, v_new);
      -- oldest first, so if a row with the new key exists, the newest upload is the one kept
      delete from entries where id = v_id;
      update entries
      set id = v_id, char_key = v_new,
          data = data || jsonb_build_object('key', v_new, 'realm', substr(v_new, strpos(v_new, '-') + 1))
      where id = c.id;
    end if;
  end loop;
end;
$$;

-- 3. the upload function from hardening.sql, using the realm name
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
    if forever_realm_key(v_key) <> v_key then
      v_key := forever_realm_key(v_key);
      v_data := v_data || jsonb_build_object('realm', substr(v_key, strpos(v_key, '-') + 1));
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
