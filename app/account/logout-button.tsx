'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-browser'

export default function LogoutButton() {
  const router = useRouter()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <button onClick={handleLogout} style={{
      height: '40px',
      padding: '0 20px',
      borderRadius: '999px',
      border: '1px solid #D1D5DB',
      backgroundColor: 'white',
      color: 'var(--color-text)',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
    }}>
      Logg ut
    </button>
  )
}
