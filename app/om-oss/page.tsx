import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { getServerT } from '@/lib/get-locale'

export const metadata = {
  title: 'Om oss',
  description: 'TinyRent ble startet av foreldre som kjente på alt stresset rundt babyutstyr. Vi laget løsningen vi ønsket fantes.',
  alternates: { canonical: 'https://www.tinyrent.no/om-oss' },
  openGraph: {
    title: 'Om oss | TinyRent',
    description: 'TinyRent ble startet av foreldre som kjente på alt stresset rundt babyutstyr.',
    url: 'https://www.tinyrent.no/om-oss',
    images: [{ url: '/images/hero.jpg', width: 1200, height: 630, alt: 'TinyRent om oss' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Om oss | TinyRent',
    description: 'TinyRent ble startet av foreldre som kjente på alt stresset rundt babyutstyr.',
    images: ['/images/hero.jpg'],
  },
}

export default async function OmOssPage() {
  const { t } = await getServerT()

  return (
    <main className="min-h-screen bg-[var(--color-background)]">
      <Header />

      {/* Hero */}
      <section className="bg-[var(--color-foreground)] px-6 py-20">
        <div className="max-w-[800px] mx-auto">
          <p className="text-xs font-bold text-[var(--color-primary-light)] uppercase tracking-widest mb-4">
            {t.about.badge}
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight mb-5">
            {t.about.title}
          </h1>
          <p className="text-white/50 text-lg leading-relaxed max-w-xl">
            {t.about.subtitle}
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="px-6 py-20">
        <div className="max-w-[800px] mx-auto">
          <div className="grid md:grid-cols-2 gap-12 mb-16">
            <div>
              <h2 className="text-xl font-bold text-[var(--color-foreground)] mb-3">
                {t.about.ideaTitle}
              </h2>
              <p className="text-[var(--color-muted)] leading-relaxed text-[15px]">
                {t.about.ideaText}
              </p>
            </div>
            <div>
              <h2 className="text-xl font-bold text-[var(--color-foreground)] mb-3">
                {t.about.safetyTitle}
              </h2>
              <p className="text-[var(--color-muted)] leading-relaxed text-[15px]">
                {t.about.safetyText}
              </p>
            </div>
          </div>

          {/* Values */}
          <div className="border-t border-[var(--color-border)] pt-12">
            <h2 className="text-2xl font-bold text-[var(--color-foreground)] mb-8">
              {t.about.valuesTitle}
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { title: t.about.v1Title, text: t.about.v1Text },
                { title: t.about.v2Title, text: t.about.v2Text },
                { title: t.about.v3Title, text: t.about.v3Text },
              ].map(v => (
                <div key={v.title}>
                  <h3 className="font-bold text-[var(--color-foreground)] mb-2">{v.title}</h3>
                  <p className="text-sm text-[var(--color-muted)] leading-relaxed">{v.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Contact CTA */}
          <div className="mt-16 pt-12 border-t border-[var(--color-border)]">
            <h2 className="text-2xl font-bold text-[var(--color-foreground)] mb-3">
              {t.about.contactTitle}
            </h2>
            <p className="text-[var(--color-muted)] mb-6">
              {t.about.contactText}
            </p>
            <Button href="mailto:hei@tinyrent.no" variant="outline">
              {t.about.contactCta}
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
