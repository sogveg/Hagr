import Link from 'next/link'
import { Card } from './card'

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

export function ProductCard({ product, locationSlug, categorySlug }: ProductCardProps) {
  const price = product.price_week ?? product.price_day
  const priceLabel = product.price_week ? '/ uke' : '/ dag'
  
  return (
    <Link
      href={`/${locationSlug}/${categorySlug}/${product.slug}`}
      className="group block"
    >
      <Card hover padding="sm" className="overflow-hidden p-0">
        {/* Image */}
        <div className="h-52 bg-[var(--color-sand)] flex items-center justify-center">
          {product.image_url ? (
            <img 
              src={product.image_url} 
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-6xl opacity-40">
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="m7.5 4.27 9 5.15"/>
                <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/>
                <path d="m3.3 7 8.7 5 8.7-5"/>
                <path d="M12 22V12"/>
              </svg>
            </div>
          )}
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
              Se mer &rarr;
            </span>
          </div>
        </div>
      </Card>
    </Link>
  )
}
