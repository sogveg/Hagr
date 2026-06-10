import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Sidebar from '@/components/Sidebar'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // Check that user has at least one company
  const { data: access } = await supabase
    .from('company_access')
    .select('company_id')
    .eq('user_id', user.id)
    .limit(1)

  const hasCompany = access && access.length > 0
  const isOnboarding = false // determined by route, not here

  if (!hasCompany && !isOnboarding) {
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
