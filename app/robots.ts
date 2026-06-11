import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/account/',
          '/cart',
          '/login',
          '/register',
          '/forgot-password',
        ],
      },
      // Allow AI crawlers
      { userAgent: 'GPTBot',        allow: '/' },
      { userAgent: 'ClaudeBot',     allow: '/' },
      { userAgent: 'PerplexityBot', allow: '/' },
    ],
    sitemap: 'https://www.tinyrent.no/sitemap.xml',
    host:    'https://www.tinyrent.no',
  }
}
