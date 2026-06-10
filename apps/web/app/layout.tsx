import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'SkatteSmart',
  description: 'Lovlig skattegrep for norske gründere og småbedrifter',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nb">
      <body>{children}</body>
    </html>
  )
}
