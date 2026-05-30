-- ============================================================
-- TinyRent — Komplett produktdata: bilder + utfyllende beskrivelser
-- Kjør i Supabase SQL Editor
-- ============================================================
-- Oppdaterer alle 21 produkter med image_url og fulle beskrivelser.
-- Bytt gjerne ut image_url-verdier med egne bilder lastet opp via admin.
-- ============================================================

-- ── VOGNER ────────────────────────────────────────────────────────────

UPDATE products SET
  image_url = 'https://www.stokke.com/medias/sys_master/images/h3a/h5d/9086770323486.jpg',
  description = 'Stokke Xplory X er barnevognklassikeren som setter standarden. Med sin unike høye sittestilling holder barnet ditt kontakt med deg gjennom hele turen. Vognen er lett å manøvrere, har utvidet sittedel og passer fra nyfødt til ca. 3,5 år (22 kg). Inkludert: sittedel, regntrekk, solfangst og vognskjerm.

Mål: L 96 cm × B 58 cm × H 112 cm. Foldede mål: L 88 cm × B 58 cm × H 50 cm.
Vekt: 12,4 kg (uten tilbehør).
Tilpasning: 6 høydeinnstillinger på håndtak og sete.'
WHERE slug = 'stokke-xplory-x';

UPDATE products SET
  image_url = 'https://images.bugaboo.com/transform/8f9f9c3c-f5e7-4b3e-9f2a-1234567890ab/fox5-complete-black-black_main.jpg',
  description = 'Bugaboo Fox 5 er kjent for sin enestående kjørekomfort. Med fjærende forhjul og justerbar fjæring bak takler den alt fra bygate til sti. Sittedelen reverseres enkelt, og vognen vokser med barnet fra nyfødt til 22 kg. Inkludert: sittedel, regntrekk og vognskjerm.

Mål: L 94 cm × B 59 cm × H 105 cm. Vekt: 10,5 kg.
Bakhjul: 28 cm fjærende. Forhjul: 24 cm fjærende.
Kompatibel med de fleste babyskåler via adapter.'
WHERE slug = 'bugaboo-fox-5';

UPDATE products SET
  image_url = 'https://assets.thule.com/is/image/Thule/3204512-thule-spring-stroller_NW',
  description = 'Thule Spring er den perfekte dagsvognen for deg som vil ha enkelhet og god kjørekomfort. Veier kun 7,4 kg og folder kompakt med én hånd. Stor handlekurv under, justerbar rygghelle og passer barn fra 6 måneder til 22 kg.

Foldet: L 73 cm × B 45 cm × H 29 cm. Vekt: 7,4 kg.
Hjulstørrelse: 20 cm (fast), 23 cm (bakre).
Handlekurv: 30 liter.'
WHERE slug = 'thule-spring';

UPDATE products SET
  image_url = 'https://www.babyzen.com/media/catalog/product/y/o/yoyo2-6plus-stroller-black-frame-with-black-seat-pack_1.jpg',
  description = 'Babyzen YOYO2 er den ultimate reisevognen – lett, kompakt og godkjent som håndbagasje på Air France, KLM og mange andre flyselskaper. Veier kun 6,2 kg og folder ned til koffert-størrelse på under 5 sekunder. Perfekt for familier på reise eller i Bergen sentrum der plass er begrenset.

Passer barn fra 6 måneder til 22 kg. Utvidet med nyfødt-pakke (kan leies til).
Foldet: L 52 cm × B 44 cm × H 18 cm. Vekt: 6,2 kg.
Hjulstørrelse: 18 cm.',
  short_description = 'Verdens mest kompakte reisevogn – godkjent som håndbagasje. Fold den på 5 sekunder og ta den med overalt.'
WHERE slug = 'babyzen-yoyo2';

-- ── BILSTOLER ─────────────────────────────────────────────────────────

UPDATE products SET
  image_url = 'https://www.cybex-online.com/dw/image/v2/BCJH_PRD/on/demandware.static/-/Sites-master-catalog/default/dw4b4b4b4b/images/large/522003561-Sirona-S2-i-Size-Sepia-Black-5.jpg',
  description = 'Cybex Sirona S i-Size er en av markedets beste bakovervendte bilstoler. 360° rotasjon gjør det enkelt å plassere barnet i stolen. Bakovervendt til 18 kg (ca. 4 år), deretter fremovervendt til 21 kg. Oppfyller R129 (i-Size) sikkerhetsstandard med utvidet sidebeskyttelse via Linear Side-impact Protection (LSP).

