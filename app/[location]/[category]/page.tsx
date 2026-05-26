import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { createServiceClient } from '@/lib/supabase-server'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { TrustBadges } from '@/components/ui/trust-badges'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import { ProductCard } from '@/components/ui/product-card'

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
  return {
    title: `${catName} til leie i ${locName} | TinyRent`,
    description: category?.description ?? `Lei ${catName.toLowerCase()} i ${locName}. Grundig vasket, hent selv eller få levert hjem.`,
  }
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ location: string; category: string }>
}) {
  const { location: locationSlug, category: categorySlug } = await params
  const supabase = createServiceClient()

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

  return (
    <main className="min-h-screen bg-[var(--color-background)]">
      <Header />

      <section className="bg-[var(--color-foreground)] px-6 py-16">
        <div className="max-w-[1200px] mx-auto">
          <div className="mb-5">
            <Breadcrumb
              variant="dark"
              items={[
                { label: 'Hjem', href: '/' },
                { label: location.name, href: `/${locationSlug}` },
                { label: category.name },
              ]}
            />
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
            {category.name}
          </h1>
          {category.description && (
            <p className="text-white/40 mt-3 text-base max-w-lg">
              {category.description}
            </p>
          )}
          {products.length > 0 && (
            <p className="text-white/30 mt-2 text-sm">
              {products.length} produkt{products.length !== 1 ? 'er' : ''} tilgjengelig i {location.name}
            </p>
          )}
        </div>
      </section>

      <TrustBadges />

      <section className="px-6 py-16">
        <div className="max-w-[1200px] mx-auto">
          {!products.length ? (
            <p className="text-[var(--color-muted)]">Ingen produkter tilgjengelig i {location.name}.</p>
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
