import Link from 'next/link'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[var(--color-background)]">
      <Header />

      <section className="px-6 py-32 md:py-48">
        <div className="max-w-[1200px] mx-auto text-center">
          <p className="text-[80px] md:text-[120px] font-bold text-[var(--color-sand)] leading-none mb-6">
            404
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-foreground)] tracking-tight mb-4">
            Siden finnes ikke
          </h1>
          <p className="text-[var(--color-muted)] mb-10 max-w-sm mx-auto leading-relaxed">
            Vi fant ikke siden du leter etter. Den kan ha blitt flyttet eller slettet.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Button href="/" size="lg">
              Gå til forsiden
            </Button>
            <Button href="/bergen" variant="outline" size="lg">
              Se utstyr i Bergen
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
