-- SkatteSmart Migration 003: Nye moduler
-- Kjør i Supabase SQL Editor

-- ─── Telefon og internett ────────────────────────────────────────────────────
create table if not exists phone_internet_benefits (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references companies(id) on delete cascade not null,
  year int not null,
  employee_name text not null,
  device_type text not null, -- 'mobile' | 'home_broadband' | 'mobile_broadband' | 'device'
  monthly_cost_nok numeric(10,2) not null default 0,
  months_covered int not null default 12,
  annual_cost_nok numeric(10,2) generated always as (monthly_cost_nok * months_covered) stored,
  taxable_benefit_nok numeric(10,2) not null default 0,
  business_need_description text,
  includes_tv_streaming boolean default false,
  is_reported_a_melding boolean default false,
  notes text,
  created_at timestamptz default now()
);

-- ─── Representasjon ──────────────────────────────────────────────────────────
create table if not exists representation_events (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references companies(id) on delete cascade not null,
  date date not null,
  location text,
  rep_type text not null default 'dinner', -- 'dinner' | 'lunch' | 'coffee' | 'other'
  amount_nok numeric(10,2) not null default 0,
  person_count int not null default 1,
  includes_alcohol boolean default false,
  has_external_participant boolean default true,
  during_work_hours boolean default false,
  participants text, -- fritekst
  purpose text,
  deductible_amount numeric(10,2) not null default 0,
  non_deductible_amount numeric(10,2) not null default 0,
  notes text,
  created_at timestamptz default now()
);

-- ─── Firmakort og mellomregning ───────────────────────────────────────────────
create table if not exists cost_entries (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references companies(id) on delete cascade not null,
  date date not null,
  description text not null,
  amount_nok numeric(10,2) not null default 0,
  entry_type text not null, -- 'private_on_company_card' | 'business_on_private_card' | 'unclear'
  who_used_it text,
  business_purpose text,
  to_be_refunded boolean default false,
  is_naturalytelse boolean default false,
  risk_level text not null default 'green', -- 'green' | 'yellow' | 'red'
  notes text,
  created_at timestamptz default now()
);

-- ─── RLS Policies ─────────────────────────────────────────────────────────────

-- phone_internet_benefits
alter table phone_internet_benefits enable row level security;

create policy "select_phone_benefits" on phone_internet_benefits
  for select using (
    company_id in (select company_id from company_access where user_id = auth.uid())
  );
create policy "insert_phone_benefits" on phone_internet_benefits
  for insert with check (
    company_id in (select company_id from company_access where user_id = auth.uid())
  );
create policy "update_phone_benefits" on phone_internet_benefits
  for update using (
    company_id in (select company_id from company_access where user_id = auth.uid())
  );
create policy "delete_phone_benefits" on phone_internet_benefits
  for delete using (
    company_id in (select company_id from company_access where user_id = auth.uid())
  );

-- representation_events
alter table representation_events enable row level security;

create policy "select_rep_events" on representation_events
  for select using (
    company_id in (select company_id from company_access where user_id = auth.uid())
  );
create policy "insert_rep_events" on representation_events
  for insert with check (
    company_id in (select company_id from company_access where user_id = auth.uid())
  );
create policy "update_rep_events" on representation_events
  for update using (
    company_id in (select company_id from company_access where user_id = auth.uid())
  );
create policy "delete_rep_events" on representation_events
  for delete using (
    company_id in (select company_id from company_access where user_id = auth.uid())
  );

-- cost_entries
alter table cost_entries enable row level security;

create policy "select_cost_entries" on cost_entries
  for select using (
    company_id in (select company_id from company_access where user_id = auth.uid())
  );
create policy "insert_cost_entries" on cost_entries
  for insert with check (
    company_id in (select company_id from company_access where user_id = auth.uid())
  );
create policy "update_cost_entries" on cost_entries
  for update using (
    company_id in (select company_id from company_access where user_id = auth.uid())
  );
create policy "delete_cost_entries" on cost_entries
  for delete using (
    company_id in (select company_id from company_access where user_id = auth.uid())
  );

-- ─── company_people: legg til manglende kolonner ──────────────────────────────
alter table company_people
  add column if not exists ownership_percentage numeric(5,2),
  add column if not exists family_relation text,
  add column if not exists family_relation_description text;
