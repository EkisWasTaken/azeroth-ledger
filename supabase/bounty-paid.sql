-- Most Wanted bounties: who has been paid, and with what. Run once in the Supabase SQL editor.
-- Until it has run, claimed bounties just never show as paid.
--
-- The site's "Paid with" picker on a claimed bounty calls pay_bounty(); picking "Not paid" removes the row.
-- A kill on us after paid_on reopens the bounty (the site works that out).
-- To undo by hand: delete from bounty_paid where realm = '…' and wanted = '…';

create table if not exists public.bounty_paid (
  realm     text not null,          -- the site's realm key, "Game|Realm"
  wanted    text not null,          -- the enemy player's name as the deaths record it
  paid_with text not null check (paid_with in ('gold', 'potion', 'item')),
  paid_on   date not null default current_date,
  primary key (realm, wanted)
);
alter table public.bounty_paid enable row level security;
grant select on public.bounty_paid to anon, authenticated;
drop policy if exists "Bounty payments are readable by everyone" on public.bounty_paid;
create policy "Bounty payments are readable by everyone" on public.bounty_paid for select using (true);

-- Mark a bounty paid (p_with 'gold', 'potion' or 'item'), or not paid (p_with null).
-- shortcut: anyone with the site can call it, like lock_potw; add an upload-code check if people start abusing it.
create or replace function public.pay_bounty(p_realm text, p_wanted text, p_with text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_realm is null or length(p_realm) > 120 or p_wanted is null or length(p_wanted) > 80 then return; end if;
  if p_with is null then
    delete from bounty_paid where realm = p_realm and wanted = p_wanted;
  elsif p_with in ('gold', 'potion', 'item') then
    insert into bounty_paid (realm, wanted, paid_with) values (p_realm, p_wanted, p_with)
      on conflict (realm, wanted) do update set paid_with = excluded.paid_with, paid_on = current_date;
  end if;
end;
$$;

revoke all on function public.pay_bounty(text, text, text) from public;
grant execute on function public.pay_bounty(text, text, text) to anon, authenticated;
