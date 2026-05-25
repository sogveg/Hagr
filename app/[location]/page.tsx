import { notFound } from 'next/navigation'
import { createServiceClient } from '@/lib/supabase-server'
import Link from 'next/link'

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

  // Hent kategorier som har produkter på denne lokasjonen
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .eq('active', true)
    .order('sort_order')

  return (
    <main style={{ minHeight: '100vh', backgroundColor: 'var(--color-background)' }}>
      <header style={header}>
        <div style={headerInner}>
          <Link href="/" style={logoStyle}>TinyRent</Link>
          <div style={{ display: 'flex', gap: '12px' }}>
            <Link href="/login" style={navLink}>Logg inn</Link>
            <Link href="/account" style={ctaSmall}>Min side</Link>
          </div>
        </div>
      </header>

      <section style={{ padding: '48px 24px 32px', backgroundColor: '#2B2B2B' }}>
        <div style={inner}>
          <p style={{ color: 'var(--color-primary)', fontSize: '14px', fontWeight: '600', margin: '0 0 8px' }}>
            {location.name}
          </p>
          <h1 style={{ fontSize: '40px', fontWeight: '700', color: 'white', margin: 0, letterSpacing: '-0.5px' }}>
            Hva leter du etter?
          </h1>
        </div>
      </section>

      <section style={{ padding: '48px 24px' }}>
        <div style={inner}>
          <div style={grid}>
            {categories?.map(cat => (
              <Link key={cat.id} href={`/${locationSlug}/${cat.slug}`} style={categoryCard}>
                <div style={categoryEmoji}>
                  {cat.slug === 'babyutstyr' ? '👶' : '📦'}
                </div>
                <h2 style={categoryTitle}>{cat.name}</h2>
                {cat.description && (
                  <p style={categoryDesc}>{cat.description}</p>
                )}
                <span style={categoryLink}>Se produkter →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}

const header: React.CSSProperties = { backgroundColor: 'white', borderBottom: '1px solid rgba(0,0,0,0.06)', position: 'sticky', top: 0, zIndex: 50 }
const headerInner: React.CSSProperties = { maxWidth: '1200px', margin: '0 auto', padding: '0 24px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }
const logoStyle: React.CSSProperties = { fontSize: '20px', fontWeight: '700', color: 'var(--color-text)', textDecoration: 'none' }
const navLink: React.CSSProperties = { fontSize: '14px', color: '#6B7280', textDecoration: 'none', fontWeight: '500' }
const ctaSmall: React.CSSProperties = { fontSize: '14px', backgroundColor: 'var(--color-text)', color: 'white', padding: '8px 18px', borderRadius: '999px', textDecoration: 'none', fontWeight: '600' }
const inner: React.CSSProperties = { maxWidth: '1200px', margin: '0 auto' }
const grid: React.CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }
const categoryCard: React.CSSProperties = { backgroundColor: 'white', borderRadius: '24px', padding: '32px', border: '1px solid rgba(0,0,0,0.06)', textDecoration: 'none', display: 'block', transition: 'box-shadow 0.2s' }
const categoryEmoji: React.CSSProperties = { fontSize: '40px', marginBottom: '16px' }
const categoryTitle: React.CSSProperties = { fontSize: '20px', fontWeight: '700', color: 'var(--color-text)', margin: '0 0 8px' }
const categoryDesc: React.CSSProperties = { fontSize: '14px', color: '#6B7280', margin: '0 0 16px', lineHeight: 1.5 }
const categoryLink: React.CSSProperties = { fontSize: '14px', color: 'var(--color-primary-dark)', fontWeight: '600' }
