# RISK_CLASSIFICATION – Risikorammeverk for Hagr-råd

> Versjon: 1.0 · Opprettet: 2026-08-05

---

## 1. De fire risikonivåene

### 🟢 Grønn – Avklart

**Definisjon:** Klar regel med standardisert dokumentasjon. Utfallet avhenger ikke av skjønn eller individuelle forhold utover det brukeren oppgir.

**Egenskaper:**
* Lovhjemmel er entydig
* Beløpsgrenser er absolutte og lett etterprøvbare
* Dokumentasjonskravet er standardisert
* Skatteetaten har ikke omstridt regelen i nyere praksis

**Disclaimer:** «Dette bygger på en etablert regel, men du er ansvarlig for at opplysningene og dokumentasjonen er korrekte.»

**Godkjenning:** Redaktør med skatterettslig kompetanse

**Eksempler:**
* Gave til ansatt under 5 000 kr med kvittering
* Kilometergodtgjørelse 3,50 kr/km med reiseregning
* Mobiltelefon-EK innenfor sjablong (4 392 kr/år)

---

### 🟡 Gul – Konkret vurdering

**Definisjon:** Lovlig mulighet, men utfallet avhenger av faktiske forhold, skjønnsmessige vilkår, eller en konkret helhetsvurdering.

**Egenskaper:**
* Regelen finnes, men inneholder begreper som «rimelig», «markedsmessig», «tjenstlig behov», «naturlig avgrenset gruppe», «forretningsmessig interesse», «hovedsakelig»
* Dokumentasjon er mer sammensatt
* Skatteetaten kan komme til annen konklusjon ved bokettersyn
* Beløp eller omfang er ikke absolutt

**Disclaimer:** «Utfallet avhenger av en konkret helhetsvurdering. Hagr kan ikke garantere at Skatteetaten vil legge samme vurdering til grunn.»

**Godkjenning:** Redaktør + fagperson (regnskapsfører eller advokat)

**Eksempler:**
* Representasjon nær beløpsgrensen
* Hjemmekontor (markedsleie, reelt behov)
* Velferdstiltak for «naturlig avgrenset gruppe»
* Kortkvarig aksjonærlån under 100 000 kr / 60 dager

---

### 🟠 Oransje – Faglig avklaring anbefales

**Definisjon:** Lovlig mulighet finnes, men risikoen er betydelig nok til at Hagr ikke kan gi en forsvarlig automatisk konklusjon. Minst ett av følgende gjelder:

* Stort beløp eller gjentatt disposisjon
* Svak rettskildesituasjon (ingen klar praksis)
* Interessefellesskap (eier og selskap, nærstående)
* Komplisert MVA (blandet virksomhet, justering)
* Risiko for omklassifisering til lønn eller utbytte
* Eiendomstransaksjoner med privat innslag
* Lederutdanning eller lengre ekstern utdanning

**Disclaimer:** «Vi anbefaler at løsningen gjennomgås av regnskapsfører, revisor eller skatteadvokat før den gjennomføres eller rapporteres.»

**Godkjenning:** Statsautorisert regnskapsfører eller skatteadvokat

**Eksempler:**
* Hytte/båt med blandet privat/yrkesmessig bruk
* Nærståendetransaksjoner (kjøp/salg eier–selskap)
* Management fee mellom tilknyttede selskaper
* SkatteFUNN-søknad (aktivering vs. kostnadsføring)
* Lederutviklingsprogram (utdanningsvilkår)

---

### 🔴 Rød – Individuell avklaring obligatorisk

**Definisjon:** Hagr kan ikke gi et forsvarlig råd automatisk. Disposisjonen har høy risiko for retorstegning, omklassifisering, eller er i mulig konflikt med etablert praksis.

**Viktig:** Rødt betyr ikke nødvendigvis ulovlig. Det betyr at kompleksiteten eller risikoen overstiger hva Hagr kan håndtere uten individuell fagvurdering.

