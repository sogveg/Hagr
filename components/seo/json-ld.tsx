interface JsonLdProps {
  data: Record<string, unknown>
}

/** Render JSON-LD structured data as a <script> tag */
export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

const BASE = 'https://www.tinyrent.no'

/** Organization + LocalBusiness schema for homepage */
export function OrganizationSchema() {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': ['Organization', 'LocalBusiness'],
        name: 'TinyRent',
        description: 'Lei premium babyutstyr trygt og enkelt i Bergen.',
        url: BASE,
        logo: `${BASE}/images/logo.png`,
        image: `${BASE}/images/hero.jpg`,
        telephone: '',
        email: 'hei@tinyrent.no',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Bergen',
          addressCountry: 'NO',
        },
        areaServed: {
          '@type': 'City',
          name: 'Bergen',
        },
        priceRange: '$$',
        openingHours: 'Mo-Fr 09:00-17:00',
        sameAs: [],
      }}
    />
  )
}

interface BreadcrumbSchemaProps {
  items: { name: string; url?: string }[]
}

/** BreadcrumbList schema */
export function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: item.name,
          ...(item.url ? { item: item.url } : {}),
        })),
      }}
    />
  )
}

interface ArticleSchemaProps {
  title:       string
  excerpt?:    string | null
  coverImage?: string | null
  publishedAt?: string | null
  updatedAt?:  string | null
  author?:     string | null
  slug:        string
}

/** Article schema for blog/article pages */
export function ArticleSchema({ title, excerpt, coverImage, publishedAt, updatedAt, author, slug }: ArticleSchemaProps) {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: title,
        description: excerpt ?? undefined,
        image: coverImage ? [coverImage] : [`${BASE}/images/hero.jpg`],
        datePublished: publishedAt ?? undefined,
        dateModified: updatedAt ?? publishedAt ?? undefined,
        author: {
          '@type': 'Organization',
          name: author ?? 'TinyRent',
          url: BASE,
        },
        publisher: {
          '@type': 'Organization',
          name: 'TinyRent',
          url: BASE,
          logo: { '@type': 'ImageObject', url: `${BASE}/images/logo.png` },
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': `${BASE}/artikler/${slug}`,
        },
      }}
    />
  )
}

interface ProductSchemaProps {
  name: string
  description?: string | null
  brand?: string | null
  imageUrl?: string | null
  priceDay?: number | null
  priceWeek?: number | null
  priceMonth?: number | null
  isAvailable: boolean
  slug: string
  locationSlug: string
  categorySlug: string
}

/** Product schema for product detail pages */
export function ProductSchema({
  name,
  description,
  brand,
  imageUrl,
  priceDay,
  priceWeek,
  priceMonth,
  isAvailable,
  slug,
  locationSlug,
  categorySlug,
}: ProductSchemaProps) {
  const price = priceDay ?? priceWeek ?? priceMonth
  const url = `${BASE}/${locationSlug}/${categorySlug}/${slug}`

  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'Product',
        name,
        description: description ?? undefined,
        image: imageUrl ? [imageUrl] : [`${BASE}/images/products/${categorySlug}.jpg`],
        brand: brand ? { '@type': 'Brand', name: brand } : undefined,
        url,
        offers: price
          ? {
              '@type': 'Offer',
              url,
              priceCurrency: 'NOK',
              price: price.toString(),
              availability: isAvailable
                ? 'https://schema.org/InStock'
                : 'https://schema.org/OutOfStock',
              seller: { '@type': 'Organization', name: 'TinyRent' },
            }
          : undefined,
      }}
    />
  )
}
