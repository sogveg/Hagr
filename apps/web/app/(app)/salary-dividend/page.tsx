'use client'

import { useState } from 'react'
import {
  calculateSalaryDividend,
  AGA_RATES,
  type SalaryDividendScenario,
} from '@/lib/shared'
import { TrendingUp, Lightbulb, ChevronDown, ChevronUp, AlertTriangle, Info } from 'lucide-react'

function TipBox({ tips }: { tips: string[] }) {
  const [open, setOpen] = useState(true)
  return (
    <div className="bg-amber-50 border border-amber-100 rounded-lg overflow-hidden mb-6">
      <button onClick={() => setOpen(v => !v)} className="w-full flex items-center justify-between gap-2 px-4 py-3 text-left">
        <div className="flex items-center gap-2">
          <Lightbulb size={14} className="text-amber-500 shrink-0" strokeWidth={2} />
          <span className="text-sm font-medium text-amber-800">Viktig om kalkulatoren</span>
        </div>
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

function ScenarioCard({ label, s, highlight }: { label: string; s: SalaryDividendScenario; highlight?: boolean }) {
  return (
    <div className={`card p-5 ${highlight ? 'ring-2 ring-brand-500 ring-offset-1' : ''}`}>
      <div className="flex items-center justify-between mb-3">
        <p className="font-semibold text-gray-900">{label}</p>
        {highlight && <span className="text-xs bg-brand-50 text-brand-700 border border-brand-200 px-2 py-0.5 rounded-full font-medium">Anbefalt</span>}
      </div>
      <div className="space-y-1.5 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500">Lønn</span>
          <span className="font-medium">{s.salary.toLocaleString('nb-NO')} kr</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Utbytte (etter skatt i selskap)</span>
          <span className="font-medium">{s.dividend.toLocaleString('nb-NO')} kr</span>
        </div>
        <div className="border-t border-gray-100 my-2" />
        <div className="flex justify-between">
          <span className="text-gray-500">AGA (arbeidsgiveravgift)</span>
          <span className="text-red-500">−{s.aga_cost.toLocaleString('nb-NO')} kr</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Selskapsskatt</span>
          <span className="text-red-500">−{s.corporation_tax.toLocaleString('nb-NO')} kr</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Personskatt</span>
          <span className="text-red-500">−{s.personal_income_tax.toLocaleString('nb-NO')} kr</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Utbytteskatt</span>
          <span className="text-red-500">−{s.dividend_tax.toLocaleString('nb-NO')} kr</span>
        </div>
        <div className="border-t border-gray-200 my-2" />
        <div className="flex justify-between font-semibold">
          <span className="text-gray-700">Total skatt</span>
          <span className="text-red-600">{s.total_tax.toLocaleString('nb-NO')} kr</span>
        </div>
        <div className="flex justify-between font-bold text-base">
          <span className="text-gray-900">Netto privat</span>
          <span className="text-green-600">{s.net_private.toLocaleString('nb-NO')} kr</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-gray-400">Effektiv skattesats</span>
          <span className="text-gray-500">{(s.effective_tax_rate * 100).toFixed(1)}%</span>
        </div>
      </div>
    </div>
  )
}

const AGA_ZONE_LABELS: Record<string, string> = {
  zone1: 'Sone I — 14,1% (Oslo, Bergen m.fl.)',
  zone2: 'Sone II — 10,6%',
  zone3: 'Sone III — 6,4%',
  zone4: 'Sone IV — 5,1%',
  zone5: 'Sone V — 0% (Finnmark m.fl.)',
}

export default function SalaryDividendPage() {
  const [form, setForm] = useState({
    company_profit: '1000000',
    current_salary: '600000',
    aga_zone: 'zone1',
    shielding_deduction: '0',
    retained_earnings: '0',
  })
  const [result, setResult] = useState<ReturnType<typeof calculateSalaryDividend> | null>(null)

  function calculate() {
    const r = calculateSalaryDividend({
      company_profit_before_owner_salary: parseFloat(form.company_profit) || 0,
      current_salary: parseFloat(form.current_salary) || 0,
      aga_zone: form.aga_zone as keyof typeof AGA_RATES,
      shielding_deduction: parseFloat(form.shielding_deduction) || 0,
      retained_earnings: parseFloat(form.retained_earnings) || 0,
    })
    setResult(r)
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Lønn vs. utbytte</h1>
        <p className="text-gray-500 mt-1 text-sm">Sammenlign fire scenarier og finn optimal fordeling</p>
      </div>

      <TipBox tips={[
        'Kalkulatoren gir en <strong>kvalifisert estimering</strong> — ikke bindende skatterådgivning. Bruk en regnskapsfører for endelig beslutning.',
        'Viktig: <strong>lønn gir pensjonsrettigheter og sykepenger</strong> — utbytte gir ingenting. For god trygdedekning bør lønn være minst 7,1 G (ca. 850 000 kr i 2025).',
        'Lønn under ca. 300 000 kr + store utbytter = risiko for at Skatteetaten omklassifiserer utbytte som lønn.',
        'Skjermingsfradrag: aksjens inngangsverdi × skjermingsrenten. Sjekk årsoppgaven fra VPS.',
        'Fritaksmetoden i holding-AS gir mulighet til å la utbytte «rulle» skattefritt mellom selskaper.',
      ]} />

      {/* Input form */}
      <div className="card p-6 mb-6">
        <h2 className="font-semibold mb-4">Dine tall</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Selskapets overskudd FØR eierlønnn (NOK)</label>
            <input type="number" className="input" value={form.company_profit}
              onChange={e => setForm(p => ({ ...p, company_profit: e.target.value }))} />
            <p className="text-xs text-gray-400 mt-1">Resultat før du trekker ut din lønn</p>
          </div>
          <div>
            <label className="label">Din nåværende lønn (NOK/år)</label>
            <input type="number" className="input" value={form.current_salary}
              onChange={e => setForm(p => ({ ...p, current_salary: e.target.value }))} />
          </div>
          <div>
            <label className="label">Arbeidsgiveravgifts-sone</label>
            <select className="input" value={form.aga_zone}
              onChange={e => setForm(p => ({ ...p, aga_zone: e.target.value }))}>
              {Object.entries(AGA_ZONE_LABELS).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Skjermingsfradrag (NOK/år)</label>
            <input type="number" className="input" value={form.shielding_deduction}
              onChange={e => setForm(p => ({ ...p, shielding_deduction: e.target.value }))} />
            <p className="text-xs text-gray-400 mt-1">Fra VPS-årsoppgaven. Sett 0 hvis ukjent.</p>
          </div>
        </div>
        <button onClick={calculate} className="btn-primary mt-5 w-full">
          Beregn og sammenlign scenarier
        </button>
      </div>

      {/* Results */}
      {result && (
        <>
          {/* Recommendation */}
          <div className="card p-5 mb-6 bg-brand-50 border border-brand-100">
            <div className="flex gap-3">
              <div className="w-9 h-9 bg-brand-100 rounded-lg flex items-center justify-center shrink-0">
                <TrendingUp size={18} className="text-brand-600" strokeWidth={1.8} />
              </div>
              <div>
                <p className="font-semibold text-brand-900 mb-1">Anbefaling</p>
                <p className="text-sm text-brand-800">{result.recommendation}</p>
              </div>
            </div>
          </div>

          {/* Scenario grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <ScenarioCard label="Lønn = 0 kr" s={result.scenario_low_salary} />
            <ScenarioCard label={`Nåværende lønn (${result.scenario_current.salary.toLocaleString('nb-NO')} kr)`} s={result.scenario_current} />
            <ScenarioCard label={`Anbefalt lønn (${result.scenario_optimal.salary.toLocaleString('nb-NO')} kr)`} s={result.scenario_optimal} highlight />
            <ScenarioCard label="Maks lønn (alt ut som lønn)" s={result.scenario_max_salary} />
          </div>

          {/* Notes */}
          <div className="card p-5 bg-gray-50 border-gray-100">
            <div className="flex items-start gap-2 mb-3">
              <Info size={15} className="text-gray-400 shrink-0 mt-0.5" strokeWidth={2} />
              <p className="text-sm font-medium text-gray-600">Forbehold og forutsetninger</p>
            </div>
            <ul className="space-y-1">
              {result.notes.map((n, i) => (
                <li key={i} className="text-sm text-gray-500 flex gap-2">
                  <span className="shrink-0 mt-0.5 text-gray-400">•</span> {n}
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  )
}
