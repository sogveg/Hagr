interface TrustBadgesProps {
  className?: string
}

const badges = [
  { icon: '✓', label: 'Grundig vasket og desinfisert' },
  { icon: '✓', label: 'Levering hjem til deg' },
  { icon: '✓', label: 'Fleksibel leieperiode' },
  { icon: '✓', label: 'Depositum tilbake etter retur' },
]

export function TrustBadges({ className = '' }: TrustBadgesProps) {
  return (
    <section className={`bg-white border-b border-[var(--color-border)] px-6 py-4 ${className}`}>
      <div className="max-w-[1200px] mx-auto flex flex-wrap gap-x-6 gap-y-2 justify-center md:justify-start">
        {badges.map(({ icon, label }) => (
          <span
            key={label}
            className="flex items-center gap-1.5 text-sm text-[var(--color-muted)] font-medium"
          >
            <span className="text-[var(--color-primary)] font-bold">{icon}</span>
            {label}
          </span>
        ))}
      </div>
    </section>
  )
}
