-- ============================================================
-- TinyRent — seed-data for produkter, kategorier og lokasjon
-- Kjør i Supabase SQL Editor
-- ============================================================

-- 1. Lokasjon (Bergen)
INSERT INTO locations (name, slug, country, active)
VALUES ('Bergen', 'bergen', 'NO', true)
ON CONFLICT (slug) DO NOTHING;

-- 2. Kategorier
INSERT INTO categories (name, slug, description, active, sort_order) VALUES
  ('Vogner',       'vogner',       'Barnevogner og kombinasjonsvogner',             true, 1),
  ('Bilstoler',    'bilstoler',    'Godkjente bilstoler for alle aldersgrupper',    true, 2),
  ('Matstolar',    'matstolar',    'Høystoler og bærestoler for måltider',          true, 3),
  ('Sovemøbler',   'sovemobler',   'Reisesenger, babynester og vugger',             true, 4),
  ('Bæreseler',    'baereseler',   'Bæreseler og bærearrangementer',                true, 5),
  ('Aktivitet',    'aktivitet',    'Hoppestativ, babygym og lekematter',            true, 6)
ON CONFLICT (slug) DO NOTHING;

-- 3. Produkter
-- Vogner
INSERT INTO products (name, slug, brand, short_description, description, price_day, price_week, price_month, deposit_amount, minimum_rental_days, published) VALUES
(
  'Stokke Xplory X',
  'stokke-xplory-x',
  'Stokke',
  'Ikonisk barnevogn med høy sittestilling — barnet ditt sitter nær deg og ser verden.',
  'Stokke Xplory X er barnevognklassikeren som setter standarden. Med sin unike høye sittestilling holder barnet ditt kontakt med deg gjennom hele turen. Vognen er lett å manøvrere, har utvidet sittedel og passer fra nyfødt til ca. 3,5 år (22 kg). Inkludert: sittedel, regntrekk, solfangst og vognskjerm.

Mål: L 96 cm × B 58 cm × H 112 cm. Foldede mål: L 88 cm × B 58 cm × H 50 cm.
Vekt: 12,4 kg (uten tilbehør).
Tilpasning: 6 høydeinnstillinger.',
  149, 599, 1499, 1000, 2, true
),
(
  'Bugaboo Fox 5',
  'bugaboo-fox-5',
  'Bugaboo',
  'Allround barnevogn med overlegen kjørekomfort — perfekt på alle underlag.',
  'Bugaboo Fox 5 er kjent for sin enestående kjørekomfort. Med fjærende forhjul og justerbar fjæring bak takler den alt fra bygate til sti. Sittedelen reverseres enkelt, og vognen vokser med barnet fra nyfødt til 22 kg. Inkludert: sittedel, regntrekk og vognskjerm.

Mål: L 94 cm × B 59 cm × H 105 cm. Vekt: 10,5 kg.',
  169, 649, 1699, 1200, 2, true
),
(
  'Thule Spring',
  'thule-spring',
  'Thule',
  'Kompakt og lettvekts barnevogn — ideell for aktive familier i Bergen.',
  'Thule Spring er den perfekte dagsvognen for deg som vil ha enkelhet og god kjørekomfort. Veier kun 7,4 kg og folder kompakt. Stor handlekurv, justerbar rygghelle og passer fra 6 måneder til 22 kg.

Mål foldet: L 73 cm × B 45 cm × H 29 cm.',
  99, 399, 999, 600, 2, true
),

-- Bilstoler
(
  'Cybex Sirona S i-Size',
  'cybex-sirona-s-isize',
  'Cybex',
  'Roterbar bilstol bakovervendt til 4 år — enkel inn og ut av bilen.',
  'Cybex Sirona S i-Size er en av markedets beste bakovervendte bilstoler. 360° rotasjon gjør det enkelt å plassere barnet i stolen. Bakovervendt til 18 kg (ca. 4 år), deretter fremovervendt til 21 kg. Oppfyller R129 (i-Size) sikkerhetsstandard.

Passer biler med ISOFIX. Vekt: 13,3 kg.',
  99, 399, 999, 1500, 2, true
),
(
  'Maxi-Cosi Pearl 360',
  'maxi-cosi-pearl-360',
  'Maxi-Cosi',
  'Roterbar ISOFIX-stol med enkel innstilling — fra 3 måneder til 4 år.',
  'Maxi-Cosi Pearl 360 kombinerer sikkerhet og brukervennlighet. Den roterer 360° for enkel inn og ut. Bakovervendt anbefalt til 15 kg. Fremovervendt til 17,4 kg. TinySmartMove-teknologi for enkel rotasjon med én hånd.

Inkludert: nyfødt-innsats, ISOFIX-base.',
  89, 349, 899, 1200, 2, true
),
(
  'Britax Römer Dualfix 5Z',
  'britax-romer-dualfix-5z',
  'Britax Römer',
  'Roterbar bakovervendt stol med innovativ sidebeskyttelse — topp sikkerhetsvurdering.',
  'Dualfix 5Z har SARAs sidebeskyttelsessystem som er utrolig effektivt i sidekollisjon. Roterer 360°, bakovervendt til 4 år. Oppnår toppkarakter i uavhengige sikkerhetstester.

Vekt: 15 kg. Passer ISOFIX-biler.',
  89, 349, 899, 1200, 2, true
),

