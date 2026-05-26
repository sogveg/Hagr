import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'TinyRent — Lei premium babyutstyr i Bergen',
  description: 'Lei premium babyutstyr trygt og enkelt i Bergen. Trygt, bærekraftig og med levering hjem til deg.',
  keywords: ['babyutstyr', 'leie', 'Bergen', 'vogn', 'barnevogn', 'babyseng', 'premium'],
  authors: [{ name: 'TinyRent' }],
  openGraph: {
    title: 'TinyRent — Lei premium babyutstyr i Bergen',
    description: 'Lei premium babyutstyr trygt og enkelt i Bergen.',
    type: 'website',
    locale: 'nb_NO',
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
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  )
}
