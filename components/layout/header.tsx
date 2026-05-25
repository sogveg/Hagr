import Link from 'next/link'

interface HeaderProps {
  variant?: 'default' | 'transparent'
}

export function Header({ variant = 'default' }: HeaderProps) {
  const isTransparent = variant === 'transparent'
  
  return (
    <header 
      className={`sticky top-0 z-50 ${
        isTransparent 
          ? 'bg-transparent' 
          : 'bg-white border-b border-[var(--color-border)]'
      }`}
    >
      <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
        <Link 
          href="/" 
          className="text-xl font-bold tracking-tight text-[var(--color-foreground)]"
        >
          TinyRent
        </Link>
        
        <nav className="flex items-center gap-3">
          <Link 
            href="/login" 
            className="text-sm font-medium text-[var(--color-muted)] hover:text-[var(--color-foreground)] transition-colors"
          >
            Logg inn
          </Link>
          <Link 
            href="/register" 
            className="text-sm font-semibold bg-[var(--color-foreground)] text-white px-4 py-2 rounded-[var(--radius-full)] hover:opacity-90 transition-opacity"
          >
            Kom i gang
          </Link>
        </nav>
      </div>
    </header>
  )
}
