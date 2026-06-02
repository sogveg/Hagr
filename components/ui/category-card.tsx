import Link from 'next/link'
import { Card } from './card'
import { getServerT } from '@/lib/get-locale'
import { CATEGORY_NAMES } from '@/lib/i18n'

interface CategoryCardProps {
  category: {
    id: string
    name: string
    slug: string
    description?: string | null
    icon?: string | null
  }
  locationSlug: string
}

const categoryIcons: Record<string, React.ReactNode> = {
  babyutstyr: (
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 12h.01"/>
      <path d="M15 12h.01"/>
      <path d="M10 16c.5.3 1.2.5 2 .5s1.5-.2 2-.5"/>
      <path d="M19 6.3a9 9 0 0 1 1.8 3.9 2 2 0 0 1 0 3.6 9 9 0 0 1-17.6 0 2 2 0 0 1 0-3.6A9 9 0 0 1 12 3c2 0 3.5 1.1 3.5 2.5s-.9 2.5-2 2.5c-.8 0-1.5-.4-1.5-1"/>
    </svg>
  ),
  vogner: (
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="21" r="1"/>
      <circle cx="19" cy="21" r="1"/>
      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
    </svg>
  ),
  leker: (
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 8V4H8"/>
      <rect width="16" height="12" x="4" y="8" rx="2"/>
      <path d="M2 14h2"/>
      <path d="M20 14h2"/>
      <path d="M15 13v2"/>
      <path d="M9 13v2"/>
    </svg>
  ),
  soving: (
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 4v16"/>
      <path d="M2 8h18a2 2 0 0 1 2 2v10"/>
      <path d="M2 17h20"/>
      <path d="M6 8v9"/>
    </svg>
  ),
}

export async function CategoryCard({ category, locationSlug }: CategoryCardProps) {
  const { locale } = await getServerT()
  const icon = categoryIcons[category.slug] ?? (
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="m7.5 4.27 9 5.15"/>
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/>
      <path d="m3.3 7 8.7 5 8.7-5"/>
      <path d="M12 22V12"/>
    </svg>
  )

  const displayName = CATEGORY_NAMES[category.slug]?.[locale] ?? category.name
  const seeProductsLabel = locale === 'en' ? 'See products' : 'Se produkter'

  return (
    <Link href={`/${locationSlug}/${category.slug}`} className="group block">
      <Card hover>
        <div className="text-[var(--color-primary-dark)] mb-6">
          {icon}
        </div>

        <h2 className="text-xl font-bold text-[var(--color-foreground)] mb-2">
          {displayName}
        </h2>

        {category.description && (
          <p className="text-sm text-[var(--color-muted)] leading-relaxed mb-5">
            {category.description}
          </p>
        )}

        <span className="inline-flex items-center gap-1.5 text-sm text-[var(--color-primary-dark)] font-semibold group-hover:gap-2.5 transition-all">
          {seeProductsLabel} <span>&rarr;</span>
        </span>
      </Card>
    </Link>
  )
}
