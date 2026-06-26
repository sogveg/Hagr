import type { Metadata } from 'next'
import Link from 'next/link'
import {
  TrendingUp, FileText, Target, Gift, Car, Smartphone,
  ChevronRight, CheckCircle, ArrowRight, BarChart3, Shield, Zap,
} from 'lucide-react'
import ThemeToggle from '@/components/ThemeToggle'
import { Caveat } from 'next/font/google'

const caveat = Caveat({ subsets: ['latin'], weight: ['600'] })

export const metadata: Metadata = {
  title: 'Hagr — Skatt for AS-eiere som vil gjøre det riktig',
  description: 'Finn ut hva du faktisk har lov til å trekke fra. Dokumenter styremøter, firmabil, gaver og strategisamlinger på minutter, med riktige 2026-regler innebygd.',
  openGraph: {
    title: 'Hagr — Skatt for AS-eiere som vil gjøre det riktig',
    description: 'Finn ut hva du faktisk har lov til å trekke fra. Dokumenter styremøter, firmabil, gaver og strategisamlinger på minutter, med riktige 2026-regler innebygd.',
  },
}

const tools = [
  { Icon: TrendingUp, title: 'Lønn vs. utbytte',   desc: 'Se hva som lønner seg for deg, med AGA regnet inn.' },
  { Icon: FileText,   title: 'Styremøter',          desc: 'Agenda og protokoll klar på noen minutter.' },
  { Icon: Target,     title: 'Strategisamlinger',   desc: 'Dokumentasjon som tåler bokettersyn.' },
  { Icon: Gift,       title: 'Gaver og velferd',    desc: 'Hold deg innenfor grensene for ansattgaver og julebord.' },
  { Icon: Car,        title: 'Firmabil',            desc: 'Sjablongfordel, elbilrabatt og riktig dokumentasjon.' },
  { Icon: Smartphone, title: 'Telefon og internett', desc: 'Ta ut dekningsgraden riktig uten å overbeskatte deg selv.' },
]

