import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://hagr.io'),
  title: {
    default: 'Hagr — Lovlig skattegrep for AS-eiere',
    template: '%s | Hagr',
  },
  description: 'Dokumenter styremøter, strategisamlinger, gaver og firmabil med innebygget risikovurdering. Optimalisert for norske AS-eiere og gründere.',
  keywords: ['skatt', 'AS', 'aksjeselskap', 'firmabil', 'styremøte', 'lønn', 'utbytte', 'skatteoptimalisering', 'gründer', 'Norge'],
  authors: [{ name: 'Hagr' }],
  creator: 'Hagr',
  openGraph: {
    type: 'website',
    locale: 'nb_NO',
    url: 'https://skattesmart.no',
    siteName: 'Hagr',
    title: 'Hagr — Lovlig skattegrep for AS-eiere',
    description: 'Dokumenter styremøter, strategisamlinger, gaver og firmabil med innebygget risikovurdering. Optimalisert for norske AS-eiere og gründere.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hagr — Lovlig skattegrep for AS-eiere',
    description: 'Dokumenter styremøter, strategisamlinger, gaver og firmabil med innebygget risikovurdering.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nb" suppressHydrationWarning>
      <head>
        {/* Set dark class before first paint to avoid flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');var d=window.matchMedia('(prefers-color-scheme: dark)').matches;if(t==='dark'||(t===null&&d)){document.documentElement.classList.add('dark')}}catch(e){}})()`,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
