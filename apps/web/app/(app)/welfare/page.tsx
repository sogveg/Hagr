'use client'

import { useState, useMemo } from 'react'
import { Heart, Lightbulb, ChevronDown, ChevronUp, AlertTriangle, CheckCircle, ShieldCheck, ShieldX, ShieldAlert } from 'lucide-react'
import {
  evaluateWelfare,
  WELFARE_TYPE_LABELS,
  WELFARE_RECOMMENDED_LIMIT_PER_EMPLOYEE,
  type WelfareType,
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
  `<strong>Ingen lovfestet grense, men ca. ${WELFARE_RECOMMENDED_LIMIT_PER_EMPLOYEE.toLocaleString('nb-NO')} kr/ansatt/år</strong> er Skatteetatens veiledende grense for hva som anses "rimelig". Over dette kan fordelen bli skattepliktig lønn.`,
  '<strong>Gjelder for ALLE ansatte:</strong> Velferdstiltak er kun skattefritt når det tilbys alle ansatte (eller alle i en hel avdeling/gruppe). Særbehandling av eier alene = lønn.',
  '<strong>Julebord-trikset:</strong> Spis og drikk med måte. Mat + drikke over 560 kr per person kan anses som representasjon, ikke velferd. Under 560 kr per person er trygt.',
  '<strong>Ektefeller er OK:</strong> Å ta med ektefelle/samboer på julebord eller sommerfest er akseptert — men det teller i totalkostnaden per ansatt.',
  '<strong>Eneaksjonær = risiko:</strong> Har du AS uten ansatte? Julebord, teambuilding og sommerfest for deg alene er uttak — beskattes som utbytte pluss AGA.',
  '<strong>Dokumentér alltid:</strong> Hvem var med, hva var formålet, hva kostet det? To linjer i et regneark holder i mange år hvis du noen gang får spørsmål.',
  '<strong>Trening og helse:</strong> Bedriftshytte/treningsstudio: skattefritt hvis alle kan bruke det. Men kontanttilskudd til privat treningssenter (uten egen treningsrom) = skattepliktig (gjelder fra 2024).',
]

function RiskBadge({ level }: { level: 'green' | 'yellow' | 'red' }) {
  if (level === 'green') return (
    <span className="inline-flex items-center gap-1 text-sm font-semibold text-green-700">
      <ShieldCheck size={15} strokeWidth={2} /> Lav risiko
    </span>
  )
  if (level === 'yellow') return (
    <span className="inline-flex items-center gap-1 text-sm font-semibold text-yellow-700">
      <ShieldAlert size={15} strokeWidth={2} /> Moderat risiko
    </span>
  )
  return (
    <span className="inline-flex items-center gap-1 text-sm font-semibold text-red-700">
      <ShieldX size={15} strokeWidth={2} /> Høy risiko
    </span>
  )
}

