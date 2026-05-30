import Link from 'next/link'
import { NewsletterForm } from '@/components/ui/newsletter-form'

export function Footer() {
  return (
    <footer className="bg-[var(--color-foreground)] px-6 py-16">
      <div className="max-w-[1200px] mx-auto">

        {/* Newsletter section */}
        <div className="bg-white/[0.05] border border-white/[0.08] rounded-2xl px-8 py-8 mb-12 max-w-lg">
          <p className="text-xs font-bold text-white/40 uppercase tracking-widest mb-2">Nyhetsbrev</p>
          <h3 className="text-lg font-bold text-white mb-1">Få tips og tilbud på e-post</h3>
          <p className="text-sm text-white/40 mb-5">
            Vi sender kun nyttig innhold — ingen spam. Meld deg av når som helst.
          </p>
          <NewsletterForm />
        </div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          {/* Brand */}
          <div>
            <Link href="/" className="text-base font-bold text-white">
              TinyRent
            </Link>
            <p className="text-sm text-white/40 mt-1">
              Lei premium babyutstyr i Bergen
            </p>
          </div>

          {/* Links */}
          <nav className="flex flex-wrap gap-6">
            <Link
              href="/artikler"
              className="text-sm text-white/40 hover:text-white/70 transition-colors"
            >
              Artikler
            </Link>
            <Link
              href="/kontakt"
              className="text-sm text-white/40 hover:text-white/70 transition-colors"
            >
              Kontakt
            </Link>
            <Link
              href="/om-oss"
              className="text-sm text-white/40 hover:text-white/70 transition-colors"
            >
              Om oss
            </Link>
            <Link
              href="/vilkar"
              className="text-sm text-white/40 hover:text-white/70 transition-colors"
            >
              Vilkår
            </Link>
            <Link
              href="/personvern"
              className="text-sm text-white/40 hover:text-white/70 transition-colors"
            >
              Personvern
            </Link>
            <a
              href="mailto:hei@tinyrent.no"
              className="text-sm text-white/40 hover:text-white/70 transition-colors"
            >
              hei@tinyrent.no
            </a>
          </nav>
        </div>

        <div className="mt-10 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-xs text-white/25">
            © {new Date().getFullYear()} TinyRent. Alle rettigheter reservert.
          </p>
          <p className="text-xs text-white/25">
            Bergen, Norge
          </p>
        </div>
      </div>
    </footer>
  )
}
