'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { href: '/admin',            label: 'Oversikt',  icon: '◼' },
  { href: '/admin/bookings',   label: 'Bookinger', icon: '📋' },
  { href: '/admin/products',   label: 'Produkter', icon: '📦' },
  { href: '/admin/inventory',  label: 'Lager',     icon: '🗃️' },
  { href: '/admin/customers',  label: 'Kunder',    icon: '👤' },
]

export function AdminNav() {
  const pathname = usePathname()

  return (
    <nav className="flex-1 py-4 px-3">
      {navItems.map(item => {
        const isActive =
          item.href === '/admin'
            ? pathname === '/admin'
            : pathname.startsWith(item.href)

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors mb-0.5 ${
              isActive
                ? 'bg-white/[0.10] text-white'
                : 'text-white/50 hover:text-white hover:bg-white/[0.06]'
            }`}
          >
            <span className="text-base">{item.icon}</span>
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}
