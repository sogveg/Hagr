-- SkatteSmart initial schema
-- Enable RLS on all tables

-- Subscriptions
create table if not exists subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null unique,
  plan_id text not null check (plan_id in ('start', 'pro', 'premium')),
  stripe_subscription_id text,
  stripe_customer_id text,
  status text not null default 'trialing'
    check (status in ('active', 'trialing', 'past_due', 'canceled', 'incomplete')),
  current_period_end timestamptz not null default (now() + interval '30 days'),
  extra_companies int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table subscriptions enable row level security;
create policy "Users manage own subscription" on subscriptions
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Companies
create table if not exists companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  org_number text,
  company_type text not null check (company_type in ('AS','HOLDING_AS','ENK','ANS_DA','PRIVATE','OTHER')),
  has_employees boolean not null default false,
  employee_count int not null default 0,
  owner_employed boolean not null default false,
  payroll_active boolean not null default false,
  spouse_involved boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table companies enable row level security;

-- Company access (many users can access a company)
create table if not exists company_access (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references companies not null,
  user_id uuid references auth.users not null,
  role text not null default 'owner' check (role in ('owner', 'accountant', 'auditor', 'viewer')),
  created_at timestamptz not null default now(),
  unique (company_id, user_id)
);
alter table company_access enable row level security;
create policy "Users see own company access" on company_access
  using (auth.uid() = user_id);

-- RLS on companies via company_access
create policy "Users see accessible companies" on companies
  using (
    exists (
      select 1 from company_access
      where company_access.company_id = companies.id
        and company_access.user_id = auth.uid()
    )
  );

-- Company people
create table if not exists company_people (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references companies not null,
  user_id uuid references auth.users,
  name text not null,
  email text,
  role text not null,
  is_owner boolean not null default false,
  is_employee boolean not null default false,
  employment_percentage numeric(5,2),
  created_at timestamptz not null default now()
);
alter table company_people enable row level security;
create policy "Company people visible to company members" on company_people
  using (
    exists (
      select 1 from company_access
      where company_access.company_id = company_people.company_id
        and company_access.user_id = auth.uid()
    )
  );

