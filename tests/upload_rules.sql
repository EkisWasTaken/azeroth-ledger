-- Azeroth Ledger: checks the upload rules in supabase/public-uploads.sql and supabase/hardening.sql.
-- Paste into Supabase > SQL Editor and run. It always ends with an error, on purpose, because that
-- rolls everything back and nothing is saved:
--   "ALL CHECKS PASSED ..."  everything works
--   "FAILED: ..."            names the rule that broke
-- It uses made-up characters on the realm "Zztestrealm".

do $$
declare
  a text := 'test-code-aaaaaaaaaaaaaaaaaaaaaaaaaaaa';
  b text := 'test-code-bbbbbbbbbbbbbbbbbbbbbbbbbbbb';
  r jsonb;
  v jsonb;
  n_saved int := 0;
  n_skipped int := 0;
begin
  -- 1. the first upload claims a character; another code can't overwrite it
  r := upload_ledger(a, '[{"kind":"char","char_key":"Zzone-Zztestrealm","data":{"name":"Ekossan","realm":"Zztestrealm","level":5,"atlas":{"v":1}}}]');
  if (r->>'saved')::int <> 1 then raise exception 'FAILED: a first upload should be saved (%)', r; end if;
  r := upload_ledger(b, '[{"kind":"char","char_key":"Zzone-Zztestrealm","data":{"level":60}}]');
  if (r->>'skipped')::int <> 1 then raise exception 'FAILED: another code overwrote a claimed character (%)', r; end if;
  select data into v from entries where id = 'c:Zzone-Zztestrealm';
  if v->>'level' <> '5' then raise exception 'FAILED: the claimed character changed (%)', v; end if;

  -- 2. the name always comes from the key
  if v->>'name' <> 'Zzone' then raise exception 'FAILED: the name should follow the key, got %', v->>'name'; end if;

  -- 3. a copy can't be newer than its upload
  perform upload_ledger(b, '[{"kind":"relay","char_key":"Zztwo-Zztestrealm","data":{"lastSeen":99999999999}}]');
  select data into v from entries where kind = 'relay' and char_key = 'Zztwo-Zztestrealm';
  if v is null then raise exception 'FAILED: a copy was not saved'; end if;
  if (v->>'lastSeen')::bigint > extract(epoch from now()) + 1 then raise exception 'FAILED: a copy kept a lastSeen in the future (%)', v->>'lastSeen'; end if;

  -- 4. one code stores at most 400 copies and observations (a has none yet)
  for i in 0..6 loop
    r := upload_ledger(a, (select jsonb_agg(jsonb_build_object('kind', 'obs', 'char_key', 'Zzobs' || (i * 60 + g) || '-Zztestrealm', 'data', '{}'::jsonb))
                           from generate_series(1, 60) g));
    n_saved := n_saved + (r->>'saved')::int;
    n_skipped := n_skipped + (r->>'skipped')::int;
  end loop;
  if n_saved <> 400 or n_skipped <> 20 then raise exception 'FAILED: expected 400 saved and 20 skipped copies, got % and %', n_saved, n_skipped; end if;

  -- 5. the lighter view leaves the map data out, and realm_atlas has it once per realm
  select data into v from entries_lite where id = 'c:Zzone-Zztestrealm';
  if v ? 'atlas' then raise exception 'FAILED: entries_lite still has atlas'; end if;
  if not exists (select 1 from realm_atlas where realm = 'Zztestrealm' and atlas->>'v' = '1') then raise exception 'FAILED: realm_atlas is missing the test realm'; end if;

  -- 6. hidden characters are left out of entries_lite
  insert into hidden (char_key, reason) values ('Zzone-Zztestrealm', 'test');
  if exists (select 1 from entries_lite where char_key = 'Zzone-Zztestrealm') then raise exception 'FAILED: a hidden character is still in entries_lite'; end if;

  -- 7. a released character can be claimed by a new code
  perform release_character('Zzone-Zztestrealm');
  r := upload_ledger(b, '[{"kind":"char","char_key":"Zzone-Zztestrealm","data":{"level":7}}]');
  if (r->>'saved')::int <> 1 then raise exception 'FAILED: a released character could not be claimed again (%)', r; end if;

  -- 8. a blocked code can't upload, and what it uploaded is gone
  perform block_uploader('Zzone-Zztestrealm');
  if exists (select 1 from entries where char_key in ('Zzone-Zztestrealm', 'Zztwo-Zztestrealm') and kind <> 'obs') then
    raise exception 'FAILED: block_uploader left rows behind';
  end if;
  begin
    perform upload_ledger(b, '[]');
    raise exception 'FAILED: a blocked code could still upload';
  exception when others then
    if sqlerrm like 'FAILED%' then raise; end if;
  end;

  -- 9. the public key can't call the moderation helpers
  if has_function_privilege('anon', 'public.release_character(text)', 'execute')
     or has_function_privilege('anon', 'public.block_uploader(text, text)', 'execute') then
    raise exception 'FAILED: the public key can call the moderation helpers';
  end if;

  raise exception 'ALL CHECKS PASSED (this error rolls the test back; nothing was saved)';
end;
$$;