const testimonials = [
  {
    quote: 'Jeg visste ikke at jeg hadde satt lønnen feil i årevis. Hagr viste meg på to minutter hva jeg burde gjøre annerledes.',
    name: 'Thomas K.',
    role: 'Daglig leder, konsulentselskap',
    img: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=80&h=80&fit=crop&crop=face&q=80',
  },
  {
    quote: 'Styremøtedokumentasjonen alene er verdt det. Det som tok en halvtime tar nå tre minutter, og revisor er fornøyd.',
    name: 'Marte L.',
    role: 'Gründer, designbyrå',
    img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=80&h=80&fit=crop&crop=face&q=80',
  },
  {
    quote: 'Drev ENK i flere år uten å vite hva jeg hadde lov til å trekke fra. Hagr ryddet opp i det på en kveld.',
    name: 'Silje R.',
    role: 'Frilanser, kommunikasjon',
    img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=80&h=80&fit=crop&crop=face&q=80',
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0f] text-gray-900 dark:text-white transition-colors duration-300">

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl transition-colors duration-300
        bg-white/95 dark:bg-[#0a0a0f]/90
        border-b border-gray-200 dark:border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-xs font-bold text-white shadow-sm">H</div>
            <span className="font-semibold tracking-tight text-gray-900 dark:text-white">Hagr</span>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link href="/login" className="text-sm font-medium px-4 py-2 rounded-lg transition-colors text-gray-600 dark:text-white/50 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5">
              Logg inn
            </Link>
            <Link href="/signup" className="text-sm font-semibold px-5 py-2 rounded-lg hover:opacity-90 transition-opacity shadow-sm bg-gray-900 dark:bg-white text-white dark:text-gray-900">
              Prøv gratis
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative pt-40 pb-28 px-6 overflow-hidden
        bg-gradient-to-b from-violet-50 via-white to-white
        dark:from-transparent dark:via-transparent dark:to-transparent">
        <div className="absolute inset-0 pointer-events-none dark:block hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-violet-600/20 rounded-full blur-[120px]" />
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium mb-8
            border border-violet-200 bg-violet-50 text-violet-700
            dark:border-white/10 dark:bg-white/5 dark:text-white/60">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
            Oppdatert for skatteår 2026
          </div>

          <h1 className="text-6xl sm:text-7xl font-extrabold leading-[1.05] tracking-tight mb-6 text-gray-900 dark:text-white">
            Du betaler{' '}
            <span className="whitespace-nowrap">
              —{' '}
              <span className={`${caveat.className} text-violet-500 text-[1.15em] font-semibold not-italic align-baseline`}>
                antaglig
              </span>
              {' '}—
            </span>
            {' '}
            <span className="bg-gradient-to-r from-violet-600 to-indigo-500 bg-clip-text text-transparent">
              for mye skatt
            </span>
          </h1>

          <p className="text-xl leading-relaxed mb-10 max-w-2xl mx-auto text-gray-500 dark:text-white/50">
            Hagr viser deg nøyaktig hva du har krav på som AS-eier eller ENK og gir deg dokumentasjonen som holder når revisor spør.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
            <Link href="/signup" className="group flex items-center justify-center gap-2 font-bold px-8 py-3.5 rounded-xl hover:opacity-90 transition-opacity text-sm shadow-lg
              bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-gray-900/10">
              Start gratis
              <ArrowRight size={15} strokeWidth={2.5} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link href="/login" className="flex items-center justify-center font-medium px-8 py-3.5 rounded-xl transition-all text-sm
              border border-gray-200 dark:border-white/10
              bg-white dark:bg-white/5
              text-gray-700 dark:text-white/70
              hover:border-gray-300 dark:hover:bg-white/10 hover:bg-gray-50">
              Logg inn
            </Link>
          </div>
          <p className="text-xs text-gray-400 dark:text-white/20">Ingen kredittkort. Ingen binding.</p>
        </div>

        {/* Hero image */}
        <div className="relative max-w-5xl mx-auto mt-16">
          <div className="relative rounded-2xl overflow-hidden border shadow-2xl
            border-gray-200 dark:border-white/10
            shadow-gray-300/50 dark:shadow-black/60">
            <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-[#0a0a0f] via-transparent to-transparent z-10 pointer-events-none" />
            <img
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=85&fit=crop"
              alt="Finansdashboard"
              className="w-full h-[400px] object-cover object-top"
            />
            <div className="absolute bottom-8 left-8 z-20 rounded-2xl px-5 py-4 shadow-xl backdrop-blur-xl
              bg-white dark:bg-[#111118]/95 border border-gray-100 dark:border-white/10">
              <p className="text-xs mb-1 text-gray-400 dark:text-white/40">Lovlige skattebesparelser</p>
              <p className="text-base font-bold text-gray-900 dark:text-white">Lønn · Utbytte · Fradrag</p>
              <p className="text-xs mt-1 flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                <TrendingUp size={11} strokeWidth={2.5} /> Tilpasset AS-eiere
              </p>
            </div>
            <div className="absolute bottom-8 right-8 z-20 rounded-2xl px-5 py-4 shadow-xl backdrop-blur-xl
              bg-white dark:bg-[#111118]/95 border border-gray-100 dark:border-white/10">
              <p className="text-xs mb-1 text-gray-400 dark:text-white/40">Klar for bokettersyn</p>
              <p className="text-base font-bold flex items-center gap-2 text-gray-900 dark:text-white">
                <Shield size={14} strokeWidth={2} className="text-violet-500" /> Revisjonsklar dokumentasjon
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* VALUE PROPS */}
      <section className="py-14 px-6 border-y transition-colors
        border-gray-100 dark:border-white/[0.06]
        bg-gray-50 dark:bg-white/[0.02]">
        <div className="max-w-5xl mx-auto grid sm:grid-cols-3 gap-8 text-center">
          {[
            { Icon: BarChart3, title: 'Riktig skatt', label: 'Finn de lovlige grepene som passer din situasjon' },
            { Icon: Shield,    title: 'Trygg dokumentasjon', label: 'Papirene er klare om Skatteetaten skulle spørre' },
            { Icon: Zap,       title: 'Spar tid',   label: 'Styremøtepakker og dokumenter ferdig på et par minutter' },
          ].map((s) => (
            <div key={s.title}>
              <s.Icon size={20} strokeWidth={1.5} className="mx-auto mb-3 text-violet-600 dark:text-violet-400" />
              <div className="text-base font-bold mb-1 text-gray-900 dark:text-white">{s.title}</div>
              <div className="text-sm leading-snug max-w-[200px] mx-auto text-gray-500 dark:text-white/40">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FOR WHO */}
      <section className="py-28 px-6 bg-white dark:bg-transparent">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest mb-4 text-violet-600 dark:text-violet-400">Hvem er det for?</p>
            <h2 className="text-4xl font-extrabold leading-tight mb-5 text-gray-900 dark:text-white">
              For deg som driver for deg selv
            </h2>
            <p className="text-lg leading-relaxed mb-8 text-gray-500 dark:text-white/50">
              Enten du har AS eller ENK, driver konsulentvirksomhet, eiendom, byrå eller noe helt annet, er skattereglene de samme. Hagr passer på at du bruker dem riktig.
            </p>
            <div className="space-y-3">
              {[
                { title: 'AS-eiere',                  desc: 'Optimaliser lønn mot utbytte, dokumenter styremøter og ta ut fradrag riktig.' },
                { title: 'ENK-drivere',               desc: 'Finn fradragene du har krav på og hold styr på hva som er privat og næring.' },
                { title: 'Konsulenter og frilansere', desc: 'Ta ut firmabilfordelen riktig og ha alt klart for revisor.' },
                { title: 'Gründere i vekst',          desc: 'Sett gode rutiner fra dag én. Det er mye billigere enn å rydde opp.' },
              ].map((f) => (
                <div key={f.title} className="flex items-start gap-3 p-4 rounded-xl transition-all
                  border border-gray-100 dark:border-white/[0.06]
                  bg-gray-50 dark:bg-white/[0.02]
                  hover:border-violet-200 dark:hover:border-violet-500/20
                  hover:bg-violet-50 dark:hover:bg-violet-600/5">
                  <CheckCircle size={17} strokeWidth={2} className="text-violet-500 mt-0.5 shrink-0" />
                  <div>
                    <span className="font-semibold text-sm text-gray-900 dark:text-white">{f.title}: </span>
                    <span className="text-sm text-gray-500 dark:text-white/40">{f.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="rounded-2xl overflow-hidden border shadow-2xl border-gray-200 dark:border-white/10 shadow-gray-200/80 dark:shadow-black/60">
              <img
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=85&fit=crop"
                alt="AS-eier jobber med økonomi"
                className="w-full h-[480px] object-cover"
              />
            </div>
            <div className="absolute -bottom-4 -right-4 rounded-2xl p-4 shadow-xl backdrop-blur-xl
              bg-white dark:bg-[#111118] border border-gray-100 dark:border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-emerald-100 dark:bg-emerald-500/20">
                  <Shield size={15} strokeWidth={2} className="text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-gray-900 dark:text-white">Klar til revisor</p>
                  <p className="text-xs text-gray-400 dark:text-white/40">Last ned og send videre</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TOOLS */}
      <section className="py-28 px-6 border-t transition-colors
        border-gray-100 dark:border-white/[0.06]
        bg-gray-50 dark:bg-transparent">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold uppercase tracking-widest mb-4 text-violet-600 dark:text-violet-400">Verktøy</p>
            <h2 className="text-4xl font-extrabold mb-3 text-gray-900 dark:text-white">Alt du trenger på ett sted</h2>
            <p className="text-lg max-w-xl mx-auto text-gray-500 dark:text-white/40">Hvert verktøy er bygget rundt gjeldende norske skatteregler for 2026.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {tools.map(({ Icon, title, desc }, i) => (
              <div key={title} className={`group p-6 rounded-2xl border transition-all hover:shadow-md
                ${i === 0
                  ? 'border-violet-200 dark:border-violet-500/20 bg-violet-50 dark:bg-violet-600/5'
                  : 'border-gray-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.02] hover:border-violet-200 dark:hover:border-violet-500/20 hover:bg-violet-50 dark:hover:bg-violet-600/5'}`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-colors
                  ${i === 0
                    ? 'bg-violet-100 dark:bg-violet-500/20'
                    : 'bg-gray-100 dark:bg-white/5 group-hover:bg-violet-100 dark:group-hover:bg-violet-500/20'}`}>
                  <Icon size={18} strokeWidth={1.75}
                    className={i === 0
                      ? 'text-violet-600 dark:text-violet-400'
                      : 'text-gray-500 dark:text-white/50 group-hover:text-violet-600 dark:group-hover:text-violet-400'} />
                </div>
                <h3 className="font-bold text-sm mb-1.5 text-gray-900 dark:text-white">{title}</h3>
                <p className="text-sm leading-relaxed text-gray-500 dark:text-white/40">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-28 px-6 border-t bg-white dark:bg-transparent border-gray-100 dark:border-white/[0.06]">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div className="rounded-2xl overflow-hidden border shadow-2xl border-gray-200 dark:border-white/10 shadow-gray-200/80 dark:shadow-black/60">
              <img
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=85&fit=crop"
                alt="Finansiell planlegging"
                className="w-full h-[400px] object-cover"
              />
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest mb-4 text-violet-600 dark:text-violet-400">Slik fungerer det</p>
            <h2 className="text-4xl font-extrabold leading-tight mb-10 text-gray-900 dark:text-white">I gang på ti minutter</h2>
            <div className="space-y-8">
              {[
                { n: '01', title: 'Legg inn selskapet ditt',  desc: 'Navn, org.nr og hvem som er med. Tar to minutter.' },
                { n: '02', title: 'Utforsk verktøyene',       desc: 'Kalkulatorer og veivisere tar deg gjennom lønn, fradrag og dokumentasjon.' },
                { n: '03', title: 'Last ned og arkiver',      desc: 'Revisjonsklar dokumentasjon klar til å sende revisor eller legge i permen.' },
              ].map((s) => (
                <div key={s.n} className="flex items-start gap-5">
                  <span className="text-3xl font-extrabold leading-none font-mono w-10 shrink-0 select-none
                    text-gray-200 dark:text-white/10">{s.n}</span>
                  <div>
                    <h3 className="font-bold mb-1 text-gray-900 dark:text-white">{s.title}</h3>
                    <p className="text-sm leading-relaxed text-gray-500 dark:text-white/40">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-28 px-6 border-t transition-colors
        border-gray-100 dark:border-white/[0.06]
        bg-gray-50 dark:bg-transparent">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold uppercase tracking-widest mb-4 text-violet-600 dark:text-violet-400">Hva brukerne sier</p>
            <h2 className="text-4xl font-extrabold mb-3 text-gray-900 dark:text-white">Selvstendig næringsdrivende som har tatt kontrollen</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-5">
            {testimonials.map((t) => (
              <div key={t.name} className="rounded-2xl p-6 transition-all hover:shadow-md
                bg-white dark:bg-white/[0.03]
                border border-gray-100 dark:border-white/[0.07]
                hover:border-gray-200 dark:hover:border-white/10">
                <div className="flex gap-0.5 mb-5">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-3.5 h-3.5 fill-amber-400" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-sm leading-relaxed mb-6 text-gray-600 dark:text-white/60">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <img src={t.img} alt={t.name} className="w-9 h-9 rounded-full object-cover border border-gray-100 dark:border-white/10" />
                  <div>
                    <p className="font-semibold text-sm text-gray-900 dark:text-white">{t.name}</p>
                    <p className="text-xs text-gray-400 dark:text-white/30">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-28 px-6 border-t bg-white dark:bg-transparent border-gray-100 dark:border-white/[0.06]">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-5xl font-extrabold mb-5 leading-tight text-gray-900 dark:text-white">
            Klar til å betale<br />
            <span className="bg-gradient-to-r from-violet-600 to-indigo-500 bg-clip-text text-transparent">
              riktig skatt?
            </span>
          </h2>
          <p className="text-lg mb-8 leading-relaxed max-w-lg mx-auto text-gray-500 dark:text-white/50">
            Bli med norske AS-eiere og ENK-drivere som har tatt kontroll over skatten sin. Gratis å starte.
          </p>
          <Link href="/signup" className="group inline-flex items-center gap-2 font-bold px-10 py-4 rounded-xl hover:opacity-90 transition-opacity text-sm shadow-xl
            bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-gray-900/10">
            Kom i gang gratis
            <ChevronRight size={16} strokeWidth={2.5} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-8 px-6 border-t transition-colors border-gray-100 dark:border-white/[0.06] bg-gray-50 dark:bg-transparent">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-xs font-bold text-white">H</div>
            <span className="text-sm font-medium text-gray-500 dark:text-white/40">Hagr</span>
          </div>
          <p className="text-xs text-center max-w-sm text-gray-400 dark:text-white/20">
            Hagr er et beslutningsstøtteverktøy og erstatter ikke personlig skatterådgivning.
          </p>
          <div className="flex gap-5 text-xs text-gray-400 dark:text-white/30">
            <Link href="/login" className="hover:text-gray-700 dark:hover:text-white/60 transition-colors">Logg inn</Link>
            <Link href="/signup" className="hover:text-gray-700 dark:hover:text-white/60 transition-colors">Registrer deg</Link>
          </div>
        </div>
      </footer>

    </div>
  )
}
