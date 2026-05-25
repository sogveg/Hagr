import { Card } from './card'

interface Step {
  number: string
  title: string
  description: string
}

interface HowItWorksProps {
  steps?: Step[]
  className?: string
}

const defaultSteps: Step[] = [
  {
    number: '01',
    title: 'Velg hva du trenger',
    description: 'Bla gjennom utstyret, velg leieperiode og bestill direkte på nettet. Tar under 5 minutter.'
  },
  {
    number: '02',
    title: 'Hent eller få levert',
    description: 'Velg selv: hent på avtalt sted, eller få utstyret kjørt hjem til deg. Vi avtaler tidspunkt som passer.'
  },
  {
    number: '03',
    title: 'Vi henter det tilbake',
    description: 'Når du er ferdig henter vi utstyret. Depositumet refunderes etter kontroll — enkelt og trygt.'
  },
]

export function HowItWorks({ steps = defaultSteps, className = '' }: HowItWorksProps) {
  return (
    <section className={`px-6 py-24 ${className}`}>
      <div className="max-w-[1200px] mx-auto">
        <p className="text-xs font-bold text-[var(--color-primary)] uppercase tracking-widest mb-4">
          Slik fungerer det
        </p>
        <h2 className="text-4xl font-bold text-[var(--color-foreground)] tracking-tight mb-3">
          Tre enkle steg
        </h2>
        <p className="text-[var(--color-muted)] mb-12 max-w-md">
          Vi har gjort det så enkelt som mulig — fordi du allerede har nok å tenke på.
        </p>
        
        <div className="grid md:grid-cols-3 gap-5">
          {steps.map((step) => (
            <Card key={step.number}>
              <div className="text-5xl font-bold text-[var(--color-primary-light)] mb-6 leading-none">
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
