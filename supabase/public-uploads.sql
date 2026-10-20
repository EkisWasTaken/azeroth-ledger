-- Azeroth Ledger: public uploads. Run once in Supabase > SQL Editor, after setup.sql.
--
-- Anyone with the addon can upload through the website or the sync script using only the
-- public (publishable) key. Uploads go through upload_ledger(), which checks every row.
--
-- How a character stays safe from being overwritten by someone else:
--   * Each addon install has a private upload code (FunStatsDB.secret) that is never shared in game.
--   * The first upload of a character claims it for that code. Later uploads of that character
--     are only accepted with the same code.
--   * Copies of other players' stats (shared in game, kind 'relay') and combat observations
--     (kind 'obs') are stored separately per uploader and never replace a character's own data.

-- 1. allow the new row kind
alter table public.entries drop constraint if exists entries_kind_check;
alter table public.entries add constraint entries_kind_check check (kind in ('char', 'relay', 'obs'));

-- 2. who owns which character (not readable by the public key)
create table if not exists public.claims (
  char_key    text primary key,
  secret_hash text not null,
  created_at  timestamptz not null default now()
);
alter table public.claims enable row level security;

-- 3. the upload function
create or replace function public.upload_ledger(p_secret text, p_rows jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  r jsonb;
  v_hash text;
  v_kind text;
  v_key text;
  v_id text;
  v_owner text;
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

  for r in select value from jsonb_array_elements(p_rows) loop
    v_kind := r->>'kind';
    v_key := r->>'char_key';
    if v_key is null or length(v_key) > 80 or v_key !~ '^[^-]+-.+$' or jsonb_typeof(r->'data') is distinct from 'object' then
      n_skipped := n_skipped + 1;
      continue;
    end if;

    if v_kind = 'char' then
      insert into claims (char_key, secret_hash) values (v_key, v_hash) on conflict (char_key) do nothing;
      select secret_hash into v_owner from claims where char_key = v_key;
      if v_owner is distinct from v_hash then
        n_skipped := n_skipped + 1;   -- someone else's character
        continue;
      end if;
      v_id := 'c:' || v_key;
    elsif v_kind = 'relay' then
      v_id := 'r:' || left(v_hash, 16) || ':' || v_key;
    elsif v_kind = 'obs' then
      v_id := 'o:' || left(v_hash, 16) || ':' || v_key;
    else
      n_skipped := n_skipped + 1;
      continue;
    end if;

    insert into entries (id, kind, char_key, data, updated_at)
    values (v_id, v_kind, v_key, r->'data', now())
    on conflict (id) do update set data = excluded.data, updated_at = now();
    n_saved := n_saved + 1;
  end loop;

  return jsonb_build_object('saved', n_saved, 'skipped', n_skipped);
end;
$$;

revoke all on function public.upload_ledger(text, jsonb) from public;
grant execute on function public.upload_ledger(text, jsonb) to anon, authenticated;
