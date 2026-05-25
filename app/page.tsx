export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { createServiceClient } from '@/lib/supabase-server'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { TrustBadges } from '@/components/ui/trust-badges'
import { HowItWorks } from '@/components/ui/how-it-works'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CategoryCard } from '@/components/ui/category-card'
import { ProductCard } from '@/components/ui/product-card'

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

  // Bygg lookup fra category_id -> slug for ProductCard
  const categorySlugMap = new Map((categories ?? []).map(c => [c.id, c.slug]))

  // Finn første aktive lokasjon for lenker
  const defaultLocation = locations?.[0]

  return (
    <main className="min-h-screen bg-[var(--color-background)]">
      <Header />

      {/* Hero */}
      <section className="bg-[var(--color-foreground)] px-6 py-24 md:py-32">
        <div className="max-w-[1200px] mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/10 text-white/60 text-xs font-semibold px-3 py-1.5 rounded-[var(--radius-full)] mb-8 uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] shrink-0" />
            Bergen, Norge
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white leading-none tracking-[-2.5px] mb-6 max-w-2xl text-balance">
            Lei premium babyutstyr
          </h1>
          
          <p className="text-lg text-white/50 mb-10 max-w-sm leading-relaxed">
            Trygt, enkelt og baerekraftig. Vi leverer kvalitetsutstyr hjem til deg.
          </p>
          
          <div className="flex flex-wrap gap-3">
            {locations && locations.length > 0 ? (
              locations.map(loc => (
                <Button 
                  key={loc.id}
                  href={`/${loc.slug}`}
                  size="lg"
                  className="bg-[#F0E8D8] hover:bg-white text-[#18160F] gap-2"
                >
                  Se utstyr i {loc.name} <span>&rarr;</span>
                </Button>
              ))
            ) : (
              <Button 
                href="/bergen"
                size="lg"
                className="bg-[#F0E8D8] hover:bg-white text-[#18160F] gap-2"
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
            <p className="text-xs font-bold text-[var(--color-primary-dark)] uppercase tracking-widest mb-4">
              Kategorier
            </p>
            <h2 className="text-4xl font-bold text-[var(--color-foreground)] tracking-tight mb-12">
              Hva trenger du?
            </h2>
            
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
            <p className="text-xs font-bold text-[var(--color-primary-dark)] uppercase tracking-widest mb-4">
              Populaert
            </p>
            <h2 className="text-4xl font-bold text-[var(--color-foreground)] tracking-tight mb-12">
              Populaere produkter
            </h2>
            
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

      {/* Why TinyRent */}
      <section className="bg-[var(--color-background)] px-6 py-24">
        <div className="max-w-[1200px] mx-auto">
          <p className="text-xs font-bold text-[var(--color-primary-dark)] uppercase tracking-widest mb-4">
            Fordeler
          </p>
          <h2 className="text-4xl font-bold text-[var(--color-foreground)] tracking-tight mb-12">
            Hvorfor leie fra oss?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { 
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
                    <path d="m9 12 2 2 4-4"/>
                  </svg>
                ),
                title: 'Grundig rengjort', 
                text: 'Alt utstyr vaskes og kontrolleres grundig mellom hver leie.' 
              },
              { 
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
                    <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
                    <line x1="9" x2="9.01" y1="9" y2="9"/>
                    <line x1="15" x2="15.01" y1="9" y2="9"/>
                  </svg>
                ),
                title: 'Baerekraftig valg', 
                text: 'Leie er mer miljovennlig enn a kjope nytt til kortvarig bruk.' 
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
                title: 'Premium merker', 
                text: 'Moonboon, Babyzen, Snuz — vi velger kun dokumenterte kvalitetsprodukter.' 
              },
            ].map(b => (
              <Card key={b.title}>
                <div className="text-[var(--color-primary-dark)] mb-5">{b.icon}</div>
                <h3 className="text-lg font-bold text-[var(--color-foreground)] mb-2">{b.title}</h3>
                <p className="text-[var(--color-muted)] leading-relaxed text-sm">{b.text}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
