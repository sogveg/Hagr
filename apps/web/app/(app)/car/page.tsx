'use client'

import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import { MILEAGE_RATE_2025 } from '@/lib/shared'
import {
  Car, Navigation, Camera, Play, Square, CheckCircle,
  AlertTriangle, Trash2, Plus, ChevronDown, ChevronUp,
  Lightbulb, MapPin, Clock, RefreshCw, X,
} from 'lucide-react'

// ─── Types ─────────────────────────────────────────────────────────────────

interface ActiveTrip {
  startedAt: string       // ISO timestamp
  odometerStart: number
  fromLocation: string
  purpose: string
  companyId: string
}

interface MileageTrip {
  id: string
  trip_date: string
  from_location: string
  to_location: string
  purpose: string
  km: number
  reimbursement_nok: number | null
  odometer_start: number | null
  odometer_end: number | null
  started_at: string | null
  ended_at: string | null
  is_home_to_work: boolean
}

// ─── Camera + OCR component ─────────────────────────────────────────────────

function OdometerCamera({
  onResult,
  onCancel,
  label,
}: {
  onResult: (km: number, dataUrl: string) => void
  onCancel: () => void
  label: string
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [reading, setReading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [manualKm, setManualKm] = useState('')
  const [showManual, setShowManual] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [ocrResult, setOcrResult] = useState<number | null>(null)

  useEffect(() => {
    startCamera()
    return () => stopCamera()
  }, [])

  async function startCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play()
      }
    } catch {
      setError('Kamera ikke tilgjengelig')
      setShowManual(true)
    }
  }

  function stopCamera() {
    streamRef.current?.getTracks().forEach(t => t.stop())
    streamRef.current = null
  }

  async function captureAndRead() {
    if (!videoRef.current || !canvasRef.current) return
    const video = videoRef.current
    const canvas = canvasRef.current
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    canvas.getContext('2d')!.drawImage(video, 0, 0)
    const dataUrl = canvas.toDataURL('image/jpeg', 0.8)
    const base64 = dataUrl.split(',')[1]

    setPreview(dataUrl)
    setReading(true)
    setError(null)

    try {
      const res = await fetch('/api/ai/odometer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64 }),
      })
      const data = await res.json()
      if (data.km) {
        setOcrResult(data.km)
      } else {
        setError('Kunne ikke lese km-standen automatisk')
        setShowManual(true)
      }
    } catch {
      setError('Feil ved avlesning')
      setShowManual(true)
    } finally {
      setReading(false)
    }
  }

  function confirm() {
    if (ocrResult) {
      const dataUrl = preview || ''
      stopCamera()
      onResult(ocrResult, dataUrl)
    }
  }

  function retake() {
    setPreview(null)
    setOcrResult(null)
    setError(null)
    startCamera()
  }

  function submitManual() {
    const km = parseInt(manualKm.replace(/\s/g, ''), 10)
    if (km > 0) {
      stopCamera()
      onResult(km, '')
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-safe-top pt-4 pb-3 bg-black/80">
        <button onClick={() => { stopCamera(); onCancel() }} className="text-white p-2">
          <X size={22} />
        </button>
        <p className="text-white font-medium text-sm">{label}</p>
        <button onClick={() => setShowManual(v => !v)} className="text-gray-300 text-xs px-2 py-1">
          Manuell
        </button>
      </div>

      {/* Camera / Preview */}
      {!preview ? (
        <div className="relative flex-1 flex items-center justify-center bg-black">
          <video ref={videoRef} playsInline muted className="w-full h-full object-cover" />
          <canvas ref={canvasRef} className="hidden" />

          {/* Viewfinder overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <div className="border-2 border-white/60 rounded-xl w-72 h-24 flex items-center justify-center">
              <p className="text-white/40 text-xs">Pek mot km-standen</p>
            </div>
          </div>

          {/* Capture button */}
          {!showManual && (
            <div className="absolute bottom-8 left-0 right-0 flex justify-center">
              <button
                onClick={captureAndRead}
                disabled={reading}
                className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-xl active:scale-95 transition-transform"
              >
                {reading
                  ? <RefreshCw size={28} className="text-gray-900 animate-spin" />
                  : <Camera size={28} className="text-gray-900" />
                }
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="relative flex-1 bg-black flex items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview} alt="Odometer" className="w-full h-full object-contain" />
        </div>
      )}

      {/* Manual input */}
      {showManual && !ocrResult && (
        <div className="bg-gray-950 px-6 py-5 space-y-4">
          <p className="text-white text-sm font-medium">Skriv inn km-stand manuelt</p>
          <input
            type="number"
            inputMode="numeric"
            placeholder="f.eks. 45231"
            value={manualKm}
            onChange={e => setManualKm(e.target.value)}
            className="w-full bg-gray-800 text-white text-2xl text-center rounded-xl px-4 py-3 border border-gray-600 focus:outline-none focus:border-violet-500"
            autoFocus
          />
          <button
            onClick={submitManual}
            disabled={!manualKm || parseInt(manualKm) <= 0}
            className="w-full bg-violet-600 text-white py-3.5 rounded-xl font-semibold text-base disabled:opacity-40"
          >
            Bekreft km-stand
          </button>
        </div>
      )}

      {/* OCR result / error */}
      {(ocrResult || error) && (
        <div className="bg-gray-950 px-6 py-5 space-y-4">
          {ocrResult && (
            <>
              <div className="text-center">
                <p className="text-gray-400 text-xs mb-1">Avlest km-stand</p>
                <p className="text-white text-5xl font-bold tracking-tight">
                  {ocrResult.toLocaleString('nb-NO')}
                </p>
                <p className="text-gray-500 text-sm mt-1">km</p>
              </div>
              <div className="flex gap-3">
                <button onClick={retake} className="flex-1 bg-gray-800 text-white py-3.5 rounded-xl font-medium">
                  Ta nytt bilde
                </button>
                <button onClick={confirm} className="flex-1 bg-violet-600 text-white py-3.5 rounded-xl font-semibold">
                  Bekreft
                </button>
              </div>
            </>
          )}
          {error && !ocrResult && (
            <div className="space-y-3">
              <p className="text-red-400 text-sm text-center">{error}</p>
              <div className="flex gap-3">
                <button onClick={retake} className="flex-1 bg-gray-800 text-white py-3 rounded-xl text-sm">
                  Prøv igjen
                </button>
                <button onClick={() => setShowManual(true)} className="flex-1 bg-violet-600 text-white py-3 rounded-xl text-sm font-medium">
                  Skriv manuelt
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Main page ───────────────────────────────────────────────────────────────

export default function CarPage() {
  const [tab, setTab] = useState<'kjorebok' | 'history' | 'firmabil'>('kjorebok')
  const [companies, setCompanies] = useState<any[]>([])
  const [selectedCompany, setSelectedCompany] = useState('')
  const [trips, setTrips] = useState<MileageTrip[]>([])
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)

  // Active trip (persisted to localStorage)
  const [activeTrip, setActiveTrip] = useState<ActiveTrip | null>(null)

  // Camera state
  const [showCamera, setShowCamera] = useState<'start' | 'end' | null>(null)

  // Start flow
  const [startOdometer, setStartOdometer] = useState<number | null>(null)
  const [fromLocation, setFromLocation] = useState('')
  const [purpose, setPurpose] = useState('')

  // End flow
  const [endOdometer, setEndOdometer] = useState<number | null>(null)
  const [toLocation, setToLocation] = useState('')
  const [saving, setSaving] = useState(false)

  // Tips
  const [showTips, setShowTips] = useState(false)

  // Firmabil
  const [listPrice, setListPrice] = useState('')
  const [carAge, setCarAge] = useState('0')
  const [isElectric, setIsElectric] = useState(false)
  const [businessKm, setBusinessKm] = useState('')
  const [monthsAvailable, setMonthsAvailable] = useState('12')

  useEffect(() => {
    // Load active trip from localStorage
    try {
      const saved = localStorage.getItem('hagr_active_trip')
      if (saved) setActiveTrip(JSON.parse(saved))
    } catch { /* ignore */ }

    // Load companies + trips
    loadData()
  }, [])

  async function loadData() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: access } = await supabase
      .from('company_access').select('company_id').eq('user_id', user.id)
    const ids = (access ?? []).map(r => r.company_id)
    if (!ids.length) return

    const { data: companies } = await supabase.from('companies').select('*').in('id', ids)
    setCompanies(companies ?? [])

    const firstId = companies?.[0]?.id
    if (firstId) {
      setSelectedCompany(firstId)
      await loadTrips(firstId)
    }
  }

  async function loadTrips(companyId: string) {
    const supabase = createClient()
    const { data } = await supabase
      .from('mileage_trips').select('*')
      .eq('company_id', companyId)
      .order('created_at', { ascending: false })
      .limit(100)
    setTrips(data ?? [])
  }

  function saveActiveTrip(trip: ActiveTrip | null) {
    setActiveTrip(trip)
    if (trip) {
      localStorage.setItem('hagr_active_trip', JSON.stringify(trip))
    } else {
      localStorage.removeItem('hagr_active_trip')
    }
  }

  // ── Start trip ─────────────────────────────────────────────────────────────

  async function tryGetLocation(): Promise<string> {
    return new Promise(resolve => {
      if (!navigator.geolocation) { resolve(''); return }
      navigator.geolocation.getCurrentPosition(
        () => resolve(''), // we can't reverse geocode easily, just leave blank
        () => resolve(''),
        { timeout: 3000 }
      )
    })
  }

  async function handleStartTrip() {
    if (!startOdometer || !fromLocation || !purpose || !selectedCompany) return
    const trip: ActiveTrip = {
      startedAt: new Date().toISOString(),
      odometerStart: startOdometer,
      fromLocation,
      purpose,
      companyId: selectedCompany,
    }
    saveActiveTrip(trip)
    // Reset form
    setStartOdometer(null)
    setFromLocation('')
    setPurpose('')
  }

  // ── End trip ──────────────────────────────────────────────────────────────

  async function handleEndTrip() {
    if (!activeTrip || !endOdometer || !toLocation) return
    setSaving(true)

    const km = endOdometer - activeTrip.odometerStart
    if (km <= 0) {
      alert('Slutt-km er lavere enn start-km. Sjekk avlesningen.')
      setSaving(false)
      return
    }

    const reimbursement = Math.round(km * MILEAGE_RATE_2025)
    const now = new Date().toISOString()
    const tripDate = now.slice(0, 10)

    const supabase = createClient()
    const { error } = await supabase.from('mileage_trips').insert({
      company_id: activeTrip.companyId,
      trip_date: tripDate,
      from_location: activeTrip.fromLocation,
      to_location: toLocation,
      purpose: activeTrip.purpose,
      km,
      is_home_to_work: false,
      reimbursement_nok: reimbursement,
      odometer_start: activeTrip.odometerStart,
      odometer_end: endOdometer,
      started_at: activeTrip.startedAt,
      ended_at: now,
    })

    if (!error) {
      saveActiveTrip(null)
      setEndOdometer(null)
      setToLocation('')
      await loadTrips(activeTrip.companyId)
      setTab('history')
    } else {
      alert('Feil ved lagring. Prøv igjen.')
    }
    setSaving(false)
  }

  // ── Delete ────────────────────────────────────────────────────────────────

  async function deleteTrip(id: string) {
    if (!confirm('Slette denne turen?')) return
    setDeleting(id)
    const supabase = createClient()
    await supabase.from('mileage_trips').delete().eq('id', id)
    setTrips(prev => prev.filter(t => t.id !== id))
    setDeleting(null)
  }

  // ── Firmabil calc ─────────────────────────────────────────────────────────
  const carResult = useMemo(() => {
    const lp = parseFloat(listPrice.replace(/\s/g, ''))
    if (!lp || lp <= 0) return null
    let basis = lp
    const age = parseInt(carAge)
    if (age >= 3) basis = basis * 0.75
    const rate = age >= 3 ? 0.20 : 0.30
    let annual = basis * rate
    if (isElectric) annual = annual * 0.50
    if ((parseFloat(businessKm) || 0) >= 40000) annual = annual * 0.75
    annual = annual * (parseInt(monthsAvailable) / 12)
    return {
      annual: Math.round(annual),
      monthly: Math.round(annual / parseInt(monthsAvailable)),
    }
  }, [listPrice, carAge, isElectric, businessKm, monthsAvailable])

  // ── Derived ───────────────────────────────────────────────────────────────
  const totalKm = trips.filter(t => !t.is_home_to_work).reduce((s, t) => s + Number(t.km), 0)
  const totalNok = trips.reduce((s, t) => s + Number(t.reimbursement_nok ?? 0), 0)
  const activeTripDuration = activeTrip
    ? Math.floor((Date.now() - new Date(activeTrip.startedAt).getTime()) / 1000 / 60)
    : 0

  return (
    <div className="max-w-lg mx-auto">
      {/* Camera overlay */}
      {showCamera && (
        <OdometerCamera
          label={showCamera === 'start' ? 'Fotografer km-stand ved avreise' : 'Fotografer km-stand ved ankomst'}
          onResult={(km) => {
            if (showCamera === 'start') setStartOdometer(km)
            else setEndOdometer(km)
            setShowCamera(null)
          }}
          onCancel={() => setShowCamera(null)}
        />
      )}

      {/* Header */}
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-gray-900">Bil</h1>
        <p className="text-gray-500 mt-0.5 text-sm">Kjørebok og firmabilfordel</p>
      </div>

      {/* Company selector */}
      {companies.length > 1 && (
        <select className="input w-full mb-4" value={selectedCompany} onChange={e => {
          setSelectedCompany(e.target.value)
          loadTrips(e.target.value)
        }}>
          {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      )}

      {/* Tabs */}
      <div className="flex gap-1 mb-5 border-b border-gray-200">
        {([
          { id: 'kjorebok', label: 'Ny tur' },
          { id: 'history', label: `Turer (${trips.length})` },
          { id: 'firmabil', label: 'Firmabil' },
        ] as const).map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
              tab === t.id ? 'border-violet-600 text-violet-700' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── NY TUR ─────────────────────────────────────────────────────────── */}
      {tab === 'kjorebok' && (
        <div className="space-y-4">

          {/* Tips */}
          <div className="rounded-xl border border-amber-200 bg-amber-50 overflow-hidden">
            <button onClick={() => setShowTips(v => !v)} className="w-full flex items-center justify-between px-4 py-3 text-left">
              <span className="flex items-center gap-2 text-amber-800 font-medium text-sm">
                <Lightbulb size={14} strokeWidth={2} /> Tips og regler
              </span>
              {showTips ? <ChevronUp size={14} className="text-amber-500" /> : <ChevronDown size={14} className="text-amber-500" />}
            </button>
            {showTips && (
              <div className="px-4 pb-4 space-y-2 border-t border-amber-200 pt-2 text-sm text-amber-900">
                <p>• <strong>4,50 kr/km</strong> skattefritt ved statens sats (2026)</p>
                <p>• Hjem ↔ fast arbeidssted er <strong>ikke</strong> godtgjørelsesberettiget</p>
                <p>• Krev dokumentasjon: fra, til, formål og km for hvert oppdrag</p>
                <p>• Over 10 000 km/år: vurder firmabil i stedet</p>
              </div>
            )}
          </div>

          {/* ACTIVE TRIP BANNER */}
          {activeTrip && (
            <div className="rounded-2xl bg-violet-600 text-white p-5 shadow-lg">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-violet-200 text-xs font-medium uppercase tracking-wide">Pågående tur</span>
                  </div>
                  <p className="text-xl font-bold">{activeTrip.fromLocation}</p>
                  <p className="text-violet-200 text-sm mt-0.5">{activeTrip.purpose}</p>
                </div>
                <div className="text-right text-violet-200 text-sm">
                  <div className="flex items-center gap-1.5 justify-end">
                    <Clock size={13} />
                    <span>{activeTripDuration} min</span>
                  </div>
                  <p className="text-xs mt-1">start: {activeTrip.odometerStart.toLocaleString('nb-NO')} km</p>
                </div>
              </div>

              {/* Stop flow */}
              {!endOdometer ? (
                <button
                  onClick={() => setShowCamera('end')}
                  className="w-full bg-white text-violet-700 font-bold py-4 rounded-xl text-base flex items-center justify-center gap-2 active:scale-98 transition-transform"
                >
                  <Square size={18} fill="currentColor" />
                  Stopp og fotografer km-stand
                </button>
              ) : (
                <div className="space-y-3">
                  <div className="bg-white/10 rounded-xl px-4 py-3">
                    <p className="text-violet-200 text-xs mb-0.5">Slutt km-stand</p>
                    <div className="flex items-center justify-between">
                      <p className="text-2xl font-bold">{endOdometer.toLocaleString('nb-NO')} km</p>
                      <button onClick={() => setEndOdometer(null)} className="text-violet-300 text-xs underline">Endre</button>
                    </div>
                    <p className="text-violet-200 text-sm mt-1">
                      = <strong className="text-white">{(endOdometer - activeTrip.odometerStart).toLocaleString('nb-NO')} km kjørt</strong>
                      {' '}· {Math.round((endOdometer - activeTrip.odometerStart) * MILEAGE_RATE_2025).toLocaleString('nb-NO')} kr
                    </p>
                  </div>
                  <input
                    className="w-full bg-white/10 text-white placeholder-violet-300 rounded-xl px-4 py-3 border border-white/20 focus:outline-none focus:border-white text-sm"
                    placeholder="Til (leveringssted / kunde)"
                    value={toLocation}
                    onChange={e => setToLocation(e.target.value)}
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => { saveActiveTrip(null); setEndOdometer(null); setToLocation('') }}
                      className="flex-1 bg-white/10 text-white py-3 rounded-xl text-sm"
                    >
                      Avbryt tur
                    </button>
                    <button
                      onClick={handleEndTrip}
                      disabled={saving || !toLocation}
                      className="flex-2 flex-1 bg-white text-violet-700 py-3 rounded-xl font-bold text-sm disabled:opacity-50"
                    >
                      {saving ? 'Lagrer…' : 'Lagre tur'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* START NEW TRIP */}
          {!activeTrip && (
            <div className="card p-5 space-y-4">
              <h2 className="font-semibold text-gray-900">Start ny tur</h2>

              {/* Odometer start */}
              {!startOdometer ? (
                <button
                  onClick={() => setShowCamera('start')}
                  className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold py-5 rounded-2xl text-base flex items-center justify-center gap-3 active:scale-98 transition-all shadow-md"
                >
                  <Camera size={22} />
                  Fotografer km-stand
                </button>
              ) : (
                <div className="bg-violet-50 rounded-xl px-4 py-3 flex items-center justify-between">
                  <div>
                    <p className="text-violet-700 text-xs font-medium">Start km-stand</p>
                    <p className="text-2xl font-bold text-violet-900">{startOdometer.toLocaleString('nb-NO')} km</p>
                  </div>
                  <button onClick={() => setStartOdometer(null)} className="text-violet-500 text-xs underline">Endre</button>
                </div>
              )}

              <div>
                <label className="label">Fra <span className="text-red-400">*</span></label>
                <div className="relative">
                  <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    className="input pl-9"
                    placeholder="F.eks. Bergen sentrum"
                    value={fromLocation}
                    onChange={e => setFromLocation(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="label">Formål <span className="text-red-400">*</span></label>
                <input
                  className="input"
                  placeholder="F.eks. Kundemøte hos Firma AS"
                  value={purpose}
                  onChange={e => setPurpose(e.target.value)}
                />
              </div>

              <button
                onClick={handleStartTrip}
                disabled={!startOdometer || !fromLocation || !purpose}
                className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold text-base flex items-center justify-center gap-2 disabled:opacity-40 active:scale-98 transition-all"
              >
                <Play size={18} fill="currentColor" />
                Start tur
              </button>

              {!startOdometer && (
                <button
                  onClick={() => {
                    const km = parseInt(prompt('Skriv inn km-stand (uten mellomrom):') ?? '')
                    if (km > 0) setStartOdometer(km)
                  }}
                  className="w-full text-gray-500 text-sm text-center py-2 underline"
                >
                  Har ikke kamera — skriv inn manuelt
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── HISTORIKK ─────────────────────────────────────────────────────── */}
      {tab === 'history' && (
        <div className="space-y-4">
          {/* Summary */}
          {trips.length > 0 && (
            <div className="grid grid-cols-2 gap-3">
              <div className="card p-4">
                <p className="text-2xl font-bold text-gray-900">{totalKm.toLocaleString('nb-NO')}</p>
                <p className="text-sm text-gray-500">km totalt</p>
              </div>
              <div className="card p-4">
                <p className="text-2xl font-bold text-green-600">{totalNok.toLocaleString('nb-NO')} kr</p>
                <p className="text-sm text-gray-500">godtgjørelse</p>
              </div>
            </div>
          )}

          {trips.length === 0 ? (
            <div className="card p-10 text-center">
              <Navigation size={32} className="text-gray-300 mx-auto mb-3" strokeWidth={1.5} />
              <p className="font-semibold text-gray-700">Ingen turer registrert ennå</p>
              <p className="text-sm text-gray-500 mt-1">Bruk «Ny tur»-fanen for å logge kjøring</p>
            </div>
          ) : (
            <div className="space-y-2">
              {trips.map(trip => (
                <div key={trip.id} className="card p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="font-semibold text-gray-900 text-sm truncate">
                          {trip.from_location} → {trip.to_location}
                        </p>
                      </div>
                      <p className="text-xs text-gray-500 truncate">{trip.purpose}</p>
                      <div className="flex items-center gap-3 mt-1.5">
                        <span className="text-xs text-gray-400">{trip.trip_date}</span>
                        <span className="text-xs font-semibold text-blue-600">{Number(trip.km).toLocaleString('nb-NO')} km</span>
                        {trip.odometer_start && trip.odometer_end && (
                          <span className="text-xs text-gray-400">
                            ({trip.odometer_start.toLocaleString('nb-NO')} → {trip.odometer_end.toLocaleString('nb-NO')})
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-bold text-green-600 text-sm">
                        {Number(trip.reimbursement_nok ?? 0).toLocaleString('nb-NO')} kr
                      </p>
                      <button
                        onClick={() => deleteTrip(trip.id)}
                        disabled={deleting === trip.id}
                        className="mt-1 text-gray-300 hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── FIRMABIL ──────────────────────────────────────────────────────── */}
      {tab === 'firmabil' && (
        <div className="space-y-4">
          <div className="card p-5 space-y-4">
            <h2 className="font-semibold text-gray-900">Fordelsberegning firmabil</h2>

            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="label">Listepris ny (kr)</label>
                <input className="input" placeholder="550 000" value={listPrice} onChange={e => setListPrice(e.target.value)} />
              </div>
              <div>
                <label className="label">Alder (år)</label>
                <input className="input" type="number" min="0" value={carAge} onChange={e => setCarAge(e.target.value)} />
              </div>
              <div>
                <label className="label">Måneder tilgjengelig</label>
                <select className="input" value={monthsAvailable} onChange={e => setMonthsAvailable(e.target.value)}>
                  {[...Array(12)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>{i + 1} mnd</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Yrkeskjøring/år (km)</label>
                <input className="input" placeholder="15 000" value={businessKm} onChange={e => setBusinessKm(e.target.value)} />
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={isElectric} onChange={e => setIsElectric(e.target.checked)} className="w-4 h-4 rounded accent-violet-600" />
              <span className="text-sm text-gray-700">El-bil (50% reduksjon)</span>
            </label>
          </div>

          {carResult && (
            <div className="card p-5 space-y-4">
              <h3 className="font-semibold text-gray-900">Resultat</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-blue-50 rounded-xl p-4 text-center">
                  <p className="text-xs text-blue-600 font-medium mb-1">Årlig skattegrunnlag</p>
                  <p className="text-2xl font-bold text-blue-700">{carResult.annual.toLocaleString('nb-NO')} kr</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <p className="text-xs text-gray-500 font-medium mb-1">Per måned</p>
                  <p className="text-2xl font-bold text-gray-700">{carResult.monthly.toLocaleString('nb-NO')} kr</p>
                </div>
              </div>
              <p className="text-xs text-gray-400">Innberettes i a-meldingen (kode 113-A).</p>
            </div>
          )}

          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 space-y-1.5">
            <p className="font-semibold text-amber-800">💡 Firmabilregler 2026</p>
            <p>• Under 3 år: 30% av listepris</p>
            <p>• Over 3 år: 20% av 75% av listepris</p>
            <p>• El-bil: 50% rabatt på grunnlag</p>
            <p>• Over 40 000 km yrke: 25% reduksjon</p>
            <p>• Uten kjørebok = all kjøring regnes privat</p>
          </div>
        </div>
      )}
    </div>
  )
}
