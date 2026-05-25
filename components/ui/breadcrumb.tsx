import Link from 'next/link'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  variant?: 'light' | 'dark'
}

export function Breadcrumb({ items, variant = 'light' }: BreadcrumbProps) {
  const textColor = variant === 'dark' ? 'text-white/40' : 'text-[var(--color-muted)]'
  const hoverColor = variant === 'dark' ? 'hover:text-white/60' : 'hover:text-[var(--color-foreground)]'
  const activeColor = variant === 'dark' ? 'text-[var(--color-primary)]' : 'text-[var(--color-foreground)]'
  
  return (
    <nav className={`flex items-center gap-2 text-sm ${textColor}`}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1
        
        return (
          <span key={index} className="flex items-center gap-2">
            {item.href && !isLast ? (
              <Link href={item.href} className={`${hoverColor} transition-colors`}>
                {item.label}
              </Link>
            ) : (
              <span className={isLast ? `${activeColor} font-medium` : ''}>
                {item.label}
              </span>
            )}
            {!isLast && <span>/</span>}
          </span>
        )
      })}
    </nav>
  )
}