Passer biler med ISOFIX. Vekt: 13,3 kg.
Sete kan reguleres i 12 posisjoner.'
WHERE slug = 'cybex-sirona-s-isize';

UPDATE products SET
  image_url = 'https://www.cybex-online.com/dw/image/v2/BCJH_PRD/on/demandware.static/-/Sites-master-catalog/default/images/large/cloud-z2-i-size-deep-black-main.jpg',
  description = 'Cybex Cloud Z2 i-Size er den ultimate premiumbabyskålen med Rotating Seat Technology. 360° rotasjon – snu til dørretning for enkel av- og påstigning. Kan stilles helt flatt til liggeposisjon for nyfødte. Brukes frem til 18 måneder (13 kg).

Inkluderer SensorSafe-teknologi (varsler ved potensielt farlige situasjoner i bilen).
Kompatibel med de fleste barnevognsystemer via adapter.
Passer biler med ISOFIX. Vekt: 7,8 kg (uten base).',
  short_description = 'Premiumbabyskål med 360° rotasjon og full liggeposisjon. Enkel inn og ut av bilen – perfekt for nyfødte.'
WHERE slug = 'cybex-cloud-z2';

UPDATE products SET
  image_url = 'https://www.maxi-cosi.com/media/catalog/product/p/e/pearl-360-essential-graphite_1.jpg',
  description = 'Maxi-Cosi Pearl 360 kombinerer sikkerhet og brukervennlighet. Den roterer 360° med TinySmartMove – et enkelt løft låser opp rotasjonen. Bakovervendt anbefalt til 15 kg for best sikkerhet. Fremovervendt til 17,4 kg (ca. 4 år).

Inkludert: nyfødt-innsats (brukes til 15 måneder), ISOFIX FamilyFix 360-base.
Kompatibel med Maxi-Cosi bæresystemer.'
WHERE slug = 'maxi-cosi-pearl-360';

UPDATE products SET
  image_url = 'https://www.britax-roemer.no/on/demandware.static/-/Sites-master-catalog-britax/default/dualfix-5z-midnight-grey-main.jpg',
  description = 'Dualfix 5Z har SARAs sidebeskyttelsessystem (Side Armouring Rear-facing Advanced) som er blant markedets beste i sidekollisjon. Roterer 360°, anbefalt bakovervendt til 4 år for maksimal sikkerhet. Oppnår toppkarakter i uavhengige sikkerhetstester.

Vekt: 15 kg. Passer ISOFIX-biler.
12 ryggvinkler for komfortabel sittestilling.
Passer fra nyfødt til 18 kg.'
WHERE slug = 'britax-romer-dualfix-5z';

-- ── MATSTOLAR ─────────────────────────────────────────────────────────

UPDATE products SET
  image_url = 'https://cdn.stokke.com/image/upload/f_auto,q_auto/v1/products/tripp-trapp/tripp-trapp-oak-natural-main',
  description = 'Stokke Tripp Trapp er en tidløs klassiker som justeres i høyde og dybde etter barnets størrelse. Med babysett passer den fra 6 måneder. Uten passer den barn fra ca. 3 år og helt opp til voksen (sertifisert til 136 kg).

Laget av solid bøketre. Mål: H 79 cm × B 46 cm × D 49 cm.
Kan leveres med babysett (6 mnd–3 år), skinnpute og lekebrett.
NB: Babysett kan leies til separat.'
WHERE slug = 'stokke-tripp-trapp';

UPDATE products SET
  image_url = 'https://cdn.stokke.com/image/upload/f_auto,q_auto/v1/products/tripp-trapp/tripp-trapp-babyset-main',
  description = 'Stokke Tripp Trapp Babysett gjør den klassiske vekststolen klar for spedbarnsbruk fra ca. 6 måneder til 3 år (15 kg). Inkluderer ryggstøtte, bøyle og 5-punkts sele for sikker støtte. Enkel montering og demontering.

Passer alle Tripp Trapp-stoler fra 1994 og nyere.
Leies gjerne i kombinasjon med Tripp Trapp-stolen.'
WHERE slug = 'stokke-tripp-trapp-babysett';

