import type { MetadataRoute } from 'next'

// Force dynamic so the sitemap is generated at request time, not build time.
// This prevents build failures when Supabase env vars are unavailable (e.g. preview deployments).
export const dynamic = 'force-dynamic'

const BASE = 'https://www.tinyrent.no'

const staticPages: MetadataRoute.Sitemap = [
  { url: BASE,                    lastModified: new Date(), changeFrequency: 'weekly',  priority: 1.0 },
  { url: `${BASE}/artikler`,      lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.7 },
  { url: `${BASE}/kontakt`,       lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
  { url: `${BASE}/om-oss`,        lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  { url: `${BASE}/vilkar`,        lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
  { url: `${BASE}/personvern`,    lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Guard: return only static pages if Supabase env vars are missing
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return staticPages
  }

  try {
    const { createServiceClient } = await import('@/lib/supabase-server')
    const supabase = createServiceClient()

    const [
      { data: locations },
      { data: categories },
      { data: products },
      articlesResult,
    ] = await Promise.all([
      supabase.from('locations').select('slug').eq('active', true),
      supabase.from('categories').select('id, slug').eq('active', true),
      supabase.from('products').select('slug, category_id').eq('published', true),
      (supabase.from as any)('articles')
        .select('slug, published_at, updated_at')
        .eq('published', true),
    ])
    const articles = articlesResult.data ?? []

    const categorySlugMap = new Map((categories ?? []).map(c => [c.id, c.slug]))
    const now = new Date()

    const locationPages: MetadataRoute.Sitemap = (locations ?? []).map(loc => ({
      url: `${BASE}/${loc.slug}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    }))

    const categoryPages: MetadataRoute.Sitemap = (locations ?? []).flatMap(loc =>
      (categories ?? []).map(cat => ({
        url: `${BASE}/${loc.slug}/${cat.slug}`,
        lastModified: now,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }))
    )

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

    const articlePages: MetadataRoute.Sitemap = articles.map((a: any) => ({
      url: `${BASE}/artikler/${a.slug}`,
      lastModified: a.updated_at ?? a.published_at ?? now,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }))

    return [...staticPages, ...locationPages, ...categoryPages, ...productPages, ...articlePages]
  } catch {
    // Fall back to static pages if Supabase is unreachable
    return staticPages
  }
}
