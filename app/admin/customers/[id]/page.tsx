export const dynamic = 'force-dynamic'

import { createServiceClient } from '@/lib/supabase-server'
import Link from 'next/link'
import { notFound } from 'next/navigation'

const STATUS_MAP: Record<string, { label: string; className: string }> = {
  draft:           { label: 'Utkast',         className: 'bg-gray-100 text-gray-500' },
  pending_payment: { label: 'Venter betaling', className: 'bg-yellow-50 text-yellow-700' },
  confirmed:       { label: 'Bekreftet',       className: 'bg-blue-50 text-blue-700' },
  prepared:        { label: 'Klar',            className: 'bg-purple-50 text-purple-700' },
  delivered:       { label: 'Levert',          className: 'bg-indigo-50 text-indigo-700' },
  active_rental:   { label: 'Aktiv leie',      className: 'bg-green-50 text-green-700' },
  returned:        { label: 'Returnert',        className: 'bg-gray-50 text-gray-600' },
  completed:       { label: 'Fullført',         className: 'bg-gray-50 text-gray-500' },
  cancelled:       { label: 'Kansellert',       className: 'bg-red-50 text-red-500' },
}

function Field({ label, value }: { label: string; value?: string | null }) {
  return (
    <div>
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">{label}</p>
      <p className="text-sm text-[#2B2B2B]">{value || <span className="text-gray-300">Ikke registrert</span>}</p>
    </div>
  )
}

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('nb-NO', { day: 'numeric', month: 'long', year: 'numeric' })
}

