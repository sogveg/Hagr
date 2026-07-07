'use client'

import { useState, useTransition } from 'react'
import { addAdminDamageReport, addCustomerDamageReport } from '@/app/actions/damage'
import type { ReportType } from '@/app/actions/damage'

const REPORT_TYPES: { value: ReportType; label: string; desc: string; suggestedAmount?: number }[] = [
  { value: 'damage',         label: 'Skade',         desc: 'Fysisk skade på utstyr' },
  { value: 'cleaning',       label: 'Skitten',        desc: 'Enkel rengjøring kreves',      suggestedAmount: 200 },
  { value: 'extra_cleaning', label: 'Ekstra skitten', desc: 'Grundig rengjøring / spesielt', suggestedAmount: 500 },
]

const SEVERITY_OPTIONS = [
  { value: 'minor',    label: 'Liten skade',    desc: 'Kosmetisk — påvirker ikke funksjon',  color: 'text-yellow-700' },
  { value: 'moderate', label: 'Moderat skade',  desc: 'Synlig skade med noe funksjonstap',   color: 'text-orange-600' },
  { value: 'severe',   label: 'Alvorlig skade', desc: 'Ødelagt / krever reparasjon',         color: 'text-red-600' },
] as const

type Severity = typeof SEVERITY_OPTIONS[number]['value']

export type BookingProduct = { id: string; name: string }

interface DamageReportFormProps {
  bookingId:  string
  isAdmin:    boolean
  products?:  BookingProduct[]
  onSuccess?: () => void
}

export function DamageReportForm({ bookingId, isAdmin, products, onSuccess }: DamageReportFormProps) {
  const [isPending, startTransition] = useTransition()
  const [reportType,   setReportType]   = useState<ReportType>('damage')
  const [productId,    setProductId]    = useState<string>(products?.[0]?.id ?? '')
  const [description,  setDescription]  = useState('')
  const [severity,     setSeverity]     = useState<Severity>('minor')
  const [amount,       setAmount]       = useState('')
  const [photoUrl,     setPhotoUrl]     = useState('')
  const [error,        setError]        = useState<string | null>(null)
  const [success,      setSuccess]      = useState(false)

  const showProductSelect = products && products.length > 1
  const isDamage = reportType === 'damage'

  function handleTypeChange(type: ReportType) {
    setReportType(type)
    const preset = REPORT_TYPES.find(t => t.value === type)
    if (preset?.suggestedAmount) {
      setAmount(String(preset.suggestedAmount))
    } else {
      setAmount('')
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!description.trim()) return
    setError(null)

    startTransition(async () => {
      const result = isAdmin
        ? await addAdminDamageReport(bookingId, {
            description,
            severity:       isDamage ? severity : 'minor',
            amount_charged: amount ? parseFloat(amount) : null,
            photo_url:      photoUrl || null,
            product_id:     productId || null,
            report_type:    reportType,
          })
        : await addCustomerDamageReport(bookingId, {
            description,
            severity:   isDamage ? severity : 'minor',
            photo_url:  photoUrl || null,
            product_id: productId || null,
          })

      if (result.success) {
        setDescription('')
        setSeverity('minor')
        setAmount('')
        setPhotoUrl('')
        setReportType('damage')
        setSuccess(true)
        setTimeout(() => setSuccess(false), 4000)
        onSuccess?.()
      } else {
        setError(result.error ?? 'Ukjent feil')
      }
    })
  }

  const inputCls =
    'w-full px-3 py-2.5 text-sm border border-black/[0.12] rounded-xl bg-white ' +
    'focus:outline-none focus:ring-2 focus:ring-[#8FA68B] focus:border-transparent transition-all'

  const descPlaceholder =
    reportType === 'cleaning'       ? 'Beskriv hva som var skitten og omfanget...' :
    reportType === 'extra_cleaning' ? 'Beskriv hva som krevde ekstra rengjøring...' :
    isAdmin ? 'Beskriv skaden nøyaktig — hva, hvor på produktet, omfang...' :
              'Beskriv skaden du har oppdaget / forårsaket...'

  const submitLabel =
    reportType === 'cleaning'       ? 'Registrer rengjøringsgebyr' :
    reportType === 'extra_cleaning' ? 'Registrer ekstragebyr' :
                                      'Registrer skade'

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      {/* Type */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Type trekk</p>
        <div className="grid grid-cols-3 gap-2">
          {REPORT_TYPES.map(opt => (
            <label
              key={opt.value}
              className={`relative flex flex-col gap-0.5 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                reportType === opt.value
                  ? 'border-[#8FA68B] bg-[#8FA68B]/[0.05]'
                  : 'border-black/[0.08] hover:border-black/[0.16]'
              }`}
            >
              <input
                type="radio"
                name="reportType"
                value={opt.value}
                checked={reportType === opt.value}
                onChange={() => handleTypeChange(opt.value)}
                className="sr-only"
              />
              <span className="text-sm font-semibold text-[#2B2B2B]">{opt.label}</span>
              <span className="text-[10px] text-gray-400 leading-tight">{opt.desc}</span>
              {opt.suggestedAmount && (
                <span className="text-[10px] font-bold text-[#8FA68B] mt-0.5">{opt.suggestedAmount} kr forslag</span>
              )}
            </label>
          ))}
        </div>
      </div>

      {/* Produktvelger */}
      {showProductSelect && (
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Gjelder produkt
          </label>
          <select
            className={inputCls}
            value={productId}
            onChange={e => setProductId(e.target.value)}
          >
            <option value="">Alle produkter / Uspesifisert</option>
            {products.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
      )}

      {/* Alvorlighet — kun for skade */}
      {isDamage && (
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Alvorlighetsgrad</p>
          <div className="grid grid-cols-3 gap-2">
            {SEVERITY_OPTIONS.map(opt => (
              <label
                key={opt.value}
                className={`relative flex flex-col gap-0.5 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                  severity === opt.value
                    ? 'border-[#8FA68B] bg-[#8FA68B]/[0.05]'
                    : 'border-black/[0.08] hover:border-black/[0.16]'
                }`}
              >
                <input
                  type="radio"
                  name="severity"
                  value={opt.value}
                  checked={severity === opt.value}
                  onChange={() => setSeverity(opt.value)}
                  className="sr-only"
                />
                <span className={`text-sm font-semibold ${opt.color}`}>{opt.label}</span>
                <span className="text-[10px] text-gray-400 leading-tight">{opt.desc}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Beskrivelse */}
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
          Beskrivelse *
        </label>
        <textarea
          className={inputCls + ' resize-none'}
          rows={3}
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder={descPlaceholder}
          required
        />
      </div>

      {/* Beløp (kun admin) */}
      {isAdmin && (
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Trekk i depositum (kr){!isDamage && amount ? ` — forslag: ${amount} kr` : ''}
          </label>
          <input
            type="number"
            min="0"
            step="1"
            className={inputCls}
            value={amount}
            onChange={e => setAmount(e.target.value)}
            placeholder="0"
          />
        </div>
      )}

      {/* Foto-URL */}
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
          Lenke til bilde (valgfritt)
        </label>
        <input
          type="url"
          className={inputCls}
          value={photoUrl}
          onChange={e => setPhotoUrl(e.target.value)}
          placeholder="https://..."
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
      {success && <p className="text-sm text-[#5A7A55] font-medium">Registrert og trukket fra depositum</p>}

      <button
        type="submit"
        disabled={isPending || !description.trim()}
        className="bg-[#2B2B2B] text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-40"
      >
        {isPending ? 'Lagrer…' : submitLabel}
      </button>
    </form>
  )
}
