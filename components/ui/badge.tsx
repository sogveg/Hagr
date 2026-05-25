type BadgeVariant = 
  | 'available' 
  | 'reserved' 
  | 'active' 
  | 'cleaning' 
  | 'overdue' 
  | 'damaged' 
  | 'completed' 
  | 'cancelled'
  | 'default'

interface BadgeProps {
  variant?: BadgeVariant
  children: React.ReactNode
  dot?: boolean
  className?: string
}

const variantStyles: Record<BadgeVariant, { bg: string; text: string; dot: string }> = {
  available: { 
    bg: 'bg-[var(--color-primary-light)]', 
    text: 'text-[#5A7A55]',
    dot: 'bg-[var(--color-available)]'
  },
  reserved: { 
    bg: 'bg-blue-50', 
    text: 'text-[var(--color-reserved)]',
    dot: 'bg-[var(--color-reserved)]'
  },
  active: { 
    bg: 'bg-blue-100', 
    text: 'text-[var(--color-active)]',
    dot: 'bg-[var(--color-active)]'
  },
  cleaning: { 
    bg: 'bg-amber-50', 
    text: 'text-amber-700',
    dot: 'bg-[var(--color-cleaning)]'
  },
  overdue: { 
    bg: 'bg-orange-50', 
    text: 'text-orange-700',
    dot: 'bg-[var(--color-overdue)]'
  },
  damaged: { 
    bg: 'bg-red-50', 
    text: 'text-[var(--color-damaged)]',
    dot: 'bg-[var(--color-damaged)]'
  },
  completed: { 
    bg: 'bg-green-50', 
    text: 'text-[var(--color-completed)]',
    dot: 'bg-[var(--color-completed)]'
  },
  cancelled: { 
    bg: 'bg-gray-100', 
    text: 'text-[var(--color-cancelled)]',
    dot: 'bg-[var(--color-cancelled)]'
  },
  default: { 
    bg: 'bg-gray-100', 
    text: 'text-[var(--color-muted)]',
    dot: 'bg-[var(--color-muted)]'
  },
}

export function Badge({ variant = 'default', children, dot = true, className = '' }: BadgeProps) {
  const styles = variantStyles[variant]
  
  return (
    <span 
      className={`
        inline-flex items-center gap-2 
        text-sm font-medium 
        px-3 py-1.5 
        rounded-[var(--radius-full)]
        ${styles.bg} ${styles.text}
        ${className}
      `}
    >
      {dot && (
        <span className={`w-2 h-2 rounded-full ${styles.dot}`} />
      )}
      {children}
    </span>
  )
}
