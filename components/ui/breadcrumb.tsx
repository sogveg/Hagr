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
  const activeColor = variant === 'dark' ? 'text-white/70' : 'text-[var(--color-foreground)]'

  return (
    <nav aria-label="Brødsmulesti">
      <ol className={`flex items-center gap-2 text-sm ${textColor} list-none p-0 m-0`}>
        {items.map((item, index) => {
          const isLast = index === items.length - 1

          return (
            <li key={index} className="flex items-center gap-2">
              {item.href && !isLast ? (
                <Link href={item.href} className={`${hoverColor} transition-colors`}>
                  {item.label}
                </Link>
              ) : (
                <span
                  className={isLast ? `${activeColor} font-medium` : ''}
                  aria-current={isLast ? 'page' : undefined}
                >
                  {item.label}
                </span>
              )}
              {!isLast && <span aria-hidden="true">/</span>}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
