import type { RiskResult } from '@/lib/shared'
import RiskBadge from './RiskBadge'

interface Props {
  result: RiskResult
}

export default function RiskCard({ result }: Props) {
  return (
    <div className="card p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">Risikovurdering</h3>
        <RiskBadge level={result.level} score={result.score} />
      </div>

      {result.reasons.length > 0 && (
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Risikofaktorer</p>
          <ul className="space-y-1">
            {result.reasons.map((r, i) => (
              <li key={i} className="text-sm text-gray-700 flex gap-2">
                <span className="text-yellow-500 mt-0.5">⚠</span>
                {r}
              </li>
            ))}
          </ul>
        </div>
      )}

      {result.required_documentation.length > 0 && (
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Påkrevd dokumentasjon</p>
          <ul className="space-y-1">
            {result.required_documentation.map((d, i) => (
              <li key={i} className="text-sm text-gray-700 flex gap-2">
                <span className="text-blue-500 mt-0.5">□</span>
                {d}
              </li>
            ))}
          </ul>
        </div>
      )}

      {result.risk_reducing_actions.length > 0 && (
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Risikoreduserende tiltak</p>
          <ul className="space-y-1">
            {result.risk_reducing_actions.map((a, i) => (
              <li key={i} className="text-sm text-gray-700 flex gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                {a}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
