-- =============================================================
-- TinyRent — Database Migration 001: Core Schema
-- =============================================================

-- ---------------------------------------------------------------
-- Core tables
-- ---------------------------------------------------------------

create table locations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  country text default 'Norway',
  active boolean default true,
  created_at timestamptz default now()
);

create table categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  description text,
  image_url text,
  active boolean default true,
  sort_order int default 0,
  created_at timestamptz default now()
);

create table products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references categories(id),
  name text not null,
  slug text unique not null,
  brand text,
  model text,
  description text,
  short_description text,
  price_day numeric,
  price_week numeric,
  price_month numeric,
  deposit_amount numeric default 0,
  minimum_rental_days int default 1,
  published boolean default false,
  seo_title text,
  seo_description text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table product_locations (
  product_id uuid references products(id) on delete cascade,
  location_id uuid references locations(id) on delete cascade,
  primary key (product_id, location_id)
);

create table inventory_items (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id),
  location_id uuid references locations(id),
  internal_name text not null,
  serial_number text,
  purchase_price numeric,
  purchase_date date,
  condition text default 'good' check (condition in ('new', 'excellent', 'good', 'fair', 'poor')),
  status text default 'available' check (status in (
    'available', 'reserved', 'prepared', 'delivered',
    'active_rental', 'return_due', 'returned', 'cleaning',
    'maintenance', 'damaged', 'retired', 'lost'
  )),
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table customers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  first_name text,
  last_name text,
  email text not null,
  phone text,
  address_line1 text,
  address_line2 text,
  postal_code text,
  city text,
  country text default 'Norway',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table staff_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  role text not null default 'staff' check (role in ('super_admin', 'admin', 'staff', 'driver', 'support')),
  name text,
  active boolean default true,
  created_at timestamptz default now()
);

create table bookings (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references customers(id),
  location_id uuid references locations(id),
  status text default 'draft' check (status in (
    'draft', 'pending_payment', 'payment_failed', 'confirmed',
    'agreement_pending', 'agreement_signed', 'preparation_pending',
    'prepared', 'ready_for_handover', 'delivered', 'active_rental',
    'return_due', 'returned', 'inspection_pending', 'completed',
    'cancelled', 'overdue', 'disputed'
  )),
  start_date date not null,
  end_date date not null,
  rental_amount numeric not null default 0,
  deposit_amount numeric not null default 0,
  delivery_fee numeric default 0,
  pickup_fee numeric default 0,
  total_amount numeric not null default 0,
  currency text default 'NOK',
  stripe_checkout_session_id text,
  stripe_payment_intent_id text,
  notes text,
  internal_notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  constraint valid_dates check (end_date >= start_date)
);

create table booking_items (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid references bookings(id) on delete cascade,
  product_id uuid references products(id),
  inventory_item_id uuid references inventory_items(id),
  quantity int default 1 check (quantity = 1),
  unit_price numeric not null default 0,
  price_type text default 'day' check (price_type in ('day', 'week', 'month')),
  created_at timestamptz default now()
);

create table payments (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid references bookings(id),
  stripe_payment_intent_id text unique,
  amount numeric not null,
  currency text default 'NOK',
  status text default 'pending' check (status in ('pending', 'succeeded', 'failed', 'refunded')),
  payment_type text default 'rental' check (payment_type in ('rental', 'deposit', 'extension', 'damage')),
  created_at timestamptz default now()
);

-- stripe_event_id for idempotency (se migration 002)
create table stripe_events (
  id text primary key,  -- Stripe event ID (evt_...)
  type text not null,
  processed_at timestamptz default now()
);

