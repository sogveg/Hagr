export const dynamic = 'force-dynamic'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import LogoutButton from './logout-button'

export default async function AccountPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: customer } = await supabase
    .from('customers')
    .select('first_name, last_name, email')
    .eq('user_id', user.id)
    .single()

  return (
    <main style={{ minHeight: '100vh', backgroundColor: 'var(--color-background)', padding: '48px 24px' }}>
      <div style={{ maxWidth: '640px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: '700', color: 'var(--color-text)', margin: 0 }}>
              Min side
            </h1>
            <p style={{ fontSize: '15px', color: '#6B7280', margin: '4px 0 0' }}>
              Hei, {customer?.first_name ?? user.email}
            </p>
          </div>
          <LogoutButton />
        </div>

        <div style={card}>
          <p style={{ color: '#6B7280', fontSize: '15px', margin: 0 }}>
            Bookinger og dokumenter kommer snart.
          </p>
        </div>
      </div>
    </main>
  )
}

const card: React.CSSProperties = {
  backgroundColor: 'white',
  borderRadius: '24px',
  padding: '32px',
  border: '1px solid rgba(0,0,0,0.06)',
  boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
}
