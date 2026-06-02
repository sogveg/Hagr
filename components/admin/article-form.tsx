'use client'

import { useState, useEffect, useTransition } from 'react'
import Link from 'next/link'
import { marked } from 'marked'
import type { ArticleInput } from '@/app/actions/articles'

function toSlug(s: string) {
  return s
    .toLowerCase()
    .replace(/æ/g, 'ae').replace(/ø/g, 'o').replace(/å/g, 'a')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function wordCount(s: string) {
  return s.trim() ? s.trim().split(/\s+/).length : 0
}

function readingTime(words: number) {
  const mins = Math.ceil(words / 200)
  return mins <= 1 ? '~1 min' : `~${mins} min`
}

interface ArticleFormProps {
  onSave:   (input: ArticleInput) => Promise<{ success: boolean; error?: string }>
  onDelete?: () => Promise<void>
  article?: {
    title: string; slug: string; excerpt: string
    content: string; cover_image: string; author: string; published: boolean
    title_en?: string; excerpt_en?: string; content_en?: string
  }
}

type Tab = 'write' | 'preview' | 'settings'
type Lang = 'no' | 'en'

export function ArticleForm({ onSave, onDelete, article }: ArticleFormProps) {
  const isEdit = !!article

  // Norwegian fields
  const [title,      setTitle]      = useState(article?.title       ?? '')
  const [slug,       setSlug]       = useState(article?.slug        ?? '')
  const [excerpt,    setExcerpt]    = useState(article?.excerpt     ?? '')
  const [content,    setContent]    = useState(article?.content     ?? '')
  const [slugEdited, setSlugEdited] = useState(isEdit)

  // English fields
  const [titleEn,   setTitleEn]   = useState(article?.title_en   ?? '')
  const [excerptEn, setExcerptEn] = useState(article?.excerpt_en ?? '')
  const [contentEn, setContentEn] = useState(article?.content_en ?? '')

  // Shared fields
  const [coverImage, setCoverImage] = useState(article?.cover_image ?? '')
  const [author,     setAuthor]     = useState(article?.author      ?? 'TinyRent')
  const [published,  setPublished]  = useState(article?.published   ?? false)

  const [lang,        setLang]        = useState<Lang>('no')
  const [tab,         setTab]         = useState<Tab>('write')
  const [previewHtml, setPreviewHtml] = useState('')
  const [saveState,   setSaveState]   = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [saveError,   setSaveError]   = useState<string | null>(null)
  const [deleting,    setDeleting]    = useState(false)
  const [isPending,   startTransition] = useTransition()

  // Derive the active content/title for the current language
  const activeContent = lang === 'no' ? content : contentEn
  const activeTitle   = lang === 'no' ? title   : titleEn

  // Update live preview whenever content or lang changes
  useEffect(() => {
    if (activeContent) {
      const html = marked.parse(activeContent)
      setPreviewHtml(typeof html === 'string' ? html : String(html))
    } else {
      setPreviewHtml('')
    }
  }, [activeContent])

  function handleTitleChange(v: string) {
    if (lang === 'no') {
      setTitle(v)
      if (!slugEdited) setSlug(toSlug(v))
    } else {
      setTitleEn(v)
    }
  }

  function handleContentChange(v: string) {
    if (lang === 'no') setContent(v)
    else setContentEn(v)
  }

  function handleSave() {
    setSaveState('saving')
    setSaveError(null)
    startTransition(async () => {
      const result = await onSave({
        title, slug, excerpt, content,
        cover_image: coverImage, author, published,
        title_en: titleEn, excerpt_en: excerptEn, content_en: contentEn,
      })
      if (result.success) {
        setSaveState('saved')
        setTimeout(() => setSaveState('idle'), 2500)
      } else {
        setSaveState('error')
        setSaveError(result.error ?? 'Noe gikk galt')
      }
    })
  }

  async function handleDelete() {
    if (!onDelete) return
    if (!confirm('Er du sikker på at du vil slette denne artikkelen? Dette kan ikke angres.')) return
    setDeleting(true)
    await onDelete()
  }

  const wc = wordCount(activeContent)

  return (
    <div className="flex flex-col bg-[#F8F7F4]" style={{ minHeight: '100vh' }}>

      {/* ── Sticky top bar ─────────────────────────────────────────── */}
      <header className="sticky top-0 z-20 bg-white border-b border-black/[0.06] px-5 h-14 flex items-center gap-3 shrink-0">
        <Link
          href="/admin/artikler"
          className="shrink-0 text-sm text-gray-400 hover:text-gray-700 transition-colors font-medium flex items-center gap-1"
        >
          ←
        </Link>

        <div className="w-px h-5 bg-black/10 shrink-0" />

        {/* Language toggle */}
        <div className="flex items-center rounded-full border border-black/[0.10] bg-black/[0.03] p-0.5 gap-0.5 shrink-0">
          <button
            type="button"
            onClick={() => setLang('no')}
            className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold transition-all ${
              lang === 'no' ? 'bg-white shadow-sm text-[#2B2B2B]' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            🇳🇴 NO
          </button>
          <button
            type="button"
            onClick={() => setLang('en')}
            className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold transition-all ${
              lang === 'en' ? 'bg-white shadow-sm text-[#2B2B2B]' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            🇬🇧 EN
          </button>
        </div>

        {/* Title input */}
        <input
          value={activeTitle}
          onChange={e => handleTitleChange(e.target.value)}
          placeholder={lang === 'no' ? 'Artikkeltittel…' : 'Article title…'}
          className="flex-1 text-base font-semibold text-[#2B2B2B] bg-transparent border-none outline-none placeholder-gray-300 min-w-0"
        />

        {/* Word count */}
        {wc > 0 && (
          <span className="hidden md:block text-xs text-gray-300 shrink-0 font-mono">
            {wc.toLocaleString('nb-NO')} ord · {readingTime(wc)}
          </span>
        )}

        {/* Status toggle */}
        <button
          type="button"
          onClick={() => setPublished(p => !p)}
          className={`shrink-0 text-xs font-bold px-3 py-1.5 rounded-full border transition-colors ${
            published
              ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
              : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100'
          }`}
        >
          {published ? '● Publisert' : '○ Utkast'}
        </button>

        {/* Save button */}
        <button
          type="button"
          onClick={handleSave}
          disabled={isPending || saveState === 'saving'}
          className={`shrink-0 text-sm font-semibold rounded-xl px-4 py-1.5 transition-colors ${
            saveState === 'saved'
              ? 'bg-green-100 text-green-700'
              : saveState === 'error'
              ? 'bg-red-50 text-red-600'
              : 'bg-[#2B2B2B] text-white hover:bg-black disabled:opacity-50'
          }`}
        >
          {saveState === 'saving' ? 'Lagrer…' : saveState === 'saved' ? '✓ Lagret' : saveState === 'error' ? '✕ Feil' : 'Lagre'}
        </button>
      </header>

      {/* Error toast */}
      {saveState === 'error' && saveError && (
        <div className="bg-red-50 border-b border-red-100 px-6 py-2 text-sm text-red-600">
          {saveError}
        </div>
      )}

      {/* Language indicator bar */}
      {lang === 'en' && (
        <div className="bg-blue-50 border-b border-blue-100 px-6 py-1.5 text-xs text-blue-600 font-medium">
          🇬🇧 Du redigerer den engelske versjonen. Norsk innhold bevares separat.
        </div>
      )}

      {/* ── Mobile tabs ─────────────────────────────────────────────── */}
      <div className="lg:hidden flex border-b border-black/[0.06] bg-white">
        {(['write', 'preview', 'settings'] as Tab[]).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2.5 text-xs font-semibold transition-colors ${
              tab === t
                ? 'text-[#2B2B2B] border-b-2 border-[#2B2B2B]'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            {t === 'write' ? 'Skriv' : t === 'preview' ? 'Forhåndsvis' : 'Innstillinger'}
          </button>
        ))}
      </div>

      {/* ── Main editor area ────────────────────────────────────────── */}
      <div className="flex flex-1">

        {/* Left: Editor */}
        <div className={`flex flex-col flex-1 border-r border-black/[0.06] bg-white ${tab !== 'write' ? 'hidden lg:flex' : 'flex'}`}>
          <div className="flex items-center gap-3 px-5 py-2 border-b border-black/[0.04] bg-[#FAFAFA]">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Markdown</span>
            <div className="flex gap-2 text-[11px] text-gray-300 font-mono">
              <span># H1</span>
              <span>## H2</span>
              <span>**fet**</span>
              <span>*kursiv*</span>
              <span>- liste</span>
              <span>[tekst](url)</span>
            </div>
          </div>

          <textarea
            value={activeContent}
            onChange={e => handleContentChange(e.target.value)}
            placeholder={
              lang === 'no'
                ? 'Skriv innholdet ditt her i Markdown-format…\n\n# Overskrift\n\nBrødtekst med **fet** og *kursiv* tekst.\n\n## Underoverskrift\n\n- Punktliste\n- Andre punkt'
                : 'Write your English content here in Markdown format…\n\n# Heading\n\nBody text with **bold** and *italic* text.\n\n## Subheading\n\n- Bullet point\n- Another point'
            }
            className="flex-1 w-full px-8 py-6 font-mono text-[13px] leading-relaxed text-[#2B2B2B] bg-white resize-none border-none outline-none placeholder-gray-200"
            style={{ minHeight: 'calc(100vh - 56px - 200px)' }}
            spellCheck={false}
          />
        </div>

        {/* Right: Preview */}
        <div className={`flex-col flex-1 bg-white ${tab !== 'preview' ? 'hidden lg:flex' : 'flex'}`}>
          <div className="flex items-center gap-2 px-5 py-2 border-b border-black/[0.04] bg-[#FAFAFA]">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Forhåndsvisning</span>
            <span className="text-[10px] text-gray-300">{lang === 'no' ? '🇳🇴' : '🇬🇧'}</span>
          </div>
          <div className="flex-1 overflow-y-auto px-10 py-8">
            {previewHtml ? (
              <>
                {coverImage && (
                  <img
                    src={coverImage}
                    alt="Cover"
                    className="w-full rounded-xl object-cover mb-8 max-h-56"
                    onError={e => (e.currentTarget.style.display = 'none')}
                  />
                )}
                <h1 className="text-3xl font-bold text-[#2B2B2B] mb-4 leading-tight">
                  {activeTitle || (lang === 'no' ? 'Artikkeltittel' : 'Article title')}
                </h1>
                {(lang === 'no' ? excerpt : excerptEn) && (
                  <p className="text-lg text-gray-500 mb-6 leading-relaxed">
                    {lang === 'no' ? excerpt : excerptEn}
                  </p>
                )}
                <div
                  className="prose prose-neutral max-w-none"
                  dangerouslySetInnerHTML={{ __html: previewHtml }}
                />
              </>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-sm text-gray-300 text-center">
                  {lang === 'no' ? 'Begynn å skrive for å se forhåndsvisning' : 'Start writing to see preview'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Settings panel ──────────────────────────────────────────── */}
      <div className={`border-t border-black/[0.06] bg-white ${tab !== 'settings' ? 'hidden lg:block' : 'block'}`}>
        <div className="px-6 py-4">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Artikkelmeta</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">

            {/* Slug — always Norwegian based */}
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1.5">URL-slug *</label>
              <div className="flex items-center border border-black/10 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-[#8FA68B]/40">
                <span className="px-2 text-xs text-gray-300 font-mono shrink-0">/artikler/</span>
                <input
                  value={slug}
                  onChange={e => { setSlug(e.target.value); setSlugEdited(true) }}
                  required
                  className="flex-1 px-2 py-2.5 text-xs font-mono text-[#2B2B2B] bg-transparent border-none outline-none min-w-0"
                  placeholder="min-artikkel"
                />
              </div>
            </div>

            {/* Author */}
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1.5">Forfatter</label>
              <input
                value={author}
                onChange={e => setAuthor(e.target.value)}
                className="w-full border border-black/10 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#8FA68B]/40"
                placeholder="TinyRent"
              />
            </div>

            {/* Cover image */}
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1.5">Forsidebilde URL</label>
              <div className="flex gap-2 items-center">
                <input
                  value={coverImage}
                  onChange={e => setCoverImage(e.target.value)}
                  className="flex-1 border border-black/10 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#8FA68B]/40 min-w-0"
                  placeholder="https://..."
                />
                {coverImage && (
                  <img
                    src={coverImage}
                    alt="preview"
                    className="h-9 w-14 object-cover rounded-lg border border-black/10 shrink-0"
                    onError={e => (e.currentTarget.style.display = 'none')}
                  />
                )}
              </div>
            </div>

            {/* Excerpt — Norwegian */}
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1.5">🇳🇴 Ingress (norsk)</label>
              <textarea
                value={excerpt}
                onChange={e => setExcerpt(e.target.value)}
                rows={2}
                className="w-full border border-black/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#8FA68B]/40 resize-none"
                placeholder="Vises i artikkellisten og i søk…"
              />
            </div>

            {/* Excerpt — English */}
            <div className="lg:col-start-4">
              <label className="block text-xs font-bold text-gray-500 mb-1.5">🇬🇧 Excerpt (English)</label>
              <textarea
                value={excerptEn}
                onChange={e => setExcerptEn(e.target.value)}
                rows={2}
                className="w-full border border-black/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#8FA68B]/40 resize-none"
                placeholder="Shown in article list and search…"
              />
            </div>
          </div>

          {/* Delete */}
          {isEdit && onDelete && (
            <div className="mt-4 pt-4 border-t border-black/[0.04] flex items-center justify-end">
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="text-xs text-red-400 hover:text-red-600 font-medium transition-colors"
              >
                {deleting ? 'Sletter…' : 'Slett artikkel'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
