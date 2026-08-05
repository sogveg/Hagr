'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  RULE_CARDS, RULE_CATEGORIES, type RuleCard, type RuleCardRiskLevel,
  TIPS, TIP_TYPE_LABELS, TIP_CATEGORY_LABELS, type Tip, type TipCategory, type TipType,
} from '@/lib/shared'
import {
  ShieldCheck, ShieldAlert, ShieldX, ChevronDown, ChevronUp, BookOpen,
  Search, Lightbulb, ArrowRight, Filter, Sparkles,
} from 'lucide-react'

function RiskPill({ level }: { level: RuleCardRiskLevel }) {
  if (level === 'green') return (
    <span className="inline-flex items-center gap-1 text-xs bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded-full font-medium">
      <ShieldCheck size={11} strokeWidth={2} /> Lav risiko
    </span>
  )
  if (level === 'yellow') return (
    <span className="inline-flex items-center gap-1 text-xs bg-yellow-50 text-yellow-700 border border-yellow-200 px-2 py-0.5 rounded-full font-medium">
      <ShieldAlert size={11} strokeWidth={2} /> Moderat risiko
    </span>
  )
  return (
    <span className="inline-flex items-center gap-1 text-xs bg-red-50 text-red-700 border border-red-200 px-2 py-0.5 rounded-full font-medium">
      <ShieldX size={11} strokeWidth={2} /> Høy risiko
    </span>
  )
}

