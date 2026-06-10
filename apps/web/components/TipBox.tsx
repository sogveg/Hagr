'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Lightbulb, ChevronDown, ChevronUp, ArrowRight, X } from 'lucide-react'
import { getTipsByTool, getTipsByCategory, TIPS, TIP_TYPE_LABELS, type Tip, type TipCategory } from '@/lib/shared'

interface TipBoxProps {
  /** Filter til verktøy-URL (f.eks. "/welfare") — viser tips relevante for dette verktøyet */
  toolHref?: string
  /** Filter til kategori */
  category?: TipCategory
  /** Maks antall tips å vise (default 3) */
  maxTips?: number
  /** Vis kompakt variant uten utvidet innhold */
  compact?: boolean
  /** Overskrift (default "Visste du at...") */
  title?: string
}

function SingleTip({ tip, compact }: { tip: Tip; compact?: boolean }) {
  const [expanded, setExpanded] = useState(false)

  const typeColor = {
    saving:   'border-l-green-400 bg-green-50',
    gotcha:   'border-l-amber-400 bg-amber-50',
    rule:     'border-l-blue-400 bg-blue-50',
    planning: 'border-l-purple-400 bg-purple-50',
  }[tip.type]

  const typeTextColor = {
    saving:   'text-green-700',
    gotcha:   'text-amber-700',
    rule:     'text-blue-700',
    planning: 'text-purple-700',
  }[tip.type]

  return (
    <div className={`border-l-4 rounded-r-xl px-4 py-3 ${typeColor}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className={`text-xs font-semibold ${typeTextColor}`}>
              {TIP_TYPE_LABELS[tip.type]}
            </span>
            {tip.impact && (
              <span className="text-xs bg-white/70 text-green-700 border border-green-200 px-2 py-0.5 rounded-full font-medium">
                {tip.impact}
              </span>
            )}
          </div>
          <p className="text-sm font-semibold text-gray-900 leading-snug">{tip.title}</p>

          {!compact && (
            <>
              {expanded ? (
                <div className="mt-2">
                  <p className="text-sm text-gray-700 leading-relaxed">{tip.body}</p>
                  {tip.law_ref && (
                    <p className="text-xs text-gray-400 mt-2">📌 {tip.law_ref}</p>
                  )}
                  {tip.tool_href && tip.tool_href !== window?.location?.pathname && (
                    <Link
                      href={tip.tool_href}
                      className="inline-flex items-center gap-1 text-xs text-brand-600 hover:text-brand-800 font-medium mt-2"
                    >
                      Åpne verktøy <ArrowRight size={11} />
                    </Link>
                  )}
                </div>
              ) : (
                <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{tip.body}</p>
              )}
            </>
          )}
        </div>
        {!compact && (
          <button
            onClick={() => setExpanded(v => !v)}
            className="shrink-0 text-gray-400 hover:text-gray-600 mt-0.5"
          >
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        )}
      </div>
    </div>
  )
}

export default function TipBox({
  toolHref,
  category,
  maxTips = 3,
  compact = false,
  title = 'Tips og regler',
}: TipBoxProps) {
  const [dismissed, setDismissed] = useState(false)
  const [showAll, setShowAll] = useState(false)

  const tips = useMemo(() => {
    let pool: Tip[]
    if (toolHref) {
      pool = getTipsByTool(toolHref)
    } else if (category) {
      pool = getTipsByCategory(category)
    } else {
      pool = TIPS
    }
    // Stable sort: saving first, then gotcha, then rule, then planning
    const order = { saving: 0, gotcha: 1, rule: 2, planning: 3 }
    return [...pool].sort((a, b) => order[a.type] - order[b.type])
  }, [toolHref, category])

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
        <button onClick={() => setDismissed(true)} className="text-gray-300 hover:text-gray-500">
          <X size={14} />
        </button>
      </div>

      <div className="space-y-2.5">
        {visible.map(tip => (
          <SingleTip key={tip.id} tip={tip} compact={compact} />
        ))}
      </div>

      {hasMore && !showAll && (
        <button
          onClick={() => setShowAll(true)}
          className="mt-3 text-xs text-brand-600 hover:text-brand-800 font-medium flex items-center gap-1"
        >
          Vis alle {tips.length} tips <ChevronDown size={11} />
        </button>
      )}

      {showAll && hasMore && (
        <button
          onClick={() => setShowAll(false)}
          className="mt-3 text-xs text-gray-400 hover:text-gray-600 font-medium flex items-center gap-1"
        >
          Vis færre <ChevronUp size={11} />
        </button>
      )}
    </div>
  )
}
