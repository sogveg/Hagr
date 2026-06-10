// SkatteSmart Tip Library — 2026
// Dette er innholdet brukerne betaler for: konkrete tips, triks og gotchas
// som en regnskapsfører ikke alltid gidder å fortelle deg.

export type TipType = 'saving' | 'gotcha' | 'rule' | 'planning'
export type TipCategory =
  | 'velferd'
  | 'representasjon'
  | 'lønn-utbytte'
  | 'gaver'
  | 'utdanning'
  | 'familieansatte'
  | 'telefon-internett'
  | 'bil'
  | 'hytte-båt'
  | 'aksjonærlån'
  | 'pensjon'
  | 'firmakort'
  | 'styremøter'
  | 'hjemmekontor'
  | 'sykepenger'
  | 'fradrag'
  | 'generelt'

export interface Tip {
  id: string
  title: string
  title_enkel?: string  // Friendly plain-language title (optional, falls back to title)
  body: string          // Default body (professional / neutral)
  body_enkel?: string   // Plain-language version for "enkel" mode
  category: TipCategory
  tags: string[]
  type: TipType
  impact?: string       // "Spar inntil 11 000 kr"
  law_ref?: string
  tool_href?: string    // lenke til relevant verktøy
}

/** Returns the appropriate title/body based on language mode */
export function getTipTitle(tip: Tip, mode: 'enkel' | 'pro'): string {
  return (mode === 'enkel' && tip.title_enkel) ? tip.title_enkel : tip.title
}

export function getTipBody(tip: Tip, mode: 'enkel' | 'pro'): string {
  return (mode === 'enkel' && tip.body_enkel) ? tip.body_enkel : tip.body
}

