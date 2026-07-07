export const dynamic = 'force-dynamic'

import { notFound } from 'next/navigation'
import { createServiceClient } from '@/lib/supabase-server'
import { updateBookingStatus } from '@/app/actions/admin'
import { DamageReportForm, type BookingProduct } from '@/components/ui/damage-report-form'
import { SendMessageForm } from '@/components/admin/send-message-form'
import Link from 'next/link'

const STATUS_FLOW: Record<string, { label: string; next: string | null; color: string }> = {
  draft:           { label: 'Utkast',         next: 'confirmed',     color: 'bg-gray-100 text-gray-500' },
  pending_payment: { label: 'Venter betaling', next: 'confirmed',     color: 'bg-yellow-50 text-yellow-700' },
  confirmed:       { label: 'Bekreftet',       next: 'prepared',      color: 'bg-blue-50 text-blue-700' },
  prepared:        { label: 'Klar til henting',next: 'delivered',     color: 'bg-purple-50 text-purple-700' },
  delivered:       { label: 'Levert',          next: 'active_rental', color: 'bg-indigo-50 text-indigo-700' },
  active_rental:   { label: 'Aktiv leie',      next: 'returned',      color: 'bg-green-50 text-green-700' },
  returned:        { label: 'Returnert',        next: 'completed',     color: 'bg-gray-50 text-gray-600' },
  completed:       { label: 'Fullført',         next: null,            color: 'bg-gray-50 text-gray-500' },
  cancelled:       { label: 'Kansellert',       next: null,            color: 'bg-red-50 text-red-500' },
}

const NEXT_BUTTON_LABELS: Record<string, string> = {
  confirmed:     '✓ Bekreft booking',
  prepared:      '📦 Marker som klar',
  delivered:     '🚗 Marker som levert',
  active_rental: '✓ Sett til aktiv leie',
  returned:      '↩ Marker som returnert',
  completed:     '✓ Marker som fullført',
}