create table deposits (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid references bookings(id),
  amount numeric not null,
  status text default 'pending' check (status in (
    'not_required', 'pending', 'authorized', 'captured',
    'partially_refunded', 'refunded', 'partially_withheld', 'withheld', 'failed'
  )),
  stripe_payment_intent_id text,
  amount_refunded numeric default 0,
  amount_withheld numeric default 0,
  reason text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table rental_agreements (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid references bookings(id),
  version text default 'v1',
  status text default 'pending_signature' check (status in ('pending_signature', 'signed', 'expired')),
  signed_by_customer_at timestamptz,
  signed_by_staff_at timestamptz,
  customer_signature_ip text,
  customer_signature_user_agent text,
  pdf_url text,
  created_at timestamptz default now()
);

create table condition_reports (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid references bookings(id),
  inventory_item_id uuid references inventory_items(id),
  created_by uuid references auth.users(id),
  report_type text not null check (report_type in ('pre_delivery', 'post_return')),
  status text default 'draft' check (status in ('draft', 'completed', 'signed')),
  condition_summary text,
  customer_signature_url text,
  staff_signature_url text,
  customer_signed_at timestamptz,
  staff_signed_at timestamptz,
  pdf_url text,
  created_at timestamptz default now()
);

create table condition_report_checklist_items (
  id uuid primary key default gen_random_uuid(),
  condition_report_id uuid references condition_reports(id) on delete cascade,
  label text not null,
  status text not null check (status in ('ok', 'issue', 'not_applicable')),
  notes text,
  created_at timestamptz default now()
);

create table condition_report_photos (
  id uuid primary key default gen_random_uuid(),
  condition_report_id uuid references condition_reports(id) on delete cascade,
  photo_url text not null,
  caption text,
  created_at timestamptz default now()
);

create table damage_reports (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid references bookings(id),
  inventory_item_id uuid references inventory_items(id),
  created_by uuid references auth.users(id),
  description text not null,
  severity text check (severity in ('minor', 'moderate', 'major')),
  estimated_cost numeric,
  deposit_withheld numeric default 0,
  status text default 'open' check (status in ('open', 'customer_notified', 'resolved', 'disputed')),
  created_at timestamptz default now()
);

create table maintenance_logs (
  id uuid primary key default gen_random_uuid(),
  inventory_item_id uuid references inventory_items(id),
  type text check (type in ('cleaning', 'repair', 'inspection', 'retired')),
  description text,
  cost numeric,
  performed_at timestamptz default now(),
  created_by uuid references auth.users(id)
);

create table delivery_orders (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid references bookings(id),
  type text default 'delivery' check (type in ('delivery', 'pickup')),
  status text default 'scheduled' check (status in (
    'scheduled', 'packed', 'out_for_delivery', 'delivered',
    'failed', 'rescheduled', 'picked_up', 'returned_to_storage',
    'inspection_pending', 'completed'
  )),
  scheduled_date date,
  scheduled_time_window text,
  address text,
  city text,
  postal_code text,
  notes text,
  assigned_to uuid references auth.users(id),
  created_at timestamptz default now()
);

create table notifications (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid references bookings(id),
  customer_id uuid references customers(id),
  channel text not null check (channel in ('email', 'sms')),
  type text not null,
  status text default 'pending' check (status in ('pending', 'sent', 'failed', 'opened', 'clicked')),
  sent_at timestamptz,
  created_at timestamptz default now()
);

create table reviews (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid references bookings(id),
  customer_id uuid references customers(id),
  product_id uuid references products(id),
  rating int check (rating between 1 and 5),
  comment text,
  published boolean default false,
  created_at timestamptz default now()
);

create table discount_codes (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  type text default 'percent' check (type in ('percent', 'fixed')),
  value numeric not null,
  max_uses int,
  used_count int default 0,
  expires_at timestamptz,
  active boolean default true,
  created_at timestamptz default now()
);

create table audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references auth.users(id),
  entity_type text not null,
  entity_id uuid,
  action text not null,
  metadata jsonb,
  created_at timestamptz default now()
);

-- ---------------------------------------------------------------
-- Indexes (ytelse)
-- ---------------------------------------------------------------

create index on inventory_items(product_id, location_id, status);
create index on booking_items(inventory_item_id);
create index on bookings(customer_id, status);
create index on bookings(start_date, end_date);
create index on bookings(status);
create index on notifications(customer_id, status);
create index on audit_logs(entity_type, entity_id);
create index on delivery_orders(scheduled_date, type);

-- ---------------------------------------------------------------
-- Atomisk reservasjon — hindrer dobbelbooking
-- ---------------------------------------------------------------
-- Denne funksjonen kjøres i én transaksjon med FOR UPDATE-lås.
-- Returnerer inventory_item_id hvis ledig, null hvis ikke.
create or replace function reserve_inventory_item(
  p_product_id uuid,
  p_location_id uuid,
  p_start_date date,
  p_end_date date,
  p_booking_id uuid
) returns uuid
language plpgsql
security definer
as $$
declare
  v_item_id uuid;
begin
  -- Finn og lås første ledige enhet atomisk
  select i.id into v_item_id
  from inventory_items i
  where i.product_id = p_product_id
    and i.location_id = p_location_id
    and i.status = 'available'
    and not exists (
      select 1
      from booking_items bi
      join bookings b on b.id = bi.booking_id
      where bi.inventory_item_id = i.id
        and b.status not in ('cancelled', 'completed', 'payment_failed')
        and b.start_date <= p_end_date
        and b.end_date >= p_start_date
    )
  limit 1
  for update skip locked;  -- Hopper over rader som er låst av andre transaksjoner

  if v_item_id is null then
    return null;  -- Ingen ledig enhet
  end if;

  -- Opprett booking_item med den reserverte enheten
  insert into booking_items (booking_id, inventory_item_id, product_id, unit_price)
  values (p_booking_id, v_item_id, p_product_id, 0);

  -- Sett inventory_item til reserved
  update inventory_items set status = 'reserved', updated_at = now()
  where id = v_item_id;

  return v_item_id;
