interface TrustBadgesProps {
  className?: string
}

const badges = [
  { icon: '✓', label: 'Fri levering i Bergen' },
  { icon: '✓', label: 'Vaskede og kontrollerte produkter' },
  { icon: '✓', label: 'Fleksibel leieperiode' },
  { icon: '✓', label: 'Depositum refunderes' },
]

export function TrustBadges({ className = '' }: TrustBadgesProps) {
  return (
    <section className={`bg-[var(--color-foreground)] border-b border-white/[0.08] px-6 py-4 ${className}`}>
      <div className="max-w-[1200px] mx-auto flex flex-wrap gap-x-6 gap-y-2 justify-center md:justify-start">
        {badges.map(({ icon, label }) => (
          <span
            key={label}
            className="flex items-center gap-1.5 text-sm text-white/50 font-medium"
          >
            <span className="text-[var(--color-primary-light)]">{icon}</span>
            {label}
          </span>
        ))}
      </div>
    </section>
  )
}