export default async function BookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = createServiceClient()

  const { data: booking } = await supabase
    .from('bookings')
    .select('*')
    .eq('id', id)
    .single()

  if (!booking) notFound()

  const [
    { data: customer },
    { data: bookingItems },
    { data: location },
    damageReports,
    messages,
  ] = await Promise.all([
    booking.customer_id
      ? supabase.from('customers').select('*').eq('id', booking.customer_id).single()
      : Promise.resolve({ data: null }),
    supabase
      .from('booking_items')
      .select('*, products(name, brand, image_url, slug)')
      .eq('booking_id', id),
    booking.location_id
      ? supabase.from('locations').select('name').eq('id', booking.location_id).single()
      : Promise.resolve({ data: null }),
    (supabase.from as any)('damage_reports')
      .select('*')
      .eq('booking_id', id)
      .order('created_at', { ascending: false })
      .then((r: any) => r.data ?? []),
    (supabase.from as any)('booking_messages')
      .select('*')
      .eq('booking_id', id)
      .order('created_at', { ascending: true })
      .then((r: any) => r.data ?? []),
  ])

  const bookingProducts: BookingProduct[] = (bookingItems ?? [])
    .map((item: any) => item.products?.name ? { id: item.product_id, name: item.products.name } : null)
    .filter(Boolean) as BookingProduct[]

  const statusInfo = STATUS_FLOW[booking.status] ?? { label: booking.status, next: null, color: 'bg-gray-100 text-gray-500' }
  const nextStatus = statusInfo.next
  const nextLabel  = nextStatus ? NEXT_BUTTON_LABELS[nextStatus] : null

  const startDate = booking.start_date ? new Date(booking.start_date) : null
  const endDate   = booking.end_date   ? new Date(booking.end_date)   : null
  const days = startDate && endDate
    ? Math.round((endDate.getTime() - startDate.getTime()) / 86_400_000)
    : null

  const fmt = (d: Date) => d.toLocaleDateString('nb-NO', { day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <div className="p-8 max-w-2xl">
      {/* Header */}
      <div className="mb-8">
        <Link href="/admin/bookings" className="text-xs text-gray-400 hover:text-gray-600 transition-colors mb-3 inline-block">
          ← Tilbake til bookinger
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#2B2B2B] tracking-tight font-mono">
              #{booking.id.slice(0, 8).toUpperCase()}
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              Opprettet {new Date(booking.created_at).toLocaleDateString('nb-NO', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
          <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${statusInfo.color}`}>
            {statusInfo.label}
          </span>
        </div>
      </div>

      {/* Status-handlinger */}
      {(nextLabel || booking.status !== 'cancelled') && (
        <div className="bg-white rounded-2xl border border-black/[0.06] p-5 mb-5 flex items-center gap-3 flex-wrap">
          {nextLabel && nextStatus && (
            <form action={updateBookingStatus.bind(null, booking.id, nextStatus)}>
              <button
                type="submit"
                className="bg-[#2B2B2B] text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                {nextLabel}
              </button>
            </form>
          )}

          {!['cancelled', 'completed'].includes(booking.status) && (
            <form action={updateBookingStatus.bind(null, booking.id, 'cancelled')}>
              <button
                type="submit"
                className="bg-red-50 text-red-600 px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-red-100 transition-colors"
              >
                Kanseller
              </button>
            </form>
          )}

          {booking.status === 'cancelled' && (
            <form action={updateBookingStatus.bind(null, booking.id, 'confirmed')}>
              <button
                type="submit"
                className="bg-blue-50 text-blue-700 px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-blue-100 transition-colors"
              >
                Gjenopprett som bekreftet
              </button>
            </form>
          )}
        </div>
      )}

      {/* Statusflyt-spor */}
      <div className="bg-white rounded-2xl border border-black/[0.06] p-5 mb-5">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Statusflyt</p>
        <div className="flex items-center gap-1 flex-wrap">
          {['draft', 'confirmed', 'prepared', 'delivered', 'active_rental', 'returned', 'completed'].map((s, i, arr) => {
            const info = STATUS_FLOW[s]
            const statusOrder = Object.keys(STATUS_FLOW)
            const currentIdx = statusOrder.indexOf(booking.status)
            const thisIdx    = statusOrder.indexOf(s)
            const isDone     = thisIdx < currentIdx && booking.status !== 'cancelled'
            const isCurrent  = s === booking.status
            return (
              <div key={s} className="flex items-center gap-1">
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                  isCurrent ? info.color :
                  isDone    ? 'bg-gray-100 text-gray-400 line-through' :
                              'bg-gray-50 text-gray-300'
                }`}>
                  {info.label}
                </span>
                {i < arr.length - 1 && <span className="text-gray-200 text-xs">→</span>}
              </div>
            )
          })}
        </div>
      </div>

      {/* Kunde */}
      <div className="bg-white rounded-2xl border border-black/[0.06] p-5 mb-5">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Kunde</p>
        {customer ? (
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-gray-400 text-xs mb-0.5">Navn</p>
              <p className="font-semibold text-[#2B2B2B]">
                {customer.first_name} {customer.last_name}
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-xs mb-0.5">E-post</p>
              <a href={`mailto:${customer.email}`} className="text-[#8FA68B] hover:underline">
                {customer.email}
              </a>
            </div>
            {customer.phone && (
              <div>
                <p className="text-gray-400 text-xs mb-0.5">Telefon</p>
                <a href={`tel:${customer.phone}`} className="font-medium text-[#2B2B2B]">
                  {customer.phone}
                </a>
              </div>
            )}
            {customer.city && (
              <div>
                <p className="text-gray-400 text-xs mb-0.5">By</p>
                <p className="font-medium text-[#2B2B2B]">{customer.city}</p>
              </div>
            )}
          </div>
        ) : (
          <p className="text-gray-400 text-sm">Ingen kundeinformasjon</p>
        )}
      </div>

      {/* Leieperiode */}
      <div className="bg-white rounded-2xl border border-black/[0.06] p-5 mb-5">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Leieperiode</p>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-gray-400 text-xs mb-0.5">Fra</p>
            <p className="font-semibold text-[#2B2B2B]">{startDate ? fmt(startDate) : '—'}</p>
          </div>
          <div>
            <p className="text-gray-400 text-xs mb-0.5">Til</p>
            <p className="font-semibold text-[#2B2B2B]">{endDate ? fmt(endDate) : '—'}</p>
          </div>
          <div>
            <p className="text-gray-400 text-xs mb-0.5">Varighet</p>
            <p className="font-semibold text-[#2B2B2B]">{days != null ? `${days} dager` : '—'}</p>
          </div>
        </div>
        {location?.name && (
          <p className="text-xs text-gray-400 mt-3">📍 {location.name}</p>
        )}
      </div>

      {/* Produkter */}
      {bookingItems && bookingItems.length > 0 && (
        <div className="bg-white rounded-2xl border border-black/[0.06] p-5 mb-5">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Produkter</p>
          <div className="divide-y divide-black/[0.04]">
            {bookingItems.map((item: any) => (
              <div key={item.id} className="py-3 flex items-center justify-between gap-4">
                <div>
                  {item.products?.brand && (
                    <p className="text-[10px] font-bold text-[#8FA68B] uppercase tracking-widest mb-0.5">
                      {item.products.brand}
                    </p>
                  )}
                  <p className="text-sm font-semibold text-[#2B2B2B]">
                    {item.products?.name ?? 'Ukjent produkt'}
                  </p>
                  {item.price_type && (
                    <p className="text-xs text-gray-400 mt-0.5">
                      {item.price_type === 'day'   ? 'Dagspris'   :
                       item.price_type === 'week'  ? 'Ukespris'   :
                       item.price_type === 'month' ? 'Månedspris' : item.price_type}
                      {item.unit_price != null && ` — ${item.unit_price} kr`}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Beløp */}
      <div className="bg-white rounded-2xl border border-black/[0.06] overflow-hidden">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest px-5 pt-5 mb-3">Beløp</p>
        {booking.total_amount != null && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-black/[0.04]">
            <span className="text-sm text-gray-500">Totalt</span>
            <span className="text-base font-bold text-[#2B2B2B]">{booking.total_amount} kr</span>
          </div>
        )}
        {booking.deposit_amount > 0 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-black/[0.04]">
            <span className="text-sm text-gray-500">Depositum</span>
            <span className="text-sm font-medium text-gray-600">{booking.deposit_amount} kr</span>
          </div>
        )}
      </div>

      {/* Kommunikasjon */}
      {customer?.email && (
        <div className="bg-white rounded-2xl border border-black/[0.06] overflow-hidden mb-5 mt-5">
          <div className="px-5 pt-5 pb-4 border-b border-black/[0.04] flex items-center justify-between">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Kommunikasjon</p>
            {(messages as any[]).length > 0 && (
              <span className="text-xs text-gray-400">{(messages as any[]).length} melding{(messages as any[]).length !== 1 ? 'er' : ''}</span>
            )}
          </div>

          {/* Meldingstråd */}
          {(messages as any[]).length > 0 ? (
            <div className="divide-y divide-black/[0.04] max-h-96 overflow-y-auto">
              {(messages as any[]).map((msg: any) => (
                <div key={msg.id} className={`px-5 py-4 ${msg.sender === 'admin' ? 'bg-white' : 'bg-[#F8F7F4]'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs font-semibold ${msg.sender === 'admin' ? 'text-[#8FA68B]' : 'text-gray-500'}`}>
                      {msg.sender === 'admin' ? '🔧 TinyRent' : `👤 ${customer.first_name ?? 'Kunde'}`}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(msg.created_at).toLocaleDateString('nb-NO', {
                        day: 'numeric', month: 'short', year: 'numeric',
                        hour: '2-digit', minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <p className="text-sm text-[#2B2B2B] whitespace-pre-wrap leading-relaxed">{msg.body}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="px-5 py-4 text-sm text-gray-400">Ingen meldinger ennå</p>
          )}

          {/* Send ny melding */}
          <div className="px-5 py-5 border-t border-black/[0.04] bg-[#F8F7F4]">
            <SendMessageForm
              bookingId={id}
              customerName={`${customer.first_name ?? ''} ${customer.last_name ?? ''}`.trim() || customer.email}
              products={bookingProducts}
            />
          </div>
        </div>
      )}

      {/* Depositumstrekk */}
      <div className="bg-white rounded-2xl border border-black/[0.06] overflow-hidden">
        <div className="px-5 pt-5 pb-4 border-b border-black/[0.04] flex items-center justify-between">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Depositumstrekk
          </p>
          {(damageReports as any[]).length > 0 && (
            <span className="text-xs font-semibold bg-red-50 text-red-600 px-2 py-0.5 rounded-full">
              {(damageReports as any[]).length} registrert
            </span>
          )}
        </div>

        {/* Eksisterende rapporter */}
        {(damageReports as any[]).length > 0 ? (
          <div className="divide-y divide-black/[0.04]">
            {(damageReports as any[]).map((report: any) => (
              <DamageReportRow key={report.id} report={report} />
            ))}
          </div>
        ) : (
          <p className="px-5 py-4 text-sm text-gray-400">Ingen skader registrert</p>
        )}

        {/* Legg til ny rapport */}
        <div className="px-5 py-5 border-t border-black/[0.04] bg-[#F8F7F4]">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-4">
            Registrer trekk
          </p>
          <DamageReportForm bookingId={id} isAdmin={true} products={bookingProducts} />
        </div>
      </div>
    </div>
  )
}

function DamageReportRow({ report }: { report: any }) {
  const severityMap: Record<string, { label: string; className: string }> = {
    minor:    { label: 'Liten skade',    className: 'bg-yellow-50 text-yellow-700' },
    moderate: { label: 'Moderat skade',  className: 'bg-orange-50 text-orange-600' },
    severe:   { label: 'Alvorlig skade', className: 'bg-red-50 text-red-600' },
  }
  const typeMap: Record<string, { label: string; className: string }> = {
    damage:         { label: 'Skade',         className: 'bg-red-50 text-red-600' },
    cleaning:       { label: 'Skitten',        className: 'bg-yellow-50 text-yellow-700' },
    extra_cleaning: { label: 'Ekstra skitten', className: 'bg-orange-50 text-orange-600' },
  }
  const reportType = report.report_type ?? 'damage'
  const t = typeMap[reportType] ?? typeMap['damage']
  const s = severityMap[report.severity] ?? { label: report.severity, className: 'bg-gray-100 text-gray-500' }

  return (
    <div className="px-5 py-4">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2">
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${t.className}`}>
            {t.label}
          </span>
          {reportType === 'damage' && (
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${s.className}`}>
              {s.label}
            </span>
          )}
          <span className="text-xs text-gray-400">
            {report.reported_by === 'admin' ? '🔧 TinyRent' : '👤 Leietaker'}
          </span>
        </div>
        <span className="text-xs text-gray-400 whitespace-nowrap">
          {new Date(report.created_at).toLocaleDateString('nb-NO', {
            day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
          })}
        </span>
      </div>
      <p className="text-sm text-[#2B2B2B]">{report.description}</p>
      {report.amount_charged != null && report.amount_charged > 0 && (
        <p className="text-xs font-semibold text-red-600 mt-1">
          Gebyr: {report.amount_charged} kr
        </p>
      )}
      {report.photo_url && (
        <a
          href={report.photo_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-[#8FA68B] hover:underline mt-1 inline-block"
        >
          📷 Se bilde →
        </a>
      )}
    </div>
  )
}
