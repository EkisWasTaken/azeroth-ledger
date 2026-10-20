-- Azeroth Ledger: Blizzard armory sync. Run once in Supabase > SQL Editor, after the
-- "armory" Edge Function is deployed (see README, "Blizzard API").
--
-- 1. allow rows of kind 'api' (level, gear and guild from Blizzard's API)
alter table public.entries drop constraint if exists entries_kind_check;
alter table public.entries add constraint entries_kind_check check (kind in ('char', 'relay', 'obs', 'api'));

-- 2. call the function every 3 hours
create extension if not exists pg_cron;
create extension if not exists pg_net;

select cron.unschedule('ledger-armory') where exists (select 1 from cron.job where jobname = 'ledger-armory');
select cron.schedule(
  'ledger-armory',
  '7 */3 * * *',
  $$ select net.http_post(
       url := 'https://nznnybzrqplsqyhotlnd.supabase.co/functions/v1/armory',
       headers := '{"Content-Type": "application/json"}'::jsonb,
       body := '{}'::jsonb,
       timeout_milliseconds := 120000
     ) $$
);
