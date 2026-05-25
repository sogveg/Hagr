export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'var(--color-background)',
      padding: '24px',
    }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <a href="/" style={{ textDecoration: 'none' }}>
            <h1 style={{ fontSize: '28px', fontWeight: '700', color: 'var(--color-text)', margin: 0 }}>
              TinyRent
            </h1>
            <p style={{ fontSize: '14px', color: 'var(--color-primary-dark)', margin: '4px 0 0' }}>
              Lei premium babyutstyr i Bergen
            </p>
          </a>
        </div>
        {children}
      </div>
    </div>
  )
}
