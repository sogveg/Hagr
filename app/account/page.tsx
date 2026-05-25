export const dynamic = 'force-dynamic'

import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase-server'
import { Card } from '@/components/ui/card'
import LogoutButton from './logout-button'

export default async function AccountPage() {
  const supabase = await createClient()
  
  if (!supabase) redirect('/login')
  
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: customer } = await supabase
    .from('customers')
    .select('first_name, last_name, email')
    .eq('user_id', user.id)
    .single()

  return (
    <main className="min-h-screen bg-[var(--color-background)] py-12 px-6">
      <div className="max-w-[640px] mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/" className="text-sm text-[var(--color-primary-dark)] font-medium hover:underline mb-2 inline-block">
              &larr; Tilbake til forsiden
            </Link>
            <h1 className="text-[28px] font-bold text-[var(--color-foreground)]">
              Min side
            </h1>
            <p className="text-[15px] text-[var(--color-muted)] mt-1">
              Hei, {customer?.first_name ?? user.email}
            </p>
          </div>
          <LogoutButton />
        </div>

        {/* Content */}
        <Card>
          <p className="text-[var(--color-muted)] text-[15px]">
            Bookinger og dokumenter kommer snart.
          </p>
        </Card>
      </div>
    </main>
  )
}
