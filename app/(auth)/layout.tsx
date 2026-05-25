import Link from 'next/link'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)] p-6">
      <div className="w-full max-w-[420px]">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <h1 className="text-[28px] font-bold text-[var(--color-foreground)]">
              TinyRent
            </h1>
            <p className="text-sm text-[var(--color-primary-dark)] mt-1">
              Lei premium babyutstyr i Bergen
            </p>
          </Link>
        </div>
        {children}
      </div>
    </div>
  )
}
