-- TinyRent seed-data — Bergen, babyutstyr, første produkter
-- Kjør i Supabase SQL Editor etter migrasjonen

-- Lokasjon
insert into locations (name, slug, country, active) values
  ('Bergen', 'bergen', 'Norway', true)
on conflict (slug) do nothing;

-- Kategori
insert into categories (name, slug, description, active, sort_order) values
  ('Babyutstyr', 'babyutstyr', 'Premium babyutstyr for leie i Bergen', true, 1)
on conflict (slug) do nothing;

-- Produkter
insert into products (category_id, name, slug, brand, description, short_description, price_day, price_week, price_month, deposit_amount, minimum_rental_days, published)
select
  c.id,
  'Moonboon Hammock Vogge',
  'moonboon-hammock-vogge',
  'Moonboon',
  'Den prisbelønte Moonboon hengekøyevuggen er kjent for å hjelpe babyer til å sove raskt og godt. Med skånsom, naturlig bevegelse etterligner den følelsen av å bli bært.',
  'Prisbelønnet hengekøyevugge — babyer sovner raskere',
  149,
  799,
  2200,
  1500,
  3,
  true
from categories c where c.slug = 'babyutstyr'
on conflict (slug) do nothing;

insert into products (category_id, name, slug, brand, description, short_description, price_day, price_week, price_month, deposit_amount, minimum_rental_days, published)
select
  c.id,
  'Babyzen YOYO Reisevogn',
  'babyzen-yoyo-reisevogn',
  'Babyzen',
  'Babyzen YOYO er verdens mest kompakte klappsykkel — godkjent som håndbagasje på fly. Perfekt for reiser og storbyliv.',
  'Kompakt reisevogn — godkjent som håndbagasje',
  199,
  999,
  2800,
  2000,
  3,
  true
from categories c where c.slug = 'babyutstyr'
on conflict (slug) do nothing;

insert into products (category_id, name, slug, brand, description, short_description, price_day, price_week, price_month, deposit_amount, minimum_rental_days, published)
select
  c.id,
  'Snüz SnüzPod Bedside Crib',
  'snuz-snuzpod-bedside-crib',
  'Snüz',
  'SnüzPod er en sidekrybbe som festes til foreldresengen og gir trygg co-sleeping. Barnet sover nær, men i sin egen trygge sone.',
  'Sidekrybbe for trygg co-sleeping ved foreldresengen',
  129,
  699,
  1900,
  1200,
  3,
  true
from categories c where c.slug = 'babyutstyr'
on conflict (slug) do nothing;

-- Knytt produkter til Bergen
insert into product_locations (product_id, location_id)
select p.id, l.id
from products p, locations l
where l.slug = 'bergen'
  and p.slug in ('moonboon-hammock-vogge', 'babyzen-yoyo-reisevogn', 'snuz-snuzpod-bedside-crib')
on conflict do nothing;

-- Lagerenheter — 2 stk av hvert produkt
insert into inventory_items (product_id, location_id, internal_name, condition, status)
select p.id, l.id, p.name || ' #001', 'good', 'available'
from products p, locations l
where l.slug = 'bergen'
  and p.slug in ('moonboon-hammock-vogge', 'babyzen-yoyo-reisevogn', 'snuz-snuzpod-bedside-crib')
on conflict do nothing;

insert into inventory_items (product_id, location_id, internal_name, condition, status)
select p.id, l.id, p.name || ' #002', 'good', 'available'
from products p, locations l
where l.slug = 'bergen'
  and p.slug in ('moonboon-hammock-vogge', 'babyzen-yoyo-reisevogn', 'snuz-snuzpod-bedside-crib')
on conflict do nothing;
