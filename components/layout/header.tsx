import Link from 'next/link'
import Image from 'next/image'
import { HeaderAuthNav } from './header-auth-nav'

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
          : 'bg-[var(--color-background)] border-b border-[var(--color-border)]'
      }`}
    >
      <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center shrink-0">
          <Image
            src="/images/logo.png"
            alt="TinyRent - Lei babyutstyr enkelt"
            width={146}
            height={42}
            priority
          />
        </Link>

        <nav className="flex items-center">
          <HeaderAuthNav />
        </nav>
      </div>
    </header>
  )
}
