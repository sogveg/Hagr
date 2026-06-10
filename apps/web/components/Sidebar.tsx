'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Oversikt', icon: '⊞' },
  { href: '/people', label: 'Personer og roller', icon: '👥' },
  { href: '/board-meetings', label: 'Styremøter', icon: '📋' },
  { href: '/strategy', label: 'Strategisamlinger', icon: '🎯' },
  { href: '/gifts', label: 'Gaveregister', icon: '🎁' },
  { href: '/documents', label: 'Dokumenter', icon: '📄' },
]

interface Props {
  userId: string
}

export default function Sidebar({ userId }: Props) {
  const pathname = usePathname()
  const router = useRouter()

  async function signOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 flex flex-col z-10">
      <div className="p-6 border-b border-gray-100">
        <Link href="/dashboard" className="text-xl font-bold text-brand-700">
          SkatteSmart
        </Link>
      </div>
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map(item => {
          const active = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? 'bg-brand-50 text-brand-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
      </nav>
      <div className="p-4 border-t border-gray-100">
        <button
          onClick={signOut}
          className="w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm
                     text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
        >
          <span>→</span> Logg ut
        </button>
        <p className="mt-3 text-xs text-gray-400 leading-relaxed">
          Vurderingene er generell beslutningsstøtte og erstatter ikke bindende skatterådgivning.
        </p>
      </div>
    </aside>
  )
}
