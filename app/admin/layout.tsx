import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import Link from 'next/link'

const navItems = [
  { href: '/admin', label: 'Oversikt', icon: '◼' },
  { href: '/admin/bookings', label: 'Bookinger', icon: '📋' },
  { href: '/admin/products', label: 'Produkter', icon: '📦' },
  { href: '/admin/inventory', label: 'Lager', icon: '🗃️' },
  { href: '/admin/customers', label: 'Kunder', icon: '👤' },
]

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  return (
    <div className="min-h-screen flex bg-[#0F172A]">

      {/* Sidebar */}
      <aside className="w-60 shrink-0 bg-[#0F172A] border-r border-white/[0.06] flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-white/[0.06]">
          <Link href="/" className="text-white font-bold text-lg tracking-tight">
            TinyRent
          </Link>
          <span className="ml-2 text-[10px] font-bold text-white/30 uppercase tracking-widest">Admin</span>
        </div>

        <nav className="flex-1 py-4 px-3">
          {navItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/50 hover:text-white hover:bg-white/[0.06] transition-colors mb-0.5"
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-white/[0.06]">
          <p className="text-xs text-white/25 truncate">{user.email}</p>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 bg-[#F8F7F4] overflow-auto">
        {children}
      </main>

    </div>
  )
}
