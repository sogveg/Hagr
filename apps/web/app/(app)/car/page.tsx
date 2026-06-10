'use client'

import { useState, useMemo } from 'react'
import { Car, Navigation, Lightbulb, ChevronDown, ChevronUp, AlertTriangle, CheckCircle } from 'lucide-react'
import {
  evaluateCarBenefit,
  evaluateMileage,
  MILEAGE_RATE_2025,
} from '@/lib/shared'

function TipBox({ tips }: { tips: string[] }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50 overflow-hidden mb-6">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-4 py-3 text-left"
      >
        <span className="flex items-center gap-2 text-amber-800 font-medium text-sm">
          <Lightbulb size={15} strokeWidth={2.2} /> Tips og regler
        </span>
        {open ? <ChevronUp size={15} className="text-amber-500" /> : <ChevronDown size={15} className="text-amber-500" />}
      </button>
      {open && (
        <div className="px-4 pb-4 space-y-2 border-t border-amber-200">
          {tips.map((t, i) => (
            <p key={i} className="text-sm text-amber-900" dangerouslySetInnerHTML={{ __html: t }} />
          ))}
        </div>
      )}
    </div>
  )
}

const CAR_TIPS = [
  '<strong>30%-regelen:</strong> Privat bruk av firmabil beskattes som 30% av listepris (20% for biler over 3 år, på 75% av listepris).',
  '<strong>El-bil-fordel 2026:</strong> For el-biler reduseres fordelsgrunnlaget med 50% — el-bil er fremdeles betydelig billigere enn fossil bil i firma.',
  '<strong>Over 40 000 km yrke?</strong> Du kan få 25% reduksjon i fordelen ved dokumentert høy yrkeskjøring. Kjøreboken er beviset.',
  '<strong>Kjørebok er ikke valgfritt:</strong> Uten elektronisk kjørebok regnes ALL kjøring som privat. Finn en app som Tripletex, Timesheet eller Trip Logger.',
  '<strong>Kjøregodtgjørelse:</strong> Statens sats er 4,50 kr/km (2026) — dette er skattefritt å utbetale. Vær nøye med å dokumentere sted, formål og km.',
  '<strong>Unngå grå soner:</strong> Kjøring mellom hjem og fast arbeidssted = pendling. Det er ikke kjøregodtgjørelse, uansett hvordan du kaller det.',
]