-- Matstolar
(
  'Stokke Tripp Trapp',
  'stokke-tripp-trapp',
  'Stokke',
  'Den legendariske vekststolen — følger barnet fra spedbarnsalder til voksen alder.',
  'Stokke Tripp Trapp er en tidløs klassiker som justeres i høyde og dybde etter barnets størrelse. Med babysett (ikke inkludert) passer den fra 6 måneder. Uten passer den barn fra ca. 3 år og helt opp til voksen.

Sertifisert til 136 kg. Laget av solid bøketre. Mål: H 79 cm × B 46 cm × D 49 cm.
NB: Babysett kan leies til.',
  49, 199, 499, 400, 2, true
),
(
  'Stokke Tripp Trapp Babysett',
  'stokke-tripp-trapp-babysett',
  'Stokke',
  'Babysett til Tripp Trapp — gjør stolen klar for barn fra 6 måneder.',
  'Stokke Tripp Trapp Babysett gjør den klassiske vekststolen klar for spedbarnsbruk fra ca. 6 måneder til 3 år. Inkluderer støtte, bøyle og sele. Leies gjerne sammen med Tripp Trapp-stolen.

Passer alle Tripp Trapp-stoler fra 1994 og nyere.',
  29, 99, 249, 200, 2, true
),
(
  'IKEA Antilop',
  'ikea-antilop',
  'IKEA',
  'Den enkle og hygieniske høystolen — vaskes lett og tar minimal plass.',
  'IKEA Antilop er en favoritt for sin enkelhet — plaststativet er ekstremt lett å rengjøre. Stikkbar bøyle inkludert. Passer barn fra ca. 6 måneder til 3 år (15 kg). Bena kan tas av for kompakt oppbevaring.

Inkludert: bord-plate og sele.',
  29, 99, 249, 150, 2, true
),

-- Sovemøbler
(
  'BabyBjörn Reiseseng Light',
  'babybjorn-reiseseng-light',
  'BabyBjörn',
  'Ultralett reiseseng — setter seg opp og pakkes ned på sekunder.',
  'BabyBjörn Reiseseng Light veier kun 5 kg og er den raskeste reisesengen å sette opp. Sklisikker bunn, god ventilasjon og enkel å rengjøre. Passer barn fra nyfødt til ca. 3 år (15 kg).

Inkludert: madrass, bæreveske. Mål satt opp: L 116 × B 76 × H 77 cm.',
  79, 299, 749, 500, 2, true
),
(
  'Chicco Next2Me Dream',
  'chicco-next2me-dream',
  'Chicco',
  'Sideseng / co-sleeper — trygg nattilknytning uten å dele seng.',
  'Chicco Next2Me Dream festes til foreldresengen og gir trygg nattilknytning for de første månedene. Høyden justeres til de fleste sengene. 9 høydeinnstillinger, justerbar vinkel og enkel inn/ut av barnet.

Passer fra nyfødt til ca. 6 måneder (9 kg). Inkludert: madrass og overbygg.',
  89, 349, 899, 700, 3, true
),
(
  'SnuzPod4 Bedside Crib',
  'snuzpod4-bedside-crib',
  'Snuz',
  'Designerstilte sideseng i tre — slutter til foreldresengen for nattamming.',
  'SnuzPod4 kombinerer vakker design med praktisk funksjonalitet. Laget av FSC-sertifisert bjørketre. Åpner på siden for enkel tilgang ved nattamming. Brukes som frittstående vugge eller sideseng.

Passer fra nyfødt til ca. 6 måneder. Inkludert: madrass og sengetøy.',
  89, 349, 899, 800, 3, true
),

-- Bæreseler
(
  'Ergobaby Omni Breeze',
  'ergobaby-omni-breeze',
  'Ergobaby',
  'Pustende bæresele for alle bæreposisjoner — fra nyfødt til 20 kg.',
  'Ergobaby Omni Breeze er laget av SoftFlex Mesh for maksimal pusteevne — perfekt i varmt vær og aktiv bruk. Støtter 4 posisjoner: foran innover, foran utover, hofte og rygg. Fra nyfødt (3,2 kg) uten å bruke innsats.

Vekt: 0,6 kg. Inkludert: pute og regndeksel.',
  49, 199, 499, 500, 2, true
),
(
  'BabyBjörn One Air',
  'babybjorn-one-air',
  'BabyBjörn',
  'Lett bæresele i 3D-mesh — perfekt ventilasjon for barn og bærer.',
  'BabyBjörn One Air er designet for maksimal luftsirkulasjon. Justeres kontinuerlig etter barnets størrelse fra nyfødt til 3 år (15 kg). Enkel å ta av og på alene. Støtter alle bæreposisjoner.

Vekt: 0,6 kg.',
  49, 199, 499, 500, 2, true
),

