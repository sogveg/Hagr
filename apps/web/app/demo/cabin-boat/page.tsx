'use client'

import { useState, useMemo } from 'react'
import {
  evaluateCabinBoat,
  CABIN_BENEFIT_RATE_PEAK_PER_DAY,
  CABIN_BENEFIT_RATE_OFF_PEAK_PER_DAY,
  BOAT_BENEFIT_RATE_PEAK_PER_DAY,
  type AssetType,
} from '@/lib/shared'
import { Home, Anchor, Lightbulb, ChevronDown, ChevronUp } from 'lucide-react'

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
        <div className="px-4 pb-4 space-y-2 border-t border-amber-200 pt-3">
          {tips.map((t, i) => (
            <p key={i} className="text-sm text-amber-900" dangerouslySetInnerHTML={{ __html: t }} />
          ))}
        </div>
      )}
    </div>
  )
}

const TIPS = [
  `<strong>Standardsatser 2026:</strong> Høysesong (hytte): ${CABIN_BENEFIT_RATE_PEAK_PER_DAY.toLocaleString('nb-NO')} kr/dag, lavsesong: ${CABIN_BENEFIT_RATE_OFF_PEAK_PER_DAY.toLocaleString('nb-NO')} kr/dag. Båt: ${BOAT_BENEFIT_RATE_PEAK_PER_DAY.toLocaleString('nb-NO')} kr/dag i sesong.`,
  '<strong>Faglig innhold er nøkkelen:</strong> Har oppholdet et faglig program (styremøte, kurs, konferanse)? Da kan deler av kostnadene behandles som driftsutgift, ikke privat fordel. Dokumentér programmet nøye.',
  '<strong>Betaler ansatt markedspris?</strong> Da er fordelen eliminert. Markedspris = hva du ville leid for på Finn.no. Ta vare på dokumentasjonen.',
  '<strong>A-melding kode 122-A:</strong> Fordelen MÅ innberettes. Unnlatelse er straffbart.',
  '<strong>Eier alene = ingen velferdstiltak:</strong> Hytte/båt til eneaksjonær uten ansatte er uttak, ikke skattefri ytelse.',
]

export default function DemoCabinBoatPage() {
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
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          {assetType === 'cabin'
            ? <Home size={22} className="text-violet-600" strokeWidth={2} />
            : <Anchor size={22} className="text-violet-600" strokeWidth={2} />}
          Hytte og båt
        </h1>
        <p className="text-gray-500 mt-1 text-sm">
          Beregn skattepliktig fordel for ansattes bruk av selskapets fritidseiendommer
        </p>
      </div>

      <TipBox tips={TIPS} />

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-5">
        {/* Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Type eiendel</label>
          <div className="flex gap-2">
            {(['cabin', 'boat'] as AssetType[]).map(t => (
              <button
                key={t}
                onClick={() => setAssetType(t)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
                  assetType === t
                    ? 'bg-violet-50 border-violet-400 text-violet-700'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                {t === 'cabin' ? <><Home size={14} /> Hytte</> : <><Anchor size={14} /> Båt</>}
              </button>
            ))}
          </div>
        </div>

        {/* Dager */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Antall dager brukt</label>
          <input
            type="number"
            placeholder="f.eks. 7"
            value={daysUsed}
            onChange={e => setDaysUsed(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>

        {/* Sesong */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Sesong</label>
          <div className="flex gap-2">
            {[true, false].map(peak => (
              <button
                key={String(peak)}
                onClick={() => setIsPeakSeason(peak)}
                className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-colors ${
                  isPeakSeason === peak
                    ? 'bg-violet-50 border-violet-400 text-violet-700'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                {peak ? `Høysesong (${ratePerDay.toLocaleString('nb-NO')} kr/dag)` : `Lavsesong (${CABIN_BENEFIT_RATE_OFF_PEAK_PER_DAY.toLocaleString('nb-NO')} kr/dag)`}
              </button>
            ))}
          </div>
        </div>

        {/* Faglig innhold */}
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={hasBusinessElement}
            onChange={e => setHasBusinessElement(e.target.checked)}
            className="mt-0.5 accent-violet-600"
          />
          <div>
            <p className="text-sm font-medium text-gray-700">Faglig innhold (styremøte, konferanse e.l.)</p>
            <p className="text-xs text-gray-400">Reduserer antall beregnede dager noe</p>
          </div>
        </label>

        {/* Betalt av ansatt */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Betalt av ansatt (kr)
          </label>
          <input
            type="number"
            placeholder="0"
            value={employeePaid}
            onChange={e => setEmployeePaid(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
          <p className="text-xs text-gray-400 mt-1">Markedspris eliminerer fordelen helt</p>
        </div>
      </div>

      {result && (
        <div className="mt-4 bg-white rounded-xl border border-violet-200 shadow-sm p-6">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">Resultat</p>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-gray-500">
              <span>Sats per dag</span>
              <span>{ratePerDay.toLocaleString('nb-NO')} kr</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>Brutto fordel</span>
              <span>{result.gross_benefit_nok.toLocaleString('nb-NO')} kr</span>
            </div>
            {result.employee_paid_nok > 0 && (
              <div className="flex justify-between text-gray-500">
                <span>Betalt av ansatt</span>
                <span>− {result.employee_paid_nok.toLocaleString('nb-NO')} kr</span>
              </div>
            )}
            <div className="border-t border-gray-100 my-2" />
            <div className="flex justify-between font-bold text-base">
              <span className="text-gray-800">Skattepliktig fordel</span>
              <span className={result.taxable_benefit_nok > 0 ? 'text-orange-600' : 'text-green-600'}>
                {result.taxable_benefit_nok.toLocaleString('nb-NO')} kr
              </span>
            </div>
            {result.notes.map((n, i) => (
              <p key={i} className="text-xs text-gray-400 mt-1">{n}</p>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