export const TIPS: Tip[] = [

  // ── VELFERD / JULEBORD ────────────────────────────────────────────────────

  {
    id: 'welfare_food_limit',
    title: '560 kr-grensen er for mat og drikke — ikke for hele julebordet',
    body: 'Mange tror at julebordet må koste under 560 kr per person totalt. Feil! 560 kr-grensen gjelder kun mat og drikke (eks. mva). Lokale, underholdning, aktiviteter og transport er på toppen. Et julebord kan godt koste 1 500 kr per person — og fremdeles være fullt fradragsberettiget.',
    category: 'velferd',
    tags: ['julebord', 'julebord-guide', '560-kr', 'velferd'],
    type: 'saving',
    impact: 'Frigjør hele budsjettrommet for julebordet',
    tool_href: '/welfare',
  },
  {
    id: 'welfare_no_spirits',
    title: 'Brennevin på julebordet kan nulle ut hele fradraget',
    body: 'Skatteloven § 6-21 sier at representasjon med brennevin ikke er fradragsberettiget. Hvis julebordet omklassifiseres til representasjon (f.eks. fordi mat+drikke overstiger 560 kr/person), og det ble servert sprit, mister du fradraget på hele arrangementet — ikke bare spritdelen. Stick to øl og vin.',
    body_enkel: 'Serverer dere sprit (whisky, vodka, akevitt osv.) på julebordet, kan selskapet miste retten til å trekke utgiften fra på skatten — ikke bare spritdelen, men hele julebordet. Øl og vin er trygt. Sprit er risikabelt. Hold deg til vin og øl.',
    category: 'velferd',
    tags: ['julebord', 'sprit', 'brennevin', 'fradrag'],
    type: 'gotcha',
    law_ref: 'Skatteloven § 6-21',
    tool_href: '/welfare',
  },
  {
    id: 'welfare_all_employees',
    title: 'Alle-ansatte-kravet: én glemt ansatt kan koste deg mye',
    body: 'For at et velferdstiltak skal være skattefritt for de som deltar, MÅ alle ansatte (eller alle i en hel avdeling) være invitert. Inviterer du bare noen, blir fordelen skattepliktig lønn for de som var med — og du sitter igjen med AGA-plikt. Documenter at alle ble tilbudt å delta.',
    body_enkel: 'Alle ansatte MÅ inviteres til julebordet. Inviterer du bare noen utvalgte, risikerer du at de som var med må betale skatt av fordelen — som om det var ekstra lønn. Løsning: send invitasjon til alle, og lagre dokumentasjon på at de fikk tilbudet.',
    category: 'velferd',
    tags: ['julebord', 'alle-ansatte', 'skattefrihet'],
    type: 'rule',
    tool_href: '/welfare',
  },
  {
    id: 'welfare_5000_guideline',
    title: 'Skatteetaten bruker 5 000 kr/ansatt/år som veiledende grense',
    body: '5 000 kr per ansatt per år er ikke en lovfestet grense — det er en retningslinje Skatteetaten bruker i rimelighetsvurderingen. Går du over, er det ikke automatisk skattepliktig, men du bør ha god dokumentasjon og forklaring. Eks.: julebord (1 500 kr) + sommerfest (1 000 kr) + teambuilding (1 000 kr) = 3 500 kr — trygt innenfor.',
    body_enkel: 'Det finnes ingen fast lovgrense for hva julebordet kan koste. Skatteetaten bruker "rimelig" som test. Tommelfingerregelen er at samlet velferd (julebord + sommerfest + teambuilding) ikke bør overstige ca. 5 000 kr per ansatt per år uten god grunn — men dette er ikke en lov, bare en rettesnor.',
    category: 'velferd',
    tags: ['velferd', '5000-kr', 'rimelighet'],
    type: 'rule',
    tool_href: '/welfare',
  },
  {
    id: 'welfare_spouse',
    title: 'Ektefellen er med — og det er helt greit',
    body: 'Det er fullt lovlig og skattefritt å ta med ektefelle/samboer på julebord og sommerfest. Kostnaden for partnere teller med i totalen per ansatt, men er ikke en skattepliktig fordel i seg selv. En god huskeregel: regn det som én plass ekstra per ansatt.',
    category: 'velferd',
    tags: ['julebord', 'ektefelle', 'velferd'],
    type: 'saving',
    tool_href: '/welfare',
  },
  {
    id: 'welfare_participant_list',
    title: 'Deltakerliste er det sterkeste beviset ved bokettersyn',
    body: 'Skatteetaten kan be om dokumentasjon på at alle ansatte ble invitert. Uten deltakerliste er det ord mot ord. Med deltakerliste er saken klar. To minutter med et Word-dokument eller en regnearkfane kan spare deg for mye bry. SkatteSmart lagrer deltakerlisten for deg.',
    category: 'velferd',
    tags: ['julebord', 'dokumentasjon', 'bokettersyn'],
    type: 'gotcha',
    tool_href: '/welfare',
  },
  {
    id: 'welfare_solo_owner',
    title: 'Eier alene? Julebord for deg selv er uttak — ikke velferd',
    body: 'Et AS uten ansatte (kun eier) kan ikke avholde skattefritt julebord for eieren alene. Utgiften behandles som uttak (utbytte), beskattes med utbytteskatt og selskapsskatt, og medfører AGA. Ansett en — selv deltid — og situasjonen endrer seg.',
    category: 'velferd',
    tags: ['julebord', 'ensaksjonær', 'uttak'],
    type: 'gotcha',
    tool_href: '/welfare',
  },

  // ── REPRESENTASJON ───────────────────────────────────────────────────────

  {
    id: 'rep_560_middag',
    title: 'Middag med kunder: 560 kr per person er grensen for fradrag',
    body: 'Du kan trekke fra inntil 560 kr per person (eks. mva) for representasjonsmiddag med kunder og forretningsforbindelser. Overskyter du grensen, er det bare de første 560 kr per person som er fradragsberettiget — resten er ikke-fradragsberettiget kostnad.',
    body_enkel: 'Tar du med en kunde på middag, kan selskapet trekke fra inntil 560 kr per person på skatten. Koster middagen mer, er det bare de første 560 kr per person som teller. Kvitteringen må ha navn på alle som var med og hva dere møttes for.',
    category: 'representasjon',
    tags: ['representasjon', '560-kr', 'middag', 'kunder'],
    type: 'rule',
    impact: 'Unngå å miste fradrag du har krav på',
    law_ref: 'FSFIN § 6-21-1',
    tool_href: '/representation',
  },
  {
    id: 'rep_lunch_no_limit',
    title: 'Lunsj i arbeidstid med kunder er fullt fradragsberettiget',
    body: '560 kr-grensen gjelder middag, ikke lunsj. Lunsj med kunder i arbeidstid er fullt fradragsberettiget uansett beløp — så lenge formålet er forretningsmessig og du dokumenterer hvem som var med og hva møtet handlet om. Lunsj i stedet for middag er altså gunstigere skattemessig.',
    body_enkel: 'Lunsj med kunder i arbeidstiden = fullt skattefradrag, uansett beløp. Middag = maks 560 kr per person i fradrag. Lunsj er altså skattemessig bedre enn middag! Husk å notere hvem som var med og hva dere snakket om.',
    category: 'representasjon',
    tags: ['representasjon', 'lunsj', 'fradrag'],
    type: 'saving',
    tool_href: '/representation',
  },
  {
    id: 'rep_no_spirits',
    title: 'Brennevin på kundemiddag: alt fradraget faller bort',
    body: 'Bestilles det brennevin/sprit på en representasjonsmiddag, mister du fradragsretten på hele utgiften — inkludert mat. Ikke bare spritdelen, men alt. Dette er en absolutt regel i skatteloven § 6-21. Holder du deg til øl, vin og mat er du trygg innenfor 560 kr-grensen.',
    body_enkel: 'Bestiller noen sprit (whisky, akevitt, vodka o.l.) på kundemiddagen, mister selskapet fradraget på HELE regningen — ikke bare spritglasset. Bestill øl og vin, spar fradraget.',
    category: 'representasjon',
    tags: ['representasjon', 'sprit', 'brennevin'],
    type: 'gotcha',
    law_ref: 'Skatteloven § 6-21',
    tool_href: '/representation',
  },
  {
    id: 'rep_documentation',
    title: 'Representasjonsbilag uten navn på deltakerne blir avvist',
    body: 'Kvittering alene er ikke nok. For representasjon krever Skatteetaten: dato, sted, navn og selskap på ALLE deltakere, og det forretningsmessige formålet. Mangler du dette kan revisor eller Skatteetaten nekte fradraget. Skriv det på kvitteringen med en gang — glem det ikke dagen etter.',
    body_enkel: 'En kvittering er ikke nok. Du må skrive på kvitteringen: hvem var med, hvilke selskaper de er fra, og hva dere møttes for. Gjør det på stedet med telefonen — det er lett å glemme neste dag.',
    category: 'representasjon',
    tags: ['representasjon', 'dokumentasjon', 'bilag'],
    type: 'gotcha',
    tool_href: '/representation',
  },
  {
    id: 'rep_internal_only',
    title: 'Kun interne ansatte? Det er velferd — ikke representasjon',
    body: 'Representasjon er for eksternt bruk: kunder, leverandører, samarbeidspartnere. Interne arrangement (kun ansatte) heter velferdstiltak og har egne, gunstigere regler. Blander du de to opp i bilagene risikerer du feil skattebehandling begge veier.',
    body_enkel: 'Er alle med på middagen fra din bedrift? Da er det "velferd", ikke "representasjon" — og det er faktisk gunstigere! Representasjon er kun for når du har kunder, leverandører eller samarbeidspartnere med.',
    category: 'representasjon',
    tags: ['representasjon', 'velferd', 'definisjon'],
    type: 'rule',
    tool_href: '/representation',
  },

  // ── LØNN VS. UTBYTTE ────────────────────────────────────────────────────

  {
    id: 'salary_optimal_2026',
    title: '2026: Optimal lønn for AS-eier er ca. 700 000–750 000 kr',
    body: 'Totalskatten (inntektsskatt + trygdeavgift + selskapsskatt + utbytteskatt) er lavest når du tar lønn i et bestemt intervall og resten som utbytte. I 2026 er dette typisk rundt 700 000–750 000 kr i lønn — men det varierer med overskudd og AGAzone. Bruk kalkulatoren for å finne ditt optimum.',
    category: 'lønn-utbytte',
    tags: ['lønn', 'utbytte', 'optimalisering', '2026'],
    type: 'planning',
    impact: 'Spar 20 000–80 000 kr i skatt per år',
    tool_href: '/salary-dividend',
  },
  {
    id: 'salary_pension_right',
    title: 'Under 7,1 G i lønn? Du mister opptjening av sykepenger',
    body: 'Sykepenger fra NAV beregnes av lønn, begrenset oppad til 6 G (ca. 783 936 kr i 2026). For å ha full rett til sykepenger, må du ha minst én krones lønn — utbytte teller ikke. Tar du ingen lønn og blir syk, får du ingenting fra NAV. Mange eiere undervurderer verdien av sykepengeretten.',
    category: 'lønn-utbytte',
    tags: ['sykepenger', 'lønn', 'NAV', 'trygd'],
    type: 'planning',
    law_ref: 'Folketrygdloven § 8-28',
    tool_href: '/salary-dividend',
  },
  {
    id: 'salary_aga_cost',
    title: 'AGA koster selskapet 14,1% ekstra — ta det med i regnestykket',
    body: 'Arbeidsgiveravgift (AGA) er 14,1% av lønn i sone I (Oslo/sørøst). En lønn på 700 000 kr koster selskapet 798 700 kr (700 000 + 98 700 kr AGA). AGA er fradragsberettiget for selskapet, men det øker selskapskostnaden betydelig. Kalkulatoren viser alltid total selskapskostnad.',
    category: 'lønn-utbytte',
    tags: ['AGA', 'lønn', 'selskapskostnad'],
    type: 'rule',
    tool_href: '/salary-dividend',
  },
  {
    id: 'salary_crossover',
    title: 'Over 980 100 kr i lønn? Marginalskatt 52,4% — vurder utbytte',
    body: 'I 2026 er crossoverpunktet der utbytteskatt og marginalskatten på lønn møtes omtrent 980 100 kr. Lønn over dette punktet beskattes hardere enn utbytte (hensyn tatt til selskapsskatt). Har du høyt overskudd: ta lønn opp til 980 100 kr, resten som utbytte.',
    category: 'lønn-utbytte',
    tags: ['lønn', 'utbytte', 'crossover', 'marginalskatt'],
    type: 'planning',
    tool_href: '/salary-dividend',
  },
  {
    id: 'salary_skattepliktig_fordel',
    title: 'Lønn til familiemedlemmer: lavere enn markedslønn = skattepliktig utbytte',
    body: 'Betaler du ektefellen eller barnet ditt lønn, må lønnen svare til markedsverdi for jobben de faktisk gjør. Betales for mye anses overskuddet som skattepliktig utbytte/gave. Betales for lite (eller ingenting) og Skatteetaten kan omklassifisere som arbeidsutleie til eier. Dokumenter arbeidsoppgaver og timer.',
    category: 'lønn-utbytte',
    tags: ['familieansatte', 'lønn', 'ektefelle', 'markedslønn'],
    type: 'gotcha',
    tool_href: '/people',
  },
  {
    id: 'salary_dividend_timing',
    title: 'Utbytte tas ut etter godkjent regnskap — ikke bare når du vil',
    body: 'Utbytte kan bare utdeles etter at årsregnskapet er godkjent av generalforsamlingen. I tillegg må selskapet ha tilstrekkelig fri egenkapital. Utbytte vedtatt uten generalforsamlingsprotokoll eller uten dekning i egenkapitalen er ugyldig — og kan bli behandlet som aksjonærlån.',
    category: 'lønn-utbytte',
    tags: ['utbytte', 'generalforsamling', 'egenkapital', 'formalitet'],
    type: 'rule',
    tool_href: '/salary-dividend',
  },

  // ── GAVER ───────────────────────────────────────────────────────────────

  {
    id: 'gift_5000_limit',
    title: 'Gaver til ansatte: 5 000 kr er grensen — og gavekort ER skattefritt',
    body: 'Gaver til ansatte er skattefrie inntil 5 000 kr per person per år. Kontanter og Vipps er alltid skattepliktig. Gavekort som KAN løses inn i penger (saldo-gavekort) er alltid skattepliktig. Men gavekort som IKKE kan løses inn i penger — f.eks. gavekort til en bestemt butikk, hotell, opplevelse eller restaurant — er skattefritt på lik linje med en fysisk gave, innenfor 5 000 kr-grensen.',
    category: 'gaver',
    tags: ['gave', '5000-kr', 'kontanter', 'gavekort'],
    type: 'rule',
    tool_href: '/gifts',
  },
  {
    id: 'gift_jubilee',
    title: 'Jubileumsgave på 25/40/50 år kan gis ekstra skattefritt',
    body: 'Ved ansattjubileum (25, 40 eller 50 år i selskapet) eller selskapets jubileum (25, 50, 75, 100 år) kan det gis en ekstra skattefri gave utover de ordinære 5 000 kr. Grensen er 8 000 kr ekstra per jubileum. Dette er en fin mulighet til å belønne lojale ansatte skatteeffektivt.',
    category: 'gaver',
    tags: ['gave', 'jubileum', '8000-kr', 'ansatte'],
    type: 'saving',
    impact: 'Opptil 8 000 kr ekstra skattefri gave',
    tool_href: '/gifts',
  },
  {
    id: 'gift_customer_limit',
    title: 'Gaver til kunder: kun 100 kr er skattemessig fradragsberettiget',
    body: 'Gaver til forretningsforbindelser og kunder er strengt begrenset: kun 100 kr per mottaker per år er fradragsberettiget. Reklamegjenstander med firmalogo (verdi under 100 kr) er fullt fradragsberettiget. Over 100 kr er det en representasjonskostnad underlagt 560 kr-reglene.',
    category: 'gaver',
    tags: ['gave', 'kunder', '100-kr', 'reklame'],
    type: 'rule',
    law_ref: 'FSFIN § 6-21-2',
    tool_href: '/gifts',
  },

  // ── TELEFON OG INTERNETT ─────────────────────────────────────────────────

  {
    id: 'phone_flat_rate',
    title: 'Mobil og internett: fast sjablongbeløp på 4 392 kr — uansett faktisk kostnad',
    body: 'Har du tjenstlig behov (nesten alle gjør det), beskattes mobil og internett dekket av selskapet med en sjablong på 4 392 kr per år (2026) — uansett om abonnementet koster 3 000 eller 15 000 kr. Selskapet trekker fra hele utgiften, ansatt beskattes av sjablongen. Dette er en av de enkleste og sikrest gunstige ytelsene.',
    category: 'telefon-internett',
    tags: ['mobil', 'internett', 'sjablong', '4392-kr'],
    type: 'saving',
    impact: 'Spar 4 392 kr per ansatt i skattegrunnlag',
    tool_href: '/phone-internet',
  },
  {
    id: 'phone_streaming',
    title: 'Netflix/Spotify inkludert i "internett" — Skatteetaten aksepterer ikke det',
    body: 'Streamingpakker som Netflix, Spotify og TV-tjenester er privat forbruk — selv om de er bundlet i et bredbåndsabonnement. Dekker selskapet dette, er den delen skattepliktig lønn utover sjablongen. Velg abonnementer uten streamingpakker, eller be om detaljert faktura der streamingdelen er atskilt.',
    category: 'telefon-internett',
    tags: ['internett', 'streaming', 'skattepliktig', 'sjablong'],
    type: 'gotcha',
    tool_href: '/phone-internet',
  },
  {
    id: 'phone_need_documentation',
    title: 'Tjenstlig behov for mobil er krav — men terskelen er lav',
    body: 'For at mobil/internett-dekning skal behandles som naturalytelse (ikke ren lønn), må du ha et tjenstlig behov. I praksis: trenger du å nå kunder, leverandører eller kolleger utenfor kontoret? Det holder. Skriv en setning i kontrakten eller en e-post om det tjenstlige behovet — det er dokumentasjon nok.',
    category: 'telefon-internett',
    tags: ['mobil', 'tjenstlig-behov', 'dokumentasjon'],
    type: 'rule',
    tool_href: '/phone-internet',
  },

  // ── BIL ─────────────────────────────────────────────────────────────────

  {
    id: 'car_logbook_required',
    title: 'Kjørebok: uten den mister du bilens fradrag',
    body: 'Bruker du bil i næring MÅ du føre kjørebok for å dokumentere yrkeskjøring. Uten kjørebok kan Skatteetaten avvise bilens andel av fradraget. Kjøreboken skal inneholde: dato, startsted, endested, kilometer, formål med turen. Det holder med en enkel app eller et Excel-ark.',
    category: 'bil',
    tags: ['bil', 'kjørebok', 'fradrag', 'dokumentasjon'],
    type: 'rule',
    tool_href: '/car',
  },
  {
    id: 'car_private_use_taxation',
    title: 'Firmabildelen beskattes fra første kilometer privat kjøring',
    body: 'Har du firmabil og bruker den privat (inkl. hjem-jobb), beskattes du av en sjablongfordel basert på bilens listepris. I 2026 er sjablongen 30% av listepris inntil 351 700 kr + 20% av overskytende. For en bil til 500 000 kr = ca. 134 000 kr skattepliktig fordel per år. El-biler har redusert sjablong.',
    category: 'bil',
    tags: ['firmabil', 'sjablong', 'privatkjøring', 'skattepliktig'],
    type: 'rule',
    tool_href: '/car',
  },
  {
    id: 'car_electric_bonus',
    title: 'El-firmabil: 20% lavere sjablong enn fossile biler',
    body: 'El-biler har en redusert sjablongfordel for firmabil privat bruk i 2026. Sjablongen beregnes som 80% av el-bilens listepris — dvs. du beskattes av 20% lavere grunnlag enn for en tilsvarende fossilbil. For en el-bil til 600 000 kr sparer du ca. 25 000–30 000 kr i skattegrunnlag sammenlignet med fossil.',
    category: 'bil',
    tags: ['firmabil', 'elbil', 'sjablong', 'sparing'],
    type: 'saving',
    impact: 'Spar 25 000–30 000 kr i skattegrunnlag',
    tool_href: '/car',
  },
  {
    id: 'car_mileage_rate',
    title: 'Privat bil i næring: 3,50 kr per km er skattefri godtgjørelse',
    body: 'Bruker du privat bil i jobben, kan du få 3,50 kr per km skattefritt (2026). Arbeidsgiver kan utbetale dette uten at det er lønn — men du MÅ føre kjørebok. Over 10 000 km per år er satsen 3,45 kr/km. Reiser med passasjer gir 1,00 kr ekstra per km per passasjer.',
    category: 'bil',
    tags: ['kjøregodtgjørelse', 'privat-bil', '3.50-kr', 'skattefri'],
    type: 'saving',
    impact: '3,50 kr/km skattefritt — dokumentert i kjørebok',
    tool_href: '/car',
  },

  // ── HYTTE OG BÅT ────────────────────────────────────────────────────────

  {
    id: 'cabin_all_employees',
    title: 'Bedriftshytte: alle ansatte MÅ ha tilgang — ellers er det utbytte',
    body: 'Har selskapet hytte som kun eieren bruker, behandles bruken som utbytte — beskattet med 37,84% (2026) + selskapsskatt. Sørg for at alle ansatte har reell tilgang og at dette er dokumentert (bookingsystem e.l.). Brukes hytten av alle ansatte, er det velferd og fullt fradragsberettiget.',
    category: 'hytte-båt',
    tags: ['hytte', 'bedriftshytte', 'alle-ansatte', 'utbytte'],
    type: 'gotcha',
    tool_href: '/cabin-boat',
  },
  {
    id: 'cabin_boat_taxable',
    title: 'Firmabåt til privat bruk: sjablongbeskatning fra dag én',
    body: 'En båt eid av selskapet og brukt privat beskattes som naturalytelse. Sjablongen er basert på båtens verdi. Det er vanskelig å argumentere for forretningsmessig bruk av fritidsbåt — det er i praksis alltid privatbruk.',
    category: 'hytte-båt',
    tags: ['båt', 'firmabåt', 'naturalytelse', 'privatbruk'],
    type: 'gotcha',
    tool_href: '/cabin-boat',
  },

  // ── AKSJONÆRLÅN ─────────────────────────────────────────────────────────

  {
    id: 'shareholder_loan_taxed',
    title: 'Lån fra AS til eier beskattes som utbytte — umiddelbart',
    body: 'Siden 2022 er lån fra AS til aksjonær (deg som eier) skattepliktig som utbytte i det år lånet tas opp — uavhengig av om du betaler det tilbake. Dette er en av de vanligste og dyreste fallgruvene for AS-eiere. Mellomregning som vokser = skattesmell. Hold mellomregningen på null.',
    category: 'aksjonærlån',
    tags: ['aksjonærlån', 'mellomregning', 'utbytte', 'fallgruve'],
    type: 'gotcha',
    law_ref: 'Skatteloven § 10-11 (4)',
  },
  {
    id: 'shareholder_loan_interest',
    title: 'Kortvarig mellomregning er OK — men renter må beregnes',
    body: 'En mellomregning (kortsiktig forskudd fra selskapet) som tilbakebetales innen regnskapsårets slutt er i gråsonen. Skatteetaten krever markedsrente på lån mellom selskap og aksjonær. I 2026 er normrenten satt av Finansdepartementet. Konsulter regnskapsfører.',
    category: 'aksjonærlån',
    tags: ['aksjonærlån', 'mellomregning', 'rente'],
    type: 'rule',
    law_ref: 'Skatteloven § 5-22',
  },

  // ── PENSJON ─────────────────────────────────────────────────────────────

  {
    id: 'pension_obligation',
    title: 'AS med ansatte: obligatorisk tjenestepensjon fra ansatte dag 1',
    body: 'Alle AS med ansatte plikter å ha tjenestepensjonsordning (OTP). Minimum er 2% av lønn mellom 1 G og 12 G. Manglende OTP er brudd på lov om obligatorisk tjenestepensjon og kan gi bøter. Ansetter du noen — sett opp pensjon med en gang.',
    category: 'pensjon',
    tags: ['pensjon', 'OTP', 'obligatorisk', 'ansatte'],
    type: 'rule',
    law_ref: 'Lov om obligatorisk tjenestepensjon',
  },
  {
    id: 'pension_owner_ips',
    title: 'IPS: Spar 15 480 kr i skatt om du setter av til pensjon selv',
    body: 'Individuell pensjonssparing (IPS) lar deg sette av inntil 15 000 kr per år med 22% skattefradrag = 3 300 kr spart per år. Er du lønnstaker i eget AS kan du i tillegg ta innskuddspensjon gjennom selskapet på inntil 7% av lønn mellom 1–12 G. Kombinasjonen gir god trygdedekning og pensjonssparing.',
    category: 'pensjon',
    tags: ['pensjon', 'IPS', 'fradrag', 'sparing'],
    type: 'saving',
    impact: 'Inntil 3 300 kr spart i skatt per år med IPS',
  },

  // ── FIRMAKORT ────────────────────────────────────────────────────────────

  {
    id: 'company_card_private_use',
    title: 'Firmakort til private kjøp: det er lønn — ikke fradrag',
    body: 'Bruker du firmakortet til private kjøp, er det skattepliktig lønn for deg som ansatt/eier. Selskapet skal innberette det i a-meldingen og trekke forskuddsskatt. Mange hopper over dette og oppdager det først ved bokettersyn — med rentetillegg og tilleggsskatt.',
    category: 'firmakort',
    tags: ['firmakort', 'privat-kjøp', 'lønn', 'innberetning'],
    type: 'gotcha',
    tool_href: '/company-card',
  },
  {
    id: 'company_card_documentation',
    title: 'Bilagsplikt: alle kvitteringer må arkiveres i 5 år',
    body: 'Alle utgifter betalt med firmakort krever bilag (kvittering). Bilag skal arkiveres i minimum 5 år. Manglende bilag = nektet fradrag. Fotografer kvitteringen med en gang med en bilagsapp — ikke tøm lommene sent på kvelden og håp på det beste.',
    category: 'firmakort',
    tags: ['firmakort', 'bilag', 'dokumentasjon', '5-år'],
    type: 'rule',
    tool_href: '/company-card',
  },

  // ── STYREMØTER ─────────────────────────────────────────────────────────

  {
    id: 'board_meeting_mandatory',
    title: 'AS uten styremøteprotokoll: bot og personlig ansvar',
    body: 'Alle AS plikter å avholde styremøter med protokoll. Uten protokoll kan styret holdes personlig ansvarlig for vedtak og manglende beslutningsprosess. Skatteetaten kan også avvise kostnader fra styremøter uten dokumentasjon. En digital protokoll tar 10 minutter.',
    category: 'styremøter',
    tags: ['styremøte', 'protokoll', 'lovkrav', 'AS'],
    type: 'rule',
    law_ref: 'Aksjeloven § 6-19, § 6-29',
    tool_href: '/board-meetings',
  },
  {
    id: 'board_meeting_expenses',
    title: 'Kostnader til styremøtet er fullt fradragsberettiget',
    body: 'Møterom, servering, reise for styremedlemmer og eventuelle honorar er fullt fradragsberettiget for selskapet. Styrehonorar er lønn og innberettes i a-meldingen. Styremøtets kostnader er blant de enkleste og sikreste fradragene du har — men du MÅ ha protokoll.',
    category: 'styremøter',
    tags: ['styremøte', 'fradrag', 'honorar', 'kostnader'],
    type: 'saving',
    tool_href: '/board-meetings',
  },
  {
    id: 'board_meeting_strategy',
    title: 'Strategisamling på hytte: det er et styremøte — ikke en ferie',
    body: 'Offsite-møter og strategisamlinger er fradragsberettiget, men Skatteetaten er skeptisk til samlinger på feriesteder uten faglig program. Dokumenter det faglige innholdet (agenda, referat, beslutningspunkter). Minst 50–70% faglig innhold er tommelfingerregelen for å stå seg.',
    category: 'styremøter',
    tags: ['styremøte', 'strategisamling', 'offsite', 'fradrag'],
    type: 'rule',
    tool_href: '/strategy',
  },

  // ── UTDANNING ────────────────────────────────────────────────────────────

  {
    id: 'education_work_related',
    title: 'Selskapet kan dekke utdanning skattefritt — men den må være jobberelevant',
    body: 'Arbeidsgiver kan dekke kurs, studier og videreutdanning uten at det er skattepliktig for deg som ansatt/eier — forutsatt at utdanningen har tilknytning til din nåværende jobb eller selskapets virksomhet. Det er ingen øvre beløpsgrense. En MBA, fagkurs, bransjestudier, programmeringskurs — alt er greit så lenge det er relevant. Selskapet får fullt fradrag for utgiften.',
    category: 'utdanning',
    tags: ['utdanning', 'kurs', 'videreutdanning', 'skattefritt', 'kompetanse'],
    type: 'saving',
    impact: 'Ingen beløpsgrense — selskapet betaler, du slipper skatt',
    law_ref: 'FSFIN §§ 5-15-10 til 5-15-14',
  },
  {
    id: 'education_internal',
    title: 'Intern opplæring er alltid skattefri — ingen tilknytningskrav',
    body: 'Intern utdanning og opplæring (kurs du arrangerer selv, interne workshops, systemopplæring) er alltid skattefri for den ansatte, uavhengig av om innholdet er direkte jobberelatert eller ikke. Her kreves ikke den samme jobberelevansen som for ekstern utdanning. Perfekt for alt fra Excel-kurs til lederskapsutvikling.',
    category: 'utdanning',
    tags: ['utdanning', 'intern-opplæring', 'kurs', 'skattefritt'],
    type: 'saving',
    law_ref: 'FSFIN § 5-15-13',
  },
  {
    id: 'education_private_benefit',
    title: 'Utdanning uten jobberelevans er skattepliktig lønn',
    body: 'Dekker selskapet en utdanning som ikke har tilknytning til arbeidet — f.eks. et hobbyspråkkurs, en livscoachutdanning, eller en bachelor i et helt annet felt — er dette en skattepliktig fordel for deg. Verdien legges til lønnen og innberettes i a-meldingen. "Relevant" er nøkkelordet: kan du argumentere for at det gjør deg bedre i jobben du har nå?',
    category: 'utdanning',
    tags: ['utdanning', 'skattepliktig', 'privat', 'fordel'],
    type: 'gotcha',
    law_ref: 'FSFIN § 5-15-14',
  },
  {
    id: 'education_what_covered',
    title: 'Hva kan dekkes skattefritt: kursavgift, bøker, reise — og lønn under studietid',
    body: 'Når utdanningen kvalifiserer som skattefri kan selskapet dekke: kursavgifter og studiemateriell, reise og overnatting til samlinger, og til og med lønn under studietid (permisjon med lønn). Alt dette er fradragsberettiget for selskapet og skattefritt for den ansatte. Dokumentér sammenhengen mellom utdanningen og jobben.',
    category: 'utdanning',
    tags: ['utdanning', 'hva-kan-dekkes', 'kursavgift', 'reise', 'bøker'],
    type: 'saving',
    impact: 'Kursavgift + reise + bøker + lønn under studietid — alt skattefritt',
  },
  {
    id: 'education_language',
    title: 'Språkkurs: skattefritt hvis nødvendig for jobben — ellers skattepliktig',
    body: 'Engelsk for AS-eier med internasjonale kunder: grønn sone. Spansk for eksportsjef: skattefritt. Japansk uten jobbrelevans: skattepliktig. Terskelen er ikke høy, men du må kunne forklare hvorfor akkurat dette språket er nødvendig for din stilling. En setning i formålsnoten holder som dokumentasjon.',
    category: 'utdanning',
    tags: ['utdanning', 'språkkurs', 'engelsk', 'jobberelevans'],
    type: 'rule',
  },
  {
    id: 'education_quit_risk',
    title: 'Dyr utdanning like før oppsigelse? Skatteetaten ser på det',
    body: 'Dekker selskapet en dyr utdanning (f.eks. mastergrad) rett før du slutter, kan Skatteetaten hevde at fordelen primært er til nytte for neste arbeidsgiver — og dermed skattepliktig. Særlig risikabelt der utdanningen er generell og du slutter kort tid etter. God dokumentasjon på det faglige formålet og tilknytningen til nåværende stilling er avgjørende.',
    category: 'utdanning',
    tags: ['utdanning', 'oppsigelse', 'risiko', 'dokumentasjon'],
    type: 'gotcha',
  },

  // ── FAMILIEANSATTE BARN ──────────────────────────────────────────────────────

  {
    id: 'family_employee_frikort',
    title: 'Barn i selskapet: tjener under 100 000 kr = betaler ingen skatt (frikort 2025/2026)',
    body: 'Frikortgrensen er 100 000 kr per år (Skatteetaten, 2025/2026). Tjener barnet ditt under dette i selskapet, betaler de ingen skatt. For selskapet er lønnen fullt fradragsberettiget og reduserer selskapsskatten (22%). En win-win: du overfører verdier skatteeffektivt, og barnet tjener penger skattefritt. Husk at selskapet betaler AGA (14,1%) på toppen.',
    category: 'familieansatte',
    tags: ['barn', 'familieansatte', 'frikort', '100000-kr', 'fradrag'],
    type: 'saving',
    impact: 'Inntil 100 000 kr skattefritt til barnet — 22% fradrag for selskapet',
  },
  {
    id: 'family_employee_market_wage',
    title: 'Barns lønn MÅ tilsvare markedsverdi for jobben de faktisk gjør',
    body: 'Betaler du barnet mer enn en ekstern person ville fått for samme jobb, anser Skatteetaten overskuddet som utbytte eller gave — og det beskattes deretter. Betaler du for lite for reelt arbeid, kan det omklassifiseres. Typisk godkjent: 100–200 kr timen for praktiske oppgaver som sosiale medier, lagerhjelp, pakking, rydding, enkel saksbehandling.',
    category: 'familieansatte',
    tags: ['barn', 'familieansatte', 'markedslønn', 'utbytte'],
    type: 'gotcha',
  },
  {
    id: 'family_employee_age',
    title: 'Alder og arbeidsmiljøloven: barn under 15 år har strenge begrensninger',
    body: 'Under 13 år: ikke tillatt å ansette. 13–14 år: kun lett arbeid som ikke skader skolegang — maks 2 timer på skoledager, 7 timer på fridager, ikke farlig arbeid. 15–17 år: kan ansettes mer fleksibelt, men ikke farlig arbeid og ikke nattarbeid. Fra 18 år: ordinært ansettelsesforhold på lik linje med alle andre. Ansettelseskontrakt og timeregistrering er krav.',
    category: 'familieansatte',
    tags: ['barn', 'alder', 'arbeidsmiljøloven', 'ansettelse'],
    type: 'rule',
    law_ref: 'Arbeidsmiljøloven §§ 11-1 til 11-7',
  },
  {
    id: 'family_employee_real_work',
    title: 'Arbeidet MÅ være reelt og dokumentert — lønn for ingenting er uttak',
    body: 'Skatteetaten sjekker at lønn til familiemedlemmer svarer til reelt utført arbeid. Dokumentér: hvilke oppgaver, timer jobbet, hvem som har kontrollert arbeidet. Eksempler på godkjente oppgaver: sosiale medier og content, lagerhjelp og pakking, rydding og rengjøring, enkel administrasjon og arkivering, fotografering av produkter.',
    category: 'familieansatte',
    tags: ['barn', 'familieansatte', 'reelt-arbeid', 'dokumentasjon'],
    type: 'gotcha',
  },
  {
    id: 'family_employee_aga_math',
    title: 'Regnestykket: 100 000 kr til barnet koster selskapet ca. 89 000 kr netto',
    body: 'Betaler selskapet 100 000 kr i lønn til barnet: AGA 14,1% = 14 100 kr. Totalkostnad selskap = 114 100 kr. Men: lønn + AGA gir 22% selskapsskattefradrag = 25 100 kr spart i selskapsskatt. Nettokostnad selskapet: ca. 89 000 kr. Barnet mottar 100 000 kr helt skattefritt (frikort). Dette er ett av de mest skatteeffektive tiltakene for familier med AS.',
    category: 'familieansatte',
    tags: ['barn', 'familieansatte', 'AGA', 'regnestykke', 'skatteeffektivt'],
    type: 'planning',
    impact: 'Nettokostnad selskapet ~89 000 kr — barnet mottar 100 000 kr skattefritt',
  },
  {
    id: 'family_employee_spouse',
    title: 'Ektefelle i selskapet: økt oppmerksomhet fra Skatteetaten ved bokettersyn',
    body: 'Ektefelle kan ansettes på vanlige vilkår, men Skatteetaten ser grundigere på transaksjoner mellom nærstående. Markedslønn, reelt arbeid, skriftlig ansettelseskontrakt og timeregistrering er ekstra viktig. Sørg for at ektefellens arbeidsoppgaver er klart definert og adskilt fra det du selv gjør. SkatteSmart lar deg merke ansatte som familierelasjon.',
    category: 'familieansatte',
    tags: ['ektefelle', 'familieansatte', 'nærstående', 'bokettersyn'],
    type: 'gotcha',
    tool_href: '/people',
  },

  // ── HJEMMEKONTOR ────────────────────────────────────────────────────────

  {
    id: 'home_office_enk',
    title: 'ENK med hjemmekontor: sjablong 2 000 kr eller faktisk kostnad',
    body: 'ENK-eiere kan velge mellom sjablongfradrag (2 000 kr/år, ingen krav til dokumentasjon) eller faktiske kostnader basert på arealdelen av hjemmet brukt til næring. Faktisk kostnad krever at rommet brukes utelukkende til næring. For mange er sjablongen enklest — men bor du stort og leier dyrt, kan faktisk kostnad gi mer.',
    category: 'hjemmekontor',
    tags: ['hjemmekontor', 'ENK', 'fradrag', 'sjablong'],
    type: 'saving',
    law_ref: 'FSFIN § 6-44',
  },
  {
    id: 'home_office_as_owner',
    title: 'AS-eier med hjemmekontor: ingen hjemmekontorfradrag i AS',
    body: 'AS kan leie kontorlokaler av eieren (deg), men dette krever en reell leiekontrakt til markedsleie, styrevedtak og separat utbetaling. Det er komplisert og kontrolleres hardt. Enklere: sørg for at selskapet betaler for internett og mobil — det er sikre skattefordeler som dekker hjemmekontorbehovet for de fleste.',
    category: 'hjemmekontor',
    tags: ['hjemmekontor', 'AS', 'eier', 'leie'],
    type: 'rule',
  },

  // ── GENERELT / FRADRAG ───────────────────────────────────────────────────

  {
    id: 'tax_audit_documentation',
    title: 'Bokettersyn: de ser alltid på representasjon, firmakort og velferd',
    body: 'Ved bokettersyn ser Skatteetaten typisk på: representasjonsbilag (deltakerinfo og formål), firmakortbruk (private kjøp?), velferdstiltak (alle invitert?), og mellomregning/aksjonærlån. Har du god dokumentasjon på disse fire områdene er du trygg. Bruk 1 time i januar på å samle bilag for fjoråret.',
    category: 'generelt',
    tags: ['bokettersyn', 'dokumentasjon', 'representasjon', 'firmakort'],
    type: 'gotcha',
  },
  {
    id: 'tax_5year_rule',
    title: 'Bilag skal oppbevares i 5 år — digital er like bra som papir',
    body: 'Bokføringsloven krever at bilag oppbevares i 5 år etter regnskapsårets slutt. Digital lagring (PDF, foto) er fullt godkjent. Bruk en bilagsapp (Fiken, Tripletex, Unimicro) eller en strukturert mappestruktur i OneDrive/Google Drive. Mister du bilag, mister du fradraget.',
    category: 'generelt',
    tags: ['bilag', '5-år', 'dokumentasjon', 'digital'],
    type: 'rule',
  },
  {
    id: 'tax_january_checklist',
    title: 'Januar-sjekklisten: 5 ting å gjøre i januar for et tryggere skatteår',
    body: '1) Arkiver alle desemberbilag. 2) Kontroller mellomregning med selskapet. 3) Se over årets velferdstiltak — har du deltakerliste? 4) Sjekk at alle gaver er innberettet korrekt. 5) Vurder lønn/utbytte-optimalisering for inneværende år.',
    category: 'generelt',
    tags: ['januar', 'sjekkliste', 'planlegging', 'årsrutine'],
    type: 'planning',
  },
  {
    id: 'tax_deductibility_test',
    title: 'En enkel test for om noe er fradragsberettiget: ville du gjort det uten selskapet?',
    body: 'Tommelfingerregelen: ville du betalt for det av egne penger hvis du ikke hadde selskapet? Hvis svaret er nei, er det sannsynligvis fradragsberettiget. Er svaret ja (f.eks. mat, klær, ferie), er det sannsynligvis ikke fradragsberettiget. Det er åpenbart en forenkling, men det er et godt startpunkt.',
    category: 'generelt',
    tags: ['fradrag', 'test', 'prinsipp'],
    type: 'rule',
  },
]

