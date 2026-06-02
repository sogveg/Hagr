import Link from 'next/link'
import { Card } from './card'
import { getServerT } from '@/lib/get-locale'

interface ProductCardProps {
  product: {
    id: string
    name: string
    slug: string
    brand?: string | null
    short_description?: string | null
    price_day?: number | null
    price_week?: number | null
    image_url?: string | null
  }
  locationSlug: string
  categorySlug: string
}

const categoryImages: Record<string, string> = {
  vogner:     '/images/products/vogner.jpg',
  soving:     '/images/products/soving.jpg',
  babyutstyr: '/images/products/babyutstyr.jpg',
  leker:      '/images/products/babyutstyr.jpg',
}

export async function ProductCard({ product, locationSlug, categorySlug }: ProductCardProps) {
  const { locale } = await getServerT()

  const price = product.price_week ?? product.price_day
  const priceLabel = product.price_week
    ? (locale === 'en' ? '/ week' : '/ uke')
    : (locale === 'en' ? '/ day'  : '/ dag')
  const seeMoreLabel = locale === 'en' ? 'See more' : 'Se mer'
  const imageSrc = product.image_url ?? categoryImages[categorySlug] ?? '/images/products/babyutstyr.jpg'

  return (
    <Link
      href={`/${locationSlug}/${categorySlug}/${product.slug}`}
      className="group block"
    >
      <Card hover padding="sm" className="overflow-hidden p-0">
        {/* Image */}
        <div className="h-56 overflow-hidden">
          <img
            src={imageSrc}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        <div className="p-6">
          {product.brand && (
            <p className="text-[10px] font-bold text-[var(--color-primary-dark)] uppercase tracking-widest mb-1">
              {product.brand}
            </p>
          )}

          <h3 className="text-[17px] font-bold text-[var(--color-foreground)] mb-1.5 leading-snug">
            {product.name}
          </h3>

          {product.short_description && (
            <p className="text-sm text-[var(--color-muted)] leading-relaxed line-clamp-2 mb-4">
              {product.short_description}
            </p>
          )}

          <div className="flex items-end justify-between pt-4 border-t border-[var(--color-border)]">
            <div>
              <span className="text-xl font-bold text-[var(--color-foreground)]">
                {price} kr
              </span>
              <span className="text-sm text-[var(--color-muted)] ml-1">
                {priceLabel}
              </span>
            </div>
            <span className="text-sm text-[var(--color-primary-dark)] font-semibold group-hover:translate-x-0.5 transition-transform">
              {seeMoreLabel} &rarr;
            </span>
          </div>
        </div>
      </Card>
    </Link>
  )
}
