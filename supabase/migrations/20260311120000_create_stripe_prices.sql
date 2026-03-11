-- Migration: create stripe_prices cache table
-- P0-1: cache Stripe price IDs to avoid duplicate price creation

create table if not exists stripe_prices (
  id          uuid primary key default gen_random_uuid(),
  listing_id  uuid not null references listings(id) on delete cascade,
  pricing_type text not null check (pricing_type in ('recurring', 'one_time')),
  amount      integer not null,  -- in cents
  currency    text not null default 'eur',
  price_id    text not null,     -- Stripe price_id
  product_id  text not null,     -- Stripe product_id
  created_at  timestamptz not null default now(),
  unique (listing_id, pricing_type)
);

-- Service role only — no public access
alter table stripe_prices enable row level security;
