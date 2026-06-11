import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'

export const metadata = {
  title: 'Personvernerklæring',
  description: 'Personvernerklæring for TinyRent. Slik behandler vi dine personopplysninger i henhold til GDPR.',
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://www.tinyrent.no/personvern' },
}

const sections = [
  {
    title: '1. Behandlingsansvarlig',
    text: 'Behandlingsansvarlig for personopplysninger som samles inn via TinyRent er Sognefest Holding AS (org.nr. 934 691 804). Kontakt oss på hei@tinyrent.no ved spørsmål om personvern.',
  },
  {
    title: '2. Hvilke opplysninger vi samler inn',
    text: 'Vi samler inn følgende opplysninger: navn, e-postadresse, telefonnummer, leveringsadresse og betalingsinformasjon ved registrering og bestilling. Vi lagrer informasjon om dine leieforhold for å levere tjenesten. Vi registrerer også teknisk informasjon om bruk av nettsiden, som beskrives nærmere under informasjonskapsler.',
  },
  {
    title: '3. Formål med behandlingen',
    text: 'Vi behandler personopplysninger for å: administrere kundeforholdet og brukerkontoer, gjennomføre bestillinger og leieforhold, kontakte deg om ditt leieforhold, sende betalinger og kvitteringer, samt forbedre tjenesten vår.',
  },
  {
    title: '4. Rettslig grunnlag',
    text: 'Behandlingen er nødvendig for å oppfylle avtalen om leie av utstyr (GDPR art. 6(1)(b)) og for å overholde juridiske forpliktelser (GDPR art. 6(1)(c)). Bruk av Google Analytics er basert på ditt samtykke (GDPR art. 6(1)(a)), som du kan trekke tilbake når som helst via cookie-varselet på nettsiden.',
  },
  {
    title: '5. Deling av opplysninger',
    text: 'Vi deler personopplysninger med følgende underleverandører som alle behandler data på vegne av oss og i henhold til GDPR: Vipps MobilePay (betalingsbehandling), Resend (e-postutsendelse), Supabase (databaseleverandør). Ved bruk av Google Analytics deles anonymiserte bruksdata med Google Ireland Ltd., kun dersom du har gitt samtykke. Vi selger aldri personopplysninger til tredjeparter.',
  },
  {
    title: '6. Lagringstid',
    text: 'Vi lagrer personopplysninger så lenge det er nødvendig for det formålet de ble samlet inn for, eller så lenge vi er pålagt av lov. Bokføringsopplysninger lagres i minimum 5 år etter regnskapsårets slutt, jf. bokføringsloven. Kundedata slettes innen 3 år etter siste aktive leieforhold med mindre annet er pålagt.',
  },
  {
    title: '7. Dine rettigheter',
    text: 'Du har rett til innsyn i egne opplysninger, rett til retting av feil, rett til sletting («retten til å bli glemt»), rett til å begrense behandlingen, rett til dataportabilitet, og rett til å protestere mot behandlingen. Ta kontakt på hei@tinyrent.no for å benytte disse rettighetene. Vi svarer innen 30 dager.',
  },
  {
    title: '8. Informasjonskapsler (cookies)',
    text: 'Vi bruker teknisk nødvendige informasjonskapsler for pålogging og funksjonalitet. Med ditt samtykke bruker vi også Google Analytics 4 for å forstå hvordan nettsiden brukes, slik at vi kan gjøre den bedre. Google Analytics er konfigurert med Consent Mode v2 og anonymisert IP-adresse, og samler ikke inn data uten ditt samtykke. Du kan trekke tilbake eller endre samtykket ditt når som helst ved å klikke «Avslå» i cookie-varselet, eller ved å slette informasjonskapslene i nettleseren din.',
  },
  {
    title: '9. Klage',
    text: 'Dersom du mener vi behandler personopplysninger i strid med personvernregelverket, kan du klage til Datatilsynet (datatilsynet.no). Vi setter pris på om du kontakter oss direkte på hei@tinyrent.no først, slik at vi kan rette eventuelle feil.',
  },
]

export default function PersonvernPage() {
  return (
    <main className="min-h-screen bg-[var(--color-background)]">
      <Header />

      <section className="bg-[var(--color-foreground)] px-6 py-16">
        <div className="max-w-[800px] mx-auto">
          <h1 className="text-4xl font-bold text-white tracking-tight">
            Personvernerklæring
          </h1>
          <p className="text-white/40 mt-3">
            Sist oppdatert: juni 2026
          </p>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="max-w-[800px] mx-auto space-y-10">
          {sections.map(s => (
            <div key={s.title}>
              <h2 className="text-lg font-bold text-[var(--color-foreground)] mb-3">
                {s.title}
              </h2>
              <p className="text-[var(--color-muted)] leading-[1.9] text-[15px]">
                {s.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  )
}
