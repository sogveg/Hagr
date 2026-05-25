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

  // Tell tilgjengelige lagerenheter
  const { count: availableCount } = await supabase
    .from('inventory_items')
    .select('*', { count: 'exact', head: true })
    .eq('product_id', product.id)
    .eq('location_id', location.id)
    .eq('status', 'available')

  const isAvailable = (availableCount ?? 0) > 0

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

      <div style={inner}>

        {/* Breadcrumb */}
        <p style={breadcrumb}>
          <Link href={`/${locationSlug}`} style={bcLink}>{location.name}</Link>
          {' / '}
          <Link href={`/${locationSlug}/${categorySlug}`} style={bcLink}>{category.name}</Link>
          {' / '}
          <span style={{ color: 'var(--color-text)' }}>{product.name}</span>
        </p>

        <div style={layout}>

          {/* Venstre — bilde */}
          <div style={imageArea}>
            <div style={imagePlaceholder}>
              <span style={{ fontSize: '80px' }}>📦</span>
            </div>
          </div>

          {/* Høyre — info */}
          <div style={infoArea}>
            {product.brand && <p style={brand}>{product.brand}</p>}
            <h1 style={h1}>{product.name}</h1>
            {product.short_description && (
              <p style={shortDesc}>{product.short_description}</p>
            )}

            {/* Tilgjengelighet */}
            <div style={availBadge(isAvailable)}>
              <span style={availDot(isAvailable)} />
              {isAvailable ? 'Tilgjengelig i Bergen' : 'Ikke tilgjengelig nå'}
            </div>

            {/* Priser */}
            <div style={priceBox}>
              {product.price_day && (
                <div style={priceRow}>
                  <span style={priceLabel}>Per dag</span>
                  <span style={priceValue}>{product.price_day} kr</span>
                </div>
              )}
              {product.price_week && (
                <div style={priceRow}>
                  <span style={priceLabel}>Per uke</span>
                  <span style={{ ...priceValue, color: 'var(--color-primary-dark)', fontWeight: '700' }}>
                    {product.price_week} kr
                  </span>
                </div>
              )}
              {product.price_month && (
                <div style={priceRow}>
                  <span style={priceLabel}>Per måned</span>
                  <span style={priceValue}>{product.price_month} kr</span>
                </div>
              )}
              {product.deposit_amount > 0 && (
                <div style={{ ...priceRow, borderTop: '1px solid #E5E7EB', marginTop: '8px', paddingTop: '12px' }}>
                  <span style={priceLabel}>Depositum</span>
                  <span style={{ ...priceValue, color: '#6B7280' }}>{product.deposit_amount} kr</span>
                </div>
              )}
            </div>

            {/* CTA */}
            {isAvailable ? (
              <Link href={`/register`} style={bookButton}>
                Lei nå
              </Link>
            ) : (
              <div style={unavailButton}>Ikke tilgjengelig</div>
            )}

            <p style={minRental}>Minimum {product.minimum_rental_days} dager</p>
          </div>
        </div>

        {/* Beskrivelse */}
        {product.description && (
          <div style={descSection}>
            <h2 style={h2}>Om produktet</h2>
            <p style={descText}>{product.description}</p>
          </div>
        )}

      </div>
    </main>
  )
}

const header: React.CSSProperties = { backgroundColor: 'white', borderBottom: '1px solid rgba(0,0,0,0.06)', position: 'sticky', top: 0, zIndex: 50 }
const headerInner: React.CSSProperties = { maxWidth: '1200px', margin: '0 auto', padding: '0 24px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }
const logoStyle: React.CSSProperties = { fontSize: '20px', fontWeight: '700', color: 'var(--color-text)', textDecoration: 'none' }
const navLink: React.CSSProperties = { fontSize: '14px', color: '#6B7280', textDecoration: 'none', fontWeight: '500' }
const ctaSmall: React.CSSProperties = { fontSize: '14px', backgroundColor: 'var(--color-text)', color: 'white', padding: '8px 18px', borderRadius: '999px', textDecoration: 'none', fontWeight: '600' }
const inner: React.CSSProperties = { maxWidth: '1200px', margin: '0 auto', padding: '32px 24px 80px' }
const breadcrumb: React.CSSProperties = { fontSize: '13px', color: '#9CA3AF', margin: '0 0 32px' }
const bcLink: React.CSSProperties = { color: '#9CA3AF', textDecoration: 'none' }
const layout: React.CSSProperties = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'start' }
const imageArea: React.CSSProperties = {}
const imagePlaceholder: React.CSSProperties = { borderRadius: '24px', backgroundColor: 'var(--color-sand)', aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center' }
const infoArea: React.CSSProperties = {}
const brand: React.CSSProperties = { fontSize: '12px', fontWeight: '700', color: 'var(--color-primary-dark)', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 6px' }
const h1: React.CSSProperties = { fontSize: '32px', fontWeight: '700', color: 'var(--color-text)', margin: '0 0 12px', letterSpacing: '-0.5px', lineHeight: 1.2 }
const shortDesc: React.CSSProperties = { fontSize: '16px', color: '#6B7280', margin: '0 0 20px', lineHeight: 1.6 }
const availBadge = (available: boolean): React.CSSProperties => ({
  display: 'inline-flex', alignItems: 'center', gap: '6px',
  fontSize: '13px', fontWeight: '500',
  color: available ? 'var(--color-primary-dark)' : '#9CA3AF',
  backgroundColor: available ? '#F0F5EF' : '#F3F4F6',
  padding: '6px 12px', borderRadius: '999px', marginBottom: '24px',
})
const availDot = (available: boolean): React.CSSProperties => ({
  width: '6px', height: '6px', borderRadius: '50%',
  backgroundColor: available ? 'var(--color-primary-dark)' : '#9CA3AF',
})
const priceBox: React.CSSProperties = { backgroundColor: 'white', borderRadius: '16px', padding: '20px', border: '1px solid rgba(0,0,0,0.06)', marginBottom: '24px' }
const priceRow: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0' }
const priceLabel: React.CSSProperties = { fontSize: '14px', color: '#6B7280' }
const priceValue: React.CSSProperties = { fontSize: '16px', fontWeight: '600', color: 'var(--color-text)' }
const bookButton: React.CSSProperties = { display: 'block', textAlign: 'center', backgroundColor: 'var(--color-text)', color: 'white', borderRadius: '999px', padding: '16px', fontSize: '16px', fontWeight: '700', textDecoration: 'none', marginBottom: '12px' }
const unavailButton: React.CSSProperties = { display: 'block', textAlign: 'center', backgroundColor: '#F3F4F6', color: '#9CA3AF', borderRadius: '999px', padding: '16px', fontSize: '16px', fontWeight: '600', marginBottom: '12px' }
const minRental: React.CSSProperties = { fontSize: '12px', color: '#9CA3AF', textAlign: 'center', margin: 0 }
const descSection: React.CSSProperties = { marginTop: '64px', paddingTop: '48px', borderTop: '1px solid #E5E7EB' }
const h2: React.CSSProperties = { fontSize: '22px', fontWeight: '700', color: 'var(--color-text)', margin: '0 0 16px' }
const descText: React.CSSProperties = { fontSize: '16px', color: '#4B5563', lineHeight: 1.8, maxWidth: '640px', margin: 0 }
