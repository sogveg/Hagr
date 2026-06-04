import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { createServiceClient } from '@/lib/supabase-server'
import { getServerT } from '@/lib/get-locale'
import { CATEGORY_NAMES } from '@/lib/i18n'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { TrustBadges } from '@/components/ui/trust-badges'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import { ProductCard } from '@/components/ui/product-card'
import { BreadcrumbSchema, ItemListSchema } from '@/components/seo/json-ld'

const BASE = 'https://www.tinyrent.no'

export async function generateMetadata(
  { params }: { params: Promise<{ location: string; category: string }> }
): Promise<Metadata> {
  const { location: locationSlug, category: categorySlug } = await params
  const supabase = createServiceClient()
  const [{ data: location }, { data: category }] = await Promise.all([
    supabase.from('locations').select('name').eq('slug', locationSlug).single(),
    supabase.from('categories').select('name, description').eq('slug', categorySlug).single(),
  ])
  const locName = location?.name ?? locationSlug
  const catName = category?.name ?? categorySlug
  const categoryImages: Record<string, string> = {
    vogner: '/images/products/vogner.jpg',
    soving: '/images/products/soving.jpg',
    babyutstyr: '/images/products/babyutstyr.jpg',
    leker: '/images/products/babyutstyr.jpg',
  }
  const ogImage = categoryImages[categorySlug] ?? '/images/hero.jpg'

  const url = `${BASE}/${locationSlug}/${categorySlug}`
  return {
    title: `${catName} til leie i ${locName}`,
    description: category?.description ?? `Lei ${catName.toLowerCase()} i ${locName}. Grundig vasket, hent selv eller få levert hjem.`,
    alternates: { canonical: url },
    openGraph: {
      title: `${catName} til leie i ${locName} | TinyRent`,
      description: category?.description ?? `Lei ${catName.toLowerCase()} i ${locName}.`,
      url,
      images: [{ url: ogImage, width: 1200, height: 630, alt: `${catName} hos TinyRent ${locName}` }],
    },
  }
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ location: string; category: string }>
}) {
  const { location: locationSlug, category: categorySlug } = await params
  const supabase = createServiceClient()
  const { t, locale } = await getServerT()

  const [{ data: location }, { data: category }] = await Promise.all([
    supabase.from('locations').select('*').eq('slug', locationSlug).single(),
    supabase.from('categories').select('*').eq('slug', categorySlug).single(),
  ])

  if (!location || !category) notFound()

  const { data: allProducts } = await supabase
    .from('products')
    .select('*')
    .eq('category_id', category.id)
    .eq('published', true)

  const productIds = (allProducts ?? []).map(p => p.id)

  const { data: productLocations } = productIds.length
    ? await supabase
        .from('product_locations')
        .select('product_id')
        .eq('location_id', location.id)
        .in('product_id', productIds)
    : { data: [] }

  const locationProductIds = new Set((productLocations ?? []).map(pl => pl.product_id))
  const products = (allProducts ?? []).filter(p => locationProductIds.has(p.id))

  // Localised category name
  const localCatName = CATEGORY_NAMES[categorySlug]?.[locale] ?? category.name

  const homeLabel = locale === 'en' ? 'Home' : 'Hjem'

  // Products available count
  const productCount = locale === 'en'
    ? `${products.length} product${products.length !== 1 ? 's' : ''} available in ${location.name}`
    : `${products.length} produkt${products.length !== 1 ? 'er' : ''} tilgjengelig i ${location.name}`

  const noProductsMsg = locale === 'en'
    ? `No products available in ${location.name}.`
    : `Ingen produkter tilgjengelig i ${location.name}.`

  return (
    <main className="min-h-screen bg-[var(--color-background)]">
      <BreadcrumbSchema items={[
        { name: 'Hjem', url: BASE },
        { name: location.name, url: `${BASE}/${locationSlug}` },
        { name: category.name },
      ]} />
      {products.length > 0 && (
        <ItemListSchema
          name={`${category.name} til leie i ${location.name}`}
          url={`${BASE}/${locationSlug}/${categorySlug}`}
          items={products.map(p => ({
            name: p.name,
            url:  `${BASE}/${locationSlug}/${categorySlug}/${p.slug}`,
            image: p.image_url ?? null,
            description: p.short_description ?? null,
          }))}
        />
      )}
      <Header />

      <section className="bg-[var(--color-foreground)] px-6 py-16">
        <div className="max-w-[1200px] mx-auto">
          <div className="mb-5">
            <Breadcrumb
              variant="dark"
              items={[
                { label: homeLabel, href: '/' },
                { label: location.name, href: `/${locationSlug}` },
                { label: localCatName },
              ]}
            />
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
            {localCatName}
          </h1>
          {category.description && (
            <p className="text-white/40 mt-3 text-base max-w-lg">
              {category.description}
            </p>
          )}
          {products.length > 0 && (
            <p className="text-white/30 mt-2 text-sm">
              {productCount}
            </p>
          )}
        </div>
      </section>

      <TrustBadges />

      <section className="px-6 py-16">
        <div className="max-w-[1200px] mx-auto">
          {/* Section heading above the product grid */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-[var(--color-foreground)] tracking-tight">
              {localCatName}
            </h2>
            {products.length > 0 && (
              <p className="text-sm text-[var(--color-muted)] mt-1">{productCount}</p>
            )}
          </div>

          {!products.length ? (
            <p className="text-[var(--color-muted)]">{noProductsMsg}</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {products.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  locationSlug={locationSlug}
                  categorySlug={categorySlug}
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