UPDATE products SET
  image_url = 'https://www.ikea.com/se/en/images/products/antilop-high-chair-with-tray-white-silver-colour__0728234_pe736255_s5.jpg',
  description = 'IKEA Antilop er en favoritt nettopp for sin enkelhet — plaststativet er ekstremt lett å rengjøre (kan tas helt fra hverandre). Stikkbar bøyle inkludert. Passer barn fra ca. 6 måneder til 3 år (15 kg). Bena kan tas av for kompakt oppbevaring.

Inkludert: bord-plate og sele.
Mål: B 56 cm × D 50 cm × H 89 cm. Sete: H 58 cm.
Vekt: 2,8 kg.'
WHERE slug = 'ikea-antilop';

-- ── SOVEMØBLER ────────────────────────────────────────────────────────

UPDATE products SET
  image_url = 'https://www.babybjorn.com/globalassets/products/baby-travel-cots/travel-crib-light/travel-crib-light-silver-3d-front-babybjorn.png',
  description = 'BabyBjörn Reiseseng Light veier kun 5 kg og er en av de raskeste reisesengene å sette opp. Sklisikker bunn, god ventilasjon og enkel å rengjøre (alle deler kan vaskes i maskin). Passer barn fra nyfødt til ca. 3 år (15 kg).

Inkludert: madrass, bæreveske.
Satt opp: L 116 × B 76 × H 77 cm.
Pakket ned: L 68 × B 32 × H 13 cm. Vekt: 5 kg.'
WHERE slug = 'babybjorn-reiseseng-light';

UPDATE products SET
  image_url = 'https://www.chicco.com/content/dam/chicco/products/sleeptime/next2me-dream/next2me-dream-natural-main-pic.jpg',
  description = 'Chicco Next2Me Dream festes til foreldresengen og gir trygg nattilknytning de første månedene. 9 høydeinnstillinger (fra 48 til 68 cm) og justerbar vinkel for å tilpasses de fleste senger. Nettsiden kan åpnes ned for enkel tilgang til barnet om natten.

Passer fra nyfødt til ca. 6 måneder (9 kg). Inkludert: madrass, overbygg og bæreveske.
Satt opp: L 82 × B 50 × H 87–107 cm.'
WHERE slug = 'chicco-next2me-dream';

UPDATE products SET
  image_url = 'https://www.snuz.co.uk/media/catalog/product/s/n/snuzpod4-bedside-crib-white-main_1.jpg',
  description = 'SnuzPod4 kombinerer vakker design med praktisk funksjonalitet. Laget av FSC-sertifisert bjørketre. Åpner på siden for enkel tilgang ved nattamming. Brukes som frittstående vugge eller festes til sengekanten. 8 høydejusteringer.

Passer fra nyfødt til ca. 6 måneder. Inkludert: madrass og sengetøy.
Satt opp: L 90 × B 54 × H 81–95 cm. Vekt: 11 kg.'
WHERE slug = 'snuzpod4-bedside-crib';

-- ── SOVING (sideavlegger + hengekøye) ────────────────────────────────

UPDATE products SET
  image_url = 'https://www.snuz.co.uk/media/catalog/product/s/n/snuzpod4-bedside-crib-white-open-main.jpg',
  description = 'SnuzPod 4 Sideavlegger er konstruert for å hekte seg trygt og enkelt til de fleste sengerammer. Sidepanelet kan åpnes helt ned slik at du kan nå barnet uten å forlate sengen – perfekt for nattamming. Robust bjørketre med mykt netting på sidene for god luftsirkulasjon.

Passer fra nyfødt til ca. 6 måneder (9 kg). Inkludert: madrass og hevelås.
Høydejusterbart 8 trinn. Satt opp: L 90 × B 54 × H 72–96 cm.',
  short_description = 'Smart sideavlegger som gjør nattmatingen enklere. Åpent sidepanel gir enkel tilgang til barnet – trygt for babyen, skånsomt for deg.'
WHERE slug = 'snuzpod-4';

UPDATE products SET
  image_url = 'https://moonboon.com/cdn/shop/products/moonboon-hammock-white-main.jpg',
  description = 'Moonboon Hengekøye er inspirert av moders vuggebevegelser og er designet for å gi babyen en trygg, avslappende søvnopplevelse. Den karakteristiske pendelbevegelsen etterligner naturens rytme og hjelper babyen til å sovne raskere og sove lengre.

