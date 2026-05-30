export const dynamic = 'force-dynamic'

import { createServiceClient } from '@/lib/supabase-server'
import Link from 'next/link'

const STATUS_COLOR: Record<string, string> = {
  confirmed:     'bg-blue-50 text-blue-700 border-blue-100',
  prepared:      'bg-purple-50 text-purple-700 border-purple-100',
  delivered:     'bg-indigo-50 text-indigo-700 border-indigo-100',
  active_rental: 'bg-green-50 text-green-700 border-green-100',
  returned:      'bg-gray-50 text-gray-600 border-gray-100',
}
const STATUS_LABEL: Record<string, string> = {
  confirmed: 'Bekreftet', prepared: 'Klar', delivered: 'Levert',
  active_rental: 'Aktiv leie', returned: 'Returnert',
}

function addDays(date: Date, n: number) {
  const d = new Date(date)
  d.setDate(d.getDate() + n)
  return d
}

function ymd(d: Date) {
  return d.toISOString().slice(0, 10)
}

function fmtDay(d: Date) {
  return d.toLocaleDateString('nb-NO', { weekday: 'long', day: 'numeric', month: 'long' })
}

export default async function AdminKalender() {
  const supabase = createServiceClient()
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const windowEnd = addDays(today, 13)

  const { data: bookings } = await supabase
    .from('bookings')
    .select('id, start_date, end_date, status, customer_id, location_id')
    .in('status', Object.keys(STATUS_COLOR))
    .or(`start_date.gte.${ymd(today)},end_date.gte.${ymd(today)}`)
    .lte('start_date', ymd(windowEnd))
    .order('start_date')

  const customerIds = [...new Set((bookings ?? []).map(b => b.customer_id).filter(Boolean))]
  const { data: customers } = customerIds.length
    ? await supabase.from('customers').select('id, first_name, last_name, phone').in('id', customerIds as string[])
    : { data: [] }

  const { data: bookingItems } = await supabase
    .from('booking_items')
    .select('booking_id, products(name, brand)')
    .in('booking_id', (bookings ?? []).map(b => b.id))

  const customerMap = new Map((customers ?? []).map(c => [c.id, c]))
  const itemMap     = new Map<string, { name: string; brand: string | null }>()
  for (const item of bookingItems ?? []) {
    if (!item.booking_id) continue
    const p = item.products as any
    itemMap.set(item.booking_id, { name: p?.name ?? 'Ukjent', brand: p?.brand ?? null })
  }

  // Gruppert: hva skjer denne dagen
  const days = Array.from({ length: 14 }, (_, i) => {
    const date     = addDays(today, i)
    const dateStr  = ymd(date)
    const pickups  = (bookings ?? []).filter(b => b.start_date === dateStr)
    const returns  = (bookings ?? []).filter(b => b.end_date   === dateStr)
    const active   = (bookings ?? []).filter(b => b.start_date < dateStr && b.end_date > dateStr)
    return { date, dateStr, pickups, returns, active }
  })

  const todayPickups  = days[0].pickups
  const todayReturns  = days[0].returns
  const hasTodayTasks = todayPickups.length + todayReturns.length > 0

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#2B2B2B] tracking-tight">Kalender</h1>
        <p className="text-sm text-gray-500 mt-1">Neste 14 dager — hentinger og returer</p>
      </div>

      {/* I DAG — fremhevet */}
      <div className={`rounded-2xl border-2 p-5 mb-6 ${hasTodayTasks ? 'border-[#8FA68B] bg-[#8FA68B]/[0.04]' : 'border-black/[0.06] bg-white'}`}>
        <p className="text-xs font-bold text-[#5A7A55] uppercase tracking-widest mb-3">
          I dag — {fmtDay(today)}
        </p>

        {!hasTodayTasks ? (
          <p className="text-sm text-gray-400">Ingen hentinger eller returer i dag</p>
        ) : (
          <div className="space-y-2">
            {todayPickups.map(b => <BookingRow key={b.id} booking={b} type="pickup" customer={customerMap.get(b.customer_id ?? '')} product={itemMap.get(b.id)} />)}
            {todayReturns.map(b => <BookingRow key={b.id} booking={b} type="return" customer={customerMap.get(b.customer_id ?? '')} product={itemMap.get(b.id)} />)}
          </div>
        )}
      </div>

      {/* Resten av 14-dagersvinduet */}
      <div className="space-y-3">
        {days.slice(1).map(({ date, dateStr, pickups, returns, active }) => {
          const hasEvents = pickups.length + returns.length > 0
          if (!hasEvents && active.length === 0) return null
          return (
            <div key={dateStr} className="bg-white rounded-2xl border border-black/[0.06] overflow-hidden">
              <div className={`px-5 py-3 flex items-center justify-between ${hasEvents ? 'bg-[#F0EAE0]' : 'bg-[#F8F7F4]'}`}>
                <p className="text-sm font-bold text-[#2B2B2B]">{fmtDay(date)}</p>
                <div className="flex gap-2">
                  {pickups.length > 0 && (
                    <span className="text-xs font-semibold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                      {pickups.length} henting{pickups.length > 1 ? 'er' : ''}
                    </span>
                  )}
                  {returns.length > 0 && (
                    <span className="text-xs font-semibold bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">
                      {returns.length} retur{returns.length > 1 ? 'er' : ''}
                    </span>
                  )}
                  {active.length > 0 && (
                    <span className="text-xs text-gray-400">
                      {active.length} aktiv{active.length > 1 ? 'e' : ''}
                    </span>
                  )}
                </div>
              </div>
              {hasEvents && (
                <div className="divide-y divide-black/[0.04] px-5 py-2">
                  {pickups.map(b => <BookingRow key={b.id} booking={b} type="pickup" customer={customerMap.get(b.customer_id ?? '')} product={itemMap.get(b.id)} />)}
                  {returns.map(b => <BookingRow key={b.id} booking={b} type="return" customer={customerMap.get(b.customer_id ?? '')} product={itemMap.get(b.id)} />)}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function BookingRow({ booking, type, customer, product }: {
  booking:  any
  type:     'pickup' | 'return'
  customer: any
  product:  { name: string; brand: string | null } | undefined
}) {
  const s = STATUS_COLOR[booking.status] ?? 'bg-gray-50 text-gray-500 border-gray-100'
  return (
    <div className="flex items-center gap-3 py-2">
      <span className={`text-xs font-bold px-2 py-1 rounded-lg border ${type === 'pickup' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-orange-50 text-orange-700 border-orange-100'}`}>
        {type === 'pickup' ? '↓ Henting' : '↑ Retur'}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-[#2B2B2B] truncate">
          {customer ? `${customer.first_name ?? ''} ${customer.last_name ?? ''}`.trim() : '—'}
          {product && <span className="font-normal text-gray-500"> — {product.brand ? `${product.brand} ` : ''}{product.name}</span>}
        </p>
        {customer?.phone && <p className="text-xs text-gray-400">{customer.phone}</p>}
      </div>
      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${s}`}>
        {STATUS_LABEL[booking.status] ?? booking.status}
      </span>
      <Link href={`/admin/bookings/${booking.id}`} className="text-xs text-[#8FA68B] font-semibold hover:underline shrink-0">
        Åpne →
      </Link>
    </div>
  )
}
