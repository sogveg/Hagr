# SOURCE_AND_VERSIONING_POLICY – Kildepolicy og versjonering

> Versjon: 1.0 · Opprettet: 2026-08-05

---

## 1. Kildehierarkiet

### Nivå 1 – Bindende rettskilder (primær)

Brukes alltid dersom relevant. Overgår lavere nivåer.

* Lov (særlig skatteloven, merverdiavgiftsloven, skatteforvaltningsloven, aksjeloven)
* Forskrift
* Stortingsvedtak (særlig om skattesatser)
* Rettsavgjørelser (Høyesterett, lagmannsrett)
* Bindende forhåndsuttalelser (BFU) fra Skattedirektoratet
* Publiserte vedtak fra Skatteklagenemnda

### Nivå 2 – Offisiell administrativ praksis

Brukes som primær kilde for praktisk skattebehandling når Nivå 1 ikke er tilgjengelig.

* Skatte-ABC (publiseres årlig — alltid angi inntektsår)
* Merverdiavgiftshåndboken
* Skatteforvaltningshåndboken
* Skatteetatens veiledninger og satssider (skatteetaten.no)
* NAV (nav.no — for trygderettigheter, G-verdi, sykepenger, foreldrepenger)
* Altinn
* Brønnøysundregistrene
* Arbeidstilsynet
* Datatilsynet

> **Viktig:** Skatte-ABC er sentral for praktisk skattebehandling, men må ses i sammenheng med lov og forskrift. Angi alltid inntektsår for Skatte-ABC.

### Nivå 3 – Fagartikler

Brukes som supplerende kilde, aldri som eneste kilde.

* Etablerte advokatfirmaer (må ha identifiserbar forfatter og dato)
* Revisjonsselskaper (Big 4 og norske)
* Autoriserte regnskapsmiljøer
* Universiteter og fagbøker
* Fagartikler med identifiserbar forfatter og publiseringsdato

### Nivå 4 – Støttekilder

Brukes KUN for kontekst, aldri som faglig grunnlag.

* Leverandørartikler
* Banker og forsikringsselskaper
* Bransjeorganisasjoner
* Populariseringer

### Skal ikke brukes som faglig grunnlag

* Foruminnlegg (Dinside, Skattefunn-forum, reddit o.l.)
* Sosiale medier
* Anonyme blogger
* KI-generert tekst uten kildekontroll
* Konkurrerende «skattetipssider» uten rettskilder
* Gamle artikler uten oppgitt skatteår

---

## 2. Obligatoriske kildefelt per tips

Hvert tips i Hagr skal ha:

```typescript
interface TipSource {
  level: 1 | 2 | 3 | 4
  title: string              // «Skatteloven § 5-15 (1) b» eller «Skatte-ABC 2025/2026: Gaver»
  url: string                // Direkte lenke
  paragraph?: string         // Konkret paragraf der det er mulig
  tax_year: number           // 2026
  published_date?: string    // ISO-dato
  last_verified: string      // ISO-dato — sist verifisert av Hagr
  verified_by: string        // Rolle/navn på fagperson
}
```

---

## 3. Versjonering av tips

### 3.1 TipVersion-interface

```typescript
interface TipVersion {
  tip_id: string              // f.eks. «rep_servering_592»
  tax_year: number            // 2026
  version: string             // «2026.3» (år.iterasjon)
  created_at: string          // ISO-dato
  updated_at: string          // ISO-dato
  updated_by: string          // Bruker/rolle
  reviewed_by?: string        // Fagperson som godkjente
  reviewed_at?: string        // ISO-dato
  next_review_by?: string     // ISO-dato for neste kontroll
  changelog: string[]         // Hva ble endret og hvorfor
  source_history: TipSourceChange[]
}

interface TipSourceChange {
  date: string
  change_type: 'added' | 'removed' | 'updated' | 'broken_link'
  source: TipSource
  reason: string
}
```

### 3.2 Versjonsnummerering

Format: `[skatteår].[iterasjon]` — f.eks. `2026.1`, `2026.2`, `2026.3`

Ny versjon opprettes ved:
* Endring i lovtekst eller forskrift
* Ny rettsavgjørelse eller BFU
* Ny Skatte-ABC med endret praksis
* Oppdaterte satser
* Feil som er rettet
* Faglig vurdering som endrer konklusjonen

### 3.3 Vising til bruker

Alle tips skal vise:
```
Oppdatert for inntektsåret 2026
Sist faglig kontrollert: 5. august 2026
Kilder: 3
Risikonivå: Gul
```

### 3.4 Dokumenter med kildeversjon

Når bruker genererer et dokument fra Hagr, skal dokumentet inneholde:
```
Generert 05.08.2026 med Hagr regelsett 2026.4
Basert på: [liste over kilder med versjon]
```

Dette er kritisk for dokumentasjon ved bokettersyn — brukeren kan vise hva de faktisk fikk vite på gjennomføringstidspunktet.

---

## 4. Overvåkingskrav

Kildesystemet bør varsle automatisk dersom:

| Hendelse | Ansvarlig | Tidsfrist |
|----------|-----------|-----------|
| Sats oppdateres på skatteetaten.no | System | 24 timer |
| Lenke slutter å fungere | System | 24 timer |
| Skatte-ABC får nytt inntektsår | Redaktør | Innen 1. november |
| Ny dom eller BFU påvirker tips | Fagperson | 1 uke |
| Tips ikke kontrollert på 6 mnd | Redaktør | Automatisk varsel |
| Tips ikke kontrollert på 12 mnd | Fagperson | Automatisk varsel — tvingende |

---

## 5. Skatteårshåndtering

* Hagr støtter innhold for ett primært skatteår (f.eks. 2026)
* Innhold for forrige år beholdes i 13 måneder etter skatteårets slutt
* Alle satser er tagget med skatteår og hentes fra DynamicTaxRates
* Kalkulatorer viser alltid hvilket skatteår de bruker

---

## 6. Hvem kan godkjenne innhold

| Risikonivå | Hvem godkjenner |
|------------|----------------|
| Grønn | Redaktør med skatterettslig kompetanse |
| Gul | Redaktør + fagperson (regnskapsfører eller advokat) |
| Oransje | Fagperson (statsautorisert regnskapsfører eller skatteadvokat) |
| Rød | Skatteadvokat — obligatorisk |

---

## 7. TODO

- [ ] Implementer kilderegistrering i databasen (ny migrasjon)
- [ ] Implementer versjonskontroll per tips
- [ ] Koble kildeversjon til genererte dokumenter
- [ ] Bygg automatisk lenkekontroll
- [ ] Sett opp varslingsautomatikk for utdaterte tips
