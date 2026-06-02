import { Card } from './card'
import { getServerT } from '@/lib/get-locale'

interface HowItWorksProps {
  className?: string
}

export async function HowItWorks({ className = '' }: HowItWorksProps) {
  const { t } = await getServerT()

  const steps = [
    { number: '01', title: t.howItWorks.step1Title, description: t.howItWorks.step1Desc },
    { number: '02', title: t.howItWorks.step2Title, description: t.howItWorks.step2Desc },
    { number: '03', title: t.howItWorks.step3Title, description: t.howItWorks.step3Desc },
  ]

  return (
    <section className={`px-6 py-24 ${className}`}>
      <div className="max-w-[1200px] mx-auto">
        <p className="text-xs font-bold text-[var(--color-primary)] uppercase tracking-widest mb-4">
          {t.howItWorks.label}
        </p>
        <h2 className="text-4xl font-bold text-[var(--color-foreground)] tracking-tight mb-3">
          {t.howItWorks.title}
        </h2>
        <p className="text-[var(--color-muted)] mb-12 max-w-md">
          {t.howItWorks.subtitle}
        </p>

        <div className="grid md:grid-cols-3 gap-5">
          {steps.map((step) => (
            <Card key={step.number}>
              <div className="text-5xl font-bold text-[var(--color-sand)] mb-6 leading-none">
                {step.number}
              </div>
              <h3 className="text-lg font-bold text-[var(--color-foreground)] mb-3">
                {step.title}
              </h3>
              <p className="text-[var(--color-muted)] leading-relaxed text-[15px]">
                {step.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
