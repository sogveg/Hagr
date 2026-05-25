import { notFound } from 'next/navigation'
import { createServiceClient } from '@/lib/supabase-server'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import { ProductCard } from '@/components/ui/product-card'

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ location: string; category: string }>
}) {
  const { location: locationSlug, category: categorySlug } = await params
  const supabase = createServiceClient()

  if (!supabase) notFound()

  const [{ data: location }, { data: category }] = await Promise.all([
    supabase.from('locations').select('*').eq('slug', locationSlug).single(),
    supabase.from('categories').select('*').eq('slug', categorySlug).single(),
  ])

  if (!location || !category) notFound()

  const { data: products } = await supabase
    .from('products')
    .select('*, product_locations!inner(location_id)')
    .eq('category_id', category.id)
    .eq('published', true)
    .eq('product_locations.location_id', location.id)

  return (
    <main className="min-h-screen bg-[var(--color-background)]">
      <Header />

      {/* Category hero */}
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
        </div>
      </section>

      {/* Products */}
      <section className="px-6 py-16">
        <div className="max-w-[1200px] mx-auto">
          {!products?.length ? (
            <p className="text-[var(--color-muted)]">Ingen produkter tilgjengelig.</p>
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
