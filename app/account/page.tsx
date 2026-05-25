export const dynamic = 'force-dynamic'

import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase-server'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import LogoutButton from './logout-button'

const statusMap: Record<string, { label: string; className: string }> = {
  draft:           { label: 'Utkast',          className: 'bg-gray-100 text-gray-500' },
  pending_payment: { label: 'Venter betaling',  className: 'bg-yellow-50 text-yellow-700' },
  payment_failed:  { label: 'Betaling feilet',  className: 'bg-red-50 text-red-600' },
  confirmed:       { label: 'Bekreftet',         className: 'bg-blue-50 text-blue-700' },
  prepared:        { label: 'Klar til henting',  className: 'bg-purple-50 text-purple-700' },
  delivered:       { label: 'Levert',            className: 'bg-indigo-50 text-indigo-700' },
  active_rental:   { label: 'Aktiv leie',        className: 'bg-green-50 text-green-700' },
  returned:        { label: 'Returnert',          className: 'bg-gray-50 text-gray-600' },
  completed:       { label: 'Fullført',           className: 'bg-gray-50 text-gray-500' },
  cancelled:       { label: 'Kansellert',         className: 'bg-red-50 text-red-500' },
}

export default async function AccountPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: customer } = await supabase
    .from('customers')
    .select('*')
    .eq('user_id', user.id)
    .single()

  const { data: bookings } = customer
    ? await supabase
        .from('bookings')
        .select('*')
        .eq('customer_id', customer.id)
        .order('created_at', { ascending: false })
    : { data: [] }

  const activeBookings = (bookings ?? []).filter(b =>
    ['confirmed', 'prepared', 'delivered', 'active_rental'].includes(b.status)
  )
  const pastBookings = (bookings ?? []).filter(b =>
    ['completed', 'returned', 'cancelled'].includes(b.status)
  )

  const displayName = customer?.first_name
    ? `${customer.first_name}${customer.last_name ? ' ' + customer.last_name : ''}`
    : user.email

  return (
    <main className="min-h-screen bg-[var(--color-background)]">
      <Header />

      <div className="max-w-[720px] mx-auto px-6 py-12">
        {/* Topptekst */}
        <div className="flex items-start justify-between mb-10">
          <div>
            <p className="text-xs font-bold text-[var(--color-primary)] uppercase tracking-widest mb-2">
              Min konto
            </p>
            <h1 className="text-3xl font-bold text-[var(--color-foreground)] tracking-tight">
              Hei, {displayName?.split(' ')[0]} 👋
            </h1>
            <p className="text-[var(--color-muted)] mt-1 text-sm">{user.email}</p>
          </div>
          <LogoutButton />
        </div>

        {/* Aktive bookinger */}
        <section className="mb-10">
          <h2 className="text-lg font-bold text-[var(--color-foreground)] mb-4">
            Aktive leieforhold
          </h2>

          {activeBookings.length === 0 ? (
            <div className="bg-white rounded-2xl border border-[var(--color-border)] px-6 py-12 text-center">
              <p className="text-[var(--color-muted)] text-sm mb-4">Du har ingen aktive leieforhold.</p>
              <Link
                href="/bergen"
                className="text-sm font-semibold text-[var(--color-primary)] hover:underline"
              >
                Se tilgjengelig utstyr &rarr;
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {activeBookings.map(booking => {
                const s = statusMap[booking.status] ?? { label: booking.status, className: 'bg-gray-100 text-gray-500' }
                return (
                  <div
                    key={booking.id}
                    className="bg-white rounded-2xl border border-[var(--color-border)] px-6 py-5 flex items-center justify-between gap-4"
                  >
                    <div>
                      <p className="font-mono text-xs text-[var(--color-muted-foreground)] mb-1">
                        #{booking.id.slice(0, 8)}
                      </p>
                      <p className="font-semibold text-[var(--color-foreground)] text-sm">
                        {new Date(booking.start_date).toLocaleDateString('nb-NO')}
                        {' — '}
                        {new Date(booking.end_date).toLocaleDateString('nb-NO')}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${s.className}`}>
                        {s.label}
                      </span>
                      <span className="font-bold text-[var(--color-foreground)] text-sm whitespace-nowrap">
                        {booking.total_amount} kr
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </section>

        {/* Tidligere bookinger */}
        {pastBookings.length > 0 && (
          <section className="mb-10">
            <h2 className="text-lg font-bold text-[var(--color-foreground)] mb-4">
              Tidligere leier
            </h2>
            <div className="bg-white rounded-2xl border border-[var(--color-border)] overflow-hidden">
              {pastBookings.map((booking, i) => {
                const s = statusMap[booking.status] ?? { label: booking.status, className: 'bg-gray-100 text-gray-500' }
                return (
                  <div
                    key={booking.id}
                    className={`px-6 py-4 flex items-center justify-between gap-4 ${i > 0 ? 'border-t border-[var(--color-border)]' : ''}`}
                  >
                    <div>
                      <p className="font-mono text-xs text-[var(--color-muted-foreground)] mb-0.5">
                        #{booking.id.slice(0, 8)}
                      </p>
                      <p className="text-sm text-[var(--color-muted)]">
                        {new Date(booking.start_date).toLocaleDateString('nb-NO')}
                        {' — '}
                        {new Date(booking.end_date).toLocaleDateString('nb-NO')}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${s.className}`}>
                        {s.label}
                      </span>
                      <span className="text-sm font-semibold text-[var(--color-muted)] whitespace-nowrap">
                        {booking.total_amount} kr
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {/* Kontoinformasjon */}
        <section>
          <h2 className="text-lg font-bold text-[var(--color-foreground)] mb-4">
            Kontoinformasjon
          </h2>
          <div className="bg-white rounded-2xl border border-[var(--color-border)] overflow-hidden">
            {[
              { label: 'Navn', value: customer ? `${customer.first_name ?? ''} ${customer.last_name ?? ''}`.trim() || '—' : '—' },
              { label: 'E-post', value: user.email ?? '—' },
              { label: 'Telefon', value: customer?.phone ?? '—' },
              { label: 'Adresse', value: customer?.address_line1 ?? '—' },
              { label: 'By', value: customer?.city ?? '—' },
            ].map(({ label, value }, i) => (
              <div
                key={label}
                className={`px-6 py-4 flex items-center justify-between ${i > 0 ? 'border-t border-[var(--color-border)]' : ''}`}
              >
                <span className="text-sm text-[var(--color-muted)]">{label}</span>
                <span className="text-sm font-medium text-[var(--color-foreground)]">{value}</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      <Footer />
    </main>
  )
}
