export const dynamic = 'force-dynamic'

import { createServiceClient } from '@/lib/supabase-server'
import Link from 'next/link'

export default async function HomePage() {
  const supabase = createServiceClient()
  const { data: locations } = await supabase.from('locations').select('*').eq('active', true)

  return (
    <main style={{ minHeight: '100vh', backgroundColor: 'var(--color-background)' }}>

      {/* Header */}
      <header style={header}>
        <div style={headerInner}>
          <span style={logoStyle}>TinyRent</span>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <Link href="/login" style={navLink}>Logg inn</Link>
            <Link href="/register" style={ctaSmall}>Kom i gang</Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section style={hero}>
        <div style={heroInner}>
          <h1 style={h1}>
            Lei premium<br />babyutstyr i Bergen
          </h1>
          <p style={heroSub}>
            Trygt, enkelt og bærekraftig. Velg leieperiode, vi leverer hjem til deg.
          </p>
          {locations?.map(loc => (
            <Link key={loc.id} href={`/${loc.slug}`} style={heroCta}>
              Se utstyr i {loc.name} →
            </Link>
          ))}
        </div>
      </section>

      {/* Hvordan det fungerer */}
      <section style={section}>
        <div style={sectionInner}>
          <h2 style={h2}>Slik fungerer det</h2>
          <div style={stepsGrid}>
            {[
              { num: '1', title: 'Velg produkt', text: 'Bla gjennom vårt utvalg og velg leieperiode.' },
              { num: '2', title: 'Vi leverer', text: 'Admin planlegger levering til din adresse i Bergen.' },
              { num: '3', title: 'Returner enkelt', text: 'Vi henter når du er ferdig. Depositumet refunderes.' },
            ].map(step => (
              <div key={step.num} style={stepCard}>
                <div style={stepNum}>{step.num}</div>
                <h3 style={stepTitle}>{step.title}</h3>
                <p style={stepText}>{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={footerStyle}>
        <div style={sectionInner}>
          <p style={footerText}>© 2025 TinyRent · Bergen, Norge · <a href="mailto:hei@tinyrent.no" style={{ color: 'var(--color-primary-dark)' }}>hei@tinyrent.no</a></p>
        </div>
      </footer>

    </main>
  )
}

const header: React.CSSProperties = { backgroundColor: 'white', borderBottom: '1px solid rgba(0,0,0,0.06)', position: 'sticky', top: 0, zIndex: 50 }
const headerInner: React.CSSProperties = { maxWidth: '1200px', margin: '0 auto', padding: '0 24px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }
const logoStyle: React.CSSProperties = { fontSize: '20px', fontWeight: '700', color: 'var(--color-text)' }
const navLink: React.CSSProperties = { fontSize: '14px', color: '#6B7280', textDecoration: 'none', fontWeight: '500' }
const ctaSmall: React.CSSProperties = { fontSize: '14px', backgroundColor: 'var(--color-text)', color: 'white', padding: '8px 18px', borderRadius: '999px', textDecoration: 'none', fontWeight: '600' }

const hero: React.CSSProperties = { backgroundColor: '#2B2B2B', padding: '96px 24px' }
const heroInner: React.CSSProperties = { maxWidth: '1200px', margin: '0 auto' }
const h1: React.CSSProperties = { fontSize: '56px', fontWeight: '700', color: 'white', margin: '0 0 20px', lineHeight: 1.1, letterSpacing: '-1px' }
const heroSub: React.CSSProperties = { fontSize: '18px', color: '#9CA3AF', margin: '0 0 40px', maxWidth: '480px', lineHeight: 1.6 }
const heroCta: React.CSSProperties = { display: 'inline-block', backgroundColor: 'var(--color-primary)', color: 'white', padding: '16px 36px', borderRadius: '999px', fontSize: '16px', fontWeight: '600', textDecoration: 'none' }

const section: React.CSSProperties = { padding: '80px 24px' }
const sectionInner: React.CSSProperties = { maxWidth: '1200px', margin: '0 auto' }
const h2: React.CSSProperties = { fontSize: '32px', fontWeight: '700', color: 'var(--color-text)', margin: '0 0 40px' }

const stepsGrid: React.CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }
const stepCard: React.CSSProperties = { backgroundColor: 'white', borderRadius: '24px', padding: '28px', border: '1px solid rgba(0,0,0,0.06)' }
const stepNum: React.CSSProperties = { width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--color-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '16px', marginBottom: '16px' }
const stepTitle: React.CSSProperties = { fontSize: '17px', fontWeight: '700', color: 'var(--color-text)', margin: '0 0 8px' }
const stepText: React.CSSProperties = { fontSize: '14px', color: '#6B7280', margin: 0, lineHeight: 1.6 }

const footerStyle: React.CSSProperties = { borderTop: '1px solid rgba(0,0,0,0.06)', padding: '32px 24px' }
const footerText: React.CSSProperties = { fontSize: '13px', color: '#9CA3AF', margin: 0 }
