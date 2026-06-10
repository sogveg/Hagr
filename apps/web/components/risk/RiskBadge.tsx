import type { RiskLevel } from '@skattsmart/shared'

interface Props {
  level: RiskLevel
  score?: number
  size?: 'sm' | 'md'
}

const CONFIG: Record<RiskLevel, { label: string; className: string; dot: string }> = {
  green: {
    label: 'Lav risiko',
    className: 'bg-green-100 text-green-700',
    dot: 'bg-green-500',
  },
  yellow: {
    label: 'Moderat risiko',
    className: 'bg-yellow-100 text-yellow-700',
    dot: 'bg-yellow-500',
  },
  red: {
    label: 'Høy risiko',
    className: 'bg-red-100 text-red-700',
    dot: 'bg-red-500',
  },
}

export default function RiskBadge({ level, score, size = 'md' }: Props) {
  const { label, className, dot } = CONFIG[level]
  const text = size === 'sm' ? 'text-xs' : 'text-sm'
  const px = size === 'sm' ? 'px-2 py-0.5' : 'px-3 py-1'
  return (
    <span className={`inline-flex items-center gap-1.5 ${px} rounded-full font-medium ${text} ${className}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {label}
      {score !== undefined && <span className="opacity-60">({score})</span>}
    </span>
  )
}
