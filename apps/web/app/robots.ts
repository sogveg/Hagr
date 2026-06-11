import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/login', '/signup'],
        disallow: [
          '/dashboard/',
          '/salary-dividend/',
          '/welfare/',
          '/representation/',
          '/gifts/',
          '/car/',
          '/phone-internet/',
          '/strategy/',
          '/board-meetings/',
          '/people/',
          '/documents/',
          '/rules/',
          '/assistant/',
          '/cabin-boat/',
          '/company-card/',
          '/onboarding/',
          '/api/',
        ],
      },
    ],
    sitemap: 'https://skattesmart.no/sitemap.xml',
  }
}
