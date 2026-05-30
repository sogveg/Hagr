export const dynamic = 'force-dynamic'

import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase-server'
import { createServiceClient } from '@/lib/supabase-server'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { DamageReportForm } from '@/components/ui/damage-report-form'
import { ContactForm } from '@/components/ui/contact-form'

const statusMap: Record<string, { label: string; className: string }> = {
  draft:           { label: 'Utkast',          className: 'bg-gray-100 text-gray-500' },
  pending_payment: { label: 'Venter betaling',  className: 'bg-yellow-50 text-yellow-700' },
  confirmed:       { label: 'Bekreftet',         className: 'bg-blue-50 text-blue-700' },
  prepared:        { label: 'Klar til henting',  className: 'bg-purple-50 text-purple-700' },
  delivered:       { label: 'Levert',            className: 'bg-indigo-50 text-indigo-700' },
  active_rental:   { label: 'Aktiv leie',        className: 'bg-green-50 text-green-700' },
  returned:        { label: 'Returnert',          className: 'bg-gray-50 text-gray-600' },
  completed:       { label: 'Fullført',           className: 'bg-gray-50 text-gray-500' },
  cancelled:       { label: 'Kansellert',         className: 'bg-red-50 text-red-500' },
}

const severityMap: Record<string, { label: string; className: string }> = {
  minor:    { label: 'Liten skade',    className: 'bg-yellow-50 text-yellow-700' },
  moderate: { label: 'Moderat skade',  className: 'bg-orange-50 text-orange-600' },
  severe:   { label: 'Alvorlig skade', className: 'bg-red-50 text-red-600' },
}

