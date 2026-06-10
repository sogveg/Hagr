'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useLanguageMode } from '@/contexts/LanguageMode'
import {
  LayoutDashboard, Users, ClipboardList, Target, Gift, FileText,
  Smartphone, UtensilsCrossed, TrendingUp, CreditCard,
  LogOut, Car, Anchor, Heart, Bot, Lightbulb,
} from 'lucide-react'

// Each item has both an "enkel" (plain) and "pro" (professional) label
const NAV_GROUPS = [
  {
    enkel: 'Hjem',
    pro:   'Oversikt',
    items: [
      { href: '/dashboard', enkel: 'Min skatteposisjon',   pro: 'Oversikt',              icon: LayoutDashboard },
      { href: '/people',    enkel: 'Ansatte og familie',   pro: 'Ansatte og aksjonærer', icon: Users },
    ],
  },
  {
    enkel: 'Optimalisering',
    pro:   'Skatteplanlegging',
    items: [
      { href: '/salary-dividend', enkel: 'Lønn vs. utbytte',  pro: 'Lønns- og utbytteoptimalisering', icon: TrendingUp, highlight: true },
      { href: '/rules',           enkel: 'Tips og regler',    pro: 'Regelbibliotek',                  icon: Lightbulb },
    ],
  },
  {
    enkel: 'Skattefrie goder',
    pro:   'Naturalytelser og fradrag',
    items: [
      { href: '/gifts',          enkel: 'Gaver (5 000 kr/pers)',  pro: 'Gaver og personalrabatter',         icon: Gift },
      { href: '/phone-internet', enkel: 'Mobil og internett',     pro: 'Elektronisk kommunikasjon (EK)',    icon: Smartphone },
      { href: '/welfare',        enkel: 'Julebord og velferd',    pro: 'Velferdstiltak',                    icon: Heart },
      { href: '/car',            enkel: 'Bil og kjørebok',        pro: 'Firmabil og kjøregodtgjørelse',     icon: Car },
      { href: '/cabin-boat',     enkel: 'Hytte og båt',           pro: 'Fritidseiendommer og båt',          icon: Anchor },
    ],
  },
  {
    enkel: 'Fradrag og bilag',
    pro:   'Fradragsberettigede kostnader',
    items: [
      { href: '/representation', enkel: 'Kundemøter (560 kr)',  pro: 'Representasjon',         icon: UtensilsCrossed },
      { href: '/company-card',   enkel: 'Firmakort',            pro: 'Firmakort',              icon: CreditCard },
      { href: '/board-meetings', enkel: 'Styremøter',           pro: 'Styreprotokoll',         icon: ClipboardList },
      { href: '/strategy',       enkel: 'Strategisamlinger',    pro: 'Faglige samlinger',      icon: Target },
    ],
  },
  {
    enkel: 'Verktøy',
    pro:   'Verktøy',
    items: [
      { href: '/assistant', enkel: 'Spør AI om skatt',   pro: 'Skatteassistent',      icon: Bot },
      { href: '/documents', enkel: 'Bokettersynsmappe',  pro: 'Dokumentarkiv',        icon: FileText },
    ],
  },
]

interface Props {
  userId: string
}

export default function Sidebar({ userId }: Props) {
  const pathname = usePathname()
  const router = useRouter()
  const { mode, setMode, t } = useLanguageMode()

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
          <div key={group.enkel}>
            <p className="px-3 mb-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              {t(group.enkel, group.pro)}
            </p>
            <div className="space-y-0.5">
              {group.items.map(({ href, enkel, pro, icon: Icon, highlight }: any) => {
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
                    {t(enkel, pro)}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-3 pb-4 border-t border-gray-100 pt-3">

        {/* Language mode toggle */}
        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1 mb-3">
          <button
            onClick={() => setMode('enkel')}
            className={`flex-1 text-xs font-medium py-1.5 rounded-md transition-all ${
              mode === 'enkel'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Enkel
          </button>
          <button
            onClick={() => setMode('pro')}
            className={`flex-1 text-xs font-medium py-1.5 rounded-md transition-all ${
              mode === 'pro'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Faglig
          </button>
        </div>

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