function RuleCardView({ card }: { card: RuleCard }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <button onClick={() => setOpen(v => !v)} className="w-full p-5 text-left">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h3 className="font-semibold text-gray-900">{card.title}</h3>
              <RiskPill level={card.base_risk} />
            </div>
            <p className="text-sm text-gray-500 line-clamp-2">{card.summary}</p>
            <div className="flex items-center gap-3 mt-2 flex-wrap">
              {card.limit_amount && (
                <span className="text-xs bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 rounded font-mono font-medium">
                  {card.limit_amount.toLocaleString('nb-NO')} {card.limit_unit}
                </span>
              )}
              {card.law_reference && (
                <span className="text-xs text-gray-400">{card.law_reference}</span>
              )}
            </div>
          </div>
          <div className="shrink-0 mt-0.5">
            {open ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
          </div>
        </div>
      </button>
      {open && (
        <div className="border-t border-gray-100 p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {card.green_examples.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-green-700 mb-2 flex items-center gap-1">
                  <ShieldCheck size={11} strokeWidth={2.5} /> OK-eksempler
                </p>
                <ul className="space-y-1.5">
                  {card.green_examples.map((ex, i) => (
                    <li key={i} className="text-xs text-gray-600 bg-green-50 rounded-md px-2.5 py-1.5">{ex}</li>
                  ))}
                </ul>
              </div>
            )}
            {card.yellow_examples.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-yellow-700 mb-2 flex items-center gap-1">
                  <ShieldAlert size={11} strokeWidth={2.5} /> Gråsone
                </p>
                <ul className="space-y-1.5">
                  {card.yellow_examples.map((ex, i) => (
                    <li key={i} className="text-xs text-gray-600 bg-yellow-50 rounded-md px-2.5 py-1.5">{ex}</li>
                  ))}
                </ul>
              </div>
            )}
            {card.red_examples.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-red-700 mb-2 flex items-center gap-1">
                  <ShieldX size={11} strokeWidth={2.5} /> Ikke OK
                </p>
                <ul className="space-y-1.5">
                  {card.red_examples.map((ex, i) => (
                    <li key={i} className="text-xs text-gray-600 bg-red-50 rounded-md px-2.5 py-1.5">{ex}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          {card.required_documentation.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-700 mb-2">Dokumentasjonskrav</p>
              <ul className="flex flex-wrap gap-2">
                {card.required_documentation.map((doc, i) => (
                  <li key={i} className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-md">{doc}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function TipRow({ tip }: { tip: Tip }) {
  const borderColor = {
    saving:   'border-l-green-400 bg-green-50',
    gotcha:   'border-l-amber-400 bg-amber-50',
    rule:     'border-l-blue-400 bg-blue-50',
    planning: 'border-l-purple-400 bg-purple-50',
  }[tip.type]
  const textColor = {
    saving:   'text-green-700',
    gotcha:   'text-amber-700',
    rule:     'text-blue-700',
    planning: 'text-purple-700',
  }[tip.type]

  return (
    <div className={`border-l-4 rounded-r-xl px-4 py-3 ${borderColor}`}>
      <div className="flex items-center gap-2 mb-0.5 flex-wrap">
        <span className={`text-xs font-semibold ${textColor}`}>{TIP_TYPE_LABELS[tip.type]}</span>
        {tip.impact && (
          <span className="text-xs bg-white/70 text-green-700 border border-green-200 px-2 py-0.5 rounded-full font-medium">
            {tip.impact}
          </span>
        )}
      </div>
      <p className="text-sm font-semibold text-gray-900 leading-snug mb-1">{tip.title}</p>
      <p className="text-sm text-gray-700 leading-relaxed">{tip.body}</p>
      {(tip.law_ref || tip.tool_href) && (
        <div className="flex items-center gap-3 mt-2 flex-wrap">
          {tip.law_ref && <span className="text-xs text-gray-400">📌 {tip.law_ref}</span>}
          {tip.tool_href && (
            <Link href={`/login`} className="inline-flex items-center gap-1 text-xs text-violet-600 hover:text-violet-800 font-medium">
              Prøv verktøyet <ArrowRight size={10} />
            </Link>
          )}
        </div>
      )}
    </div>
  )
}

type ActiveTab = 'tips' | 'regler'

export default function DemoTipsPage() {
  const [tab, setTab] = useState<ActiveTab>('tips')
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('Alle')
  const [selectedTipType, setSelectedTipType] = useState<string>('Alle')
  const [selectedRuleCategory, setSelectedRuleCategory] = useState('Alle')
  const [selectedRisk, setSelectedRisk] = useState('Alle')

  const filteredTips = useMemo(() => {
    return TIPS.filter(tip => {
      const matchSearch = !search ||
        tip.title.toLowerCase().includes(search.toLowerCase()) ||
        tip.body.toLowerCase().includes(search.toLowerCase()) ||
        tip.tags.some(t => t.includes(search.toLowerCase()))
      const matchCat = selectedCategory === 'Alle' || TIP_CATEGORY_LABELS[tip.category as TipCategory] === selectedCategory
      const matchType = selectedTipType === 'Alle' || TIP_TYPE_LABELS[tip.type as TipType] === selectedTipType
      return matchSearch && matchCat && matchType
    })
  }, [search, selectedCategory, selectedTipType])

  const filteredRules = useMemo(() => {
    return RULE_CARDS.filter(card => {
      const matchSearch = !search ||
        card.title.toLowerCase().includes(search.toLowerCase()) ||
        card.summary.toLowerCase().includes(search.toLowerCase())
      const matchCat = selectedRuleCategory === 'Alle' || card.category === selectedRuleCategory
      const matchRisk = selectedRisk === 'Alle' || card.base_risk === selectedRisk
      return matchSearch && matchCat && matchRisk
    })
  }, [search, selectedRuleCategory, selectedRisk])

  const tipCategories = ['Alle', ...Object.values(TIP_CATEGORY_LABELS)]
  const tipTypes = ['Alle', ...Object.values(TIP_TYPE_LABELS)]
  const gotchaCount = TIPS.filter(t => t.type === 'gotcha').length
  const savingCount = TIPS.filter(t => t.type === 'saving').length

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-white text-xs font-bold">H</span>
            </div>
            <span className="text-lg font-bold text-gray-900">Hagr</span>
            <span className="text-gray-300 mx-1">·</span>
            <span className="text-sm text-gray-500">Regelbibliotek & tips</span>
          </div>
          <Link
            href="/login"
            className="text-sm bg-violet-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-violet-700 transition-colors"
          >
            Logg inn
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Lightbulb size={22} className="text-amber-500" strokeWidth={2} />
            Regelbibliotek & tips
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            Konkrete regler, fallgruver og sparetips for AS-eiere — oppdatert for {new Date().getFullYear()}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-white rounded-xl border border-gray-200 p-4 text-center shadow-sm">
            <p className="text-2xl font-bold text-violet-700">{TIPS.length}</p>
            <p className="text-xs text-gray-500 mt-0.5">Tips og triks</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 text-center shadow-sm">
            <p className="text-2xl font-bold text-amber-600">{gotchaCount}</p>
            <p className="text-xs text-gray-500 mt-0.5">Fallgruver å unngå</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 text-center shadow-sm">
            <p className="text-2xl font-bold text-green-600">{savingCount}</p>
            <p className="text-xs text-gray-500 mt-0.5">Sparemuligheter</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/30"
            placeholder="Søk etter tips, regler, emner…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-gray-200 mb-5">
          <button
            onClick={() => setTab('tips')}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
              tab === 'tips' ? 'border-amber-500 text-amber-700' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Lightbulb size={14} /> Tips & triks ({filteredTips.length})
          </button>
          <button
            onClick={() => setTab('regler')}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
              tab === 'regler' ? 'border-violet-600 text-violet-700' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <BookOpen size={14} /> Regelkort ({filteredRules.length})
          </button>
        </div>

        {/* Tips tab */}
        {tab === 'tips' && (
          <>
            <div className="flex gap-2 mb-4 flex-wrap">
              <div className="flex items-center gap-1.5 text-xs text-gray-400">
                <Filter size={12} /> Filter:
              </div>
              <select
                className="flex-1 min-w-36 px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none"
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
              >
                {tipCategories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <select
                className="w-44 px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none"
                value={selectedTipType}
                onChange={e => setSelectedTipType(e.target.value)}
              >
                {tipTypes.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            {selectedCategory === 'Alle' && selectedTipType === 'Alle' && !search && (
              <div className="mb-5">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles size={14} className="text-amber-500" />
                  <span className="text-sm font-semibold text-gray-700">Viktigst å vite — fallgruver AS-eiere går i</span>
                </div>
                <div className="space-y-2">
                  {TIPS.filter(t => t.type === 'gotcha').slice(0, 4).map(tip => (
                    <TipRow key={tip.id} tip={tip} />
                  ))}
                </div>
                <div className="border-t border-gray-100 my-5" />
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm font-semibold text-gray-700">💰 Sparemuligheter du kanskje ikke kjenner til</span>
                </div>
                <div className="space-y-2">
                  {TIPS.filter(t => t.type === 'saving').slice(0, 4).map(tip => (
                    <TipRow key={tip.id} tip={tip} />
                  ))}
                </div>
                <div className="border-t border-gray-100 my-5" />
                <p className="text-sm font-semibold text-gray-700 mb-3">Alle tips</p>
              </div>
            )}

            <div className="space-y-2">
              {filteredTips.map(tip => <TipRow key={tip.id} tip={tip} />)}
            </div>
          </>
        )}

        {/* Regelkort tab */}
        {tab === 'regler' && (
          <>
            <div className="flex gap-2 mb-4 flex-wrap">
              <select
                className="flex-1 px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none"
                value={selectedRuleCategory}
                onChange={e => setSelectedRuleCategory(e.target.value)}
              >
                <option value="Alle">Alle kategorier</option>
                {RULE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <select
                className="w-36 px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none"
                value={selectedRisk}
                onChange={e => setSelectedRisk(e.target.value)}
              >
                <option value="Alle">Alle risikonivå</option>
                <option value="green">Lav risiko</option>
                <option value="yellow">Moderat</option>
                <option value="red">Høy risiko</option>
              </select>
            </div>
            <div className="space-y-3">
              {filteredRules.map(card => <RuleCardView key={card.id} card={card} />)}
            </div>
          </>
        )}

        {/* CTA */}
        <div className="mt-12 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-2xl p-8 text-center text-white">
          <h2 className="text-xl font-bold mb-2">Få full tilgang til Hagr</h2>
          <p className="text-violet-200 text-sm mb-5">Firmabilkalkulator, kjørebok, lønn vs. utbytte, AI-skatteassistent og mer.</p>
          <Link
            href="/signup"
            className="inline-block bg-white text-violet-700 font-bold px-6 py-3 rounded-xl hover:bg-violet-50 transition-colors"
          >
            Kom i gang gratis
          </Link>
        </div>
      </div>
    </div>
  )
}
