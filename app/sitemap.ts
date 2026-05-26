import type { MetadataRoute } from 'next'
import { createServiceClient } from '@/lib/supabase-server'

const BASE = 'https://www.tinyrent.no'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createServiceClient()

  const [
    { data: locations },
    { data: categories },
    { data: products },
  ] = await Promise.all([
    supabase.from('locations').select('slug').eq('active', true),
    supabase.from('categories').select('id, slug').eq('active', true),
    supabase.from('products').select('slug, category_id').eq('published', true),
  ])

  // Bygg category slug-map
  const categorySlugMap = new Map((categories ?? []).map(c => [c.id, c.slug]))

  const now = new Date()

  // Statiske sider
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE,              lastModified: now, changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${BASE}/om-oss`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/vilkar`, lastModified: now, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${BASE}/personvern`, lastModified: now, changeFrequency: 'monthly', priority: 0.3 },
  ]

  // Lokasjonssider
  const locationPages: MetadataRoute.Sitemap = (locations ?? []).map(loc => ({
    url: `${BASE}/${loc.slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }))

  // Kategorisider — en per lokasjon × kategori
  const categoryPages: MetadataRoute.Sitemap = (locations ?? []).flatMap(loc =>
    (categories ?? []).map(cat => ({
      url: `${BASE}/${loc.slug}/${cat.slug}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))
  )

  // Produktsider
  const productPages: MetadataRoute.Sitemap = (locations ?? []).flatMap(loc =>
    (products ?? []).flatMap(product => {
      const catSlug = product.category_id ? categorySlugMap.get(product.category_id) : null
      if (!catSlug) return []
      return [{
        url: `${BASE}/${loc.slug}/${catSlug}/${product.slug}`,
        lastModified: now,
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }]
    })
  )

  return [...staticPages, ...locationPages, ...categoryPages, ...productPages]
}
