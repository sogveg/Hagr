-- =============================================================
-- TinyRent — Database Migration 002: Extended Features
-- =============================================================

-- ---------------------------------------------------------------
-- damage_reports
-- ---------------------------------------------------------------
create table if not exists damage_reports (
  id           uuid primary key default gen_random_uuid(),
  booking_id   uuid not null references bookings(id) on delete cascade,
  reported_by  text not null check (reported_by in ('admin', 'customer')),
  severity     text not null check (severity in ('minor', 'moderate', 'severe')),
  description  text not null,
  photo_url    text,
  amount_charged numeric(10,2),
  created_at   timestamptz default now()
);

-- RLS
alter table damage_reports enable row level security;

-- Admin: full access via service role (bypasses RLS)
-- Customers: can insert their own and read their own
create policy "customers_insert_damage_reports" on damage_reports
  for insert
  with check (
    reported_by = 'customer'
    and booking_id in (
      select b.id from bookings b
      join customers c on c.id = b.customer_id
      where c.user_id = auth.uid()
    )
  );

create policy "customers_read_damage_reports" on damage_reports
  for select
  using (
    booking_id in (
      select b.id from bookings b
      join customers c on c.id = b.customer_id
      where c.user_id = auth.uid()
    )
  );

-- ---------------------------------------------------------------
-- articles
-- ---------------------------------------------------------------
create table if not exists articles (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,
  slug         text unique not null,
  excerpt      text,
  content      text,
  cover_image  text,
  author       text default 'TinyRent',
  published    boolean default false,
  published_at timestamptz,
  updated_at   timestamptz default now(),
  created_at   timestamptz default now()
);

-- Public can read published articles, admin manages via service role
alter table articles enable row level security;

create policy "public_read_published_articles" on articles
  for select
  using (published = true);

-- ---------------------------------------------------------------
-- newsletter_subscribers
-- ---------------------------------------------------------------
create table if not exists newsletter_subscribers (
  id         uuid primary key default gen_random_uuid(),
  email      text unique not null,
  name       text,
  active     boolean default true,
  created_at timestamptz default now()
);

-- No RLS needed — managed via service role only
alter table newsletter_subscribers enable row level security;
-- (service role bypasses RLS; no public access needed)

-- ---------------------------------------------------------------
-- waitlist
-- ---------------------------------------------------------------
create table if not exists waitlist (
  id          uuid primary key default gen_random_uuid(),
  product_id  uuid references products(id) on delete cascade,
  location_id uuid references locations(id) on delete set null,
  email       text not null,
  name        text,
  message     text,
  notified    boolean default false,
  created_at  timestamptz default now()
);

-- No RLS needed — managed via service role only
alter table waitlist enable row level security;
-- (service role bypasses RLS; no public access needed)

-- ---------------------------------------------------------------
-- discount_codes
-- ---------------------------------------------------------------
create table if not exists discount_codes (
  id         uuid primary key default gen_random_uuid(),
  code       text unique not null,
  type       text not null check (type in ('percent', 'fixed')),
  value      numeric(10,2) not null,
  max_uses   int,
  uses       int default 0,
  active     boolean default true,
  expires_at timestamptz,
  created_at timestamptz default now()
);

-- No RLS needed — managed via service role only
alter table discount_codes enable row level security;
-- (service role bypasses RLS; no public access needed)