export default function WelfarePage() {
  const [welfareType, setWelfareType] = useState<WelfareType>('christmas_party')
  const [totalCost, setTotalCost] = useState('')
  const [employeeCount, setEmployeeCount] = useState('')
  const [spousesIncluded, setSpousesIncluded] = useState(false)
  const [isForAll, setIsForAll] = useState(true)
  const [hasPrivateElement, setHasPrivateElement] = useState(false)

  const result = useMemo(() => {
    const cost = parseFloat(totalCost.replace(/\s/g, ''))
    const count = parseInt(employeeCount)
    if (!cost || cost <= 0) return null
    return evaluateWelfare({
      welfare_type: welfareType,
      total_cost_nok: cost,
      employee_count: count || 1,
      spouses_included: spousesIncluded,
      is_for_all_employees: isForAll,
      has_substantial_private_element: hasPrivateElement,
    })
  }, [welfareType, totalCost, employeeCount, spousesIncluded, isForAll, hasPrivateElement])

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Velferdstiltak</h1>
        <p className="text-gray-500 mt-1 text-sm">
          Sjekk om julebord, teambuilding og andre tiltak er skattefrie for ansatte
        </p>
      </div>

      <TipBox tips={TIPS} />

      <div className="card p-6 space-y-5">
        <h2 className="font-semibold text-gray-900">Registrer velferdstiltak</h2>

        <div>
          <label className="label">Type tiltak</label>
          <select className="input" value={welfareType} onChange={e => setWelfareType(e.target.value as WelfareType)}>
            {(Object.entries(WELFARE_TYPE_LABELS) as [WelfareType, string][]).map(([v, l]) => (
              <option key={v} value={v}>{l}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Total kostnad (kr)</label>
            <input
              className="input"
              placeholder="25 000"
              value={totalCost}
              onChange={e => setTotalCost(e.target.value)}
            />
          </div>
          <div>
            <label className="label">Antall ansatte</label>
            <input
              className="input"
              type="number"
              min="1"
              placeholder="5"
              value={employeeCount}
              onChange={e => setEmployeeCount(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isForAll}
              onChange={e => setIsForAll(e.target.checked)}
              className="w-4 h-4 rounded accent-blue-600"
            />
            <span className="text-sm text-gray-700">Tiltaket gjelder alle ansatte (eller hele avdelinger)</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={spousesIncluded}
              onChange={e => setSpousesIncluded(e.target.checked)}
              className="w-4 h-4 rounded accent-blue-600"
            />
            <span className="text-sm text-gray-700">Ektefeller/samboere er inkludert</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={hasPrivateElement}
              onChange={e => setHasPrivateElement(e.target.checked)}
              className="w-4 h-4 rounded accent-yellow-500"
            />
            <span className="text-sm text-gray-700">Vesentlig privat element (eks. reise til utlandet, konsert etc.)</span>
          </label>
        </div>
      </div>

      {result && (
        <div className="card p-6 mt-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Vurdering</h2>
            <RiskBadge level={result.risk_level} />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-xl p-4 text-center">
              <p className="text-xs text-blue-600 font-medium mb-1">Per ansatt</p>
              <p className="text-xl font-bold text-blue-700">{result.cost_per_employee_nok.toLocaleString('nb-NO')} kr</p>
              <p className="text-xs text-blue-400 mt-1">av {WELFARE_RECOMMENDED_LIMIT_PER_EMPLOYEE.toLocaleString('nb-NO')} kr grense</p>
            </div>
            <div className={`rounded-xl p-4 text-center ${result.is_tax_free_for_employees ? 'bg-green-50' : 'bg-red-50'}`}>
              <p className={`text-xs font-medium mb-1 ${result.is_tax_free_for_employees ? 'text-green-600' : 'text-red-600'}`}>
                For ansatte
              </p>
              <p className={`text-sm font-bold ${result.is_tax_free_for_employees ? 'text-green-700' : 'text-red-700'}`}>
                {result.is_tax_free_for_employees ? 'Skattefritt' : 'Skattepliktig'}
              </p>
            </div>
            <div className={`rounded-xl p-4 text-center ${result.is_deductible_for_company ? 'bg-green-50' : 'bg-red-50'}`}>
              <p className={`text-xs font-medium mb-1 ${result.is_deductible_for_company ? 'text-green-600' : 'text-red-600'}`}>
                For selskapet
              </p>
              <p className={`text-sm font-bold ${result.is_deductible_for_company ? 'text-green-700' : 'text-red-700'}`}>
                {result.is_deductible_for_company ? 'Fradragsberettiget' : 'Ikke fradragsberettiget'}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            {result.flags.map((f, i) => (
              <div key={i} className={`flex items-start gap-2 text-sm rounded-lg px-3 py-2 ${
                result.risk_level === 'red'
                  ? 'text-red-800 bg-red-50'
                  : result.risk_level === 'yellow'
                    ? 'text-amber-800 bg-amber-50'
                    : 'text-green-800 bg-green-50'
              }`}>
                {result.risk_level === 'green'
                  ? <CheckCircle size={13} className="shrink-0 mt-0.5 text-green-600" />
                  : <AlertTriangle size={13} className="shrink-0 mt-0.5" />
                }
                {f}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Static guide */}
      <div className="card p-6 mt-5">
        <div className="flex items-center gap-2 mb-4">
          <Heart size={16} className="text-rose-400" strokeWidth={2} />
          <h2 className="font-semibold text-gray-900">Populære velferdstiltak og grenser</h2>
        </div>
        <div className="space-y-3">
          {[
            { name: 'Julebord', limit: 'Ca. 1 200–1 500 kr/person er normalt OK', safe: true },
            { name: 'Sommerfest', limit: 'Ca. 800–1 000 kr/person', safe: true },
            { name: 'Teambuilding/kurs', limit: 'Rimelig — faglig innhold styrker fradragsrett', safe: true },
            { name: 'Treningssenter (bedriftsabonnement)', limit: 'OK hvis alle ansatte kan bruke det', safe: true },
            { name: 'Kontanttilskudd til privat treningssenter', limit: 'Skattepliktig fra 2024', safe: false },
            { name: 'Utenlandsreise uten faglig formål', limit: 'Høy risiko — nesten alltid skattepliktig', safe: false },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3 text-sm">
              {item.safe
                ? <CheckCircle size={14} className="text-green-500 shrink-0 mt-0.5" strokeWidth={2} />
                : <AlertTriangle size={14} className="text-red-500 shrink-0 mt-0.5" strokeWidth={2} />
              }
              <div>
                <span className="font-medium text-gray-800">{item.name}: </span>
                <span className="text-gray-500">{item.limit}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
