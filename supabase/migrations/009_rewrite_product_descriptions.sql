-- ============================================================
-- Migration 009: Rewrite product short_descriptions and descriptions
-- Removes em/en dashes from editorial text. Makes language
-- more human and natural.
-- ============================================================

-- ── VOGNER ────────────────────────────────────────────────────────────────────

UPDATE products SET
  short_description = 'Ikonisk barnevogn med høy sittestilling. Barnet sitter nær deg og ser verden.',
  description = 'Stokke Xplory X er barnevognklassikeren. Den unike høye sittestillingen gjør at barnet holder kontakt med deg gjennom hele turen, og er lett å manøvrere på fortau og i butikk. Passer fra nyfødt til ca. 3,5 år (22 kg). Inkludert: sittedel, regntrekk, solfangst og vognskjerm.

Mål: L 96 cm × B 58 cm × H 112 cm. Foldet: L 88 cm × B 58 cm × H 50 cm.
Vekt: 12,4 kg (uten tilbehør).
6 høydeinnstillinger på håndtak og sete.'
WHERE slug = 'stokke-xplory-x';

UPDATE products SET
  short_description = 'Allround barnevogn med god kjørekomfort på alle underlag.',
  description = 'Bugaboo Fox 5 takler alt fra bygate til sti. Fjærende forhjul og justerbar fjæring bak gir en myk tur uansett underlag. Sittedelen reverseres enkelt, og vognen passer fra nyfødt til 22 kg. Inkludert: sittedel, regntrekk og vognskjerm.

Mål: L 94 cm × B 59 cm × H 105 cm. Vekt: 10,5 kg.
Bakhjul: 28 cm fjærende. Forhjul: 24 cm fjærende.
Kompatibel med de fleste babyskåler via adapter.'
WHERE slug = 'bugaboo-fox-5';

UPDATE products SET
  short_description = 'Kompakt og lett barnevogn for aktive familier i Bergen.',
  description = 'Thule Spring veier kun 7,4 kg og folder kompakt med én hånd. Stor handlekurv under, justerbar rygghelle og passer barn fra 6 måneder til 22 kg. Enkel å ta med på buss eller trikk.

Foldet: L 73 cm × B 45 cm × H 29 cm. Vekt: 7,4 kg.
Hjulstørrelse: 20 cm foran, 23 cm bak.
Handlekurv: 30 liter.'
WHERE slug = 'thule-spring';

UPDATE products SET
  short_description = 'Verdens mest kompakte reisevogn, godkjent som håndbagasje. Fold den på 5 sekunder og ta den med overalt.',
  description = 'Babyzen YOYO2 er lett, kompakt og godkjent som håndbagasje på Air France, KLM og mange andre flyselskaper. Veier kun 6,2 kg og folder ned til koffert-størrelse på under 5 sekunder. Perfekt for familier på reise eller i Bergen sentrum der plass er begrenset.

Passer barn fra 6 måneder til 22 kg.
Foldet: L 52 cm × B 44 cm × H 18 cm. Vekt: 6,2 kg.
Hjulstørrelse: 18 cm.'
WHERE slug = 'babyzen-yoyo2';

-- ── BILSTOLER ─────────────────────────────────────────────────────────────────

UPDATE products SET
  short_description = 'Roterbar bilstol bakovervendt til 4 år. Enkel inn og ut av bilen.',
  description = 'Cybex Sirona S i-Size er en av de beste bakovervendte bilstolene på markedet. 360° rotasjon gjør det enkelt å plassere barnet, enten du er alene eller sitter bakerst. Bakovervendt til 18 kg (ca. 4 år), deretter fremovervendt til 21 kg. Oppfyller R129 (i-Size) med utvidet sidebeskyttelse via Linear Side-impact Protection.

Passer biler med ISOFIX. Vekt: 13,3 kg.
12 regulerbare posisjoner på setet.'
WHERE slug = 'cybex-sirona-s-isize';

UPDATE products SET
  short_description = 'Premiumbabyskål med 360° rotasjon og full liggeposisjon. Enkel inn og ut av bilen, perfekt for nyfødte.',
  description = 'Cybex Cloud Z2 i-Size roterer 360° slik at du snur stolen mot døren og setter barnet inn uten å bøye deg. Kan stilles helt flatt til liggeposisjon for nyfødte. Brukes frem til 18 måneder (13 kg).

Inkluderer SensorSafe som varsler i bilen om barnet ikke har det bra.
Kompatibel med de fleste barnevognsystemer via adapter.
Passer biler med ISOFIX. Vekt: 7,8 kg (uten base).'
WHERE slug = 'cybex-cloud-z2';

UPDATE products SET
  short_description = 'Roterbar ISOFIX-stol med enkel innstilling, fra 3 måneder til 4 år.',
  description = 'Maxi-Cosi Pearl 360 roterer 360° med TinySmartMove, et enkelt løft låser opp rotasjonen. Bakovervendt anbefalt til 15 kg for best sikkerhet, fremovervendt til 17,4 kg (ca. 4 år).