-- Board meetings
create table if not exists board_meetings (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references companies not null,
  meeting_number int not null,
  date date not null,
  start_time time,
  end_time time,
  location text,
  meeting_format text not null default 'physical' check (meeting_format in ('physical','digital','hybrid')),
  called_by text,
  chairperson text,
  minute_taker text,
  status text not null default 'draft' check (status in ('draft','finalized')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table board_meetings enable row level security;
create policy "Board meetings visible to company members" on board_meetings
  using (
    exists (
      select 1 from company_access
      where company_access.company_id = board_meetings.company_id
        and company_access.user_id = auth.uid()
    )
  );

-- Agenda items
create table if not exists agenda_items (
  id uuid primary key default gen_random_uuid(),
  board_meeting_id uuid references board_meetings not null,
  order_index int not null,
  title text not null,
  description text,
  presenter text,
  duration_minutes int,
  created_at timestamptz not null default now()
);
alter table agenda_items enable row level security;
create policy "Agenda items via board meeting" on agenda_items
  using (
    exists (
      select 1 from board_meetings bm
      join company_access ca on ca.company_id = bm.company_id
      where bm.id = agenda_items.board_meeting_id
        and ca.user_id = auth.uid()
    )
  );

-- Decisions
create table if not exists decisions (
  id uuid primary key default gen_random_uuid(),
  board_meeting_id uuid references board_meetings not null,
  agenda_item_id uuid references agenda_items,
  text text not null,
  vote_for int not null default 0,
  vote_against int not null default 0,
  vote_abstain int not null default 0,
  carried boolean not null default true,
  created_at timestamptz not null default now()
);
alter table decisions enable row level security;
create policy "Decisions via board meeting" on decisions
  using (
    exists (
      select 1 from board_meetings bm
      join company_access ca on ca.company_id = bm.company_id
      where bm.id = decisions.board_meeting_id
        and ca.user_id = auth.uid()
    )
  );

-- Event participants (shared)
create table if not exists event_participants (
  id uuid primary key default gen_random_uuid(),
  event_type text not null,
  event_id uuid not null,
  person_id uuid references company_people,
  name text not null,
  role text,
  role_explanation text,
  attended boolean default true,
  created_at timestamptz not null default now()
);
alter table event_participants enable row level security;

-- Strategy gatherings
create table if not exists strategy_gatherings (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references companies not null,
  title text not null,
  purpose text not null,
  business_relevance text,
  date_from date not null,
  date_to date not null,
  location text not null,
  location_rationale text,
  social_program text,
  private_activities text,
  companions text,
  travel_included boolean not null default false,
  overnight_stay boolean not null default false,
  create_board_meeting_docs boolean not null default false,
  status text not null default 'draft' check (status in ('draft','finalized')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table strategy_gatherings enable row level security;
create policy "Strategy gatherings visible to company members" on strategy_gatherings
  using (
    exists (
      select 1 from company_access
      where company_access.company_id = strategy_gatherings.company_id
        and company_access.user_id = auth.uid()
    )
  );

-- Program blocks
create table if not exists program_blocks (
  id uuid primary key default gen_random_uuid(),
  strategy_gathering_id uuid references strategy_gatherings not null,
  day_number int not null,
  start_time time not null,
  end_time time not null,
  title text not null,
  block_type text not null check (block_type in ('professional','social','break')),
  description text,
  created_at timestamptz not null default now()
);
alter table program_blocks enable row level security;

-- Gifts
create table if not exists gifts (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references companies not null,
  recipient_person_id uuid references company_people,
  recipient_name text not null,
  year int not null,
  description text not null,
  amount_nok numeric(10,2) not null,
  is_cash_equivalent boolean not null default false,
  is_performance_related boolean not null default false,
  date date not null,
  tax_free_amount numeric(10,2) not null default 0,
  taxable_amount numeric(10,2) not null default 0,
  notes text,
  created_at timestamptz not null default now()
);
alter table gifts enable row level security;
create policy "Gifts visible to company members" on gifts
  using (
    exists (
      select 1 from company_access
      where company_access.company_id = gifts.company_id
        and company_access.user_id = auth.uid()
    )
  );

-- Personal discounts
create table if not exists personal_discounts (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references companies not null,
  employee_person_id uuid references company_people,
  employee_name text not null,
  year int not null,
  product_service text not null,
  market_price_nok numeric(10,2) not null,
  paid_price_nok numeric(10,2) not null,
  discount_value_nok numeric(10,2) not null,
  tax_free_amount numeric(10,2) not null default 0,
  taxable_amount numeric(10,2) not null default 0,
  date date not null,
  notes text,
  created_at timestamptz not null default now()
);
alter table personal_discounts enable row level security;
create policy "Personal discounts visible to company members" on personal_discounts
  using (
    exists (
      select 1 from company_access
      where company_access.company_id = personal_discounts.company_id
        and company_access.user_id = auth.uid()
    )
  );

-- Phone/internet benefits
create table if not exists phone_internet_benefits (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references companies not null,
  employee_person_id uuid references company_people,
  employee_name text not null,
  year int not null,
  services jsonb not null default '[]',
  total_employer_cost_nok numeric(10,2) not null default 0,
  taxable_amount_nok numeric(10,2) not null default 0,
  notes text,
  created_at timestamptz not null default now()
);
alter table phone_internet_benefits enable row level security;
create policy "Phone benefits visible to company members" on phone_internet_benefits
  using (
    exists (
      select 1 from company_access
      where company_access.company_id = phone_internet_benefits.company_id
        and company_access.user_id = auth.uid()
    )
  );

-- Representation events
create table if not exists representation_events (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references companies not null,
  date date not null,
  purpose text not null,
  participants jsonb not null default '[]',
  customer_supplier_relation boolean not null default false,
  location text,
  total_amount_nok numeric(10,2) not null,
  amount_per_person_nok numeric(10,2),
  includes_alcohol boolean not null default false,
  notes text,
  risk_flags jsonb not null default '[]',
  created_at timestamptz not null default now()
);
alter table representation_events enable row level security;
create policy "Representation events visible to company members" on representation_events
  using (
    exists (
      select 1 from company_access
      where company_access.company_id = representation_events.company_id
        and company_access.user_id = auth.uid()
    )
  );

-- Cost entries (shared across event types)
create table if not exists cost_entries (
  id uuid primary key default gen_random_uuid(),
  event_type text not null,
  event_id uuid not null,
  description text not null,
  amount_nok numeric(10,2) not null,
  category text,
  receipt_url text,
  created_at timestamptz not null default now()
);
alter table cost_entries enable row level security;

-- Documents
create table if not exists documents (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references companies not null,
  event_type text,
  event_id uuid,
  document_type text not null,
  title text not null,
  content jsonb,
  pdf_url text,
  status text not null default 'draft' check (status in ('draft','final')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table documents enable row level security;
create policy "Documents visible to company members" on documents
  using (
    exists (
      select 1 from company_access
      where company_access.company_id = documents.company_id
        and company_access.user_id = auth.uid()
    )
  );

-- Risk assessments
create table if not exists risk_assessments (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references companies not null,
  event_type text not null,
  event_id uuid not null,
  level text not null check (level in ('green','yellow','red')),
  score int not null,
  reasons jsonb not null default '[]',
  required_documentation jsonb not null default '[]',
  risk_reducing_actions jsonb not null default '[]',
  created_at timestamptz not null default now()
);
alter table risk_assessments enable row level security;
create policy "Risk assessments visible to company members" on risk_assessments
  using (
    exists (
      select 1 from company_access
      where company_access.company_id = risk_assessments.company_id
        and company_access.user_id = auth.uid()
    )
  );

-- Audit exports
create table if not exists audit_exports (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references companies not null,
  year int not null,
  status text not null default 'pending' check (status in ('pending','generating','ready','error')),
  file_url text,
  created_at timestamptz not null default now()
);
alter table audit_exports enable row level security;
create policy "Audit exports visible to company members" on audit_exports
  using (
    exists (
      select 1 from company_access
      where company_access.company_id = audit_exports.company_id
        and company_access.user_id = auth.uid()
    )
  );

-- Helper: auto-update updated_at
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger subscriptions_updated_at before update on subscriptions
  for each row execute function update_updated_at();
create trigger companies_updated_at before update on companies
  for each row execute function update_updated_at();
create trigger board_meetings_updated_at before update on board_meetings
  for each row execute function update_updated_at();
create trigger strategy_gatherings_updated_at before update on strategy_gatherings
  for each row execute function update_updated_at();
create trigger documents_updated_at before update on documents
  for each row execute function update_updated_at();
