export const dynamic = 'force-dynamic'

import { createServiceClient } from '@/lib/supabase-server'
import Link from 'next/link'

export default async function HomePage() {
  const supabase = createServiceClient()
  const locations = supabase 
    ? (await supabase.from('locations').select('*').eq('active', true)).data 
    : null

  return (
    <main className="min-h-screen bg-[#F8F7F4]">

      {/* Header */}
      <header className="bg-white border-b border-black/[0.06] sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="text-xl font-bold text-[#2B2B2B] tracking-tight">TinyRent</span>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-gray-500 hover:text-gray-900 font-medium transition-colors">
              Logg inn
            </Link>
            <Link href="/register" className="text-sm bg-[#2B2B2B] text-white px-4 py-2 rounded-full font-semibold hover:opacity-90 transition-opacity">
              Kom i gang
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-[#2B2B2B] px-6 py-24 md:py-32">
        <div className="max-w-6xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/10 text-white/60 text-xs font-semibold px-3 py-1.5 rounded-full mb-8 uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-[#A8BFA3] shrink-0" />
            Bergen, Norge
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white leading-none tracking-[-2.5px] mb-6 max-w-2xl">
            Lei premium<br />babyutstyr
          </h1>
          <p className="text-lg text-white/50 mb-10 max-w-sm leading-relaxed">
            Trygt, enkelt og bærekraftig. Vi leverer kvalitetsutstyr hjem til deg.
          </p>
          <div className="flex flex-wrap gap-3">
            {locations?.map(loc => (
              <Link
                key={loc.id}
                href={`/${loc.slug}`}
                className="inline-flex items-center gap-2 bg-[#A8BFA3] hover:bg-[#8FA68B] text-white px-7 py-4 rounded-full text-base font-semibold transition-colors"
              >
                Se utstyr i {loc.name} <span>→</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="bg-white border-b border-black/[0.06] px-6 py-4">
        <div className="max-w-6xl mx-auto flex flex-wrap gap-6 text-sm text-gray-400 font-medium">
          {['Fri levering i Bergen', 'Vaskede og kontrollerte produkter', 'Fleksibel leieperiode', 'Depositum refunderes'].map(t => (
            <span key={t} className="flex items-center gap-1.5">
              <span className="text-[#A8BFA3]">✓</span> {t}
            </span>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 py-24">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs font-bold text-[#A8BFA3] uppercase tracking-widest mb-4">Enkelt og trygt</p>
          <h2 className="text-4xl font-bold text-[#2B2B2B] tracking-tight mb-12">Slik fungerer det</h2>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { num: '01', title: 'Velg produkt', text: 'Bla gjennom vårt utvalg av premium babyutstyr og velg leieperiode.' },
              { num: '02', title: 'Vi leverer hjem', text: 'Vi planlegger levering til din adresse i Bergen — raskt og fleksibelt.' },
              { num: '03', title: 'Returner enkelt', text: 'Vi henter når du er ferdig. Depositumet refunderes etter kontroll.' },
            ].map(step => (
              <div key={step.num} className="bg-white rounded-3xl p-8 border border-black/[0.06]">
                <div className="text-5xl font-bold text-[#EAE4DA] mb-6 leading-none">{step.num}</div>
                <h3 className="text-lg font-bold text-[#2B2B2B] mb-3">{step.title}</h3>
                <p className="text-gray-500 leading-relaxed text-[15px]">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why TinyRent */}
      <section className="bg-[#EAE4DA] px-6 py-24">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs font-bold text-[#8FA68B] uppercase tracking-widest mb-4">Fordeler</p>
          <h2 className="text-4xl font-bold text-[#2B2B2B] tracking-tight mb-12">Hvorfor leie fra oss?</h2>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { emoji: '🧼', title: 'Grundig rengjort', text: 'Alt utstyr vaskes og kontrolleres grundig mellom hver leie.' },
              { emoji: '🌱', title: 'Bærekraftig valg', text: 'Leie er mer miljøvennlig enn å kjøpe nytt til kortvarig bruk.' },
              { emoji: '📦', title: 'Premium merker', text: 'Moonboon, Babyzen, Snüz — vi velger kun dokumenterte kvalitetsprodukter.' },
            ].map(b => (
              <div key={b.title} className="bg-white rounded-3xl p-8">
                <div className="text-4xl mb-5">{b.emoji}</div>
                <h3 className="text-lg font-bold text-[#2B2B2B] mb-2">{b.title}</h3>
                <p className="text-gray-500 leading-relaxed text-sm">{b.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#2B2B2B] px-6 py-12">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="text-base font-bold text-white mb-1">TinyRent</div>
            <div className="text-sm text-white/40">Bergen, Norge</div>
          </div>
          <a href="mailto:hei@tinyrent.no" className="text-sm text-white/40 hover:text-white/70 transition-colors">
            hei@tinyrent.no
          </a>
          <div className="text-sm text-white/25">© 2025 TinyRent</div>
        </div>
      </footer>

    </main>
  )
}
