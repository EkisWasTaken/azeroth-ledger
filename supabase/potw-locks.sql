-- Character of the week, locked once the week is over, so a late upload or a site bug can't change history.
-- Run once in the Supabase SQL editor. Until it has run, the site keeps working out every week live.
--
-- The site locks a week the first time someone opens it after the week has been over for a full day (weeks run
-- Tuesday to Monday; Wednesday onwards counts), so Monday-night play that uploads on Tuesday still counts.
-- To fix a wrong lock: delete from potw_locks where realm = '…' and week = '2026-11-03';  (the next visit locks it again)

create table if not exists public.potw_locks (
  realm     text not null,          -- the site's realm key, "Game|Realm"
  week      date not null,          -- the Tuesday the week starts on
  char_key  text not null,
  locked_at timestamptz not null default now(),
  primary key (realm, week)
);
alter table public.potw_locks enable row level security;
grant select on public.potw_locks to anon, authenticated;
drop policy if exists "Week winners are readable by everyone" on public.potw_locks;
create policy "Week winners are readable by everyone" on public.potw_locks for select using (true);

-- Lock a finished week's winner; returns whoever holds the week (an earlier lock wins).
-- Anyone can call it, so it only accepts a finished week and a character that has uploaded stats.
create or replace function public.lock_potw(p_realm text, p_week date, p_char text)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_char text;
begin
  if p_realm is null or length(p_realm) > 120 or p_char is null or p_week is null then return null; end if;
  if extract(isodow from p_week) <> 2 or p_week + 8 > current_date or p_week < current_date - 400 then return null; end if;
  if not exists (select 1 from entries where char_key = p_char and kind in ('char', 'relay', 'obs')) then return null; end if;
  insert into potw_locks (realm, week, char_key) values (p_realm, p_week, p_char) on conflict do nothing;
  select char_key into v_char from potw_locks where realm = p_realm and week = p_week;
  return v_char;
end;
$$;

revoke all on function public.lock_potw(text, date, text) from public;
grant execute on function public.lock_potw(text, date, text) to anon, authenticated;