// ── Utility functions ────────────────────────────────────────────────────────

export function getTipsByCategory(category: TipCategory): Tip[] {
  return TIPS.filter(t => t.category === category)
}

export function getTipsByTag(tag: string): Tip[] {
  return TIPS.filter(t => t.tags.includes(tag))
}

export function getTipsByTool(href: string): Tip[] {
  return TIPS.filter(t => t.tool_href === href)
}

export function getRandomTips(n: number, category?: TipCategory): Tip[] {
  const pool = category ? TIPS.filter(t => t.category === category) : TIPS
  const shuffled = [...pool].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, n)
}

export const TIP_TYPE_LABELS: Record<TipType, string> = {
  saving:   '💰 Spar penger',
  gotcha:   '⚠️ Felle å unngå',
  rule:     '📋 Regelinfo',
  planning: '🎯 Planlegging',
}

export const TIP_CATEGORY_LABELS: Record<TipCategory, string> = {
  'velferd':          'Velferd & julebord',
  'representasjon':   'Representasjon',
  'lønn-utbytte':     'Lønn & utbytte',
  'gaver':            'Gaver & rabatter',
  'telefon-internett':'Telefon & internett',
  'bil':              'Bil & kjørebok',
  'hytte-båt':        'Hytte & båt',
  'aksjonærlån':      'Aksjonærlån',
  'pensjon':          'Pensjon',
  'firmakort':        'Firmakort',
  'styremøter':       'Styremøter',
  'hjemmekontor':     'Hjemmekontor',
  'sykepenger':       'Sykepenger',
  'fradrag':          'Fradrag',
  'generelt':         'Generelt',
  'utdanning':        'Utdanning & kurs',
  'familieansatte':   'Familieansatte & barn',
}
