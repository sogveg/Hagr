import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { createServiceClient } from '@/lib/supabase-server'
import { getServerT } from '@/lib/get-locale'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { TrustBadges } from '@/components/ui/trust-badges'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import { CategoryCard } from '@/components/ui/category-card'

export async function generateMetadata(
  { params }: { params: Promise<{ location: string }> }
): Promise<Metadata> {
  const { location: locationSlug } = await params
  const supabase = createServiceClient()
  const { data: location } = await supabase.from('locations').select('name').eq('slug', locationSlug).single()
  const name = location?.name ?? locationSlug
  return {
    title: `Babyutstyr til leie i ${name}`,
    description: `Lei babyutstyr i ${name}. Vogner, soveløsninger, leker og mer — grundig vasket, hent selv eller få levert.`,
    alternates: { canonical: `https://www.tinyrent.no/${locationSlug}` },
    openGraph: {
      title: `Babyutstyr til leie i ${name} | TinyRent`,
      description: `Lei babyutstyr i ${name}. Grundig vasket, hent selv eller få levert.`,
      images: [{ url: '/images/hero.jpg', width: 1200, height: 630, alt: `TinyRent ${name}` }],
    },
  }
}

export default async function LocationPage({ params }: { params: Promise<{ location: string }> }) {
  const { location: locationSlug } = await params
  const supabase = createServiceClient()
  const { t } = await getServerT()

  const { data: location } = await supabase
    .from('locations')
    .select('*')
    .eq('slug', locationSlug)
    .eq('active', true)
    .single()

  if (!location) notFound()

  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .eq('active', true)
    .order('sort_order')

  const homeLabel = t.locale === 'en' ? 'Home' : 'Hjem'

  return (
    <main className="min-h-screen bg-[var(--color-background)]">
      <Header />

      {/* Location hero */}
      <section className="bg-[var(--color-foreground)] px-6 py-16">
        <div className="max-w-[1200px] mx-auto">
          <div className="mb-5">
            <Breadcrumb
              variant="dark"
              items={[
                { label: homeLabel, href: '/' },
                { label: location.name },
              ]}
            />
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight">
            {t.location.heading}
          </h1>
          <p className="text-white/40 mt-3 text-base">
            {t.location.subheading(location.name)}
          </p>
        </div>
      </section>

      <TrustBadges />

      {/* Categories */}
      <section className="px-6 py-16">
        <div className="max-w-[1200px] mx-auto">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-[var(--color-foreground)] tracking-tight">
              {t.location.categoriesHeading}
            </h2>
          </div>

          {!categories?.length ? (
            <p className="text-[var(--color-muted)]">{t.location.noCategories}</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {categories.map(cat => (
                <CategoryCard
                  key={cat.id}
                  category={cat}
                  locationSlug={locationSlug}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}
