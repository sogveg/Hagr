# IMPLEMENTATION_ROADMAP – Prioritert utviklingsplan for Hagr

> Versjon: 1.0 · Opprettet: 2026-08-05  
> Basert på: HAGR_PRODUCT_BLUEPRINT.md

---

## Overordnet prinsipp

> Ingen tips uten kilde. Ingen kalkulator uten dokumenterte formler.

Lansering med betalende brukere krever at Fase 1 er ferdig. Fase 2 kan rulles ut inkrementelt.

---

## Fase 1 – Faglig fundament (Krav for lansering)

**Mål:** Gjøre dagens produkt faglig forsvarlig.

### 1A. Innholdsopprydding (tips og regelkort)

Status per innholdstype:

| Emne | Status | Mangler |
|------|--------|---------|
| Representasjon | Delvis rettet | MVA-fradrag separat, klassifisering av kun-ansatt-kostnader |
| Firmabil | Delvis rettet | EV-feil fjernet, men varebil kl.2, 40 000 km-regel, MVA gjenstår |
| Kilometergodtgjørelse | Rettet (3,50 kr/km, flat) | Skill reiseregulativ vs. skattefri sats |
| Aksjonærlån | Delvis rettet | 100k/60-dager-unntak lagt til, men lån fra aksjonær til AS mangler |
| Trygderettigheter | Delvis rettet | 6G vs 7,1G skilt. Dagpenger og OTP-plikt mangler |
| Hytte og båt | Delvis rettet | MVA-korreksjon, kommersiell utleie, eiendel i aksjonærens interesse mangler |
| Utdanning | Delvis presisert | Lederutdanning, ekstern utdanning trenger mer forsiktighet |
| Velferdstiltak | Delvis modert | Absolutte formuleringer redusert, men «normalt trygt»-kroner mangler kilde |

**Handlinger:**
- [ ] Gå gjennom alle 50+ tips med mal fra `HAGR_PRODUCT_BLUEPRINT.md` § 3
- [ ] Legg til risikonivå (grønn/gul/oransje/rød) på alle tips
- [ ] Legg til kildehenvisning på alle tips
- [ ] Legg til dokumentasjonsliste på alle tips
- [ ] Fjern forbudte formuleringer (se `LEGAL_CONTENT_STANDARD.md` § 3)

### 1B. Teknisk grunnlag

- [ ] Utvid tips-TypeScript-interfacet med: `risk_level`, `sources`, `documentation_required`, `accounting_table`, `common_errors`, `escalation_rule`, `version`
- [ ] Utvid rule-cards-interfacet tilsvarende
- [ ] Legg til skatteår-tag på alle satser
- [ ] DB-migrasjon: kilderegistrering og versjonstabell

### 1C. Legalt og compliance

- [ ] Legaldisclaimer på alle sider (jf. `LEGAL_CONTENT_STANDARD.md`)
- [ ] Risikonivå-spesifikke disclaimers i kalkulatorer
- [ ] Brukervilkår (ekstern advokat)
- [ ] Personvernerklæring (ekstern advokat)
- [ ] Rotér kompromitterte API-nøkler (se `PRIVACY_AND_SECURITY.md`)

### 1D. Markedsføring

- [ ] Fjern alle forbudte påstander fra nettsted og landing page
- [ ] Endre posisjonering til «Betal riktig skatt – ikke mer enn nødvendig»
- [ ] Fjern konstruerte kundeuttalelser, erstatt med reelle caser med samtykke

---

## Fase 2 – Kjerneverdien

**Mål:** Produkt noen faktisk betaler for månedlig.

### 2A. Kalkulatorer (ferdigstille)

| Kalkulator | Status | Neste steg |
|-----------|--------|-----------|
| Lønn–utbytte | Fungerer | Legg til alder, tjenestepensjon, «balansert trygghet»-anbefaling |
| Firmabil | Demo klar | Varebil kl.2 faktisk, MVA-beregning, korrekte satser |
| Representasjon | Fungerer | Dokumentgenerering, MVA separat |
| Hytte og båt | Demo klar | MVA-korreksjon, kommersiell utleie-variant |
| MVA-veiviser | Ikke implementert | Se `CALCULATOR_SPECIFICATIONS.md` § 6 |
| AS eller ENK | Ikke implementert | Se `CALCULATOR_SPECIFICATIONS.md` § 7 |

### 2B. Dokumentgenerator (prioritert)

- [ ] Deltakerliste
- [ ] Arrangementsprotokoll
- [ ] Gaveprotokoll
- [ ] Personalfordelsregister
- [ ] Bilagsnotat (representasjon)
- [ ] Kjørebok/reiseregning
- [ ] Leieavtale eier–AS
- [ ] Styreprotokoll
- [ ] Utbytteprotokoll

