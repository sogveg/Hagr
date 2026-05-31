import Link from 'next/link'
import { NewsletterForm } from '@/components/ui/newsletter-form'

export function Footer() {
  return (
    <footer className="bg-[var(--color-foreground)] px-6 py-16">
      <div className="max-w-[1200px] mx-auto">

        {/* Newsletter section */}
        <div className="text-center mb-16">
          <p className="text-xs font-bold text-white/60 uppercase tracking-widest mb-3">Nyhetsbrev</p>
          <h3 className="text-2xl font-bold text-white mb-2">Få tips og tilbud på e-post</h3>
          <p className="text-sm text-white/60 mb-8 max-w-sm mx-auto leading-relaxed">
            Vi sender kun nyttig innhold — ingen spam. Meld deg av når som helst.
          </p>
          <div className="max-w-sm mx-auto">
            <NewsletterForm />
          </div>
        </div>

        <div className="border-t border-white/[0.10] pt-10 mb-10" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          {/* Brand */}
          <div>
            <Link href="/" className="text-base font-bold text-white">
              TinyRent
            </Link>
            <p className="text-sm text-white/60 mt-1">
              Lei premium babyutstyr i Bergen
            </p>
          </div>

          {/* Links */}
          <nav className="flex flex-wrap gap-6">
            {[
              { href: '/artikler',   label: 'Artikler' },
              { href: '/kontakt',    label: 'Kontakt' },
              { href: '/om-oss',     label: 'Om oss' },
              { href: '/vilkar',     label: 'Vilkår' },
              { href: '/personvern', label: 'Personvern' },
            ].map(({ href, label }) => (
              <Link key={href} href={href} className="text-sm text-white/60 hover:text-white transition-colors">
                {label}
              </Link>
            ))}
            <a href="mailto:hei@tinyrent.no" className="text-sm text-white/60 hover:text-white transition-colors">
              hei@tinyrent.no
            </a>
          </nav>
        </div>

        <div className="mt-10 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} TinyRent. Alle rettigheter reservert.
          </p>
          <p className="text-xs text-white/40">
            Bergen, Norge
          </p>
        </div>
      </div>
    </footer>
  )
}
