-- Give a character back to its player after they reinstalled FunStats or moved PC: the new install has a new
-- upload code, and the server keeps refusing that character for it (the app's log says "skipped (claimed by
-- another upload code)"). Run in the SQL Editor after forever-realms.sql. Safe to run again.

-- 1. Uploads keep a character's old days, so the reclaimed character doesn't lose its history.
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
    on conflict (id) do update set
      -- a character's days are kept: an upload from a fresh install (after a reclaim) adds to its history, never wipes it
      data = case when excluded.kind = 'char' and jsonb_typeof(entries.data->'days') = 'object'
                   and jsonb_typeof(excluded.data->'days') = 'object'
                  then excluded.data || jsonb_build_object('days', (entries.data->'days') || (excluded.data->'days'))
                  else excluded.data end,
      updated_at = now();
    n_saved := n_saved + 1;
  end loop;

  return jsonb_build_object('saved', n_saved, 'skipped', n_skipped);
end;
$$;

revoke all on function public.upload_ledger(text, jsonb) from public;
grant execute on function public.upload_ledger(text, jsonb) to anon, authenticated;

-- 2. Release the character. The player's app claims it again on its next upload (within a few minutes of WoW saving).
--    Only do this for someone you know is the real player: whoever uploads that name next gets it.
delete from claims where char_key = 'Marrolock Fear-PvP-EU';
