'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  RULE_CARDS, RULE_CATEGORIES, type RuleCard, type RuleCardRiskLevel,
  TIPS, TIP_TYPE_LABELS, TIP_CATEGORY_LABELS, type Tip, type TipCategory,
} from '@/lib/shared'
import {
  ShieldCheck, ShieldAlert, ShieldX, ChevronDown, ChevronUp, BookOpen,
  Search, Lightbulb, ArrowRight, Filter, Sparkles,
} from 'lucide-react'

// ── Helpers ───────────────────────────────────────────────────────────────────

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
    <div className="card overflow-hidden">
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
              {card.company_types.map(ct => (
                <span key={ct} className="text-xs text-gray-400 border border-gray-200 px-2 py-0.5 rounded">{ct}</span>
              ))}
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
        <div className="border-t border-gray-100 p-5 space-y-5">
          <div className="grid grid-cols-3 gap-4">
            {card.green_examples.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-green-700 mb-2 flex items-center gap-1">
                  <ShieldCheck size={11} strokeWidth={2.5} /> Grønne eksempler
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
                  <ShieldAlert size={11} strokeWidth={2.5} /> Gule eksempler
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
                  <ShieldX size={11} strokeWidth={2.5} /> Røde eksempler
                </p>
                <ul className="space-y-1.5">
                  {card.red_examples.map((ex, i) => (
                    <li key={i} className="text-xs text-gray-600 bg-red-50 rounded-md px-2.5 py-1.5">{ex}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-700 mb-2">Dokumentasjonskrav</p>
            <ul className="flex flex-wrap gap-2">
              {card.required_documentation.map((doc, i) => (
                <li key={i} className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-md">{doc}</li>
              ))}
            </ul>
          </div>
          <p className="text-xs text-gray-400">Sist oppdatert: {card.updated_year}</p>
        </div>
      )}
    </div>
  )
}

