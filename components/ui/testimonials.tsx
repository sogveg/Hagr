'use client'

const TESTIMONIALS = [
  {
    quote: 'Vi kom flygende inn til Bergen fredag kveld med to kofferter og en trøtt toåring. Barnevognen stod klar utenfor hotelldøren. Nøyaktig det vi trengte.',
    name: 'Marte H.',
    context: 'Familie fra Oslo',
    rating: 5,
  },
  {
    quote: 'Bilstolen var grundig rengjort og kom med bruksanvisning. Installerte den selv på fem minutter. Veldig enkelt og trygt.',
    name: 'Thomas B.',
    context: 'Besøkte Bergen med 8 måneder gammel baby',
    rating: 5,
  },
  {
    quote: 'Reisesengen var klar da vi sjekket inn. Babyen sov like godt som hjemme. Vi bestiller igjen neste gang vi er i Bergen.',
    name: 'Annika S.',
    context: 'Reiste fra Sverige',
    rating: 5,
  },
]

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5 mb-4">
      {Array.from({ length: count }).map((_, i) => (
        <svg
          key={i}
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="text-[var(--color-primary)]"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  )
}

export function Testimonials() {
  return (
    <section className="bg-[var(--color-background)] px-6 py-24">
      <div className="max-w-[1200px] mx-auto">
        <p className="text-xs font-bold text-[var(--color-primary)] uppercase tracking-widest mb-4">
          Kundene sier
        </p>
        <h2 className="text-4xl font-bold text-[var(--color-foreground)] tracking-tight mb-3">
          Ekte erfaringer fra familier
        </h2>
        <p className="text-[var(--color-muted)] mb-12 max-w-md">
          Vi måles på at utstyret er der når du trenger det, og at det er rent og trygt.
        </p>

        <div className="grid md:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className="bg-white rounded-2xl border border-black/[0.06] p-7 flex flex-col"
            >
              {/* Quote mark */}
              <svg
                width="28"
                height="22"
                viewBox="0 0 28 22"
                fill="none"
                className="mb-5 text-[var(--color-primary)] opacity-40"
              >
                <path
                  d="M0 22V13.75C0 6.25 4.5 1.5 13.5 0l1.5 2.5C10 3.667 7.5 6.5 7 11h5.5V22H0zm15 0V13.75C15 6.25 19.5 1.5 28.5 0L30 2.5C25 3.667 22.5 6.5 22 11h5.5V22H15z"
                  fill="currentColor"
                />
              </svg>

              <p className="text-[15px] text-[var(--color-foreground)] leading-relaxed flex-1 mb-6">
                {t.quote}
              </p>

              <div>
                <Stars count={t.rating} />
                <p className="text-sm font-semibold text-[var(--color-foreground)]">{t.name}</p>
                <p className="text-xs text-[var(--color-muted)] mt-0.5">{t.context}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
