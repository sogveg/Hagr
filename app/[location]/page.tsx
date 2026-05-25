import { notFound } from 'next/navigation'
import { createServiceClient } from '@/lib/supabase-server'
import Link from 'next/link'

const categoryEmoji: Record<string, string> = {
  babyutstyr: '👶',
  vogner: '🛻',
  leker: '🧸',
  soving: '😴',
}

export default async function LocationPage({ params }: { params: Promise<{ location: string }> }) {
  const { location: locationSlug } = await params
  const supabase = createServiceClient()

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

      {/* Location hero */}
      <section className="bg-[#2B2B2B] px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 text-white/40 text-sm mb-5">
            <Link href="/" className="hover:text-white/60 transition-colors">Hjem</Link>
            <span>/</span>
            <span className="text-[#A8BFA3] font-medium">{location.name}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight">
            Hva leter du etter?
          </h1>
          <p className="text-white/40 mt-3 text-base">Velg kategori for å se tilgjengelig utstyr</p>
        </div>
      </section>

      {/* Categories */}
      <section className="px-6 py-16">
        <div className="max-w-6xl mx-auto">
          {!categories?.length ? (
            <p className="text-gray-400">Ingen kategorier tilgjengelig.</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {categories.map(cat => (
                <Link
                  key={cat.id}
                  href={`/${locationSlug}/${cat.slug}`}
                  className="group bg-white rounded-3xl p-8 border border-black/[0.06] hover:shadow-lg hover:border-black/10 transition-all duration-200"
                >
                  <div className="text-5xl mb-6">{categoryEmoji[cat.slug] ?? '📦'}</div>
                  <h2 className="text-xl font-bold text-[#2B2B2B] mb-2">{cat.name}</h2>
                  {cat.description && (
                    <p className="text-gray-500 text-sm leading-relaxed mb-5">{cat.description}</p>
                  )}
                  <span className="inline-flex items-center gap-1.5 text-sm text-[#8FA68B] font-semibold group-hover:gap-2.5 transition-all">
                    Se produkter <span>→</span>
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

    </main>
  )
}
