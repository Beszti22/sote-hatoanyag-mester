-- SOTE Hatóanyag Mester — initial schema
-- Run this in the Supabase SQL editor (or via `supabase db push`).

-- ──────────────────────────────────────────────
-- drugs: the full flashcard deck
-- ──────────────────────────────────────────────
create table if not exists public.drugs (
  id            text primary key,
  category      text not null,
  name          text not null,
  mechanism     text not null,
  side_effects  text not null,
  indication    text,
  is_free       boolean not null default false,
  sort_order    integer not null default 0
);

create index if not exists drugs_category_idx on public.drugs (category);
create index if not exists drugs_is_free_idx on public.drugs (is_free);

alter table public.drugs enable row level security;

-- Everyone (incl. anonymous visitors) can read the free cards.
create policy "free drugs are public"
  on public.drugs for select
  using (is_free = true);

-- Signed-in users with an active subscription can read everything.
create policy "subscribers read all drugs"
  on public.drugs for select
  to authenticated
  using (
    exists (
      select 1 from public.subscriptions s
      where s.user_id = auth.uid()
        and s.status = 'active'
        and (s.current_period_end is null or s.current_period_end > now())
    )
  );

-- ──────────────────────────────────────────────
-- subscriptions: one row per user, synced from Stripe webhooks (phase 2)
-- ──────────────────────────────────────────────
create table if not exists public.subscriptions (
  user_id               uuid primary key references auth.users (id) on delete cascade,
  stripe_customer_id    text unique,
  stripe_subscription_id text unique,
  status                text not null default 'none', -- none | active | past_due | canceled
  plan                  text,                          -- monthly | semiannual | annual
  current_period_end    timestamptz,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

alter table public.subscriptions enable row level security;

create policy "users read their own subscription"
  on public.subscriptions for select
  to authenticated
  using (user_id = auth.uid());

-- Only server-side (service role) writes subscriptions — no insert/update/delete
-- policy for regular users, so the table is effectively read-only to them.

-- ──────────────────────────────────────────────
-- user_progress: per-user "learned" state, replaces the old localStorage logic
-- ──────────────────────────────────────────────
create table if not exists public.user_progress (
  user_id     uuid not null references auth.users (id) on delete cascade,
  drug_id     text not null references public.drugs (id) on delete cascade,
  learned     boolean not null default false,
  updated_at  timestamptz not null default now(),
  primary key (user_id, drug_id)
);

alter table public.user_progress enable row level security;

create policy "users manage their own progress"
  on public.user_progress for all
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- Keep updated_at fresh on every write.
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists user_progress_touch on public.user_progress;
create trigger user_progress_touch
  before update on public.user_progress
  for each row execute function public.touch_updated_at();

drop trigger if exists subscriptions_touch on public.subscriptions;
create trigger subscriptions_touch
  before update on public.subscriptions
  for each row execute function public.touch_updated_at();
