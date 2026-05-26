import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'

export const metadata = {
  title: 'Om oss | TinyRent',
  description: 'Lær mer om TinyRent — premium babyutstyr til leie i Bergen.',
}

export default function OmOssPage() {
  return (
    <main className="min-h-screen bg-[var(--color-background)]">
      <Header />

      {/* Hero */}
      <section className="bg-[var(--color-foreground)] px-6 py-20">
        <div className="max-w-[800px] mx-auto">
          <p className="text-xs font-bold text-[var(--color-primary-light)] uppercase tracking-widest mb-4">
            Hvem er vi?
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight mb-5">
            Vi gjør livet med baby litt enklere
          </h1>
          <p className="text-white/50 text-lg leading-relaxed max-w-xl">
            TinyRent ble startet av foreldre som kjente på alt stresset rundt babyutstyr —
            dyrt å kjøpe, vanskelig å lagre, og fort utdatert. Vi laget løsningen vi ønsket fantes.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="px-6 py-20">
        <div className="max-w-[800px] mx-auto">
          <div className="grid md:grid-cols-2 gap-12 mb-16">
            <div>
              <h2 className="text-xl font-bold text-[var(--color-foreground)] mb-3">
                Idéen bak TinyRent
              </h2>
              <p className="text-[var(--color-muted)] leading-relaxed text-[15px]">
                Babyutstyr av god kvalitet er dyrt å kjøpe — og barn vokser fort ut av det.
                Vi tror det er smartere å leie: du får premium utstyr fra merker som Moonboon,
                Babyzen og Stokke, betaler kun for den perioden du trenger det, og slipper
                å tenke på lagring eller videresalg.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-bold text-[var(--color-foreground)] mb-3">
                Trygghet i fokus
              </h2>
              <p className="text-[var(--color-muted)] leading-relaxed text-[15px]">
                Alt utstyr vaskes og desinfiseres grundig mellom hver leie etter faste rutiner.
                Vi kontrollerer sikkerhet og stand på hvert produkt. Du skal aldri lure på om
                det er trygt — det er det alltid.
              </p>
            </div>
          </div>

          {/* Values */}
          <div className="border-t border-[var(--color-border)] pt-12">
            <h2 className="text-2xl font-bold text-[var(--color-foreground)] mb-8">
              Verdiene våre
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { title: 'Bærekraft', text: 'Færre produkter produsert, mer brukt av flere. Det er godt for planeten — og lommeboken.' },
                { title: 'Enkelthet', text: 'Vi tar oss av alt det praktiske. Du konsentrerer deg om det som virkelig teller.' },
                { title: 'Tillit', text: 'Vi velger bare utstyr vi ville brukt selv. Og vi holder det i topp stand.' },
              ].map(v => (
                <div key={v.title}>
                  <h3 className="font-bold text-[var(--color-foreground)] mb-2">{v.title}</h3>
                  <p className="text-sm text-[var(--color-muted)] leading-relaxed">{v.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Contact CTA */}
          <div className="mt-16 pt-12 border-t border-[var(--color-border)]">
            <h2 className="text-2xl font-bold text-[var(--color-foreground)] mb-3">
              Ta kontakt
            </h2>
            <p className="text-[var(--color-muted)] mb-6">
              Har du spørsmål? Vi svarer raskt på e-post.
            </p>
            <Button href="mailto:hei@tinyrent.no" variant="outline">
              hei@tinyrent.no
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
