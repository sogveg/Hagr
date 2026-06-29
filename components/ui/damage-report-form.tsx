'use client'

import { useState, useTransition } from 'react'
import { addAdminDamageReport, addCustomerDamageReport } from '@/app/actions/damage'

const SEVERITY_OPTIONS = [
  { value: 'minor',    label: 'Liten skade',    desc: 'Kosmetisk — påvirker ikke funksjon',  color: 'text-yellow-700' },
  { value: 'moderate', label: 'Moderat skade',  desc: 'Synlig skade med noe funksjonstap',   color: 'text-orange-600' },
  { value: 'severe',   label: 'Alvorlig skade', desc: 'Ødelagt / krever reparasjon',         color: 'text-red-600' },
] as const

type Severity = typeof SEVERITY_OPTIONS[number]['value']

export type BookingProduct = { id: string; name: string }

interface DamageReportFormProps {
  bookingId:      string
  isAdmin:        boolean
  products?:      BookingProduct[]   // products in this booking for the dropdown
  onSuccess?:     () => void
}

export function DamageReportForm({ bookingId, isAdmin, products, onSuccess }: DamageReportFormProps) {
  const [isPending, startTransition] = useTransition()
  const [productId,   setProductId]  = useState<string>(products?.[0]?.id ?? '')
  const [description, setDescription] = useState('')
  const [severity,    setSeverity]    = useState<Severity>('minor')
  const [amount,      setAmount]      = useState('')
  const [photoUrl,    setPhotoUrl]    = useState('')
  const [error,       setError]       = useState<string | null>(null)
  const [success,     setSuccess]     = useState(false)

  const showProductSelect = products && products.length > 1

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!description.trim()) return
    setError(null)

    startTransition(async () => {
      const result = isAdmin
        ? await addAdminDamageReport(bookingId, {
            description,
            severity,
            amount_charged: amount ? parseFloat(amount) : null,
            photo_url:      photoUrl || null,
            product_id:     productId || null,
          })
        : await addCustomerDamageReport(bookingId, {
            description,
            severity,
            photo_url:  photoUrl || null,
            product_id: productId || null,
          })

      if (result.success) {
        setDescription('')
        setSeverity('minor')
        setAmount('')
        setPhotoUrl('')
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

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      {/* Produktvelger — kun vis om det er flere produkter i bookingen */}
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

      {/* Alvorlighet */}
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

      {/* Beskrivelse */}
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
          Beskriv skaden *
        </label>
        <textarea
          className={inputCls + ' resize-none'}
          rows={3}
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder={isAdmin
            ? 'Beskriv skaden nøyaktig — hva, hvor på produktet, omfang...'
            : 'Beskriv skaden du har oppdaget / forårsaket...'}
          required
        />
      </div>

      {/* Beløp (kun admin) */}
      {isAdmin && (
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Gebyr (kr) — la stå tomt hvis ikke aktuelt
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

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      {success && (
        <p className="text-sm text-[#5A7A55] font-medium">Skaderapport registrert</p>
      )}

      <button
        type="submit"
        disabled={isPending || !description.trim()}
        className="bg-[#2B2B2B] text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-40"
      >
        {isPending ? 'Lagrer…' : 'Registrer skade'}
      </button>
    </form>
  )
}
