'use client'

import { useState, useMemo } from 'react'
import {
  calculateSalaryDividend,
  AGA_ZONE_KEYS,
  type AGAZone,
  type SalaryDividendScenario,
  type PensionImpact,
} from '@/lib/shared'
import { DEFAULT_TAX_RATES } from '@/lib/shared/tax-rates'
import {
  TrendingUp, Lightbulb, ChevronDown, ChevronUp,
  ShieldCheck, Heart, Baby, Info,
} from 'lucide-react'

const AGA_ZONE_LABELS: Record<AGAZone, string> = {
  zone1: 'Sone I — 14,1% (Oslo, Bergen m.fl.)',
  zone2: 'Sone II — 10,6%',
  zone3: 'Sone III — 6,4%',
  zone4: 'Sone IV — 5,1%',
  zone5: 'Sone V — 0% (Finnmark m.fl.)',
}

function PensionBar({ pension }: { pension: PensionImpact }) {
  const pct = Math.min(100, Math.round(pension.pension_coverage_pct * 100))
  return (
    <div className="mt-3 pt-3 border-t border-gray-100 space-y-2">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Trygde- og pensjonsrettigheter</p>
      <div>
        <div className="flex justify-between text-xs mb-1">
          <span className="text-gray-500">Pensjonsopptjening</span>
          <span className={`font-semibold ${pct >= 100 ? 'text-green-600' : pct >= 50 ? 'text-yellow-600' : 'text-red-500'}`}>
            {pct}% av maks
          </span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${pct >= 100 ? 'bg-green-500' : pct >= 50 ? 'bg-yellow-400' : 'bg-red-400'}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
      <div className="flex gap-2 flex-wrap">
        <span className={`flex items-center gap-1 text-xs px-2 py-1 rounded-lg ${pension.has_sick_pay ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
          <Heart size={10} strokeWidth={2.5} />
          {pension.has_sick_pay ? `Sykepenger: ${pension.sick_pay_coverage_nok.toLocaleString('nb-NO')} kr` : 'Ingen sykepenger'}
        </span>
        <span className={`flex items-center gap-1 text-xs px-2 py-1 rounded-lg ${pension.has_sick_pay ? 'bg-blue-50 text-blue-700' : 'bg-red-50 text-red-600'}`}>
          <Baby size={10} strokeWidth={2.5} />
          {pension.has_sick_pay ? `Foreldrepenger: ${pension.parental_pay_coverage_nok.toLocaleString('nb-NO')} kr` : 'Ingen foreldrepenger'}
        </span>
      </div>
    </div>
  )
}

function ScenarioCard({
  label, sublabel, s, highlight,
}: {
  label: string
  sublabel?: string
  s: SalaryDividendScenario
  highlight?: boolean
}) {
  const [showPension, setShowPension] = useState(false)
  return (
    <div className={`bg-white rounded-xl border p-5 flex flex-col shadow-sm ${highlight ? 'ring-2 ring-violet-500 ring-offset-1' : 'border-gray-200'}`}>
      <div className="mb-3">
        <p className="font-semibold text-gray-900 text-sm">{label}</p>
        {sublabel && <p className="text-xs text-gray-400 mt-0.5">{sublabel}</p>}
      </div>
      <div className="space-y-1.5 text-sm flex-1">
        {s.salary > 0 && (
          <div className="flex justify-between text-xs bg-gray-50 rounded-lg px-2 py-1.5">
            <span className="text-gray-500">Selskapskostnad (lønn + AGA)</span>
            <span className="font-semibold text-gray-700">{(s.salary + s.aga_cost).toLocaleString('nb-NO')} kr</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-gray-500">Din lønn</span>
          <span className="font-medium">{s.salary.toLocaleString('nb-NO')} kr</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Utbytte (etter 22% selskapsskatt)</span>
          <span className="font-medium">{s.dividend.toLocaleString('nb-NO')} kr</span>
        </div>
        <div className="border-t border-gray-100 my-2" />
        <div className="flex justify-between text-xs text-gray-400">
          <span>Selskapsskatt 22%</span><span>−{s.corporation_tax.toLocaleString('nb-NO')} kr</span>
        </div>
        <div className="flex justify-between text-xs text-gray-400">
          <span>Personskatt (lønn)</span><span>−{s.personal_income_tax.toLocaleString('nb-NO')} kr</span>
        </div>
        <div className="flex justify-between text-xs text-gray-400">
          <span>Utbytteskatt (37,84%)</span><span>−{s.dividend_tax.toLocaleString('nb-NO')} kr</span>
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
      <button
        onClick={() => setShowPension(v => !v)}
        className="mt-3 text-xs text-violet-600 hover:text-violet-800 flex items-center gap-1 self-start"
      >
        <ShieldCheck size={12} strokeWidth={2} />
        {showPension ? 'Skjul' : 'Vis'} trygderettigheter
        {showPension ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
      </button>
      {showPension && <PensionBar pension={s.pension} />}
    </div>
  )
}

export default function DemoSalaryDividendPage() {
  const rates = DEFAULT_TAX_RATES
  const [form, setForm] = useState({
    net_profit: '',
    current_salary: '',
    aga_zone: 'zone1' as AGAZone,
  })
  const [calculated, setCalculated] = useState(false)

  const netProfit = parseFloat(form.net_profit.replace(/\s/g, '')) || 0
  const currentSalaryVal = parseFloat(form.current_salary.replace(/\s/g, '')) || 0
  const agaRate = (rates as any)[`aga_${form.aga_zone}`] as number ?? 0.141
  const profitBeforeSalary = netProfit + currentSalaryVal * (1 + agaRate)

  const result = useMemo(() => {
    if (!calculated || profitBeforeSalary <= 0) return null
    return calculateSalaryDividend({
      company_profit_before_owner_salary: profitBeforeSalary,
      current_salary: currentSalaryVal,
      aga_zone: form.aga_zone,
      shielding_deduction: 0,
      retained_earnings: 0,
    }, rates)
  }, [calculated, profitBeforeSalary, currentSalaryVal, form.aga_zone])

  function calculate() {
    setCalculated(true)
  }

  const crossoverNok = rates.bracket_4_from

  return (
    <div className="max-w-5xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <TrendingUp size={22} className="text-violet-600" strokeWidth={2} />
          Lønn vs. utbytte
        </h1>
        <p className="text-gray-500 mt-1 text-sm">
          Finn optimal fordeling — pensjon, sykepenger og skatt beregnet med 2026-satser
        </p>
      </div>

      {/* Info pills */}
      <div className="flex flex-wrap gap-2 mb-6">
        <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full border border-gray-200">
          G 2026 = {rates.g_value.toLocaleString('nb-NO')} kr (NAV)
        </span>
        <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full border border-gray-200">
          Kryssingspunkt sone I: {crossoverNok.toLocaleString('nb-NO')} kr
        </span>
        <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full border border-gray-200">
          Utbytteskatt: 51,5% (av overskudd)
        </span>
      </div>

      {/* Inntastefelt */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6 space-y-4">
        <h2 className="font-semibold text-gray-900 text-sm">Om selskapet ditt</h2>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Årsresultat etter lønn (kr)
            </label>
            <input
              type="text"
              inputMode="numeric"
              placeholder="f.eks. 800 000"
              value={form.net_profit}
              onChange={e => { setForm(f => ({ ...f, net_profit: e.target.value })); setCalculated(false) }}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
            <p className="text-xs text-gray-400 mt-1">Resultatet fra regnskapet, etter din lønn er kostnadsført</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Din nåværende lønn (kr/år)
            </label>
            <input
              type="text"
              inputMode="numeric"
              placeholder="f.eks. 600 000"
              value={form.current_salary}
              onChange={e => { setForm(f => ({ ...f, current_salary: e.target.value })); setCalculated(false) }}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
            <p className="text-xs text-gray-400 mt-1">0 hvis du ikke tar lønn nå</p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">AGA-sone</label>
          <select
            value={form.aga_zone}
            onChange={e => { setForm(f => ({ ...f, aga_zone: e.target.value as AGAZone })); setCalculated(false) }}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
          >
            {AGA_ZONE_KEYS.map(z => (
              <option key={z} value={z}>{AGA_ZONE_LABELS[z]}</option>
            ))}
          </select>
        </div>

        {profitBeforeSalary > 0 && (
          <div className="flex items-center gap-2 text-xs text-gray-500 bg-blue-50 rounded-lg px-3 py-2 border border-blue-100">
            <Info size={12} className="text-blue-400 shrink-0" />
            Tilgjengelig overskudd (inkl. lønn + AGA): <strong className="text-blue-700">{profitBeforeSalary.toLocaleString('nb-NO', { maximumFractionDigits: 0 })} kr</strong>
          </div>
        )}

        <button
          onClick={calculate}
          disabled={profitBeforeSalary <= 0}
          className="w-full bg-violet-600 text-white py-3 rounded-xl font-semibold text-sm hover:bg-violet-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Beregn optimal fordeling
        </button>
      </div>

      {/* Resultater */}
      {result && (() => {
        const scenarioList = [
          { label: 'Kun utbytte', sublabel: 'Ingen lønn', s: result.scenario_low_salary },
          { label: 'Nåværende lønn', sublabel: `${currentSalaryVal.toLocaleString('nb-NO')} kr`, s: result.scenario_current },
          { label: '7,1 G (anbefalt)', sublabel: 'Full pensjonsopptjening', s: result.scenario_7_1g, highlight: true },
          { label: 'Skatteoptimal', sublabel: 'Maks netto privat', s: result.scenario_tax_optimal },
          { label: 'Alt som lønn', sublabel: 'Ingen utbytte', s: result.scenario_max_salary },
        ]
        return (
          <div className="space-y-6">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {scenarioList.map(({ label, sublabel, s, highlight }) => (
                <ScenarioCard key={label} label={label} sublabel={sublabel} s={s} highlight={highlight} />
              ))}
            </div>

            <div className="bg-violet-50 border border-violet-200 rounded-xl p-5">
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 bg-violet-600 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                  <TrendingUp size={14} className="text-white" strokeWidth={2.5} />
                </div>
                <div>
                  <p className="font-semibold text-violet-900 text-sm">
                    Anbefalt lønn: {result.recommended_salary_nok.toLocaleString('nb-NO')} kr
                  </p>
                  <p className="text-sm text-violet-700 mt-1">{result.recommendation}</p>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-xs text-amber-800 flex items-start gap-2">
              <Lightbulb size={13} className="shrink-0 mt-0.5 text-amber-500" />
              <span>Dette er en demo med standardsatser for 2026. Logg inn for å lagre beregninger, justere skjermingsfradrag, og se marginalskattabellen.</span>
            </div>
          </div>
        )
      })()}
    </div>
  )
}
