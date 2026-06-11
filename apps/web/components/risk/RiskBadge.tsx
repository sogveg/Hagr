import type { RiskLevel } from '@/lib/shared'
import { ShieldCheck, ShieldAlert, ShieldX } from 'lucide-react'

interface Props {
  level: RiskLevel
  score?: number
  size?: 'sm' | 'md'
}

const CONFIG: Record<RiskLevel, {
  label: string
  className: string
  Icon: typeof ShieldCheck
}> = {
  green:  { label: 'Lav risiko',      className: 'bg-green-50  text-green-700  border border-green-200',  Icon: ShieldCheck },
  yellow: { label: 'Moderat risiko',  className: 'bg-yellow-50 text-yellow-700 border border-yellow-200', Icon: ShieldAlert },
  red:    { label: 'Høy risiko',      className: 'bg-red-50    text-red-700    border border-red-200',    Icon: ShieldX },
}

export default function RiskBadge({ level, score, size = 'md' }: Props) {
  const { label, className, Icon } = CONFIG[level]
  const textSize = size === 'sm' ? 'text-xs' : 'text-sm'
  const px = size === 'sm' ? 'px-2 py-0.5' : 'px-3 py-1'
  const iconSize = size === 'sm' ? 13 : 15

  return (
    <span className={`inline-flex items-center gap-1.5 ${px} rounded-full font-medium ${textSize} ${className}`}>
      <Icon size={iconSize} strokeWidth={2} />
      {label}
      {score !== undefined && <span className="opacity-50 font-normal">({score})</span>}
    </span>
  )
}