Inkludert: nyfødt-innsats (brukes til 15 måneder), ISOFIX FamilyFix 360-base.
Kompatibel med Maxi-Cosi bæresystemer.'
WHERE slug = 'maxi-cosi-pearl-360';

UPDATE products SET
  short_description = 'Roterbar bakovervendt stol med god sidebeskyttelse og topp sikkerhetsvurdering.',
  description = 'Britax Römer Dualfix 5Z har SARAs sidebeskyttelsessystem som er blant de beste på markedet i sidekollisjon. Roterer 360° og er anbefalt bakovervendt til 4 år. Oppnår toppkarakter i uavhengige sikkerhetstester.

Vekt: 15 kg. Passer ISOFIX-biler.
12 ryggvinkler for komfortabel sittestilling.
Passer fra nyfødt til 18 kg.'
WHERE slug = 'britax-romer-dualfix-5z';

-- ── MATSTOLAR ─────────────────────────────────────────────────────────────────

UPDATE products SET
  short_description = 'Den legendariske vekststolen som følger barnet fra spedbarnsalder til voksen alder.',
  description = 'Stokke Tripp Trapp justeres i høyde og dybde etter barnets størrelse. Med babysett passer den fra 6 måneder. Uten passer den barn fra ca. 3 år og opp til voksen (sertifisert til 136 kg).

Laget av solid bøketre. Mål: H 79 cm × B 46 cm × D 49 cm.
Kan brukes med babysett (6 mnd til 3 år), skinnpute og lekebrett.
NB: Babysett kan leies til.'
WHERE slug = 'stokke-tripp-trapp';

UPDATE products SET
  short_description = 'Babysett til Tripp Trapp som gjør stolen klar for barn fra 6 måneder.',
  description = 'Stokke Tripp Trapp Babysett gjør den klassiske vekststolen klar fra ca. 6 måneder til 3 år (15 kg). Inkluderer ryggstøtte, bøyle og 5-punkts sele for trygg støtte. Enkel å montere og demontere.

Passer alle Tripp Trapp-stoler fra 1994 og nyere.
Leies gjerne sammen med Tripp Trapp-stolen.'
WHERE slug = 'stokke-tripp-trapp-babysett';

UPDATE products SET
  short_description = 'Den enkle og hygieniske høystolen som vaskes lett og tar minimal plass.',
  description = 'IKEA Antilop er populær nettopp fordi den er så enkel å rengjøre. Plaststativet kan tas helt fra hverandre og tørkes av på sekunder. Stikkbar bøyle inkludert. Passer barn fra ca. 6 måneder til 3 år (15 kg). Bena tas av for kompakt oppbevaring.

Inkludert: bordplate og sele.
Mål: B 56 cm × D 50 cm × H 89 cm. Sete: H 58 cm.
Vekt: 2,8 kg.'
WHERE slug = 'ikea-antilop';

-- ── SOVEMØBLER ────────────────────────────────────────────────────────────────

UPDATE products SET
  short_description = 'Ultralett reiseseng som setter seg opp og pakkes ned på sekunder.',
  description = 'BabyBjörn Reiseseng Light veier kun 5 kg og er en av de raskeste reisesengene å sette opp. Sklisikker bunn, god ventilasjon og alle deler kan vaskes i maskin. Passer barn fra nyfødt til ca. 3 år (15 kg).

Inkludert: madrass, bæreveske.
Satt opp: L 116 × B 76 × H 77 cm.
Pakket ned: L 68 × B 32 × H 13 cm. Vekt: 5 kg.'
WHERE slug = 'babybjorn-reiseseng-light';

UPDATE products SET
  short_description = 'Sideseng for trygg nattilknytning uten å dele seng.',
  description = 'Chicco Next2Me Dream festes til foreldresengen og gir trygg nattilknytning de første månedene. 9 høydeinnstillinger og justerbar vinkel for å tilpasses de fleste senger. Sidepanelet åpnes ned for enkel tilgang til barnet om natten.

Passer fra nyfødt til ca. 6 måneder (9 kg). Inkludert: madrass, overbygg og bæreveske.
Satt opp: L 82 × B 50 × H 87-107 cm.'
WHERE slug = 'chicco-next2me-dream';

UPDATE products SET
  short_description = 'Designerstilte sideseng i tre som slutter til foreldresengen for nattamming.',
  description = 'SnuzPod4 kombinerer vakker design med praktisk funksjonalitet. Laget av FSC-sertifisert bjørketre. Åpner på siden for enkel tilgang ved nattamming. Brukes som frittstående vugge eller festes til sengekanten. 8 høydejusteringer.

Passer fra nyfødt til ca. 6 måneder. Inkludert: madrass og sengetøy.
Satt opp: L 90 × B 54 × H 81-95 cm. Vekt: 11 kg.'
WHERE slug = 'snuzpod4-bedside-crib';

