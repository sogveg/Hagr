import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { ContactForm } from '@/components/ui/contact-form'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Kontakt oss',
  description: 'Ta kontakt med TinyRent. Vi svarer på spørsmål om produkter, bookinger, levering og betaling.',
  alternates: { canonical: 'https://www.tinyrent.no/kontakt' },
  openGraph: {
    title: 'Kontakt oss | TinyRent',
    description: 'Ta kontakt — vi svarer innen en arbeidsdag.',
  },
}

export default function KontaktPage() {
  return (
    <main className="min-h-screen bg-[var(--color-background)]">
      <Header />

      <div className="max-w-[640px] mx-auto px-6 py-16">
        <div className="mb-10 text-center">
          <p className="text-xs font-bold text-[var(--color-primary)] uppercase tracking-widest mb-3">Kontakt oss</p>
          <h1 className="text-4xl font-bold text-[var(--color-foreground)] tracking-tight mb-3">
            Har du spørsmål?
          </h1>
          <p className="text-[var(--color-muted)]">
            Vi hjelper deg gjerne. Fyll ut skjemaet, så svarer vi på e-post innen en arbeidsdag.
          </p>
        </div>

        {/* Quick contact options */}
        <div className="grid sm:grid-cols-3 gap-3 mb-10">
          {[
            { icon: '📧', label: 'E-post', value: 'hei@tinyrent.no', href: 'mailto:hei@tinyrent.no' },
            { icon: '📦', label: 'Bestilling', value: 'Se produkter', href: '/bergen' },
            { icon: '📋', label: 'Min konto', value: 'Se bookinger', href: '/account' },
          ].map(item => (
            <a
              key={item.label}
              href={item.href}
              className="bg-white border border-[var(--color-border)] rounded-2xl px-4 py-4 text-center hover:border-[#8FA68B]/40 hover:shadow-sm transition-all"
            >
              <p className="text-2xl mb-2">{item.icon}</p>
              <p className="text-xs font-bold text-[var(--color-muted)] uppercase tracking-wide mb-0.5">{item.label}</p>
              <p className="text-sm font-semibold text-[var(--color-foreground)]">{item.value}</p>
            </a>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-[var(--color-border)] p-8">
          <h2 className="text-lg font-bold text-[var(--color-foreground)] mb-6">Send oss en melding</h2>
          <ContactForm />
        </div>
      </div>

      <Footer />
    </main>
  )
}
