'use client'

import { useState, useMemo } from 'react'
import { Anchor, Home, Lightbulb, ChevronDown, ChevronUp, AlertTriangle, Info } from 'lucide-react'
import {
  evaluateCabinBoat,
  CABIN_BENEFIT_RATE_PEAK_PER_DAY,
  CABIN_BENEFIT_RATE_OFF_PEAK_PER_DAY,
  BOAT_BENEFIT_RATE_PEAK_PER_DAY,
  type AssetType,
} from '@/lib/shared'

function TipBox({ tips }: { tips: string[] }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50 overflow-hidden mb-6">
      <button onClick={() => setOpen(v => !v)} className="w-full flex items-center justify-between px-4 py-3 text-left">
        <span className="flex items-center gap-2 text-amber-800 font-medium text-sm">
          <Lightbulb size={15} strokeWidth={2.2} /> Tips og regler
        </span>
        {open ? <ChevronUp size={15} className="text-amber-500" /> : <ChevronDown size={15} className="text-amber-500" />}
      </button>
      {open && (
        <div className="px-4 pb-4 space-y-2 border-t border-amber-200">
          {tips.map((t, i) => (
            <p key={i} className="text-sm text-amber-900" dangerouslySetInnerHTML={{ __html: t }} />
          ))}
        </div>
      )}
    </div>
  )
}

const TIPS = [
  `<strong>Standardsatser 2025:</strong> Høysesong (hytte): ${CABIN_BENEFIT_RATE_PEAK_PER_DAY.toLocaleString('nb-NO')} kr/dag, lavsesong: ${CABIN_BENEFIT_RATE_OFF_PEAK_PER_DAY.toLocaleString('nb-NO')} kr/dag. Båt: samme satser i sesong.`,
  '<strong>Faglig innhold er nøkkelen:</strong> Har oppholdet et faglig program (styremøte, kurs, konferanse)? Da kan deler av kostnadene behandles som driftsutgift, ikke privat fordel. Dokumentér programmet nøye.',
  '<strong>Betaler ansatt markedspris?</strong> Da er fordelen eliminert. Markedspris = hva du ville leid for på f.eks. Finn.no. Ta vare på dokumentasjonen.',
  '<strong>A-melding kode 122-A:</strong> Fordelen MÅ innberettes. Unnlatelse er straffbart og kan medføre tilleggsskatt på 20–40%.',
  '<strong>Eier alene = ingen velferdstiltak:</strong> Hytte/båt til eneaksjonær uten ansatte er IKKE en skattefri ytelse — det er uttak. Skatt + AGA på hele beløpet.',
  '<strong>Romjulsopphold:</strong> Romjul (26.–31. des) regnes som høysesong — samme sats som sommeren.',
]

export default function CabinBoatPage() {
  const [assetType, setAssetType] = useState<AssetType>('cabin')
  const [daysUsed, setDaysUsed] = useState('')
  const [isPeakSeason, setIsPeakSeason] = useState(true)
  const [hasBusinessElement, setHasBusinessElement] = useState(false)
  const [employeePaid, setEmployeePaid] = useState('')

  const result = useMemo(() => {
    const days = parseInt(daysUsed)
    if (!days || days <= 0) return null
    return evaluateCabinBoat({
      asset_type: assetType,
      days_used: days,
      is_peak_season: isPeakSeason,
      has_business_element: hasBusinessElement,
      employee_paid_nok: parseFloat(employeePaid) || 0,
    })
  }, [assetType, daysUsed, isPeakSeason, hasBusinessElement, employeePaid])

  const ratePerDay = isPeakSeason
    ? (assetType === 'cabin' ? CABIN_BENEFIT_RATE_PEAK_PER_DAY : BOAT_BENEFIT_RATE_PEAK_PER_DAY)
    : CABIN_BENEFIT_RATE_OFF_PEAK_PER_DAY

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Hytte og båt</h1>
        <p className="text-gray-500 mt-1 text-sm">
          Beregn skattepliktig fordel for ansattes bruk av selskapets fritidseiendommer
        </p>
      </div>

      <TipBox tips={TIPS} />

      <div className="card p-6 space-y-5">
        <h2 className="font-semibold text-gray-900">Bruk av fritidseiendom</h2>

        {/* Asset type */}
        <div>
          <label className="label">Type</label>
          <div className="flex gap-3">
            {([
              { value: 'cabin', label: 'Hytte', icon: Home },
              { value: 'boat', label: 'Båt', icon: Anchor },
            ] as const).map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                onClick={() => setAssetType(value)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                  assetType === value
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                }`}
              >
                <Icon size={15} strokeWidth={2} />
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Antall dager brukt</label>
            <input
              className="input"
              type="number"
              min="1"
              placeholder="5"
              value={daysUsed}
              onChange={e => setDaysUsed(e.target.value)}
            />
          </div>
          <div>
            <label className="label">Betalt leie av ansatt (kr)</label>
            <input
              className="input"
              type="number"
              min="0"
              placeholder="0"
              value={employeePaid}
              onChange={e => setEmployeePaid(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isPeakSeason}
              onChange={e => setIsPeakSeason(e.target.checked)}
              className="w-4 h-4 rounded accent-blue-600"
            />
            <span className="text-sm text-gray-700">
              Høysesong (15. juni – 31. aug, romjul) — {ratePerDay.toLocaleString('nb-NO')} kr/dag
            </span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={hasBusinessElement}
              onChange={e => setHasBusinessElement(e.target.checked)}
              className="w-4 h-4 rounded accent-blue-600"
            />
            <span className="text-sm text-gray-700">
              Oppholdet har faglig innhold (styremøte, kurs, strategisamling)
            </span>
          </label>
        </div>

        {hasBusinessElement && (
          <div className="flex items-start gap-2 text-sm text-blue-800 bg-blue-50 rounded-xl px-4 py-3">
            <Info size={14} className="shrink-0 mt-0.5 text-blue-500" />
            Faglig innhold reduserer den skattepliktige fordelen. Dokumentér program, deltakere og timer. Kontakt regnskapsfører for eksakt fordeling.
          </div>
        )}
      </div>

      {result && (
        <div className="card p-6 mt-5 space-y-4">
          <h2 className="font-semibold text-gray-900">Beregning</h2>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <p className="text-xs text-gray-500 font-medium mb-1">Bruttofordel</p>
              <p className="text-2xl font-bold text-gray-700">{result.gross_benefit_nok.toLocaleString('nb-NO')} kr</p>
              <p className="text-xs text-gray-400 mt-1">{parseInt(daysUsed)} dager × {ratePerDay.toLocaleString('nb-NO')} kr</p>
            </div>
            <div className={`rounded-xl p-4 text-center ${result.net_taxable_nok === 0 ? 'bg-green-50' : 'bg-orange-50'}`}>
              <p className={`text-xs font-medium mb-1 ${result.net_taxable_nok === 0 ? 'text-green-600' : 'text-orange-600'}`}>
                Skattepliktig fordel
              </p>
              <p className={`text-2xl font-bold ${result.net_taxable_nok === 0 ? 'text-green-700' : 'text-orange-700'}`}>
                {result.net_taxable_nok.toLocaleString('nb-NO')} kr
              </p>
            </div>
          </div>

          <div className="space-y-2">
            {result.flags.map((f, i) => (
              <div key={i} className="flex items-start gap-2 text-sm text-amber-800 bg-amber-50 rounded-lg px-3 py-2">
                <AlertTriangle size={13} className="shrink-0 mt-0.5 text-amber-500" />
                {f}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
