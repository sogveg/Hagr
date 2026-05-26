export const dynamic = 'force-dynamic'

import { createServiceClient } from '@/lib/supabase-server'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { TrustBadges } from '@/components/ui/trust-badges'
import { HowItWorks } from '@/components/ui/how-it-works'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CategoryCard } from '@/components/ui/category-card'
import { ProductCard } from '@/components/ui/product-card'
import { OrganizationSchema } from '@/components/seo/json-ld'

export default async function HomePage() {
  const supabase = createServiceClient()

  const [
    { data: locations },
    { data: categories },
    { data: products },
  ] = await Promise.all([
    supabase.from('locations').select('*').eq('active', true),
    supabase.from('categories').select('*').eq('active', true).order('sort_order'),
    supabase.from('products').select('*').eq('published', true).limit(6),
  ])

  const categorySlugMap = new Map((categories ?? []).map(c => [c.id, c.slug]))
  const defaultLocation = locations?.[0]

  return (
    <main className="min-h-screen bg-[var(--color-background)]">
      <OrganizationSchema />
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden" style={{ backgroundColor: '#18160F', minHeight: '560px' }}>
        <div className="absolute inset-0" style={{ backgroundImage: 'url(/images/hero.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="absolute inset-0" style={{ backgroundColor: 'rgba(24,22,15,0.72)' }} />

        <div className="relative z-10 px-6 py-24 md:py-36 max-w-[1200px] mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/10 text-white/70 text-xs font-semibold px-3 py-1.5 rounded-[var(--radius-full)] mb-8 uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary-light)] shrink-0" />
            Bergen, Norge
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-white leading-none tracking-[-2.5px] mb-6 max-w-2xl text-balance">
            Mer tid med babyen. Mindre styr.
          </h1>

          <p className="text-lg text-white/60 mb-10 max-w-md leading-relaxed">
            Grundig vasket babyutstyr fra merker du kjenner — hent selv eller få det levert hjem til deg i Bergen.
          </p>

          <div className="flex flex-wrap gap-3">
            {locations && locations.length > 0 ? (
              locations.map(loc => (
                <Button
                  key={loc.id}
                  href={`/${loc.slug}`}
                  size="lg"
                  className="bg-white hover:bg-[var(--color-sand)] text-[var(--color-foreground)] gap-2"
                >
                  Se utstyr i {loc.name} <span>&rarr;</span>
                </Button>
              ))
            ) : (
              <Button
                href="/bergen"
                size="lg"
                className="bg-white hover:bg-[var(--color-sand)] text-[var(--color-foreground)] gap-2"
              >
                Se utstyr i Bergen <span>&rarr;</span>
              </Button>
            )}
          </div>
        </div>
      </section>

      <TrustBadges />

      {/* Kategorier */}
      {categories && categories.length > 0 && (
        <section className="bg-[var(--color-background)] px-6 py-24">
          <div className="max-w-[1200px] mx-auto">
            <p className="text-xs font-bold text-[var(--color-primary)] uppercase tracking-widest mb-4">
              Hva trenger du?
            </p>
            <h2 className="text-4xl font-bold text-[var(--color-foreground)] tracking-tight mb-3">
              Finn det du leter etter
            </h2>
            <p className="text-[var(--color-muted)] mb-12 max-w-md">
              Alt fra vogner og bilstoler til leker og soveløsninger — vi har det meste.
            </p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {categories.map(category => (
                <CategoryCard
                  key={category.id}
                  category={category}
                  locationSlug={defaultLocation?.slug ?? 'bergen'}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Populaere produkter */}
      {products && products.length > 0 && (
        <section className="bg-[var(--color-sand)] px-6 py-24">
          <div className="max-w-[1200px] mx-auto">
            <p className="text-xs font-bold text-[var(--color-primary)] uppercase tracking-widest mb-4">
              Populære valg
            </p>
            <h2 className="text-4xl font-bold text-[var(--color-foreground)] tracking-tight mb-3">
              Favoritter blant bergensere
            </h2>
            <p className="text-[var(--color-muted)] mb-12 max-w-md">
              Utstyr som fungerer — valgt fordi det er trygt, praktisk og enkelt å bruke.
            </p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {products.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  locationSlug={defaultLocation?.slug ?? 'bergen'}
                  categorySlug={categorySlugMap.get(product.category_id ?? '') ?? 'babyutstyr'}
                />
              ))}
            </div>

            {defaultLocation && (
              <div className="text-center mt-12">
                <Button
                  href={`/${defaultLocation.slug}`}
                  variant="outline"
                  size="lg"
                >
                  Se alt utstyr
                </Button>
              </div>
            )}
          </div>
        </section>
      )}

      <HowItWorks />

      {/* Trygghet-seksjonen */}
      <section className="bg-[var(--color-sand)] px-6 py-24">
        <div className="max-w-[1200px] mx-auto">
          <p className="text-xs font-bold text-[var(--color-primary)] uppercase tracking-widest mb-4">
            Trygghet først
          </p>
          <h2 className="text-4xl font-bold text-[var(--color-foreground)] tracking-tight mb-3">
            Trygt for deg og babyen
          </h2>
          <p className="text-[var(--color-muted)] mb-12 max-w-md">
            Vi vet at du stiller høye krav når det gjelder babyen. Det gjør vi også.
          </p>

          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
                    <path d="m9 12 2 2 4-4"/>
                  </svg>
                ),
                title: 'Grundig vasket og desinfisert',
                text: 'Alt utstyr vaskes og kontrolleres grundig mellom hver leie. Du mottar alltid rent, trygt utstyr.'
              },
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                    <polyline points="9 22 9 12 15 12 15 22"/>
                  </svg>
                ),
                title: 'Hent selv eller få det levert',
                text: 'Du velger hva som passer best. Hent på avtalt sted, eller få utstyret kjørt hjem til deg — vi tilpasser oss.'
              },
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m7.5 4.27 9 5.15"/>
                    <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/>
                    <path d="m3.3 7 8.7 5 8.7-5"/>
                    <path d="M12 22V12"/>
                  </svg>
                ),
                title: 'Merker du kjenner og stoler på',
                text: 'Moonboon, Babyzen, Snuz og flere — vi velger kun utstyr med dokumentert kvalitet og sikkerhet.'
              },
            ].map(b => (
              <Card key={b.title}>
                <div className="text-[var(--color-primary)] mb-5">{b.icon}</div>
                <h3 className="text-lg font-bold text-[var(--color-foreground)] mb-2">{b.title}</h3>
                <p className="text-[var(--color-muted)] leading-relaxed text-sm">{b.text}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA-banner */}
      <section className="bg-[var(--color-foreground)] px-6 py-20">
        <div className="max-w-[1200px] mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4 text-balance">
            Klar til å forenkle hverdagen?
          </h2>
          <p className="text-white/50 mb-10 text-lg max-w-md mx-auto">
            Se hva vi har tilgjengelig i Bergen — og bestill direkte til døra di.
          </p>
          <Button
            href={defaultLocation ? `/${defaultLocation.slug}` : '/bergen'}
            size="lg"
            className="bg-[var(--color-sand)] hover:bg-white text-[var(--color-foreground)] gap-2"
          >
            Utforsk utstyr i Bergen <span>&rarr;</span>
          </Button>
        </div>
      </section>

      <Footer />
    </main>
  )
}
