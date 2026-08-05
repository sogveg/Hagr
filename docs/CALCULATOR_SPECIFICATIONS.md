# CALCULATOR_SPECIFICATIONS – Krav til Hagrs kalkulatorer

> Versjon: 1.0 · Opprettet: 2026-08-05  
> Status: UTKAST — satser og formler MÅ verifiseres mot Skatteetaten for gjeldende skatteår

---

## 1. Overordnede krav for alle kalkulatorer

### 1.1 Satser
* Alle satser må knyttes til et eksplisitt skatteår
* Satser hentes fra `lib/shared/tax-rates.ts` (DynamicTaxRates) — aldri hardkodes direkte i komponenter
* Kalkulator viser alltid hvilket skatteår beregningen gjelder for
* Ved skatteårsbytte: alle kalkulatorer oppdateres samtidig

### 1.2 Testmatrise (obligatorisk for alle kalkulatorer)

| Testtype | Eksempel |
|----------|---------|
| Normalverdier | Typisk brukerscenario |
| Nullverdier | 0 kr inntekt, 0 ansatte |
| Negative verdier | Underskudd |
| Ekstremverdier | 100M kr omsetning |
| Grenseverdier | 1 kr under/over beløpsgrense |
| Ulike AGA-soner | Sone I–V |
| Kombinasjoner | Flere regler aktive samtidig |

### 1.3 Visning av usikkerhet
* Kalkulatorer viser aldri et presist tall uten å vise forutsetningene
* Estimater som avhenger av individuelt skjønn vises som intervall, ikke eksakt beløp
* «Kontakt rådgiver»-oppfordring ved høy usikkerhet

---

## 2. Lønn–utbytte kalkulator

**Status:** Implementert i `apps/web/lib/shared/rules-salary-dividend.ts`

### 2.1 Input-felt
* Overskudd før eierlønn
* Nåværende lønn
* AGA-sone (I–V)
* Skjermingsfradrag
* Opptjent egenkapital (for skjermingsberegning)
* Alder (for pensjonshensyn)
* Ønsket nettouttak
* Tjenestepensjonssats
* Planlagt foreldrepermitering (ja/nei)

### 2.2 Output-scenarioer
* Kun utbytte (0 kr lønn)
* Nåværende lønn
* 6 G (full sykepengedekning)
* 7,1 G (full pensjonsopptjening) — **fremhevet som anbefalt**
* Skattemessig optimalt (kryssingspunkt)
* Alt som lønn

### 2.3 Per scenario vises
* Lønn
* AGA-kostnad for selskapet
* Disponibelt til utbytte (etter selskapsskatt 22%)
* Personskatt
* Utbytteskatt (37,84% av oppjustert beløp)
* Total skatt
* Netto privat
* Effektiv skatterate
* Pensjonsopptjening (% av maks 7,1 G)
* Sykepenge-/foreldrepengedekning (kr, maks 6 G)

### 2.4 To anbefalinger (jf. blueprint)
1. **Lavest skatt** — skattemessig kryssingspunkt
2. **Balansert trygghet** — tar hensyn til sykepenger, pensjon, lånegrunnlag

Viser hva trygghet koster sammenlignet med skatteminimum.

### 2.5 Manglende felt (gap mot blueprint)
- [ ] Alder
- [ ] Tjenestepensjonssats
- [ ] Planlagt foreldrepermitering
- [ ] «Balansert trygghet»-anbefaling (kun skatteoptimal finnes i dag)
- [ ] Skjerming basert på faktisk opptjent egenkapital

---

## 3. Firmabilkalkulator

**Status:** Implementert (demo), men satser MÅ verifiseres

### 3.1 Sammenligningsmodeller
1. Privat bil med kilometergodtgjørelse (3,50 kr/km skattefritt, 2026)
2. Ordinær firmabil — sjablong 30%/20% av listepris
3. Varebil klasse 2 — sjablong (kr/år, verifiser sats)
4. Varebil klasse 2 — faktisk privatkjøring (3,40 kr/km, 2026) ⚠️ VERIFISER

### 3.2 Input-felt
* Listepris som ny
* Ekstrautstyr
* Bilens alder (år)
* Måneder til disposisjon
* Yrkeskjøring (km/år) — avgjørende for 40 000 km-regelen
* Er bilen over 3 år (75%-basis)
* Er det varebil klasse 2
* Privat kjørelengde (for faktisk-modell)
* AGA-sone

### 3.3 Output
* Skattepliktig fordel (kr/år og kr/mnd)
* Personskatt på fordelen
* AGA-kostnad for selskapet
* MVA ved anskaffelse (ingen fradrag for personbil)
* MVA ved drift (ingen fradrag for personbil)
* Nødvendig dokumentasjon
* Anbefalt modell