export default function CarPage() {
  const [tab, setTab] = useState<'firmabil' | 'kjorebok'>('firmabil')

  // Firmabil form
  const [listPrice, setListPrice] = useState('')
  const [carAge, setCarAge] = useState('0')
  const [isElectric, setIsElectric] = useState(false)
  const [businessKm, setBusinessKm] = useState('')
  const [monthsAvailable, setMonthsAvailable] = useState('12')

  // Kjørebok form
  const [trips, setTrips] = useState([
    { date: '', from: '', to: '', purpose: '', km: '', homeToWork: false },
  ])

  const carResult = useMemo(() => {
    const lp = parseFloat(listPrice.replace(/\s/g, ''))
    if (!lp || lp <= 0) return null
    return evaluateCarBenefit({
      list_price_nok: lp,
      car_age_years: parseInt(carAge),
      is_electric: isElectric,
      annual_business_km: parseFloat(businessKm) || 0,
      months_available: parseInt(monthsAvailable) || 12,
    })
  }, [listPrice, carAge, isElectric, businessKm, monthsAvailable])

  const totalKm = trips.filter(t => !t.homeToWork).reduce((s, t) => s + (parseFloat(t.km) || 0), 0)
  const totalReimbursement = Math.round(totalKm * MILEAGE_RATE_2025)

  function addTrip() {
    setTrips(prev => [...prev, { date: '', from: '', to: '', purpose: '', km: '', homeToWork: false }])
  }
  function updateTrip(i: number, field: string, value: string | boolean) {
    setTrips(prev => prev.map((t, idx) => idx === i ? { ...t, [field]: value } : t))
  }
  function removeTrip(i: number) {
    setTrips(prev => prev.filter((_, idx) => idx !== i))
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Bil og kjørebok</h1>
        <p className="text-gray-500 mt-1 text-sm">
          Beregn fordelsbeskatning for firmabil, eller logg kjøregodtgjørelse
        </p>
      </div>

      <TipBox tips={CAR_TIPS} />

      {/* Tab switch */}
      <div className="flex rounded-xl border border-gray-200 bg-gray-50 p-1 gap-1 mb-6 w-fit">
        {(['firmabil', 'kjorebok'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              tab === t ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {t === 'firmabil' ? <Car size={15} strokeWidth={2} /> : <Navigation size={15} strokeWidth={2} />}
            {t === 'firmabil' ? 'Firmabil' : 'Kjøregodtgjørelse'}
          </button>
        ))}
      </div>

      {tab === 'firmabil' && (
        <div className="space-y-5">
          <div className="card p-6 space-y-4">
            <h2 className="font-semibold text-gray-900">Fordelsberegning firmabil</h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Listepris ny (kr)</label>
                <input
                  className="input"
                  placeholder="550 000"
                  value={listPrice}
                  onChange={e => setListPrice(e.target.value)}
                />
              </div>
              <div>
                <label className="label">Bilens alder (år)</label>
                <input
                  className="input"
                  type="number"
                  min="0"
                  value={carAge}
                  onChange={e => setCarAge(e.target.value)}
                />
              </div>
              <div>
                <label className="label">Yrkeskjøring per år (km)</label>
                <input
                  className="input"
                  placeholder="15 000"
                  value={businessKm}
                  onChange={e => setBusinessKm(e.target.value)}
                />
              </div>
              <div>
                <label className="label">Måneder tilgjengelig</label>
                <select className="input" value={monthsAvailable} onChange={e => setMonthsAvailable(e.target.value)}>
                  {[...Array(12)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>{i + 1} måneder</option>
                  ))}
                </select>
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isElectric}
                onChange={e => setIsElectric(e.target.checked)}
                className="w-4 h-4 rounded accent-blue-600"
              />
              <span className="text-sm text-gray-700">El-bil (50% reduksjon i fordelsgrunnlaget)</span>
            </label>
          </div>

          {carResult && (
            <div className="card p-6 space-y-4">
              <h2 className="font-semibold text-gray-900">Beregning</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-xl p-4 text-center">
                  <p className="text-xs text-blue-600 font-medium mb-1">Årlig fordel (skattegrunnlag)</p>
                  <p className="text-2xl font-bold text-blue-700">{carResult.annual_benefit_nok.toLocaleString('nb-NO')} kr</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <p className="text-xs text-gray-500 font-medium mb-1">Per måned</p>
                  <p className="text-2xl font-bold text-gray-700">{carResult.monthly_benefit_nok.toLocaleString('nb-NO')} kr</p>
                </div>
              </div>

              {carResult.flags.length > 0 && (
                <div className="space-y-2">
                  {carResult.flags.map((f, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm text-amber-800 bg-amber-50 rounded-lg px-3 py-2">
                      <AlertTriangle size={14} className="shrink-0 mt-0.5 text-amber-500" />
                      {f}
                    </div>
                  ))}
                </div>
              )}

              <p className="text-xs text-gray-400">Fordelen rapporteres i a-meldingen (kode 113-A). Tilleggsskatt kan ilegges ved unnlatelse.</p>
            </div>
          )}
        </div>
      )}

      {tab === 'kjorebok' && (
        <div className="space-y-5">
          <div className="card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-gray-900">Kjøreturer</h2>
              <button onClick={addTrip} className="btn-secondary text-sm py-1.5 px-3">+ Legg til tur</button>
            </div>

            <div className="space-y-3">
              {trips.map((trip, i) => (
                <div key={i} className={`rounded-xl border p-4 space-y-3 ${trip.homeToWork ? 'border-red-200 bg-red-50' : 'border-gray-200 bg-gray-50'}`}>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="label">Dato</label>
                      <input className="input" type="date" value={trip.date} onChange={e => updateTrip(i, 'date', e.target.value)} />
                    </div>
                    <div>
                      <label className="label">Kilometer</label>
                      <input className="input" placeholder="45" value={trip.km} onChange={e => updateTrip(i, 'km', e.target.value)} />
                    </div>
                    <div>
                      <label className="label">Fra</label>
                      <input className="input" placeholder="Kontoret" value={trip.from} onChange={e => updateTrip(i, 'from', e.target.value)} />
                    </div>
                    <div>
                      <label className="label">Til</label>
                      <input className="input" placeholder="Kunde AS" value={trip.to} onChange={e => updateTrip(i, 'to', e.target.value)} />
                    </div>
                    <div className="col-span-2">
                      <label className="label">Formål</label>
                      <input className="input" placeholder="Kundemøte – presentasjon av tilbud" value={trip.purpose} onChange={e => updateTrip(i, 'purpose', e.target.value)} />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
                      <input
                        type="checkbox"
                        checked={trip.homeToWork}
                        onChange={e => updateTrip(i, 'homeToWork', e.target.checked)}
                        className="w-4 h-4 rounded accent-red-500"
                      />
                      Hjem ↔ fast arbeidssted (pendling, ikke godtgjørelse)
                    </label>
                    {trips.length > 1 && (
                      <button onClick={() => removeTrip(i)} className="text-xs text-red-500 hover:text-red-700">Slett</button>
                    )}
                  </div>

                  {trip.homeToWork && (
                    <p className="text-xs text-red-700 flex items-center gap-1.5">
                      <AlertTriangle size={12} /> Pendling er ikke godtgjørelsesberettiget kjøring
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="card p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Oppsummering</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-xl p-4 text-center">
                <p className="text-xs text-blue-600 font-medium mb-1">Godtgjørelsesberettiget km</p>
                <p className="text-2xl font-bold text-blue-700">{totalKm.toLocaleString('nb-NO')} km</p>
              </div>
              <div className="bg-green-50 rounded-xl p-4 text-center">
                <p className="text-xs text-green-600 font-medium mb-1">Skattefri godtgjørelse</p>
                <p className="text-2xl font-bold text-green-700">{totalReimbursement.toLocaleString('nb-NO')} kr</p>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-3">Sats: {MILEAGE_RATE_2025} kr/km (statens sats 2026). Utbetalt inntil statens sats er skattefritt.</p>

            <div className="mt-4 p-3 bg-green-50 rounded-lg flex items-start gap-2 text-sm text-green-800">
              <CheckCircle size={14} className="shrink-0 mt-0.5 text-green-600" />
              Kjøregodtgjørelse etter statens sats er skattefritt og ikke arbeidsgiveravgiftspliktig.
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