Teknisk: Bruk eksisterende `@react-pdf/renderer`. Hvert dokument viser kildeversjon.

### 2C. Personalisert skatteprofil

- [ ] Onboarding-flyt (AS/ENK, bransje, MVA, ansatte, AGA-sone, eierforhold)
- [ ] Dashboard: antall relevante grep, dokumentasjonsmangler, beregninger å gjøre
- [ ] Estimert mulig verdi med synlige forutsetninger

### 2D. Kontrollpanel

- [ ] Manglende dokumenter
- [ ] Gaver hittil i år (mot 5 000 kr-grensen)
- [ ] Representasjon uten deltakerliste
- [ ] Mellomværende som bør ryddes

### 2E. Abonnement og betaling

- [ ] Stripe-integrasjon
- [ ] Prisplaner: Gratis / Hagr Eier / Hagr Bedrift
- [ ] Betalingsinnstillinger og faktura

---

## Fase 3 – Høyverditemaene

**Mål:** Innhold for mer avanserte brukere og regnskapsførere.

- [ ] Holding og fritaksmetoden
- [ ] Innbetalt kapital (beregning og dokumentasjon)
- [ ] Konsernbidrag
- [ ] Hjemmekontor og utleie til eget AS
- [ ] Nærståendetransaksjoner (kjøp/salg eier–selskap)
- [ ] AS kontra ENK — helhetsvurdering (kalkulator)
- [ ] Årsavslutningspakke (tap på krav, ukurans, avskrivning, utbytte, konsernbidrag)
- [ ] Pensjon og OTP (beslutningstre)
- [ ] SkatteFUNN (aktivering, kostnadsføring, søknadsprosess)
- [ ] Årshjul-modul

---

## Fase 4 – Profesjonell plattform

**Mål:** Gjøre Hagr nyttig for regnskapsførere og rådgivere.

- [ ] Hagr Partner-plan
- [ ] Klientkontoer (regnskapsfører ser og administrerer klienters data)
- [ ] Arbeidsflyt for faglig kontroll og godkjenning
- [ ] Rapporter (per klient, per emne)
- [ ] Klientdeling (eier deler med regnskapsfører)
- [ ] Integrasjon med regnskapssystemer (Tripletex, Visma, 24SevenOffice)
- [ ] Dokumentarkiv med versjonering og signering
- [ ] Revisjonsspor (hvem godkjente hva, når)
- [ ] Partnerprofil / hvitmerking

---

## Utestående teknisk gjeld (fra tidligere samtaler)

- [ ] Rotér Supabase service_role og anon key (eksponert i chat)
- [ ] Rotér Anthropic API key (eksponert i chat)
- [ ] Kjør DB-migrasjon 009 (odometer-kolonner) i Supabase SQL Editor
- [ ] Verifiser hytte/båt-satser (1 135/530 kr/dag) mot offisielle kilder
- [ ] Verifiser jubileumsgave-grense 8 000 kr for 2026
- [ ] Legg til ADMIN_EMAIL env var i Vercel
- [ ] Skeleton/loading states for sider som flasher tomme
- [ ] Inline delete-bekreftelse i stedet for browser `confirm()`

---

## Gap-analyse: Nåsituasjon vs. Blueprint

### Har vi i dag

* Tips-bibliotek (50+ tips, men uten risk_level, kilder, dokumentasjonsliste)
* 4 demo-kalkulatorer (lønn/utbytte, firmabil, hytte/båt, representasjon)
* Autentisert app med 15 moduler
* AI-skatteassistent
* PDF-dokumentgenerering (bokettersynsmappe)
* Regelsett-arkitektur i `lib/shared/`

### Mangler (kritisk før lansering)

* Risikonivå på alle tips
* Kildehenvisning på alle tips
* Disclaimers per risikonivå
* Brukervilkår og personvernerklæring
* Versjonering av tips og kalkulatorer
* Faglig kontroll av innholdet

### Mangler (Fase 2)

* Dokumentgenerator for de 15 dokumenttypene
* Personalisert skatteprofil og dashboard
* MVA-veiviser
* AS–ENK-sammenligning
* «Balansert trygghet»-anbefaling i lønn/utbytte
* Abonnement og betaling
* Kontrollpanel

### Mangler (Fase 3–4)

* Holding/fritaksmetoden
* Innbetalt kapital
* Årsavslutningspakke
* SkatteFUNN
* Regnskapsførerportal
* Regnskapssystemintegrasjon