### 3.4 Satser som MÅ verifiseres
- [ ] Firmabil sjablong over grensen (30% under, 20% over — verifiser grensen)
- [ ] Varebil klasse 2 sjablongsats (kr/år)
- [ ] Varebil klasse 2 faktisk sats (3,40 kr/km — verifiser for 2026)
- [ ] Grense for 40 000 km-reduksjon

---

## 4. Representasjonskalkulator

**Status:** Implementert (`apps/web/lib/shared/rules-representation.ts`)

### 4.1 Klassifisering (must)
Kalkulatoren MÅ klassifisere kostnaden FØR beregning:

* representasjon (ekstern part, enkel servering)
* velferd (kun ansatte)
* kurs/møte
* reklame
* gave
* privat

### 4.2 Vurderingspunkter
* Antall deltakere og navn (dokumentasjonskrav)
* Ekstern part til stede (krav for representasjon)
* Tidspunkt (arbeidstid vs. kveld)
* Sted
* Type servering (kaffe/lunsj/middag)
* Alkohol (brennevin nullstiller fradraget)
* Kostnad per person eks. mva (grense 592 kr/person, 2026 — verifiser)
* Formål

### 4.3 Output
* Klassifisering
* Fradragsberettiget beløp
* Ikke-fradragsberettiget beløp
* MVA-fradrag (0% for representasjon, mulig for lunsj i arbeidstid)
* Flags/merknader
* Generert dokumentasjon (deltakerliste, bilagsnotat)

### 4.4 Kjente grenser (VERIFISER for gjeldende år)
| Sats | Verdi | Kilde |
|------|-------|-------|
| Representasjonsgrense | 592 kr/person eks. mva | Skatteetaten/Skatte-ABC — verifiser |
| Overskridelse | Hele fradraget faller bort | — |
| Brennevin | Nullstiller fradraget | — |

---

## 5. Hytte og båtkalkulator

**Status:** Implementert (demo)

### 5.1 Tre separate varianter
1. Privat bruk av selskapets eiendel (aksjonær/ansatt)
2. Kommersiell utleie med privat innslag
3. Bedriftshytte for ansatte

### 5.2 Satser (VERIFISER)
| Sats | Verdi | Kilde |
|------|-------|-------|
| Hytte høysesong (15.6–31.8 + romjul) | 1 135 kr/dag | Skattedirektoratet — verifiser |
| Hytte lavsesong | 530 kr/dag | Skattedirektoratet — verifiser |
| Båt sesong (mai–sept) | 1 135 kr/dag | Skattedirektoratet — verifiser |

### 5.3 Regler som IKKE er implementert
- [ ] MVA-korreksjon ved privat bruk av selskapets eiendel
- [ ] Utbyttevurdering ved eiendel primært anskaffet i aksjonærens interesse
- [ ] Kommersiell utleievurdering (ekstern markedsføring, faktisk aktivitet)
- [ ] «Aldri grønt svar bare pga. oppgitt markedsleie» — logikk mangler

---

## 6. MVA-veiviser

**Status:** Ikke implementert

### 6.1 Spørsmålsflyt
1. Hva er kjøpt? (type eiendel)
2. Hvem er kjøper? (hvilket selskap)
3. Er fakturaen utstedt til riktig selskap?
4. Er MVA spesifisert på fakturaen?
5. Hvilken virksomhet brukes anskaffelsen i?
6. Avgiftspliktig / unntatt / blandet omsetning?
7. Privat bruk?
8. Kjøp eller leasing?
9. Fast eiendom eller løsøre?
10. Personbil, varebil, tilhenger eller maskin?

### 6.2 Output
* Mulig fradragsprosent
* Begrunnelse med rettskildehenvisning
* Nødvendig dokumentasjon
* Justeringsrisiko (10 år for fast eiendom, 5 år for driftsmidler)
* Eskaleringsanbefaling ved usikkerhet

---

## 7. AS eller ENK-sammenligning

**Status:** Ikke implementert

### 7.1 Sammenligningspunkter
* Skatt (personinntekt vs. selskapsskatt + utbytte)
* Arbeidsgiveravgift
* Trygderettigheter (sykepenger, foreldrepenger, dagpenger)
* Pensjon (OTP-plikt, frivillig pensjon)
* Personlig ansvar
* Administrativ byrde
* Kapitaloppbygging og utbytteskatt
* Attraktivitet for investorer
* Bilbruk (firmabil kun i AS)
* MVA
* Omdanningsmulighet (ENK → AS er skattefri etter bestemte vilkår)

---

## 8. Felles tekniske krav

* Alle beregninger er deterministiske: samme input → alltid samme output
* Ingen nettverkskall under beregning (kalkulatorer fungerer offline)
* Input valideres klient-side med tydelige feilmeldinger
* Resultater kan eksporteres (PDF-generering via `@react-pdf/renderer`)
* Beregningsresultat inkluderer versjonsnummer på regelsett
* Logg: hvilken kalkulator, hvilket skatteår, tidspunkt (ikke input-data uten eksplisitt samtykke)
