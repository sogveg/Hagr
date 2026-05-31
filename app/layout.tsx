import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { CartProvider } from '@/context/cart-context'
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
    default: 'TinyRent — Lei premium babyutstyr i Bergen',
    template: '%s | TinyRent',
  },
  description: 'Lei premium babyutstyr trygt og enkelt i Bergen. Vogner, soveløsninger og mer — grundig vasket, hent selv eller få levert hjem.',
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
    title: 'TinyRent — Lei premium babyutstyr i Bergen',
    description: 'Lei premium babyutstyr trygt og enkelt i Bergen. Grundig vasket, hent selv eller få levert.',
    type: 'website',
    locale: 'nb_NO',
    url: BASE_URL,
    siteName: 'TinyRent',
    images: [
      {
        url: '/images/hero.jpg',
        width: 1200,
        height: 630,
        alt: 'TinyRent — Premium babyutstyr til leie i Bergen',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TinyRent — Lei premium babyutstyr i Bergen',
    description: 'Lei premium babyutstyr trygt og enkelt i Bergen.',
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="no" className="bg-background">
      <body className={`${inter.className} antialiased`}>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  )
}
