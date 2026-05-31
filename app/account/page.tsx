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

  // Banner: klar til henting ELLER henting innen 24 timer
  const todayStr    = new Date().toISOString().slice(0, 10)
  const tomorrowStr = new Date(Date.now() + 86_400_000).toISOString().slice(0, 10)

  const nextPickup = activeBookings.find(b =>
    b.status === 'prepared' ||
    (b.start_date <= tomorrowStr && ['confirmed', 'prepared'].includes(b.status))
  )

  const displayName = customer?.first_name
    ? `${customer.first_name}${customer.last_name ? ' ' + customer.last_name : ''}`
    : user.email

  const adminEmails = (process.env.ADMIN_EMAILS ?? '').split(',').map(e => e.trim().toLowerCase()).filter(Boolean)
  const isAdmin = adminEmails.length > 0 && adminEmails.includes((user.email ?? '').toLowerCase())

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

        {/* Admin-snarvei */}
        {isAdmin && (
          <Link
            href="/admin"
            className="flex items-center justify-between bg-[#0F172A] text-white rounded-2xl px-6 py-4 mb-6 hover:bg-[#1E293B] transition-colors group"
          >
            <div className="flex items-center gap-3">
              <span className="text-lg">⚙️</span>
              <div>
                <p className="text-xs font-bold text-white/50 uppercase tracking-widest mb-0.5">Administrator</p>
                <p className="text-sm font-semibold">Gå til adminpanelet</p>
              </div>
            </div>
            <span className="text-white/40 group-hover:text-white transition-colors text-lg">→</span>
          </Link>
        )}

        {/* Henting-banner */}
        {nextPickup && (() => {
          const isPrepared = nextPickup.status === 'prepared'
          const isToday    = nextPickup.start_date === todayStr
          const isTomorrow = nextPickup.start_date === tomorrowStr
          const bannerLabel = isPrepared
            ? 'Klar til henting! 🎉'
            : isToday
            ? 'Henting i dag!'
            : 'Henting i morgen'
          const bannerMsg = isPrepared
            ? `Din booking er pakket og klar — hentes ${new Date(nextPickup.start_date).toLocaleDateString('nb-NO', { weekday: 'long', day: 'numeric', month: 'long' })}`
            : `Husk at din leieperiode starter ${new Date(nextPickup.start_date).toLocaleDateString('nb-NO', { weekday: 'long', day: 'numeric', month: 'long' })}`
          return (
            <div className="bg-[#EEF4EC] border border-[#8FA68B]/30 rounded-2xl px-6 py-4 mb-6 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold text-[#5A7A55] uppercase tracking-wide mb-0.5">{bannerLabel}</p>
                <p className="text-sm font-semibold text-[#2B2B2B]">{bannerMsg}</p>
              </div>
              <Link
                href={`/account/bookings/${nextPickup.id}`}
                className="shrink-0 text-xs font-bold text-[#5A7A55] hover:underline"
              >
                Se detaljer →
              </Link>
            </div>
          )
        })()}

        {/* Aktive bookinger */}
        <section className="mb-10">
          <h2 className="text-lg font-bold text-[var(--color-foreground)] mb-4">
            Aktive leieforhold
          </h2>

          {activeBookings.length === 0 ? (
            <div className="bg-white rounded-2xl border border-[var(--color-border)] px-6 py-12 text-center">
              <p className="text-[var(--color-muted)] text-sm mb-4">Du har ingen aktive leieforhold ennå.</p>
              <Link
                href="/bergen"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-primary-dark)] hover:underline"
              >
                Se tilgjengelig utstyr <span>&rarr;</span>
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
                      <Link
                        href={`/account/bookings/${booking.id}`}
                        className="text-xs font-semibold text-[var(--color-primary-dark)] hover:underline whitespace-nowrap"
                      >
                        Detaljer →
                      </Link>
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
                      <Link
                        href={`/account/bookings/${booking.id}`}
                        className="text-xs font-semibold text-[var(--color-primary-dark)] hover:underline whitespace-nowrap"
                      >
                        Detaljer →
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {/* Kontoinformasjon */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-[var(--color-foreground)]">
              Kontoinformasjon
            </h2>
            <Link
              href="/account/profil"
              className="text-xs font-semibold text-[var(--color-primary-dark)] hover:underline"
            >
              Rediger profil →
            </Link>
          </div>
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
