import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const adminEmail = process.env.ADMIN_EMAIL
  if (adminEmail && user.email !== adminEmail) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <header className="border-b border-gray-800 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-lg font-bold text-violet-400">Hagr</Link>
          <span className="text-gray-600">/</span>
          <span className="text-sm text-gray-400 font-medium">Admin</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-gray-500">{user.email}</span>
          <Link href="/dashboard" className="text-xs text-gray-400 hover:text-white transition-colors">
            Tilbake til app →
          </Link>
        </div>
      </header>
      <main className="p-8">
        {children}
      </main>
    </div>
  )
}
