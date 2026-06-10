'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Lightbulb, ChevronDown, ChevronUp, ArrowRight, X } from 'lucide-react'
// ChevronDown/Up used for show-more/less, ArrowRight for tool link
import { getTipsByTool, getTipsByCategory, TIPS, TIP_TYPE_LABELS, getTipBody, getTipTitle, type Tip, type TipCategory } from '@/lib/shared'
import { useLanguageMode } from '@/contexts/LanguageMode'

interface TipBoxProps {
  toolHref?: string
  category?: TipCategory
  maxTips?: number
  title?: string
}

const TYPE_COLOR: Record<string, string> = {
  saving:   'border-l-green-400 bg-green-50',
  gotcha:   'border-l-amber-400 bg-amber-50',
  rule:     'border-l-blue-400 bg-blue-50',
  planning: 'border-l-purple-400 bg-purple-50',
}

const TYPE_TEXT: Record<string, string> = {
  saving:   'text-green-700',
  gotcha:   'text-amber-700',
  rule:     'text-blue-700',
  planning: 'text-purple-700',
}

const TYPE_ORDER: Record<string, number> = { saving: 0, gotcha: 1, rule: 2, planning: 3 }

// Plain-language labels for "enkel" mode
const TYPE_LABELS_ENKEL: Record<string, string> = {
  saving:   '💰 Spar penger',
  gotcha:   '⚠️ Pass på',
  rule:     '📋 Regel',
  planning: '📅 Planlegg',
}

function sortTips(pool: Tip[]): Tip[] {
  return [...pool].sort((a, b) => (TYPE_ORDER[a.type] ?? 9) - (TYPE_ORDER[b.type] ?? 9))
}

function getPool(toolHref?: string, category?: TipCategory): Tip[] {
  if (toolHref) return sortTips(getTipsByTool(toolHref))
  if (category) return sortTips(getTipsByCategory(category))
  return sortTips(TIPS)
}

function SingleTip({ tip, currentPath, mode }: { tip: Tip; currentPath: string; mode: 'enkel' | 'pro' }) {
  return (
    <div className={`border-l-4 rounded-r-xl px-4 py-3 ${TYPE_COLOR[tip.type] ?? 'border-l-gray-300 bg-gray-50'}`}>
      <div className="flex items-center gap-2 mb-1 flex-wrap">
        <span className={`text-xs font-semibold ${TYPE_TEXT[tip.type] ?? 'text-gray-600'}`}>
          {mode === 'enkel' ? (TYPE_LABELS_ENKEL[tip.type] ?? TIP_TYPE_LABELS[tip.type]) : TIP_TYPE_LABELS[tip.type]}
        </span>
        {tip.impact && (
          <span className="text-xs bg-white/70 text-green-700 border border-green-200 px-2 py-0.5 rounded-full font-medium">
            {tip.impact}
          </span>
        )}
      </div>
      <p className="text-sm font-semibold text-gray-900 leading-snug mb-1">{getTipTitle(tip, mode)}</p>
      <p className="text-sm text-gray-700 leading-relaxed">{getTipBody(tip, mode)}</p>
      {tip.law_ref && (
        <p className="text-xs text-gray-400 mt-1.5">📌 {tip.law_ref}</p>
      )}
      {tip.tool_href && tip.tool_href !== currentPath && (
        <Link
          href={tip.tool_href}
          className="inline-flex items-center gap-1 text-xs text-brand-600 hover:text-brand-800 font-medium mt-1.5"
        >
          Åpne verktøy <ArrowRight size={11} />
        </Link>
      )}
    </div>
  )
}

export default function TipBox({
  toolHref,
  category,
  maxTips = 3,
  title = 'Tips og regler',
}: TipBoxProps) {
  const pathname = usePathname()
  const { mode } = useLanguageMode()
  const [dismissed, setDismissed] = useState(false)
  const [showAll, setShowAll] = useState(false)

  // Computed once — stable because inputs are module-level constants
  const tips = getPool(toolHref, category)

  if (dismissed || tips.length === 0) return null

  const visible = showAll ? tips : tips.slice(0, maxTips)
  const hasMore = tips.length > maxTips

  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50/40 p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-amber-100 rounded-lg flex items-center justify-center">
            <Lightbulb size={13} className="text-amber-600" strokeWidth={2} />
          </div>
          <span className="text-sm font-semibold text-gray-800">{title}</span>
          <span className="text-xs text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full">
            {tips.length} tips
          </span>
        </div>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="text-gray-300 hover:text-gray-500"
        >
          <X size={14} />
        </button>
      </div>

      <div className="space-y-2.5">
        {visible.map(tip => (
          <SingleTip key={tip.id} tip={tip} currentPath={pathname} mode={mode} />
        ))}
      </div>

      {hasMore && !showAll && (
        <button
          type="button"
          onClick={() => setShowAll(true)}
          className="mt-3 text-xs text-brand-600 hover:text-brand-800 font-medium flex items-center gap-1"
        >
          Vis alle {tips.length} tips <ChevronDown size={11} />
        </button>
      )}

      {showAll && hasMore && (
        <button
          type="button"
          onClick={() => setShowAll(false)}
          className="mt-3 text-xs text-gray-400 hover:text-gray-600 font-medium flex items-center gap-1"
        >
          Vis færre <ChevronUp size={11} />
        </button>
      )}
    </div>
  )
}