function TipRow({ tip }: { tip: Tip }) {
  const [open, setOpen] = useState(false)
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
    <div className={`border-l-4 rounded-r-xl ${borderColor}`}>
      <button className="w-full text-left px-4 py-3" onClick={() => setOpen(v => !v)}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-0.5 flex-wrap">
              <span className={`text-xs font-semibold ${textColor}`}>{TIP_TYPE_LABELS[tip.type]}</span>
              {tip.impact && (
                <span className="text-xs bg-white/70 text-green-700 border border-green-200 px-2 py-0.5 rounded-full font-medium">
                  {tip.impact}
                </span>
              )}
            </div>
            <p className="text-sm font-semibold text-gray-900 leading-snug">{tip.title}</p>
            {!open && <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{tip.body}</p>}
          </div>
          {open ? <ChevronUp size={14} className="text-gray-400 shrink-0 mt-0.5" /> : <ChevronDown size={14} className="text-gray-400 shrink-0 mt-0.5" />}
        </div>
      </button>
      {open && (
        <div className="px-4 pb-4">
          <p className="text-sm text-gray-700 leading-relaxed">{tip.body}</p>
          <div className="flex items-center gap-3 mt-3 flex-wrap">
            {tip.law_ref && <span className="text-xs text-gray-400">📌 {tip.law_ref}</span>}
            {tip.tool_href && (
              <Link href={tip.tool_href} className="inline-flex items-center gap-1 text-xs text-brand-600 hover:text-brand-800 font-medium">
                Åpne verktøy <ArrowRight size={10} />
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────

type ActiveTab = 'tips' | 'regler'

export default function RulesPage() {
  const [tab, setTab] = useState<ActiveTab>('tips')
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('Alle')
  const [selectedTipType, setSelectedTipType] = useState<string>('Alle')

  // ── Tips filtering ──
  const filteredTips = useMemo(() => {
    return TIPS.filter(tip => {
      const matchSearch = !search ||
        tip.title.toLowerCase().includes(search.toLowerCase()) ||
        tip.body.toLowerCase().includes(search.toLowerCase()) ||
        tip.tags.some(t => t.includes(search.toLowerCase()))
      const matchCat = selectedCategory === 'Alle' || TIP_CATEGORY_LABELS[tip.category as TipCategory] === selectedCategory
      const matchType = selectedTipType === 'Alle' || TIP_TYPE_LABELS[tip.type as any] === selectedTipType
      return matchSearch && matchCat && matchType
    })
  }, [search, selectedCategory, selectedTipType])

  // ── Rule cards filtering ──
  const [selectedRuleCategory, setSelectedRuleCategory] = useState('Alle')
  const [selectedRisk, setSelectedRisk] = useState('Alle')

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

  // Unique tip categories
  const tipCategories = ['Alle', ...Object.values(TIP_CATEGORY_LABELS)]
  const tipTypes = ['Alle', ...Object.values(TIP_TYPE_LABELS)]

  const gotchaCount = TIPS.filter(t => t.type === 'gotcha').length
  const savingCount = TIPS.filter(t => t.type === 'saving').length

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Lightbulb size={22} className="text-amber-500" strokeWidth={2} />
          Regelbibliotek & tips
        </h1>
        <p className="text-gray-500 mt-1 text-sm">
          Det du betaler for: konkrete regler, fallgruver og sparetips — oppdatert for {new Date().getFullYear()}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="card p-4 text-center">
          <p className="text-2xl font-bold text-brand-700">{TIPS.length}</p>
          <p className="text-xs text-gray-500 mt-0.5">Tips og triks</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-2xl font-bold text-amber-600">{gotchaCount}</p>
          <p className="text-xs text-gray-500 mt-0.5">Fallgruver å unngå</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-2xl font-bold text-green-600">{savingCount}</p>
          <p className="text-xs text-gray-500 mt-0.5">Sparemuligheter</p>
        </div>
      </div>

      {/* Search — felles for begge tabs */}
      <div className="relative mb-4">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          className="input pl-9 w-full"
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
            tab === 'regler' ? 'border-brand-600 text-brand-700' : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <BookOpen size={14} /> Regelkort ({filteredRules.length})
        </button>
      </div>

      {/* ── TIPS TAB ── */}
      {tab === 'tips' && (
        <>
          {/* Filters */}
          <div className="flex gap-2 mb-4 flex-wrap">
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <Filter size={12} /> Filter:
            </div>
            <select
              className="input text-sm py-1.5 flex-1 min-w-36"
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
            >
              {tipCategories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select
              className="input text-sm py-1.5 w-44"
              value={selectedTipType}
              onChange={e => setSelectedTipType(e.target.value)}
            >
              {tipTypes.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          {/* Featured gotchas */}
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

          {filteredTips.length > 0 ? (
            <div className="space-y-2">
              {filteredTips.map(tip => <TipRow key={tip.id} tip={tip} />)}
            </div>
          ) : (
            <div className="card p-10 text-center">
              <Lightbulb size={24} className="text-gray-300 mx-auto mb-3" strokeWidth={1.4} />
              <p className="text-gray-500 text-sm">Ingen tips matcher søket</p>
            </div>
          )}
        </>
      )}

      {/* ── REGELKORT TAB ── */}
      {tab === 'regler' && (
        <>
          <div className="flex gap-2 mb-4 flex-wrap">
            <select className="input text-sm py-1.5 flex-1" value={selectedRuleCategory} onChange={e => setSelectedRuleCategory(e.target.value)}>
              <option value="Alle">Alle kategorier</option>
              {RULE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select className="input text-sm py-1.5 w-36" value={selectedRisk} onChange={e => setSelectedRisk(e.target.value)}>
              <option value="Alle">Alle risikonivå</option>
              <option value="green">Lav risiko</option>
              <option value="yellow">Moderat</option>
              <option value="red">Høy risiko</option>
            </select>
          </div>

          {filteredRules.length > 0 ? (
            <div className="space-y-3">
              {filteredRules.map(card => <RuleCardView key={card.id} card={card} />)}
            </div>
          ) : (
            <div className="card p-10 text-center">
              <BookOpen size={24} className="text-gray-300 mx-auto mb-3" strokeWidth={1.4} />
              <p className="text-gray-500 text-sm">Ingen regelkort matcher søket</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}
