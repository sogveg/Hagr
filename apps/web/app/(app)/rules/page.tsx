'use client'

import { useState } from 'react'
import { RULE_CARDS, RULE_CATEGORIES, type RuleCard, type RuleCardRiskLevel } from '@/lib/shared'
import { ShieldCheck, ShieldAlert, ShieldX, ChevronDown, ChevronUp, BookOpen, Search } from 'lucide-react'

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

export default function RulesPage() {
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Alle')
  const [selectedRisk, setSelectedRisk] = useState('Alle')

  const filtered = RULE_CARDS.filter(card => {
    const matchSearch = !search ||
      card.title.toLowerCase().includes(search.toLowerCase()) ||
      card.summary.toLowerCase().includes(search.toLowerCase())
    const matchCat = selectedCategory === 'Alle' || card.category === selectedCategory
    const matchRisk = selectedRisk === 'Alle' || card.base_risk === selectedRisk
    return matchSearch && matchCat && matchRisk
  })

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Regelbibliotek</h1>
        <p className="text-gray-500 mt-1 text-sm">
          Alle regler, grenser og dokumentasjonskrav — oppdatert for {new Date().getFullYear()}
        </p>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-6 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            className="input pl-9"
            placeholder="Søk i regler…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select className="input w-48" value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}>
          <option value="Alle">Alle kategorier</option>
          {RULE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select className="input w-36" value={selectedRisk} onChange={e => setSelectedRisk(e.target.value)}>
          <option value="Alle">Alle risiko</option>
          <option value="green">Lav risiko</option>
          <option value="yellow">Moderat</option>
          <option value="red">Høy risiko</option>
        </select>
      </div>

      <p className="text-sm text-gray-400 mb-4">{filtered.length} regel{filtered.length !== 1 ? 'kort' : 'kort'}</p>

      {filtered.length > 0 ? (
        <div className="space-y-3">
          {filtered.map(card => <RuleCardView key={card.id} card={card} />)}
        </div>
      ) : (
        <div className="card p-10 text-center">
          <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <BookOpen size={26} className="text-gray-400" strokeWidth={1.4} />
          </div>
          <p className="text-gray-500 text-sm">Ingen regler matcher søket</p>
        </div>
      )}
    </div>
  )
}
