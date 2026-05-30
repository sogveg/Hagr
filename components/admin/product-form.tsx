'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import type { ProductInput } from '@/app/actions/admin'

interface Category { id: string; name: string }
interface Location { id: string; name: string }

interface ProductFormProps {
  categories: Category[]
  locations:  Location[]
  product?: {
    id:                  string
    name:                string
    slug:                string
    brand:               string | null
    short_description:   string | null
    description:         string | null
    price_day:           number | null
    price_week:          number | null
    price_month:         number | null
    deposit_amount:      number
    minimum_rental_days: number
    published:           boolean
    image_url:           string | null
  }
  onSave: (data: ProductInput) => Promise<{ success: boolean; error?: string }>
}

function toSlug(text: string) {
  return text
    .toLowerCase()
    .replace(/æ/g, 'ae').replace(/ø/g, 'o').replace(/å/g, 'a')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

const inputCls =
  'w-full h-11 px-3 text-sm border border-black/[0.12] rounded-xl bg-white ' +
  'focus:outline-none focus:ring-2 focus:ring-[#8FA68B] focus:border-transparent transition-all'
const labelCls = 'block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5'

export function ProductForm({ categories, locations, product, onSave }: ProductFormProps) {
  const router       = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const isEdit = !!product

  // Form state
  const [name,       setName]       = useState(product?.name ?? '')
  const [slug,       setSlug]       = useState(product?.slug ?? '')
  const [slugEdited, setSlugEdited] = useState(isEdit)
  const [brand,      setBrand]      = useState(product?.brand ?? '')
  const [shortDesc,  setShortDesc]  = useState(product?.short_description ?? '')
  const [desc,       setDesc]       = useState(product?.description ?? '')
  const [priceDay,   setPriceDay]   = useState(product?.price_day?.toString()   ?? '')
  const [priceWeek,  setPriceWeek]  = useState(product?.price_week?.toString()  ?? '')
  const [priceMonth, setPriceMonth] = useState(product?.price_month?.toString() ?? '')
  const [deposit,    setDeposit]    = useState(product?.deposit_amount?.toString()      ?? '500')
  const [minDays,    setMinDays]    = useState(product?.minimum_rental_days?.toString() ?? '1')
  const [published,  setPublished]  = useState(product?.published ?? false)
  const [imageUrl,   setImageUrl]   = useState(product?.image_url ?? '')
  const [categoryId, setCategoryId] = useState(categories[0]?.id ?? '')
  const [locationId, setLocationId] = useState(locations[0]?.id  ?? '')
  const [unitCount,  setUnitCount]  = useState('1')

  function handleNameChange(value: string) {
    setName(value)
    if (!slugEdited) setSlug(toSlug(value))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    const data: ProductInput = {
      name,
      slug,
      brand,
      short_description:   shortDesc,
      description:         desc,
      price_day:           priceDay   ? parseFloat(priceDay)   : null,
      price_week:          priceWeek  ? parseFloat(priceWeek)  : null,
      price_month:         priceMonth ? parseFloat(priceMonth) : null,
      deposit_amount:      parseFloat(deposit)  || 0,
      minimum_rental_days: parseInt(minDays)    || 1,
      published,
      image_url:     imageUrl,
      category_id:   categoryId,
      location_id:   locationId,
      inventory_count: parseInt(unitCount) || 0,
    }

    startTransition(async () => {
      const result = await onSave(data)
      if (result.success) {
        router.push('/admin/products')
        router.refresh()
      } else {
        setError(result.error ?? 'Ukjent feil')
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* ── Grunnleggende ─────────────────────────────────── */}
      <section className="bg-white rounded-2xl border border-black/[0.06] p-6">
        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-5">Grunnleggende</h2>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className={labelCls}>Produktnavn *</label>
            <input className={inputCls} value={name}
              onChange={e => handleNameChange(e.target.value)} required placeholder="f.eks. Stokke Tripp Trapp" />
          </div>
          <div>
            <label className={labelCls}>Merke</label>
            <input className={inputCls} value={brand}
              onChange={e => setBrand(e.target.value)} placeholder="f.eks. Stokke" />
          </div>
        </div>

        <div className="mb-4">
          <label className={labelCls}>URL-slug *</label>
          <input className={inputCls} value={slug}
            onChange={e => { setSlug(e.target.value); setSlugEdited(true) }} required
            placeholder="f.eks. stokke-tripp-trapp" />
          <p className="text-xs text-gray-400 mt-1">
            tinyrent.no/bergen/<em>kategori</em>/<strong>{slug || '…'}</strong>
            {isEdit && <span className="ml-2 text-amber-600">⚠ Endring bryter eksisterende lenker</span>}
          </p>
        </div>

        <div className="mb-4">
          <label className={labelCls}>Kort beskrivelse</label>
          <input className={inputCls} value={shortDesc}
            onChange={e => setShortDesc(e.target.value)}
            placeholder="1–2 setninger som vises i søkeresultater og produktliste" />
        </div>

        <div>
          <label className={labelCls}>Fullstendig beskrivelse</label>
          <textarea
            className="w-full px-3 py-2.5 text-sm border border-black/[0.12] rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#8FA68B] focus:border-transparent resize-none transition-all"
            rows={6} value={desc} onChange={e => setDesc(e.target.value)}
            placeholder="Detaljer, mål, aldersbegrensninger, inkludert tilbehør osv." />
        </div>
      </section>

      {/* ── Priser ────────────────────────────────────────── */}
      <section className="bg-white rounded-2xl border border-black/[0.06] p-6">
        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-5">Priser</h2>

        <div className="grid grid-cols-3 gap-4 mb-4">
          <div>
            <label className={labelCls}>Per dag (kr)</label>
            <input className={inputCls} type="number" min="0" step="1"
              value={priceDay} onChange={e => setPriceDay(e.target.value)} placeholder="—" />
          </div>
          <div>
            <label className={labelCls}>Per uke (kr)</label>
            <input className={inputCls} type="number" min="0" step="1"
              value={priceWeek} onChange={e => setPriceWeek(e.target.value)} placeholder="—" />
          </div>
          <div>
            <label className={labelCls}>Per måned (kr)</label>
            <input className={inputCls} type="number" min="0" step="1"
              value={priceMonth} onChange={e => setPriceMonth(e.target.value)} placeholder="—" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Depositum (kr)</label>
            <input className={inputCls} type="number" min="0" step="1"
              value={deposit} onChange={e => setDeposit(e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>Min. leiedager</label>
            <input className={inputCls} type="number" min="1" step="1"
              value={minDays} onChange={e => setMinDays(e.target.value)} />
          </div>
        </div>
      </section>

      {/* ── Bilde ─────────────────────────────────────────── */}
      <section className="bg-white rounded-2xl border border-black/[0.06] p-6">
        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-5">Bilde</h2>

        <label className={labelCls}>Bilde-URL eller sti</label>
        <input className={inputCls} value={imageUrl}
          onChange={e => setImageUrl(e.target.value)}
          placeholder="/images/products/produktnavn.jpg" />

        {imageUrl && (
          <div className="mt-3 w-28 h-28 rounded-xl overflow-hidden bg-gray-100 border border-black/[0.06]">
            <img src={imageUrl} alt="" className="w-full h-full object-cover"
              onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
          </div>
        )}
      </section>

      {/* ── Lokasjon & lager — bare ved nytt produkt ─────── */}
      {!isEdit && (
        <section className="bg-white rounded-2xl border border-black/[0.06] p-6">
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-5">Lokasjon & Lager</h2>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className={labelCls}>Kategori *</label>
              <select className={inputCls} value={categoryId}
                onChange={e => setCategoryId(e.target.value)} required>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Lokasjon *</label>
              <select className={inputCls} value={locationId}
                onChange={e => setLocationId(e.target.value)} required>
                {locations.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Antall enheter</label>
              <input className={inputCls} type="number" min="0" max="20" step="1"
                value={unitCount} onChange={e => setUnitCount(e.target.value)} />
              <p className="text-xs text-gray-400 mt-1">Legges direkte til lager</p>
            </div>
          </div>
        </section>
      )}

      {/* ── Publisert ─────────────────────────────────────── */}
      <section className="bg-white rounded-2xl border border-black/[0.06] px-6 py-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-[#2B2B2B]">Publisert</p>
          <p className="text-xs text-gray-400 mt-0.5">Synlig for kunder på nettstedet</p>
        </div>
        <button
          type="button"
          onClick={() => setPublished(v => !v)}
          className={`relative w-12 h-6 rounded-full transition-colors ${published ? 'bg-[#8FA68B]' : 'bg-gray-200'}`}
          aria-label="Publisert"
        >
          <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${published ? 'translate-x-6' : ''}`} />
        </button>
      </section>

      {/* ── Feil + handlinger ─────────────────────────────── */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="flex items-center gap-3">
        <button
          type="submit" disabled={isPending}
          className="bg-[#2B2B2B] text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {isPending ? 'Lagrer…' : isEdit ? 'Lagre endringer' : 'Opprett produkt'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/products')}
          className="text-sm text-gray-500 px-6 py-2.5 rounded-full font-semibold hover:bg-gray-100 transition-colors"
        >
          Avbryt
        </button>
      </div>
    </form>
  )
}