-- Aktivitet
(
  'BabyBjörn Hoppestativ Bliss',
  'babybjorn-hoppestativ-bliss',
  'BabyBjörn',
  'Populært hoppestativ for aktive babyer — bygger styrke og koordinasjon.',
  'BabyBjörn Hoppestativ Bliss henger i dørkarmen og gir barnet mulighet til å hoppe og rotere fritt. Justerbar høyde, myk sete og enkel montering. Anbefalt fra ca. 6 måneder til barnet kan gå (12 kg).

Maks dørbredde: 7,5 cm. Leveres med leker.',
  39, 149, 399, 300, 2, true
),
(
  'Fisher-Price Spacesaver Maxi Bouncer',
  'fisher-price-bouncer',
  'Fisher-Price',
  'Kompakt babygusse med vibrasjon og beroligende lyder.',
  'Fisher-Price Spacesaver Bouncer tar lite plass men gir barnet et trygt og stimulerende sted å slappe av. 3 vinkelinnstillinger, vibrasjoner og hvit støy/melodier. Passer fra nyfødt til ca. 6 måneder (9 kg).

Inkludert: mobilmobil og leketøystoker.',
  39, 149, 299, 200, 2, true
)
ON CONFLICT (slug) DO NOTHING;

-- 4. Koble produkter til kategorier og lokasjon Bergen
DO $$
DECLARE
  bergen_id    uuid;
  vogner_id    uuid;
  bilstol_id   uuid;
  matstol_id   uuid;
  sove_id      uuid;
  baere_id     uuid;
  aktivitet_id uuid;

  p_id uuid;
BEGIN
  SELECT id INTO bergen_id  FROM locations  WHERE slug = 'bergen';
  SELECT id INTO vogner_id  FROM categories WHERE slug = 'vogner';
  SELECT id INTO bilstol_id FROM categories WHERE slug = 'bilstoler';
  SELECT id INTO matstol_id FROM categories WHERE slug = 'matstolar';
  SELECT id INTO sove_id    FROM categories WHERE slug = 'sovemobler';
  SELECT id INTO baere_id   FROM categories WHERE slug = 'baereseler';
  SELECT id INTO aktivitet_id FROM categories WHERE slug = 'aktivitet';

  -- Vogner
  FOR p_id IN SELECT id FROM products WHERE slug IN ('stokke-xplory-x','bugaboo-fox-5','thule-spring') LOOP
    UPDATE products SET category_id = vogner_id WHERE id = p_id;
    INSERT INTO product_locations (product_id, location_id) VALUES (p_id, bergen_id) ON CONFLICT DO NOTHING;
  END LOOP;

  -- Bilstoler
  FOR p_id IN SELECT id FROM products WHERE slug IN ('cybex-sirona-s-isize','maxi-cosi-pearl-360','britax-romer-dualfix-5z') LOOP
    UPDATE products SET category_id = bilstol_id WHERE id = p_id;
    INSERT INTO product_locations (product_id, location_id) VALUES (p_id, bergen_id) ON CONFLICT DO NOTHING;
  END LOOP;

  -- Matstolar
  FOR p_id IN SELECT id FROM products WHERE slug IN ('stokke-tripp-trapp','stokke-tripp-trapp-babysett','ikea-antilop') LOOP
    UPDATE products SET category_id = matstol_id WHERE id = p_id;
    INSERT INTO product_locations (product_id, location_id) VALUES (p_id, bergen_id) ON CONFLICT DO NOTHING;
  END LOOP;

  -- Sovemøbler
  FOR p_id IN SELECT id FROM products WHERE slug IN ('babybjorn-reiseseng-light','chicco-next2me-dream','snuzpod4-bedside-crib') LOOP
    UPDATE products SET category_id = sove_id WHERE id = p_id;
    INSERT INTO product_locations (product_id, location_id) VALUES (p_id, bergen_id) ON CONFLICT DO NOTHING;
  END LOOP;

  -- Bæreseler
  FOR p_id IN SELECT id FROM products WHERE slug IN ('ergobaby-omni-breeze','babybjorn-one-air') LOOP
    UPDATE products SET category_id = baere_id WHERE id = p_id;
    INSERT INTO product_locations (product_id, location_id) VALUES (p_id, bergen_id) ON CONFLICT DO NOTHING;
  END LOOP;

  -- Aktivitet
  FOR p_id IN SELECT id FROM products WHERE slug IN ('babybjorn-hoppestativ-bliss','fisher-price-bouncer') LOOP
    UPDATE products SET category_id = aktivitet_id WHERE id = p_id;
    INSERT INTO product_locations (product_id, location_id) VALUES (p_id, bergen_id) ON CONFLICT DO NOTHING;
  END LOOP;

END $$;

-- 5. Legg til 1 inventory_item per produkt (tilgjengelig i Bergen)
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
  AND NOT EXISTS (
    SELECT 1 FROM inventory_items ii WHERE ii.product_id = p.id
  );
