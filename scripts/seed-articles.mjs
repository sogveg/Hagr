/**
 * Seed script: inserts all TinyRent articles into Supabase.
 * Run: node scripts/seed-articles.mjs
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
)

// ─── Article data ─────────────────────────────────────────────────────────────

const AUTHOR = 'TinyRent'

const articles = [

  // ── 1 ─────────────────────────────────────────────────────────────────────
  {
    slug:       'barnevogn-i-bergen',
    author:     AUTHOR,
    published:  true,
    cover_image:'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=1200&q=85',

    title:   'Barnevogn i Bergen: hvilken type passer best?',
    excerpt: 'Bergen er vakker, men krevende for barnevogner. Brostein, bratte bakker og mye regn stiller særlige krav til utstyret. Her er hva du bør tenke på.',
    content: `Bergen er en av Norges vakreste byer. Den er også blant de mest krevende å navigere med barnevogn. Smale smug, tung brostein på Bryggen, bratte bakker mot Fløyen og gjennomsnittlig over 200 regnværsdager i året gjør at valget av barnevogn faktisk betyr noe.

## Brostein og ujevnt underlag

Den historiske bydelen rundt Bryggen er sjarmerende, men brosteinen er tung å trille over med en lett reisevogn. Skal du utforske det beste av Bergen sentrum, bør du ha en vogn med store, luftfylte hjul, god fjæring og en solid ramme som tåler støt.

Enkle reisevogner med stive plasthjul sliter på dette underlaget. De er fine på flater og i kjøpesentre, men lite egnet for Bergens historiske gater.

## Bakker og terreng

Bergen er en by bygget rundt syv fjell. Veier og stier skråner nesten overalt. En god barnevogn her bør ha enkle, responsive bremser, god balanse selv når kurven er full, og mulighet for énhåndsmanøvrering i bratte partier.

Tenk på det som terrengsykkel-prinsippet: jo bedre hjulene takler underlaget, jo mindre energi bruker du som forelder.

## Regnet i Bergen

Det er ikke mye å komme utenom. Bergen er vått. En god vogn bør ha regnpose inkludert, eller i det minste være kompatibel med en. Sørg for at den er enkel å ta på og av, og at den dekker godt rundt sidene.

![Familie med barnevogn ute](https://images.unsplash.com/photo-1476703993599-0035a21b17a9?w=800&q=80)

## Tre typer vogner og når du bruker dem

**Terrengsporty med store lufthjul**
Passer til: Parker, grøntområder, tur langs sjøen, Fløyen.
Ikke ideell for: Trange butikker og kollektivtransport.

**Stativ- eller kombinasjonsvogn**
Passer til: Lange turer med mye utstyr, spedbarn som sover mye i vognen.
Ikke ideell for: Trapper og bratt terreng uten god fjæring.

**Lett reisevogn**
Passer til: Butikker, buss, Fløibanen.
Ikke ideell for: Brostein og Bryggen-området.

## Bæresele som supplement

Mange erfarne Bergen-foreldre bruker barnevogn og bæresele om hverandre. Bæreselen er overlegen i bratte trapper, på smale stier og på Fløyen. Vognen er bedre for lange turer og når babyen skal sove.

## Skal du ta med din egen hjemmefra?

Mange velger å ikke gjøre det. En kvalitetsvogn er tung og klumpete å reise med, og risikoen for bagasjeskader er reell. Å leie en godt vedlikeholdt vogn lokalt gjør reisen enklere fra det øyeblikket du lander.

Se hva vi har tilgjengelig av vogner og bæreseler i Bergen, og bestill med levering til dit du oppholder deg.`,

    title_en:   'Strollers in Bergen: which type works best?',
    excerpt_en: 'Bergen is beautiful, but demanding for strollers. Cobblestones, steep hills and plenty of rain place specific demands on your gear. Here is what to consider.',
    content_en: `Bergen is one of Norway's most beautiful cities. It is also one of the most demanding to navigate with a stroller. Narrow alleyways, heavy cobblestones around Bryggen, steep hills towards Fløyen and more than 200 rainy days a year mean that your choice of stroller actually matters.

## Cobblestones and uneven surfaces

The historic area around Bryggen is charming, but the cobblestones are tough on lightweight travel strollers. To explore the best of Bergen city centre, you need a stroller with large, air-filled tyres, good suspension and a solid frame that handles bumps.

Simple travel strollers with rigid plastic wheels struggle on this terrain. They work well on flat surfaces and in shopping centres, but are poorly suited for Bergen's historic streets.

## Hills and terrain

Bergen is a city built around seven mountains. Roads and paths slope almost everywhere. A good stroller here should have responsive brakes, good balance even when the storage basket is full, and the option for one-handed manoeuvring on steep sections.

Think of it like the mountain-bike principle: the better the wheels handle the terrain, the less energy you spend as a parent.

## Bergen's rain

There is no getting around it. Bergen is wet. A good stroller should include a rain cover, or at least be compatible with one. Make sure it is easy to put on and take off, and that it provides good coverage around the sides.

![Family with stroller outdoors](https://images.unsplash.com/photo-1476703993599-0035a21b17a9?w=800&q=80)

## Three types of strollers and when to use them

**All-terrain with large air tyres**
Good for: Parks, green areas, walks along the waterfront, Fløyen.
Less ideal for: Narrow shops and public transport.

**Frame or combination pram**
Good for: Long trips with lots of gear, young babies who sleep a lot in the pram.
Less ideal for: Stairs and steep terrain without good suspension.

**Lightweight travel stroller**
Good for: Shops, bus, the Fløibanen funicular.
Less ideal for: Cobblestones and the Bryggen area.

## A baby carrier as a supplement

Many experienced Bergen parents alternate between stroller and baby carrier. The carrier wins on steep stairs, narrow paths and on Fløyen. The stroller is better for long trips and when the baby needs to sleep.

## Should you bring your own from home?

Many choose not to. A quality stroller is heavy and awkward to travel with, and the risk of baggage damage is real. Renting a well-maintained stroller locally makes the trip easier from the moment you land.

See what strollers and carriers we have available in Bergen, and book with delivery to wherever you are staying.`,
  },

  // ── 2 ─────────────────────────────────────────────────────────────────────
  {
    slug:       'pakkeliste-baby-reise-bergen',
    author:     AUTHOR,
    published:  true,
    cover_image:'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&q=85',

    title:   'Komplett pakkeliste: reise til Bergen med baby',
    excerpt: 'Hva bør du ta med, og hva kan du trygt leie på stedet? Her er den ærlige pakkelisten for deg som reiser til Bergen med baby.',
    content: `Reise med baby krever planlegging. Og de fleste foreldre pakker for mye. Vi har sett hundrevis av familier komme til Bergen, og vi vet hva som faktisk trengs og hva som blir stående ubrukt i kofferten.

Her er en ærlig pakkeliste basert på erfaring.

## Ta alltid med

**Klær og tekstiler**
- Bodyer og sparkebukser: minst dobbelt så mange som du tror du trenger
- Ekstra lag for kaldt vær (Bergen er friskt, også om sommeren)
- Regnjakke og regnbukse til babyen
- Minst to sett til å sove i

**Mat og stell**
- Nok bleier for reisedagen pluss et par dagers reserve
- Favorittmaten til babyen, spesielt om hen er kresne
- Smokk og eventuelt ekstra
- Stellesaker: krem, våtservietter, sikksakksekk

**Helse og sikkerhet**
- Termometer
- Nesesuger
- Eventuelle faste medisiner
- Barnelegemidler mot feber

![Pakking til babyreise](https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800&q=80)

## Lei på stedet i Bergen

**Stort og klumpete utstyr**
- Barnevogn (veier mye, tar plass, utsatt for bagasjeskader)
- Bilstol (tung, og mange flyselskaper tillater ikke innsjekk uten ekstra kostnad)
- Reiseseng eller babynest
- Hoppestativ eller babygym

**Praktisk utstyr du kanskje ikke har tenkt på**
- Matstol (de fleste restauranter i Bergen har dem, men ikke alle)
- Bæresele (om du ikke har en med ergonomisk støtte fra før)
- Ekstra laken og innlegg til seng

## Vektgrensen på flyet

Sjekk vektgrensen for håndbagasje nøye. Med bleier, mat, klær og stelleutstyr til babyen sprenger de fleste foreldre 10 kilo raskt. Planlegg hva som sjekkes inn og hva som går i kabinen.

Tommelregelen: kjøp det du kan kjøpe i Bergen, lei det som er tungt og stort, og ta kun med det som er personlig og uerstattelig.

## Bergen-spesifikke tips

Bergen er kjølig og vått store deler av året. Ha alltid med et ekstra lag selv om det er sommer. Regnpose til vognen er uunnværlig. Og godtebretten er din venn når du skal gjennom den bratte bakken opp til Fløyen.

Se hva vi har tilgjengelig av reisesenger, vogner og bilstoler i Bergen, og bestill i god tid før du ankommer.`,

    title_en:   'Complete packing list: travelling to Bergen with a baby',
    excerpt_en: 'What should you pack, and what can you safely rent on arrival? Here is the honest packing list for travelling to Bergen with a baby.',
    content_en: `Travelling with a baby requires planning. And most parents overpack. We have seen hundreds of families arrive in Bergen, and we know what is actually needed and what ends up sitting unused at the bottom of a suitcase.

Here is an honest packing list based on experience.

## Always bring

**Clothes and textiles**
- Bodysuits and leggings: at least twice as many as you think you need
- Extra layers for cool weather (Bergen is brisk, even in summer)
- Rain jacket and trousers for the baby
- At least two sets of sleepwear

**Food and nappy changing**
- Enough nappies for travel day plus a couple of days reserve
- The baby's favourite food, especially if they are particular
- Dummy and a spare
- Changing essentials: cream, wet wipes, nappy bags

**Health and safety**
- Thermometer
- Nasal aspirator
- Any regular medications
- Children's fever medicine

![Packing for baby travel](https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800&q=80)

## Rent on arrival in Bergen

**Large and bulky equipment**
- Stroller (heavy, takes up space, and vulnerable to baggage damage)
- Car seat (heavy, and many airlines charge extra for check-in)
- Travel cot or baby nest
- Baby bouncer or activity gym

**Practical items you may not have considered**
- High chair (most Bergen restaurants have them, but not all)
- Baby carrier (if you do not already have one with ergonomic support)
- Extra sheets and liner for the cot

## Airline weight limits

Check your hand-luggage allowance carefully. With nappies, food, clothes and changing supplies, most parents exceed 10 kilograms quickly. Plan what gets checked in and what goes in the cabin.

The rule of thumb: buy what you can buy in Bergen, rent what is heavy and bulky, and only bring what is personal and irreplaceable.

## Bergen-specific tips

Bergen is cool and wet for much of the year. Always pack an extra layer even in summer. A rain cover for the stroller is essential. And the treat bag is your friend when you face the steep hill up to Fløyen.

See what travel cots, strollers and car seats we have available in Bergen, and book well before you arrive.`,
  },

  // ── 3 ─────────────────────────────────────────────────────────────────────
  {
    slug:       'bergen-med-baby-steder',
    author:     AUTHOR,
    published:  true,
    cover_image:'https://images.unsplash.com/photo-1601597111158-2fceff292cdc?w=1200&q=85',

    title:   'Bergen med baby: de beste stedene å besøke',
    excerpt: 'Bergen byr på langt mer enn Bryggen. Her er de beste stedene å utforske med barnevogn, hvor du finner roen og kafeer som tar godt imot familien.',
    content: `Bergen er en perfekt by for familier med baby. Den er liten nok til at alt er nært, og stor nok til at det alltid er noe å oppdage. Her er stedene vi anbefaler til familier med de aller minste.

## Bryggen og Vågsbunnen

Bryggen er selvsagt et must. Broesteinen kan være litt krevende med vogn, men det er fullt mulig å navigere de fleste partiene. Gå langs kaikanten der underlaget er jevnere, og ta smugene inne i trebebyggelsen til fots med en bæresele.

Vågsbunnen like bak Bryggen har sjarmerende smale gater og gode kafeer med plass til barnevogn inne.

## Byparken

Midt i sentrum ligger Byparken, en av de beste plassene i Bergen for familier med baby. Her er brede asfalterte stier egnet for vogn, grønne gressflekker til å legge på teppet og benker rundt om. Teaterkafeen rett ved siden av er barnevennlig og har gode brystematkroker.

## Nordnes og Nordnesparken

Nordnes er bydelen sør for sentrum, og en favoritt blant bergensforeldre. Nordnesparken strekker seg ut mot sjøen og har flate stier, lekeplasser og en utendørs badeplass. Solforholdene er gode om ettermiddagen, og det er sjelden fullt av folk.

![Familie i park ved sjøen](https://images.unsplash.com/photo-1476703993599-0035a21b17a9?w=800&q=80)

## Sandviken og festningen

Bergenhus festning like ved Bryggen er overraskende barnevennlig. Området rundt er åpent, flatt og fint å gå i. Haakon-hallen og Rosenkrantztårnet kan besøkes, og utenfor er det god plass til at babyen kan lufte seg på teppe.

Sandviken nordover er en roligere og sjarmerende del av Bergen med nedgraderte kai-områder og små butikker.

## Fløyen og Fløibanen

Fløibanen tar deg rett opp i fjellheimen. Selve kabinen har god plass til barnevogn, og på toppen er det kafé, romslige turveier og en lekeplass. Les gjerne vår egen guide til Fløibanen med barnevogn for detaljerte tips.

## Markedsplassen og fisketorget

Fisketorget midt i sentrum er alltid livlig og morsomt å besøke. Babyer elsker synet av levende farger og bevegelse. Det er god plass å gå med vognen, og det finnes kafeer rett i nærheten med romslige lokaler.

## Praktiske tips

**Kafeer vi anbefaler for babyer og småbarn i Bergen sentrum:**
- Kafe Kippers (Nordnes): avslappet, god plass og vennlig personale
- Det Lille Kaffekompaniet (sentrum): hjemmekoselig og barnevennlig
- Godt Brød (flere steder): god mat, plass til vogn

**I tilfelle regn:**
- Kystmuseet er overraskende bra for de minste
- KODE kunstmuseum har kafé og romslige lokaler
- Galleriet og Xhibition kjøpesenter er sentrale og tørre tilfluktssted

Bergen er godt tilrettelagt for barnefamilier, og de fleste steder er vant til vogner og ammende foreldre. Ta det med ro, følg babyens rytme og nyt byen.

Se hva vi har tilgjengelig av utstyr til Bergens-turen din.`,

    title_en:   'Bergen with a baby: the best places to visit',
    excerpt_en: 'Bergen has far more to offer than Bryggen. Here are the best places to explore with a pram, where to find peace and quiet, and cafés that genuinely welcome families.',
    content_en: `Bergen is a perfect city for families with a baby. It is small enough that everything is close by, and large enough that there is always something new to discover. Here are the places we recommend to families with young babies.

## Bryggen and Vågsbunnen

Bryggen is of course a must. The cobblestones can be a little challenging with a pram, but it is perfectly possible to navigate most sections. Walk along the quayside where the surface is smoother, and explore the narrow alleys inside the timber buildings on foot with a baby carrier.

Vågsbunnen just behind Bryggen has charming narrow streets and good cafés with room for a pram inside.

## Byparken

In the centre of the city lies Byparken, one of the best places in Bergen for families with a baby. Wide paved paths are suitable for prams, green lawns are perfect for spreading out a blanket, and there are benches throughout. Teaterkafeen right next to the park is family-friendly and has good breastfeeding corners.

## Nordnes and Nordnesparken

Nordnes is the district south of the centre, and a favourite among Bergen parents. Nordnesparken stretches out towards the sea and has flat paths, playgrounds and an outdoor swimming area. Afternoon sun is good, and it is rarely crowded.

![Family in a park by the sea](https://images.unsplash.com/photo-1476703993599-0035a21b17a9?w=800&q=80)

## Sandviken and the Fortress

Bergenhus Fortress near Bryggen is surprisingly family-friendly. The surrounding area is open, flat and pleasant to walk through. Håkonshallen and Rosenkrantz Tower can be visited, and outside there is plenty of room to let the baby air out on a blanket.

Sandviken further north is a quieter and charming part of Bergen with relaxed quayside areas and small independent shops.

## Fløyen and the Fløibanen funicular

The Fløibanen takes you straight up into the mountains. The cable car has good room for a pram, and at the top there is a café, spacious walking trails and a playground. Read our dedicated guide to Fløibanen with a pram for detailed tips.

## The market square and Fish Market

The Fish Market in the centre is always lively and fun to visit. Babies love the sight of vivid colours and movement. There is good room to walk with a pram, and cafés nearby have spacious interiors.

## Practical tips

**Cafés we recommend for babies and toddlers in Bergen centre:**
- Kafe Kippers (Nordnes): relaxed, plenty of space and friendly staff
- Det Lille Kaffekompaniet (centre): cosy and family-friendly
- Godt Brød (multiple locations): good food, room for a pram

**When it rains:**
- The Coastal Museum is surprisingly good for young children
- KODE art museum has a café and spacious rooms
- Galleriet and Xhibition shopping centres are central, dry options

Bergen is well set up for families with children, and most places are used to prams and breastfeeding parents. Take it at the baby's pace, follow their rhythm and enjoy the city.

See what equipment we have available for your Bergen trip.`,
  },

  // ── 4 ─────────────────────────────────────────────────────────────────────
  {
    slug:       'leie-vs-kjope-babyutstyr',
    author:     AUTHOR,
    published:  true,
    cover_image:'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=1200&q=85',

    title:   'Leie eller kjøpe babyutstyr på tur: en ærlig sammenligning',
    excerpt: 'Hva lønner seg egentlig? Vi regner på alternativene og ser ærlig på hva som gir mest mening for deg som er på tur med baby.',
    content: `Det er et spørsmål vi får ofte: er det ikke billigere å bare kjøpe brukt? Eller ta med det vi har hjemmefra?

Svaret avhenger av situasjonen, men for de fleste reisende familier er leie det klare fornuftsvalget. Her er en ærlig sammenligning.

## Alternativ 1: Ta med utstyret hjemmefra

**Fordeler:**
- Du kjenner utstyret fra før
- Ingen leiepris

**Ulemper:**
- En full barnevogn veier mellom 8 og 15 kilo og tar stor plass
- Flyselskaper tar 300 til 700 kroner ekstra for store innsjekket bagasje
- Bagasjeskader på barnevogner er vanlig, og erstatning er krevende
- Bilstolen er enda tyngre og mer klumpete
- Du er avhengig av at alt er klart til avreise

Regnestykket: to voksne med bagasje pluss barnevogn og bilstol som egne kolli koster ofte 800 til 1500 kroner ekstra på flyet alene, avhengig av flyselskap.

## Alternativ 2: Kjøpe brukt på stedet

**Fordeler:**
- Kan bli billig om du finner noe raskt
- Du eier det etter turen

**Ulemper:**
- Finn.no og Facebook Marketplace krever tid og logistikk
- Ingen garanti for stand og sikkerhet
- Hva gjør du med det etterpå? Selge igjen tar tid
- Bilstoler bør aldri kjøpes brukt uten kjent historikk

Regnestykket: en anstendig brukt barnevogn i Bergen koster 500 til 2000 kroner. Legg til tid brukt på søk, transport og videresalg.

![Babyutstyr av god kvalitet](https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800&q=80)

## Alternativ 3: Leie hos TinyRent

**Fordeler:**
- Utstyret er klart og rent ved ankomst
- Levert til hotellet, leiligheten eller flyplassen
- Du slipper å bekymre deg for sikkerhetsgodkjenning
- Alt er vasket, kontrollert og funksjonelt
- Ingen ekstra bagasjekostnader

**Ulemper:**
- Du eier ingenting etterpå

Regnestykket: en ukes leie av barnevogn koster typisk 400 til 700 kroner, avhengig av modell. For en uke er det langt billigere enn eksitrabagasje tur-retur, og du slipper stresset.

## Hva koster en uke i Bergen med baby?

Her er et realistisk eksempel for en familie med to voksne og én baby, én uke i Bergen:

| Utgift | Ta med | Leie |
|---|---|---|
| Barnevogn (fly tur-retur) | 900 kr | 0 kr |
| Bilstol (fly tur-retur) | 700 kr | 0 kr |
| Reiseseng | 200 kr | 0 kr |
| Leie av vogn | 0 kr | 600 kr |
| Leie av bilstol | 0 kr | 400 kr |
| Leie av reiseseng | 0 kr | 300 kr |
| **Totalt** | **1800 kr** | **1300 kr** |

Leie vinner, og det er uten å telle tid spart på pakking, køer ved innsjekk og stresset med store kolli.

## Konklusjonen

For ferieturer, kortere besøk og reiser med fly er leie nesten alltid det beste alternativet. Kjøp av brukt gir mening om du planlegger flere besøk i Bergen over tid og har et pålitelig nettverk for å kjøpe og selge.

Se hva vi har tilgjengelig, og bestill med levering til deg.`,

    title_en:   'Rent or buy baby gear when travelling: an honest comparison',
    excerpt_en: 'What actually makes more sense? We run the numbers and give an honest look at the options for travelling families.',
    content_en: `It is a question we hear often: is it not cheaper to just buy second-hand? Or bring our own gear from home?

The answer depends on your situation, but for most travelling families, renting is the clear sensible choice. Here is an honest comparison.

## Option 1: Bring your own gear from home

**Advantages:**
- You know the equipment already
- No rental fee

**Disadvantages:**
- A full stroller weighs between 8 and 15 kg and takes up a lot of space
- Airlines charge extra for large checked baggage
- Baggage damage to strollers is common, and claims can be frustrating
- Car seats are even heavier and more awkward
- You depend on everything being ready before departure

The maths: two adults with luggage plus a stroller and car seat as separate items often costs an extra 80 to 150 euros on a flight, depending on the airline.

## Option 2: Buy second-hand on arrival

**Advantages:**
- Can be cheap if you find something quickly
- You own it after the trip

**Disadvantages:**
- Online marketplaces require time and logistics
- No guarantee of condition or safety
- What do you do with it afterwards? Selling again takes time
- Car seats should never be bought second-hand without a known history

The maths: a decent second-hand stroller costs 50 to 200 euros. Add the time spent searching, collecting and reselling.

![Quality baby equipment](https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800&q=80)

## Option 3: Rent from TinyRent

**Advantages:**
- Equipment is ready and clean on arrival
- Delivered to your hotel, apartment or the airport
- No worries about safety certification
- Everything is cleaned, checked and fully functional
- No extra baggage costs

**Disadvantages:**
- You own nothing afterwards

The maths: one week's rental of a stroller typically costs 40 to 70 euros depending on the model. For a week, that is far cheaper than return excess baggage, and without the stress.

## What does a week in Bergen with a baby cost?

Here is a realistic example for a family of two adults and one baby, one week in Bergen:

| Cost | Bring own | Rent |
|---|---|---|
| Stroller (flight return) | €90 | €0 |
| Car seat (flight return) | €70 | €0 |
| Travel cot | €20 | €0 |
| Stroller rental | €0 | €60 |
| Car seat rental | €0 | €40 |
| Travel cot rental | €0 | €30 |
| **Total** | **€180** | **€130** |

Renting wins, and that is without counting the time saved on packing, baggage queues and the stress of large items.

## The conclusion

For holiday trips, shorter visits and flights, renting is almost always the better option. Buying second-hand makes sense if you plan multiple visits to Bergen over time and have a reliable local network for buying and selling.

See what we have available, and book with delivery to wherever you are staying.`,
  },

  // ── 5 ─────────────────────────────────────────────────────────────────────
  {
    slug:       'floibanen-barnevogn-tips',
    author:     AUTHOR,
    published:  true,
    cover_image:'https://images.unsplash.com/photo-1516638022313-7d4a06e8be17?w=1200&q=85',

    title:   'Fløibanen og Fløyen med barnevogn: tips for turen',
    excerpt: 'Ja, du kan ta barnevognen med i Fløibanen. Her er alt du trenger å vite for å gjøre turen til et minneverdig høydepunkt i Bergen-ferien.',
    content: `Fløibanen er Bergens mest kjente attraksjon og en opplevelse det er synd å gå glipp av, selv om du reiser med baby. Den gode nyheten: det er fullt mulig å ta turen, og mange gjør det hvert eneste år.

Her er hva du bør vite.

## Plass til barnevogn i Fløibanen

Kabinene har plass til barnevogner. Det er imidlertid begrenset med bredde, og i høysesong kan det bli trangt. Et par praktiske råd:

- Kom i god tid og informer personalet om at du har vogn. De hjelper deg om bord.
- Folde vognen om den er av typen som lar seg brette raskt.
- Alternativt: bruk bæresele i kabinen og ta vognen separat etter det høye rushet.
- Rullestolvogner og brede vogner kan kreve at du venter på en kabinrunde med mer plass.

Fløibanen-stasjonene er utstyrt med heis, så du kommer deg til og fra kabinen uten trapper.

## Fra Fløystasjon og oppover

På toppen venter kafé, lekeplass, turveier og en spektakulær utsikt over Bergen.

**Lekeplassen** ligger rett ved kafeen og er overraskende god med tanke på høyden. Mange foreldre setter pris på den spontane pausen her mens babyen lurer på alt som skjer rundt seg.

**Kafeen** serverer enkel mat og drikke. Den har varme lokaler å gå inn i, og personalet er vant til familier med barn.

**Turstiene** fra toppen er varierte. Den flate runden nærmest stasjonen er fin å gå med vogn i tørt vær. Bredere steinbelagte stier er greie, men beregn mer kraft om hjulene ikke er luftfylte.

![Utsikt fra Fløyen over Bergen](https://images.unsplash.com/photo-1558427304-c5f3e2d7f0d0?w=800&q=80)

## Bæresele-alternativet

Mange erfarne Bergen-foreldre anbefaler å ta med bæresele som backup. Dersom vognen er upraktisk i kabinen eller babyen vil se seg rundt fra en høy positur, er bæreselen overlegen på Fløyen.

En ergonomisk bæresele gjør at du kan vandre fritt på stiene mens babyen enten sover eller ser på alt som skjer.

## Praktiske tips for turen

- **Tidspunkt:** Unngå mellom 10 og 13 i høysesong. Tidlig morgen eller etter klokken 15 er roligere.
- **Vær:** Ha alltid regnpose klar. Bergen skifter raskt.
- **Mat og drikke:** Ta med litt ekstra. Kafeen på toppen kan ha kø.
- **Retur:** Du kan også gå ned. Turen er rundt 45 minutter til fots og er fin for de fleste, men ikke med barnevogn.

## En tur verdt å gjøre

Fløyen er ett av de stedene i Bergen der du virkelig forstår hvorfor folk er glad i denne byen. Med en baby på armen eller i vognen er det en av de fineste opplevelsene du kan gi dem, selv om de neppe husker det selv.

Trenger du en god vogn eller bæresele til Fløyen-turen? Se hva vi har tilgjengelig i Bergen.`,

    title_en:   'Fløibanen and Fløyen with a pram: tips for the trip',
    excerpt_en: 'Yes, you can take a pram on the Fløibanen funicular. Here is everything you need to know to make the trip a memorable highlight of your Bergen visit.',
    content_en: `The Fløibanen is Bergen's most famous attraction and an experience that is a shame to miss, even when travelling with a baby. The good news: it is perfectly possible, and many families do it every single year.

Here is what you need to know.

## Room for prams on the Fløibanen

The cable cars have room for prams. Space is limited though, and in high season it can get cramped. A few practical tips:

- Arrive in good time and let the staff know you have a pram. They will help you board.
- Fold the pram if yours folds quickly and easily.
- Alternatively, use a baby carrier inside the car and bring the pram separately after the busy rush.
- Wide prams or large frames may require waiting for a car with more room.

Both Fløibanen stations are equipped with lifts, so you can reach the cable car without stairs.

## From the top station and beyond

At the summit you will find a café, a playground, walking trails and a spectacular view over Bergen.

**The playground** sits right next to the café and is surprisingly good given the altitude. Many parents appreciate the spontaneous break while the baby takes in everything happening around them.

**The café** serves simple food and drinks. It has warm indoor seating, and the staff are used to families with children.

**The walking trails** from the top are varied. The flat loop nearest the station is fine to walk with a pram in dry weather. Wider stone-paved paths are manageable, but expect more effort if the tyres are not air-filled.

![View from Fløyen over Bergen](https://images.unsplash.com/photo-1558427304-c5f3e2d7f0d0?w=800&q=80)

## The baby carrier alternative

Many experienced Bergen parents recommend bringing a carrier as backup. If the pram is impractical inside the cable car, or the baby wants to see the world from a higher vantage point, the carrier is superior on Fløyen.

An ergonomic baby carrier lets you wander freely on the trails while the baby either sleeps or watches everything happening around them.

## Practical tips for the trip

- **Timing:** Avoid 10am to 1pm in high season. Early morning or after 3pm is quieter.
- **Weather:** Always have the rain cover ready. Bergen changes quickly.
- **Food and drink:** Bring some extras. The café at the top can have queues.
- **Return:** You can also walk down. The hike takes around 45 minutes and is fine for most adults, but not with a pram.

## A trip worth making

Fløyen is one of those places in Bergen where you really understand why people love this city. With a baby in your arms or in the pram, it is one of the finest experiences you can give them, even if they will not remember it themselves.

Need a good pram or baby carrier for the Fløyen trip? See what we have available in Bergen.`,
  },

  // ── 6 ─────────────────────────────────────────────────────────────────────
  {
    slug:       'baby-sove-reiseseng-tips',
    author:     AUTHOR,
    published:  true,
    cover_image:'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=1200&q=85',

    title:   'Slik sover babyen godt i reiseseng: 8 praktiske tips',
    excerpt: 'Mange foreldre er bekymret for at babyen ikke vil sove borte. Med riktig forberedelse er det fullt mulig å opprettholde rutinene selv på ferie.',
    content: `Søvn er ofte det foreldre bekymrer seg mest for når de planlegger sin første ferie med baby. Hva om hen ikke vil sove i ukjente omgivelser? Hva om rutinene sprekker?

Den gode nyheten er at de fleste babyer tilpasser seg overraskende raskt. Her er tipsene som faktisk gjør en forskjell.

## 1. Ta med lukt hjemmefra

Babyer er sterkt knyttet til lukt. Ta med et laken eller en liten sovepose som lukter hjemme. Legg det i reisesengen under det rene lakanet, og babyen vil kjenne igjen tryggheten.

## 2. Behold sovesignalene dine

Om du pleier å synge en sang, gjøre en liten massasje eller dimme lyset hjemme, gjør det samme borte. Det er ikke stedet som forteller babyen at det er sovtid, det er rutinen.

## 3. Mørk soverom om du kan

Babyer sover bedre i mørke. Ta med mørkleppingsgardiner (de foldbare fra reisebutikker er glimrende), eller bruk sugekopper og et laken om du ikke har det. Mange hotellrom har tykke gardiner, men spør gjerne ved innsjekk.

## 4. Legg deg for søvn på riktig tid

Oversøvn er en vanlig felle på ferie. Babyer som er for trette sover ofte dårligere, ikke bedre. Prøv å holde jevnlige leggeklokkeslett, særlig de første dagene.

![Baby sover trygt og godt](https://images.unsplash.com/photo-1544049781-c5db0e2d7e2b?w=800&q=80)

## 5. Still inn romtemperaturen

Det anbefalte sovemiljøet for baby er mellom 18 og 20 grader. Mange hotellrom er overoppvarmet. Kontroller at det er mulig å senke temperaturen eller lufte rommet før legging.

## 6. La reisesengen lukte godt

Et rent, ukjent miljø kan oppleves fremmed. Byt ikke bare lakenet, men la gjerne babyen leke litt i reisesengen lenge før leggetid, slik at den blir en kjent og trygg plass.

## 7. Vær forberedt på justeringsperiode

Mange babyer sover litt dårligere de to første nettene borte. Det er normalt. Det er kroppen som tilpasser seg nye omgivelser og tidssoner. Vær tålmodig og hold rutinene.

## 8. Velg riktig reiseseng

Ikke alle reisesenger er like. En god reiseseng bør ha en fast madrass (ikke for myk), god ventilasjon i sidene og enkle oppfolds- og nedfellsmekanismer. Babynesten er et godt supplement for de yngste som trenger trygghet rundt seg.

## Hva vi tilbyr

Vi leier ut reisesenger og babynester i Bergen. Alt utstyr er kontrollert og rengjort mellom hver utleie, og leveres til deg der du oppholder deg.

Se hva vi har tilgjengelig, og book reisesengen din i god tid.`,

    title_en:   'How to help your baby sleep well in a travel cot: 8 practical tips',
    excerpt_en: 'Many parents worry that their baby will not sleep away from home. With the right preparation, it is entirely possible to keep routines going even on holiday.',
    content_en: `Sleep is often what parents worry most about when planning their first holiday with a baby. What if they will not sleep in unfamiliar surroundings? What if the routine breaks down?

The good news is that most babies adapt surprisingly quickly. Here are the tips that actually make a difference.

## 1. Bring a familiar scent from home

Babies are strongly attached to scent. Bring a sheet or small sleep bag that smells of home. Place it in the travel cot underneath the clean sheet, and the baby will recognise the familiar comfort.

## 2. Keep your sleep signals consistent

If you usually sing a song, give a small massage or dim the lights at home, do the same away. It is not the place that tells the baby it is time to sleep, it is the routine.

## 3. Darken the room if you can

Babies sleep better in darkness. Bring blackout curtains (the foldable ones from travel shops are excellent), or use suction cups and a sheet if you do not have them. Many hotel rooms have thick curtains, but it is worth asking at check-in.

## 4. Put them down at the right time

Overtiredness is a common trap on holiday. Babies who are too tired often sleep worse, not better. Try to maintain consistent bedtimes, especially for the first few days.

![Baby sleeping peacefully](https://images.unsplash.com/photo-1544049781-c5db0e2d7e2b?w=800&q=80)

## 5. Set the room temperature

The recommended sleep environment for a baby is between 18 and 20 degrees Celsius. Many hotel rooms are overheated. Check that it is possible to lower the temperature or air out the room before bedtime.

## 6. Let the travel cot become familiar

A clean, unfamiliar environment can feel strange. Rather than only putting the baby in the cot at bedtime, let them play in it well before sleep time, so it becomes a known and safe space.

## 7. Expect an adjustment period

Many babies sleep a little worse for the first two nights away. This is normal. It is the body adapting to new surroundings and time zones. Be patient and hold to the routines.

## 8. Choose the right travel cot

Not all travel cots are equal. A good travel cot should have a firm mattress (not too soft), good ventilation on the sides and simple folding and unfolding mechanisms. A baby nest is a good supplement for the youngest babies who need the feeling of closeness around them.

## What we offer

We rent out travel cots and baby nests in Bergen. All equipment is checked and cleaned between each rental, and delivered to wherever you are staying.

See what we have available, and book your travel cot well in advance.`,
  },

  // ── 7 ─────────────────────────────────────────────────────────────────────
  {
    slug:       'slik-vasker-vi-utstyret',
    author:     AUTHOR,
    published:  true,
    cover_image:'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=1200&q=85',

    title:   'Slik vasker og kontrollerer vi utstyret mellom hver leie',
    excerpt: 'Vi forstår at du vil vite at utstyret er trygt og rent. Her viser vi deg nøyaktig hva som skjer med hvert produkt mellom utleiene.',
    content: `Det er et rimelig spørsmål: hvordan kan du vite at utstyret er rent og trygt når det har vært brukt av en annen familie?

Vi tar dette spørsmålet på alvor, og vi forstår at det handler om tillit. Her er en åpen gjennomgang av hva vi gjør mellom hver utleie.

## Mottak og første gjennomgang

Når utstyr returneres, starter vi alltid med en visuell gjennomgang. Vi noterer eventuelle skader, slitasje eller mangler, og dokumenterer tilstanden før rens.

Utstyr som ikke oppfyller våre krav til stand, tas ut av utleie. Vi leier aldri ut noe vi ikke selv ville brukt til egne barn.

## Vask av tekstiler

Alle tekstiler som berører babyen tas av for separat vask. Det inkluderer:

- Sitteputer og ryggstøtter i vogner og bilstoler
- Laken, innlegg og madrasser
- Seler og polstringer
- Soveposer og nestinlegg

Tekstiler vaskes i barnesikkert vaskemiddel ved anbefalt temperatur for å sikre god rengjøring uten å skade fibrene.

![Rent og trygt babyutstyr](https://images.unsplash.com/photo-1556909212-d5b604d0c90d?w=800&q=80)

## Desinfeksjon av harde overflater

Harde overflater og mekaniske deler rengjøres med produkter som er testet for bruk rundt barn, og som ikke etterlater skadelige rester.

Det gjelder:
- Ramme og understell på vogner
- Plastdeler og koblingspunkter
- Mekanismer, låser og bretter
- Brikker og trinser på bilstoler

## Funksjonskontroll

Etter rengjøring sjekker vi funksjonaliteten på hvert enkelt produkt:

- Bremser og steerings på barnevogner
- Beltemekanismer og hekter på bilstoler
- Stell og sidestøtte på reisesenger
- Spenner og justere på bæreseler

Utstyr som ikke fungerer hundre prosent, sendes til service eller skiftes ut.

## Lagring frem til neste utleie

Rent og kontrollert utstyr lagres tørt og støvfritt frem til neste bestilling. Vi pakker det beskyttet slik at det holder seg rent under transport til kunden.

## Vår garanti til deg

Vi vil at du skal åpne pakken og kjenne at utstyret er ordentlig ivaretatt. Lukter det rent og ser det pent ut, er det fordi vi har gjort jobben vår. Det er ikke mer komplisert enn det.

Har du spørsmål om et spesifikt produkt eller ønsker mer informasjon om rutinene våre? Send oss en e-post på hei@tinyrent.no.

Se hva vi har tilgjengelig av rent og kontrollert babyutstyr i Bergen.`,

    title_en:   'How we clean and check the equipment between each rental',
    excerpt_en: 'We understand you want to know the equipment is safe and clean. Here we show you exactly what happens to every product between rentals.',
    content_en: `It is a reasonable question: how can you know the equipment is clean and safe when another family has used it before?

We take this question seriously, and we understand it is about trust. Here is an open account of what we do between every rental.

## Collection and first inspection

When equipment is returned, we always start with a visual check. We note any damage, wear or missing items, and document the condition before cleaning.

Equipment that does not meet our standards is taken out of rental. We never rent out anything we would not use for our own children.

## Washing textiles

All textiles that come into contact with the baby are removed for separate washing. This includes:

- Seat pads and back supports in prams and car seats
- Sheets, liners and mattresses
- Harnesses and padding
- Sleeping bags and nest inserts

Textiles are washed with child-safe detergent at the recommended temperature to ensure thorough cleaning without damaging the fibres.

![Clean and safe baby equipment](https://images.unsplash.com/photo-1556909212-d5b604d0c90d?w=800&q=80)

## Disinfection of hard surfaces

Hard surfaces and mechanical parts are cleaned with products tested for use around children and that leave no harmful residue.

This includes:
- Frames and chassis on prams
- Plastic parts and connection points
- Mechanisms, locks and folding joints
- Buckles and runners on car seats

## Functional check

After cleaning, we check the functionality of each individual product:

- Brakes and steering on prams
- Belt mechanisms and clasps on car seats
- Joints and side support on travel cots
- Buckles and adjusters on baby carriers

Equipment that does not function fully is sent for servicing or replaced.

## Storage until next rental

Clean and checked equipment is stored in a dry, dust-free environment until the next booking. We pack it protectively so it stays clean during transport to the customer.

## Our promise to you

We want you to open the package and feel that the equipment has been properly cared for. If it smells clean and looks well-presented, it is because we have done our job. It is no more complicated than that.

Have questions about a specific product or want more information about our routines? Send us an email at hei@tinyrent.no.

See what clean and checked baby equipment we have available in Bergen.`,
  },

  // ── 8 ─────────────────────────────────────────────────────────────────────
  {
    slug:       'bilstol-paa-reise',
    author:     AUTHOR,
    published:  true,
    cover_image:'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1200&q=85',

    title:   'Bilstol på reise: hva du trenger å vite',
    excerpt: 'Bilstolen er det viktigste sikkerhetsverktøyet i bilen. Her er alt du bør vite om valg av riktig type, og hva du bør tenke på når du reiser.',
    content: `Bilstolen er det eneste sikkerhetsverktøyet i bilen som er laget spesifikt for barn. Den er ikke valgfri, og det er ingen vei utenom å bruke den riktig. Her er en praktisk guide for deg som reiser med baby.

## Gruppeinndeling etter alder og vekt

Bilstoler er delt inn i grupper basert på barnets vekt, ikke alder. Alder er en pekepinn, vekt er det som avgjør.

**Gruppe 0 og 0+ (bakovervendt, 0 til 13 kg)**
For nyfødte og babyer opp til rundt 12 måneder, avhengig av vekst. Bakovervendt er alltid tryggere for de yngste fordi nakken ikke er ferdig utviklet.

**Gruppe 0+/1 eller i-Size (bakovervendt lengst mulig, opp til 18 kg)**
Moderne i-Size-stoler lar barnet sitte bakovervendt lenger, noe som er anbefalt av alle sikkerhetsorganisasjoner. Prøv å la barnet sitte bakovervendt til det veier 18 kilo.

**Gruppe 1 (fremovervendt, 9 til 18 kg)**
For barn fra rundt ett år og oppover. Fremovervendt gir mer interaksjon, men er noe mindre beskyttende ved frontkollisjoner.

**Gruppe 2 og 3 (sittepute, 15 til 36 kg)**
For eldre barn. Ikke relevant for baby, men nyttig å vite om for fremtiden.

## Bakovervendt er tryggere

Dette kan ikke sies nok ganger. En bakovervendt bilstol fordeler kreftene ved en kollisjon over hele barnets rygg og nakke, i stedet for å konsentrere dem i nakken og skuldrene. Norske myndigheter og europeiske sikkerhetsorganisasjoner anbefaler bakovervendt bilstol til barnet veier 18 kilo.

![Baby i sikker bilstol](https://images.unsplash.com/photo-1476703993599-0035a21b17a9?w=800&q=80)

## Kjøpe eller leie?

Bilstoler bør aldri kjøpes brukt uten kjent historikk. En stol som har vært i en ulykke, kan ha usynlige sprekker i plasten som gjør den uegnet. Du vet ikke hva du kjøper på bruktmarkedet.

Skal du reise til Bergen? Å leie en godkjent bilstol på stedet er tryggere og enklere enn å ta med din egen. Vi leverer den til der du ankommer, og du vet nøyaktig hvilken stand den er i.

## Installasjon og ISOFIX

ISOFIX er et feste-system som kobler stolen direkte til bilens chassis. Det eliminerer feil ved belteinstallasjon og gir bedre beskyttelse ved kollisjon. Sjekk at bilen du leier i Bergen har ISOFIX om du ønsker det.

Uten ISOFIX brukes beltet til å feste stolen. Følg alltid instruksjonsmanualen nøyaktig.

## Viktige tips

- Kontroller alltid at stolen er korrekt installert ved å rykke i den. Den skal ikke bevege seg mer enn 2 til 3 centimeter.
- Spennet skal sitte midt på brystet, ikke på magen.
- Skulderstroppene skal gå over eller gjennom skuldrene i riktig høyde.
- Aldri ha tjukke vinterjakker på barnet i stolen. Bruk teppe over i stedet.

Se hva vi har tilgjengelig av bilstoler i Bergen, og book til ditt besøk.`,

    title_en:   'Car seat when travelling: what you need to know',
    excerpt_en: 'The car seat is the most important safety tool in the car. Here is everything you should know about choosing the right type and what to consider when travelling.',
    content_en: `The car seat is the only safety device in the car designed specifically for children. It is not optional, and there is no way around using it correctly. Here is a practical guide for travelling with a baby.

## Groups by age and weight

Car seats are divided into groups based on the child's weight, not age. Age is a guideline, weight is what matters.

**Group 0 and 0+ (rear-facing, 0 to 13 kg)**
For newborns and babies up to around 12 months, depending on growth. Rear-facing is always safer for the youngest because the neck is not yet fully developed.

**Group 0+/1 or i-Size (rear-facing as long as possible, up to 18 kg)**
Modern i-Size seats allow the child to sit rear-facing for longer, which is recommended by all safety organisations. Try to keep the child rear-facing until they weigh 18 kilograms.

**Group 1 (forward-facing, 9 to 18 kg)**
For children from around one year and up. Forward-facing allows more interaction, but provides somewhat less protection in frontal collisions.

**Group 2 and 3 (booster seat, 15 to 36 kg)**
For older children. Not relevant for babies, but useful to know for the future.

## Rear-facing is safer

This cannot be said enough. A rear-facing car seat distributes the forces of a collision across the child's entire back and neck, rather than concentrating them in the neck and shoulders. Norwegian authorities and European safety organisations recommend rear-facing car seats until the child weighs 18 kilograms.

![Baby in safe car seat](https://images.unsplash.com/photo-1476703993599-0035a21b17a9?w=800&q=80)

## Buy or rent?

Car seats should never be bought second-hand without a known history. A seat that has been in an accident may have invisible cracks in the plastic that make it unsafe. You cannot know what you are buying on the second-hand market.

Travelling to Bergen? Renting an approved car seat on arrival is safer and simpler than bringing your own. We deliver it to wherever you arrive, and you know exactly what condition it is in.

## Installation and ISOFIX

ISOFIX is a mounting system that connects the seat directly to the car's chassis. It eliminates installation errors with the belt and provides better protection in a collision. Check that the car you rent in Bergen has ISOFIX if you would like to use it.

Without ISOFIX, the seat belt is used to secure the seat. Always follow the instruction manual exactly.

## Important tips

- Always check the seat is correctly installed by pulling it firmly. It should not move more than 2 to 3 centimetres.
- The buckle should sit in the middle of the chest, not on the stomach.
- Shoulder straps should run over or through the shoulders at the correct height.
- Never put thick winter jackets on the child in the seat. Use a blanket over them instead.

See what car seats we have available in Bergen, and book for your visit.`,
  },

  // ── 9 ─────────────────────────────────────────────────────────────────────
  {
    slug:       'flyreise-med-baby-tips',
    author:     AUTHOR,
    published:  true,
    cover_image:'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1200&q=85',

    title:   'Flyreise med baby: praktiske tips fra A til Å',
    excerpt: 'Flyturen med baby trenger ikke være stressende. Med riktig forberedelse kan den faktisk gå overraskende bra. Her er det vi har lært.',
    content: `De fleste foreldre frykter den første flyturen med baby. Og ja, det kan bli stressende. Men det trenger ikke å bli det. Tusenvis av familier reiser med fly hver eneste dag med babyer på armen, og de fleste har gode erfaringer når de er forberedt.

Her er det vi vet fungerer.

## Booking: velg riktig

- **Søk etter bassinett-plasser.** Mange flyselskaper har egne plasser med bassinett (en liten seng som henger foran setet) til babyer under en viss vekt. Book dette i god tid, det er begrenset antall.
- **Bestill seter ved siden av hverandre.** Høres opplagt ut, men sjekk det nøye. Noen billettbooking-sider splitter opp reisefølget automatisk.
- **Velg gangplass.** Det gir frihet til å reise seg, gå tur i midtgangen og komme seg til toalettet uten å bry naboene.

## Hva du tar med i håndbagasjen

- Dobbelt så mange bleier som du tror du trenger
- Ekstra skifte av klær til babyen (og ett til deg selv)
- Smokk og leker med kjent lukt og lyd
- Litt favorittmat eller snacks
- Bærbar brystpumpe om du bruker det
- Hansesmerter og snørr-sug er gullverdt om babyen er forkjølet

Alle flyselskaper tillater babymat og morsmelk gjennom sikkerhetskontrollen uavhengig av mengde.

## Under flyvningen

**Ørepress ved avgang og landing**
Baby-ørene er ekstra sårbare for trykskader. Amming, flaske eller smokk under avgang og landing hjelper babyen å trykkligne ørene. Prøv å ha noe klart.

**Søvn**
Mange babyer sover godt under flyving på grunn av motorlyden og bevegelsen. Prøv å avpasse avreise til normal sovetid om mulig.

**Urolige perioder**
Gå en tur i midtgangen. Bytt bærestilling. Bytt aktivitet. Og husk: de fleste medpassasjerer er langt mer forståelsesfulle enn du tror.

![Flyreise med baby og familie](https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800&q=80)

## Barnevogn og bilstol på flyet

- De fleste flyselskaper tillater innsjekk av barnevogn og bilstol som eget kolli, men sjekk priser og vektgrenser.
- Mange foreldre velger å gate-check vognen (sjekke den inn ved flydøren rett før ombordstigning), slik at du har den i terminalen.
- Bilstoler er tunge og sjelden verdt å ta med på kortere turer. Lei på stedet.

## Etter landing i Bergen

Bergen lufthavn Flesland er Norges nest største lufthavn og er enkelt å navigere. Kollektivforbindelsen inn til Bergen sentrum er rask, men med masse bagasje og baby er det enklere å ta drosje, leie bil eller ha venner som henter.

Vil du ha barnevogn, bilstol eller reiseseng klar til ankomst? Vi leverer til Flesland, til hotellet ditt eller til adressen du oppholder deg på.

Se hva vi har tilgjengelig i Bergen.`,

    title_en:   'Flying with a baby: practical tips from A to Z',
    excerpt_en: 'Flying with a baby does not have to be stressful. With the right preparation it can actually go surprisingly well. Here is what we have learned.',
    content_en: `Most parents dread the first flight with a baby. And yes, it can get stressful. But it does not have to. Thousands of families fly every single day with babies in their arms, and most have good experiences when they are prepared.

Here is what we know works.

## Booking: get it right

- **Look for bassinet seats.** Many airlines have specific seats with a bassinet (a small bed that attaches in front of your seat) for babies under a certain weight. Book this well in advance, as there are limited numbers.
- **Book seats next to each other.** Sounds obvious, but check it carefully. Some booking sites split travel companions automatically.
- **Choose an aisle seat.** It gives you freedom to stand up, walk the aisle and reach the toilet without disturbing neighbours.

## What to pack in hand luggage

- Twice as many nappies as you think you need
- An extra change of clothes for the baby and one for yourself
- Dummy and toys with a familiar smell and sound
- Some favourite food or snacks
- A portable breast pump if you use one
- Nasal aspirator and pain relief are invaluable if the baby has a cold

All airlines allow baby food and breast milk through security regardless of quantity.

## During the flight

**Ear pressure at take-off and landing**
Baby ears are particularly vulnerable to pressure changes. Breastfeeding, bottle or dummy during take-off and landing helps the baby equalise. Try to have something ready.

**Sleep**
Many babies sleep well during flights because of the engine noise and movement. Try to time departure around their normal sleep time if possible.

**Restless periods**
Walk the aisle. Change carrying position. Change activity. And remember: most fellow passengers are far more understanding than you expect.

![Flying with a baby and family](https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800&q=80)

## Pram and car seat on the plane

- Most airlines allow check-in of a pram and car seat as a separate item, but check prices and weight limits.
- Many parents choose to gate-check the pram (check it in at the plane door just before boarding) so they have it in the terminal.
- Car seats are heavy and rarely worth bringing on shorter trips. Rent on arrival instead.

## After landing in Bergen

Bergen Airport Flesland is Norway's second-largest airport and is straightforward to navigate. Public transport into Bergen city centre is fast, but with lots of luggage and a baby it can be easier to take a taxi, rent a car, or have someone collect you.

Want a pram, car seat or travel cot ready on arrival? We deliver to Flesland, to your hotel or to the address where you are staying.

See what we have available in Bergen.`,
  },

  // ── 10 ────────────────────────────────────────────────────────────────────
  {
    slug:       'baerekraftig-babyutstyr',
    author:     AUTHOR,
    published:  true,
    cover_image:'https://images.unsplash.com/photo-1542601906897-36fe9c4c9817?w=1200&q=85',

    title:   'Derfor er leie av babyutstyr bedre for miljøet',
    excerpt: 'Babyutstyr av god kvalitet er ressurskrevende å produsere. Når én barnevogn brukes av mange familier, reduseres miljøbelastningen betraktelig.',
    content: `Bærekraft er et ord som kastes rundt i mange sammenhenger, og det er lett å bli skeptisk. Men for babyutstyr er regnestykket faktisk ganske tydelig.

Her er en ærlig gjennomgang av hvorfor deling av babyutstyr gir mening, ikke bare for lommeboken, men også for planeten.

## Problemet med å kjøpe nytt

En ny barnevogn krever store mengder ressurser å produsere. Aluminium og stål til rammen, plast til hjulene og plastkoblinger, tekstiler til setet, og emballasje til transport. Produksjonen etterlater et karbonfotavtrykk på mange hundre kilo CO₂ per enhet, avhengig av modell og produksjonssted.

Så hva skjer med den vognen etterpå? Barn vokser fort. De fleste barnevogner er utdatert for en familie etter ett til to år, enten fordi barnet er for stort, familien har beveget seg på, eller fordi ny teknologi har gjort den utdatert. Mange ender opp i en garasje, selges videre for en brøkdel av prisen, eller kastes.

## Deling ganger mange

Når én barnevogn leies ut til ti familier over fem år i stedet for å eies av én, er miljøregnskapet dramatisk annerledes. Det er ikke ti vogner som er produsert, det er én vogn som har gjort nytten av ti.

Det samme prinsippet gjelder for bilstoler, reisesenger, bæreseler, matsstoler og alt annet vi tilbyr. God kvalitet varer lenge, og lang levetid er det beste miljøtiltak.

![Grønn natur og bærekraft](https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80)

## Kvalitet over kvantitet

Det er et paradoks i babybransjen: den er full av billig engangsmentalitet. Billige reisevogner som holder ett år. Babynester som ikke overlever mer enn to barn. Matstolinnlegg som sprekker etter en vinter.

Hos TinyRent velger vi produkter av høy kvalitet som tåler mange utleier. Det er dyrere i innkjøp, men det er poenget. Et produkt som holder i ti år og brukes av tjue familier har et mye lavere miljøavtrykk per bruk enn et billigprodukt som kastes etter ett år.

## Hva du kan gjøre

Å velge å leie i stedet for å kjøpe nytt er en av de enkleste og mest konkrete tingene du kan gjøre for å redusere ditt miljøavtrykk som forelder, uten at det koster deg mer.

Det er ikke nødvendig å leve asketisk eller gjøre store livsstilsendringer. Velg deling der det gir mening, ta vare på det du eier, og gi bort eller selg det du ikke lenger trenger.

Se hva vi har tilgjengelig av babyutstyr til leie i Bergen.`,

    title_en:   'Why renting baby equipment is better for the environment',
    excerpt_en: 'Quality baby equipment requires significant resources to produce. When one pram is used by many families, the environmental impact is reduced considerably.',
    content_en: `Sustainability is a word thrown around in many contexts, and it is easy to become sceptical. But for baby equipment, the maths is actually quite clear.

Here is an honest look at why sharing baby equipment makes sense, not just for your wallet, but for the planet too.

## The problem with buying new

A new pram requires vast quantities of resources to produce. Aluminium and steel for the frame, plastic for the wheels and connectors, textiles for the seat, and packaging for transport. Production leaves a carbon footprint of many hundreds of kilograms of CO₂ per unit, depending on the model and where it is made.

So what happens to that pram afterwards? Children grow fast. Most prams are obsolete for a family after one to two years, either because the child has outgrown it, the family has moved on, or newer models have made it feel dated. Many end up in a garage, sold on for a fraction of the price, or thrown away.

## Sharing multiplied many times over

When one pram is rented out to ten families over five years instead of being owned by one, the environmental equation looks dramatically different. It is not ten prams that have been produced, it is one pram that has done the work of ten.

The same principle applies to car seats, travel cots, baby carriers, high chairs and everything else we offer. Good quality lasts a long time, and long service life is the best environmental measure.

![Green nature and sustainability](https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80)

## Quality over quantity

There is a paradox in the baby industry: it is full of cheap, disposable thinking. Inexpensive travel strollers that last one year. Baby nests that do not survive more than two children. High chair inserts that crack after one winter.

At TinyRent we choose high-quality products that can handle many rentals. They are more expensive to buy, but that is the point. A product that lasts ten years and is used by twenty families has a much lower environmental footprint per use than a cheap product thrown away after one year.

## What you can do

Choosing to rent rather than buy new is one of the simplest and most concrete things you can do to reduce your environmental footprint as a parent, without it costing you more.

There is no need to live an ascetic lifestyle or make dramatic changes. Choose sharing where it makes sense, take care of what you own, and give away or sell what you no longer need.

See what baby equipment we have available for rent in Bergen.`,
  },

  // ── 11 ────────────────────────────────────────────────────────────────────
  {
    slug:       'babyvennlige-restauranter-bergen',
    author:     AUTHOR,
    published:  true,
    cover_image:'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=85',

    title:   'Babyvennlige restauranter og kafeer i Bergen',
    excerpt: 'Bergen har mange gode spisesteder, men ikke alle er like familievennlige. Her er stedene vi anbefaler når du har med de aller minste.',
    content: `Å spise ute med baby krever litt mer planlegging enn å bare velge etter Tripadvisor-rangeringen. Du trenger plass til barnevogn, et sted å amme eller gi flaske, og helst personale som faktisk er glad for å se deg.

Her er stedene i Bergen vi opplever som best for familier med baby.

## Hva gjør et sted babyvennlig?

Ikke alle steder er like, men vi ser etter noen felles trekk:

- **Plass til barnevogn** inne eller rett utenfor
- **God nok støy** til at babyen ikke skiller seg ut i negativ retning
- **Stellerom** eller et toalett du kan bruke
- **Romslig atmosfære** der du ikke føler deg til bry

Et godt personale er alt. Et sted kan se perfekt ut på kartet, men bli ødelagt av én irritert servitør.

## Kafeer vi anbefaler

**Godt Brød (flere steder i Bergen)**
Et bergensklassikeren med surdeigbrød, varm mat og avslappet stemning. Stor plass, mange amming-vennlige kroker og personale som er vant til alle typer gjester. Det er én i Strandgaten og én på Møhlenpris, og begge er gode.

**Det Lille Kaffekompaniet (Øvregaten)**
Sjarmerende kafé i den gamle bydelen nær Bryggen. God kaffe og enkle retter. Litt trangt, men atmosfæren er varm og velkommende, og personalet er gjennomgående hyggelig.

**Kafe Kippers (Nordnes)**
En favoritt blant bergensforeldre. Kafeen ligger i Nordnesparken-området med god utsikt og avslappet stemning. God plass til vogn, og et av de stedene som virkelig føles som et sted for folk, ikke bare for voksne uten barn.

![Hyggelig kafé interiør](https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=80)

## Restauranter for middagsbesøk

**Bryggeloftet og Stuene (Bryggen)**
En av Bergens mest kjente restauranter, og overraskende familievennlig. Stor plass, norsk mat av god kvalitet og servitører som er rolige og hjelpsomme selv i travle perioder.

**Pingvinen (Vaskerelven)**
Populær bergensrestaurant med husmannskost og god stemning. Ikke spesielt designet for babyer, men romsligheten og den uformelle atmosfæren gjør det enkelt å ta med de minste.

**Escalon (Torget)**
Mexicansk mat og stor plass. Lyden er høy nok til at babyen ikke dominerer rommet, og stemningen er uformell. Ikke for de som vil ha en rolig middag, men for en glad og uanstrengt kveld fungerer det godt.

## Tips for matleting i Bergen

- Ring i forkant om du har en stor vogn. De fleste steder setter pris på det, og da kan de reservere en god plass til deg.
- Unngå rushtid på lunch og middag om du kan. Roligere tider gir mer rom og bedre service.
- Fisketorget midt i sentrum er fint for lunsj ute i godt vær, med mange matstander og benker.
- Bryggen har mange turistrettede steder der det er god plass og toleranse for familier.

## Amming og stellemuligheter

De fleste kjøpesentrene i Bergen (Galleriet, Kløverhuset og Xhibition) har gode stellerom. For stelling ute bør du planlegge ruten slik at du vet where nærmeste toalett er.

Amming er selvfølgelig tillatt overalt, og Bergen er en by der det er normalt og akseptert.

Se hva vi har av babyutstyr til Bergens-turen din, og bestill god tid i forveien.`,

    title_en:   'Baby-friendly restaurants and cafés in Bergen',
    excerpt_en: 'Bergen has many good places to eat, but not all are equally welcoming to families. Here are the places we recommend when you have the youngest ones with you.',
    content_en: `Eating out with a baby requires a little more planning than simply picking by a restaurant ranking. You need room for the pram, somewhere to breastfeed or give a bottle, and ideally staff who are genuinely glad to see you.

Here are the places in Bergen we find best for families with a baby.

## What makes a place baby-friendly?

Not all places are equal, but we look for a few common features:

- **Room for a pram** inside or right outside
- **Enough background noise** that the baby does not stand out
- **Changing facilities** or a toilet you can use
- **Relaxed atmosphere** where you do not feel like you are intruding

Good staff makes everything. A place can look perfect on the map but be ruined by one impatient server.

## Cafés we recommend

**Godt Brød (multiple locations in Bergen)**
A Bergen classic with sourdough bread, warm food and a relaxed atmosphere. Plenty of space, many breastfeeding-friendly corners and staff used to all types of guests. There is one on Strandgaten and one at Møhlenpris, and both are good.

**Det Lille Kaffekompaniet (Øvregaten)**
A charming café in the old town near Bryggen. Good coffee and simple dishes. A little compact, but the atmosphere is warm and welcoming, and the staff are consistently friendly.

**Kafe Kippers (Nordnes)**
A favourite among Bergen parents. The café is in the Nordnesparken area with a good view and relaxed atmosphere. Good room for a pram, and one of those places that genuinely feels like a space for people, not just adults without children.

![Cosy café interior](https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=80)

## Restaurants for dinner

**Bryggeloftet og Stuene (Bryggen)**
One of Bergen's best-known restaurants, and surprisingly family-friendly. Plenty of space, quality Norwegian food and servers who remain calm and helpful even in busy periods.

**Pingvinen (Vaskerelven)**
A popular Bergen restaurant with traditional Norwegian home cooking and a good atmosphere. Not specifically designed for babies, but the space and informal atmosphere make it easy to bring the youngest ones.

**Escalon (Torget)**
Mexican food and plenty of space. The noise level is high enough that the baby does not dominate the room, and the atmosphere is informal. Not for those wanting a quiet dinner, but for an easy and cheerful evening it works well.

## Tips for finding food in Bergen

- Call ahead if you have a large pram. Most places appreciate it, and they can reserve a good spot for you.
- Avoid the lunch and dinner rush if you can. Quieter times mean more room and better service.
- The Fish Market in the city centre is good for outdoor lunch in fine weather, with many food stalls and benches.
- Bryggen has many tourist-oriented places with good space and tolerance for families.

## Breastfeeding and changing facilities

Most shopping centres in Bergen (Galleriet, Kløverhuset and Xhibition) have good changing rooms. For changing on the go, plan your route so you know where the nearest toilet is.

Breastfeeding is of course permitted everywhere, and Bergen is a city where it is normal and accepted.

See what baby equipment we have for your Bergen trip, and book well in advance.`,
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
                '     to patch English content into the existing rows.\n')
  }

  for (const article of articles) {
    // Check if slug already exists
    const { data: existing } = await supabase
      .from('articles')
      .select('id, slug')
      .eq('slug', article.slug)
      .maybeSingle()

    if (existing) {
      // Migration 011 now available — patch English content into existing row
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

    // Build payload, include _en fields only if migration 011 is live
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
