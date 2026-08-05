import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Sidebar from '@/components/Sidebar'
import { LanguageModeProvider } from '@/contexts/LanguageMode'
import { CompanyProvider } from '@/contexts/CompanyContext'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // TEMP: auth bypass for demo — remove when done
  // if (!user) redirect('/login')

  // Redirect to onboarding if user has no companies yet
  if (user) {
    const { data: access } = await supabase
      .from('company_access')
      .select('company_id')
      .eq('user_id', user.id)
      .limit(1)

    if (!access || access.length === 0) {
      redirect('/onboarding')
    }
  }

  return (
    <LanguageModeProvider>
      <CompanyProvider>
        <div className="flex min-h-screen">
          <Sidebar userId={user.id} />
          <main className="flex-1 md:ml-64 pt-16 md:pt-0 p-4 md:p-8 min-h-screen bg-gray-50">
            {children}
          </main>
        </div>
      </CompanyProvider>
    </LanguageModeProvider>
  )
}