end;
$$;

-- ---------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------

alter table customers enable row level security;
create policy "customers_own_row" on customers
  for all using (auth.uid() = user_id);

alter table bookings enable row level security;
create policy "bookings_customer_select" on bookings
  for select using (
    customer_id in (select id from customers where user_id = auth.uid())
  );
create policy "bookings_staff_all" on bookings
  for all using (
    exists (select 1 from staff_profiles where user_id = auth.uid() and active = true)
  );

alter table booking_items enable row level security;
create policy "booking_items_customer_select" on booking_items
  for select using (
    booking_id in (
      select b.id from bookings b
      join customers c on c.id = b.customer_id
      where c.user_id = auth.uid()
    )
  );
create policy "booking_items_staff_all" on booking_items
  for all using (
    exists (select 1 from staff_profiles where user_id = auth.uid() and active = true)
  );

alter table payments enable row level security;
create policy "payments_customer_select" on payments
  for select using (
    booking_id in (
      select b.id from bookings b
      join customers c on c.id = b.customer_id
      where c.user_id = auth.uid()
    )
  );
create policy "payments_staff_all" on payments
  for all using (
    exists (select 1 from staff_profiles where user_id = auth.uid() and active = true)
  );

alter table deposits enable row level security;
create policy "deposits_customer_select" on deposits
  for select using (
    booking_id in (
      select b.id from bookings b
      join customers c on c.id = b.customer_id
      where c.user_id = auth.uid()
    )
  );
create policy "deposits_staff_all" on deposits
  for all using (
    exists (select 1 from staff_profiles where user_id = auth.uid() and active = true)
  );

alter table rental_agreements enable row level security;
create policy "agreements_customer_select" on rental_agreements
  for select using (
    booking_id in (
      select b.id from bookings b
      join customers c on c.id = b.customer_id
      where c.user_id = auth.uid()
    )
  );
create policy "agreements_staff_all" on rental_agreements
  for all using (
    exists (select 1 from staff_profiles where user_id = auth.uid() and active = true)
  );

-- Kun staff kan lese/skrive disse tabellene
alter table condition_reports enable row level security;
create policy "condition_reports_staff_all" on condition_reports
  for all using (
    exists (select 1 from staff_profiles where user_id = auth.uid() and active = true)
  );

alter table damage_reports enable row level security;
create policy "damage_reports_staff_all" on damage_reports
  for all using (
    exists (select 1 from staff_profiles where user_id = auth.uid() and active = true)
  );

alter table inventory_items enable row level security;
create policy "inventory_items_public_select" on inventory_items
  for select using (true);  -- Tilgjengelighetssjekk trenger å lese disse
create policy "inventory_items_staff_all" on inventory_items
  for all using (
    exists (select 1 from staff_profiles where user_id = auth.uid() and active = true)
  );

alter table products enable row level security;
create policy "products_public_select" on products
  for select using (published = true);
create policy "products_staff_all" on products
  for all using (
    exists (select 1 from staff_profiles where user_id = auth.uid() and active = true)
  );

alter table locations enable row level security;
create policy "locations_public_select" on locations
  for select using (active = true);
create policy "locations_staff_all" on locations
  for all using (
    exists (select 1 from staff_profiles where user_id = auth.uid() and active = true)
  );

alter table categories enable row level security;
create policy "categories_public_select" on categories
  for select using (active = true);
create policy "categories_staff_all" on categories
  for all using (
    exists (select 1 from staff_profiles where user_id = auth.uid() and active = true)
  );

alter table audit_logs enable row level security;
create policy "audit_logs_staff_select" on audit_logs
  for select using (
    exists (select 1 from staff_profiles where user_id = auth.uid() and active = true)
  );
create policy "audit_logs_insert_all" on audit_logs
  for insert with check (true);  -- Alle kan logge, men kun staff kan lese

alter table reviews enable row level security;
create policy "reviews_public_select" on reviews
  for select using (published = true);
create policy "reviews_own_insert" on reviews
  for insert with check (
    customer_id in (select id from customers where user_id = auth.uid())
  );
create policy "reviews_staff_all" on reviews
  for all using (
    exists (select 1 from staff_profiles where user_id = auth.uid() and active = true)
  );

alter table stripe_events enable row level security;
create policy "stripe_events_no_direct_access" on stripe_events
  for all using (false);  -- Kun tilgjengelig via service_role (webhooks)
