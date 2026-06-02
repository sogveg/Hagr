export const dynamic = 'force-dynamic'

import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase-server'
import { getServerT } from '@/lib/get-locale'
import { STATUS_LABELS } from '@/lib/i18n'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import LogoutButton from './logout-button'

export default async function AccountPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { t, locale } = await getServerT()

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
  const pendingBookings = (bookings ?? []).filter(b =>
    ['draft', 'pending_payment', 'payment_failed'].includes(b.status)
  )
  const pastBookings = (bookings ?? []).filter(b =>
    ['completed', 'returned', 'cancelled'].includes(b.status)
  )

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

  const dateLocale = locale === 'en' ? 'en-GB' : 'nb-NO'

  function getStatusLabel(status: string) {
    return STATUS_LABELS[status]?.[locale] ?? { label: status, className: 'bg-gray-100 text-gray-500' }
  }

  // Account info labels
  const nameLabel    = locale === 'en' ? 'Name'    : 'Navn'
  const emailLabel   = locale === 'en' ? 'Email'   : 'E-post'
  const phoneLabel   = locale === 'en' ? 'Phone'   : 'Telefon'
  const addressLabel = locale === 'en' ? 'Address' : 'Adresse'
  const cityLabel    = locale === 'en' ? 'City'    : 'By'
  const accountInfoLabel = locale === 'en' ? 'Account information' : 'Kontoinformasjon'
  const detailsLabel = locale === 'en' ? 'Details →' : 'Detaljer →'
  const orderHistoryLabel = locale === 'en' ? 'Order history' : 'Ordrehistorik'
  const activeRentalsLabel = locale === 'en' ? 'Active rentals' : 'Aktive leieforhold'
  const noActiveLabel = locale === 'en'
    ? 'You have no active rentals yet.'
    : 'Du har ingen aktive leieforhold ennå.'
  const browseLabel = locale === 'en' ? 'See available equipment' : 'Se tilgjengelig utstyr'
  const greetingLabel = locale === 'en' ? 'Hi' : 'Hei'
  const adminLabel = locale === 'en' ? 'Go to admin panel' : 'Gå til adminpanelet'
  const pendingLabel = locale === 'en' ? 'Pending bookings' : 'Ventende bestillinger'
  const seeDetailsLabel = locale === 'en' ? 'See details →' : 'Se detaljer →'

  return (
    <main className="min-h-screen bg-[var(--color-background)]">
      <Header />

      <div className="max-w-[720px] mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex items-start justify-between mb-10">
          <div>
            <p className="text-xs font-bold text-[var(--color-primary)] uppercase tracking-widest mb-2">
              {t.account.label}
            </p>
            <h1 className="text-3xl font-bold text-[var(--color-foreground)] tracking-tight">
              {greetingLabel}, {displayName?.split(' ')[0]} 👋
            </h1>
            <p className="text-[var(--color-muted)] mt-1 text-sm">{user.email}</p>
          </div>
          <LogoutButton />
        </div>

        {/* Admin link */}
        {isAdmin && (
          <Link
            href="/admin"
            className="flex items-center justify-between bg-[#0F172A] text-white rounded-2xl px-6 py-4 mb-6 hover:bg-[#1E293B] transition-colors group"
          >
            <div className="flex items-center gap-3">
              <span className="text-lg">⚙️</span>
              <div>
                <p className="text-xs font-bold text-white/50 uppercase tracking-widest mb-0.5">Administrator</p>
                <p className="text-sm font-semibold">{adminLabel}</p>
              </div>
            </div>
            <span className="text-white/40 group-hover:text-white transition-colors text-lg">→</span>
          </Link>
        )}

        {/* Pickup banner */}
        {nextPickup && (() => {
          const isPrepared = nextPickup.status === 'prepared'
          const isToday    = nextPickup.start_date === todayStr
          const startFmt   = new Date(nextPickup.start_date).toLocaleDateString(dateLocale, { weekday: 'long', day: 'numeric', month: 'long' })

          const bannerLabel = isPrepared
            ? (locale === 'en' ? 'Ready for collection! 🎉' : 'Klar til henting! 🎉')
            : isToday
            ? (locale === 'en' ? 'Collection today!' : 'Henting i dag!')
            : (locale === 'en' ? 'Collection tomorrow' : 'Henting i morgen')

          const bannerMsg = isPrepared
            ? (locale === 'en'
              ? `Your booking is packed and ready — collection on ${startFmt}`
              : `Din booking er pakket og klar — hentes ${startFmt}`)
            : (locale === 'en'
              ? `Reminder: your rental period starts ${startFmt}`
              : `Husk at din leieperiode starter ${startFmt}`)

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
                {seeDetailsLabel}
              </Link>
            </div>
          )
        })()}

        {/* Pending bookings */}
        {pendingBookings.length > 0 && (
          <section className="mb-10">
            <h2 className="text-lg font-bold text-[var(--color-foreground)] mb-4">
              {pendingLabel}
            </h2>
            <div className="space-y-3">
              {pendingBookings.map(booking => {
                const s = getStatusLabel(booking.status)
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
                        {new Date(booking.start_date).toLocaleDateString(dateLocale)}
                        {' — '}
                        {new Date(booking.end_date).toLocaleDateString(dateLocale)}
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
                        {detailsLabel}
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {/* Active rentals */}
        <section className="mb-10">
          <h2 className="text-lg font-bold text-[var(--color-foreground)] mb-4">
            {activeRentalsLabel}
          </h2>

          {activeBookings.length === 0 ? (
            <div className="bg-white rounded-2xl border border-[var(--color-border)] px-6 py-12 text-center">
              <p className="text-[var(--color-muted)] text-sm mb-4">{noActiveLabel}</p>
              <Link
                href="/bergen"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-primary-dark)] hover:underline"
              >
                {browseLabel} <span>&rarr;</span>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {activeBookings.map(booking => {
                const s = getStatusLabel(booking.status)
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
                        {new Date(booking.start_date).toLocaleDateString(dateLocale)}
                        {' — '}
                        {new Date(booking.end_date).toLocaleDateString(dateLocale)}
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
                        {detailsLabel}
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </section>

        {/* Order history */}
        {pastBookings.length > 0 && (
          <section className="mb-10">
            <h2 className="text-lg font-bold text-[var(--color-foreground)] mb-4">
              {orderHistoryLabel}
            </h2>
            <div className="bg-white rounded-2xl border border-[var(--color-border)] overflow-hidden">
              {pastBookings.map((booking, i) => {
                const s = getStatusLabel(booking.status)
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
                        {new Date(booking.start_date).toLocaleDateString(dateLocale)}
                        {' — '}
                        {new Date(booking.end_date).toLocaleDateString(dateLocale)}
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
                        {detailsLabel}
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {/* Account info */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-[var(--color-foreground)]">
              {accountInfoLabel}
            </h2>
            <Link
              href="/account/profil"
              className="text-xs font-semibold text-[var(--color-primary-dark)] hover:underline"
            >
              {t.account.editProfile} →
            </Link>
          </div>
          <div className="bg-white rounded-2xl border border-[var(--color-border)] overflow-hidden">
            {[
              { label: nameLabel,    value: customer ? `${customer.first_name ?? ''} ${customer.last_name ?? ''}`.trim() || '—' : '—' },
              { label: emailLabel,   value: user.email ?? '—' },
              { label: phoneLabel,   value: customer?.phone ?? '—' },
              { label: addressLabel, value: customer?.address_line1 ?? '—' },
              { label: cityLabel,    value: customer?.city ?? '—' },
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