**Egenskaper:**
* Ingen klar praksis, eller motstridende praksis
* Stor transaksjon eller gjentatt mønster
* Mulig skatteomgåelse
* Grenseoverskridende forhold
* Fisjon, fusjon, omdanning
* Innbetalt kapital (komplisert beregning)
* Konsernbidrag
* Store eiendomstransaksjoner

**Disclaimer:** «Ikke gjennomfør dette basert på Hagr alene. Be om individuell faglig vurdering eller en bindende forhåndsuttalelse fra Skatteetaten.»

**Godkjenning:** Skatteadvokat (obligatorisk)

**Eskaleringsalternativ:** Hagr kan produsere dokumentasjon for anmodning om bindende forhåndsuttalelse — men selve anmodningen må gjennomgås av skatteadvokat.

---

## 2. Eskaleringsregler

Hvert gult, oransje og rødt tips må ha en konkret eskaleringsregel med terskelverdier.

**Mal:**

> Få løsningen vurdert av [regnskapsfører / revisor / skatteadvokat] dersom:
> * [konkret terskelverdi, f.eks. «fordelen overstiger 50 000 kr»]
> * [konkret situasjon, f.eks. «eiendelen brukes mer enn 30% privat»]
> * [konkret dokumentasjonsmangel, f.eks. «markedspris ikke kan dokumenteres»]

Eskaleringsterskler er **interne risikogrenser**, ikke lovgrenser — ikke presenter dem som det.

---

## 3. Risikomatrise for innholdstyper

| Innholdstype | Minimum risiko | Typisk risiko |
|-------------|---------------|--------------|
| Gaveregelen (under tak) | Grønn | Grønn |
| Kilometergodtgjørelse | Grønn | Grønn |
| EK sjablong (telefon) | Grønn | Grønn |
| Velferdstiltak | Gul | Gul |
| Representasjon | Gul | Gul–Oransje |
| Firmabil (ordinær) | Gul | Gul |
| Aksjonærlån (under unntak) | Gul | Gul |
| Aksjonærlån (over tak) | Rød | Rød |
| Hjemmekontor (utleie til AS) | Gul | Oransje |
| Hytte/båt (blandet bruk) | Oransje | Oransje |
| Nærståendetransaksjoner | Oransje | Oransje |
| Management fee | Oransje | Rød |
| Fisjon/fusjon | Rød | Rød |
| Innbetalt kapital | Oransje | Rød |
| SkatteFUNN | Gul | Oransje |

---

## 4. Teknisk implementasjon

### 4.1 Dagens typestruktur

I `lib/shared/tips.ts`:
```typescript
type TipType = 'saving' | 'gotcha' | 'rule' | 'planning'
type RiskLevel = 'green' | 'yellow' | 'orange' | 'red'  // MÅ LEGGES TIL
```

### 4.2 Manglende felter (gap)

Dagens tips har ikke:
- [ ] `risk_level: RiskLevel`
- [ ] `escalation_rule?: string`
- [ ] `who_it_applies_to: string[]`
- [ ] `sources: TipSource[]`
- [ ] `version: TipVersion`
- [ ] `documentation_required: string[]`
- [ ] `accounting_table: AccountingRow[]`
- [ ] `common_errors: string[]`

Se `SOURCE_AND_VERSIONING_POLICY.md` for TipSource og TipVersion.

---

## 5. UI-krav per risikonivå

| Element | Grønn | Gul | Oransje | Rød |
|---------|-------|-----|---------|-----|
| Fargeindikator | Grønn | Gul | Oransje | Rød |
| Disclaimer | Liten | Standard | Fremhevet | Stor, blokkerende |
| Brukerbekreftelse | Nei | Nei | Ja | Ja |
| Eskaleringstekst | Nei | Anbefalt | Anbefalt | Obligatorisk |
| Logg bekreftelse | Nei | Nei | Ja | Ja |
| Kan generere dok. | Ja | Ja | Ja (m/advarsel) | Begrenset |