function fmtDateTime(d: string) {
  return new Date(d).toLocaleDateString('nb-NO', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export default async function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = createServiceClient()

  const [
    { data: customer },
    { data: rawBookings },
  ] = await Promise.all([
    supabase.from('customers').select('*').eq('id', id).single(),
    supabase
      .from('bookings')
      .select('id, status, start_date, end_date, total_amount, deposit_amount, created_at')
      .eq('customer_id', id)
      .order('created_at', { ascending: false }),
  ])

  if (!customer) notFound()

  const bookingIds = (rawBookings ?? []).map(b => b.id)

  // Fetch booking items + messages in parallel
  const [bookingItemsResult, messagesResult] = await Promise.all([
    bookingIds.length > 0
      ? supabase
          .from('booking_items')
          .select('booking_id, products(name)')
          .in('booking_id', bookingIds)
      : Promise.resolve({ data: [] }),
    bookingIds.length > 0
      ? (supabase as any)
          .from('booking_messages')
          .select('id, sender, body, created_at, booking_id')
          .in('booking_id', bookingIds)
          .order('created_at', { ascending: false })
      : Promise.resolve({ data: [] }),
  ])

  const allMessages: any[] = messagesResult.data ?? []

  // Merge product names into bookings
  const itemsByBooking = new Map<string, string[]>()
  for (const item of (bookingItemsResult.data ?? []) as any[]) {
    const bid = item.booking_id
    if (!itemsByBooking.has(bid)) itemsByBooking.set(bid, [])
    if (item.products?.name) itemsByBooking.get(bid)!.push(item.products.name)
  }
  const bookings = (rawBookings ?? []).map(b => ({
    ...b,
    productNames: itemsByBooking.get(b.id) ?? [],
  }))

  const fullName = [customer.first_name, customer.last_name].filter(Boolean).join(' ') || customer.email
  const totalSpent = (bookings ?? [])
    .filter(b => ['confirmed', 'prepared', 'delivered', 'active_rental', 'returned', 'completed'].includes(b.status))
    .reduce((s, b) => s + ((b.total_amount ?? 0) - (b.deposit_amount ?? 0)), 0)

  const activeBookings = (bookings ?? []).filter(b =>
    ['confirmed', 'prepared', 'delivered', 'active_rental'].includes(b.status)
  )

  return (
    <div className="p-8 max-w-5xl">

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
        <Link href="/admin/customers" className="hover:text-[#2B2B2B] transition-colors">Kunder</Link>
        <span>/</span>
        <span className="text-[#2B2B2B] font-medium">{fullName}</span>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#2B2B2B] tracking-tight">{fullName}</h1>
          <p className="text-sm text-gray-400 mt-1">
            Kunde siden {fmtDate(customer.created_at)}
          </p>
        </div>
        <div className="flex gap-2">
          <a
            href={`mailto:${customer.email}`}
            className="text-sm font-semibold px-4 py-2 rounded-xl border border-black/10 text-[#2B2B2B] hover:bg-[#F8F7F4] transition-colors"
          >
            Send e-post
          </a>
          {customer.phone && (
            <a
              href={`tel:${customer.phone}`}
              className="text-sm font-semibold px-4 py-2 rounded-xl bg-[#8FA68B] text-white hover:bg-[#7a9176] transition-colors"
            >
              Ring
            </a>
          )}
        </div>
      </div>

      {/* Stat-chips */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-2xl p-5 border border-black/[0.06]">
          <p className="text-2xl font-bold text-[#2B2B2B]">{bookings?.length ?? 0}</p>
          <p className="text-xs text-gray-400 mt-1">Bestillinger totalt</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-black/[0.06]">
          <p className="text-2xl font-bold text-[#2B2B2B]">
            {totalSpent.toLocaleString('nb-NO', { maximumFractionDigits: 0 })} kr
          </p>
          <p className="text-xs text-gray-400 mt-1">Totalt brukt (ekskl. depositum)</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-black/[0.06]">
          <p className="text-2xl font-bold text-[#2B2B2B]">{activeBookings.length}</p>
          <p className="text-xs text-gray-400 mt-1">Aktive leier nå</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_320px] gap-6">

        {/* Left column */}
        <div className="space-y-6">

          {/* Bestillingshistorikk */}
          <div className="bg-white rounded-2xl border border-black/[0.06] overflow-hidden">
            <div className="px-6 py-4 border-b border-black/[0.06]">
              <h2 className="text-base font-bold text-[#2B2B2B]">Bestillinger</h2>
            </div>
            {!bookings?.length ? (
              <div className="px-6 py-10 text-center text-gray-400 text-sm">Ingen bestillinger ennå</div>
            ) : (
              <div className="divide-y divide-black/[0.04]">
                {bookings.map(b => {
                  const s = STATUS_MAP[b.status] ?? { label: b.status, className: 'bg-gray-100 text-gray-500' }
                  const products: string[] = b.productNames
                  return (
                    <Link
                      key={b.id}
                      href={`/admin/bookings/${b.id}`}
                      className="px-6 py-4 flex items-center gap-4 hover:bg-[#F8F7F4] transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="text-sm font-semibold text-[#2B2B2B] truncate">
                            {products.length > 0 ? products.join(', ') : 'Ukjent produkt'}
                          </p>
                          <p className="text-[10px] font-mono text-gray-300 shrink-0">
                            #{b.id.slice(0, 6).toUpperCase()}
                          </p>
                        </div>
                        {b.start_date && b.end_date && (
                          <p className="text-xs text-gray-400">
                            {new Date(b.start_date).toLocaleDateString('nb-NO', { day: 'numeric', month: 'short' })}
                            {' '}&rarr;{' '}
                            {new Date(b.end_date).toLocaleDateString('nb-NO', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </p>
                        )}
                      </div>
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${s.className}`}>
                        {s.label}
                      </span>
                      <p className="text-sm font-semibold text-[#2B2B2B] shrink-0">
                        {b.total_amount?.toLocaleString('nb-NO')} kr
                      </p>
                    </Link>
                  )
                })}
              </div>
            )}
          </div>

          {/* Meldingstråd */}
          {allMessages.length > 0 && (
            <div className="bg-white rounded-2xl border border-black/[0.06] overflow-hidden">
              <div className="px-6 py-4 border-b border-black/[0.06]">
                <h2 className="text-base font-bold text-[#2B2B2B]">Meldingshistorikk</h2>
              </div>
              <div className="divide-y divide-black/[0.04]">
                {allMessages.map((m: any) => (
                  <div key={m.id} className="px-6 py-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        m.sender === 'customer'
                          ? 'bg-blue-50 text-blue-600'
                          : 'bg-[#F0F4EF] text-[#5a7a55]'
                      }`}>
                        {m.sender === 'customer' ? 'Kunde' : 'TinyRent'}
                      </span>
                      <span className="text-xs text-gray-400">{fmtDateTime(m.created_at)}</span>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed mt-1 whitespace-pre-line">{m.body}</p>
                    <Link
                      href={`/admin/bookings/${m.booking_id}`}
                      className="text-[10px] text-[#8FA68B] font-semibold hover:underline mt-1 inline-block"
                    >
                      Booking #{m.booking_id.slice(0, 6).toUpperCase()} &rarr;
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right column: kontaktinfo */}
        <div className="space-y-4">

          {/* Kontaktinformasjon */}
          <div className="bg-white rounded-2xl border border-black/[0.06] p-6">
            <h2 className="text-base font-bold text-[#2B2B2B] mb-5">Kontaktinformasjon</h2>
            <div className="space-y-4">
              <Field label="Fornavn" value={customer.first_name} />
              <Field label="Etternavn" value={customer.last_name} />
              <Field label="E-post" value={customer.email} />
              <Field label="Telefon" value={customer.phone} />
            </div>
          </div>

          {/* Adresse */}
          <div className="bg-white rounded-2xl border border-black/[0.06] p-6">
            <h2 className="text-base font-bold text-[#2B2B2B] mb-5">Adresse</h2>
            <div className="space-y-4">
              <Field label="Adresse" value={customer.address_line1} />
              {customer.address_line2 && (
                <Field label="Adresse 2" value={customer.address_line2} />
              )}
              <div className="grid grid-cols-2 gap-4">
                <Field label="Postnummer" value={customer.postal_code} />
                <Field label="By" value={customer.city} />
              </div>
              <Field label="Land" value={customer.country} />
            </div>
          </div>

          {/* Konto */}
          <div className="bg-white rounded-2xl border border-black/[0.06] p-6">
            <h2 className="text-base font-bold text-[#2B2B2B] mb-5">Konto</h2>
            <div className="space-y-4">
              <Field
                label="Registrert"
                value={fmtDate(customer.created_at)}
              />
              <Field
                label="Sist oppdatert"
                value={fmtDate(customer.updated_at ?? customer.created_at)}
              />
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Innloggingskonto</p>
                <p className="text-sm">
                  {customer.user_id
                    ? <span className="text-green-600 font-medium">Aktiv konto</span>
                    : <span className="text-gray-400">Gjestekunde</span>
                  }
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
