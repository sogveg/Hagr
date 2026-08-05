# LEGAL_CONTENT_STANDARD – Krav til faglig innhold og ansvarsavgrensning

> Versjon: 1.0 · Opprettet: 2026-08-05  
> Status: UTKAST — må gjennomgås av norsk advokat med erfaring innen teknologi, skatt og profesjonsansvar

---

## 1. Formål

Dette dokumentet definerer hvilke faglige krav som gjelder for alt innhold i Hagr, og hvilke disclaimertekster som er obligatoriske. En generell footer-tekst er ikke tilstrekkelig ansvarsavgrensning.

---

## 2. Obligatoriske disclaimertekster

### 2.1 Generell produkttekst (vises på alle sider)

> Hagr er et digitalt beslutnings- og dokumentasjonsverktøy. Tjenesten gir generell informasjon basert på opplysningene brukeren oppgir og tilgjengelige rettskilder. Hagr erstatter ikke individuell juridisk, skattemessig, regnskapsmessig eller revisjonsfaglig rådgivning.

### 2.2 Før beregning

> Resultatet bygger på opplysningene du legger inn. Feil eller ufullstendige opplysninger kan gi feil resultat.

### 2.3 Ved grønne råd

> Dette bygger på en etablert regel, men du er ansvarlig for at opplysningene og dokumentasjonen er korrekte.

### 2.4 Ved gule råd

> Utfallet avhenger av en konkret helhetsvurdering. Hagr kan ikke garantere at Skatteetaten vil legge samme vurdering til grunn.

### 2.5 Ved oransje råd

> Vi anbefaler at løsningen gjennomgås av regnskapsfører, revisor eller skatteadvokat før den gjennomføres eller rapporteres.

### 2.6 Ved røde råd

> Ikke gjennomfør dette basert på Hagr alene. Be om individuell faglig vurdering eller en bindende forhåndsuttalelse fra Skatteetaten.

### 2.7 Ved dokumentgenerering

> Dokumentet bekrefter ikke at vilkårene faktisk er oppfylt. Det dokumenterer opplysningene som brukeren har registrert.

### 2.8 Ved visning av skattebesparelse

> Besparelsen er et estimat basert på valgte forutsetninger. Endelig skatt fastsettes etter samlet skattemessig situasjon og gjeldende regler.

---

## 3. Forbudte formuleringer

Følgende formuleringer er ikke tillatt i Hagr — verken i tips, kalkulatorer, markedsføring eller dokumenter:

| Forbudt | Begrunnelse |
|---------|-------------|
| «Dette er 100 prosent lovlig» | Ingen kan garantere dette for skjønnsmessige regler |
| «Dette tåler bokettersyn» | Skatteetaten avgjør dette, ikke Hagr |
| «Du har krav på» | Krav oppstår kun etter konkret vedtak |
| «Skatteetaten kan ikke nekte» | Feil — Skatteetaten kan alltid etterprøve |
| «Helt risikofritt» | Ingen skatterettslig disposisjon er risikofri |
| «Revisjonsgodkjent» | Hagr er ikke en revisor |
| «Elbilrabatt» | Fjernet fra 2023-reglene |
| «Tåler bokettersyn» | Se ovenfor |
| «Intern opplæring er alltid skattefri» | Avhenger av vilkår |
| «Én glemt ansatt gjør alt til lønn» | Absolutt, udokumentert påstand |

---

## 4. Tillatte formuleringer ved skjønnsmessige regler

Bruk heller:

* «Vilkårene ser ut til å være oppfylt basert på oppgitte opplysninger»
* «Basert på opplysningene er fradrag sannsynlig»
* «Dette krever en konkret vurdering»
* «Det er flere risikofaktorer du bør være klar over»
* «Hagr anbefaler faglig gjennomgang»

---

## 5. Brukerbekreftelser ved risikofylte grep

Ved gule og oransje saker skal systemet be brukeren om aktiv bekreftelse:

- [ ] Jeg bekrefter at opplysningene jeg har oppgitt er riktige
- [ ] Jeg har lest og forstår vilkårene for dette tipset
- [ ] Jeg forstår hvilke dokumenter som kreves
- [ ] Jeg forstår at Hagr ikke har kontrollert de faktiske forholdene
- [ ] Jeg forstår at resultatet kan måtte vurderes av rådgiver

Systemet skal logge: tidspunkt, regelversjon, brukerens svar, generert resultat, bekreftelser, og eventuelle dokumenter som ble laget.

---

## 6. Markedsføring

Alle besparelsespåstander i markedsmateriell må:

* ha dokumenterbare forutsetninger
* vise faktisk eksempel, ikke garantert resultat
* ikke inneholde konstruerte kundeuttalelser
* ikke inneholde udokumenterte kronetall

Villedende eller uriktige opplysninger i markedsføringen kan være i strid med markedsføringsloven.

---

## 7. Avtalevilkår

Avtalevilkår og ansvarsbegrensninger skal utformes og kvalitetssikres av en norsk advokat med erfaring innen teknologi, skatt og profesjonsansvar. Følgende temaer må minimum dekkes:

* Omfanget av tjenesten (rådgivning vs. informasjonsverktøy)
* Ansvarsbegrensning per begivenhet og samlet
* Brukerens eget ansvar for opplysningskvalitet
* Behandling av personopplysninger (jf. PRIVACY_AND_SECURITY.md)
* Rutiner ved feil i innhold
* Oppsigelse og sletting av data

---

## 8. TODO – Ekstern gjennomgang

- [ ] Norsk advokat (teknologi + skatt + profesjonsansvar) gjennomgår disclaimer-tekster
- [ ] Norsk advokat utformer fullstendige brukervilkår
- [ ] Faglig råd godkjenner metode og innhold (jf. blueprint pkt. 23)
- [ ] Risikovurdering (DPIA) gjennomføres før lansering
