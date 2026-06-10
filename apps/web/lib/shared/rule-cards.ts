export type RuleCardRiskLevel = 'green' | 'yellow' | 'red'
export type RuleCompanyType = 'AS' | 'ENK' | 'Holding-AS' | 'ANS' | 'other'

export interface RuleCard {
  id: string
  title: string
  category: string
  company_types: RuleCompanyType[]
  limit_amount?: number
  limit_period?: 'year' | 'month' | 'event'
  limit_unit?: string
  base_risk: RuleCardRiskLevel
  summary: string
  green_examples: string[]
  yellow_examples: string[]
  red_examples: string[]
  required_documentation: string[]
  law_reference?: string
  updated_year: number
}

export const RULE_CARDS: RuleCard[] = [
  {
    id: 'gift_employee',
    title: 'Gave til ansatte',
    category: 'Naturalytelser',
    company_types: ['AS', 'Holding-AS', 'ENK'],
    limit_amount: 5000,
    limit_period: 'year',
    limit_unit: 'kr per person',
    base_risk: 'green',
    summary: 'Gave til ansatt kan være skattefri inntil 5 000 kr per person per år, forutsatt at gaven ikke er kontanter eller gavekort som kan innløses i penger.',
    green_examples: [
      'Gavekort på 4 900 kr som ikke kan innløses kontant',
      'Flaske vin + sjokolade til jul, verdi 800 kr',
      'Konsertbilletter til to, verdi 2 400 kr',
    ],
    yellow_examples: [
      'Gave til styremedlem i lite selskap uten andre ansatte',
      'Gaver akkumulert til nær 5 000 kr grensen',
      'Gave på jubileum kombinert med prestasjonsvurdering',
    ],
    red_examples: [
      'Kontanter',
      'Vipps-overføring som gave',
      'Gavekort som kan løses ut i kontanter',
      'Gave som egentlig er bonus for godt salgsresultat',
    ],
    required_documentation: ['Mottaker og rolle', 'Dato', 'Verdi og type gave', 'Kvittering', 'Bekreftelse på at gavekort ikke kan innløses kontant'],
    law_reference: 'FSFIN § 5-15-3',
    updated_year: 2026,
  },
  {
    id: 'personal_discount',
    title: 'Personalrabatt',
    category: 'Naturalytelser',
    company_types: ['AS', 'ENK'],
    limit_amount: 10000,
    limit_period: 'year',
    limit_unit: 'kr rabatt per ansatt',
    base_risk: 'green',
    summary: 'Ansatte kan motta rabatt på varer og tjenester selskapet normalt selger, inntil 10 000 kr per år. Gjelder kun selskapets egne produkter/tjenester.',
    green_examples: [
      'Butikkansatt kjøper varer til kostpris, rabatt verdi 3 000 kr',
      'IT-konsulent får rabatt på selskapets egne programvarelisenser',
    ],
    yellow_examples: [
      'Eier og eneste ansatt bruker hele grensen på egne produkter',
      'Rabatt på varer selskapet kjøper videre, men ikke produserer',
    ],
    red_examples: [
      'Rabatt hos tredjeparts leverandør som ikke er selskapets produkt',
      'Rabatt til ektefelle uten ansettelsesforhold',
      'Kontantutbetaling kalt "rabatt"',
    ],
    required_documentation: ['Ansatt og rolle', 'Vare/tjeneste', 'Markedspris og betalt pris', 'Dato', 'Bekreftelse på at selskapet normalt selger dette'],
    law_reference: 'Skatteloven § 5-15 (2), FSFIN § 5-15-5',
    updated_year: 2026,
  },
  {
    id: 'phone_internet',
    title: 'Telefon og internett (EK)',
    category: 'Naturalytelser',
    company_types: ['AS', 'ENK', 'Holding-AS'],
    limit_amount: 4392,
    limit_period: 'year',
    limit_unit: 'kr skattepliktig sjablongbeløp',
    base_risk: 'green',
    summary: 'Arbeidsgiver kan dekke mobil og internett. Ansatte beskattes av en sjablongsum på 4 392 kr per år (2026) uavhengig av faktisk bruk, forutsatt tjenstlig behov.',
    green_examples: [
      'Ansatt med behov for kontakt med kunder/leverandører får mobil dekket',
      'Hjemmekontor-arbeider får bredbånd dekket',
    ],
    yellow_examples: [
      'Hytte-internett dekkes uten dokumentert tjenstlig behov',
      'Streaming/TV-pakke inkludert i abonnementet som dekkes',
    ],
    red_examples: [
      'Privat mobil uten noe tjenstlig behov dekkes av selskapet',
      'Gaming-abonnement dekkes som "internett"',
    ],
    required_documentation: ['Tjenstlig behovsnotat', 'Fakturaer', 'Innberetning i a-melding'],
    law_reference: 'Skatteloven § 5-12 (3), FSFIN § 5-12-20',
    updated_year: 2026,
  },
  {
    id: 'board_meeting',
    title: 'Styremøte',
    category: 'Dokumentasjon',
    company_types: ['AS', 'Holding-AS'],
    base_risk: 'green',
    summary: 'Styremøte er lovpålagt for AS. Protokoll er obligatorisk. Kostnader til styremøtet (møterom, servering, reise) er fradragsberettiget.',
    green_examples: [
      'Ordinært styremøte med agenda, deltakerliste og signert protokoll',
      'Digitalt styremøte med Teams-link og deltakerliste',
    ],
    yellow_examples: [
      'Styremøte uten formell protokoll',
      'Styremøte kombinert med privat middag',
    ],
    red_examples: [
      'Ingen styremøter avholdt i løpet av regnskapsåret',
      '"Styremøte" avholdt på ferie uten agenda',
    ],
    required_documentation: ['Innkalling', 'Agenda', 'Deltakerliste', 'Signert protokoll med vedtak'],
    law_reference: 'Aksjeloven § 6-19, § 6-29',
    updated_year: 2026,
  },
  {
    id: 'strategy_gathering',
    title: 'Strategisamling / Offsite',
    category: 'Representasjon og samlinger',
    company_types: ['AS', 'ENK', 'Holding-AS'],
    base_risk: 'yellow',
    summary: 'Faglige samlinger utenfor kontoret kan gi fradrag for kostnader. Kravet er reelt faglig innhold, dokumentert program, og at samlingen ikke er en forkledd privat reise.',
    green_examples: [
      'To-dagers samling på hotell med konferanselokale, faglig program 70%+, alle ansatte',
      'Strategigjennomgang med ekstern konsulent, signert referat',
    ],
    yellow_examples: [
      'Samling med kun eier + ektefelle',
      'Samling i sommermånedene på feriested',
      'Overnattingssamling uten skriftlig program',
    ],
    red_examples: [
      'Familieferie omdøpt til "strategisamling"',
      'Samling der sosialt innhold dominerer (>50%)',
      'Ingen deltakere med faglige roller',
    ],
    required_documentation: ['Formålsnotat', 'Program med tidspunkter', 'Deltakerliste med rollebeskrivelser', 'Kvitteringer', 'Referat/beslutningslogg'],
    updated_year: 2026,
  },
  {
    id: 'representation_dinner',
    title: 'Representasjon (middag/lunsj)',
    category: 'Representasjon og samlinger',
    company_types: ['AS', 'ENK', 'Holding-AS', 'ANS'],
    limit_amount: 560,
    limit_period: 'event',
    limit_unit: 'kr per person (middag)',
    base_risk: 'green',
    summary: 'Ekstern representasjon med kunder/leverandører er fradragsberettiget inntil 560 kr per person eks. mva for middag. Lunsj i arbeidstid er fullt fradragsberettiget.',
    green_examples: [
      'Lunsj med kunde i arbeidstid, 450 kr per person',
      'Middag med tre kunder, totalt 1 500 kr (= 500 kr/person, under grensen)',
    ],
    yellow_examples: [
      'Middagsutgift akkumulert til nær 560 kr/person-grensen',
      'Alkohol inkludert i regningen',
    ],
    red_examples: [
      'Privat middag registrert som representasjon',
      'Kun interne ansatte — dette er internt arrangement',
      'Brennevin/alkohol krevd som representasjonsfradrag',
    ],
    required_documentation: ['Dato og sted', 'Deltakerliste (navn + selskap)', 'Forretningsmessig formål', 'Kvittering'],
    law_reference: 'Skatteloven § 6-21, FSFIN § 6-21-1',
    updated_year: 2026,
  },
  {
    id: 'welfare_measures',
    title: 'Velferdstiltak for ansatte',
    category: 'Naturalytelser',
    company_types: ['AS', 'ENK'],
    limit_amount: 5000,
    limit_period: 'year',
    limit_unit: 'kr per ansatt (anbefalt ramme)',
    base_risk: 'green',
    summary: 'Interne arrangementer for ansatte (julebord, teambuilding, sommerfest) er skattefritt for ansatte og fradragsberettiget for selskapet. Rimelighetshensyn gjelder.',
    green_examples: [
      'Julebord på restaurant, alle ansatte inkludert',
      'Sommerfest med aktiviteter, 1 200 kr per person',
      'Teambuilding-dag, 800 kr per person',
    ],
    yellow_examples: [
      'Veldig eksklusivt arrangement (>5 000 kr/person)',
      'Kun eier + eiers familie — ingen andre ansatte',
    ],
    red_examples: [
      'Selskapet har ingen ansatte men dekker "ansatt-goder" til eier alene',
      'Luksusreise for én person kalt velferdstiltak',
    ],
    required_documentation: ['Deltakerliste', 'Formål', 'Kvitteringer'],
    updated_year: 2026,
  },
  {
    id: 'home_office',
    title: 'Hjemmekontor-fradrag',
    category: 'Fradrag',
    company_types: ['ENK'],
    limit_amount: 2000,
    limit_period: 'year',
    limit_unit: 'kr sjablongfradrag',
    base_risk: 'green',
    summary: 'ENK-eiere kan kreve hjemmekontorfradrag enten som sjablong (2 000 kr/år) eller faktiske kostnader basert på areal-andel. Rommet må brukes utelukkende til næring.',
    green_examples: [
      'Dedikert kontor brukt utelukkende til næring, dokumentert med foto og arealberegning',
      'Sjablongfradrag 2 000 kr uten dokumentasjonskrav',
    ],
    yellow_examples: [
      'Rom som brukes til både arbeid og privat',
    ],
    red_examples: [
      'Kjøkkenbord som "hjemmekontor"',
      'Alle husleiekostnadene krevet som næringsfradrag',
    ],
    required_documentation: ['Arealberegning (ved faktiske kostnader)', 'Leiekontrakt eller takstdokument'],
    law_reference: 'FSFIN § 6-44',
    updated_year: 2026,
  },
  {
    id: 'shareholder_loan',
    title: 'Aksjonærlån',
    category: 'Risiko',
    company_types: ['AS', 'Holding-AS'],
    base_risk: 'red',
    summary: 'Lån fra AS til aksjonær beskattes som utbytte i det året lånet tas opp. Dette ble innstrammet i 2022. Slike lån er i praksis avskaffet som skattemessig planleggingsverktøy.',
    green_examples: [],
    yellow_examples: [
      'Kortvarig mellomregning som tilbakebetales innen regnskapsårets slutt',
    ],
    red_examples: [
      'Lån fra AS til privatperson/aksjonær — beskattes som utbytte',
      'Mellomregning som vokser år for år uten tilbakebetaling',
    ],
    required_documentation: ['Tilbakebetalingsplan', 'Styrevedtak', 'Renteberegning til markedsrente'],
    law_reference: 'Skatteloven § 10-11 (4)',
    updated_year: 2026,
  },
  {
    id: 'salary_vs_dividend',
    title: 'Lønn vs. utbytte',
    category: 'Optimalisering',
    company_types: ['AS', 'Holding-AS'],
    base_risk: 'green',
    summary: 'Optimal fordeling mellom lønn og utbytte avhenger av overskudd, pensjonsønsker og sykepenger-rettigheter. Kombinasjonen gir som regel lavest skatt og best trygdedekning.',
    green_examples: [
      'Lønn på ca. 600 000–700 000 kr + utbytte av restoverskudd',
      'Lønn tilpasset 7,1 G for full sykepenger-rettighet',
    ],
    yellow_examples: [
      'Svært lav lønn (under 300 000 kr) med høy utbytteuttak',
      'All inntekt som lønn over toppskattgrensen',
    ],
    red_examples: [
      'Ingen lønn til aktivt arbeidende eier — risiko for omklassifisering',
    ],
    required_documentation: ['Styrevedtak ved utbyttevedtak', 'Generalforsamlingsprotokoll'],
    updated_year: 2026,
  },
  {
    id: 'education_employer',
    title: 'Utdanning på arbeidsgivers bekostning',
    category: 'Naturalytelser',
    company_types: ['AS', 'ENK', 'Holding-AS'],
    base_risk: 'green',
    summary: 'Arbeidsgiver kan dekke kurs og videreutdanning skattefritt for den ansatte — forutsatt at utdanningen har tilknytning til arbeidet. Ingen øvre beløpsgrense. Selskapet får fullt fradrag. Intern opplæring er alltid skattefri.',
    green_examples: [
      'MBA relevant for lederrollen din — dekket av selskapet',
      'Fagkurs og bransjesertifiseringer (IT, økonomi, jus)',
      'Internt Excel- eller systemkurs for alle ansatte',
      'Språkkurs (engelsk) for ansatt med internasjonale kunder',
      'Studier i regnskapsføring for regnskapsansatt',
    ],
    yellow_examples: [
      'Generell lederutvikling uten tydelig kobling til nåværende stilling',
      'Dyr utdanning (mastergrad) avsluttet kort tid før oppsigelse',
      'Kurs i et felt selskapet vurderer å ekspandere inn i — men ikke er i ennå',
    ],
    red_examples: [
      'Hobbyspråkkurs uten jobberelevans',
      'Utdanning i et felt som er helt fremmed for selskapets virksomhet',
      'Privat livscoachutdanning uten noen forretningsmessig tilknytning',
    ],
    required_documentation: [
      'Formålsnotat: tilknytning mellom utdanning og nåværende stilling',
      'Kursbevis / eksamensbevis',
      'Kvitteringer for kursavgift, reise og materiell',
      'Styrevedtak ved større utdanningsinvesteringer',
    ],
    law_reference: 'FSFIN §§ 5-15-10 til 5-15-14',
    updated_year: 2026,
  },
  {
    id: 'family_employees',
    title: 'Familieansatte — barn og ektefelle i selskapet',
    category: 'Risiko',
    company_types: ['AS', 'ENK'],
    base_risk: 'yellow',
    summary: 'Barn og ektefelle kan ansettes i selskapet på vanlige vilkår. Frikortgrensen er 100 000 kr (2025/2026) — barn som tjener under dette betaler ingen skatt. Lønn MÅ svare til markedsverdi for reelt arbeid. Skatteetaten har økt fokus på transaksjoner mellom nærstående.',
    green_examples: [
      'Barn 15+ ansatt som sommervikar, lønn 80 000 kr/år — under frikortgrensen',
      'Ektefelle ansatt i deltidsstilling med skriftlig kontrakt og markedslønn',
      'Barn 16 år hjelper med sosiale medier og pakking — 120 kr/time, dokumenterte timer',
    ],
    yellow_examples: [
      'Ektefelle ansatt uten skriftlig ansettelseskontrakt',
      'Barn 13–14 år i lettere arbeid — krever nøye overholdelse av arbeidstidsregler',
      'Lønn til barn akkumulert til like under frikortgrensen hvert år',
    ],
    red_examples: [
      'Lønn til barn under 13 år',
      'Lønn som overstiger markedsverdi for arbeidet — behandles som utbytte/gave',
      'Lønn for arbeid som ikke er reelt utført og dokumentert',
      'Barn ansatt kun på papiret uten faktisk arbeidsinnsats',
    ],
    required_documentation: [
      'Skriftlig ansettelseskontrakt',
      'Timeregistrering',
      'Beskrivelse av arbeidsoppgaver',
      'Lønnsslipp og a-melding',
      'Bekreftelse på at lønn svarer til markedsverdi',
    ],
    law_reference: 'Arbeidsmiljøloven §§ 11-1 til 11-7 · Skatteloven § 5-15',
    updated_year: 2026,
  },
]

export const RULE_CATEGORIES = [...new Set(RULE_CARDS.map(r => r.category))]
