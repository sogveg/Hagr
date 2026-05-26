import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { createServiceClient } from '@/lib/supabase-server'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ProductSchema, BreadcrumbSchema } from '@/components/seo/json-ld'

export async function generateMetadata(
  { params }: { params: Promise<{ location: string; category: string; product: string }> }
): Promise<Metadata> {
  const { location: locationSlug, category: categorySlug, product: productSlug } = await params
  const supabase = createServiceClient()
  const [{ data: location }, { data: product }] = await Promise.all([
    supabase.from('locations').select('name').eq('slug', locationSlug).single(),
    supabase.from('products').select('name, short_description').eq('slug', productSlug).single(),
  ])
  const locName = location?.name ?? locationSlug
  const prodName = product?.name ?? productSlug
  const categoryImages: Record<string, string> = {
    vogner: '/images/products/vogner.jpg',
    soving: '/images/products/soving.jpg',
    babyutstyr: '/images/products/babyutstyr.jpg',
    leker: '/images/products/babyutstyr.jpg',
  }
  const ogImage = categoryImages[categorySlug] ?? '/images/hero.jpg'

  return {
    title: `Lei ${prodName} i ${locName}`,
    description: product?.short_description ?? `Lei ${prodName} i ${locName}. Grundig vasket og desinfisert. Hent selv eller få levert hjem.`,
    alternates: { canonical: `https://www.tinyrent.no/${locationSlug}/${categorySlug}/${productSlug}` },
    openGraph: {
      title: `Lei ${prodName} i ${locName} | TinyRent`,
      description: product?.short_description ?? `Lei ${prodName} i ${locName}. Grundig vasket, hent selv eller få levert.`,
      images: [{ url: ogImage, width: 1200, height: 630, alt: `${prodName} — TinyRent` }],
      type: 'website',
    },
  }
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ location: string; category: string; product: string }>
}) {
  const { location: locationSlug, category: categorySlug, product: productSlug } = await params
  const supabase = createServiceClient()

  const [{ data: location }, { data: category }, { data: product }] = await Promise.all([
    supabase.from('locations').select('*').eq('slug', locationSlug).single(),
    supabase.from('categories').select('*').eq('slug', categorySlug).single(),
    supabase.from('products').select('*').eq('slug', productSlug).eq('published', true).single(),
  ])

  if (!location || !category || !product) notFound()

  const { count: availableCount } = await supabase
    .from('inventory_items')
    .select('*', { count: 'exact', head: true })
    .eq('product_id', product.id)
    .eq('location_id', location.id)
    .eq('status', 'available')

  const isAvailable = (availableCount ?? 0) > 0

  return (
    <main className="min-h-screen bg-[var(--color-background)]">
      <ProductSchema
        name={product.name}
        description={product.short_description}
        brand={product.brand}
        imageUrl={product.image_url}
        priceDay={product.price_day}
        priceWeek={product.price_week}
        priceMonth={product.price_month}
        isAvailable={isAvailable}
        slug={productSlug}
        locationSlug={locationSlug}
        categorySlug={categorySlug}
      />
      <BreadcrumbSchema items={[
        { name: 'Hjem', url: 'https://www.tinyrent.no' },
        { name: location.name, url: `https://www.tinyrent.no/${locationSlug}` },
        { name: category.name, url: `https://www.tinyrent.no/${locationSlug}/${categorySlug}` },
        { name: product.name },
      ]} />
      <Header />

      <div className="max-w-[1200px] mx-auto px-6 py-10 pb-24">
        {/* Breadcrumb */}
        <nav className="mb-10">
          <Breadcrumb
            items={[
              { label: location.name, href: `/${locationSlug}` },
              { label: category.name, href: `/${locationSlug}/${categorySlug}` },
              { label: product.name },
            ]}
          />
        </nav>

        {/* Product layout */}
        <div className="grid lg:grid-cols-[1fr_440px] gap-12 items-start">
          {/* Left — image */}
          {(() => {
            const categoryImages: Record<string, string> = {
              vogner:     '/images/products/vogner.jpg',
              soving:     '/images/products/soving.jpg',
              babyutstyr: '/images/products/babyutstyr.jpg',
              leker:      '/images/products/babyutstyr.jpg',
            }
            const imageSrc = product.image_url ?? categoryImages[categorySlug] ?? '/images/products/babyutstyr.jpg'
            return (
              <div className="rounded-[var(--radius-xl)] aspect-square overflow-hidden bg-[var(--color-sand)]">
                <img
                  src={imageSrc}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )
          })()}

          {/* Right — info */}
          <div className="lg:sticky lg:top-24">
            {product.brand && (
              <p className="text-xs font-bold text-[var(--color-primary-dark)] uppercase tracking-widest mb-2">
                {product.brand}
              </p>
            )}
            
            <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-foreground)] tracking-tight leading-tight mb-3">
              {product.name}
            </h1>
            
            {product.short_description && (
              <p className="text-[15px] text-[var(--color-muted)] leading-relaxed mb-6">
                {product.short_description}
              </p>
            )}

            {/* Availability */}
            <div className="mb-6">
              <Badge variant={isAvailable ? 'available' : 'cancelled'}>
                {isAvailable ? `Tilgjengelig i ${location.name}` : 'Ikke tilgjengelig nå'}
              </Badge>
            </div>

            {/* Pricing */}
            <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-border)] overflow-hidden mb-5">
              {product.price_day && (
                <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--color-border)]">
                  <span className="text-sm text-[var(--color-muted)]">Per dag</span>
                  <span className="text-base font-semibold text-[var(--color-foreground)]">
                    {product.price_day} kr
                  </span>
                </div>
              )}
              
              {product.price_week && (
                <div className="flex items-center justify-between px-5 py-4 bg-[var(--color-background)] border-b border-[var(--color-border)]">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-[var(--color-muted)]">Per uke</span>
                    <span className="text-[10px] font-bold text-[var(--color-primary-dark)] uppercase tracking-wide bg-[var(--color-primary-light)] px-2 py-0.5 rounded-[var(--radius-full)]">
                      Mest populær
                    </span>
                  </div>
                  <span className="text-lg font-bold text-[var(--color-foreground)]">
                    {product.price_week} kr
                  </span>
                </div>
              )}
              
              {product.price_month && (
                <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--color-border)]">
                  <span className="text-sm text-[var(--color-muted)]">Per måned</span>
                  <span className="text-base font-semibold text-[var(--color-foreground)]">
                    {product.price_month} kr
                  </span>
                </div>
              )}
              
              {product.deposit_amount > 0 && (
                <div className="flex items-center justify-between px-5 py-4">
                  <span className="text-sm text-[var(--color-muted-foreground)]">
                    Depositum (refunderes)
                  </span>
                  <span className="text-sm font-medium text-[var(--color-muted-foreground)]">
                    {product.deposit_amount} kr
                  </span>
                </div>
              )}
            </div>

            {/* CTA */}
            {isAvailable ? (
              <Button href="/register" fullWidth size="lg" className="rounded-[var(--radius-lg)] mb-3">
                Lei nå
              </Button>
            ) : (
              <div className="flex items-center justify-center w-full bg-gray-100 text-[var(--color-muted)] rounded-[var(--radius-lg)] py-4 text-base font-semibold mb-3">
                Ikke tilgjengelig nå
              </div>
            )}

            {product.minimum_rental_days > 0 && (
              <p className="text-center text-xs text-[var(--color-muted-foreground)]">
                Minimum {product.minimum_rental_days} dagers leie
              </p>
            )}

            {/* Trust micro-copy */}
            <div className="mt-5 pt-5 border-t border-[var(--color-border)] flex flex-col gap-2">
              {[
                'Grundig vasket og desinfisert',
                'Hent selv eller få det levert',
                'Depositum refunderes ved retur',
              ].map(t => (
                <p key={t} className="text-xs text-[var(--color-muted)] flex items-center gap-2">
                  <span className="text-[var(--color-primary)] font-bold text-sm">✓</span>
                  {t}
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* Description */}
        {product.description && (
          <div className="mt-20 pt-16 border-t border-[var(--color-border)] max-w-2xl">
            <h2 className="text-2xl font-bold text-[var(--color-foreground)] mb-5">
              Om produktet
            </h2>
            <p className="text-[15px] text-[var(--color-muted)] leading-[1.9] whitespace-pre-line">
              {product.description}
            </p>
          </div>
        )}
      </div>

      <Footer />
    </main>
  )
}
