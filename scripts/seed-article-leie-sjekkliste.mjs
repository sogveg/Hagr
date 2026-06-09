/**
 * Inserts one article: hva-se-etter-leie-babyutstyr
 * Run: node scripts/seed-article-leie-sjekkliste.mjs
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
)

const article = {
  slug:        'hva-se-etter-leie-babyutstyr',
  author:      'TinyRent',
  published:   true,
  cover_image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=1200&q=85',

  title:   'Hva bør du se etter når du leier babyutstyr?',
  excerpt: 'Ikke all utleie er like god. Her er sjekklisten som skiller trygt og gjennomtenkt utstyr fra det du bør holde deg unna, og spørsmålene du alltid bør stille.',
  content: `Å leie babyutstyr er en smart løsning for familier på reise. Men akkurat som med alt annet du bruker til babyen din, er kvalitet og sikkerhet ikke noe du bør ta for gitt. Her er hva du bør sjekke før du bestiller.

## 1. Er utstyret godkjent og oppdatert?

Europeiske sikkerhetsstandarder for babyutstyr oppdateres jevnlig. Det viktigste å sjekke:

**Bilstoler** skal være godkjent etter ECE R44 eller den nyere i-Size-standarden (ECE R129). Stoler som kun er godkjent etter eldre standarder er lovlige å bruke, men den nyere i-Size-godkjenningen stiller strengere krav til sidekollisjonsbeskyttelse og bakovervendt bruk.

**Barnevogner og reisesenger** skal tilfredsstille EN-standardene for produktkategorien. Spør leverandøren om de kan dokumentere dette.

Utstyr som er mer enn fem til seks år gammelt bør du være forsiktig med. Sikkerhetsstandarden har endret seg, og slitasje på mekanismer og belte er vanskelig å vurdere uten grundig kontroll.

## 2. Hvordan er utstyret rengjort?

Dette er det spørsmålet de fleste glemmer å stille, og det er det viktigste.

Et godt utleiefirma bør kunne svare klart på:
- Hvilke produkter brukes til rengjøring, og er de testet for bruk rundt barn?
- Vaskes alle tekstiler mellom hver leie?
- Kontrolleres mekanismer og sikkerhetskomponenter etter hver retur?

Er svaret vagt eller fraværende, er det et dårlig tegn. Babyutstyr som ikke er grundig rengjort kan overføre bakterier, soppsporere og rester av avføring. Det er ikke overdrevet å spørre om dette.

![Rent og kontrollert babyutstyr klart til leie](https://images.unsplash.com/photo-1556909212-d5b604d0c90d?w=800&q=80)

## 3. Stemmer størrelsen med barnets alder og vekt?

Babyutstyr er ikke universelt. Feil størrelse er ikke bare upraktisk, det kan være farlig.

**Bilstol:** vekt og høyde avgjør hvilken gruppe stolen er godkjent for. En stol som er for stor for babyen gir ikke tilstrekkelig støtte. En stol barnet har vokst fra, beskytter ikke ved kollisjon.

**Reiseseng:** de fleste reisesenger er beregnet for barn opp til en viss vekt og alder. Sjekk grensen.

**Bæresele:** ergonomiske bæreseler er vanligvis tilpasset for barn fra en viss vekt (typisk fra 3,5 kg) og har en øvre grense. Sjekk at selen er korrekt justert for ditt barn, og at vektintervallet stemmer.

Gi alltid leverandøren barnets vekt og alder når du bestiller, slik at riktig utstyr velges.

## 4. Har du tilgang til bruksanvisningen?

Babyutstyr, spesielt bilstoler og bæreseler, monteres og justeres på bestemte måter. Feil montering kan nullstille sikkerhetseffekten.

En seriøs utleier leverer alltid bruksanvisningen med utstyret, enten fysisk eller som lenke til digital versjon. Har du aldri brukt modellen før, sett av tid til å lese den grundig.

For bilstoler: be gjerne om en gjennomgang av montering om du er usikker. Mange ferier starter med en bilstol som ikke er korrekt festet.

## 5. Hva skjer ved skade eller problem underveis?

Spør alltid:
- Hva er prosedyren om noe går i stykker eller ikke fungerer?
- Er det en telefon du kan ringe?
- Hva dekker eventuelt kausjon, og hva dekker den ikke?

Et trygt leieforhold er tydelig på ansvar. Unngå avtaler der alt ansvar for slitasje og feil legges på deg som leietaker uten forbehold.

## 6. Er leveransen pålitelig?

Du ankommer Bergen med fly sent om kvelden. Barnet er trøtt. Du trenger reisesengen nå. Er du trygg på at den er der?

Sjekk:
- Har leverandøren dokumenterte leveringstider og bekreftelse per e-post?
- Leveres til hotellet, leiligheten eller flyplassen?
- Finnes det kontaktinformasjon om noe er galt ved ankomst?

Logistikk og pålitelighet er minst like viktig som produktets kvalitet.

## En enkel sjekkliste

Før du bestiller, still disse spørsmålene:

- Er produktet godkjent etter gjeldende EU-standard?
- Vaskes tekstiler mellom hver leie?
- Stemmer størrelse og vektgrense med mitt barn?
- Leveres bruksanvisningen?
- Hva er ansvarsfordelingen ved skade?
- Er leveransen bekreftet og pålitelig?

Får du gode svar på alle seks, er du i trygge hender.

---

Hos TinyRent kan du lese om nøyaktig hva vi gjør mellom hver utleie, og du kan kontakte oss direkte om du har spørsmål før du bestiller. Vi leverer til hotell, leilighet og flyplass i Bergen.

Se hva vi har tilgjengelig.`,

  title_en:   'What should you look for when renting baby equipment?',
  excerpt_en: 'Not all rental services are equal. Here is the checklist that separates safe, well-considered equipment from what you should avoid, and the questions you should always ask.',
  content_en: `Renting baby equipment is a smart solution for families travelling. But just like everything else you use for your baby, quality and safety are not things you should take for granted. Here is what to check before you book.

## 1. Is the equipment approved and up to date?

European safety standards for baby equipment are updated regularly. The most important things to check:

**Car seats** should be approved to ECE R44 or the newer i-Size standard (ECE R129). Seats approved only to older standards are legal to use, but the newer i-Size approval sets stricter requirements for side-impact protection and rear-facing use.

**Prams and travel cots** should meet the EN standards for the product category. Ask the supplier if they can document this.

Equipment that is more than five to six years old should be treated with caution. Safety standards have changed, and wear on mechanisms and belts is difficult to assess without thorough inspection.

## 2. How has the equipment been cleaned?

This is the question most people forget to ask, and it is the most important one.

A good rental company should be able to answer clearly:
- What products are used for cleaning, and are they tested for use around children?
- Are all textiles washed between each rental?
- Are mechanisms and safety components checked after each return?

If the answer is vague or absent, that is a bad sign. Baby equipment that has not been thoroughly cleaned can transfer bacteria, mould spores and traces of waste. It is not an exaggeration to ask about this.

![Clean and checked baby equipment ready to rent](https://images.unsplash.com/photo-1556909212-d5b604d0c90d?w=800&q=80)

## 3. Does the size match your child's age and weight?

Baby equipment is not universal. The wrong size is not just impractical — it can be dangerous.

**Car seat:** weight and height determine which group the seat is approved for. A seat that is too large for the baby does not provide adequate support. A seat the child has outgrown does not protect in a collision.

**Travel cot:** most travel cots are designed for children up to a certain weight and age. Check the limit.

**Baby carrier:** ergonomic carriers are usually designed for children from a minimum weight (typically from 3.5 kg) and have an upper limit. Check that the carrier is correctly adjusted for your child and that the weight range is correct.

Always give the supplier your child's weight and age when booking, so the right equipment is chosen.

## 4. Do you have access to the instruction manual?

Baby equipment, especially car seats and baby carriers, is fitted and adjusted in specific ways. Incorrect fitting can nullify the safety effect.

A serious rental company always delivers the instruction manual with the equipment, either physically or as a link to a digital version. If you have never used the model before, set aside time to read it thoroughly.

For car seats: ask for a walk-through of installation if you are unsure. Many holidays start with a car seat that is not correctly secured.

## 5. What happens if something breaks or goes wrong?

Always ask:
- What is the procedure if something breaks or stops working?
- Is there a phone number you can call?
- What does any deposit cover, and what does it not cover?

A trustworthy rental arrangement is clear about responsibility. Avoid agreements where all liability for wear and faults is placed on you as the renter without qualification.

## 6. Is delivery reliable?

You arrive in Bergen on a late flight. The baby is tired. You need the travel cot now. Can you be confident it will be there?

Check:
- Does the supplier have documented delivery times and confirmation by email?
- Is delivery to the hotel, apartment or airport?
- Is there contact information if something is wrong on arrival?

Logistics and reliability are at least as important as the quality of the product.

## A simple checklist

Before you book, ask these questions:

- Is the product approved to the current EU standard?
- Are textiles washed between each rental?
- Does the size and weight limit match my child?
- Is the instruction manual included?
- What is the liability arrangement for damage?
- Is delivery confirmed and reliable?

If you get good answers to all six, you are in safe hands.

---

At TinyRent you can read exactly what we do between each rental, and you can contact us directly if you have questions before booking. We deliver to hotels, apartments and the airport in Bergen.

See what we have available.`,
}

async function seed() {
  const { error: probeErr } = await supabase.from('articles').select('title_en').limit(1)
  const hasEnColumns = !probeErr || !probeErr.message?.includes('title_en')

  const { data: existing } = await supabase
    .from('articles')
    .select('id')
    .eq('slug', article.slug)
    .maybeSingle()

  if (existing) {
    console.log(`Already exists (id: ${existing.id}) — patching…`)
    const { error } = await supabase
      .from('articles')
      .update({
        title: article.title, excerpt: article.excerpt, content: article.content,
        cover_image: article.cover_image, published: true,
        published_at: new Date().toISOString(),
        ...(hasEnColumns ? { title_en: article.title_en, excerpt_en: article.excerpt_en, content_en: article.content_en } : {}),
      })
      .eq('id', existing.id)
    console.log(error ? '✗ ' + error.message : '✓ patched')
    return
  }

  const { title_en, excerpt_en, content_en, ...base } = article
  const { error } = await supabase.from('articles').insert({
    ...base,
    published_at: new Date().toISOString(),
    ...(hasEnColumns ? { title_en, excerpt_en, content_en } : {}),
  })
  console.log(error ? '✗ ' + error.message : '✓ inserted')
}

seed().catch(err => { console.error(err); process.exit(1) })
