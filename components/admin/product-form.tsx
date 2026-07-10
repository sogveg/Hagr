'use client'

import { useState, useTransition, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import type { ProductInput } from '@/app/actions/admin'
import { uploadProductImage, deleteProduct } from '@/app/actions/admin'

interface Category { id: string; name: string }
interface Location { id: string; name: string }

interface ProductFormProps {
  categories:        Category[]
  locations:         Location[]
  currentCategoryId?: string
  product?: {
    id:                   string
    name:                 string
    slug:                 string
    brand:                string | null
    short_description:     string | null
    short_description_en?: string | null
    description:           string | null
    description_en?:       string | null
    price_day:            number | null
    price_week:           number | null
    price_month:          number | null
    deposit_amount:       number
    minimum_rental_days:  number
    published:            boolean
    image_url:            string | null
    images?:              string[] | null
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

export function ProductForm({ categories, locations, currentCategoryId, product, onSave }: ProductFormProps) {
  const router       = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const isEdit = !!product

  // Form state
  const [name,         setName]         = useState(product?.name ?? '')
  const [slug,         setSlug]         = useState(product?.slug ?? '')
  const [slugEdited,   setSlugEdited]   = useState(isEdit)
  const [brand,        setBrand]        = useState(product?.brand ?? '')
  const [shortDesc,    setShortDesc]    = useState(product?.short_description ?? '')
  const [shortDescEn,  setShortDescEn]  = useState(product?.short_description_en ?? '')
  const [desc,         setDesc]         = useState(product?.description ?? '')
  const [descEn,       setDescEn]       = useState(product?.description_en ?? '')
  const [deleting,     setDeleting]     = useState(false)
  const [priceDay,        setPriceDay]        = useState(product?.price_day?.toString()   ?? '')
  const [priceWeek,       setPriceWeek]       = useState(product?.price_week?.toString()  ?? '')
  const [priceMonth,      setPriceMonth]      = useState(product?.price_month?.toString() ?? '')
  // dayPriceManual = true means the user has overridden the auto-calculation
  const [dayPriceManual,  setDayPriceManual]  = useState(!!product?.price_day)

  function calcSuggestedDay(weekVal: string): string {
    const w = parseFloat(weekVal)
    if (!w || w <= 0) return ''
    return String(Math.ceil(w / 5))
  }

  function handleWeekPriceChange(val: string) {
    setPriceWeek(val)
    if (!dayPriceManual) {
      setPriceDay(calcSuggestedDay(val))
    }
  }

  function handleDayPriceChange(val: string) {
    setPriceDay(val)
    setDayPriceManual(true)
  }

  function resetDayPriceToAuto() {
    setDayPriceManual(false)
    setPriceDay(calcSuggestedDay(priceWeek))
  }
  const [deposit,    setDeposit]    = useState(product?.deposit_amount?.toString()      ?? '500')
  const [minDays,    setMinDays]    = useState(product?.minimum_rental_days?.toString() ?? '1')
  const [published,  setPublished]  = useState(product?.published ?? false)
  // Multi-image state: start from images[] array, fall back to image_url
  const initialImages = (product?.images && product.images.length > 0)
    ? product.images
    : product?.image_url
    ? [product.image_url]
    : []
  const [images,       setImages]       = useState<string[]>(initialImages)
  const [uploading,    setUploading]    = useState(false)
  const [uploadError,  setUploadError]  = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [categoryId, setCategoryId] = useState(currentCategoryId ?? categories[0]?.id ?? '')
  const [locationId, setLocationId] = useState(locations[0]?.id  ?? '')
  const [unitCount,  setUnitCount]  = useState('1')

  async function handleImageUpload(files: FileList) {
    setUploading(true)
    setUploadError(null)
    try {
      const newUrls: string[] = []
      for (const file of Array.from(files)) {
        const formData = new FormData()
        formData.append('file', file)
        const result = await uploadProductImage(formData)
        if (!result.success || !result.url) throw new Error(result.error ?? 'Opplasting feilet')
        newUrls.push(result.url)
      }
      setImages(prev => [...prev, ...newUrls])
    } catch (err: any) {
      setUploadError(err?.message ?? 'Opplasting feilet')
    } finally {
      setUploading(false)
      // Reset file input so the same file can be re-selected
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  function removeImage(index: number) {
    setImages(prev => prev.filter((_, i) => i !== index))
  }

  function moveImage(from: number, to: number) {
    setImages(prev => {
      const next = [...prev]
      const [item] = next.splice(from, 1)
      next.splice(to, 0, item)
      return next
    })
  }

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
      short_description:    shortDesc,
      short_description_en: shortDescEn,
      description:          desc,
      description_en:       descEn,
      price_day:           priceDay   ? parseFloat(priceDay)   : null,
      price_week:          priceWeek  ? parseFloat(priceWeek)  : null,
      price_month:         priceMonth ? parseFloat(priceMonth) : null,
      deposit_amount:      parseFloat(deposit)  || 0,
      minimum_rental_days: parseInt(minDays)    || 1,
      published,
      image_url:     images[0] ?? '',
      images,
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

        {/* Norwegian descriptions */}
        <div className="mb-4">
          <label className={labelCls}>
            <span className="mr-1.5">🇳🇴</span>Kort beskrivelse (norsk)
          </label>
          <input className={inputCls} value={shortDesc}
            onChange={e => setShortDesc(e.target.value)}
            placeholder="1–2 setninger som vises i søkeresultater og produktliste" />
        </div>

        <div className="mb-6">
          <label className={labelCls}>
            <span className="mr-1.5">🇳🇴</span>Fullstendig beskrivelse (norsk)
          </label>
          <textarea
            className="w-full px-3 py-2.5 text-sm border border-black/[0.12] rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#8FA68B] focus:border-transparent resize-none transition-all"
            rows={5} value={desc} onChange={e => setDesc(e.target.value)}
            placeholder="Detaljer, mål, aldersbegrensninger, inkludert tilbehør osv." />
        </div>

        {/* English translations */}
        <div className="border-t border-black/[0.06] pt-5">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">
            🇬🇧 Engelsk oversettelse (valgfritt)
          </p>

          <div className="mb-4">
            <label className={labelCls}>Short description (English)</label>
            <input className={inputCls} value={shortDescEn}
              onChange={e => setShortDescEn(e.target.value)}
              placeholder="1–2 sentences shown in search results" />
          </div>

          <div>
            <label className={labelCls}>Full description (English)</label>
            <textarea
              className="w-full px-3 py-2.5 text-sm border border-black/[0.12] rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#8FA68B] focus:border-transparent resize-none transition-all"
              rows={5} value={descEn} onChange={e => setDescEn(e.target.value)}
              placeholder="Details, dimensions, age limits, included accessories etc." />
          </div>
        </div>
      </section>

      {/* ── Priser ────────────────────────────────────────── */}
      <section className="bg-white rounded-2xl border border-black/[0.06] p-6">
        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-5">Priser</h2>

        <div className="grid grid-cols-3 gap-4 mb-4">
          <div>
            <label className={labelCls}>Per dag (kr)</label>
            <input
              className={`${inputCls} ${!dayPriceManual && priceDay ? 'border-[#8FA68B]/60 bg-[#F5F8F4]' : ''}`}
              type="number" min="0" step="1"
              value={priceDay}
              onChange={e => handleDayPriceChange(e.target.value)}
              placeholder="—"
            />
            <p className="text-[10px] mt-1 min-h-[14px]">
              {!dayPriceManual && priceDay ? (
                <span className="text-[#4A6741] font-medium">Auto (uke / 5)</span>
              ) : dayPriceManual && priceWeek ? (
                <button
                  type="button"
                  onClick={resetDayPriceToAuto}
                  className="text-gray-400 hover:text-[#4A6741] underline transition-colors"
                >
                  Tilbakestill til {calcSuggestedDay(priceWeek)} kr (uke / 5)
                </button>
              ) : null}
            </p>
          </div>
          <div>
            <label className={labelCls}>Per uke (kr)</label>
            <input className={inputCls} type="number" min="0" step="1"
              value={priceWeek} onChange={e => handleWeekPriceChange(e.target.value)} placeholder="—" />
            <p className="text-[10px] mt-1 text-gray-400 min-h-[14px]">
              {priceWeek ? `Dagspris settes til ${calcSuggestedDay(priceWeek)} kr ved auto` : ''}
            </p>
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

      {/* ── Bilder ────────────────────────────────────────── */}
      <section className="bg-white rounded-2xl border border-black/[0.06] p-6">
        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Bilder</h2>
        <p className="text-xs text-gray-400 mb-5">
          Første bilde er hovedbildet. Dra for å omorganisere (kommer snart). Opptil 8 bilder.
        </p>

        {/* Image grid */}
        <div className="flex flex-wrap gap-3 mb-4">
          {images.map((url, i) => (
            <div key={url + i} className="relative w-24 h-24 rounded-xl overflow-hidden bg-[#F8F7F4] group border border-black/[0.06]">
              <Image src={url} alt={`Bilde ${i + 1}`} fill className="object-cover" sizes="96px" />

              {/* Primary badge */}
              {i === 0 && (
                <span className="absolute top-1 left-1 text-[9px] font-bold bg-[#8FA68B] text-white rounded px-1 py-0.5 leading-none">
                  HOVED
                </span>
              )}

              {/* Delete button */}
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                aria-label="Fjern bilde"
              >
                ×
              </button>

              {/* Move left / right */}
              {images.length > 1 && (
                <div className="absolute bottom-1 left-0 right-0 flex justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {i > 0 && (
                    <button type="button" onClick={() => moveImage(i, i - 1)}
                      className="w-5 h-5 rounded bg-black/60 text-white text-xs flex items-center justify-center hover:bg-black">
                      ‹
                    </button>
                  )}
                  {i < images.length - 1 && (
                    <button type="button" onClick={() => moveImage(i, i + 1)}
                      className="w-5 h-5 rounded bg-black/60 text-white text-xs flex items-center justify-center hover:bg-black">
                      ›
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}

          {/* Add image button */}
          {images.length < 8 && (
            <div
              className="w-24 h-24 rounded-xl border-2 border-dashed border-black/10 flex flex-col items-center justify-center cursor-pointer hover:border-[#8FA68B] hover:bg-[#F8F7F4] transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <span className="text-2xl text-gray-300 leading-none">{uploading ? '⏳' : '+'}</span>
              <span className="text-[10px] text-gray-400 mt-1">Legg til</span>
            </div>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={e => { if (e.target.files?.length) handleImageUpload(e.target.files) }}
        />

        <div className="flex items-center gap-3">
          <button
            type="button"
            disabled={uploading || images.length >= 8}
            onClick={() => fileInputRef.current?.click()}
            className="text-sm font-semibold px-4 py-2 rounded-xl border border-black/10 hover:bg-[#F8F7F4] transition-colors disabled:opacity-50"
          >
            {uploading ? 'Laster opp…' : 'Last opp bilder'}
          </button>

          {/* URL paste fallback */}
          <input
            className="flex-1 h-9 px-3 text-sm border border-black/[0.12] rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#8FA68B] focus:border-transparent"
            placeholder="Eller lim inn bilde-URL her og trykk Enter"
            onKeyDown={e => {
              if (e.key === 'Enter') {
                e.preventDefault()
                const val = (e.target as HTMLInputElement).value.trim()
                if (val && images.length < 8) {
                  setImages(prev => [...prev, val]);
                  (e.target as HTMLInputElement).value = ''
                }
              }
            }}
          />
        </div>

        {uploadError && (
          <p className="text-xs text-red-500 mt-2">{uploadError}</p>
        )}
        {images.length > 0 && !uploading && (
          <p className="text-xs text-green-600 mt-2">✓ {images.length} bilde{images.length !== 1 ? 'r' : ''} lagt til</p>
        )}
      </section>

      {/* ── Kategori — alltid synlig ──────────────────────── */}
      <section className="bg-white rounded-2xl border border-black/[0.06] p-6">
        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-5">Kategori</h2>
        <div className={isEdit ? 'max-w-xs' : 'grid grid-cols-3 gap-4'}>
          <div>
            <label className={labelCls}>Kategori *</label>
            <select className={inputCls} value={categoryId}
              onChange={e => setCategoryId(e.target.value)} required>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          {!isEdit && (
            <>
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
            </>
          )}
        </div>
      </section>

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

        {isEdit && product && (
          <button
            type="button"
            disabled={deleting}
            onClick={async () => {
              if (!confirm(`Slette "${product.name}"? Dette fjerner produktet, lagerenhetene og tilknyttet data permanent.`)) return
              setDeleting(true)
              const res = await deleteProduct(product.id)
              if (res.success) {
                router.push('/admin/products')
                router.refresh()
              } else {
                setDeleting(false)
                alert(res.error ?? 'Sletting feilet')
              }
            }}
            className="ml-auto text-sm text-red-400 hover:text-red-600 font-medium transition-colors disabled:opacity-50"
          >
            {deleting ? 'Sletter…' : 'Slett produkt'}
          </button>
        )}
      </div>
    </form>
  )
}
