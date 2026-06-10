'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  Target,
  Gift,
  FileText,
  Smartphone,
  UtensilsCrossed,
  TrendingUp,
  CreditCard,
  BookOpen,
  LogOut,
  Car,
  Anchor,
  Heart,
  Bot,
  Lightbulb,
} from 'lucide-react'

const NAV_GROUPS = [
  {
    label: 'Oversikt',
    items: [
      { href: '/dashboard', label: 'Oversikt', icon: LayoutDashboard },
      { href: '/people',    label: 'Personer og roller', icon: Users },
    ],
  },
  {
    label: 'Lær & Regler',
    items: [
      { href: '/rules',     label: 'Regelbibliotek & tips', icon: Lightbulb, highlight: true },
      { href: '/salary-dividend', label: 'Lønn vs. utbytte',      icon: TrendingUp },
    ],
  },
  {
    label: 'Verktøy og fradrag',
    items: [
      { href: '/gifts',           label: 'Gaver og rabatter',    icon: Gift },
      { href: '/phone-internet',  label: 'Telefon og internett', icon: Smartphone },
      { href: '/representation',  label: 'Representasjon',       icon: UtensilsCrossed },
      { href: '/company-card',    label: 'Firmakort',            icon: CreditCard },
      { href: '/car',             label: 'Bil og kjørebok',      icon: Car },
      { href: '/cabin-boat',      label: 'Hytte og båt',         icon: Anchor },
      { href: '/welfare',         label: 'Velferdstiltak',       icon: Heart },
    ],
  },
  {
    label: 'Dokumentasjon',
    items: [
      { href: '/board-meetings', label: 'Styremøter',        icon: ClipboardList },
      { href: '/strategy',       label: 'Strategisamlinger', icon: Target },
    ],
  },
  {
    label: 'AI-assistent',
    items: [
      { href: '/assistant', label: 'Spør AI om skatt', icon: Bot },
    ],
  },
  {
    label: 'Eksport',
    items: [
      { href: '/documents', label: 'Bokettersynsmappe', icon: FileText },
    ],
  },
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
      {/* Logo */}
      <div className="px-6 py-5 border-b border-gray-100">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-brand-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-xs font-bold">SS</span>
          </div>
          <span className="text-lg font-bold text-gray-900">SkatteSmart</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-3 space-y-4 overflow-y-auto">
        {NAV_GROUPS.map(group => (
          <div key={group.label}>
            <p className="px-3 mb-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              {group.label}
            </p>
            <div className="space-y-0.5">
              {group.items.map(({ href, label, icon: Icon, highlight }: any) => {
                const active = pathname === href || pathname.startsWith(href + '/')
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      active
                        ? 'bg-brand-50 text-brand-700'
                        : highlight
                          ? 'text-amber-700 bg-amber-50 hover:bg-amber-100'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Icon
                      size={16}
                      className={active ? 'text-brand-600' : highlight ? 'text-amber-500' : 'text-gray-400'}
                      strokeWidth={active || highlight ? 2.2 : 1.8}
                    />
                    {label}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-3 pb-4 border-t border-gray-100 pt-3">
        <button
          onClick={signOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm
                     text-gray-500 hover:bg-gray-50 hover:text-gray-800 transition-colors"
        >
          <LogOut size={16} className="text-gray-400" strokeWidth={1.8} />
          Logg ut
        </button>
        <p className="mt-3 px-1 text-xs text-gray-400 leading-relaxed">
          Vurderingene er generell beslutningsstøtte og erstatter ikke bindende skatterådgivning.
        </p>
      </div>
    </aside>
  )
}