Kan henges i takfeste (inkludert) eller brukes med stativ (ikke inkludert).
Laget av 100 % GOTS-sertifisert organisk bomull.
Passer nyfødte til ca. 9 måneder (9 kg). Inkludert: takfeste og justerbar oppheng.',
  short_description = 'Den ikoniske hengekøya som sover babyer rolig og trygt – inspirert av mors vuggebevegelser og naturens rytme.'
WHERE slug = 'moonboon-hengekøye';

-- ── BÆRESELER ─────────────────────────────────────────────────────────

UPDATE products SET
  image_url = 'https://images.ergobaby.com/is/image/ergobaby/AB36431-omni-breeze-onyx-black-main',
  description = 'Ergobaby Omni Breeze er laget av SoftFlex Mesh for maksimal pusteevne — perfekt i varmt vær og aktiv bruk i Bergen. Støtter 4 posisjoner: foran innover, foran utover, hofte og rygg. Fra nyfødt (3,2 kg) uten innsats takket være nyfødt-posisjon.

Vekt: 0,6 kg. Inkludert: nedbrettbar hodestøtte og regndeksel.
Bærevekt: 3,2 – 20 kg.'
WHERE slug = 'ergobaby-omni-breeze';

UPDATE products SET
  image_url = 'https://www.babybjorn.com/globalassets/products/baby-carriers/baby-carrier-one-air/baby-carrier-one-air-anthracite-3d-babybjorn.png',
  description = 'BabyBjörn One Air er designet for maksimal luftsirkulasjon med 3D-mesh som puster på begge sider. Justeres kontinuerlig etter barnets størrelse fra nyfødt til 3 år (15 kg). Enkel å ta av og på alene.

4 bæreposisjoner: foran inn, foran ut, hofteposisjon og rygg.
Vekt: 0,6 kg. Støtter fra 3,5 til 15 kg.'
WHERE slug = 'babybjorn-one-air';

-- ── AKTIVITET ─────────────────────────────────────────────────────────

UPDATE products SET
  image_url = 'https://www.babybjorn.com/globalassets/products/bouncer-and-activity-stand/activity-stand/baby-activity-stand-bliss-anthracite-3d-babybjorn.png',
  description = 'BabyBjörn Hoppestativ Bliss henger i dørkarmen og gir barnet mulighet til å hoppe og rotere fritt. Justerbar høyde i 5 trinn. Mykt, ergonomisk sete. Enkel montering uten verktøy. Anbefalt fra ca. 6 måneder til barnet kan gå selvstendig (12 kg).

Maks dørbredde: 7,5 cm. Leveres med leketøystoker.
Maks dørkarmstykkelse: 21 cm.'
WHERE slug = 'babybjorn-hoppestativ-bliss';

UPDATE products SET
  image_url = 'https://www.fisher-price.com/content/dam/fisher-price/en_US/products/GYK70-Space-Saver-Maxi-Bouncer-main.jpg',
  description = 'Fisher-Price Spacesaver Maxi Bouncer tar lite plass men gir barnet et trygt og stimulerende sted å slappe av eller leke. 3 vinkelinnstillinger, vibrasjoner og 10 naturlige lyder/melodier. Smart design med justerbare benstøtter som vokser med barnet.

Passer fra nyfødt til ca. 6 måneder (9 kg).
Inkludert: leketøysbøyle med hengende leker.
Madrassen kan vaskes i maskin.'
WHERE slug = 'fisher-price-bouncer';

-- ── BABYUTSTYR ────────────────────────────────────────────────────────

UPDATE products SET
  image_url = 'https://www.babybjorn.com/globalassets/products/baby-bouncers/baby-bouncer-bliss/color/baby-bouncer-bliss-anthracite-3d-babybjorn.png',
  description = 'BabyBjörn Bouncer Bliss bærer babyen ergonomisk korrekt og vugger naturlig med barnets egne bevegelser – ingen motor, ingen batteri. Den beroligende vippebevegelsen hjelper babyen til å roe seg ned. Kan brukes fra nyfødt til 2 år (13 kg).

3 sittevinkler: ligge, halvsittende og sittende.
Stoff i organisk bomull (GOTS-sertifisert), enkelt å vaske i maskin.
Foldbar og lett å ta med – veier kun 1,8 kg.',
  short_description = 'Klassisk balansevipp som roer babyen med naturlige bevegelser. Ingen motor – barnet styrer vippingen selv.'
WHERE slug = 'babybjorn-balansevipp';