export default async function CustomerBookingPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  // Auth
  const authClient = await createClient()
  const { data: { user } } = await authClient.auth.getUser()
  if (!user) redirect('/login')

  // Hent kunde
  const { data: customer } = await authClient
    .from('customers')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!customer) redirect('/account')

  // Hent booking — verifiser at den tilhører kunden
  const { data: booking } = await authClient
    .from('bookings')
    .select('*')
    .eq('id', id)
    .eq('customer_id', customer.id)
    .single()

  if (!booking) notFound()

  const supabase = createServiceClient()

  const [
    { data: bookingItems },
    { data: location },
    damageReports,
  ] = await Promise.all([
    supabase
      .from('booking_items')
      .select('*, products(name, brand, image_url)')
      .eq('booking_id', id),
    booking.location_id
      ? supabase.from('locations').select('name').eq('id', booking.location_id).single()
      : Promise.resolve({ data: null }),
    (supabase.from as any)('damage_reports')
      .select('*')
      .eq('booking_id', id)
      .order('created_at', { ascending: false })
      .then((r: any) => r.data ?? []),
  ])

  const s = statusMap[booking.status] ?? { label: booking.status, className: 'bg-gray-100 text-gray-500' }

  const startDate = booking.start_date ? new Date(booking.start_date) : null
  const endDate   = booking.end_date   ? new Date(booking.end_date)   : null
  const days = startDate && endDate
    ? Math.round((endDate.getTime() - startDate.getTime()) / 86_400_000)
    : null

  const fmt = (d: Date) => d.toLocaleDateString('nb-NO', { day: 'numeric', month: 'long', year: 'numeric' })

  // Kunden kan melde skade ved aktiv leie, levert, returnert
  const canReportDamage = ['delivered', 'active_rental', 'returned', 'completed'].includes(booking.status)

  return (
    <main className="min-h-screen bg-[var(--color-background)]">
      <Header />

      <div className="max-w-[720px] mx-auto px-6 py-12">
        {/* Tilbake */}
        <Link
          href="/account"
          className="text-sm text-[var(--color-muted)] hover:text-[var(--color-foreground)] transition-colors mb-6 inline-block"
        >
          ← Min konto
        </Link>

        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <p className="text-xs font-bold text-[var(--color-primary)] uppercase tracking-widest mb-2">
              Booking
            </p>
            <h1 className="text-2xl font-bold text-[var(--color-foreground)] font-mono tracking-tight">
              #{booking.id.slice(0, 8).toUpperCase()}
            </h1>
            <p className="text-sm text-[var(--color-muted)] mt-1">
              Opprettet {new Date(booking.created_at).toLocaleDateString('nb-NO', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
          <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${s.className}`}>
            {s.label}
          </span>
        </div>

        {/* Produkt(er) */}
        {bookingItems && bookingItems.length > 0 && (
          <div className="bg-white rounded-2xl border border-[var(--color-border)] overflow-hidden mb-4">
            <p className="text-xs font-bold text-[var(--color-muted)] uppercase tracking-widest px-5 pt-4 mb-3">
              Leide produkter
            </p>
            <div className="divide-y divide-[var(--color-border)]">
              {bookingItems.map((item: any) => (
                <div key={item.id} className="px-5 py-4 flex items-center gap-4">
                  {item.products?.image_url && (
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-[var(--color-sand)] shrink-0">
                      <img src={item.products.image_url} alt="" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div>
                    {item.products?.brand && (
                      <p className="text-[10px] font-bold text-[var(--color-primary)] uppercase tracking-widest mb-0.5">
                        {item.products.brand}
                      </p>
                    )}
                    <p className="text-sm font-semibold text-[var(--color-foreground)]">
                      {item.products?.name ?? 'Ukjent produkt'}
                    </p>
                    {item.unit_price && (
                      <p className="text-xs text-[var(--color-muted)]">
                        {item.unit_price} kr
                        {item.price_type === 'day' ? '/dag' : item.price_type === 'week' ? '/uke' : '/måned'}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Periode */}
        <div className="bg-white rounded-2xl border border-[var(--color-border)] p-5 mb-4">
          <p className="text-xs font-bold text-[var(--color-muted)] uppercase tracking-widest mb-3">Leieperiode</p>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-[var(--color-muted)] text-xs mb-0.5">Fra</p>
              <p className="font-semibold text-[var(--color-foreground)]">{startDate ? fmt(startDate) : '—'}</p>
            </div>
            <div>
              <p className="text-[var(--color-muted)] text-xs mb-0.5">Til</p>
              <p className="font-semibold text-[var(--color-foreground)]">{endDate ? fmt(endDate) : '—'}</p>
            </div>
            <div>
              <p className="text-[var(--color-muted)] text-xs mb-0.5">Varighet</p>
              <p className="font-semibold text-[var(--color-foreground)]">{days != null ? `${days} dager` : '—'}</p>
            </div>
          </div>
          {location?.name && (
            <p className="text-xs text-[var(--color-muted)] mt-3">📍 {location.name}</p>
          )}
        </div>

        {/* Beløp */}
        <div className="bg-white rounded-2xl border border-[var(--color-border)] overflow-hidden mb-4">
          <p className="text-xs font-bold text-[var(--color-muted)] uppercase tracking-widest px-5 pt-4 pb-3">Beløp</p>
          {booking.total_amount != null && (
            <div className="flex justify-between px-5 py-3 border-t border-[var(--color-border)]">
              <span className="text-sm text-[var(--color-muted)]">Totalt</span>
              <span className="font-bold text-[var(--color-foreground)]">{booking.total_amount} kr</span>
            </div>
          )}
          {booking.deposit_amount > 0 && (
            <div className="flex justify-between px-5 py-3 border-t border-[var(--color-border)]">
              <span className="text-sm text-[var(--color-muted)]">Depositum (refunderes ved retur)</span>
              <span className="text-sm font-medium text-[var(--color-muted)]">{booking.deposit_amount} kr</span>
            </div>
          )}
        </div>

        {/* Skaderapporter */}
        <div className="bg-white rounded-2xl border border-[var(--color-border)] overflow-hidden">
          <div className="px-5 pt-5 pb-4 border-b border-[var(--color-border)] flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-[var(--color-muted)] uppercase tracking-widest">
                Skaderapporter
              </p>
              <p className="text-xs text-[var(--color-muted)] mt-0.5">
                Dokumenter skader du oppdager — beskytter deg mot uberettigede krav
              </p>
            </div>
            {(damageReports as any[]).length > 0 && (
              <span className="text-xs font-semibold bg-red-50 text-red-600 px-2 py-0.5 rounded-full shrink-0">
                {(damageReports as any[]).length} registrert
              </span>
            )}
          </div>

          {/* Eksisterende */}
          {(damageReports as any[]).length > 0 && (
            <div className="divide-y divide-[var(--color-border)]">
              {(damageReports as any[]).map((report: any) => {
                const sev = severityMap[report.severity] ?? { label: report.severity, className: 'bg-gray-100 text-gray-500' }
                return (
                  <div key={report.id} className="px-5 py-4">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${sev.className}`}>
                          {sev.label}
                        </span>
                        <span className="text-xs text-[var(--color-muted)]">
                          {report.reported_by === 'admin' ? '🔧 TinyRent' : '👤 Du'}
                        </span>
                      </div>
                      <span className="text-xs text-[var(--color-muted)] whitespace-nowrap">
                        {new Date(report.created_at).toLocaleDateString('nb-NO', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                    <p className="text-sm text-[var(--color-foreground)]">{report.description}</p>
                    {report.amount_charged != null && report.amount_charged > 0 && (
                      <p className="text-xs font-semibold text-red-600 mt-1">
                        Gebyr: {report.amount_charged} kr
                      </p>
                    )}
                    {report.photo_url && (
                      <a href={report.photo_url} target="_blank" rel="noopener noreferrer"
                        className="text-xs text-[var(--color-primary-dark)] hover:underline mt-1 inline-block">
                        📷 Se bilde →
                      </a>
                    )}
                  </div>
                )
              })}
            </div>
          )}

          {/* Form — kun om leieforholdet er aktivt/levert/returnert */}
          {canReportDamage ? (
            <div className="px-5 py-5 border-t border-[var(--color-border)] bg-[var(--color-sand)]/30">
              <p className="text-sm font-semibold text-[var(--color-foreground)] mb-1">Meld en skade</p>
              <p className="text-xs text-[var(--color-muted)] mb-4">
                Oppdaget en skade? Registrer den her for å dokumentere tilstanden.
              </p>
              <DamageReportForm bookingId={id} isAdmin={false} />
            </div>
          ) : (
            <div className="px-5 py-4 text-sm text-[var(--color-muted)]">
              {(damageReports as any[]).length === 0 && 'Ingen skader registrert.'}
              {!['delivered', 'active_rental', 'returned', 'completed'].includes(booking.status) && (
                <p className="mt-1 text-xs">Skaderapportering er tilgjengelig når leieforholdet er aktivt.</p>
              )}
            </div>
          )}
        </div>
      </div>

        {/* Ta kontakt om denne bookingen */}
        <div className="bg-white rounded-2xl border border-[var(--color-border)] p-6 mt-4">
          <h2 className="text-sm font-bold text-[var(--color-foreground)] mb-1">Spørsmål om bookingen?</h2>
          <p className="text-xs text-[var(--color-muted)] mb-5">
            Ta kontakt med oss — vi svarer innen en arbeidsdag.
          </p>
          <ContactForm
            bookingId={id}
            bookingRef={`#${booking.id.slice(0, 8).toUpperCase()}`}
            prefillSubject="Spørsmål om en booking"
          />
        </div>
      </div>

      <Footer />
    </main>
  )
}
