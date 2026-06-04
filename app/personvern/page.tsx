import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'

export const metadata = {
  title: 'Personvernerklæring',
  description: 'Personvernerklæring for TinyRent. Slik behandler vi dine personopplysninger i henhold til GDPR.',
  robots: { index: true, follow: true },
}

const sections = [
  {
    title: '1. Behandlingsansvarlig',
    text: 'TinyRent er behandlingsansvarlig for personopplysninger vi samler inn. Kontakt oss på hei@tinyrent.no ved spørsmål om personvern.',
  },
  {
    title: '2. Hvilke opplysninger vi samler inn',
    text: 'Vi samler inn navn, e-postadresse, telefonnummer, leveringsadresse og betalingsinformasjon ved registrering og bestilling. Vi lagrer også informasjon om dine leieforhold for å kunne levere tjenesten.',
  },
  {
    title: '3. Formål med behandlingen',
    text: 'Vi behandler personopplysninger for å administrere kundeforholdet, gjennomføre bestillinger og leieforhold, kontakte deg om ditt leieforhold, og forbedre tjenesten vår.',
  },
  {
    title: '4. Rettslig grunnlag',
    text: 'Behandlingen av personopplysninger er nødvendig for å oppfylle avtalen om leie av utstyr (GDPR artikkel 6(1)(b)) og for å overholde våre juridiske forpliktelser (GDPR artikkel 6(1)(c)).',
  },
  {
    title: '5. Deling av opplysninger',
    text: 'Vi deler ikke personopplysninger med tredjeparter med unntak av betalingsleverandør og leveringstjeneste, som begge behandler data i henhold til GDPR.',
  },
  {
    title: '6. Lagring',
    text: 'Vi lagrer personopplysninger så lenge det er nødvendig for å oppfylle formålet de ble samlet inn for, eller så lenge vi er pålagt av lov. Kundedata slettes innen 3 år etter siste aktive leieforhold.',
  },
  {
    title: '7. Dine rettigheter',
    text: 'Du har rett til innsyn i egne opplysninger, rett til å korrigere feil, rett til sletting ("retten til å bli glemt"), rett til å begrense behandlingen, og rett til dataportabilitet. Ta kontakt på hei@tinyrent.no for å benytte disse rettighetene.',
  },
  {
    title: '8. Informasjonskapsler (cookies)',
    text: 'Vi bruker kun teknisk nødvendige informasjonskapsler for å holde deg innlogget og for å sikre at tjenesten fungerer. Vi bruker ikke informasjonskapsler til markedsføring eller sporing.',
  },
  {
    title: '9. Kontakt',
    text: 'For spørsmål om personvern, ta kontakt på hei@tinyrent.no. Du kan også klage til Datatilsynet dersom du mener vi behandler dine opplysninger i strid med personvernregelverket.',
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
            Sist oppdatert: januar 2025
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
