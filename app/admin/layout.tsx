import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import { AdminNav } from '@/components/admin/admin-nav'
import Link from 'next/link'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const adminEmails = (process.env.ADMIN_EMAILS ?? '').split(',').map(e => e.trim().toLowerCase()).filter(Boolean)
  if (adminEmails.length > 0 && !adminEmails.includes((user.email ?? '').toLowerCase())) {
    redirect('/')
  }

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

        <AdminNav />

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
