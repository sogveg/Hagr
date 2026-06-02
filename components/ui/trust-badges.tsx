import { getServerT } from '@/lib/get-locale'

interface TrustBadgesProps {
  className?: string
}

export async function TrustBadges({ className = '' }: TrustBadgesProps) {
  const { t } = await getServerT()

  const badges = [
    { icon: '✓', label: t.trust.cleaned  },
    { icon: '✓', label: t.trust.delivery },
    { icon: '✓', label: t.trust.flexible },
    { icon: '✓', label: t.trust.deposit  },
  ]

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
