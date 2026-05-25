import { notFound } from 'next/navigation'
import { createServiceClient } from '@/lib/supabase-server'
import Link from 'next/link'

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

  const { data: products } = await supabase
    .from('products')
    .select('*, product_locations!inner(location_id)')
    .eq('category_id', category.id)
    .eq('published', true)
    .eq('product_locations.location_id', location.id)

  return (
    <main className="min-h-screen bg-[#F8F7F4]">

      {/* Header */}
      <header className="bg-white border-b border-black/[0.06] sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-[#2B2B2B] tracking-tight">TinyRent</Link>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-gray-500 hover:text-gray-900 font-medium transition-colors">Logg inn</Link>
            <Link href="/account" className="text-sm bg-[#2B2B2B] text-white px-4 py-2 rounded-full font-semibold hover:opacity-90 transition-opacity">Min side</Link>
          </div>
        </div>
      </header>

      {/* Category hero */}
      <section className="bg-[#2B2B2B] px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 text-white/40 text-sm mb-5">
            <Link href="/" className="hover:text-white/60 transition-colors">Hjem</Link>
            <span>/</span>
            <Link href={`/${locationSlug}`} className="hover:text-white/60 transition-colors">{location.name}</Link>
            <span>/</span>
            <span className="text-[#A8BFA3] font-medium">{category.name}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">{category.name}</h1>
          {category.description && (
            <p className="text-white/40 mt-3 text-base max-w-lg">{category.description}</p>
          )}
        </div>
      </section>

      {/* Products */}
      <section className="px-6 py-16">
        <div className="max-w-6xl mx-auto">
          {!products?.length ? (
            <p className="text-gray-400">Ingen produkter tilgjengelig.</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {products.map(product => (
                <Link
                  key={product.id}
                  href={`/${locationSlug}/${categorySlug}/${product.slug}`}
                  className="group bg-white rounded-3xl overflow-hidden border border-black/[0.06] hover:shadow-lg hover:border-black/10 transition-all duration-200"
                >
                  {/* Image placeholder */}
                  <div className="h-52 bg-[#EAE4DA] flex items-center justify-center">
                    <span className="text-6xl">📦</span>
                  </div>

                  <div className="p-6">
                    {product.brand && (
                      <p className="text-[10px] font-bold text-[#8FA68B] uppercase tracking-widest mb-1">{product.brand}</p>
                    )}
                    <h2 className="text-[17px] font-bold text-[#2B2B2B] mb-1.5 leading-snug">{product.name}</h2>
                    {product.short_description && (
                      <p className="text-sm text-gray-500 mb-4 leading-relaxed line-clamp-2">{product.short_description}</p>
                    )}

                    <div className="flex items-end justify-between pt-4 border-t border-black/[0.06]">
                      <div>
                        <span className="text-xl font-bold text-[#2B2B2B]">
                          {product.price_week ? product.price_week : product.price_day} kr
                        </span>
                        <span className="text-sm text-gray-400 ml-1">
                          {product.price_week ? '/ uke' : '/ dag'}
                        </span>
                      </div>
                      <span className="text-sm text-[#8FA68B] font-semibold group-hover:translate-x-0.5 transition-transform">
                        Se mer →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

    </main>
  )
}