UPDATE products SET
  short_description = 'Smart sideavlegger som gjør nattmatingen enklere. Åpent sidepanel gir enkel tilgang til barnet.',
  description = 'SnuzPod 4 Sideavlegger hekter seg enkelt til de fleste sengerammer. Sidepanelet åpnes helt ned slik at du kan nå barnet uten å forlate sengen. Solid bjørketre med netting på sidene for god luftsirkulasjon.

Passer fra nyfødt til ca. 6 måneder (9 kg). Inkludert: madrass og hevelås.
8 høydejusteringer. Satt opp: L 90 × B 54 × H 72-96 cm.'
WHERE slug = 'snuzpod-4';

UPDATE products SET
  short_description = 'Den ikoniske hengekøya som hjelper babyen å sovne raskere. Inspirert av mors vuggebevegelser.',
  description = 'Moonboon Hengekøye er designet for å gi babyen en trygg og avslappende søvnopplevelse. Den naturlige pendelbevegelsen etterligner den rytmen babyen kjenner fra magen, og hjelper mange babyer å sovne raskere og sove lengre.

Kan henges i takfeste (inkludert) eller brukes med stativ.
Laget av 100% GOTS-sertifisert organisk bomull.
Passer nyfødte til ca. 9 måneder (9 kg). Inkludert: takfeste og justerbar oppheng.'
WHERE slug = 'moonboon-hengekøye';

-- ── BÆRESELER ─────────────────────────────────────────────────────────────────

UPDATE products SET
  short_description = 'Pustende bæresele for alle bæreposisjoner, fra nyfødt til 20 kg.',
  description = 'Ergobaby Omni Breeze er laget av SoftFlex Mesh for god luftgjennomstrømning. Praktisk i Bergen-varmen og ved aktiv bruk. Støtter 4 posisjoner: foran innover, foran utover, hofte og rygg. Passer nyfødte uten innsats takket være innebygd nyfødt-posisjon.

Vekt: 0,6 kg. Inkludert: hodestøtte og regndeksel.
Bærevekt: 3,2-20 kg.'
WHERE slug = 'ergobaby-omni-breeze';

UPDATE products SET
  short_description = 'Lett bæresele i 3D-mesh med god ventilasjon for barn og bærer.',
  description = 'BabyBjörn One Air er designet for god luftsirkulasjon med 3D-mesh på begge sider. Justeres kontinuerlig etter barnets størrelse fra nyfødt til 3 år (15 kg). Enkel å ta av og på alene.

4 bæreposisjoner: foran innover, foran utover, hofte og rygg.
Vekt: 0,6 kg. Bærevekt: 3,5-15 kg.'
WHERE slug = 'babybjorn-one-air';

-- ── AKTIVITET ─────────────────────────────────────────────────────────────────

UPDATE products SET
  short_description = 'Populært hoppestativ for aktive babyer som bygger styrke og koordinasjon.',
  description = 'BabyBjörn Hoppestativ Bliss henger i dørkarmen og gir barnet mulighet til å hoppe og rotere fritt. Justerbar høyde i 5 trinn. Mykt, ergonomisk sete. Enkel montering uten verktøy. Anbefalt fra ca. 6 måneder til barnet kan gå selvstendig (12 kg).

Maks dørbredde: 7,5 cm. Maks dørkarmstykkelse: 21 cm.
Leveres med leketøysstanga.'
WHERE slug = 'babybjorn-hoppestativ-bliss';

UPDATE products SET
  short_description = 'Kompakt babygusse med vibrasjon og beroligende lyder.',
  description = 'Fisher-Price Spacesaver Bouncer tar lite plass og gir barnet et trygt og stimulerende sted å hvile eller leke. 3 vinkelinnstillinger, vibrasjoner og 10 naturlige lyder og melodier. Justerbare benstøtter som vokser med barnet.

Passer fra nyfødt til ca. 6 måneder (9 kg).
Inkludert: leketøysbøyle med hengende leker.
Seteputene kan vaskes i maskin.'
WHERE slug = 'fisher-price-bouncer';

UPDATE products SET
  short_description = 'Klassisk balansevipp som roer babyen med naturlige bevegelser. Ingen motor, barnet styrer vippingen selv.',
  description = 'BabyBjörn Bouncer Bliss bærer babyen ergonomisk og vugger naturlig med barnets egne bevegelser. Ingen motor og ingen batteri. Den rolige vippebevegelsen hjelper mange babyer til å roe seg ned. Kan brukes fra nyfødt til 2 år (13 kg).

3 sittevinkler: ligge, halvsittende og sittende.
Stoff i organisk bomull (GOTS-sertifisert), kan vaskes i maskin.
Foldbar og lett å ta med, veier kun 1,8 kg.'
WHERE slug = 'babybjorn-balansevipp';
