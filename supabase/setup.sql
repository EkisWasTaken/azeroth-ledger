-- Azeroth Ledger: run this once in Supabase > SQL Editor.
-- One row per character (kind 'char') or per set of observations of a friend
-- without the addon (kind 'obs'). The website reads; only your sync script writes.

create table if not exists public.entries (
  id         text primary key,
  kind       text not null check (kind in ('char', 'obs')),
  char_key   text not null,
  data       jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.entries enable row level security;

-- Let the website's public key read the table, and the sync script's secret key write it.
grant select on public.entries to anon, authenticated;
grant all on public.entries to service_role;

-- Anyone with the website link can read the ledger.
drop policy if exists "Ledger is readable by everyone" on public.entries;
create policy "Ledger is readable by everyone"
  on public.entries for select
  to anon, authenticated
  using (true);

-- No insert/update/delete policies: the public key can't change anything.
-- The sync script uses your secret key, which bypasses these rules. Never put it in the website.
