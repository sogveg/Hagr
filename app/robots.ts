import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const disallow = [
    '/admin/',
    '/account/',
    '/cart',
    '/login',
    '/register',
    '/forgot-password',
    '/vipps/',
    '/api/',
  ]

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow,
      },
    ],
    sitemap: 'https://www.tinyrent.no/sitemap.xml',
    host:    'https://www.tinyrent.no',
  }
}
