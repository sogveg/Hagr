'use client'

import { useState, useMemo } from 'react'
import {
  evaluateCarBenefit,
  FIRMABIL_THRESHOLD_NOK,
  FIRMABIL_RATE_LOW,
  FIRMABIL_RATE_HIGH,
  FIRMABIL_HIGH_USAGE_KM,
} from '@/lib/shared'
import { Car, Lightbulb, ChevronDown, ChevronUp, Info } from 'lucide-react'

function TipBox({ tips }: { tips: string[] }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-xl overflow-hidden mb-6">
      <button onClick={() => setOpen(v => !v)} className="w-full flex items-center justify-between gap-2 px-4 py-3 text-left">
        <span className="flex items-center gap-2 text-amber-800 font-medium text-sm">
          <Lightbulb size={14} className="text-amber-500 shrink-0" strokeWidth={2} />
          Tips og regler
        </span>
        {open ? <ChevronUp size={13} className="text-amber-400" /> : <ChevronDown size={13} className="text-amber-400" />}
      </button>
      {open && (
        <ul className="px-4 pb-4 space-y-2 border-t border-amber-200 pt-3">
          {tips.map((tip, i) => (
            <li key={i} className="text-sm text-amber-800 flex gap-2">
              <span className="shrink-0 mt-0.5 text-amber-400">•</span>
              <span dangerouslySetInnerHTML={{ __html: tip }} />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

const TIPS = [
  `<strong>Progressiv sjablong 2026:</strong> 30% av listepris opp til ${FIRMABIL_THRESHOLD_NOK.toLocaleString('nb-NO')} kr, 20% av overskytende.`,
  '<strong>El-biler behandles likt fossilbiler i 2026</strong> — særrabatten på elbilers listepris er avviklet.',
  `<strong>Bilen eldre enn 3 år per 1. januar?</strong> Grunnlaget settes til 75% av listepris. Er i tillegg yrkeskjøringen over ${FIRMABIL_HIGH_USAGE_KM.toLocaleString('nb-NO')} km, settes grunnlaget til 56,25% (75% × 75%).`,
  '<strong>Disposisjonsretten utløser beskatning</strong> — ikke antall faktisk kjørte private kilometer. Har bilen stått til din private disposisjon, beskattes du av sjablongen uavhengig av privat bruk.',
  '<strong>Varebil klasse 2:</strong> Bunnfradrag på 50% av listepris (maks 150 000 kr) ved dokumentert yrkesbruk og elektronisk kjørebok.',
  'Resultatet er <strong>skattepliktig inntekt</strong> (fordelsbeløpet) — ikke skatten. Gang med din effektive skattesats (~33–47%) for faktisk skattebelastning.',
]

export default function DemoFirmabilPage() {
  const [listPrice, setListPrice] = useState('')
  const [businessKm, setBusinessKm] = useState('')
  const [isOldCar, setIsOldCar] = useState(false)
  const [isVarebil, setIsVarebil] = useState(false)
  const [monthsAvailable, setMonthsAvailable] = useState('12')

  const result = useMemo(() => {
    const lp = parseFloat(listPrice.replace(/\s/g, '').replace(',', '.'))
    if (!lp || lp <= 0) return null
    return evaluateCarBenefit({
      list_price_nok: isOldCar ? lp * 0.75 : lp,
      is_varebil_class2: isVarebil,
      annual_business_km: parseFloat(businessKm) || 0,
      months_available: parseInt(monthsAvailable) || 12,
    })
  }, [listPrice, businessKm, isOldCar, isVarebil, monthsAvailable])

  const lp = parseFloat(listPrice.replace(/\s/g, '').replace(',', '.')) || 0
  const effectiveBasis = isOldCar ? lp * 0.75 : lp

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Car size={22} className="text-violet-600" strokeWidth={2} />
          Firmabilkalkulator
        </h1>
        <p className="text-gray-500 mt-1 text-sm">
          Beregn skattepliktig fordel ved privat disposisjonsrett til firmabil — 2026-satser
        </p>
      </div>

      <TipBox tips={TIPS} />

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Listepris som ny (kr)
          </label>
          <input
            type="text"
            inputMode="numeric"
            placeholder="500 000"
            value={listPrice}
            onChange={e => setListPrice(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
          <p className="text-xs text-gray-400 mt-1">Brukes alltid som grunnlag — uavhengig av innkjøpspris eller alder</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Yrkeskjøring per år (km)
            </label>
            <input
              type="number"
              placeholder="0"
              value={businessKm}
              onChange={e => setBusinessKm(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Måneder til disposisjon
            </label>
            <select
              value={monthsAvailable}
              onChange={e => setMonthsAvailable(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                <option key={m} value={m}>{m} mnd</option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-3">
          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={isOldCar}
              onChange={e => setIsOldCar(e.target.checked)}
              className="mt-0.5 accent-violet-600"
            />
            <div>
              <p className="text-sm font-medium text-gray-700">Bilen er eldre enn 3 år per 1. januar</p>
              <p className="text-xs text-gray-400">Grunnlaget settes til 75% av listepris</p>
            </div>
          </label>
          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={isVarebil}
              onChange={e => setIsVarebil(e.target.checked)}
              className="mt-0.5 accent-violet-600"
            />
            <div>
              <p className="text-sm font-medium text-gray-700">Varebil klasse 2 med elektronisk kjørebok</p>
              <p className="text-xs text-gray-400">Bunnfradrag 50% av listepris, maks 150 000 kr</p>
            </div>
          </label>
        </div>

        {/* Beregningssteg */}
        {lp > 0 && (
          <div className="bg-gray-50 rounded-lg p-4 text-sm space-y-2 border border-gray-100">
            <p className="font-medium text-gray-700 text-xs uppercase tracking-wide mb-2">Beregning</p>
            {isOldCar && (
              <div className="flex justify-between text-gray-500">
                <span>Listepris × 75% (eldre enn 3 år)</span>
                <span>{effectiveBasis.toLocaleString('nb-NO')} kr</span>
              </div>
            )}
            {effectiveBasis <= FIRMABIL_THRESHOLD_NOK ? (
              <div className="flex justify-between text-gray-500">
                <span>{effectiveBasis.toLocaleString('nb-NO')} kr × {(FIRMABIL_RATE_LOW * 100).toFixed(0)}%</span>
                <span>{(effectiveBasis * FIRMABIL_RATE_LOW).toLocaleString('nb-NO')} kr</span>
              </div>
            ) : (
              <>
                <div className="flex justify-between text-gray-500">
                  <span>{FIRMABIL_THRESHOLD_NOK.toLocaleString('nb-NO')} kr × {(FIRMABIL_RATE_LOW * 100).toFixed(0)}%</span>
                  <span>{(FIRMABIL_THRESHOLD_NOK * FIRMABIL_RATE_LOW).toLocaleString('nb-NO')} kr</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>{(effectiveBasis - FIRMABIL_THRESHOLD_NOK).toLocaleString('nb-NO')} kr × {(FIRMABIL_RATE_HIGH * 100).toFixed(0)}%</span>
                  <span>{((effectiveBasis - FIRMABIL_THRESHOLD_NOK) * FIRMABIL_RATE_HIGH).toLocaleString('nb-NO')} kr</span>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {result && (
        <div className="mt-4 bg-white rounded-xl border border-violet-200 shadow-sm p-6">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">Resultat</p>
          <div className="space-y-3">
            {result.flags.map((f, i) => (
              <div key={i} className="flex items-start gap-2 text-xs text-blue-700 bg-blue-50 rounded-lg px-3 py-2 border border-blue-100">
                <Info size={12} className="shrink-0 mt-0.5" />
                {f}
              </div>
            ))}
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm text-gray-500">Skattepliktig fordel per måned</span>
              <span className="font-semibold text-gray-800">{result.monthly_benefit_nok.toLocaleString('nb-NO')} kr</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm font-semibold text-gray-700">Skattepliktig fordel per år</span>
              <span className="text-xl font-bold text-violet-700">{result.annual_benefit_nok.toLocaleString('nb-NO')} kr</span>
            </div>
            <p className="text-xs text-gray-400 flex items-center gap-1">
              <Info size={11} />
              Dette er skattepliktig inntekt — ikke skatten. Gang med din marginale skattesats for faktisk belastning.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
