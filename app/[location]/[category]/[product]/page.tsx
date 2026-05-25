import { notFound } from 'next/navigation'
import { createServiceClient } from '@/lib/supabase-server'
import Link from 'next/link'

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

      <div className="max-w-6xl mx-auto px-6 py-10 pb-24">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-400 mb-10">
          <Link href={`/${locationSlug}`} className="hover:text-gray-600 transition-colors">{location.name}</Link>
          <span>/</span>
          <Link href={`/${locationSlug}/${categorySlug}`} className="hover:text-gray-600 transition-colors">{category.name}</Link>
          <span>/</span>
          <span className="text-[#2B2B2B] font-medium">{product.name}</span>
        </nav>

        {/* Product layout */}
        <div className="grid lg:grid-cols-[1fr_440px] gap-12 items-start">

          {/* Left — image */}
          <div className="bg-[#EAE4DA] rounded-3xl aspect-square flex items-center justify-center">
            <span className="text-[120px]">📦</span>
          </div>

          {/* Right — info */}
          <div className="lg:sticky lg:top-24">

            {product.brand && (
              <p className="text-xs font-bold text-[#8FA68B] uppercase tracking-widest mb-2">{product.brand}</p>
            )}
            <h1 className="text-3xl md:text-4xl font-bold text-[#2B2B2B] tracking-tight leading-tight mb-3">
              {product.name}
            </h1>
            {product.short_description && (
              <p className="text-[15px] text-gray-500 leading-relaxed mb-6">{product.short_description}</p>
            )}

            {/* Availability */}
            <div className={`inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full mb-6 ${
              isAvailable
                ? 'bg-[#F0F5EF] text-[#5A7A55]'
                : 'bg-gray-100 text-gray-400'
            }`}>
              <span className={`w-2 h-2 rounded-full ${isAvailable ? 'bg-[#A8BFA3]' : 'bg-gray-300'}`} />
              {isAvailable ? `Tilgjengelig i ${location.name}` : 'Ikke tilgjengelig nå'}
            </div>

            {/* Pricing */}
            <div className="bg-white rounded-2xl border border-black/[0.06] overflow-hidden mb-5">
              {product.price_day && (
                <div className="flex items-center justify-between px-5 py-4 border-b border-black/[0.04]">
                  <span className="text-sm text-gray-500">Per dag</span>
                  <span className="text-base font-semibold text-[#2B2B2B]">{product.price_day} kr</span>
                </div>
              )}
              {product.price_week && (
                <div className="flex items-center justify-between px-5 py-4 bg-[#F8F7F4] border-b border-black/[0.04]">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">Per uke</span>
                    <span className="text-[10px] font-bold text-[#8FA68B] uppercase tracking-wide bg-[#F0F5EF] px-2 py-0.5 rounded-full">
                      Mest populær
                    </span>
                  </div>
                  <span className="text-lg font-bold text-[#2B2B2B]">{product.price_week} kr</span>
                </div>
              )}
              {product.price_month && (
                <div className="flex items-center justify-between px-5 py-4 border-b border-black/[0.04]">
                  <span className="text-sm text-gray-500">Per måned</span>
                  <span className="text-base font-semibold text-[#2B2B2B]">{product.price_month} kr</span>
                </div>
              )}
              {product.deposit_amount > 0 && (
                <div className="flex items-center justify-between px-5 py-4">
                  <span className="text-sm text-gray-400">Depositum (refunderes)</span>
                  <span className="text-sm font-medium text-gray-400">{product.deposit_amount} kr</span>
                </div>
              )}
            </div>

            {/* CTA */}
            {isAvailable ? (
              <Link
                href="/register"
                className="flex items-center justify-center gap-2 w-full bg-[#2B2B2B] hover:opacity-90 text-white rounded-2xl py-4 text-base font-bold transition-opacity mb-3"
              >
                Lei nå
              </Link>
            ) : (
              <div className="flex items-center justify-center w-full bg-gray-100 text-gray-400 rounded-2xl py-4 text-base font-semibold mb-3">
                Ikke tilgjengelig
              </div>
            )}

            <p className="text-center text-xs text-gray-400">
              Minimum {product.minimum_rental_days} dagers leie
            </p>

          </div>
        </div>

        {/* Description */}
        {product.description && (
          <div className="mt-20 pt-16 border-t border-black/[0.06] max-w-2xl">
            <h2 className="text-2xl font-bold text-[#2B2B2B] mb-5">Om produktet</h2>
            <p className="text-[15px] text-gray-600 leading-[1.9] whitespace-pre-line">{product.description}</p>
          </div>
        )}

      </div>
    </main>
  )
}
