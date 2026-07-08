-- Migration 018: Oppdater Moonboon-beskrivelser på norsk og engelsk
UPDATE products
SET
  short_description = 'Komplett Moonboon-sett med hengekøye og elektrisk motor. Sover babyen rolig og trygt fra første dag.',
  description = 'Moonboon hengekøyen er et av markedets mest ettertraktede hjelpemidler for nyfødte. Settet inkluderer den elektriske Moonboon Baby Lift-motoren og hengekøya av 100% organisk bomull.

Motoren imiterer den rytmiske bevegelsen babyen kjenner fra mors mage, og er kjent for å roe selv de mest urolige babyene. Hengekøyen omslutter babyen mykt og trygt, og er enkel å montere i taket. Du kan fritt flytte den mellom rom.

Hengekøyen er maskinvaskbar og laget av GOTS-sertifisert organisk bomull, trygg for sart hud.

Passer fra nyfødt til ca. 6 måneder (maks 9 kg).
Inkludert: Moonboon Baby Lift-motor, hengekøye i organisk bomull og takmontert oppheng.',
  short_description_en = 'Complete Moonboon set with hammock and electric motor. Soothes even the most restless newborns to sleep.',
  description_en = 'The Moonboon baby hammock is one of the most sought-after sleep aids for newborns. This complete set includes the electric Moonboon Baby Lift motor and a hammock in 100% organic cotton.

The motor mimics the gentle, rhythmic motion babies recognise from the womb, known for calming even the most unsettled babies. The hammock wraps your baby softly and securely, and is easy to hang from the ceiling and move between rooms.

The hammock is machine washable and made from GOTS-certified organic cotton, safe for sensitive skin.

Suitable from newborn to approximately 6 months (max 9 kg).
Included: Moonboon Baby Lift motor, organic cotton hammock, and ceiling attachment.'
WHERE slug = 'moonboon-hengekoeye';
