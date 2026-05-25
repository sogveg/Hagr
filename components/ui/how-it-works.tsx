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
    title: 'Velg produkt', 
    description: 'Bla gjennom vårt utvalg av premium babyutstyr og velg leieperiode.' 
  },
  { 
    number: '02', 
    title: 'Vi leverer hjem', 
    description: 'Vi planlegger levering til din adresse i Bergen — raskt og fleksibelt.' 
  },
  { 
    number: '03', 
    title: 'Returner enkelt', 
    description: 'Vi henter når du er ferdig. Depositumet refunderes etter kontroll.' 
  },
]

export function HowItWorks({ steps = defaultSteps, className = '' }: HowItWorksProps) {
  return (
    <section className={`px-6 py-24 ${className}`}>
      <div className="max-w-[1200px] mx-auto">
        <p className="text-xs font-bold text-[var(--color-primary)] uppercase tracking-widest mb-4">
          Enkelt og trygt
        </p>
        <h2 className="text-4xl font-bold text-[var(--color-foreground)] tracking-tight mb-12">
          Slik fungerer det
        </h2>
        
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
