/**
 * Seed script: second batch of 10 TinyRent articles.
 * Run: node scripts/seed-articles-2.mjs
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
)

const AUTHOR = 'TinyRent'

const articles = [

  // ── 1 ─────────────────────────────────────────────────────────────────────
  {
    slug:       'babysvomming-bergen',
    author:     AUTHOR,
    published:  true,
    cover_image:'https://images.unsplash.com/photo-1560090995-01632a28895b?w=1200&q=85',

    title:   'Babysimming i Bergen: steder, tips og riktig alder',
    excerpt: 'Babysimming er en av de beste aktivitetene for de minste. Her er stedene i Bergen du kan ta med babyen i bassenget, og hva du bør vite før første gang.',
    content: `Babysimming er mer enn bare moro. Vann gir babyer en unik form for stimulering, støtter motorisk utvikling og bygger trygghet rundt vann fra tidlig alder. Og for foreldre er det en av de sjeldne aktivitetene der du selv er like aktiv som barnet.

Bergen har flere gode steder for babysimming, og behovet for spesialutstyr er minimalt.

## Når kan babyen begynne?

De fleste babysimming-tilbud tar imot babyer fra tre måneder. Årsaken er at den medfødte dykkerefleksen er sterkest i denne perioden og gradvis avtar mot fire til seks måneder.

Babyen trenger ingen ferdigheter for å delta. Det er du som holder, støtter og beveger. Babyen reagerer instinktivt på vannet.

Et råd: vent til navlestumpen er falt av og eventuelle sår etter fødsel er grodd. Er du usikker, ta en rask samtale med helsestasjonen.

## Steder for babysimming i Bergen

**Sentrum bad (Vannkanten og kommunale bassenger)**
Bergen kommune tilbyr babysimming-kurs gjennom flere av sine bad. Kursene er typisk åtte til ti ganger og koster rundt 500 til 800 kroner. Bestill tidlig, plassene fylles raskt.

**Lagunen storsenter (Rådal)**
Lagunen har et godt familierom i forbindelse med treningssenteret. Sjekk aktuelt tilbud på deres nettsider.

**Private aktører**
Flere private aktører tilbyr babysimming i varme bassenger, noen steder med enda varmere vann enn kommunale bad (rundt 32 til 34 grader). Søk etter babysimming i Bergen for oppdaterte tilbud.

![Baby i vann med forelder](https://images.unsplash.com/photo-1519505907962-0a6cb0167c73?w=800&q=80)

## Hva du trenger å ha med

- Badebleie (ikke vanlig bleie, den svulmer enormt i vann)
- Badedrakt eller badeshorts til babyen
- Stor badehåndkle, gjerne med hette
- Skift til etter badet
- Eventuell baderobe til deg selv

Babyen er utsatt for temperaturfall etter badet. Ha alt klart slik at overgangen fra basseng til tørt tøy går raskt.

## Praktiske tips

- **Spis ikke rett før.** Vent minst én time etter amming eller mating.
- **Vanntemperaturen betyr mye.** Under 30 grader kan babyer bli nedkjølte raskt. Sjekk at bassenget holder 30 til 34 grader.
- **Ikke forvent at babyen skal elske det første gang.** Noen babyer er skeptiske til å begynne med. Det er helt normalt.
- **Hold babyen tett inntil deg.** Kontakt og trygghet er det viktigste for at babyen skal slappe av i vannet.

Babysimming krever lite utstyr, men god planlegging av reiseruten gjør det enklere. Se hva vi tilbyr av babyutstyr til Bergens-turen din.`,

    title_en:   'Baby swimming in Bergen: places, tips and the right age',
    excerpt_en: 'Baby swimming is one of the best activities for young babies. Here are the places in Bergen where you can take your baby into the pool, and what to know before the first session.',
    content_en: `Baby swimming is more than just fun. Water gives babies a unique form of stimulation, supports motor development and builds confidence around water from an early age. And for parents, it is one of the rare activities where you are just as active as the baby.

Bergen has several good options for baby swimming, and the need for specialist equipment is minimal.

## When can the baby start?

Most baby swimming programmes accept babies from three months of age. The reason is that the innate diving reflex is strongest at this stage and gradually fades between four and six months.

The baby needs no skills to participate. You do the holding, supporting and moving. The baby responds instinctively to the water.

One tip: wait until the umbilical stump has fallen off and any post-birth wounds have healed. If in doubt, have a quick chat with your health visitor.

## Places for baby swimming in Bergen

**City pools (municipal baths)**
Bergen municipality offers baby swimming courses through several of its pools. Courses typically run for eight to ten sessions and cost around 500 to 800 NOK. Book early — places fill up quickly.

**Lagunen shopping centre (Rådal)**
Lagunen has a good family pool area attached to its gym. Check their website for current options.

**Private operators**
Several private providers offer baby swimming in heated pools, some with warmer water than public baths (around 32 to 34 degrees). Search for baby swimming in Bergen for current offerings.

![Baby in water with parent](https://images.unsplash.com/photo-1519505907962-0a6cb0167c73?w=800&q=80)

## What you need to bring

- Swim nappy (not a regular nappy, which swells enormously in water)
- Baby swimsuit or swim shorts
- Large towel, ideally with a hood
- A change of clothes for after the swim
- A dressing gown for yourself if you want one

Babies are prone to temperature drops after swimming. Have everything ready so the transition from pool to dry clothes is quick.

## Practical tips

- **Do not feed right before.** Wait at least one hour after breastfeeding or bottle feeding.
- **Water temperature matters.** Below 30 degrees, babies can get cold quickly. Check that the pool is 30 to 34 degrees.
- **Do not expect the baby to love it the first time.** Some babies are sceptical at first. That is completely normal.
- **Keep the baby close to you.** Contact and security are the most important things for the baby to relax in the water.

Baby swimming requires little equipment, but good preparation makes it easier. See what we offer for your Bergen trip.`,
  },

  // ── 2 ─────────────────────────────────────────────────────────────────────
  {
    slug:       'dagsturer-fra-bergen-med-baby',
    author:     AUTHOR,
    published:  true,
    cover_image:'https://images.unsplash.com/photo-1508193638397-1c4234db14d8?w=1200&q=85',

    title:   'Dagsturer fra Bergen med baby: fjorder og natur',
    excerpt: 'Bergen er porten til fjordene. Her er de beste dagsturalternativene for familier med baby, med praktiske tips om fremkommelighet og hva du bør planlegge.',
    content: `En av de store fordelene med Bergen som reisemål er at du er nær noe av verdens vakreste natur. Hardangerfjorden, Sognefjorden og Nærøyfjorden er alle innen rimelig rekkevidde for en dagstur, og mange av dem er fullt mulige med baby.

Her er de beste alternativene, rangert etter barnevennlighet.

## Osterfjorden og Osterøy (30 min fra Bergen)

Osterøy er Bergens nærmeste øy og nås med bro. Veiene er rolige, naturen er vakker og det er ingen store folkemengder. Et godt valg for en rolig dag med vogn langs sjøveien, med mulighet for nistepause og luftetur.

Osterfjorden ses best fra fergeleiet på Bruvik der det er fin utsikt og god parkeringsmulighet.

## Hardangerfjorden (1,5 time fra Bergen)

Hardangerfjorden er en av Norges vakreste fjorder og er tilgjengelig for barnefamilier. Norheimsund og Øystese er to rolige fjordtelter med:

- Flate kaiveier egnet for vogn
- Gode kafeer med plass til familier
- Fruktgårder med bærsalg i sesongen (august og september)

Unngå de bratte stiene opp til Hardangervidda om du har baby i vogn. Hold deg langs fjorden.

## Sognefjorden med Flåmsbanen (2 timer fra Bergen)

Flåm er ett av Norges mest besøkte reisemål, og med god grunn. Flåmsbanen er en av de bratteste jernbanestrekningene i verden og er tilgjengelig for alle. Vogner og barnevogner er tillatt om bord.

Tips: book billett i god tid og unngå høysesong (juli og tidlig august). Flåm kan bli overfylt. Tidlig morgen eller sen ettermiddag gir en mye roligere opplevelse.

![Fjordlandskap i Norge](https://images.unsplash.com/photo-1509355703558-9b0f15a000ab?w=800&q=80)

## Nærøyfjorden og Gudvangen

Nærøyfjorden er UNESCO-verdensarv og er noe av det vakreste du kan se fra vannet. Fjordsafari-båter fra Flåm eller Gudvangen tar deg langs fjorden, og de aller fleste er tilgjengelige med barnevogn.

Babyer tåler båtturen godt om det er stille og ikke for kaldt. Ha regnklær og ekstra lag klart uansett årstid.

## Praktiske råd for dagsturer med baby

**Transport:** Leie bil i Bergen er det enkleste. Kollektivtransport til Hardanger og Sognefjorden finnes, men med baby og bagasje er bil langt mer fleksibelt.

**Mating og stellemuligheter:** Planlegg stopp i Norheimsund, Voss eller Flåm der det finnes kafeer og offentlige toaletter. Mellom disse stedene er tilbudet tynt.

**Tidspunkt:** Start tidlig. Babyer er som regel våkne og fornøyde om morgenen. Du kan rekke mer og unngå de travleste periodene på turiststedene.

**Utstyr:** En god terrengvogn med lufthjul er overlegen på grus og ujevnt underlag langs fjordveiene. En bæresele er god backup for smale stier.

Se hva vi har av vogner og bæreseler til Bergens-turen din.`,

    title_en:   'Day trips from Bergen with a baby: fjords and nature',
    excerpt_en: 'Bergen is the gateway to the fjords. Here are the best day trip options for families with a baby, with practical tips on accessibility and what to plan ahead.',
    content_en: `One of the great advantages of Bergen as a destination is that you are close to some of the world's most beautiful nature. Hardangerfjord, Sognefjord and Nærøyfjord are all within reasonable reach for a day trip, and many are fully manageable with a baby.

Here are the best options, ranked by family-friendliness.

## Osterfjord and Osterøy (30 minutes from Bergen)

Osterøy is Bergen's nearest island and is reached by bridge. The roads are quiet, the nature is beautiful and there are no large crowds. A good choice for a relaxed day with the pram along the waterfront, with room for a picnic stop and a stroll.

Osterfjord is best seen from the Bruvik ferry quay, which has good views and parking.

## Hardangerfjord (1.5 hours from Bergen)

Hardangerfjord is one of Norway's most beautiful fjords and is accessible for families with babies. Norheimsund and Øystese are two quiet fjordside villages with:

- Flat quayside paths suitable for prams
- Good cafés with room for families
- Fruit farms selling berries in season (August and September)

Avoid the steep trails up to the Hardangervidda plateau if you have a baby in a pram. Keep to the fjordside.

## Sognefjord with the Flåm Railway (2 hours from Bergen)

Flåm is one of Norway's most visited destinations, and for good reason. The Flåm Railway is one of the steepest railway lines in the world and is accessible for everyone. Prams and strollers are allowed on board.

Tip: book your ticket well in advance and avoid peak season (July and early August). Flåm can get very crowded. Early morning or late afternoon gives a much quieter experience.

![Fjord landscape in Norway](https://images.unsplash.com/photo-1509355703558-9b0f15a000ab?w=800&q=80)

## Nærøyfjord and Gudvangen

Nærøyfjord is a UNESCO World Heritage site and is some of the most beautiful scenery you can see from the water. Fjord safari boats from Flåm or Gudvangen take you along the fjord, and most of them are accessible with a pram.

Babies handle the boat trip well when it is calm and not too cold. Have rain gear and extra layers ready regardless of the season.

## Practical advice for day trips with a baby

**Transport:** Renting a car in Bergen is the easiest option. Public transport to Hardanger and Sognefjord exists, but with a baby and luggage a car is far more flexible.

**Feeding and changing:** Plan stops in Norheimsund, Voss or Flåm where there are cafés and public toilets. Between these places, facilities are sparse.

**Timing:** Start early. Babies are generally alert and happy in the morning. You can cover more ground and avoid the busiest periods at tourist spots.

**Equipment:** A good all-terrain pram with air tyres is superior on gravel and uneven surfaces along fjord roads. A baby carrier is a good backup for narrow paths.

See what prams and carriers we have available for your Bergen trip.`,
  },

  // ── 3 ─────────────────────────────────────────────────────────────────────
  {
    slug:       'naar-trenger-barnet-ny-bilstol',
    author:     AUTHOR,
    published:  true,
    cover_image:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=85',

    title:   'Når må du bytte bilstol? En guide til de ulike trinnene',
    excerpt: 'Bilstoler har strenge grenser for vekt og høyde. Her forklarer vi nøyaktig når det er tid for bytte, og hva du skal se etter for å vite at stolen er vokst fra.',
    content: `Mange foreldre venter for lenge med å bytte bilstol. Forståelig nok, de er dyre. Men en stolen som er for liten er ikke trygg, og konsekvensene ved en ulykke kan være alvorlige.

Her er en klar og praktisk guide til når det er tid for bytte.

## Tegnene på at stolen er for liten

Uansett gruppe er det noen universelle tegn på at barnet har vokst fra stolen:

- **Hodet er over toppen av ryggstøtten.** Hodet må beskyttes ved kollisjon og skal holdes innenfor stolens beskyttelsesflate.
- **Skuldrene er over øverste skulderstroppull.** Stroppene skal gå gjennom eller over skuldrene, ikke under.
- **Vektgrensen er nådd.** Sjekk manualen. Når vektgrensen er nådd, er stolen ikke godkjent.
- **Babyen sitter fremovervendt, men er under 15 måneder.** EU-regelverket (i-Size / R129) krever bakovervendt til 15 måneder minimum.

## Fra gruppe 0/0+ til gruppe 1

Den første overgangen skjer når babyen veier rundt 13 kilo (gruppe 0+) eller 9 kilo (gruppe 0). Det er typisk mellom 9 og 12 måneder, men varierer.

Bytt når vektgrensen er nådd, ikke etter alder. Og benytt anledningen til å velge en i-Size-stol som holder barnet bakovervendt lengre, gjerne til 18 kilo.

## Bakovervendt lengst mulig

Bakovervendt er tryggere. Det er ikke en mening, det er dokumentert gjennom tiår med forskning. En bakovervendt stol fordeler kollisjonskreftene over hele rygg og nakke i stedet for å konsentrere dem i nakken.

Moderne i-Size-stoler lar barnet sitte bakovervendt til 18 kilo, noe som tilsvarer rundt tre til fire år for de fleste barn.

![Barn i sikker bakovervendt bilstol](https://images.unsplash.com/photo-1476703993599-0035a21b17a9?w=800&q=80)

## Fra gruppe 1 til gruppe 2/3

Neste overgang er fra harnessestol (med fem-punkts belte) til sittepute med bilbelte. Dette skjer typisk når barnet veier rundt 18 kilo og er mellom tre og fire år.

Ikke skynd deg på denne overgangen. En harnessestol gir bedre beskyttelse enn sittepute for yngre barn, og mange kan bruke harnessestolen til de er fire til fem år om stolen tillater det.

## Aldri kjøp brukt uten kjent historikk

En bilstol som har vært i en kollisjon kan ha usynlige strukturskader. Den ser hel ut, men holder ikke ved en ny ulykke. Kjøp alltid ny, eller brukt kun fra noen du stoler fullt på og som kan garantere at stolen aldri har vært i en ulykke.

Skal du reise til Bergen og trenger bilstol for besøket? Vi leier ut godkjente stoler i riktig størrelse for barnets alder og vekt. Levering til deg.

Se hva vi har tilgjengelig.`,

    title_en:   'When do you need to change car seat? A guide to the stages',
    excerpt_en: 'Car seats have strict weight and height limits. Here we explain exactly when it is time to move on, and what to look for to know the seat has been outgrown.',
    content_en: `Many parents wait too long to change car seat. Understandably — they are expensive. But a seat that is too small is not safe, and the consequences in an accident can be serious.

Here is a clear, practical guide to when it is time to move on.

## Signs the seat is too small

Regardless of group, there are some universal signs that the child has outgrown the seat:

- **The head is above the top of the backrest.** The head must be protected in a collision and must stay within the seat's protective area.
- **The shoulders are above the top shoulder strap slot.** The straps should run through or over the shoulders, not below them.
- **The weight limit has been reached.** Check the manual. Once the weight limit is reached, the seat is no longer approved.
- **The baby is forward-facing but under 15 months.** EU regulations (i-Size / R129) require rear-facing until at least 15 months.

## From group 0/0+ to group 1

The first transition happens when the baby weighs around 13 kg (group 0+) or 9 kg (group 0). That is typically between 9 and 12 months, but varies.

Change when the weight limit is reached, not by age. And use the opportunity to choose an i-Size seat that keeps the child rear-facing longer, ideally up to 18 kg.

## Rear-facing as long as possible

Rear-facing is safer. That is not an opinion — it is documented through decades of research. A rear-facing seat distributes the forces of a collision across the entire back and neck rather than concentrating them in the neck.

Modern i-Size seats keep the child rear-facing up to 18 kg, which is around three to four years for most children.

![Child in safe rear-facing car seat](https://images.unsplash.com/photo-1476703993599-0035a21b17a9?w=800&q=80)

## From group 1 to group 2/3

The next transition is from a harness seat (with five-point belt) to a booster cushion with seat belt. This typically happens when the child weighs around 18 kg and is between three and four years old.

Do not rush this transition. A harness seat provides better protection than a booster cushion for younger children, and many can use the harness seat until they are four to five years old if the seat allows it.

## Never buy second-hand without a known history

A car seat that has been in a collision may have invisible structural damage. It looks intact, but will not hold in a new accident. Always buy new, or second-hand only from someone you fully trust and who can guarantee the seat has never been in an accident.

Travelling to Bergen and need a car seat for your visit? We rent out approved seats in the right size for your child's age and weight. Delivered to you.

See what we have available.`,
  },

  // ── 4 ─────────────────────────────────────────────────────────────────────
  {
    slug:       'vinteraktiviteter-bergen-baby',
    author:     AUTHOR,
    published:  true,
    cover_image:'https://images.unsplash.com/photo-1517299321609-52687d1bc55a?w=1200&q=85',

    title:   'Vinteraktiviteter i Bergen med baby: 7 gode ideer',
    excerpt: 'Bergen om vinteren er kald og mørk, men også sjarmerende og overraskende familievennlig. Her er de beste aktivitetene for deg med baby i vinterbyen.',
    content: `Bergen om vinteren er ikke det første folk tenker på som reisemål. Men det burde det kanskje være. Julelysene langs Bryggen, den rolige stemningen uten sommerturister og de hyggelige kafeene som lokker med varme rom er svært godt egnet for barnefamilier.

Her er syv gode aktiviteter for deg med baby i Bergen om vinteren.

## 1. Julegaten og Bryggen i adventstiden

Fra tidlig desember er Bergen sentrum dekket av julelys og adventsstemning. Bryggen og de tilstøtende gatene er uten sidestykke i vinterskrud. Babyer elsker lys og bevegelse, og dette er en gratis opplevelse som fungerer for alle aldre.

Parkering kan være krevende. Bruk buss eller tog og trille inn fra Festplassen.

## 2. Kystmuseet (Bergens Sjøfartsmuseum)

Et overraskende godt museumsbesøk for familier med baby. Romslige rom, historisk maritime utstillinger og et personale som er vant til gjester med barnevogn. Billettkjøp på nett anbefales.

## 3. Akvariet i Bergen

Akvariet holder åpent hele vinteren og er en av Bergens beste familieattraksjoner. Babyer reagerer sterkt på farger, lys og bevegelse, og fisketankene leverer akkurat det. Det er god plass til barnevogn og et hyggelig kafeteria.

Sjekk nettsiden for tidspunkt på dyreforinger og forestillinger.

![Vinterbilde av Bergen med lys](https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=800&q=80)

## 4. Litteraturhuset Bergen

Litteraturhuset har en av Bergens beste kafeer og er et rolig og familievennlig sted å tilbringe en formiddag. Arrangementsprogrammet inkluderer noen ganger familierettede aktiviteter. Sjekk programmet på forhånd.

## 5. Indoorlek-steder

Bergen har noen innendørs lekeplasser beregnet på de minste. Disse er særlig verdifulle om vinteren og i regn. Søk etter lekerom og indoorlek i Bergen for oppdaterte alternativer, da tilbudet endrer seg.

## 6. Spa og velvære (for deg)

Mange av Bergens hoteller og spa-anlegg er åpne for dagsbesøk. Noen tillater amming og har barnestoler og skiftesteder. Dette er selvsagt mer for foreldrene enn babyen, men en rolig time i varme omgivelser gjør susen etter en lang reise.

## 7. Rolig vandring i Sandviken og langs Skuteviken

Sandviken nord for sentrum er sjarmerende i alle årstider, men om vinteren er det spesielt rolig. Kaiveiene er relativt flate, og den lille kiosken og kafeen gir mulighet for en varm pause. Turen er enkel med vogn.

## Klesvett for babyer om vinteren i Bergen

Bergen-vinteren er mild etter norsk standard, men fuktig og kald nok til at klesvett er viktig.

For babyer i vogn: kombiner ullundertøy, fleece og en heldekkende vinterkjeledress. Legg et ullpledd over i tillegg. Sjekk alltid barnets nakke og rygg for å kjenne temperatur, ikke hendene.

For babyer i bæresele: bæreselen holder babyen varm mot kroppen din. Bruk en vid ytterjakke over begge to, eller en bæreselejakke laget for to.

Trenger du vintervogn eller godt vinterutstyr til besøket i Bergen? Se hva vi har tilgjengelig.`,

    title_en:   'Winter activities in Bergen with a baby: 7 good ideas',
    excerpt_en: 'Bergen in winter is cold and dark, but also charming and surprisingly family-friendly. Here are the best activities for those with a baby in the winter city.',
    content_en: `Bergen in winter is not the first place people think of as a travel destination. But perhaps it should be. The Christmas lights along Bryggen, the relaxed atmosphere without summer tourists and the cosy cafés beckoning with warm rooms are all very well suited to families with babies.

Here are seven good activities for those with a baby in Bergen in winter.

## 1. Christmas shopping street and Bryggen in Advent

From early December, Bergen city centre is covered in Christmas lights and festive atmosphere. Bryggen and the adjacent streets are unrivalled in their winter setting. Babies love light and movement, and this is a free experience that works for all ages.

Parking can be challenging. Take a bus or train and walk in from Festplassen.

## 2. The Coastal Museum (Bergens Sjøfartsmuseum)

A surprisingly good museum visit for families with a baby. Spacious rooms, historical maritime exhibits and staff who are used to guests with prams. Online ticket purchase is recommended.

## 3. Bergen Aquarium

The Aquarium stays open throughout winter and is one of Bergen's best family attractions. Babies respond strongly to colours, light and movement, and the fish tanks deliver exactly that. There is good room for prams and a pleasant cafeteria.

Check the website for feeding times and shows.

![Winter view of Bergen with lights](https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=800&q=80)

## 4. Litteraturhuset Bergen

Litteraturhuset has one of Bergen's best cafés and is a quiet, family-friendly place to spend a morning. The events programme sometimes includes family-oriented activities. Check the programme in advance.

## 5. Indoor play spaces

Bergen has several indoor play spaces aimed at young children. These are particularly valuable in winter and rain. Search for indoor play in Bergen for current options, as the offering changes.

## 6. Spa and wellness (for you)

Many of Bergen's hotels and spa facilities are open for day visits. Some allow breastfeeding and have highchairs and changing areas. This is obviously more for the parents than the baby, but a quiet hour in warm surroundings does wonders after a long journey.

## 7. A gentle walk in Sandviken and along Skuteviken

Sandviken north of the city centre is charming in all seasons, but particularly quiet in winter. The quayside paths are relatively flat, and a small kiosk and café provide the opportunity for a warm break. The walk is easy with a pram.

## Dressing babies in winter in Bergen

Bergen's winter is mild by Norwegian standards, but damp and cold enough that layering matters.

For babies in a pram: combine wool base layer, fleece and a full-coverage winter all-in-one. Add a wool blanket on top. Always check the baby's neck and back to feel their temperature, not their hands.

For babies in a carrier: the carrier keeps the baby warm against your body. Use a wide outer jacket over both of you, or a carrier jacket made for two.

Need a winter-ready pram or good winter gear for your Bergen visit? See what we have available.`,
  },

  // ── 5 ─────────────────────────────────────────────────────────────────────
  {
    slug:       'reiseforsikring-med-baby',
    author:     AUTHOR,
    published:  true,
    cover_image:'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1200&q=85',

    title:   'Reiseforsikring med baby: det du faktisk trenger å vite',
    excerpt: 'En god reiseforsikring er viktigere enn noen gang når du reiser med baby. Her er hva du bør sjekke, hva som ofte ikke dekkes, og tips som sparer deg for ubehagelige overraskelser.',
    content: `Reiseforsikring er noe de fleste tegner uten å lese vilkårene. Det fungerer greit for en tur til Syden. Med baby er det annerledes. Her er det du faktisk bør sjekke.

## Dekning for babyen

Det første du sjekker: er babyen dekket under din forsikring, eller trenger hun/han en egen?

De fleste familiereiseforsikringer dekker barn som er registrert på polisen. Spedbabyer (under seks uker) kan i noen tilfeller ha begrenset dekning fordi de anses som nyfødte med ukjent helsehistorikk. Sjekk dette eksplisitt.

Barn som ikke er ført opp ved navn på polisen er ikke alltid automatisk dekket, selv i familiepoliser. Ring forsikringsselskapet og bekreft.

## Helsehjelp i utlandet

Medisinske utgifter er den viktigste delen av reiseforsikringen. For babyer vil du gjerne ha:

- **Ubegrenset medisinsk dekning**, ikke et tak på 500 000 kroner
- **Dekning av hjemtransport** om babyen trenger det
- **Telefonlinje til lege** (24/7 legerådgiving er gull verdt klokken to om natten)

Babyer kan bli syke plutselig og raskt. Ørebetennelse, høy feber og luftveisinfeksjoner er vanlig blant de minste på reise. Ha forsikringstelefonnummeret lett tilgjengelig.

## Bagasjeforsikring for babyutstyr

Mange tar med dyrt babyutstyr på tur: barnevogner, bilstoler, bæreseler. Sjekk hva som gjelder:

- Innsjekket bagasje er dekket av flyselskapet opp til en viss sum (typisk 1300 SDR per passasjer under Montrealkonvensjonen)
- Reiseforsikringen kan dekke mellomlegget om du har verdifullt utstyr
- Håndbagasje og gjenglemt utstyr har ofte separat tak

![Familiereise og forsikring](https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80)

## Avbestillingsforsikring

Babyer er uforutsigbare. En sykdomsperiode, en forsinket fødsel eller komplikasjoner etter fødsel kan gjøre at reisen ikke lar seg gjennomføre. Avbestillingsforsikring dekker tapte reisekostnader ved sykdom som kan dokumenteres med legeattest.

Sjekk at:
- Graviditetskomplikasjoner er inkludert (om du er gravid og reiser)
- Barnesykdom er listet som gyldig avbestillingsgrunn

## Kredittkortforsikring: nok eller ikke?

Mange stoler på kredittkortets reiseforsikring. For familier med baby er det sjelden nok. Kredittkortforsikringer har ofte:

- Lavere tak på medisinsk dekning
- Kortere forsikringsperiode (typisk 45 til 60 dager)
- Krav om at hele reisen er betalt med kortet
- Ingen eller begrenset avbestillingsdekning

En separat reiseforsikring er anbefalt for lengre reiser og for familier med barn under ett år.

## Når du er i Bergen

Norge har et godt helsevesen og alle EU/EØS-borgere har rett på nødvendig helsehjelp ved å vise det europeiske helsekortet (EHIC/EHIC-kortets etterfølger). Men dette dekker kun nødbehandling, ikke transport hjem, ikke tapt utstyr og ikke avbestilling.

Ha reiseforsikringen på plass. Det er det enkleste du gjør for reisens trygghet.

Se hva vi tilbyr av babyutstyr i Bergen, og la oss ta oss av utstyrsbiten.`,

    title_en:   'Travel insurance with a baby: what you actually need to know',
    excerpt_en: 'Good travel insurance matters more than ever when travelling with a baby. Here is what to check, what is often not covered, and tips to avoid unpleasant surprises.',
    content_en: `Travel insurance is something most people buy without reading the terms. That works fine for a beach holiday. With a baby, it is different. Here is what you should actually check.

## Coverage for the baby

The first thing to check: is the baby covered under your policy, or do they need their own?

Most family travel insurance policies cover children registered on the policy. Newborns (under six weeks) may in some cases have limited coverage because they are considered newborns with an unknown health history. Check this explicitly.

Children not listed by name on the policy are not always automatically covered, even under family policies. Call your insurer and confirm.

## Healthcare abroad

Medical expenses are the most important part of travel insurance. For babies you will want:

- **Unlimited medical coverage**, not a cap of 500,000 NOK
- **Coverage for medical repatriation** if the baby needs it
- **24/7 medical phone line** (round-the-clock doctor advice is invaluable at two in the morning)

Babies can fall ill suddenly and quickly. Ear infections, high fever and respiratory infections are common among young babies when travelling. Keep the insurance phone number easily accessible.

## Baggage insurance for baby equipment

Many people bring expensive baby equipment when travelling: prams, car seats, baby carriers. Check what applies:

- Checked baggage is covered by the airline up to a certain amount (typically 1,300 SDR per passenger under the Montreal Convention)
- Travel insurance can cover the difference if you have valuable equipment
- Hand luggage and left-behind equipment often have a separate limit

![Family travel and insurance](https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80)

## Cancellation insurance

Babies are unpredictable. A period of illness, a delayed birth or post-birth complications can make the trip impossible. Cancellation insurance covers lost travel costs for illness that can be documented with a medical certificate.

Check that:
- Pregnancy complications are included (if you are pregnant and travelling)
- Child illness is listed as a valid cancellation reason

## Credit card insurance: enough or not?

Many rely on their credit card's travel insurance. For families with a baby, it is rarely enough. Credit card insurance often has:

- Lower caps on medical coverage
- Shorter coverage periods (typically 45 to 60 days)
- A requirement that the entire trip is paid with the card
- No or limited cancellation coverage

A separate travel insurance policy is recommended for longer trips and for families with children under one year old.

## When you are in Bergen

Norway has a good healthcare system and all EU/EEA citizens are entitled to necessary healthcare by showing the European Health Insurance Card (EHIC). But this only covers emergency treatment, not transport home, not lost equipment and not cancellation.

Have your travel insurance in place. It is the simplest thing you can do for peace of mind on the journey.

See what baby equipment we offer in Bergen, and let us handle the gear.`,
  },

  // ── 6 ─────────────────────────────────────────────────────────────────────
  {
    slug:       'strandtur-med-baby',
    author:     AUTHOR,
    published:  true,
    cover_image:'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=85',

    title:   'Strandtur med baby: utstyr, solbeskyttelse og timing',
    excerpt: 'Strand og baby er en fantastisk kombinasjon, men det krever litt mer planlegging enn en vanlig tur. Her er det du trenger å vite for en trygg og hyggelig stranddag.',
    content: `Det er noe veldig fint med synet av en baby som møter havet for første gang. Sanden mellom fingrene, lydene fra bølgene og lyset som spretter over vannet er en sanseopplevelse utover det vanlige.

Men strand med baby krever planlegging. Her er det vi vet fungerer.

## Sol og UV-stråling: den viktigste delen

Babyers hud er langt mer sårbar for UV-stråling enn voksnes. Her er de viktigste reglene:

- **Under seks måneder:** ikke direkte sol i det hele tatt. Babyer under seks måneder bør holdes i skygge.
- **Over seks måneder:** bruk solkrem beregnet for babyer (mineralbasert, SPF 50+), hatt med bremme og lette klær med lang arm og ben.
- **Tid på dagen:** unngå stranden mellom 11 og 15 om sommeren. Tidlig morgen og ettermiddag er tryggere.
- **Refleksjon fra sand og vann** forsterker UV-strålingen. Selv i skyggen er eksponering høyere enn ellers.

## Utstyr til strandturen

**Nødvendig:**
- Parasoll eller telt med UV-filter (UPF 50+)
- Badebleie
- Ekstra bleier og skifte
- Babysolkrem SPF 50+
- Solhatt med bremme
- Håndkle og lett pledd å legge på
- Nok vann til amming eller flaskemat

**Veldig nyttig:**
- Strandvogn eller barnevogn med store hjul (vanlige vogner synker ned i sand)
- Bæresele for terrenget mellom parkeringen og stranden
- Sandlekepotte eller liten balje
- Kuldeelement i kjølebagen for mat og drikke

![Baby ved havet med solhatt](https://images.unsplash.com/photo-1476703993599-0035a21b17a9?w=800&q=80)

## Nær vann: sikkerhet og oppfølging

Babyer og småbarn kan drukne i svært lite vann, og det skjer raskt og stille. Grunnreglene:

- Hold aldri en baby nærmere vann enn armlengdes avstand uten aktivt grep
- La aldri en baby sove i nærheten av vann uten at en voksen er til stede
- Baderinger og oppblåsbare leker er ikke sikkerhetsutstyr

Babyer som er glad i vann er herlige å se. Men ansvaret for tilsyn er alltid 100 prosent hos den voksne.

## Når er babyen klar for å bade?

Det er ingen medisinsk grunn til å unngå bading etter at navlestumpen er falt av. Det viktigste er vanntemperaturen. Under 20 grader kjøles babyer ned raskt. 24 til 28 grader er komfortabelt.

Begynn forsiktig: vann opp til knærne mens du holder. Se hvordan babyen reagerer. De fleste babyer liker vann om temperaturen er god og du er rolig og trygg.

## Strandturer nær Bergen

Noen gode strandlokasjoner i nærheten av Bergen:

- **Sørestranden, Sotra** (40 min): hvit sand, godt tilrettelagt
- **Haakonsvern-stranden**: nærmere sentrum, fin for en rolig ettermiddag
- **Kystlinjen ved Fana**: lett tilgjengelig fra Nesttun og Bergen sør

Ha en god terrengvogn klar for tilkomsten over sand og grus. Bæreselen er din beste venn om barnevognen ikke kommer seg frem.

Se hva vi har av vogner og bæreseler til sommerferien i Bergen.`,

    title_en:   'Beach trip with a baby: equipment, sun protection and timing',
    excerpt_en: 'The beach and a baby is a wonderful combination, but it takes more planning than a regular outing. Here is what you need to know for a safe and enjoyable beach day.',
    content_en: `There is something very special about watching a baby encounter the sea for the first time. The sand between their fingers, the sounds of the waves and the light bouncing off the water is a sensory experience unlike any other.

But the beach with a baby requires planning. Here is what we know works.

## Sun and UV radiation: the most important part

Babies' skin is far more vulnerable to UV radiation than adults'. Here are the key rules:

- **Under six months:** no direct sun at all. Babies under six months should be kept in the shade.
- **Over six months:** use sunscreen designed for babies (mineral-based, SPF 50+), a wide-brimmed hat and light long-sleeved and long-legged clothing.
- **Time of day:** avoid the beach between 11am and 3pm in summer. Early morning and afternoon are safer.
- **Reflection from sand and water** amplifies UV radiation. Even in the shade, exposure is higher than usual.

## Equipment for the beach trip

**Essential:**
- Parasol or tent with UV filter (UPF 50+)
- Swim nappy
- Extra nappies and change of clothes
- Baby sunscreen SPF 50+
- Wide-brimmed sun hat
- Towel and light blanket to lie on
- Enough water for breastfeeding or bottle feeding

**Very useful:**
- Beach buggy or pram with large wheels (regular prams sink in sand)
- Baby carrier for the terrain between parking and the beach
- Small sand play tray or bucket
- Cool pack in the cool bag for food and drink

![Baby at the beach with sun hat](https://images.unsplash.com/photo-1476703993599-0035a21b17a9?w=800&q=80)

## Near water: safety and supervision

Babies and young children can drown in very little water, and it happens quickly and silently. The basic rules:

- Never let a baby closer to water than arm's reach without an active grip
- Never let a baby sleep near water without an adult present
- Inflatable rings and blow-up toys are not safety equipment

Babies who love water are wonderful to watch. But the responsibility for supervision is always 100 percent with the adult.

## When is the baby ready to go in the water?

There is no medical reason to avoid bathing after the umbilical stump has fallen off. The most important thing is water temperature. Below 20 degrees, babies cool down quickly. 24 to 28 degrees is comfortable.

Start gently: water up to the knees while you hold them. See how the baby reacts. Most babies like water if the temperature is good and you are calm and confident.

## Beach trips near Bergen

Some good beach locations near Bergen:

- **Sørestranden, Sotra** (40 min): white sand, well-equipped facilities
- **Haakonsvern beach**: closer to the city centre, good for a relaxed afternoon
- **Coastline at Fana**: easily accessible from Nesttun and south Bergen

Have a good all-terrain pram ready for the approach over sand and gravel. The baby carrier is your best friend if the pram cannot get through.

See what prams and carriers we have available for your summer visit to Bergen.`,
  },

  // ── 7 ─────────────────────────────────────────────────────────────────────
  {
    slug:       'amming-paa-reise',
    author:     AUTHOR,
    published:  true,
    cover_image:'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=1200&q=85',

    title:   'Amming på ferie: praktiske tips for reisende mødre',
    excerpt: 'Amming på reise er fullt mulig, men krever litt mer logistikk enn hjemme. Her er hva som gjør det enklere, fra flyplassen til hotellet.',
    content: `Amming er naturlig og praktisk, spesielt på reise der du ikke trenger å planlegge mat, sterilisere eller finne riktig temperatur på flasken. Men det betyr ikke at det alltid er enkelt.

Her er det vi vet hjelper, basert på erfaring fra mange reisende familier.

## Flyplassen og sikkerhetskontrollen

Morsmelk er unntatt fra regelen om 100 ml for væsker. Du kan ta med morsmelk i valgfri mengde, også i håndbagasjen. Det gjelder fersk morsmelk, frosset morsmelk og pumpermelk.

Ta med kvittering eller dokumentasjon om du pumper og frakter i kjøler. Noen flysikkerhetsansatte er usikre på reglene, og dokumentasjon sparer deg for diskusjon.

Brystpumper er tillatt i kabinen og regnes som medisinsk utstyr.

## Om bord på flyet

Du har full rett til å amme om bord. Norsk og europeisk lov beskytter amming på offentlig sted, og flykabinen er intet unntak.

Praktiske tips:
- Gangplassen gir mer bevegelsesfrihet enn midtsetene
- Ha en tynn ammeskjerf med deg om du ønsker diskresjon
- Amming under avgang og landing hjelper babyen å utjevne øretrykket

De fleste kabinpersonell er behjelpelige og vant til ammende mødre. Om du trenger varmt vann til flaskemat, bare spør.

## Hotell og leilighetsstay

De fleste hoteller har ingen problemer med amming i fellesarealene. Spør resepsjonen om et stille hjørne eller et separat rom om du trenger det.

For deg som pumper: sjekk at hotellet tilbyr kjøleskap på rommet (de fleste gjør det), og ta med en reisesterilisator om du bruker en. Mikrobølgebomber for sterilisering er lette å ta med og fungerer utmerket.

![Mor og baby, kos og varme](https://images.unsplash.com/photo-1476703993599-0035a21b17a9?w=800&q=80)

## Matproduksjon under stressfulle reiser

Det er vanlig at produksjonen påvirkes av reise, tidssoneskifte og endret rutine. Stress, lite søvn og mye inntrykk påvirker kroppen. Noen opplever midlertidig nedgang i produksjonen.

Tiltak som hjelper:
- Drikk mye vann gjennom hele reisen
- Spis regelmessig, også i krevende situasjoner
- Amme eller pumpe hyppigere de første dagene
- Ta det med ro. Produksjonen stabiliserer seg som regel etter noen dager.

## Amming i Bergen

Bergen er en by der amming er normalt og akseptert. Det er ingen steder i sentrum der du vil bli stoppet eller bedt om å bevege deg. Kafeer, museer, parker og offentlige steder er alle vennlige.

De kommunale stellerommene (i kjøpesentrene Galleriet, Kløverhuset og Xhibition) har egne rom for amming med stol og skjerming om du ønsker det.

Se hva vi tilbyr av praktisk babyutstyr til din Bergens-tur.`,

    title_en:   'Breastfeeding while travelling: practical tips for travelling mothers',
    excerpt_en: 'Breastfeeding while travelling is entirely possible, but requires a little more logistics than at home. Here is what makes it easier, from the airport to the hotel.',
    content_en: `Breastfeeding is natural and practical, especially when travelling, where you do not need to plan food, sterilise or find the right bottle temperature. But that does not mean it is always straightforward.

Here is what we know helps, based on experience from many travelling families.

## The airport and security check

Breast milk is exempt from the 100ml rule for liquids. You can bring breast milk in any quantity, including in hand luggage. This applies to fresh breast milk, frozen breast milk and pumped milk.

Bring a receipt or documentation if you pump and transport in a cool bag. Some airport security staff are uncertain about the rules, and documentation saves you from discussion.

Breast pumps are allowed in the cabin and count as medical equipment.

## On board the plane

You have every right to breastfeed on board. Norwegian and European law protects breastfeeding in public places, and the plane cabin is no exception.

Practical tips:
- An aisle seat gives more freedom of movement than middle seats
- Bring a thin nursing scarf if you prefer discretion
- Breastfeeding during take-off and landing helps the baby equalise ear pressure

Most cabin crew are helpful and used to breastfeeding mothers. If you need warm water for bottle feeding, just ask.

## Hotel and apartment stay

Most hotels have no problem with breastfeeding in communal areas. Ask at reception for a quiet corner or a separate room if you need one.

For those who pump: check the hotel has a fridge in the room (most do), and bring a travel steriliser if you use one. Microwave steam bags for sterilising are light to pack and work excellently.

![Mother and baby, warmth and closeness](https://images.unsplash.com/photo-1476703993599-0035a21b17a9?w=800&q=80)

## Milk supply during stressful travel

It is common for supply to be affected by travel, time zone changes and altered routines. Stress, little sleep and lots of new impressions affect the body. Some experience a temporary dip in supply.

Things that help:
- Drink plenty of water throughout the journey
- Eat regularly, even in demanding situations
- Feed or pump more frequently in the first few days
- Take it easy. Supply usually stabilises after a few days.

## Breastfeeding in Bergen

Bergen is a city where breastfeeding is normal and accepted. There is nowhere in the city centre where you will be stopped or asked to move. Cafés, museums, parks and public spaces are all welcoming.

The municipal changing rooms (in Galleriet, Kløverhuset and Xhibition shopping centres) have dedicated breastfeeding rooms with a chair and privacy screen if you want them.

See what practical baby equipment we offer for your Bergen trip.`,
  },

  // ── 8 ─────────────────────────────────────────────────────────────────────
  {
    slug:       'hoteller-barnefamilier-bergen',
    author:     AUTHOR,
    published:  true,
    cover_image:'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=85',

    title:   'De beste hotellene for barnefamilier i Bergen',
    excerpt: 'Ikke alle hoteller er like godt tilpasset familier med baby. Her er hva du bør se etter, og noen av de beste alternativene i Bergen.',
    content: `Et hotellrom er ditt hjem borte fra hjemmet, og med baby er kravene litt høyere enn for en solotur. Her er hva du bør sjekke og hva vi anbefaler i Bergen.

## Hva gjør et hotell familievennlig?

Ikke pris alene. De viktigste punktene for familier med baby:

**Romstype og størrelse**
Et standard dobbeltrom er trangt med barnevogn, reiseseng, stellepose og det øvrige babyapparatet. Se etter:
- Junior suiter eller familierom med ekstra plass
- Hoteller som tilbyr gratis reiseseng (babycot) ved forespørsel
- Rom i lavere etasjer (enklere om heisen er opptatt)

**Kjøkken eller kjøkkenette**
Muligheten til å varme mat, lage frokost og ha matlagring er gull verdt med baby. Se etter leilighetshoteller eller appart-hoteller om det er aktuelt.

**Parkeringsmuligheter**
Med baby og bagasje er det svært upraktisk uten bil. Sjekk at hotellet har parkering eller at det er parkering i nærheten.

**Beliggenhet**
Nær sentrum er bra, men ikke for mye støy og natteliv. Familier med baby trenger søvn, og et hotell midt i nattklubbrekkene er ikke ideelt.

## Anbefalte alternativer i Bergen

**Scandic Ørnen (sentrum)**
Et av Bergens beste sentrumshoteller for familier. Romslige rom, god frokost med barnemenyen og en beliggenhet nær alt du vil se. Tilbyr reiseseng ved forespørsel.

**Bergen Børs Hotel**
Historisk hotell rett ved Bryggen. Vakker beliggenhet, romslige rom og et personale som er vant til utenlandske gjester med barn.

**Zander K Hotel**
Designhotell med god stemning, romslige familierom og en av Bergens beste frokoststeder. Nær Bergen stasjon.

![Moderne hotellrom med utsikt](https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80)

**Airbnb og leilighetsleie**
For mange familier med baby er en leid leilighet bedre enn hotell. Du får kjøkken, mer plass og ofte bedre pris per kvadratmeter. Se etter leiligheter i Bergenske nabolag som Nordnes, Sandviken eller Møhlenpris for rolig beliggenhet nær sentrum.

## Praktiske tips ved hotellbooking med baby

- **Book rommet direkte** og oppgi eksplisitt at du reiser med baby. Da kan hotellet forberede seg.
- **Spør om stillegang.** Noen hoteller kan flytte deg bort fra heissjakt og gangtrafikk om du spør.
- **Sjekk brannrutiner.** Mange hoteller informerer ikke spontant om brannevakuering med baby. Spør resepsjonen.
- **Dobbeltsjekk reisesengbestillingen.** Det er ikke alltid de er klargjort ved innsjekk. Ring dagen før.

## Vi leverer dit du bor

Uansett om du bor på hotell, i leilighet eller hos familie i Bergen, leverer vi babyutstyret til deg. Reiseseng, barnevogn, bilstol, bæresele. Alt er klart når du ankommer.

Se hva vi har tilgjengelig.`,

    title_en:   'The best hotels for families with babies in Bergen',
    excerpt_en: 'Not all hotels are equally well suited to families with a baby. Here is what to look for, and some of the best options in Bergen.',
    content_en: `A hotel room is your home away from home, and with a baby the requirements are a little higher than for a solo trip. Here is what to check and what we recommend in Bergen.

## What makes a hotel family-friendly?

Not price alone. The most important points for families with a baby:

**Room type and size**
A standard double room is cramped with a pram, travel cot, changing bag and all the rest of the baby paraphernalia. Look for:
- Junior suites or family rooms with extra space
- Hotels that offer a free travel cot (babycot) on request
- Rooms on lower floors (easier when the lift is busy)

**Kitchen or kitchenette**
The ability to heat food, make breakfast and store food is invaluable with a baby. Look for apartment hotels if that suits you.

**Parking**
With a baby and luggage, having no car access is very impractical. Check the hotel has parking, or that there is parking nearby.

**Location**
Near the centre is good, but not too much noise and nightlife. Families with babies need sleep, and a hotel in the middle of the bar strip is not ideal.

## Recommended options in Bergen

**Scandic Ørnen (city centre)**
One of Bergen's best city centre hotels for families. Spacious rooms, good breakfast with a children's menu and a location near everything you want to see. Offers a travel cot on request.

**Bergen Børs Hotel**
Historic hotel right next to Bryggen. Beautiful location, spacious rooms and staff used to international guests with children.

**Zander K Hotel**
Design hotel with a good atmosphere, spacious family rooms and one of Bergen's best breakfast offerings. Near Bergen station.

![Modern hotel room with view](https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80)

**Airbnb and apartment rental**
For many families with a baby, a rented apartment is better than a hotel. You get a kitchen, more space and often better value per square metre. Look for apartments in Bergen neighbourhoods like Nordnes, Sandviken or Møhlenpris for a quiet location near the centre.

## Practical tips when booking a hotel with a baby

- **Book directly with the hotel** and state explicitly that you are travelling with a baby. The hotel can then prepare.
- **Ask about a quiet room.** Some hotels can move you away from lift shafts and corridor traffic if you ask.
- **Check fire evacuation procedures.** Many hotels do not spontaneously inform guests about evacuation with a baby. Ask at reception.
- **Double-check the travel cot booking.** It is not always ready at check-in. Call the day before.

## We deliver to wherever you are staying

Whether you are in a hotel, an apartment or with family in Bergen, we deliver baby equipment to you. Travel cot, pram, car seat, baby carrier. Everything is ready when you arrive.

See what we have available.`,
  },

  // ── 9 ─────────────────────────────────────────────────────────────────────
  {
    slug:       'aktiviteter-baby-0-12-maaneder',
    author:     AUTHOR,
    published:  true,
    cover_image:'https://images.unsplash.com/photo-1544049781-c5db0e2d7e2b?w=1200&q=85',

    title:   'Stimulerende aktiviteter for babyer fra 0 til 12 måneder',
    excerpt: 'Det første året er det viktigste for babyens utvikling. Her er enkle, morsomme aktiviteter som stimulerer sanser, motorikk og tilknytning, uten behov for dyrt lekeutstyr.',
    content: `Babyer trenger ikke dyre leketøy for å utvikle seg. De trenger deg, trygghet og passende stimulering tilpasset alder og utvikling. Her er en enkel guide til det første leveåret.

## 0 til 3 måneder: sansene våkner

I de første månedene er synet begrenset til omtrent 20 til 30 centimeter. Babyen ser kontraster og bevegelse bedre enn farger.

**Aktiviteter:**
- Hold ansiktet nær og snakk, syng og gjenta. Babyen er opptatt av deg.
- Svart-hvite mønstre fenger oppmerksomheten godt. Enkle bøker med høy kontrast fungerer ypperlig.
- Babymassasje gir trygghet, stimulerer huden og styrker tilknytningen.
- Lyder fra stemmen din, musikk og omgivelsene er all den stimuleringen som trengs.

## 3 til 6 måneder: bevegelse og responser

Nå begynner babyen å smile, le og reagere aktivt på deg. Hendene oppdages og gripes. Hodet løftes i mageleie.

**Aktiviteter:**
- Mageleie hver dag (på et mykt underlag med deg i nærheten). Styrker nakke- og ryggsmuskulatur.
- Rangle og enkle gribbare leker stimulerer finmotorikk.
- Speillek: babyer er fascinert av sitt eget speilbilde. Et lite trygt barnespeil er en billig og effektiv aktivitet.
- Synge og bevege armer og bein til rytme.

![Baby som leker og utforsker](https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800&q=80)

## 6 til 9 måneder: utforskning begynner

Babyen kan nå sitte med støtte, tar ting i munnen og begynner å forstå årsak og virkning. Alt på gulvet er interessant.

**Aktiviteter:**
- Gulvtid med enkle gjenstander: treklosser, plastkopper, bøtter med lokk
- Kikk-abo (bytte ansikt bak hendene): aldri utdatert, alltid morsomt
- Vann i et fat eller badekar: sensemotorisk lek med spruting og trykk
- Sanglek med bevegelse: Ro-ro-ro din båt og tilsvarende er gull

## 9 til 12 måneder: på vei til å stå

Krabbing, pulling og stående med støtte. Babyen begynner å forstå enkle ord og peke på ting.

**Aktiviteter:**
- Leggeklosser og stabling stimulerer koordinasjon og forståelse av rom
- Bøker med bilder å peke på: hva er det? Hva lager det av lyd?
- Utendørs på gress, sand og ujevnt underlag stimulerer balanse og propriosepsjon
- Dans og musikk: barneregler og rytmiske sanger med bevegelse

## En viktig note om utstyr

Du trenger svært lite kjøpt utstyr for å gjøre disse aktivitetene. Det meste av det du allerede har hjemme fungerer godt. Batteridrevne leker med lys og lyd tilfredsstiller ikke nysgjerrighet, de metter den kortvarig.

De aktivitetene som gir mest, er de der du er til stede og tilgjengelig.

Reiser du til Bergen med baby? Vi sørger for at utstyret er klart til deg. Se hva vi tilbyr.`,

    title_en:   'Stimulating activities for babies from 0 to 12 months',
    excerpt_en: 'The first year is the most important for a baby\'s development. Here are simple, fun activities that stimulate the senses, motor skills and attachment, without expensive toys.',
    content_en: `Babies do not need expensive toys to develop. They need you, security and appropriate stimulation suited to their age and stage. Here is a simple guide to the first year of life.

## 0 to 3 months: the senses wake up

In the first months, vision is limited to around 20 to 30 centimetres. The baby sees contrasts and movement better than colours.

**Activities:**
- Hold your face close and talk, sing and repeat. The baby is fascinated by you.
- Black and white patterns capture attention well. Simple high-contrast books work excellently.
- Baby massage provides security, stimulates the skin and strengthens attachment.
- Sounds from your voice, music and surroundings are all the stimulation needed.

## 3 to 6 months: movement and responses

Now the baby begins to smile, laugh and respond actively to you. Hands are discovered and grasped. The head lifts during tummy time.

**Activities:**
- Tummy time every day (on a soft surface with you nearby). Strengthens neck and back muscles.
- Rattles and simple graspable toys stimulate fine motor skills.
- Mirror play: babies are fascinated by their own reflection. A small safe baby mirror is a cheap and effective activity.
- Singing and moving arms and legs to a rhythm.

![Baby playing and exploring](https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800&q=80)

## 6 to 9 months: exploration begins

The baby can now sit with support, puts things in their mouth and begins to understand cause and effect. Everything on the floor is interesting.

**Activities:**
- Floor time with simple objects: wooden blocks, plastic cups, buckets with lids
- Peekaboo: never outdated, always fun
- Water in a basin or bath: sensorimotor play with splashing and pressure
- Movement songs: Row, Row, Row Your Boat and similar are always a hit

## 9 to 12 months: on the way to standing

Crawling, pulling up and standing with support. The baby begins to understand simple words and point at things.

**Activities:**
- Block stacking stimulates coordination and spatial understanding
- Picture books to point at: what is that? What sound does it make?
- Outdoors on grass, sand and uneven surfaces stimulates balance and proprioception
- Dance and music: nursery rhymes and rhythmic songs with movement

## An important note about equipment

You need very little bought equipment to do these activities. Most of what you already have at home works well. Battery-powered toys with lights and sounds do not satisfy curiosity — they fill it briefly.

The activities that give most are those where you are present and engaged.

Travelling to Bergen with a baby? We make sure the equipment is ready for you. See what we offer.`,
  },

  // ── 10 ────────────────────────────────────────────────────────────────────
  {
    slug:       'tips-for-forste-ferie-med-baby',
    author:     AUTHOR,
    published:  true,
    cover_image:'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200&q=85',

    title:   'Din første ferie med baby: råd fra de som har vært der',
    excerpt: 'Den første ferien med baby er en av de mest minneverdige opplevelsene du kan ha som forelder. Her er det vi ønsker at alle nylig foreldre visste på forhånd.',
    content: `Den første ferien med baby er ikke som reiser du har tatt før. Den er roligere, tregere og på mange måter dypere. Og den kan bli fantastisk om du senker forventningene til innsats og hever dem til opplevelse.

Her er det vi ønsker at alle nyforeldre visste før de dro.

## Senk ambisjonsnivået, hev forventningene

Den vanligste feilen er å planlegge for mye. Seks severdigheter på én dag fungerer ikke med baby. En til to ting per dag er et realistisk mål for de aller minste. Det høres lite ut. Det er ikke det.

Når du slutter å løpe mellom attraksjoner og begynner å sitte med kaffe ved kaikanten mens babyen ser på fuglene, oppdager du noe viktig: det er dette som faktisk er bra.

## Babyens rytme er reiselederens

Hvert forsøk på å tvinge en baby ut av sin naturlige syklus av søvn og mating ender med gråt. Babyen vinner alltid. Planlegg reisen rundt sykluser, ikke omvendt.

Det betyr at du kanskje spiser frokost klokken ni i stedet for åtte. Det betyr at du kanskje tar den lange lungen klokken elleve og spiser lunsj ute klokken halv to. Det er ikke dårlig planlegging. Det er god planlegging.

## Pakk halvparten, lei resten

Du kan ikke pakke alt. Du vil glemme noe. I Bergen er det butikker, apotek og leietilbud som dekker det meste.

Legg kreftene i å pakke det personlige og uerstattelige: medisiner, favorittfutter, klesplagg du vet fungerer. For det store og tunge: lei det på stedet.

![Familie på ferie med baby](https://images.unsplash.com/photo-1520209759809-a9bcb6cb3241?w=800&q=80)

## Det er greit å ikke ha det perfekt

Babyer kjenner din stemning. Stress, irritasjon og tilkortkommenhet smitter raskt. En rolig forelder med et delvis vellykket opplegg er langt bedre enn en stresset forelder med en perfekt timeskjema.

Når noe går galt — og noe alltid gjør — ta det med ro. Babyen husker ikke at flyet var forsinket, at det regnet hele tirsdag eller at hotellsengen var for hard. Det du husker er stemningen. Gjør stemningen god.

## Ta bilder, men vær til stede

Det er lett å bruke ferien bak telefonkameraet. Babyer endrer seg utrolig raskt det første året, og du vil dokumentere alt.

Sett av noen minutter om dagen til å fotografere. Resten av tiden, vær der. Det er ingen kamera som fanger det babyen ser i ansiktet ditt.

## Det er lov å savne hjemmet

Den første ferien med baby er emosjonelt krevende. Det er normalt å savne rutinen, sin egen seng og hverdagslivets forutsigbarhet. Det betyr ikke at ferien er mislykket. Det betyr at du er et helt vanlig menneske.

Gi deg selv rom til å savne og rom til å glede deg. Begge deler er ekte.

## Bergen er et godt sted å begynne

Bergen er en trygg by, lett å navigere, med et godt tilbud for barnefamilier og vakker natur i alle retninger. Det er ikke tilfeldig at mange velger nettopp Bergen for sin første ferie med baby.

Vi hjelper deg med utstyret. Du tar deg av resten.

Se hva vi har av babyutstyr til Bergens-turen din.`,

    title_en:   'Your first holiday with a baby: advice from those who have been there',
    excerpt_en: 'The first holiday with a baby is one of the most memorable experiences you can have as a parent. Here is what we wish all new parents knew in advance.',
    content_en: `The first holiday with a baby is not like trips you have taken before. It is quieter, slower and in many ways deeper. And it can be wonderful if you lower your expectations of effort and raise them for experience.

Here is what we wish all new parents knew before they left.

## Lower the ambition level, raise the expectations

The most common mistake is over-planning. Six sightseeing stops in one day does not work with a baby. One to two things per day is a realistic goal for the very youngest. That sounds like little. It is not.

When you stop rushing between attractions and start sitting with a coffee by the quayside while the baby watches the birds, you discover something important: this is what actually matters.

## The baby's rhythm is the tour guide

Every attempt to force a baby out of their natural cycle of sleep and feeding ends in tears. The baby always wins. Plan the trip around their cycles, not the other way around.

That means you might eat breakfast at nine instead of eight. It means you might take the long nap at eleven and eat lunch outside at half past one. That is not bad planning. It is good planning.

## Pack half, rent the rest

You cannot pack everything. You will forget something. In Bergen there are shops, pharmacies and rental services that cover most things.

Put your effort into packing the personal and irreplaceable: medicines, favourite foods, clothing you know works. For the large and heavy: rent on arrival.

![Family on holiday with a baby](https://images.unsplash.com/photo-1520209759809-a9bcb6cb3241?w=800&q=80)

## It is fine not to have it perfect

Babies feel your mood. Stress, irritation and a sense of falling short are contagious. A calm parent with a partially successful plan is far better than a stressed parent with a perfect schedule.

When something goes wrong — and something always does — take it calmly. The baby will not remember that the flight was delayed, that it rained all of Tuesday or that the hotel bed was too firm. What you remember is the atmosphere. Make the atmosphere good.

## Take photos, but be present

It is easy to spend the holiday behind the phone camera. Babies change incredibly fast in the first year, and you want to document everything.

Set aside a few minutes each day for photos. The rest of the time, be there. No camera captures what the baby sees in your face.

## It is allowed to miss home

The first holiday with a baby is emotionally demanding. It is normal to miss the routine, your own bed and the predictability of everyday life. That does not mean the holiday is a failure. It means you are a completely normal human being.

Give yourself room to miss home and room to enjoy yourself. Both are real.

## Bergen is a good place to start

Bergen is a safe city, easy to navigate, with good provision for families with children and beautiful nature in every direction. It is not by chance that many choose Bergen for their first holiday with a baby.

We help you with the equipment. You handle the rest.

See what baby equipment we have for your Bergen trip.`,
  },

]

// ─── Seed function ─────────────────────────────────────────────────────────────

async function seed() {
  console.log(`Inserting ${articles.length} articles…\n`)

  // Detect whether migration 011 (_en columns) has been run
  const { error: probeErr } = await supabase.from('articles').select('title_en').limit(1)
  const hasEnColumns = !probeErr || !probeErr.message?.includes("title_en")
  if (!hasEnColumns) {
    console.log('  ℹ  Migration 011 not yet run — inserting Norwegian content only.\n' +
                '     Run migration 011 in Supabase SQL Editor, then re-run this script\n' +
                '     to patch English content into existing rows.\n')
  }

  for (const article of articles) {
    const { data: existing } = await supabase
      .from('articles')
      .select('id, slug')
      .eq('slug', article.slug)
      .maybeSingle()

    if (existing) {
      if (hasEnColumns) {
        const { error: patchErr } = await supabase
          .from('articles')
          .update({
            title_en:   article.title_en,
            excerpt_en: article.excerpt_en,
            content_en: article.content_en,
          })
          .eq('id', existing.id)
        if (patchErr) {
          console.log(`  ⚠  "${article.slug}" exists — English patch failed: ${patchErr.message}`)
        } else {
          console.log(`  ↺  "${article.slug}" exists — English content patched`)
        }
      } else {
        console.log(`  ⚠  "${article.slug}" already exists — skipping`)
      }
      continue
    }

    const { title_en, excerpt_en, content_en, ...base } = article
    const payload = {
      ...base,
      published_at: article.published ? new Date().toISOString() : null,
      ...(hasEnColumns ? { title_en, excerpt_en, content_en } : {}),
    }

    const { error } = await supabase.from('articles').insert(payload)

    if (error) {
      console.error(`  ✗  "${article.slug}" failed:`, error.message)
    } else {
      console.log(`  ✓  "${article.slug}" inserted${hasEnColumns ? '' : ' (NO content only)'}`)
    }
  }

  console.log('\nDone.')
}

seed().catch(err => { console.error(err); process.exit(1) })
