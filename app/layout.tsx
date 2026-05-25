import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'TinyRent — Lei premium babyutstyr i Bergen',
  description: 'Lei premium babyutstyr trygt og enkelt i Bergen.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="no">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
