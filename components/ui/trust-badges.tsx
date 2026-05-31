interface TrustBadgesProps {
  className?: string
}

const badges = [
  { icon: '✓', label: 'Grundig vasket og desinfisert' },
  { icon: '✓', label: 'Hent selv eller få det levert' },
  { icon: '✓', label: 'Fleksibel leieperiode' },
  { icon: '✓', label: 'Depositum tilbake etter retur' },
]

export function TrustBadges({ className = '' }: TrustBadgesProps) {
  return (
    <section className={`border-b border-[var(--color-border)] px-6 py-4 ${className}`} style={{ backgroundColor: 'var(--color-sand)' }}>
      <div className="max-w-[1200px] mx-auto flex flex-wrap gap-x-6 gap-y-2 justify-center">
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
