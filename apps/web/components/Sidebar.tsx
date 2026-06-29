'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useLanguageMode } from '@/contexts/LanguageMode'
import { useCompany } from '@/contexts/CompanyContext'
import { useState } from 'react'
import {
  LayoutDashboard, Users, ClipboardList, Target, Gift, FileText,
  Smartphone, UtensilsCrossed, TrendingUp, CreditCard,
  LogOut, Car, Anchor, Heart, Bot, Lightbulb, Building2, ChevronDown, Menu, X,
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
  const { companies, selectedCompanyId, setSelectedCompanyId } = useCompany()
  const [mobileOpen, setMobileOpen] = useState(false)

  async function signOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  // Close mobile menu on navigation
  const handleNavClick = () => setMobileOpen(false)

  return (
    <>
      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-30 bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-sm">
            <span className="text-white text-xs font-bold">H</span>
          </div>
          <span className="text-lg font-bold text-gray-900">Hagr</span>
        </Link>
        <button onClick={() => setMobileOpen(v => !v)} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-20 bg-black/40" onClick={() => setMobileOpen(false)} />
      )}

    <aside className={`fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 flex flex-col z-20 transition-transform duration-200
      md:translate-x-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
      {/* Logo */}
      <div className="px-6 py-5 border-b border-gray-100">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-sm">
            <span className="text-white text-xs font-bold">H</span>
          </div>
          <span className="text-lg font-bold text-gray-900">Hagr</span>
        </Link>
      </div>

      {/* Company selector */}
      {companies.length > 0 && (
        <div className="px-3 py-3 border-b border-gray-100">
          <p className="px-3 mb-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Selskap</p>
          <div className="relative">
            <Building2 size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <select
              value={selectedCompanyId}
              onChange={e => setSelectedCompanyId(e.target.value)}
              className="w-full pl-8 pr-7 py-2 text-sm font-medium text-gray-800 bg-gray-50 border border-gray-200 rounded-lg appearance-none cursor-pointer hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500/30"
            >
              {companies.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>
      )}

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
                    onClick={handleNavClick}
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
    </>
  )
}
