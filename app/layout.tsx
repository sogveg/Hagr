import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { cookies } from 'next/headers'
import { CartProvider } from '@/context/cart-context'
import { LocaleProvider } from '@/context/locale-context'
import { CookieConsent } from '@/components/ui/cookie-consent'
import type { Locale } from '@/lib/i18n'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

const BASE_URL = 'https://www.tinyrent.no'

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'TinyRent – Lei babyutstyr i Bergen',
    template: '%s | TinyRent',
  },
  description: 'Lei babyutstyr trygt og enkelt i Bergen. Vogner, soveløsninger og mer. Grundig vasket, hent selv eller få levert hjem.',
  keywords: ['babyutstyr', 'leie', 'Bergen', 'barnevogn', 'babyseng', 'hengekøye', 'babyzen', 'moonboon', 'stokke', 'premium'],
  authors: [{ name: 'TinyRent', url: BASE_URL }],
  creator: 'TinyRent',
  publisher: 'TinyRent',
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  openGraph: {
    title: 'TinyRent – Lei babyutstyr i Bergen',
    description: 'Lei babyutstyr trygt og enkelt i Bergen. Grundig vasket, hent selv eller få levert.',
    type: 'website',
    locale: 'nb_NO',
    url: BASE_URL,
    siteName: 'TinyRent',
    images: [
      {
        url: '/images/hero.jpg',
        width: 1200,
        height: 630,
        alt: 'TinyRent – Babyutstyr til leie i Bergen',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TinyRent – Lei babyutstyr i Bergen',
    description: 'Lei babyutstyr trygt og enkelt i Bergen.',
    images: ['/images/hero.jpg'],
  },
  alternates: {
    canonical: BASE_URL,
  },
}

export const viewport: Viewport = {
  themeColor: '#4A6741',
  width: 'device-width',
  initialScale: 1,
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const locale = (cookieStore.get('lang')?.value === 'en' ? 'en' : 'no') as Locale

  return (
    <html lang={locale === 'en' ? 'en' : 'no'} className="bg-background">
      <body className={`${inter.className} antialiased`}>
        <LocaleProvider initialLocale={locale}>
          <CartProvider>{children}</CartProvider>
          <CookieConsent />
        </LocaleProvider>
      </body>
    </html>
  )
}
