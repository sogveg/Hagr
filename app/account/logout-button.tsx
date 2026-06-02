'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-browser'
import { Button } from '@/components/ui/button'
import { useLocale } from '@/context/locale-context'

export default function LogoutButton() {
  const router = useRouter()
  const { locale } = useLocale()

  async function handleLogout() {
    const supabase = createClient()
    if (supabase) {
      await supabase.auth.signOut()
    }
    router.push('/')
    router.refresh()
  }

  return (
    <Button onClick={handleLogout} variant="secondary" size="sm">
      {locale === 'en' ? 'Log out' : 'Logg ut'}
    </Button>
  )
}
