import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'TinyRent — Lei premium babyutstyr i Bergen',
  description: 'Lei premium babyutstyr trygt og enkelt i Bergen.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="no">
      <body>{children}</body>
    </html>
  )
}
