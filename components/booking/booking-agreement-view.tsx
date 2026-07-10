'use client'

import { useState } from 'react'

type Props = {
  booking: {
    start_date: string | null
    end_date: string | null
    rental_amount: number | null
    deposit_amount: number | null
    total_amount: number | null
    agreement_accepted_at?: string | null
  }
  productNames: string[]
  customerName?: string
  customerEmail?: string
}

export function BookingAgreementView({ booking, productNames, customerName, customerEmail }: Props) {
  const [expanded, setExpanded] = useState(false)

  const fmt = (d: string) =>
    new Date(d).toLocaleDateString('nb-NO', { day: 'numeric', month: 'long', year: 'numeric' })

  const acceptedAt = booking.agreement_accepted_at
    ? new Date(booking.agreement_accepted_at).toLocaleDateString('nb-NO', {
        day: 'numeric', month: 'long', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
      })
    : null

  return (
    <div className="bg-white rounded-2xl border border-[var(--color-border)] overflow-hidden">
      <div
        className="px-5 pt-5 pb-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors select-none"
        onClick={() => setExpanded(v => !v)}
      >
        <div>
          <p className="text-xs font-bold text-[var(--color-muted)] uppercase tracking-widest">
            Leieavtale
          </p>
          {acceptedAt && (
            <p className="text-xs text-[var(--color-muted)] mt-0.5">Godtatt {acceptedAt}</p>
          )}
        </div>
        <span className="text-xs text-[var(--color-muted)]">{expanded ? 'Skjul ↑' : 'Les ↓'}</span>
      </div>

      {expanded && (
        <div className="border-t border-[var(--color-border)]">
          <div className="px-5 py-5 max-h-96 overflow-y-auto text-xs text-[#444] leading-relaxed space-y-4">

            <section>
              <p className="font-bold text-[#2B2B2B] mb-1">1. Parter</p>
              <p><strong>Utleier:</strong> Sognefest Holding AS (org.nr. 918771719), handelsnavn TinyRent, Bergen</p>
              <p><strong>Leietaker:</strong> {customerName || customerEmail || 'Bekreftet ved innlogging'}{customerName && customerEmail ? ` (${customerEmail})` : ''}</p>
            </section>

            <section>
              <p className="font-bold text-[#2B2B2B] mb-1">2. Leieobjekt</p>
              <ul className="list-disc list-inside space-y-0.5">
                {productNames.map((name, i) => <li key={i}>{name}</li>)}
              </ul>
            </section>

            <section>
              <p className="font-bold text-[#2B2B2B] mb-1">3. Leieperiode og pris</p>
              {booking.start_date && booking.end_date && (
                <p>Leieperiode: {fmt(booking.start_date)} til {fmt(booking.end_date)}</p>
              )}
              {booking.rental_amount != null && <p>Leiebeløp: {booking.rental_amount} kr</p>}
              {booking.deposit_amount != null && booking.deposit_amount > 0 && (
                <p>Depositum: {booking.deposit_amount} kr. Tilbakebetales etter godkjent tilbakelevering.</p>
              )}
              {booking.total_amount != null && (
                <p className="font-semibold text-[#2B2B2B]">Totalt: {booking.total_amount} kr</p>
              )}
            </section>

            <section>
              <p className="font-bold text-[#2B2B2B] mb-1">4. Leietakers ansvar</p>
              <ul className="list-disc list-inside space-y-0.5">
                <li>Utstyret skal behandles med forsiktighet og brukes kun til tiltenkt formål.</li>
                <li>Utstyret skal ikke lånes ut til tredjepart.</li>
                <li>Leietaker er ansvarlig for utstyret fra henting til tilbakelevering.</li>
                <li>Synlige feil ved henting skal meldes til TinyRent innen 24 timer.</li>
              </ul>
            </section>

            <section>
              <p className="font-bold text-[#2B2B2B] mb-1">5. Montering, installasjon og brukerkontroll</p>
              <p className="mb-1">Leietaker er selv ansvarlig for å kontrollere at utstyret er riktig montert og installert før bruk. TinyRent utleverer utstyret funksjonsdyktig, men kan ikke kontrollere montering eller installasjon hos leietaker. Leietaker plikter å lese og følge medfølgende monteringsanvisninger og brukerveiledninger.</p>
              <ul className="list-disc list-inside space-y-0.5 mb-1">
                <li><strong>Bilstoler:</strong> Leietaker skal kontrollere at stolen er korrekt festet i kjøretøyet, at barnet er riktig størrelse for stolen, og at alle spenner og festebeslag er i orden i henhold til produsentens anvisning, før kjøring påbegynnes.</li>
                <li><strong>Sovemøbler og barnesenger:</strong> Monter i henhold til medfølgende anvisning og kontroller at alle låser, skruer og sikkerhetselementer er korrekt festet før bruk.</li>
                <li><strong>Barnevogner og trillestoler:</strong> Kontroller at alle låsemekanismer, brems og sikkerhetsspenner fungerer korrekt ved henting og løpende gjennom leieperioden.</li>
                <li><strong>Øvrig utstyr:</strong> Monter og bruk i samsvar med produsentens anvisninger og gjeldende sikkerhetsforskrifter.</li>
              </ul>
              <p>Feil montering, feil installasjon eller bruk i strid med produsentens anvisninger er leietakers ansvar og risiko.</p>
            </section>

            <section>
              <p className="font-bold text-[#2B2B2B] mb-1">6. Ansvarsfraskrivelse</p>
              <p className="mb-1">TinyRent fraskriver seg ethvert ansvar for person- eller tingskade som oppstår som følge av feil bruk, feil montering, feil installasjon, manglende kontroll eller bruk i strid med produsentens anvisninger.</p>
              <p className="mb-1">TinyRent er ikke ansvarlig for indirekte skader, følgeskader, tapt fortjeneste eller andre tap som oppstår i tilknytning til leieforholdet.</p>
              <p>TinyRents ansvar er i alle tilfeller begrenset til det innbetalte leiebeløpet, eksklusive depositum.</p>
            </section>

            <section>
              <p className="font-bold text-[#2B2B2B] mb-1">7. Skader</p>
              <p>Skade utover normal slitasje er leietakers ansvar og trekkes fra depositumet. Overstiger kostnadene depositumet, faktureres differansen separat.</p>
            </section>

            <section>
              <p className="font-bold text-[#2B2B2B] mb-1">8. Ødeleggelse eller tap</p>
              <p>Leietaker er ansvarlig for erstatning tilsvarende gjeldende nypris.</p>
            </section>

            <section>
              <p className="font-bold text-[#2B2B2B] mb-1">9. Sen tilbakelevering</p>
              <p>Belastes med dagspris per påbegynte dag utover avtalt dato.</p>
            </section>

            <section>
              <p className="font-bold text-[#2B2B2B] mb-1">10. Skitten tilbakelevering</p>
              <p>Standard rengjøring: 200 kr. Ekstra rengjøring: 500 kr. Trekkes fra depositumet.</p>
            </section>

            <section>
              <p className="font-bold text-[#2B2B2B] mb-1">11. Avbestilling</p>
              <p>Mer enn 48 timer før henting: full refusjon. Under 48 timer: leiebeløpet refunderes ikke. Depositum refunderes alltid.</p>
            </section>

            <section>
              <p className="font-bold text-[#2B2B2B] mb-1">12. Tvister</p>
              <p>Klager rettes til hei@tinyrent.no. Uløste tvister behandles ved Bergen tingrett.</p>
            </section>

          </div>
        </div>
      )}
    </div>
  )
}
