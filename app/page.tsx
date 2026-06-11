export const dynamic = 'force-dynamic'

import { createServiceClient } from '@/lib/supabase-server'
import { getServerT } from '@/lib/get-locale'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { TrustBadges } from '@/components/ui/trust-badges'
import { HowItWorks } from '@/components/ui/how-it-works'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CategoryCard } from '@/components/ui/category-card'
import { ProductCard } from '@/components/ui/product-card'
import { OrganizationSchema } from '@/components/seo/json-ld'
import { Testimonials } from '@/components/ui/testimonials'
import Image from 'next/image'

export default async function HomePage() {
  const supabase = createServiceClient()
  const { t, locale } = await getServerT()

  const [
    { data: locations },
    { data: categories },
    { data: products },
    { data: articles },
  ] = await Promise.all([
    supabase.from('locations').select('*').eq('active', true),
    supabase.from('categories').select('*').eq('active', true).order('sort_order'),
    supabase.from('products').select('*').eq('published', true).limit(6),
    (supabase.from as any)('articles')
      .select('id, title, slug, excerpt, cover_image, published_at, created_at')
      .eq('published', true)
      .order('published_at', { ascending: false })
      .limit(3),
  ])

  const categorySlugMap = new Map((categories ?? []).map(c => [c.id, c.slug]))
  const defaultLocation = locations?.[0]

  const dateLocale = locale === 'en' ? 'en-GB' : 'nb-NO'

  return (
    <main className="min-h-screen bg-[var(--color-background)]">
      <OrganizationSchema />
      <Header />

      {/* Hero */}
      <section style={{ position: 'relative', overflow: 'hidden', backgroundColor: '#18160F', minHeight: '580px' }}>
        {/* Background image */}
        <Image
          src="/images/hero.jpg"
          alt=""
          aria-hidden={true}
          fill
          priority
          className="object-cover object-center"
          style={{ zIndex: 0 }}
          sizes="100vw"
        />
        {/* Dark overlay */}
        <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(24,22,15,0.70)', zIndex: 1 }} />

        {/* Content */}
        <div style={{ position: 'relative', zIndex: 2 }} className="px-6 py-24 md:py-36 max-w-[1200px] mx-auto">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: 'rgba(255,255,255,0.10)', color: 'rgba(255,255,255,0.70)', fontSize: '11px', fontWeight: 700, padding: '6px 12px', borderRadius: '999px', marginBottom: '32px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#EBF0E7', flexShrink: 0 }} />
            {t.home.badge}
          </div>

          <h1 className="text-5xl md:text-7xl font-bold leading-none tracking-[-2.5px] mb-6 max-w-2xl text-balance" style={{ color: '#fff' }}>
            {t.home.heroTitle}
          </h1>

          <p className="text-lg mb-10 max-w-md leading-relaxed" style={{ color: 'rgba(255,255,255,0.60)' }}>
            {t.home.heroSubtitle}
          </p>

          <div className="flex flex-wrap gap-3">
            {locations && locations.length > 0 ? (
              locations.map(loc => (
                <Button
                  key={loc.id}
                  href={`/${loc.slug}`}
                  variant="white"
                  size="lg"
                  className="gap-2"
                >
                  {t.home.heroCta.replace('Bergen', loc.name)} <span>&rarr;</span>
                </Button>
              ))
            ) : (
              <Button
                href="/bergen"
                variant="white"
                size="lg"
                className="gap-2"
              >
                {t.home.heroCta} <span>&rarr;</span>
              </Button>
            )}
          </div>
        </div>
      </section>

      <TrustBadges />

      {/* Kategorier / Categories */}
      {categories && categories.length > 0 && (
        <section className="bg-[var(--color-background)] px-6 py-24">
          <div className="max-w-[1200px] mx-auto">
            <p className="text-xs font-bold text-[var(--color-primary)] uppercase tracking-widest mb-4">
              {t.home.categoriesLabel}
            </p>
            <h2 className="text-4xl font-bold text-[var(--color-foreground)] tracking-tight mb-3">
              {t.home.categoriesTitle}
            </h2>
            <p className="text-[var(--color-muted)] mb-12 max-w-md">
              {t.home.categoriesSubtitle}
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

      {/* Populaere produkter / Popular products */}
      {products && products.length > 0 && (
        <section className="bg-[var(--color-sand)] px-6 py-24">
          <div className="max-w-[1200px] mx-auto">
            <p className="text-xs font-bold text-[var(--color-primary)] uppercase tracking-widest mb-4">
              {t.home.popularLabel}
            </p>
            <h2 className="text-4xl font-bold text-[var(--color-foreground)] tracking-tight mb-3">
              {t.home.popularTitle}
            </h2>
            <p className="text-[var(--color-muted)] mb-12 max-w-md">
              {t.home.popularSubtitle}
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
                  {t.home.seeAll}
                </Button>
              </div>
            )}
          </div>
        </section>
      )}

      <HowItWorks />

      <Testimonials />

      {/* Trygghet-seksjonen / Safety section */}
      <section className="bg-[var(--color-sand)] px-6 py-24">
        <div className="max-w-[1200px] mx-auto">
          <p className="text-xs font-bold text-[var(--color-primary)] uppercase tracking-widest mb-4">
            {t.home.safetyLabel}
          </p>
          <h2 className="text-4xl font-bold text-[var(--color-foreground)] tracking-tight mb-3">
            {t.home.safetyTitle}
          </h2>
          <p className="text-[var(--color-muted)] mb-12 max-w-md">
            {t.home.safetySubtitle}
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
                title: t.home.safety1Title,
                text:  t.home.safety1Text,
              },
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                    <polyline points="9 22 9 12 15 12 15 22"/>
                  </svg>
                ),
                title: t.home.safety2Title,
                text:  t.home.safety2Text,
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
                title: t.home.safety3Title,
                text:  t.home.safety3Text,
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

      {/* Artikler / Articles */}
      {articles && articles.length > 0 && (
        <section className="bg-[var(--color-background)] px-6 py-24">
          <div className="max-w-[1200px] mx-auto">
            <p className="text-xs font-bold text-[var(--color-primary)] uppercase tracking-widest mb-4">
              {t.home.blogLabel}
            </p>
            <div className="flex items-end justify-between mb-12">
              <h2 className="text-4xl font-bold text-[var(--color-foreground)] tracking-tight">
                {t.home.blogTitle}
              </h2>
              <a
                href="/artikler"
                className="text-sm font-semibold text-[var(--color-primary)] hover:underline shrink-0 ml-8 hidden md:block"
              >
                {t.home.seeAllArticles} →
              </a>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {(articles as any[]).map((article) => {
                const date = new Date(article.published_at ?? article.created_at)
                  .toLocaleDateString(dateLocale, { day: 'numeric', month: 'long', year: 'numeric' })
                return (
                  <a
                    key={article.id}
                    href={`/artikler/${article.slug}`}
                    className="group bg-white rounded-2xl border border-black/[0.06] overflow-hidden hover:border-black/10 hover:shadow-md transition-all"
                  >
                    <div className="relative aspect-[16/9] bg-[#F0EAE0] overflow-hidden">
                      {article.cover_image ? (
                        <Image
                          src={article.cover_image}
                          alt={article.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl text-gray-200">
                          ✏️
                        </div>
                      )}
                    </div>

                    <div className="p-6">
                      <p className="text-xs text-[var(--color-muted)] mb-3">{date}</p>
                      <h3 className="text-base font-bold text-[var(--color-foreground)] leading-snug mb-2 group-hover:text-[var(--color-primary)] transition-colors">
                        {article.title}
                      </h3>
                      {article.excerpt && (
                        <p className="text-sm text-[var(--color-muted)] line-clamp-2 leading-relaxed">
                          {article.excerpt}
                        </p>
                      )}
                      <p className="text-xs font-semibold text-[var(--color-primary)] mt-4">
                        {t.home.lesMore} →
                      </p>
                    </div>
                  </a>
                )
              })}
            </div>

            <div className="text-center mt-10 md:hidden">
              <a
                href="/artikler"
                className="text-sm font-semibold text-[var(--color-primary)] hover:underline"
              >
                {t.home.seeAllArticles} →
              </a>
            </div>
          </div>
        </section>
      )}

      {/* CTA-banner */}
      <section className="bg-[var(--color-foreground)] px-6 py-20">
        <div className="max-w-[1200px] mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4 text-balance">
            {t.home.ctaTitle}
          </h2>
          <p className="text-white/50 mb-10 text-lg max-w-md mx-auto">
            {t.home.ctaSubtitle}
          </p>
          <Button
            href={defaultLocation ? `/${defaultLocation.slug}` : '/bergen'}
            size="lg"
            className="bg-[var(--color-sand)] hover:bg-white text-[var(--color-foreground)] gap-2"
          >
            {t.home.ctaCta} <span>&rarr;</span>
          </Button>
        </div>
      </section>

      <Footer />
    </main>
  )
}
