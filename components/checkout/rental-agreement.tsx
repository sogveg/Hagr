'use client'

import { useState } from 'react'
import type { CartRental, CartAccessory } from '@/context/cart-context'
import { calcRentalPrice } from '@/context/cart-context'
import { DELIVERY_FEE } from '@/lib/pricing'

type Props = {
  rentals:      CartRental[]
  accessories:  CartAccessory[]
  depositTotal: number
  grandTotal:   number
  checked:      boolean
  onChange:     (v: boolean) => void
}

export function RentalAgreement({ rentals, accessories, depositTotal, grandTotal, checked, onChange }: Props) {
  const [expanded, setExpanded] = useState(false)

  const fmt = (d: string) =>
    new Date(d).toLocaleDateString('nb-NO', { day: 'numeric', month: 'long', year: 'numeric' })

  const allStarts   = rentals.map(r => r.startDate).sort()
  const allEnds     = rentals.map(r => r.endDate).sort()
  const startDate   = allStarts[0]
  const endDate     = allEnds[allEnds.length - 1]
  const rentalTotal = rentals.reduce((sum, r) => {
    const p = calcRentalPrice(r.startDate, r.endDate, r.priceDay, r.priceWeek, r.priceMonth)
    return sum + (p?.total ?? 0)
  }, 0)
  const accessoryTotal = accessories.reduce((s, a) => s + a.price * a.quantity, 0)

  return (
    <div className="bg-white rounded-2xl border border-black/[0.06] overflow-hidden">

      {/* Header */}
      <div
        className="px-6 py-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors select-none"
        onClick={() => setExpanded(v => !v)}
      >
        <h2 className="text-sm font-bold text-[var(--color-foreground)]">Leieavtale</h2>
        <span className="text-xs text-[var(--color-muted)]">{expanded ? 'Skjul' : 'Les avtalen'} {expanded ? '↑' : '↓'}</span>
      </div>

      {/* Agreement text */}
      {expanded && (
        <div className="border-t border-black/[0.04]">
          <div className="px-6 py-5 max-h-80 overflow-y-auto text-xs text-[#444] leading-relaxed space-y-4">

            <section>
              <p className="font-bold text-[#2B2B2B] mb-1">1. Parter</p>
              <p><strong>Utleier:</strong> Sognefest Holding AS (org.nr. 918771719), handelsnavn TinyRent, Bergen</p>
              <p><strong>Leietaker:</strong> Deg, bekreftet ved innlogging. Navn og kontaktinfo fremgår av kundeprofilen knyttet til bestillingen.</p>
            </section>

            <section>
              <p className="font-bold text-[#2B2B2B] mb-1">2. Leieobjekt</p>
              <ul className="list-disc list-inside space-y-0.5">
                {rentals.map(r => (
                  <li key={r.cartId}>
                    {r.productName}
                    {' '}({fmt(r.startDate)} til {fmt(r.endDate)})
                  </li>
                ))}
                {accessories.filter(a => a.quantity > 0).map(a => (
                  <li key={a.id}>{a.name} x{a.quantity}</li>
                ))}
              </ul>
            </section>

            <section>
              <p className="font-bold text-[#2B2B2B] mb-1">3. Leieperiode og pris</p>
              <p>Leieperiode: {startDate ? fmt(startDate) : ''} til {endDate ? fmt(endDate) : ''}</p>
              <p>Leiebeløp: {rentalTotal + accessoryTotal} kr</p>
              {depositTotal > 0 && (
                <p>Depositum: {depositTotal} kr. Tilbakebetales etter godkjent tilbakelevering uten skader eller merknader.</p>
              )}
              <p>Leveringsgebyr: {DELIVERY_FEE} kr</p>
              <p className="font-semibold text-[#2B2B2B]">Totalt: {grandTotal} kr</p>
            </section>

            <section>
              <p className="font-bold text-[#2B2B2B] mb-1">4. Leietakers ansvar</p>
              <ul className="list-disc list-inside space-y-0.5">
                <li>Utstyret skal behandles med forsiktighet og brukes kun til tiltenkt formål.</li>
                <li>Utstyret skal ikke lånes ut til tredjepart.</li>
                <li>Leietaker er ansvarlig for utstyret fra henting til tilbakelevering.</li>
                <li>Utstyret skal lagres forsvarlig og beskyttes mot vær, fuktighet og fall.</li>
                <li>Synlige feil eller mangler ved henting skal meldes til TinyRent innen 24 timer.</li>
              </ul>
            </section>

            <section>
              <p className="font-bold text-[#2B2B2B] mb-1">5. Skader</p>
              <p>
                Skade som oppstår utover normal slitasje er leietakers ansvar. Kostnader for reparasjon
                trekkes fra depositumet. Overstiger kostnadene depositumet, faktureres differansen separat.
                TinyRent forbeholder seg retten til å innhente uavhengig prisanslag.
              </p>
            </section>

            <section>
              <p className="font-bold text-[#2B2B2B] mb-1">6. Ødeleggelse eller tap</p>
              <p>
                Dersom utstyr ødelegges fullstendig eller mistes, er leietaker ansvarlig for erstatning
                tilsvarende gjeldende nypris. TinyRent varsler leietaker skriftlig om beløpet.
              </p>
            </section>

            <section>
              <p className="font-bold text-[#2B2B2B] mb-1">7. Sen tilbakelevering</p>
              <p>
                Utstyr som leveres tilbake etter avtalt dato belastes med dagspris per påbegynte dag,
                i henhold til produktets gjeldende dagspris. TinyRent forbeholder seg retten til å
                kreve kompensasjon for tapte leieinntekter dersom annet er booket.
              </p>
            </section>

            <section>
              <p className="font-bold text-[#2B2B2B] mb-1">8. Skitten tilbakelevering</p>
              <p>
                Utstyr skal returneres i tilsvarende stand som ved utlevering, med unntak av normal
                bruksslitasje. Utstyr som krever rengjøring utover standard etterarbeid belastes med:
              </p>
              <ul className="list-disc list-inside mt-1 space-y-0.5">
                <li>Standard rengjøring: 200 kr</li>
                <li>Ekstra rengjøring (matflekkete, ekstra skitne trekk e.l.): 500 kr</li>
              </ul>
              <p className="mt-1">Rengjøringsgebyr trekkes fra depositumet.</p>
            </section>

            <section>
              <p className="font-bold text-[#2B2B2B] mb-1">9. Avbestilling</p>
              <p>
                Avbestilling mer enn 48 timer før avtalt henting: full refusjon.
                Avbestilling under 48 timer: leiebeløpet refunderes ikke. Depositum refunderes alltid.
              </p>
            </section>

            <section>
              <p className="font-bold text-[#2B2B2B] mb-1">10. Reklamasjon og tvister</p>
              <p>
                Eventuelle klager rettes skriftlig til hei@tinyrent.no. Tvister søkes løst i minnelighet.
                Kan partene ikke bli enige, behandles saken ved Bergen tingrett etter norsk rett.
              </p>
            </section>

          </div>
        </div>
      )}

      {/* Checkbox */}
      <div className={`px-6 py-4 border-t border-black/[0.04] bg-[#F8F7F4] ${!expanded ? '' : ''}`}>
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={checked}
            onChange={e => onChange(e.target.checked)}
            className="mt-0.5 w-4 h-4 accent-[#4A6741] cursor-pointer"
          />
          <span className="text-sm text-[var(--color-foreground)] leading-snug">
            Jeg bekrefter at jeg har lest og godtar leieavtalen
          </span>
        </label>
      </div>

    </div>
  )
}
