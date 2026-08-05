'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Lightbulb, TrendingUp, Car, UtensilsCrossed, Home,
} from 'lucide-react'

const NAV = [
  { href: '/demo/tips',             label: 'Tips & regler',   icon: Lightbulb },
  { href: '/demo/salary-dividend',  label: 'Lønn vs utbytte', icon: TrendingUp },
  { href: '/demo/firmabil',         label: 'Firmabil',        icon: Car },
  { href: '/demo/cabin-boat',       label: 'Hytte & båt',     icon: Home },
  { href: '/demo/representation',   label: 'Representasjon',  icon: UtensilsCrossed },
]

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-sm">
                <span className="text-white text-xs font-bold">H</span>
              </div>
              <span className="text-base font-bold text-gray-900">Hagr</span>
              <span className="text-xs text-gray-400 ml-1 hidden sm:inline">— demo</span>
            </div>
            <Link
              href="/login"
              className="text-sm bg-violet-600 text-white px-4 py-1.5 rounded-lg font-medium hover:bg-violet-700 transition-colors"
            >
              Logg inn
            </Link>
          </div>

          {/* Nav tabs */}
          <nav className="flex gap-0.5 overflow-x-auto pb-0 -mb-px">
            {NAV.map(({ href, label, icon: Icon }) => {
              const active = pathname === href
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                    active
                      ? 'border-violet-600 text-violet-700'
                      : 'border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300'
                  }`}
                >
                  <Icon size={14} strokeWidth={2} />
                  {label}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        {children}
      </div>

      {/* CTA footer */}
      <div className="border-t border-gray-200 bg-white mt-12">
        <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-semibold text-gray-900 text-sm">Klar til å bruke Hagr for ditt AS?</p>
            <p className="text-sm text-gray-500">Lagre beregninger, logg kjøring, dokumenter møter og mer.</p>
          </div>
          <Link
            href="/signup"
            className="shrink-0 bg-violet-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-violet-700 transition-colors text-sm"
          >
            Kom i gang gratis
          </Link>
        </div>
      </div>
    </div>
  )
}
