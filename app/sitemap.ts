import type { MetadataRoute } from 'next'

// Force dynamic so the sitemap is generated at request time, not build time.
// This prevents build failures when Supabase env vars are unavailable (e.g. preview deployments).
export const dynamic = 'force-dynamic'

const BASE = 'https://www.tinyrent.no'

// Static pages with stable dates (only update when content genuinely changes)
const staticPages: MetadataRoute.Sitemap = [
  { url: BASE,                    lastModified: new Date('2025-01-01'), changeFrequency: 'weekly',  priority: 1.0 },
  { url: `${BASE}/artikler`,      lastModified: new Date('2025-01-01'), changeFrequency: 'weekly',  priority: 0.7 },
  { url: `${BASE}/kontakt`,       lastModified: new Date('2025-01-01'), changeFrequency: 'monthly', priority: 0.6 },
  { url: `${BASE}/om-oss`,        lastModified: new Date('2025-01-01'), changeFrequency: 'monthly', priority: 0.5 },
  { url: `${BASE}/vilkar`,        lastModified: new Date('2025-01-01'), changeFrequency: 'monthly', priority: 0.3 },
  { url: `${BASE}/personvern`,    lastModified: new Date('2025-01-01'), changeFrequency: 'monthly', priority: 0.3 },
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
      { data: productLocations },
      articlesResult,
    ] = await Promise.all([
      supabase.from('locations').select('slug').eq('active', true),
      supabase.from('categories').select('id, slug').eq('active', true),
      // Join products + product_locations so we only include real location/product combos
      (supabase.from as any)('product_locations')
        .select('location_id, product_id, products(slug, category_id, published), locations(slug)'),
      (supabase.from as any)('articles')
        .select('slug, published_at, updated_at')
        .eq('published', true),
    ])
    const articles = articlesResult.data ?? []

    const categorySlugMap = new Map((categories ?? []).map(c => [c.id, c.slug]))

    // Deduplicate location pages
    const locationSlugs = new Set((locations ?? []).map(loc => loc.slug))
    const locationPages: MetadataRoute.Sitemap = Array.from(locationSlugs).map(slug => ({
      url: `${BASE}/${slug}`,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    }))

    // Deduplicate location+category combos from actual product_locations data
    const locCatSet = new Set<string>()
    const productPages: MetadataRoute.Sitemap = []

    for (const pl of productLocations ?? []) {
      const locObj  = pl.locations as { slug: string } | null
      const prodObj = pl.products  as { slug: string; category_id: string | null; published: boolean } | null
      if (!locObj || !prodObj || !prodObj.published) continue

      const locSlug  = locObj.slug
      const catSlug  = prodObj.category_id ? categorySlugMap.get(prodObj.category_id) : null
      if (!catSlug) continue

      // Collect unique location+category pages
      locCatSet.add(`${locSlug}/${catSlug}`)

      // Product page
      productPages.push({
        url: `${BASE}/${locSlug}/${catSlug}/${prodObj.slug}`,
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      })
    }

    const categoryPages: MetadataRoute.Sitemap = Array.from(locCatSet).map(combo => ({
      url: `${BASE}/${combo}`,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))

    const articlePages: MetadataRoute.Sitemap = articles.map((a: any) => ({
      url: `${BASE}/artikler/${a.slug}`,
      lastModified: a.updated_at ?? a.published_at ?? undefined,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }))

    return [...staticPages, ...locationPages, ...categoryPages, ...productPages, ...articlePages]
  } catch {
    // Fall back to static pages if Supabase is unreachable
    return staticPages
  }
}
