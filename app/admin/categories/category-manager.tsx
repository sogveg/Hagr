'use client'

import { useState, useTransition } from 'react'
import { createCategory, updateCategory, deleteCategory } from '@/app/actions/admin'
import { useRouter } from 'next/navigation'

interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  active: boolean
  sort_order: number
}

function toSlug(text: string) {
  return text
    .toLowerCase()
    .replace(/æ/g, 'ae').replace(/ø/g, 'o').replace(/å/g, 'a')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

const inputCls =
  'w-full h-9 px-3 text-sm border border-black/[0.12] rounded-xl bg-white ' +
  'focus:outline-none focus:ring-2 focus:ring-[#8FA68B] focus:border-transparent transition-all'

export function CategoryManager({ initialCategories }: { initialCategories: Category[] }) {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>(initialCategories)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  // New category form state
  const [newName, setNewName]       = useState('')
  const [newSlug, setNewSlug]       = useState('')
  const [newDesc, setNewDesc]       = useState('')
  const [slugEdited, setSlugEdited] = useState(false)

  // Edit form state
  const [editName, setEditName] = useState('')
  const [editSlug, setEditSlug] = useState('')
  const [editDesc, setEditDesc] = useState('')
  const [editActive, setEditActive] = useState(true)

  function startEdit(cat: Category) {
    setEditingId(cat.id)
    setEditName(cat.name)
    setEditSlug(cat.slug)
    setEditDesc(cat.description ?? '')
    setEditActive(cat.active)
  }

  function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!newName.trim()) return
    setError(null)
    startTransition(async () => {
      const result = await createCategory({ name: newName, slug: newSlug || undefined, description: newDesc })
      if (result.success) {
        setNewName(''); setNewSlug(''); setNewDesc(''); setSlugEdited(false)
        router.refresh()
      } else {
        setError(result.error ?? 'Feil ved opprettelse')
      }
    })
  }

  function handleSaveEdit(id: string) {
    setError(null)
    startTransition(async () => {
      const result = await updateCategory(id, {
        name: editName, slug: editSlug, description: editDesc, active: editActive,
      })
      if (result.success) {
        setEditingId(null)
        router.refresh()
      } else {
        setError(result.error ?? 'Feil ved lagring')
      }
    })
  }

  function handleDelete(id: string, name: string) {
    if (!confirm(`Slett kategorien «${name}»? Dette kan ikke angres.`)) return
    setError(null)
    startTransition(async () => {
      const result = await deleteCategory(id)
      if (!result.success) setError(result.error ?? 'Feil ved sletting')
      else router.refresh()
    })
  }

  return (
    <div className="space-y-6">
      {/* ── Legg til ny ────────────────────────────────────────── */}
      <section className="bg-white rounded-2xl border border-black/[0.06] p-6">
        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-5">
          Legg til kategori
        </h2>
        <form onSubmit={handleAdd} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                Navn *
              </label>
              <input
                className={inputCls}
                value={newName}
                onChange={e => {
                  setNewName(e.target.value)
                  if (!slugEdited) setNewSlug(toSlug(e.target.value))
                }}
                placeholder="f.eks. Vogner"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                Slug (URL)
              </label>
              <input
                className={inputCls}
                value={newSlug}
                onChange={e => { setNewSlug(e.target.value); setSlugEdited(true) }}
                placeholder="f.eks. vogner"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
              Beskrivelse
            </label>
            <input
              className={inputCls}
              value={newDesc}
              onChange={e => setNewDesc(e.target.value)}
              placeholder="Valgfri beskrivelse som vises på kategorisiden"
            />
          </div>
          <div className="flex items-center gap-3 pt-1">
            <button
              type="submit"
              disabled={isPending || !newName.trim()}
              className="bg-[#2B2B2B] text-white px-5 py-2 rounded-full text-sm font-semibold hover:opacity-90 disabled:opacity-50 transition-opacity"
            >
              {isPending ? 'Legger til…' : '+ Legg til'}
            </button>
          </div>
        </form>
      </section>

      {/* ── Eksisterende kategorier ───────────────────────────── */}
      <section className="bg-white rounded-2xl border border-black/[0.06] overflow-hidden">
        <div className="px-6 py-4 border-b border-black/[0.06]">
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Eksisterende kategorier ({categories.length})
          </h2>
        </div>

        {categories.length === 0 ? (
          <p className="px-6 py-10 text-sm text-gray-400 text-center">Ingen kategorier ennå</p>
        ) : (
          <div className="divide-y divide-black/[0.04]">
            {categories.map(cat => (
              <div key={cat.id} className="px-6 py-4">
                {editingId === cat.id ? (
                  /* ── Edit mode ── */
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Navn</label>
                        <input className={inputCls} value={editName}
                          onChange={e => setEditName(e.target.value)} />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Slug</label>
                        <input className={inputCls} value={editSlug}
                          onChange={e => setEditSlug(e.target.value)} />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Beskrivelse</label>
                      <input className={inputCls} value={editDesc}
                        onChange={e => setEditDesc(e.target.value)} />
                    </div>
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editActive}
                          onChange={e => setEditActive(e.target.checked)}
                          className="w-4 h-4 rounded accent-[#8FA68B]"
                        />
                        Aktiv (synlig på nettstedet)
                      </label>
                    </div>
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => handleSaveEdit(cat.id)}
                        disabled={isPending}
                        className="bg-[#2B2B2B] text-white px-4 py-1.5 rounded-full text-xs font-semibold hover:opacity-90 disabled:opacity-50 transition-opacity"
                      >
                        {isPending ? 'Lagrer…' : 'Lagre'}
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="text-xs text-gray-500 px-4 py-1.5 rounded-full hover:bg-gray-100 font-semibold transition-colors"
                      >
                        Avbryt
                      </button>
                    </div>
                  </div>
                ) : (
                  /* ── Read mode ── */
                  <div className="flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-sm font-semibold text-[#2B2B2B] truncate">{cat.name}</p>
                        {!cat.active && (
                          <span className="text-[10px] font-bold bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded">
                            INAKTIV
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 font-mono">{cat.slug}</p>
                      {cat.description && (
                        <p className="text-xs text-gray-500 mt-0.5 truncate">{cat.description}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => startEdit(cat)}
                        className="text-xs font-semibold text-[#8FA68B] hover:underline"
                      >
                        Rediger
                      </button>
                      <span className="text-gray-200">|</span>
                      <button
                        onClick={() => handleDelete(cat.id, cat.name)}
                        disabled={isPending}
                        className="text-xs font-semibold text-red-400 hover:text-red-600 disabled:opacity-50"
                      >
                        Slett
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}
    </div>
  )
}
