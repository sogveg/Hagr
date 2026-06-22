'use client'

import { useState, useMemo, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import TipBox from '@/components/TipBox'
import {
  evaluateWelfare, WELFARE_TYPE_LABELS, ALCOHOL_LABELS,
  WELFARE_RECOMMENDED_LIMIT_PER_EMPLOYEE, REPRESENTATION_FOOD_LIMIT_PER_PERSON,
  type WelfareType, type AlcoholType,
} from '@/lib/shared'
import {
  Heart, Lightbulb, ChevronDown, ChevronUp, AlertTriangle, CheckCircle,
  ShieldCheck, ShieldAlert, ShieldX, Save, Users, Info,
  Wine, BookOpen, Calculator, List, Plus, X, Building2, Trash2,
} from 'lucide-react'

// ─── Sub-components ───────────────────────────────────────────────────────────

function RiskBadge({ level }: { level: 'green' | 'yellow' | 'red' }) {
  if (level === 'green') return (
    <span className="inline-flex items-center gap-1 text-sm font-semibold text-green-700 bg-green-50 border border-green-200 px-3 py-1 rounded-full">
      <ShieldCheck size={14} strokeWidth={2} /> Lav risiko
    </span>
  )
  if (level === 'yellow') return (
    <span className="inline-flex items-center gap-1 text-sm font-semibold text-yellow-700 bg-yellow-50 border border-yellow-200 px-3 py-1 rounded-full">
      <ShieldAlert size={14} strokeWidth={2} /> Moderat risiko
    </span>
  )
  return (
    <span className="inline-flex items-center gap-1 text-sm font-semibold text-red-700 bg-red-50 border border-red-200 px-3 py-1 rounded-full">
      <ShieldX size={14} strokeWidth={2} /> Høy risiko
    </span>
  )
}

function FlagItem({ text }: { text: string }) {
  const isGreen = text.startsWith('✅')
  const isRed = text.startsWith('❌') || text.startsWith('🚨')
  const isYellow = text.startsWith('⚠️')
  const isInfo = text.startsWith('ℹ️')
  return (
    <div className={`flex items-start gap-2 text-sm rounded-lg px-3 py-2.5 ${
      isRed ? 'bg-red-50 text-red-800' :
      isYellow ? 'bg-amber-50 text-amber-800' :
      isGreen ? 'bg-green-50 text-green-800' :
      'bg-blue-50 text-blue-800'
    }`}>
      {isGreen ? <CheckCircle size={13} className="shrink-0 mt-0.5 text-green-600" /> :
       isRed ? <ShieldX size={13} className="shrink-0 mt-0.5 text-red-500" /> :
       isYellow ? <AlertTriangle size={13} className="shrink-0 mt-0.5 text-amber-500" /> :
       <Info size={13} className="shrink-0 mt-0.5 text-blue-500" />}
      <span>{text.replace(/^[✅❌🚨⚠️ℹ️]\s*/u, '')}</span>
    </div>
  )
}

// ─── Julebord Guide ───────────────────────────────────────────────────────────

function JulebordGuide() {
  const [open, setOpen] = useState(false)
  return (
    <div className="card overflow-hidden mb-5">
      <button onClick={() => setOpen(v => !v)} className="w-full flex items-center justify-between px-5 py-4 text-left">
        <span className="flex items-center gap-2 font-semibold text-gray-900">
          <BookOpen size={16} className="text-brand-600" strokeWidth={2} />
          Julebord-guiden — hva er lov, og hvordan gjøre det riktig
        </span>
        {open ? <ChevronUp size={15} className="text-gray-400" /> : <ChevronDown size={15} className="text-gray-400" />}
      </button>

      {open && (
        <div className="border-t border-gray-100 px-5 py-5 space-y-6">

          {/* Grunnreglene */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <span className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold text-blue-700">1</span>
              Grunnreglene for velferdstiltak
            </h3>
            <div className="space-y-2">
              {[
                { icon: '✅', text: '<strong>Alle ansatte MÅ inviteres</strong> — eller alle i en hel avdeling/gruppe. Selektiv invitasjon = skattepliktig fordel for de som er med.' },
                { icon: '✅', text: '<strong>Faktisk ansettelsesforhold kreves</strong> — eier alene (uten ansatte) kan ikke holde skattefritt julebord for seg selv. Det blir utbytte + AGA.' },
                { icon: '✅', text: '<strong>Rimelig kostnad</strong> — det finnes ingen lovfestet kronergrense. Testen er om kostnaden er rimelig sett opp mot bedriftens størrelse og bransjenorm (FSFIN § 5-15-6).' },
                { icon: '✅', text: '<strong>Dokumentasjon er obligatorisk</strong> — deltakerliste, dato, formål og kvitteringer. To linjer i et regneark kan redde deg i en bokettersyn.' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="shrink-0 mt-0.5">{item.icon}</span>
                  <span dangerouslySetInnerHTML={{ __html: item.text }} />
                </div>
              ))}
            </div>
          </div>

          {/* Rimelighet — riktig regel for velferdstiltak */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <h3 className="font-semibold text-amber-900 mb-2 flex items-center gap-2">
              <span className="w-6 h-6 bg-amber-200 rounded-full flex items-center justify-center text-xs font-bold text-amber-800">2</span>
              Ingen fast kronergrense — testen er «rimelighet»
            </h3>
            <p className="text-sm text-amber-800 mb-1">
              Representasjonsgrensen på <strong>592 kr per person</strong> (2026) gjelder kun servering for <em>kunder og forretningsforbindelser</em> — ikke ansattjulebord.
              For velferdstiltak er testen om kostnaden er <strong>rimelig</strong>.
            </p>
            <p className="text-sm text-amber-700 mb-3">
              Det finnes ingen konkret kronergrense i loven. Vurderingstemaet er om kostnaden er rimelig for bedriften din (FSFIN § 5-15-6). Svært kostbare eller luksuriøse arrangement kan trekke vurderingen i feil retning.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-xs font-bold text-green-700 mb-1.5">✅ Normalt akseptert</p>
                <ul className="text-xs text-green-800 space-y-1">
                  <li>• Julebord 1 200 kr/person inkl. lokale</li>
                  <li>• Julebord 1 800 kr/person — vurder rimelighet</li>
                  <li>• Sommerfest 800 kr/person</li>
                  <li>• Teambuilding 1 000 kr/person</li>
                </ul>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-xs font-bold text-red-700 mb-1.5">⚠️ Økt risiko</p>
                <ul className="text-xs text-red-800 space-y-1">
                  <li>• Svært luksuspreget arrangement</li>
                  <li>• Kunder/leverandører dominerer deltakerlisten</li>
                  <li>• Feriepreg (cruise, resort, utland)</li>
                  <li>• Kun eierfamilien deltar</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Brennevin — riktig regel */}
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <h3 className="font-semibold text-red-900 mb-2 flex items-center gap-2">
              <Wine size={14} className="text-red-600" />
              <span className="w-6 h-6 bg-red-200 rounded-full flex items-center justify-center text-xs font-bold text-red-800">3</span>
              Brennevin: rødt flagg — ikke automatisk nullfradrag for ansattjulebord
            </h3>
            <p className="text-sm text-red-800 mb-2">
              Regelen om at brennevin nuller ut <em>hele</em> fradraget (skatteloven § 6-21) gjelder <strong>representasjon</strong> — altså servering for kunder og forretningsforbindelser. For et rent ansattjulebord er ikke brennevin automatisk diskvalifiserende.
            </p>
            <p className="text-sm text-red-700 mb-3">
              Brennevin øker likevel risikoen: dersom Skatteetaten vurderer arrangementet som representasjon (f.eks. fordi kunder deltar, det er svært kostbart eller luksuspreget), faller <strong>hele fradraget</strong> bort — ikke bare spritdelen. Ren ansattfest uten kunder: langt lavere risiko.
            </p>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="bg-green-50 border border-green-200 rounded-lg p-2 text-center">
                <p className="font-bold text-green-700">Øl</p>
                <p className="text-green-600">✅ Trygt</p>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-2 text-center">
                <p className="font-bold text-green-700">Vin</p>
                <p className="text-green-600">✅ Trygt</p>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-2 text-center">
                <p className="font-bold text-amber-700">Sprit/brennevin</p>
                <p className="text-amber-600">⚠️ Rødt flagg</p>
              </div>
            </div>
          </div>

          {/* Velferd vs. representasjon — skillet */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <h3 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
              <span className="w-6 h-6 bg-green-200 rounded-full flex items-center justify-center text-xs font-bold text-green-800">4</span>
              Skillet: velferdstiltak vs. representasjon
            </h3>
            <p className="text-sm text-green-800 mb-3">
              Hvilke regler som gjelder avhenger av hvem som er med. Blanding av ansatte og kunder kan flytte arrangementet fra gunstig velferd til strengere representasjonsregler.
            </p>
            <div className="bg-white rounded-lg border border-green-200 p-3 text-xs space-y-1.5">
              {[
                { scenario: 'Julebord for alle ansatte, 1 200 kr/person, øl/vin', verdict: 'Velferdstiltak ✅', color: 'text-green-700' },
                { scenario: 'Julebord for alle ansatte + ledsagere, normal kostnad', verdict: 'Kan være velferd ✅', color: 'text-green-700' },
                { scenario: 'Julebord for alle ansatte, 1 800 kr/person, noe avec', verdict: 'Velferd — vurder rimelighet ⚠️', color: 'text-amber-700' },
                { scenario: 'Julemiddag med 2 ansatte og 8 kunder', verdict: 'Trolig representasjon ⚠️', color: 'text-amber-700' },
                { scenario: 'Kundemiddag i desember, 700 kr/person + sprit', verdict: 'Representasjon + brennevin → nullfradrag ❌', color: 'text-red-700' },
                { scenario: 'Eier + ektefelle uten ansatte, dyr middag', verdict: 'Uttak/utbytte ❌', color: 'text-red-700' },
              ].map((row, i) => (
                <div key={i} className="flex justify-between gap-3 py-1 border-b border-gray-100 last:border-0">
                  <span className="text-gray-600">{row.scenario}</span>
                  <span className={`font-medium shrink-0 ${row.color}`}>{row.verdict}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Deltakerliste */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
              <Users size={14} className="text-blue-600" />
              <span className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-xs font-bold text-blue-800">5</span>
              Deltakerliste er et krav
            </h3>
            <p className="text-sm text-blue-800">
              Skatteetaten kan be om dokumentasjon på at <em>alle</em> ansatte ble invitert.
              Legg ved navneliste over deltakere når du registrerer arrangementet — vi lagrer det for deg slik at du har det klart ved bokettersyn.
            </p>
          </div>

          {/* Ektefeller */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <span className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center text-xs font-bold text-purple-700">6</span>
              Ektefeller og samboere
            </h3>
            <p className="text-sm text-gray-600">
              Det er fullt lovlig og skattefritt å ta med ektefelle/samboer på julebord og sommerfest.
              Kostnaden for partnere teller med i totalbudsjettet per ansatt, men er ikke i seg selv en skattepliktig fordel
              for den ansatte — det inngår i velferdstiltaket.
            </p>
          </div>

        </div>
      )}
    </div>
  )
}

// ─── Populære tiltak-guide ────────────────────────────────────────────────────

const POPULAR_MEASURES = [
  {
    name: 'Julebord',
    emoji: '🎄',
    limit: 'Ingen fast kronergrense — testen er rimelighet. 1 000–2 000 kr/person totalt er normalt akseptert.',
    safe: true,
    tips: ['Alle ansatte MÅ inviteres — selektiv invitasjon gir skattepliktig fordel', 'Brennevin er et rødt flagg dersom kunder deltar eller arrangementet kan bli klassifisert som representasjon', 'Ta vare på kvitteringer og deltakerliste'],
  },
  {
    name: 'Sommerfest',
    emoji: '☀️',
    limit: 'Ca. 800–1 200 kr/person er normalt OK. Samme regler som julebord.',
    safe: true,
    tips: ['Utendørs-aktiviteter (grilling, båttur etc.) teller med', 'Husk deltakerliste'],
  },
  {
    name: 'Teambuilding / kurs',
    emoji: '🏆',
    limit: 'Faglig innhold styrker fradragsretten. Rimelig kostnad. Kombinert kurs + middag er greit.',
    safe: true,
    tips: ['Dokumenter det faglige programmet', 'Minst 1/3 faglig innhold anbefales'],
  },
  {
    name: 'Bedriftshytte / treningsstudio',
    emoji: '🏋️',
    limit: 'Skattefritt hvis ALLE ansatte kan bruke det. Ingen per-person-kostnad pr. bruk.',
    safe: true,
    tips: ['Hytte som kun eier bruker = skattepliktig fordel', 'Alle ansatte må ha tilgang'],
  },
  {
    name: 'Kontanttilskudd til privat treningssenter',
    emoji: '💳',
    limit: 'Skattepliktig fra 2024. Ikke tillatt lenger.',
    safe: false,
    tips: ['Alternativ: Betal bedriftsabonnement direkte til treningssenter for alle'],
  },
  {
    name: 'Utenlandsreise (uten faglig formål)',
    emoji: '✈️',
    limit: 'Høy risiko — nesten alltid skattepliktig. Vesentlig privat element.',
    safe: false,
    tips: ['Kun akseptabelt ved klar faglig begrunnelse (konferanse, bransjemesse etc.)', 'Rene ferieturer = lønn'],
  },
  {
    name: 'Billett til konsert / sportsarrangement',
    emoji: '🎭',
    limit: 'Grensetilfelle. Akseptert som enkelttilfelle innenfor årsrammen. Ikke for eier alene.',
    safe: true,
    tips: ['Dokumenter at alle ble tilbudt å delta', 'Enkeltarrangement bør ikke overstige noen få tusen per person'],
  },
]

// ─── Main page ────────────────────────────────────────────────────────────────

export default function WelfarePage() {
  const [tab, setTab] = useState<'calculator' | 'guide' | 'history'>('calculator')

  // Calculator state
  const [welfareType, setWelfareType] = useState<WelfareType>('christmas_party')
  const [eventName, setEventName] = useState('')
  const [eventDate, setEventDate] = useState(new Date().toISOString().split('T')[0])
  const [venue, setVenue] = useState('')
  const [totalCost, setTotalCost] = useState('')
  const [foodCostPerPerson, setFoodCostPerPerson] = useState('')
  const [employeeCount, setEmployeeCount] = useState('')
  const [alcohol, setAlcohol] = useState<AlcoholType>('beer_wine')
  const [spousesIncluded, setSpousesIncluded] = useState(false)
  const [isForAll, setIsForAll] = useState(true)
  const [hasPrivateElement, setHasPrivateElement] = useState(false)
  const [participants, setParticipants] = useState<string[]>([])
  const [participantInput, setParticipantInput] = useState('')
  const [notes, setNotes] = useState('')

  // Supabase
  const [companies, setCompanies] = useState<any[]>([])
  const [selectedCompany, setSelectedCompany] = useState('')
  const [companyPeople, setCompanyPeople] = useState<any[]>([])
  const [saving, setSaving] = useState(false)
  const [saveOk, setSaveOk] = useState(false)
  const [history, setHistory] = useState<any[]>([])

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return
      supabase.from('company_access').select('company_id').eq('user_id', user.id).then(({ data }) => {
        const ids = (data ?? []).map(r => r.company_id)
        if (!ids.length) return
        supabase.from('companies').select('*').in('id', ids).then(({ data: c }) => {
          setCompanies(c ?? [])
          if (c && c.length > 0) setSelectedCompany(c[0].id)
        })
      })
    })
  }, [])

  useEffect(() => {
    if (!selectedCompany) return
    const supabase = createClient()
    supabase.from('company_people').select('id, name').eq('company_id', selectedCompany)
      .order('name').then(({ data }) => setCompanyPeople(data ?? []))
    supabase.from('welfare_measures').select('*').eq('company_id', selectedCompany)
      .order('event_date', { ascending: false }).limit(20).then(({ data }) => setHistory(data ?? []))
  }, [selectedCompany])

  const result = useMemo(() => {
    const cost = parseFloat(totalCost.replace(/\s/g, '').replace(',', '.'))
    const food = parseFloat(foodCostPerPerson.replace(/\s/g, '').replace(',', '.'))
    if (!cost || cost <= 0) return null
    return evaluateWelfare({
      welfare_type: welfareType,
      total_cost_nok: cost,
      employee_count: parseInt(employeeCount) || 1,
      spouses_included: spousesIncluded,
      is_for_all_employees: isForAll,
      has_substantial_private_element: hasPrivateElement,
      food_cost_per_person: food > 0 ? food : undefined,
      alcohol_served: alcohol,
    })
  }, [welfareType, totalCost, foodCostPerPerson, employeeCount, spousesIncluded, isForAll, hasPrivateElement, alcohol])

  function addParticipant(name: string) {
    const trimmed = name.trim()
    if (!trimmed || participants.includes(trimmed)) return
    setParticipants(p => [...p, trimmed])
    setParticipantInput('')
  }

  function addFromPeople(person: any) {
    if (!participants.includes(person.name)) {
      setParticipants(p => [...p, person.name])
    }
  }

  function addAllPeople() {
    const names = companyPeople.map(p => p.name).filter(n => !participants.includes(n))
    setParticipants(p => [...p, ...names])
  }

  async function save() {
    if (!result || !selectedCompany) return
    setSaving(true)
    const cost = parseFloat(totalCost.replace(/\s/g, '').replace(',', '.'))
    const food = parseFloat(foodCostPerPerson.replace(/\s/g, '').replace(',', '.'))
    const supabase = createClient()
    const { error } = await supabase.from('welfare_measures').insert({
      company_id: selectedCompany,
      welfare_type: welfareType,
      event_name: eventName || WELFARE_TYPE_LABELS[welfareType],
      description: eventName || WELFARE_TYPE_LABELS[welfareType],
      event_date: eventDate,
      venue: venue || null,
      total_cost_nok: cost,
      food_cost_per_person: food > 0 ? food : null,
      alcohol_served: alcohol,
      employee_count: parseInt(employeeCount) || 1,
      participant_count: participants.length || parseInt(employeeCount) || 1,
      participants: participants.length > 0 ? participants : null,
      spouses_included: spousesIncluded,
      is_for_all_employees: isForAll,
      has_substantial_private_element: hasPrivateElement,
      cost_per_employee_nok: result.cost_per_employee_nok,
      risk_level: result.risk_level,
      is_tax_free: result.is_tax_free_for_employees,
      is_deductible: result.is_deductible_for_company,
      notes: notes || null,
    })
    if (!error) {
      setSaveOk(true)
      setTimeout(() => setSaveOk(false), 3000)
      // refresh history
      supabase.from('welfare_measures').select('*').eq('company_id', selectedCompany)
        .order('event_date', { ascending: false }).limit(20).then(({ data }) => setHistory(data ?? []))
    }
    setSaving(false)
  }

  const RISK_COLOR = {
    green: 'text-green-700 bg-green-50 border-green-200',
    yellow: 'text-amber-700 bg-amber-50 border-amber-200',
    red: 'text-red-700 bg-red-50 border-red-200',
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-gray-900">Velferdstiltak</h1>
        <p className="text-gray-500 mt-1 text-sm">
          Julebord, sommerfest og teambuilding — registrering, regler og skatteguide
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-200 mb-6">
        {([
          { key: 'calculator', label: 'Kalkulator og registrering', Icon: Calculator },
          { key: 'guide',      label: 'Julebord-guiden',            Icon: BookOpen },
          { key: 'history',    label: `Historikk (${history.length})`, Icon: List },
        ] as const).map(({ key, label, Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
              tab === key ? 'border-brand-600 text-brand-700' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Icon size={14} /> {label}
          </button>
        ))}
      </div>

      {/* ── TAB: Kalkulator ── */}
      {tab === 'calculator' && (
        <div className="space-y-5">
          <TipBox toolHref="/welfare" title="Julebord og velferd — tips og fallgruver" maxTips={3} />

          {/* Company selector */}
          {companies.length > 0 && (
            <div className="flex items-center gap-3">
              <Building2 size={15} className="text-gray-400 shrink-0" />
              <select className="input flex-1" value={selectedCompany} onChange={e => setSelectedCompany(e.target.value)}>
                {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          )}

          {/* Form */}
          <div className="card p-6 space-y-5">
            <h2 className="font-semibold text-gray-900">Registrer velferdstiltak</h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Type tiltak</label>
                <select className="input" value={welfareType} onChange={e => setWelfareType(e.target.value as WelfareType)}>
                  {(Object.entries(WELFARE_TYPE_LABELS) as [WelfareType, string][]).map(([v, l]) => (
                    <option key={v} value={v}>{l}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Navn på arrangementet</label>
                <input className="input" placeholder="F.eks. Julebord 2026" value={eventName} onChange={e => setEventName(e.target.value)} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Dato</label>
                <input type="date" className="input" value={eventDate} onChange={e => setEventDate(e.target.value)} />
              </div>
              <div>
                <label className="label">Sted / lokale</label>
                <input className="input" placeholder="Restaurant Alma, Oslo" value={venue} onChange={e => setVenue(e.target.value)} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Total kostnad (kr)</label>
                <input className="input" placeholder="25 000" value={totalCost} onChange={e => setTotalCost(e.target.value)} />
                <p className="text-xs text-gray-400 mt-1">Inkl. lokale, mat, drikke, underholdning, transport</p>
              </div>
              <div>
                <label className="label">Antall ansatte (inkl. ektefeller)</label>
                <input className="input" type="number" min="1" placeholder="10" value={employeeCount} onChange={e => setEmployeeCount(e.target.value)} />
              </div>
            </div>

            <div>
              <label className="label flex items-center gap-1.5">
                Mat + drikke per person (kr)
                <span className="text-xs text-gray-400 font-normal">— brukes i rimelighetsvurderingen</span>
              </label>
              <input className="input" placeholder="F.eks. 450" value={foodCostPerPerson} onChange={e => setFoodCostPerPerson(e.target.value)} />
              <p className="text-xs text-gray-400 mt-1">
                Kun kostnad for mat og drikke eks. mva. Lokale, underholdning og transport regnes ikke med.
                Grense: {REPRESENTATION_FOOD_LIMIT_PER_PERSON} kr/person.
              </p>
            </div>

            {/* Alkohol */}
            <div>
              <label className="label flex items-center gap-2"><Wine size={13} /> Alkohol som serveres</label>
              <div className="flex gap-2">
                {(['none', 'beer_wine', 'spirits'] as AlcoholType[]).map(v => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setAlcohol(v)}
                    className={`flex-1 py-2 rounded-xl border text-sm font-medium transition-colors ${
                      alcohol === v
                        ? v === 'spirits'
                          ? 'border-red-400 bg-red-50 text-red-700'
                          : 'border-brand-500 bg-brand-50 text-brand-700'
                        : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    {v === 'none' ? '🚫 Ingen' : v === 'beer_wine' ? '🍺🍷 Øl/vin' : '🥃 Brennevin'}
                  </button>
                ))}
              </div>
              {alcohol === 'spirits' && (
                <div className="mt-2 flex items-start gap-2 text-sm text-red-800 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                  <AlertTriangle size={13} className="shrink-0 mt-0.5 text-red-500" />
                  Brennevin er et rødt flagg — særlig dersom kunder deltar eller arrangementet kan klassifiseres som representasjon. Da kan hele fradraget falle bort (skatteloven § 6-21). Ren ansattfest: lavere risiko, men anbefal øl/vin.
                </div>
              )}
            </div>

            <div className="space-y-2.5">
              <label className="flex items-center gap-2 cursor-pointer text-sm">
                <input type="checkbox" checked={isForAll} onChange={e => setIsForAll(e.target.checked)} className="w-4 h-4 rounded" />
                <span className="font-medium text-gray-700">Alle ansatte er invitert</span>
                <span className="text-xs text-red-500 ml-1">{!isForAll ? '⚠️ Krav for skattefrihet' : ''}</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-sm">
                <input type="checkbox" checked={spousesIncluded} onChange={e => setSpousesIncluded(e.target.checked)} className="w-4 h-4 rounded" />
                <span className="text-gray-700">Ektefeller/samboere er inkludert</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-sm">
                <input type="checkbox" checked={hasPrivateElement} onChange={e => setHasPrivateElement(e.target.checked)} className="w-4 h-4 rounded" />
                <span className="text-gray-700">Vesentlig privat element (utlandsreise, konsert etc.)</span>
              </label>
            </div>
          </div>

          {/* ── Deltakerliste ── */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                <Users size={16} className="text-brand-600" strokeWidth={2} />
                Deltakerliste
                {participants.length > 0 && (
                  <span className="text-xs bg-brand-100 text-brand-700 px-2 py-0.5 rounded-full">{participants.length} deltakere</span>
                )}
              </h2>
              <span className="text-xs text-gray-400 bg-blue-50 text-blue-600 border border-blue-100 rounded-lg px-2 py-1">
                Krav ved bokettersyn
              </span>
            </div>

            <p className="text-sm text-gray-500 mb-4">
              Skatteetaten kan be om dokumentasjon på at alle ansatte ble invitert. En deltakerliste er det sterkeste beviset.
            </p>

            {/* Quick-add from company_people */}
            {companyPeople.length > 0 && (
              <div className="mb-3">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Ansatte i selskapet</p>
                  <button onClick={addAllPeople} className="text-xs text-brand-600 hover:text-brand-800 font-medium flex items-center gap-1">
                    <Plus size={11} /> Legg til alle
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {companyPeople.map(p => (
                    <button
                      key={p.id}
                      onClick={() => addFromPeople(p)}
                      disabled={participants.includes(p.name)}
                      className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                        participants.includes(p.name)
                          ? 'bg-green-50 border-green-200 text-green-700'
                          : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-brand-50 hover:border-brand-200'
                      }`}
                    >
                      {participants.includes(p.name) ? '✓ ' : ''}{p.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Manual add */}
            <div className="flex gap-2">
              <input
                className="input flex-1 text-sm"
                placeholder="Skriv navn og trykk Enter…"
                value={participantInput}
                onChange={e => setParticipantInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addParticipant(participantInput)}
              />
              <button
                onClick={() => addParticipant(participantInput)}
                disabled={!participantInput.trim()}
                className="btn-secondary px-3 text-sm flex items-center gap-1"
              >
                <Plus size={14} /> Legg til
              </button>
            </div>

            {participants.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {participants.map(name => (
                  <span key={name} className="inline-flex items-center gap-1 text-xs bg-brand-50 text-brand-700 border border-brand-100 px-2 py-1 rounded-full">
                    {name}
                    <button onClick={() => setParticipants(p => p.filter(n => n !== name))} className="hover:text-red-500 ml-0.5">
                      <X size={10} strokeWidth={2.5} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="card p-5">
            <label className="label">Interne notater (valgfritt)</label>
            <textarea
              className="input min-h-[72px] resize-none text-sm"
              placeholder="F.eks. faglig formål, begrunnelse for kostnaden, bilagsnummer…"
              value={notes}
              onChange={e => setNotes(e.target.value)}
            />
          </div>

          {/* Result */}
          {result && (
            <div className={`card p-6 border-2 ${
              result.risk_level === 'green' ? 'border-green-200' :
              result.risk_level === 'yellow' ? 'border-amber-200' : 'border-red-300'
            }`}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-gray-900">Vurdering</h2>
                <RiskBadge level={result.risk_level} />
              </div>

              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="bg-blue-50 rounded-xl p-3 text-center">
                  <p className="text-xs text-blue-600 font-medium mb-0.5">Per ansatt</p>
                  <p className="text-xl font-bold text-blue-700">{result.cost_per_employee_nok.toLocaleString('nb-NO')} kr</p>
                  <p className="text-xs text-blue-400">av {WELFARE_RECOMMENDED_LIMIT_PER_EMPLOYEE.toLocaleString('nb-NO')} kr grense</p>
                </div>
                <div className={`rounded-xl p-3 text-center ${result.is_tax_free_for_employees ? 'bg-green-50' : 'bg-red-50'}`}>
                  <p className={`text-xs font-medium mb-0.5 ${result.is_tax_free_for_employees ? 'text-green-600' : 'text-red-600'}`}>For ansatte</p>
                  <p className={`text-base font-bold ${result.is_tax_free_for_employees ? 'text-green-700' : 'text-red-700'}`}>
                    {result.is_tax_free_for_employees ? '✅ Skattefritt' : '❌ Skattepliktig'}
                  </p>
                </div>
                <div className={`rounded-xl p-3 text-center ${result.is_deductible_for_company ? 'bg-green-50' : 'bg-red-50'}`}>
                  <p className={`text-xs font-medium mb-0.5 ${result.is_deductible_for_company ? 'text-green-600' : 'text-red-600'}`}>For selskapet</p>
                  <p className={`text-base font-bold ${result.is_deductible_for_company ? 'text-green-700' : 'text-red-700'}`}>
                    {result.is_deductible_for_company ? '✅ Fradragsberettiget' : '❌ Ikke fradragsberettiget'}
                  </p>
                </div>
              </div>

              <div className="space-y-2 mb-5">
                {result.flags.map((f, i) => <FlagItem key={i} text={f} />)}
              </div>

              <button
                onClick={save}
                disabled={saving || !selectedCompany || !totalCost}
                className={`btn-primary w-full flex items-center justify-center gap-2 ${saveOk ? 'bg-green-600 hover:bg-green-700' : ''}`}
              >
                {saveOk ? <><CheckCircle size={15} /> Lagret!</> : saving ? 'Lagrer…' : <><Save size={15} /> Lagre med deltakerliste</>}
              </button>

              {!selectedCompany && (
                <p className="text-xs text-center text-gray-400 mt-2">Velg selskap øverst for å lagre</p>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── TAB: Julebord-guide ── */}
      {tab === 'guide' && (
        <div className="space-y-4">
          <JulebordGuide />

          {/* Populære tiltak */}
          <div className="card p-5">
            <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Heart size={16} className="text-rose-400" strokeWidth={2} />
              Populære velferdstiltak — hva er lov?
            </h2>
            <div className="space-y-4">
              {POPULAR_MEASURES.map((item, i) => (
                <div key={i} className={`rounded-xl border p-4 ${item.safe ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                  <div className="flex items-start gap-3">
                    <span className="text-xl shrink-0">{item.emoji}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-gray-900 text-sm">{item.name}</p>
                        {item.safe
                          ? <span className="text-xs text-green-700 bg-green-100 px-2 py-0.5 rounded-full font-medium">Tillatt</span>
                          : <span className="text-xs text-red-700 bg-red-100 px-2 py-0.5 rounded-full font-medium">Risiko / ikke tillatt</span>
                        }
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{item.limit}</p>
                      <ul className="space-y-0.5">
                        {item.tips.map((tip, j) => (
                          <li key={j} className="text-xs text-gray-500 flex items-start gap-1.5">
                            <span className="shrink-0 mt-0.5">{item.safe ? '💡' : '⚠️'}</span>
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dokumentasjonssjekkliste */}
          <div className="card p-5 bg-blue-50 border border-blue-200">
            <h2 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
              <CheckCircle size={16} className="text-blue-600" />
              Dokumentasjonssjekkliste — bokettersynsklar
            </h2>
            <div className="space-y-2">
              {[
                'Navn og dato på arrangementet',
                'Sted/lokale',
                'Deltakerliste — navn på ALLE som var med',
                'Kvittering(er) fra leverandør(er)',
                'Formål med arrangementet (velferd for ansatte)',
                'Bekreftelse på at alle ansatte ble invitert',
                'Spesifikasjon av mat+drikke-kostnad separat fra lokale/underholdning',
                'Bilagsnummer i regnskapet',
              ].map((item, i) => (
                <label key={i} className="flex items-center gap-2 cursor-pointer text-sm text-blue-800">
                  <input type="checkbox" className="w-4 h-4 rounded" />
                  {item}
                </label>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── TAB: Historikk ── */}
      {tab === 'history' && (
        <div>
          {history.length === 0 ? (
            <div className="card p-10 text-center">
              <Heart size={26} className="text-gray-300 mx-auto mb-3" strokeWidth={1.4} />
              <p className="text-gray-500 text-sm">Ingen registrerte velferdstiltak ennå</p>
              <button onClick={() => setTab('calculator')} className="btn-primary text-sm mt-4">
                Registrer første tiltak
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {history.map(h => (
                <div key={h.id} className={`card p-4 border-l-4 ${
                  h.risk_level === 'green' ? 'border-l-green-400' :
                  h.risk_level === 'yellow' ? 'border-l-amber-400' : 'border-l-red-400'
                }`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{h.event_name || WELFARE_TYPE_LABELS[h.welfare_type as WelfareType] || h.welfare_type}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {new Date(h.event_date).toLocaleDateString('nb-NO', { day: 'numeric', month: 'long', year: 'numeric' })}
                        {h.venue && ` · ${h.venue}`}
                      </p>
                    </div>
                    <div className="text-right shrink-0 ml-4">
                      <p className="font-bold text-gray-900">{Number(h.total_cost_nok).toLocaleString('nb-NO')} kr</p>
                      <p className="text-xs text-gray-500">{Number(h.cost_per_employee_nok).toLocaleString('nb-NO')} kr/person</p>
                      <button
                        onClick={async () => {
                          if (!confirm('Slette dette tiltaket?')) return
                          const supabase = createClient()
                          await supabase.from('welfare_measures').delete().eq('id', h.id)
                          setHistory(prev => prev.filter(x => x.id !== h.id))
                        }}
                        className="mt-1 text-gray-300 hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                  {h.participants && h.participants.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {(h.participants as string[]).slice(0, 8).map(name => (
                        <span key={name} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{name}</span>
                      ))}
                      {h.participants.length > 8 && (
                        <span className="text-xs text-gray-400">+ {h.participants.length - 8} til</span>
                      )}
                    </div>
                  )}
                  <div className="flex gap-2 mt-2">
                    {h.is_tax_free
                      ? <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">✅ Skattefritt</span>
                      : <span className="text-xs text-red-600 bg-red-50 px-2 py-0.5 rounded-full">⚠️ Skattepliktig</span>
                    }
                    {h.is_deductible
                      ? <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">✅ Fradragsberettiget</span>
                      : <span className="text-xs text-red-600 bg-red-50 px-2 py-0.5 rounded-full">❌ Ikke fradragsberettiget</span>
                    }
                    {h.alcohol_served === 'spirits' && (
                      <span className="text-xs text-red-600 bg-red-50 px-2 py-0.5 rounded-full">🥃 Sprit servert</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
