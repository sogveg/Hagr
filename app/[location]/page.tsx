import { notFound } from 'next/navigation'
import { createServiceClient } from '@/lib/supabase-server'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import { CategoryCard } from '@/components/ui/category-card'

export default async function LocationPage({ params }: { params: Promise<{ location: string }> }) {
  const { location: locationSlug } = await params
  const supabase = createServiceClient()

  if (!supabase) notFound()

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
    <main className="min-h-screen bg-[var(--color-background)]">
      <Header />

      {/* Location hero */}
      <section className="bg-[var(--color-foreground)] px-6 py-16">
        <div className="max-w-[1200px] mx-auto">
          <div className="mb-5">
            <Breadcrumb 
              variant="dark"
              items={[
                { label: 'Hjem', href: '/' },
                { label: location.name },
              ]} 
            />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight">
            Hva leter du etter?
          </h1>
          <p className="text-white/40 mt-3 text-base">
            Velg kategori for a se tilgjengelig utstyr
          </p>
        </div>
      </section>

      {/* Categories */}
      <section className="px-6 py-16">
        <div className="max-w-[1200px] mx-auto">
          {!categories?.length ? (
            <p className="text-[var(--color-muted)]">Ingen kategorier tilgjengelig.</p>
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
