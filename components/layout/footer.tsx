import Link from 'next/link'
import { NewsletterForm } from '@/components/ui/newsletter-form'
import { getServerT } from '@/lib/get-locale'

export async function Footer() {
  const { t } = await getServerT()

  const links = [
    { href: '/artikler',   label: t.footer.articles },
    { href: '/kontakt',    label: t.footer.contact  },
    { href: '/om-oss',     label: t.footer.aboutUs  },
    { href: '/vilkar',     label: t.footer.terms    },
    { href: '/personvern', label: t.footer.privacy  },
  ]

  return (
    <footer className="bg-[var(--color-foreground)] px-6 py-16">
      <div className="max-w-[1200px] mx-auto">

        {/* Newsletter section */}
        <div className="text-center mb-16">
          <p className="text-xs font-bold text-white/60 uppercase tracking-widest mb-3">
            {t.footer.newsletterLabel}
          </p>
          <h3 className="text-2xl font-bold text-white mb-2">{t.footer.newsletterTitle}</h3>
          <p className="text-sm text-white/60 mb-8 max-w-sm mx-auto leading-relaxed">
            {t.footer.newsletterSubtitle}
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
              {t.footer.tagline}
            </p>
          </div>

          {/* Links */}
          <nav className="flex flex-wrap gap-6">
            {links.map(({ href, label }) => (
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
            © {new Date().getFullYear()} TinyRent. {t.footer.rights}
          </p>
          <p className="text-xs text-white/40">
            Bergen, Norge
          </p>
        </div>
      </div>
    </footer>
  )
}
