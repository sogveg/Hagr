import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-brand-900 via-brand-700 to-brand-500 flex flex-col items-center justify-center px-4">
      <div className="max-w-2xl text-center text-white">
        <div className="mb-8">
          <span className="text-5xl font-bold tracking-tight">SkatteSmart</span>
          <span className="block mt-2 text-brand-100 text-xl">
            Lovlig skattegrep for norske gründere og småbedrifter
          </span>
        </div>
        <p className="text-brand-100 text-lg mb-10 leading-relaxed">
          Dokumenter styremøter, strategisamlinger, gaver, personalrabatter og mye mer —
          alt med innebygget risikovurdering og revisjonsklar dokumentasjon.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/signup"
            className="bg-white text-brand-700 font-semibold px-8 py-3 rounded-xl hover:bg-brand-50 transition-colors"
          >
            Kom i gang gratis
          </Link>
          <Link
            href="/login"
            className="border border-white text-white font-semibold px-8 py-3 rounded-xl hover:bg-white/10 transition-colors"
          >
            Logg inn
          </Link>
        </div>
        <p className="mt-12 text-brand-200 text-xs">
          Vurderingene er generell beslutningsstøtte og erstatter ikke bindende skatterådgivning.
        </p>
      </div>
    </main>
  )
}
