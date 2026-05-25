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

  // Produkter på denne lokasjonen i denne kategorien
  const { data: products } = await supabase
    .from('products')
    .select('*, product_locations!inner(location_id)')
    .eq('category_id', category.id)
    .eq('published', true)
    .eq('product_locations.location_id', location.id)

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

      {/* Breadcrumb + tittel */}
      <section style={{ padding: '40px 24px 32px', backgroundColor: '#2B2B2B' }}>
        <div style={inner}>
          <p style={breadcrumb}>
            <Link href={`/${locationSlug}`} style={breadcrumbLink}>{location.name}</Link>
            {' / '}
            <span style={{ color: 'var(--color-primary)' }}>{category.name}</span>
          </p>
          <h1 style={{ fontSize: '36px', fontWeight: '700', color: 'white', margin: '8px 0 0', letterSpacing: '-0.5px' }}>
            {category.name}
          </h1>
        </div>
      </section>

      {/* Produktgrid */}
      <section style={{ padding: '48px 24px' }}>
        <div style={inner}>
          {!products?.length ? (
            <p style={{ color: '#6B7280' }}>Ingen produkter tilgjengelig.</p>
          ) : (
            <div style={grid}>
              {products.map(product => (
                <Link
                  key={product.id}
                  href={`/${locationSlug}/${categorySlug}/${product.slug}`}
                  style={productCard}
                >
                  {/* Bildeplass */}
                  <div style={imagePlaceholder}>
                    <span style={{ fontSize: '48px' }}>📦</span>
                  </div>

                  <div style={{ padding: '20px' }}>
                    {product.brand && (
                      <p style={brandStyle}>{product.brand}</p>
                    )}
                    <h2 style={productTitle}>{product.name}</h2>
                    {product.short_description && (
                      <p style={productDesc}>{product.short_description}</p>
                    )}

                    <div style={priceRow}>
                      <div>
                        <span style={priceMain}>
                          {product.price_week ? `${product.price_week} kr` : `${product.price_day} kr`}
                        </span>
                        <span style={priceUnit}>
                          {product.price_week ? ' / uke' : ' / dag'}
                        </span>
                      </div>
                      {product.deposit_amount > 0 && (
                        <span style={depositBadge}>
                          Depositum {product.deposit_amount} kr
                        </span>
                      )}
                    </div>

                    <span style={seeMore}>Se detaljer →</span>
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

const header: React.CSSProperties = { backgroundColor: 'white', borderBottom: '1px solid rgba(0,0,0,0.06)', position: 'sticky', top: 0, zIndex: 50 }
const headerInner: React.CSSProperties = { maxWidth: '1200px', margin: '0 auto', padding: '0 24px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }
const logoStyle: React.CSSProperties = { fontSize: '20px', fontWeight: '700', color: 'var(--color-text)', textDecoration: 'none' }
const navLink: React.CSSProperties = { fontSize: '14px', color: '#6B7280', textDecoration: 'none', fontWeight: '500' }
const ctaSmall: React.CSSProperties = { fontSize: '14px', backgroundColor: 'var(--color-text)', color: 'white', padding: '8px 18px', borderRadius: '999px', textDecoration: 'none', fontWeight: '600' }
const inner: React.CSSProperties = { maxWidth: '1200px', margin: '0 auto' }
const breadcrumb: React.CSSProperties = { fontSize: '13px', color: '#9CA3AF', margin: 0 }
const breadcrumbLink: React.CSSProperties = { color: '#9CA3AF', textDecoration: 'none' }
const grid: React.CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }
const productCard: React.CSSProperties = { backgroundColor: 'white', borderRadius: '24px', border: '1px solid rgba(0,0,0,0.06)', overflow: 'hidden', textDecoration: 'none', display: 'block' }
const imagePlaceholder: React.CSSProperties = { height: '200px', backgroundColor: 'var(--color-sand)', display: 'flex', alignItems: 'center', justifyContent: 'center' }
const brandStyle: React.CSSProperties = { fontSize: '12px', fontWeight: '600', color: 'var(--color-primary-dark)', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 4px' }
const productTitle: React.CSSProperties = { fontSize: '17px', fontWeight: '700', color: 'var(--color-text)', margin: '0 0 8px' }
const productDesc: React.CSSProperties = { fontSize: '13px', color: '#6B7280', margin: '0 0 16px', lineHeight: 1.5 }
const priceRow: React.CSSProperties = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }
const priceMain: React.CSSProperties = { fontSize: '20px', fontWeight: '700', color: 'var(--color-text)' }
const priceUnit: React.CSSProperties = { fontSize: '14px', color: '#6B7280' }
const depositBadge: React.CSSProperties = { fontSize: '11px', color: '#6B7280', backgroundColor: 'var(--color-background)', padding: '4px 10px', borderRadius: '999px' }
const seeMore: React.CSSProperties = { fontSize: '14px', color: 'var(--color-primary-dark)', fontWeight: '600' }
