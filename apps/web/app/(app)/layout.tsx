import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Sidebar from '@/components/Sidebar'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // Redirect to onboarding if user has no companies yet
  const { data: access } = await supabase
    .from('company_access')
    .select('company_id')
    .eq('user_id', user.id)
    .limit(1)

  if (!access || access.length === 0) {
    redirect('/onboarding')
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar userId={user.id} />
      <main className="flex-1 ml-64 p-8 min-h-screen bg-gray-50">
        {children}
      </main>
    </div>
  )
}
