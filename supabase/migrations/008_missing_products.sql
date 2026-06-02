-- ============================================================
-- Migration 008: Insert missing products that 005 tried to UPDATE
-- but never existed (no INSERT in 004).
--
-- Products:
--   moonboon-hengekøye   → sovemobler
--   snuzpod-4            → sovemobler  (sideavlegger, different from snuzpod4-bedside-crib)
--   babybjorn-balansevipp → aktivitet (babyutstyr)
--   cybex-cloud-z2        → bilstoler
-- ============================================================

-- 1. Insert products
INSERT INTO products (
  name, slug, brand,
  short_description, description,
  image_url,
  price_day, price_week, price_month,
  deposit_amount, minimum_rental_days, published
) VALUES

(
  'Moonboon Hengekøye',
  'moonboon-hengekøye',
  'Moonboon',
  'Den ikoniske hengekøya som sover babyer rolig og trygt – inspirert av mors vuggebevegelser og naturens rytme.',
  'Moonboon Hengekøye er inspirert av moders vuggebevegelser og er designet for å gi babyen en trygg, avslappende søvnopplevelse. Den karakteristiske pendelbevegelsen etterligner naturens rytme og hjelper babyen til å sovne raskere og sove lengre.

Kan henges i takfeste (inkludert) eller brukes med stativ (ikke inkludert).
Laget av 100 % GOTS-sertifisert organisk bomull.
Passer nyfødte til ca. 9 måneder (9 kg). Inkludert: takfeste og justerbar oppheng.',
  'https://moonboon.com/cdn/shop/products/moonboon-hammock-white-main.jpg',
  79, 299, 749,
  500, 2, true
),

(
  'SnuzPod 4 Sideavlegger',
  'snuzpod-4',
  'Snuz',
  'Smart sideavlegger som gjør nattmatingen enklere. Åpent sidepanel gir enkel tilgang til barnet – trygt for babyen, skånsomt for deg.',
  'SnuzPod 4 Sideavlegger er konstruert for å hekte seg trygt og enkelt til de fleste sengerammer. Sidepanelet kan åpnes helt ned slik at du kan nå barnet uten å forlate sengen – perfekt for nattamming. Robust bjørketre med mykt netting på sidene for god luftsirkulasjon.

Passer fra nyfødt til ca. 6 måneder (9 kg). Inkludert: madrass og hevelås.
Høydejusterbart 8 trinn. Satt opp: L 90 × B 54 × H 72–96 cm.',
  'https://www.snuz.co.uk/media/catalog/product/s/n/snuzpod4-bedside-crib-white-open-main.jpg',
  89, 349, 899,
  700, 3, true
),

(
  'BabyBjörn Bouncer Bliss',
  'babybjorn-balansevipp',
  'BabyBjörn',
  'Klassisk balansevipp som roer babyen med naturlige bevegelser. Ingen motor – barnet styrer vippingen selv.',
  'BabyBjörn Bouncer Bliss bærer babyen ergonomisk korrekt og vugger naturlig med barnets egne bevegelser – ingen motor, ingen batteri. Den beroligende vippebevegelsen hjelper babyen til å roe seg ned. Kan brukes fra nyfødt til 2 år (13 kg).

3 sittevinkler: ligge, halvsittende og sittende.
Stoff i organisk bomull (GOTS-sertifisert), enkelt å vaske i maskin.
Foldbar og lett å ta med – veier kun 1,8 kg.',
  'https://www.babybjorn.com/globalassets/products/baby-bouncers/baby-bouncer-bliss/color/baby-bouncer-bliss-anthracite-3d-babybjorn.png',
  39, 149, 399,
  300, 2, true
),

(
  'Cybex Cloud Z2 i-Size',
  'cybex-cloud-z2',
  'Cybex',
  'Premiumbabyskål med 360° rotasjon og full liggeposisjon. Enkel inn og ut av bilen – perfekt for nyfødte.',
  'Cybex Cloud Z2 i-Size er den ultimate premiumbabyskålen med Rotating Seat Technology. 360° rotasjon – snu til dørretning for enkel av- og påstigning. Kan stilles helt flatt til liggeposisjon for nyfødte. Brukes frem til 18 måneder (13 kg).

Inkluderer SensorSafe-teknologi (varsler ved potensielt farlige situasjoner i bilen).
Kompatibel med de fleste barnevognsystemer via adapter.
Passer biler med ISOFIX. Vekt: 7,8 kg (uten base).',
  'https://www.cybex-online.com/dw/image/v2/BCJH_PRD/on/demandware.static/-/Sites-master-catalog/default/images/large/cloud-z2-i-size-deep-black-main.jpg',
  79, 299, 749,
  800, 2, true
)

ON CONFLICT (slug) DO NOTHING;

-- 2. Link products to categories and Bergen location
DO $$
DECLARE
  bergen_id     uuid;
  sove_id       uuid;
  aktivitet_id  uuid;
  bilstol_id    uuid;
  p_id          uuid;
BEGIN
  SELECT id INTO bergen_id    FROM locations  WHERE slug = 'bergen';
  SELECT id INTO sove_id      FROM categories WHERE slug = 'sovemobler';
  SELECT id INTO aktivitet_id FROM categories WHERE slug = 'aktivitet';
  SELECT id INTO bilstol_id   FROM categories WHERE slug = 'bilstoler';

  -- Moonboon hengekøye → sovemobler
  SELECT id INTO p_id FROM products WHERE slug = 'moonboon-hengekøye';
  IF p_id IS NOT NULL THEN
    UPDATE products SET category_id = sove_id WHERE id = p_id;
    INSERT INTO product_locations (product_id, location_id) VALUES (p_id, bergen_id) ON CONFLICT DO NOTHING;
  END IF;

  -- SnuzPod 4 sideavlegger → sovemobler
  SELECT id INTO p_id FROM products WHERE slug = 'snuzpod-4';
  IF p_id IS NOT NULL THEN
    UPDATE products SET category_id = sove_id WHERE id = p_id;
    INSERT INTO product_locations (product_id, location_id) VALUES (p_id, bergen_id) ON CONFLICT DO NOTHING;
  END IF;

  -- BabyBjörn Bouncer Bliss → aktivitet
  SELECT id INTO p_id FROM products WHERE slug = 'babybjorn-balansevipp';
  IF p_id IS NOT NULL THEN
    UPDATE products SET category_id = aktivitet_id WHERE id = p_id;
    INSERT INTO product_locations (product_id, location_id) VALUES (p_id, bergen_id) ON CONFLICT DO NOTHING;
  END IF;

  -- Cybex Cloud Z2 → bilstoler
  SELECT id INTO p_id FROM products WHERE slug = 'cybex-cloud-z2';
  IF p_id IS NOT NULL THEN
    UPDATE products SET category_id = bilstol_id WHERE id = p_id;
    INSERT INTO product_locations (product_id, location_id) VALUES (p_id, bergen_id) ON CONFLICT DO NOTHING;
  END IF;

END $$;

-- 3. Add inventory item (1 unit each) for new products
INSERT INTO inventory_items (product_id, location_id, internal_name, status, condition)
SELECT
  p.id,
  l.id,
  p.brand || ' ' || p.name || ' #1',
  'available',
  'good'
FROM products p
CROSS JOIN locations l
WHERE l.slug = 'bergen'
  AND p.slug IN ('moonboon-hengekøye', 'snuzpod-4', 'babybjorn-balansevipp', 'cybex-cloud-z2')
  AND NOT EXISTS (
    SELECT 1 FROM inventory_items ii WHERE ii.product_id = p.id
  );
