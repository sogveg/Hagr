# PRIVACY_AND_SECURITY – Personvern og sikkerhetskrav

> Versjon: 1.0 · Opprettet: 2026-08-05  
> Status: UTKAST — DPIA og juridisk gjennomgang gjenstår

---

## 1. Personopplysninger Hagr behandler

Hagr vil kunne behandle følgende kategorier personopplysninger:

| Kategori | Eksempler |
|----------|----------|
| Økonomi | Lønn, inntekt, eierforhold, utbytte |
| Familie | Ektefelle, barn, familierelasjon til ansatte |
| Helse (indirekte) | Planlagt foreldrepermisjon, sykepengerettigheter |
| Atferd | Kjørebok, reiser, bilbruk, hjemmekontor |
| Ansatte | Navn, rolle, ansettelsesforhold |
| Tredjepart | Kunde- og deltakeropplysninger i representasjonsregister |
| Avtaler | Regnskapsdokumenter, signaturer |

Personopplysninger om ansatte og deltakere i representasjonsregisteret krever særskilt vurdering — Hagr behandler disse på vegne av brukeren (databehandler).

---

## 2. Obligatoriske tiltak

Følgende er minimumskrav før produksjonslansering:

### 2.1 Behandlingsgrunnlag
- [ ] Avklare behandlingsgrunnlag for alle personopplysningskategorier (avtale, berettiget interesse, samtykke)
- [ ] Dokumentere i behandlingsprotokoll (GDPR art. 30)

### 2.2 Dokumentasjon
- [ ] Personvernerklæring tilgjengelig på alle sider
- [ ] Personvernerklæringen er klar og konkret — ikke generisk boilerplate
- [ ] Databehandleravtale med Supabase og andre underleverandører
- [ ] Databehandleravtale med eventuelle AI-leverandører (Anthropic)

### 2.3 Brukerrettigheter
- [ ] Eksport av egne data (GDPR art. 20)
- [ ] Sletting av konto og data (GDPR art. 17)
- [ ] Retting av opplysninger (GDPR art. 16)
- [ ] Slettefrister definert og implementert

### 2.4 Tilgangskontroll
- [ ] Tofaktorautentisering tilgjengelig (anbefalt) eller obligatorisk
- [ ] Row Level Security (RLS) aktivert på alle Supabase-tabeller med persondata
- [ ] Brukere kan kun se egne data
- [ ] Admin-tilgang logges

### 2.5 Teknisk sikkerhet
- [ ] Kryptering i transit (HTTPS/TLS overalt)
- [ ] Kryptering av sensitive felt i databasen
- [ ] Hendelseslogging (hvem gjorde hva, når)
- [ ] Sikkerhetskopi med definert RPO/RTO
- [ ] Sårbarhetsskanning av avhengigheter (npm audit)

### 2.6 Miljøseparasjon
- [ ] Strikt skille mellom utvikling og produksjon
- [ ] Ingen ekte kundedata i testmiljø
- [ ] Anonymiserte testdata brukes i utvikling

### 2.7 AI-integrasjon (Anthropic)
- [ ] Avklare om data sendes til Anthropic, og på hvilken basis
- [ ] Ikke sende sensitive personopplysninger til AI-modeller uten eksplisitt samtykke
- [ ] AI-assistenten svarer kun basert på brukerens egne data + allment tilgjengelig informasjon

---

## 3. Dataminimering

Prinsipp: Samle kun det som er nødvendig for å levere den konkrete funksjonaliteten.

| Felt | Nødvendig for | Ikke samle dersom |
|------|--------------|-------------------|
| Fødselsdato | Pensjonsberegning | Kun skatteberegning uten pensjon |
| Ansattes navn | Deltakerliste/representasjon | Kun anonymisert statistikk |
| Kjørebok (GPS) | Varebil faktisk privatkjøring | Tilstrekkelig med km/destinasjon |
| Bankkontonummer | Ikke nødvendig | Aldri |

---

## 4. Tredjeparter og databehandlere

| Leverandør | Formål | Databehandleravtale |
|-----------|--------|---------------------|
| Supabase | Database og auth | Må inngås |
| Vercel | Hosting | Må inngås |
| Anthropic | AI-assistent | Må inngås / avklares |
| Resend | E-post | Må inngås |
| Stripe | Betaling | Inngås ved betalingsimplementasjon |

---

## 5. DPIA – Risikovurdering

En Data Protection Impact Assessment (DPIA) bør gjennomføres før lansering fordi:
* Hagr behandler finansielle opplysninger systematisk
* Hagr behandler opplysninger om ansatte
* Profilbasert anbefaling (personalisert skatteprofil) kan påvirke brukernes disposisjoner

DPIA bør inkludere:
* Beskrivelse av behandlingen
* Nødvendighets- og proporsjonalitetsvurdering
* Risikoidentifisering
* Tiltak og restrisiko
* Datatilsynet bør konsulteres dersom høy restrisiko

---

## 6. Hendelsesrespons

Dersom personopplysninger kompromitteres:
1. Intern varsling innen 1 time
2. Omfangsanalyse innen 24 timer
3. Varsling til Datatilsynet innen 72 timer (dersom risiko for registrerte)
4. Varsling til berørte brukere dersom høy risiko
5. Dokumentasjon av hendelse og tiltak

---

## 7. Sikre API-nøkler

**Merk:** Anthropic API-nøkkel og Supabase service_role-nøkkel ble eksponert i en tidligere utviklersamtale. Disse MÅ roteres dersom det ikke er gjort.

Rutiner:
* Alle API-nøkler lagres som miljøvariabler (aldri i kode)
* Rotér nøkler ved mistanke om eksponering
* `service_role`-nøkkelen skal aldri eksponeres klientsiden
* Bruk `anon`-nøkkelen klientsiden med RLS som sikkerhetsmekanisme

---

## 8. TODO — Prioritert

- [ ] Rotér Supabase service_role og anon keys (ble eksponert i chat)
- [ ] Rotér Anthropic API key (ble eksponert i chat)
- [ ] Inngå databehandleravtale med Supabase
- [ ] Inngå databehandleravtale med Anthropic
- [ ] Skriv personvernerklæring (norsk jurist anbefales)
- [ ] Gjennomfør DPIA
- [ ] Verifiser RLS på alle tabeller med persondata
- [ ] Implementer eksport og sletting av brukerdata
