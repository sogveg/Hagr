'use client'

import { useState, useMemo } from 'react'
import { evaluateRepresentation, REPRESENTATION_LIMIT_PER_PERSON_NOK } from '@/lib/shared'
import { UtensilsCrossed, Lightbulb, ChevronDown, ChevronUp, CheckCircle, AlertTriangle } from 'lucide-react'

function TipBox({ tips }: { tips: string[] }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="bg-amber-50 border border-amber-100 rounded-xl overflow-hidden mb-6">
      <button onClick={() => setOpen(v => !v)} className="w-full flex items-center justify-between gap-2 px-4 py-3 text-left">
        <span className="flex items-center gap-2 text-amber-800 font-medium text-sm">
          <Lightbulb size={14} className="text-amber-500 shrink-0" strokeWidth={2} />
          Tips og regler
        </span>
        {open ? <ChevronUp size={13} className="text-amber-400" /> : <ChevronDown size={13} className="text-amber-400" />}
      </button>
      {open && (
        <ul className="px-4 pb-4 space-y-2 border-t border-amber-100 pt-3">
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
  `<strong>Beløpsgrensen 2026: ${REPRESENTATION_LIMIT_PER_PERSON_NOK} kr per person eks. mva for middag/servering.</strong> Overskrides grensen faller <em>hele</em> fradraget bort — ikke bare overskytende.`,
  '<strong>Lunsj i arbeidstid</strong> med ekstern part er fullt fradragsberettiget uten beløpsgrense.',
  '<strong>Det MÅ være en ekstern part</strong> — kun interne ansatte = velferdstiltak, ikke representasjon.',
  '<strong>Brennevin/sprit:</strong> Nullstiller hele fradraget. Øl og vin: OK, men alle øvrige vilkår for enkel servering må likevel være oppfylt.',
  'Dokumentasjonskrav: dato, sted, <strong>alle deltakere med navn og selskap</strong>, forretningsmessig formål. Mangel = avvist fradrag.',
]

type RepType = 'dinner' | 'lunch' | 'coffee'
const REP_LABELS: Record<RepType, string> = {
  dinner: 'Middag/kveldsmåltid',
  lunch: 'Lunsj i arbeidstid',
  coffee: 'Kaffe/enkel bevertning',
}

export default function DemoRepresentationPage() {
  const [repType, setRepType] = useState<RepType>('dinner')
  const [totalCost, setTotalCost] = useState('')
  const [numPersons, setNumPersons] = useState('2')
  const [hasSpirits, setHasSpirits] = useState(false)
  const [hasExternalGuest, setHasExternalGuest] = useState(true)

  const persons = parseInt(numPersons) || 1
  const total = parseFloat(totalCost.replace(/\s/g, '').replace(',', '.')) || 0
  const perPerson = persons > 0 ? total / persons : 0

  const result = useMemo(() => {
    if (!total || total <= 0) return null
    return evaluateRepresentation({
      rep_type: repType,
      amount_nok: total,
      person_count: persons,
      includes_alcohol: hasSpirits,
      has_external_participant: hasExternalGuest,
      during_work_hours: repType === 'lunch',
      purpose: 'demo',
    })
  }, [repType, total, persons, hasSpirits, hasExternalGuest])

  const isOverLimit = repType === 'dinner' && perPerson > REPRESENTATION_LIMIT_PER_PERSON_NOK

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <UtensilsCrossed size={22} className="text-violet-600" strokeWidth={2} />
          Representasjonskalkulator
        </h1>
        <p className="text-gray-500 mt-1 text-sm">
          Sjekk fradragsrett for kundemiddager og servering — 2026-regler
        </p>
      </div>

      <TipBox tips={TIPS} />

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-5">
        {/* Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Type arrangement</label>
          <div className="flex flex-col gap-2">
            {(Object.keys(REP_LABELS) as RepType[]).map(t => (
              <button
                key={t}
                onClick={() => setRepType(t)}
                className={`px-4 py-2.5 rounded-lg border text-sm font-medium text-left transition-colors ${
                  repType === t
                    ? 'bg-violet-50 border-violet-400 text-violet-700'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                {REP_LABELS[t]}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Total kostnad (kr eks. mva)</label>
            <input
              type="text"
              inputMode="numeric"
              placeholder="1 500"
              value={totalCost}
              onChange={e => setTotalCost(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Antall personer</label>
            <input
              type="number"
              min="1"
              value={numPersons}
              onChange={e => setNumPersons(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>
        </div>

        {total > 0 && persons > 0 && (
          <div className={`flex items-center justify-between rounded-lg px-4 py-2.5 text-sm font-medium border ${
            isOverLimit
              ? 'bg-red-50 border-red-200 text-red-700'
              : 'bg-green-50 border-green-200 text-green-700'
          }`}>
            <span>Kostnad per person</span>
            <span className="font-bold">
              {perPerson.toLocaleString('nb-NO', { maximumFractionDigits: 0 })} kr
              {repType === 'dinner' && ` (grense: ${REPRESENTATION_LIMIT_PER_PERSON_NOK} kr)`}
            </span>
          </div>
        )}

        <div className="space-y-3">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={hasSpirits}
              onChange={e => setHasSpirits(e.target.checked)}
              className="mt-0.5 accent-violet-600"
            />
            <div>
              <p className="text-sm font-medium text-gray-700">Brennevin/sprit ble servert</p>
              <p className="text-xs text-red-500">Nullstiller hele fradraget</p>
            </div>
          </label>
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={hasExternalGuest}
              onChange={e => setHasExternalGuest(e.target.checked)}
              className="mt-0.5 accent-violet-600"
            />
            <div>
              <p className="text-sm font-medium text-gray-700">Ekstern part til stede (kunde/leverandør)</p>
              <p className="text-xs text-gray-400">Krav for representasjonsfradrag</p>
            </div>
          </label>
        </div>
      </div>

      {result && (
        <div className={`mt-4 bg-white rounded-xl border shadow-sm p-6 ${
          result.deductible_amount > 0 ? 'border-green-200' : 'border-red-200'
        }`}>
          <div className="flex items-center gap-2 mb-4">
            {result.deductible_amount > 0
              ? <CheckCircle size={18} className="text-green-600" />
              : <AlertTriangle size={18} className="text-red-500" />}
            <span className={`font-semibold text-sm ${result.deductible_amount > 0 ? 'text-green-700' : 'text-red-600'}`}>
              {result.deductible_amount > 0 ? 'Fradragsberettiget' : 'Ikke fradragsberettiget'}
            </span>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-gray-500">
              <span>Total kostnad</span>
              <span>{total.toLocaleString('nb-NO')} kr</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>Ikke fradragsberettiget</span>
              <span>{result.non_deductible_amount.toLocaleString('nb-NO')} kr</span>
            </div>
            <div className="flex justify-between font-bold text-base border-t border-gray-100 pt-2 mt-2">
              <span className="text-gray-800">Fradragsberettiget beløp</span>
              <span className={result.deductible_amount > 0 ? 'text-green-600' : 'text-red-600'}>
                {result.deductible_amount.toLocaleString('nb-NO')} kr
              </span>
            </div>
            {result.flags.map((n, i) => (
              <p key={i} className="text-xs text-gray-500 mt-1 flex gap-1">
                <span className="shrink-0">•</span>{n}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
