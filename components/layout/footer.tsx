import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-[var(--color-foreground)] px-6 py-12">
      <div className="max-w-[1200px] mx-auto">
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
