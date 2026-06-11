import type { Metadata } from 'next'
import Link from 'next/link'
import { getServerT } from '@/lib/get-locale'

export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const { t } = await getServerT()

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: 'var(--color-background)' }}>
      {/* Subtle decorative circle */}
      <div
        className="fixed top-0 right-0 w-[600px] h-[600px] rounded-full opacity-20 pointer-events-none"
        style={{ background: 'radial-gradient(circle, var(--color-sand) 0%, transparent 70%)', transform: 'translate(30%, -30%)' }}
      />

      <div className="w-full max-w-[420px] relative">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block group">
            <h1 className="text-[28px] font-bold text-[var(--color-foreground)] tracking-tight">
              TinyRent
            </h1>
            <p className="text-sm text-[var(--color-primary-dark)] mt-0.5 font-medium">
              {t.auth.tagline}
            </p>
          </Link>
        </div>

        {children}

        <p className="text-center text-xs text-[var(--color-muted-foreground)] mt-8">
          &copy; {new Date().getFullYear()} TinyRent · Bergen, Norge
        </p>
      </div>
    </div>
  )
}
