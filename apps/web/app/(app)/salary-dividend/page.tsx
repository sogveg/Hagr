'use client'

import { useState, useEffect } from 'react'
import {
  calculateSalaryDividend,
  AGA_ZONE_KEYS,
  type AGAZone,
  type SalaryDividendScenario,
  type PensionImpact,
} from '@/lib/shared'
import { DEFAULT_TAX_RATES, TAX_RATES_2025, type DynamicTaxRates } from '@/lib/shared/tax-rates'
import {
  TrendingUp, Lightbulb, ChevronDown, ChevronUp,
  Info, ShieldCheck, AlertTriangle, Heart, Baby,
  BadgeCheck, RefreshCw, ExternalLink, ArrowRight,
} from 'lucide-react'

function TipBox({ tips }: { tips: string[] }) {
  const [open, setOpen] = useState(true)
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-xl overflow-hidden mb-6">
      <button onClick={() => setOpen(v => !v)} className="w-full flex items-center justify-between gap-2 px-4 py-3 text-left">
        <span className="flex items-center gap-2 text-amber-800 font-medium text-sm">
          <Lightbulb size={14} className="text-amber-500 shrink-0" strokeWidth={2} />
          Viktig om kalkulatoren
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
        <p className="text-xs text-gray-400 mt-0.5">
          +{pension.annual_accrual_nok.toLocaleString('nb-NO')} kr/år på pensjonskonto
        </p>
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
      {pension.notes.map((n, i) => (
        <p key={i} className="text-xs text-gray-500">{n}</p>
      ))}
    </div>
  )
}

