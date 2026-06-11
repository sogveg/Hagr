import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'

export const metadata = {
  title: 'Leievilkår',
  description: 'Leievilkår for TinyRent. Les betingelsene for leie av babyutstyr i Bergen.',
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://www.tinyrent.no/vilkar' },
}

const sections = [
  {
    title: '1. Partene',
    text: 'Disse vilkårene gjelder mellom Sognefest Holding AS (org.nr. 934 691 804), som driver TinyRent (heretter «utleier»), og den som gjennomfører en bestilling (heretter «leietaker»). Ved å fullføre en bestilling bekrefter leietaker å ha lest og godtatt disse vilkårene.',
  },
  {
    title: '2. Leieforholdet',
    text: 'Leieperioden begynner og slutter på avtalte datoer. Minimumslengde på leieperioden er angitt på hvert enkelt produkt. Leieprisen dekker normal bruk av utstyret i den avtalte perioden.',
  },
  {
    title: '3. Priser og betaling',
    text: 'Alle priser er oppgitt i norske kroner inklusiv merverdiavgift. Betaling skjer enten via Vipps MobilePay ved bestilling, eller med betalingskort ved henting eller levering. Leiebeløpet forfaller ved bestillingstidspunktet eller ved utlevering av utstyret, avhengig av valgt betalingsmetode. Depositum forfaller samtidig med leiebeløpet.',
  },
  {
    title: '4. Depositum',
    text: 'Det kreves et depositum per bestilling. Depositumets størrelse fremgår av bestillingssammendrag. Depositumet holdes inntil utstyret er returnert og kontrollert av TinyRent. Depositumet refunderes i sin helhet innen 5 virkedager dersom utstyret returneres i samme stand som ved utlevering, med normal slitasje som unntak.',
  },
  {
    title: '5. Bruk av utstyret',
    text: 'Utstyret skal brukes i samsvar med produsentens anvisninger og kun til det formålet det er beregnet for. Leietaker er ansvarlig for utstyret fra utlevering til retur. Utstyret må ikke lånes ut, fremleies eller benyttes av andre enn den som inngikk leieforholdet og vedkommendes reisefølge.',
  },
  {
    title: '6. Skader og tap',
    text: 'Leietaker er ansvarlig for skader som oppstår utover normal slitasje, inkludert tap og tyveri av utstyr. Kostnaden for utbedring eller erstatning av skadet eller tapt utstyr vil trekkes fra depositumet. Overstiger kostnadene depositumet, faktureres differansen. Skader skal meldes til TinyRent snarest mulig og senest ved retur av utstyr.',
  },
  {
    title: '7. For sen retur',
    text: 'Utstyr som ikke returneres innen avtalt tid uten forhåndsavtalt forlengelse, belastes med dagsprisen per påbegynt dag frem til faktisk retur. TinyRent forbeholder seg retten til å fakturere for faktisk tap som følge av for sen retur.',
  },
  {
    title: '8. Avbestilling og angrerett',
    text: 'Avbestilling mer enn 48 timer før avtalt leiestart er kostnadsfri. Ved avbestilling innen 48 timer belastes et avbestillingsgebyr tilsvarende én dags leie. For forbrukere gjelder en 14 dagers angrerett fra avtaleinngåelsen, jf. angrerettloven. Angreretten bortfaller dersom leieperioden er påbegynt i løpet av angrefristen. For å benytte angreretten, kontakt oss på hei@tinyrent.no.',
  },
  {
    title: '9. Levering og henting',
    text: 'TinyRent tilbyr levering og henting innen avtalt område i Bergen. Leveringstidspunkt og sted avtales ved bestilling. Leietaker er ansvarlig for å være tilstede på avtalt tidspunkt. Ekstra kostnader som følge av manglende oppmøte kan belastes.',
  },
  {
    title: '10. Reklamasjon og feil på utstyr',
    text: 'Oppdages feil eller mangler ved utstyret ved utlevering, skal dette meldes til TinyRent umiddelbart. TinyRent vil i slike tilfeller søke å bytte utstyret eller tilpasse prisen. Reklamasjoner som ikke meldes ved utlevering, kan ikke gjøres gjeldende i ettertid.',
  },
  {
    title: '11. Ansvarsbegrensning',
    text: 'TinyRent er ikke ansvarlig for indirekte tap, følgeskader eller tap som skyldes leietakers bruk av utstyret. Utleiers samlede ansvar er under enhver omstendighet begrenset til leiesummen for gjeldende leieperiode.',
  },
  {
    title: '12. Lovvalg og verneting',
    text: 'Disse vilkårene reguleres av norsk rett. Eventuelle tvister søkes løst i minnelighet. Dersom minnelig løsning ikke oppnås, kan tvisten bringes inn for Bergen tingrett som verneting. Forbrukere kan alternativt benytte Forbrukertilsynet eller Forbrukerrådet.',
  },
  {
    title: '13. Endringer i vilkårene',
    text: 'TinyRent forbeholder seg retten til å endre disse vilkårene. Endringer kunngjøres på nettsiden og trer i kraft fra publiseringstidspunktet. Allerede inngåtte leieforhold berøres ikke av endringer.',
  },
  {
    title: '14. Kontakt',
    text: 'Spørsmål om leievilkårene rettes til hei@tinyrent.no.',
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
