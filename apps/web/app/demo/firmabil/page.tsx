'use client'

import { useState, useMemo } from 'react'
import {
  evaluateCarBenefit,
  FIRMABIL_THRESHOLD_NOK,
  FIRMABIL_RATE_LOW,
  FIRMABIL_RATE_HIGH,
  FIRMABIL_HIGH_USAGE_KM,
  DEFAULT_TAX_RATES,
  TAX_RATES_2025,
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

const FINNMARK_FLAT_RATE = 0.185

function getMarginalRate(
  bruttoinntekt: number,
  isFinnmark: boolean,
  rates: typeof DEFAULT_TAX_RATES,
): number {
  const flatRate = isFinnmark ? FINNMARK_FLAT_RATE : rates.flat_tax_rate
  let trinnskatt = 0
  if (bruttoinntekt >= rates.bracket_5_from) trinnskatt = rates.bracket_5_rate
  else if (bruttoinntekt >= rates.bracket_4_from) trinnskatt = rates.bracket_4_rate
  else if (bruttoinntekt >= rates.bracket_3_from) trinnskatt = rates.bracket_3_rate
  else if (bruttoinntekt >= rates.bracket_2_from) trinnskatt = rates.bracket_2_rate
  else if (bruttoinntekt >= rates.bracket_1_from) trinnskatt = rates.bracket_1_rate
  return flatRate + rates.trygdeavgift_rate + trinnskatt
}

const TIPS = [
  `<strong>Progressiv sjablong:</strong> ${(FIRMABIL_RATE_LOW * 100).toFixed(0)}% av listepris opp til ${FIRMABIL_THRESHOLD_NOK.toLocaleString('nb-NO')} kr, ${(FIRMABIL_RATE_HIGH * 100).toFixed(0)}% av overskytende.`,
  '<strong>El-biler behandles likt fossilbiler i 2026</strong> — særrabatten på elbilers listepris er avviklet.',
  `<strong>Bilen eldre enn 3 år per 1. januar?</strong> Grunnlaget settes til 75% av listepris. Med over ${FIRMABIL_HIGH_USAGE_KM.toLocaleString('nb-NO')} km yrkeskjøring i tillegg settes grunnlaget til 56,25% (75% × 75%).`,
  '<strong>Disposisjonsretten utløser beskatning</strong> — ikke antall faktisk kjørte private kilometer.',
  '<strong>Varebil klasse 2:</strong> Bunnfradrag på 50% av listepris (maks 150 000 kr) ved dokumentert yrkesbruk og elektronisk kjørebok.',
  '<strong>Skatteøkningen fordeles over 10,5 måneder</strong> i trekkopplegget — du slipper trekk i feriemåned og halv skatt i desember.',
]

export default function DemoFirmabilPage() {
  const [year, setYear] = useState<'2026' | '2025'>('2026')
  const [bruttoinntekt, setBruttoinntekt] = useState('')
  const [listPrice, setListPrice] = useState('')
  const [monthsAvailable, setMonthsAvailable] = useState('12')
  const [isOldCar, setIsOldCar] = useState(false)
  const [highBusinessKm, setHighBusinessKm] = useState(false)
  const [isFinnmark, setIsFinnmark] = useState(false)
  const [isVarebil, setIsVarebil] = useState(false)

  const rates = year === '2026' ? DEFAULT_TAX_RATES : TAX_RATES_2025

  const result = useMemo(() => {
    const lp = parseFloat(listPrice.replace(/\s/g, '').replace(',', '.'))
    if (!lp || lp <= 0) return null

    const benefit = evaluateCarBenefit({
      list_price_nok: isOldCar ? lp * 0.75 : lp,
      is_varebil_class2: isVarebil,
      annual_business_km: highBusinessKm ? FIRMABIL_HIGH_USAGE_KM : 0,
      months_available: parseInt(monthsAvailable) || 12,
    })

    const brutto = parseFloat(bruttoinntekt.replace(/\s/g, '').replace(',', '.'))
    if (!brutto || brutto <= 0) {
      return { ...benefit, marginalRate: null, annualTaxIncrease: null, monthlyTaxIncrease: null }
    }

    const marginalRate = getMarginalRate(brutto, isFinnmark, rates)
    const annualTaxIncrease = Math.round(benefit.annual_benefit_nok * marginalRate)
    const monthlyTaxIncrease = Math.round(annualTaxIncrease / 10.5)

    return { ...benefit, marginalRate, annualTaxIncrease, monthlyTaxIncrease }
  }, [listPrice, bruttoinntekt, isOldCar, isVarebil, highBusinessKm, monthsAvailable, isFinnmark, rates])

  const lp = parseFloat(listPrice.replace(/\s/g, '').replace(',', '.')) || 0
  const effectiveBasis = isOldCar ? lp * 0.75 : lp

  const inputClass = 'w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500'

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Car size={22} className="text-violet-600" strokeWidth={2} />
            Firmabilkalkulator
          </h1>
          <select
            value={year}
            onChange={e => setYear(e.target.value as '2026' | '2025')}
            className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-violet-500"
          >
            <option value="2026">2026</option>
            <option value="2025">2025</option>
          </select>
        </div>
        <p className="text-gray-500 mt-1 text-sm">
          Beregn skattepliktig fordel og faktisk skatteøkning ved privat disposisjonsrett til firmabil
        </p>
      </div>

      <TipBox tips={TIPS} />

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Bruttoinntekt (kr/år)</label>
          <input
            type="text"
            inputMode="numeric"
            placeholder="700 000"
            value={bruttoinntekt}
            onChange={e => setBruttoinntekt(e.target.value)}
            className={inputClass}
          />
          <p className="text-xs text-gray-400 mt-1">Brukes for å beregne marginal skattesats og faktisk skatteøkning</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Listepris som ny (kr)</label>
          <input
            type="text"
            inputMode="numeric"
            placeholder="500 000"
            value={listPrice}
            onChange={e => setListPrice(e.target.value)}
            className={inputClass}
          />
          <p className="text-xs text-gray-400 mt-1">Brukes alltid som grunnlag — uavhengig av innkjøpspris eller alder</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Måneder til disposisjon</label>
          <select
            value={monthsAvailable}
            onChange={e => setMonthsAvailable(e.target.value)}
            className={inputClass}
          >
            {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
              <option key={m} value={m}>{m} mnd</option>
            ))}
          </select>
        </div>

        <div className="space-y-3">
          <label className="flex items-start gap-3 cursor-pointer">
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
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={highBusinessKm}
              onChange={e => setHighBusinessKm(e.target.checked)}
              className="mt-0.5 accent-violet-600"
            />
            <div>
              <p className="text-sm font-medium text-gray-700">Over {FIRMABIL_HIGH_USAGE_KM.toLocaleString('nb-NO')} km yrkeskjøring per år</p>
              <p className="text-xs text-gray-400">Fordelen reduseres til 75% — krever elektronisk kjørebok</p>
            </div>
          </label>
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={isFinnmark}
              onChange={e => setIsFinnmark(e.target.checked)}
              className="mt-0.5 accent-violet-600"
            />
            <div>
              <p className="text-sm font-medium text-gray-700">Finnmark / Nord-Troms (tiltakssone)</p>
              <p className="text-xs text-gray-400">Flat skattesats 18,5% i stedet for 22%</p>
            </div>
          </label>
          <label className="flex items-start gap-3 cursor-pointer">
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

        {lp > 0 && (
          <div className="bg-gray-50 rounded-lg p-4 text-sm space-y-2 border border-gray-100">
            <p className="font-medium text-gray-700 text-xs uppercase tracking-wide mb-2">Beregning av inntektstillegg</p>
            {isOldCar && (
              <div className="flex justify-between text-gray-500">
                <span>Listepris × 75% (eldre enn 3 år)</span>
                <span>{Math.round(effectiveBasis).toLocaleString('nb-NO')} kr</span>
              </div>
            )}
            {effectiveBasis <= FIRMABIL_THRESHOLD_NOK ? (
              <div className="flex justify-between text-gray-500">
                <span>{Math.round(effectiveBasis).toLocaleString('nb-NO')} kr × {(FIRMABIL_RATE_LOW * 100).toFixed(0)}%</span>
                <span>{Math.round(effectiveBasis * FIRMABIL_RATE_LOW).toLocaleString('nb-NO')} kr</span>
              </div>
            ) : (
              <>
                <div className="flex justify-between text-gray-500">
                  <span>{FIRMABIL_THRESHOLD_NOK.toLocaleString('nb-NO')} kr × {(FIRMABIL_RATE_LOW * 100).toFixed(0)}%</span>
                  <span>{Math.round(FIRMABIL_THRESHOLD_NOK * FIRMABIL_RATE_LOW).toLocaleString('nb-NO')} kr</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>{Math.round(effectiveBasis - FIRMABIL_THRESHOLD_NOK).toLocaleString('nb-NO')} kr × {(FIRMABIL_RATE_HIGH * 100).toFixed(0)}%</span>
                  <span>{Math.round((effectiveBasis - FIRMABIL_THRESHOLD_NOK) * FIRMABIL_RATE_HIGH).toLocaleString('nb-NO')} kr</span>
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
              <span className="text-sm text-gray-500">Inntektstillegg (skattepliktig fordel)</span>
              <span className="font-semibold text-gray-800">{result.annual_benefit_nok.toLocaleString('nb-NO')} kr/år</span>
            </div>
            {result.marginalRate !== null && result.annualTaxIncrease !== null && result.monthlyTaxIncrease !== null ? (
              <>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <div>
                    <span className="text-sm text-gray-500">Marginal skattesats</span>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {((isFinnmark ? FINNMARK_FLAT_RATE : rates.flat_tax_rate) * 100).toFixed(1)}% flat
                      + {(rates.trygdeavgift_rate * 100).toFixed(1)}% trygd
                      + trinnskatt
                    </p>
                  </div>
                  <span className="font-semibold text-gray-800">{(result.marginalRate * 100).toFixed(1)}%</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm font-semibold text-gray-700">Økning i skatt per år</span>
                  <span className="text-xl font-bold text-violet-700">{result.annualTaxIncrease.toLocaleString('nb-NO')} kr</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <div>
                    <span className="text-sm font-semibold text-gray-700">Skatt per måned</span>
                    <p className="text-xs text-gray-400 mt-0.5">Fordelt over 10,5 mnd (uten ferie + halv skatt des.)</p>
                  </div>
                  <span className="text-xl font-bold text-violet-700">{result.monthlyTaxIncrease.toLocaleString('nb-NO')} kr</span>
                </div>
              </>
            ) : (
              <>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm font-semibold text-gray-700">Skattepliktig fordel per år</span>
                  <span className="text-xl font-bold text-violet-700">{result.annual_benefit_nok.toLocaleString('nb-NO')} kr</span>
                </div>
                <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                  <Info size={11} />
                  Oppgi bruttoinntekt for å beregne faktisk skatteøkning og månedlig trekk
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