function ScenarioCard({
  label, sublabel, s, highlight, badge,
}: {
  label: string
  sublabel?: string
  s: SalaryDividendScenario
  highlight?: boolean
  badge?: { text: string; color: 'blue' | 'purple' }
}) {
  const [showPension, setShowPension] = useState(false)
  return (
    <div className={`card p-5 flex flex-col ${highlight ? 'ring-2 ring-blue-500 ring-offset-1' : ''}`}>
      <div className="flex items-start justify-between mb-3 gap-2">
        <div>
          <p className="font-semibold text-gray-900 text-sm leading-snug">{label}</p>
          {sublabel && <p className="text-xs text-gray-400 mt-0.5">{sublabel}</p>}
        </div>
        {badge && (
          <span className={`shrink-0 text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1 border ${
            badge.color === 'blue'
              ? 'bg-blue-50 text-blue-700 border-blue-200'
              : 'bg-purple-50 text-purple-700 border-purple-200'
          }`}>
            <BadgeCheck size={11} strokeWidth={2.5} />{badge.text}
          </span>
        )}
      </div>

      <div className="space-y-1.5 text-sm flex-1">
        <div className="flex justify-between">
          <span className="text-gray-500">Lønn</span>
          <span className="font-medium">{s.salary.toLocaleString('nb-NO')} kr</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Utbytte (etter selskapsskatt)</span>
          <span className="font-medium">{s.dividend.toLocaleString('nb-NO')} kr</span>
        </div>
        <div className="border-t border-gray-100 my-2" />
        <div className="flex justify-between text-xs text-gray-400">
          <span>AGA</span><span>−{s.aga_cost.toLocaleString('nb-NO')} kr</span>
        </div>
        <div className="flex justify-between text-xs text-gray-400">
          <span>Selskapsskatt</span><span>−{s.corporation_tax.toLocaleString('nb-NO')} kr</span>
        </div>
        <div className="flex justify-between text-xs text-gray-400">
          <span>Personskatt</span><span>−{s.personal_income_tax.toLocaleString('nb-NO')} kr</span>
        </div>
        <div className="flex justify-between text-xs text-gray-400">
          <span>Utbytteskatt</span><span>−{s.dividend_tax.toLocaleString('nb-NO')} kr</span>
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
        className="mt-3 text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 self-start"
      >
        <ShieldCheck size={12} strokeWidth={2} />
        {showPension ? 'Skjul' : 'Vis'} trygderettigheter
        {showPension ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
      </button>
      {showPension && <PensionBar pension={s.pension} />}
    </div>
  )
}

const AGA_ZONE_LABELS: Record<AGAZone, string> = {
  zone1: 'Sone I — 14,1% (Oslo, Bergen m.fl.)',
  zone2: 'Sone II — 10,6%',
  zone3: 'Sone III — 6,4%',
  zone4: 'Sone IV — 5,1%',
  zone5: 'Sone V — 0% (Finnmark m.fl.)',
}

function MarginalRateTable({ rates, agaZone, crossoverNok }: {
  rates: DynamicTaxRates
  agaZone: AGAZone
  crossoverNok: number
}) {
  const agaRate = rates[`aga_${agaZone}` as keyof DynamicTaxRates] as number
  // Per kr company cost breakeven: (1-marginal)/(1+aga) = (1-corp)*(1-div_upscale*div_rate)
  const dividendYield = (1 - rates.corporation_tax_rate) * (1 - rates.dividend_upscale * rates.dividend_tax_rate)
  const breakEven = 1 - dividendYield * (1 + agaRate)
  const effDivRate = rates.dividend_upscale * rates.dividend_tax_rate // 37.84%

  const brackets = [
    { label: `0 – ${rates.bracket_1_from.toLocaleString('nb-NO')}`, trinnskatt: 0 },
    { label: `${rates.bracket_1_from.toLocaleString('nb-NO')} – ${rates.bracket_2_from.toLocaleString('nb-NO')}`, trinnskatt: rates.bracket_1_rate },
    { label: `${rates.bracket_2_from.toLocaleString('nb-NO')} – ${rates.bracket_3_from.toLocaleString('nb-NO')}`, trinnskatt: rates.bracket_2_rate },
    { label: `${rates.bracket_3_from.toLocaleString('nb-NO')} – ${rates.bracket_4_from.toLocaleString('nb-NO')}`, trinnskatt: rates.bracket_3_rate },
    { label: `${rates.bracket_4_from.toLocaleString('nb-NO')} – ${rates.bracket_5_from.toLocaleString('nb-NO')}`, trinnskatt: rates.bracket_4_rate },
    { label: `Over ${rates.bracket_5_from.toLocaleString('nb-NO')}`, trinnskatt: rates.bracket_5_rate },
  ]

  return (
    <div className="card p-5 mb-6">
      <h3 className="font-semibold text-gray-900 mb-1">Marginalskatt og kryssingspunkt</h3>
      <p className="text-xs text-gray-400 mb-4">
        Lønn er bedre enn utbytte der marginalskatt &lt; {(breakEven * 100).toFixed(1)}% (beregnet for {agaZone}).
        Effektiv utbytteskatt: <strong>{(effDivRate * 100).toFixed(2)}%</strong> (oppjustering 1,72 × 22%).
      </p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-gray-400 border-b border-gray-100">
              <th className="text-left pb-2 font-medium">Inntektsintervall</th>
              <th className="text-right pb-2 font-medium">Trinnskatt</th>
              <th className="text-right pb-2 font-medium">+ Flat 22%</th>
              <th className="text-right pb-2 font-medium">+ Trygde {(rates.trygdeavgift_rate * 100).toFixed(1)}%</th>
              <th className="text-right pb-2 font-medium">= Marginal</th>
              <th className="text-right pb-2 font-medium">Vinner</th>
            </tr>
          </thead>
          <tbody>
            {brackets.map((b, i) => {
              const marginal = rates.flat_tax_rate + rates.trygdeavgift_rate + b.trinnskatt
              const salaryWins = marginal < breakEven
              const isCrossover = i > 0 && salaryWins !== (rates.flat_tax_rate + rates.trygdeavgift_rate + brackets[i - 1].trinnskatt < breakEven)
              return (
                <tr key={i} className={`border-b border-gray-50 ${!salaryWins ? 'bg-orange-50' : ''}`}>
                  <td className="py-2 text-gray-700 text-xs">
                    {b.label}
                    {isCrossover && (
                      <span className="ml-2 text-xs bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded font-medium">
                        ← kryssingspunkt
                      </span>
                    )}
                  </td>
                  <td className="text-right py-2 text-gray-600">{(b.trinnskatt * 100).toFixed(1)}%</td>
                  <td className="text-right py-2 text-gray-400">22,0%</td>
                  <td className="text-right py-2 text-gray-400">{(rates.trygdeavgift_rate * 100).toFixed(1)}%</td>
                  <td className={`text-right py-2 font-semibold ${salaryWins ? 'text-green-700' : 'text-orange-700'}`}>
                    {(marginal * 100).toFixed(1)}%
                  </td>
                  <td className={`text-right py-2 text-xs font-medium ${salaryWins ? 'text-green-600' : 'text-orange-600'}`}>
                    {salaryWins ? '💼 Lønn' : '📈 Utbytte'}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <div className="mt-3 flex items-start gap-2 text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2">
        <Info size={12} className="shrink-0 mt-0.5" />
        Sammenligningen inkluderer AGA ({(agaRate * 100).toFixed(1)}% for {agaZone}) som ekstra selskapskostnad.
        Breakeven: (1 − marginal) ÷ (1 + AGA) = (1 − 22%) × (1 − 37,84%).
      </div>
    </div>
  )
}

export default function SalaryDividendPage() {
  const [rates, setRates] = useState<DynamicTaxRates>(DEFAULT_TAX_RATES)
  const [selectedYear, setSelectedYear] = useState<2025 | 2026>(2026)
  const [ratesLoading, setRatesLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [refreshResult, setRefreshResult] = useState<{ fetched: number; errors: string[] } | null>(null)
  const [showMarginalTable, setShowMarginalTable] = useState(false)

  const [form, setForm] = useState({
    company_profit: '1000000',
    current_salary: '600000',
    aga_zone: 'zone1' as AGAZone,
    shielding_deduction: '0',
  })
  const [result, setResult] = useState<ReturnType<typeof calculateSalaryDividend> | null>(null)

  // Load rates on mount
  useEffect(() => {
    fetch('/api/tax-rates')
      .then(r => r.json())
      .then((r: DynamicTaxRates) => {
        setRates(r)
        setSelectedYear((r.year ?? 2026) as 2025 | 2026)
      })
      .catch(() => {/* keep defaults */})
      .finally(() => setRatesLoading(false))
  }, [])

  // Switch year
  function switchYear(year: 2025 | 2026) {
    setSelectedYear(year)
    setRates(year === 2025 ? TAX_RATES_2025 : DEFAULT_TAX_RATES)
    setResult(null)
  }

  async function refreshRates() {
    setRefreshing(true)
    setRefreshResult(null)
    try {
      const res = await fetch('/api/tax-rates/refresh', {
        method: 'POST',
        headers: { 'x-cron-secret': process.env.NEXT_PUBLIC_CRON_SECRET ?? '' },
      })
      const data = await res.json()
      setRefreshResult({ fetched: data.fetched ?? 0, errors: data.errors ?? [] })
      // Reload rates
      const ratesRes = await fetch('/api/tax-rates')
      const newRates: DynamicTaxRates = await ratesRes.json()
      setRates(newRates)
    } catch {
      setRefreshResult({ fetched: 0, errors: ['Nettverksfeil — prøv igjen'] })
    } finally {
      setRefreshing(false)
    }
  }

  function calculate() {
    setResult(calculateSalaryDividend({
      company_profit_before_owner_salary: parseFloat(form.company_profit) || 0,
      current_salary: parseFloat(form.current_salary) || 0,
      aga_zone: form.aga_zone,
      shielding_deduction: parseFloat(form.shielding_deduction) || 0,
      retained_earnings: 0,
    }, rates))
  }

  const pensionMaxNok = rates.pension_max_nok
  const sickPayMaxNok = rates.sick_pay_max_nok
  const minBenefitsNok = rates.min_benefits_nok
  const currentSalary = parseFloat(form.current_salary) || 0

  return (
    <div className="max-w-5xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Lønn vs. utbytte</h1>
        <p className="text-gray-500 mt-1 text-sm">
          Optimal fordeling med pensjonsopptjening, sykepenger og skatt — {rates.year ?? new Date().getFullYear()}
        </p>
      </div>

      {/* Year selector */}
      <div className="flex items-center gap-2 mb-5">
        <span className="text-xs text-gray-500 font-medium">Skatteår:</span>
        {([2025, 2026] as const).map(y => (
          <button
            key={y}
            onClick={() => switchYear(y)}
            className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-all ${
              selectedYear === y
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
            }`}
          >
            {y}
          </button>
        ))}
        <span className="text-xs text-gray-400 ml-1">
          Kryssingspunkt sone I: <strong className="text-gray-700">{rates.bracket_4_from.toLocaleString('nb-NO')} kr</strong>
        </span>
      </div>

      {/* Rates status bar */}
      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <div className={`flex items-center gap-2 text-xs px-3 py-1.5 rounded-full border ${
          rates.fetched_at ? 'bg-green-50 border-green-200 text-green-700' : 'bg-gray-50 border-gray-200 text-gray-500'
        }`}>
          <div className={`w-1.5 h-1.5 rounded-full ${rates.fetched_at ? 'bg-green-500' : 'bg-gray-400'}`} />
          {ratesLoading
            ? 'Laster satser…'
            : rates.fetched_at
              ? `Satser hentet fra Skatteetaten/SSB ${new Date(rates.fetched_at).toLocaleDateString('nb-NO')}`
              : 'Standardverdier 2025 (ikke hentet)'
          }
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 border border-gray-200 rounded-full px-3 py-1.5">
          G {rates.year ?? 2025} = <strong className="text-gray-800">{rates.g_value.toLocaleString('nb-NO')} kr</strong>
        </div>

        <button
          onClick={refreshRates}
          disabled={refreshing}
          className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 px-3 py-1.5 rounded-full border border-blue-200 bg-blue-50 hover:bg-blue-100 transition-all disabled:opacity-50"
        >
          <RefreshCw size={12} strokeWidth={2} className={refreshing ? 'animate-spin' : ''} />
          {refreshing ? 'Henter…' : 'Oppdater fra Skatteetaten'}
        </button>

        <a
          href="https://www.skatteetaten.no/satser/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600"
        >
          <ExternalLink size={11} /> skatteetaten.no/satser
        </a>
      </div>

      {refreshResult && (
        <div className={`rounded-xl border px-4 py-3 mb-5 text-sm ${
          refreshResult.errors.length === 0
            ? 'bg-green-50 border-green-200 text-green-800'
            : 'bg-amber-50 border-amber-200 text-amber-800'
        }`}>
          <p className="font-medium mb-1">
            {refreshResult.fetched > 0 ? `✓ ${refreshResult.fetched} satser oppdatert` : ''}
            {refreshResult.errors.length > 0 ? ` · ${refreshResult.errors.length} advarsel(er)` : ''}
          </p>
          {refreshResult.errors.map((e, i) => (
            <p key={i} className="text-xs opacity-80">• {e}</p>
          ))}
        </div>
      )}

      <TipBox tips={[
        `<strong>7,1 G er den magiske grensen:</strong> Pensjonsopptjening gjelder kun opp til 7,1 G = <strong>${pensionMaxNok.toLocaleString('nb-NO')} kr</strong> i ${rates.year ?? 2025}. Over dette tjener du ingen ekstra pensjon på å ta ut lønn.`,
        `<strong>Sykepenger og foreldrepenger</strong> beregnes av lønn opp til 6 G = ${sickPayMaxNok.toLocaleString('nb-NO')} kr. Utbytte teller ikke — én dag syk uten lønn kan koste hundretusenvis.`,
        `<strong>Under 0,5 G (${minBenefitsNok.toLocaleString('nb-NO')} kr)?</strong> Ingen rett til sykepenger, foreldrepenger eller dagpenger fra NAV.`,
        'Du får <strong>to anbefalinger</strong>: «7,1 G» (full trygdedekning) og «Skattemessig optimal» (maks netto privat uten hensyn til pensjon). Velg bevisst.',
        `G justeres hvert år 1. mai. Satsene i kalkulatoren er automatisk hentet fra Skatteetaten og SSB.`,
      ]} />

      {/* Milestones */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: '0,5 G — Sykepenger/dagpenger', value: minBenefitsNok, icon: AlertTriangle, color: 'red' },
          { label: '6 G — Full syke-/foreldrepenger', value: sickPayMaxNok, icon: Heart, color: 'yellow' },
          { label: '7,1 G — Full pensjonsopptjening', value: pensionMaxNok, icon: BadgeCheck, color: 'green' },
        ].map(({ label, value, icon: Icon, color }) => {
          const reached = currentSalary >= value
          return (
            <div key={label} className={`rounded-xl border p-3 text-center transition-all ${
              reached
                ? color === 'green' ? 'bg-green-50 border-green-200' : color === 'yellow' ? 'bg-yellow-50 border-yellow-200' : 'bg-red-50 border-red-200'
                : 'bg-gray-50 border-gray-200 opacity-50'
            }`}>
              <Icon size={18} strokeWidth={2} className={`mx-auto mb-1 ${
                reached
                  ? color === 'green' ? 'text-green-500' : color === 'yellow' ? 'text-yellow-500' : 'text-red-400'
                  : 'text-gray-400'
              }`} />
              <p className="text-xs font-medium text-gray-700">{label}</p>
              <p className="text-xs text-gray-500 mt-0.5">{value.toLocaleString('nb-NO')} kr/år</p>
              {reached && <span className="inline-block mt-1 text-xs font-semibold text-green-600">✓ Nådd</span>}
            </div>
          )
        })}
      </div>

      {/* Input */}
      <div className="card p-6 mb-6">
        <h2 className="font-semibold mb-4">Dine tall</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Overskudd FØR eierlønn (kr)</label>
            <input type="number" className="input" value={form.company_profit}
              onChange={e => setForm(p => ({ ...p, company_profit: e.target.value }))} />
            <p className="text-xs text-gray-400 mt-1">Resultat før du trekker ut din lønn</p>
          </div>
          <div>
            <label className="label">Din nåværende lønn (kr/år)</label>
            <input type="number" className="input" value={form.current_salary}
              onChange={e => setForm(p => ({ ...p, current_salary: e.target.value }))} />
            <p className="text-xs text-gray-400 mt-1">7,1 G = {pensionMaxNok.toLocaleString('nb-NO')} kr anbefalt</p>
          </div>
          <div>
            <label className="label">Arbeidsgiveravgifts-sone</label>
            <select className="input" value={form.aga_zone}
              onChange={e => setForm(p => ({ ...p, aga_zone: e.target.value as AGAZone }))}>
              {AGA_ZONE_KEYS.map(k => (
                <option key={k} value={k}>{AGA_ZONE_LABELS[k]}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Skjermingsfradrag (kr/år)</label>
            <input type="number" className="input" value={form.shielding_deduction}
              onChange={e => setForm(p => ({ ...p, shielding_deduction: e.target.value }))} />
            <p className="text-xs text-gray-400 mt-1">Fra VPS-årsoppgaven. Sett 0 hvis ukjent.</p>
          </div>
        </div>
        <button onClick={calculate} className="btn-primary mt-5 w-full">
          Beregn og sammenlign alle scenarier
        </button>
      </div>

      {/* Marginal rate table — always visible */}
      <div className="mb-6">
        <button
          onClick={() => setShowMarginalTable(v => !v)}
          className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 font-medium mb-3"
        >
          <ArrowRight size={14} className={`transition-transform ${showMarginalTable ? 'rotate-90' : ''}`} />
          {showMarginalTable ? 'Skjul' : 'Vis'} marginalskattabell ({rates.year ?? 2026})
        </button>
        {showMarginalTable && (
          <MarginalRateTable
            rates={rates}
            agaZone={form.aga_zone}
            crossoverNok={rates.bracket_4_from}
          />
        )}
      </div>

      {result && (
        <>
          {/* Recommendation */}
          <div className="card p-5 mb-6 bg-blue-50 border border-blue-200">
            <div className="flex gap-3">
              <div className="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                <TrendingUp size={18} className="text-blue-600" strokeWidth={1.8} />
              </div>
              <div>
                <p className="font-semibold text-blue-900 mb-1">Anbefaling</p>
                <p className="text-sm text-blue-800">{result.recommendation}</p>
              </div>
            </div>
          </div>

          {/* 5 scenarios */}
          <div className="grid grid-cols-2 gap-4 mb-6 xl:grid-cols-3">
            <ScenarioCard label="Lønn = 0 kr" sublabel="Alt som utbytte" s={result.scenario_low_salary} />
            <ScenarioCard
              label={`Nåværende — ${result.scenario_current.salary.toLocaleString('nb-NO')} kr`}
              s={result.scenario_current}
            />
            <ScenarioCard
              label={`7,1 G — ${result.scenario_7_1g.salary.toLocaleString('nb-NO')} kr`}
              sublabel="Full pensjonsopptjening + sykepenger"
              s={result.scenario_7_1g}
              highlight
              badge={{ text: 'Anbefalt', color: 'blue' }}
            />
            <ScenarioCard
              label={`Skattemessig optimal — ${result.scenario_tax_optimal.salary.toLocaleString('nb-NO')} kr`}
              sublabel="Maks netto privat (uten pensjonshensyn)"
              s={result.scenario_tax_optimal}
              badge={{ text: 'Alternativ', color: 'purple' }}
            />
            <ScenarioCard label="Maks lønn" sublabel="Alt ut som lønn, ingen utbytte" s={result.scenario_max_salary} />
          </div>

          {/* Notes */}
          <div className="card p-5 bg-gray-50 border-gray-100">
            <div className="flex items-start gap-2 mb-3">
              <Info size={15} className="text-gray-400 shrink-0 mt-0.5" />
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
