import { type ReactNode } from 'react'
import { CheckCircle } from 'lucide-react'

interface EmptyToolStateProps {
  icon: ReactNode
  title: string
  tagline: string          // "Inntil X kr kan gis skattefritt"
  description: string
  bulletPoints?: string[]
  lawRef?: string
  children?: ReactNode     // CTA button(s)
}

/**
 * Full-width "why this matters" banner shown when a tool has no data yet.
 * Disappears as soon as the user adds their first record.
 */
export default function EmptyToolState({
  icon,
  title,
  tagline,
  description,
  bulletPoints,
  lawRef,
  children,
}: EmptyToolStateProps) {
  return (
    <div className="rounded-2xl border border-brand-100 bg-gradient-to-br from-brand-50 to-white p-6 mb-6">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-brand-100 rounded-xl flex items-center justify-center shrink-0">
          {icon}
        </div>
        <div className="flex-1">
          <p className="text-xs font-semibold text-brand-600 uppercase tracking-wide mb-1">{tagline}</p>
          <h2 className="text-lg font-bold text-gray-900 mb-2">{title}</h2>
          <p className="text-gray-600 text-sm leading-relaxed mb-3">{description}</p>
          {bulletPoints && bulletPoints.length > 0 && (
            <ul className="space-y-1.5 mb-4">
              {bulletPoints.map((point, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                  <CheckCircle size={14} className="text-green-500 mt-0.5 shrink-0" />
                  {point}
                </li>
              ))}
            </ul>
          )}
          {lawRef && (
            <p className="text-xs text-gray-400 mb-4">📌 {lawRef}</p>
          )}
          {children && (
            <div className="flex flex-wrap gap-3">
              {children}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
