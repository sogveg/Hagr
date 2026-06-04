import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'

export const metadata = {
  title: 'Leievilkår',
  description: 'Leievilkår for TinyRent. Les betingelsene for leie av babyutstyr i Bergen.',
  robots: { index: true, follow: true },
}

const sections = [
  {
    title: '1. Partene',
    text: 'Disse vilkårene gjelder mellom TinyRent (utleier) og den som leier utstyr (leietaker). Ved å gjennomføre en bestilling godtar leietaker disse vilkårene.',
  },
  {
    title: '2. Leieforholdet',
    text: 'Leieperioden starter på avtalt dato og avsluttes på avtalt returneringstidspunkt. Minimum leieperiode er angitt på hvert produkt. Leieprisen dekker normal bruk av utstyret.',
  },
  {
    title: '3. Depositum',
    text: 'Det kreves et depositum per leie. Depositumet holdes inntil utstyret er returnert og kontrollert. Depositumet refunderes i sin helhet dersom utstyret returneres i samme stand som ved utlevering.',
  },
  {
    title: '4. Bruk av utstyret',
    text: 'Utstyret skal brukes i henhold til produsentens anvisninger. Leietaker er ansvarlig for utstyret i leieperioden og plikter å behandle det varsomt. Utstyret skal ikke lånes ut til tredjeparter.',
  },
  {
    title: '5. Skader og tap',
    text: 'Leietaker er ansvarlig for skader som oppstår utover normal slitasje, samt tap av utstyr. Kostnaden for utbedring eller erstatning av utstyr vil trekkes fra depositumet. Overstiger kostnadene depositumet, faktureres differansen.',
  },
  {
    title: '6. Avbestilling',
    text: 'Avbestilling kan gjøres inntil 48 timer før avtalt start uten kostnad. Ved avbestilling innen 48 timer belastes et avbestillingsgebyr tilsvarende én dags leie.',
  },
  {
    title: '7. Levering og henting',
    text: 'TinyRent tilbyr levering og henting innen avtalt område i Bergen. Leveringstidspunkt avtales ved bestilling. Ved henting hos oss gjelder avtalt tidspunkt og sted.',
  },
  {
    title: '8. Ansvarsbegrensning',
    text: 'TinyRent er ikke ansvarlig for indirekte tap eller følgeskader. Vårt ansvar er begrenset til leiesummen for gjeldende leieperiode.',
  },
  {
    title: '9. Endringer i vilkårene',
    text: 'TinyRent forbeholder seg retten til å endre disse vilkårene. Endringer gjelder fra tidspunktet de publiseres på nettsiden. Gjeldende leieforhold berøres ikke av endringer.',
  },
  {
    title: '10. Kontakt',
    text: 'For spørsmål om leievilkårene, ta kontakt på hei@tinyrent.no.',
  },
]

export default function VilkarPage() {
  return (
    <main className="min-h-screen bg-[var(--color-background)]">
      <Header />

      <section className="bg-[var(--color-foreground)] px-6 py-16">
        <div className="max-w-[800px] mx-auto">
          <h1 className="text-4xl font-bold text-white tracking-tight">
            Leievilkår
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
