export const dynamic = 'force-dynamic'

import { createServiceClient } from '@/lib/supabase-server'
import Link from 'next/link'
import Image from 'next/image'
import { toggleArticlePublished } from '@/app/actions/articles'

function readingTime(content: string) {
  const words = content?.trim().split(/\s+/).length ?? 0
  const mins = Math.max(1, Math.ceil(words / 200))
  return `${mins} min`
}

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('nb-NO', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default async function AdminArtikler() {
  const supabase = createServiceClient()
  const { data: articles } = await (supabase.from as any)('articles')
    .select('id, title, slug, excerpt, cover_image, author, published, published_at, created_at, content')
    .order('created_at', { ascending: false })

  const all       = articles ?? []
  const published = all.filter((a: any) => a.published)
  const drafts    = all.filter((a: any) => !a.published)

  return (
    <div className="min-h-screen bg-[#F8F7F4]">

      {/* Header */}
      <div className="bg-white border-b border-black/[0.06] px-8 py-5 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#2B2B2B] tracking-tight">Artikler</h1>
          <div className="flex items-center gap-3 mt-0.5">
            <span className="text-xs text-gray-400">{all.length} totalt</span>
            <span className="text-gray-200">·</span>
            <span className="text-xs text-green-600 font-medium">{published.length} publisert</span>
            {drafts.length > 0 && (
              <>
                <span className="text-gray-200">·</span>
                <span className="text-xs text-gray-400">{drafts.length} utkast</span>
              </>
            )}
          </div>
        </div>
        <Link
          href="/admin/artikler/ny"
          className="bg-[#2B2B2B] text-white text-sm font-semibold rounded-xl px-5 py-2.5 hover:bg-black transition-colors flex items-center gap-2"
        >
          <span className="text-base leading-none">+</span> Ny artikkel
        </Link>
      </div>

      <div className="p-8">
        {all.length === 0 ? (
          <div className="bg-white rounded-2xl border border-black/[0.06] px-8 py-20 text-center">
            <p className="text-4xl mb-4">✏️</p>
            <p className="text-[#2B2B2B] font-semibold mb-2">Ingen artikler ennå</p>
            <p className="text-sm text-gray-400 mb-6">Skriv din første artikkel og nå ut til kundene dine.</p>
            <Link
              href="/admin/artikler/ny"
              className="inline-flex items-center gap-2 bg-[#2B2B2B] text-white text-sm font-semibold rounded-xl px-5 py-2.5 hover:bg-black transition-colors"
            >
              Skriv første artikkel →
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {all.map((article: any) => (
              <div
                key={article.id}
                className="bg-white rounded-2xl border border-black/[0.06] overflow-hidden flex hover:border-black/10 transition-colors group"
              >
                {/* Thumbnail */}
                <div className="relative w-28 h-24 shrink-0 bg-[#F0EAE0] overflow-hidden">
                  {article.cover_image ? (
                    <Image
                      src={article.cover_image}
                      alt={article.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="112px"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl text-gray-200">
                      ✏️
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 px-5 py-4 flex items-center justify-between gap-4 min-w-0">
                  <div className="flex-1 min-w-0">
                    {/* Status + meta row */}
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        article.published
                          ? 'bg-green-100 text-green-700'
                          : 'bg-amber-50 text-amber-600'
                      }`}>
                        {article.published ? 'Publisert' : 'Utkast'}
                      </span>
                      {article.author && (
                        <span className="text-xs text-gray-400">{article.author}</span>
                      )}
                      {article.content && (
                        <span className="text-xs text-gray-300 font-mono">
                          {readingTime(article.content)} lesetid
                        </span>
                      )}
                      <span className="text-xs text-gray-300">
                        {fmtDate(article.published_at ?? article.created_at)}
                      </span>
                    </div>

                    {/* Title */}
                    <p className="text-sm font-semibold text-[#2B2B2B] truncate leading-snug">
                      {article.title || <span className="text-gray-300 italic">Ingen tittel</span>}
                    </p>

                    {/* Excerpt */}
                    {article.excerpt && (
                      <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{article.excerpt}</p>
                    )}

                    {/* Slug */}
                    <p className="text-[10px] text-gray-300 font-mono mt-1">/artikler/{article.slug}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    {/* Publish toggle */}
                    <form action={toggleArticlePublished.bind(null, article.id, !article.published)}>
                      <button
                        type="submit"
                        className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors ${
                          article.published
                            ? 'border-gray-200 text-gray-400 hover:bg-gray-50 hover:text-gray-600'
                            : 'border-green-200 text-green-700 hover:bg-green-50'
                        }`}
                      >
                        {article.published ? 'Avpubliser' : 'Publiser'}
                      </button>
                    </form>

                    {/* Edit */}
                    <Link
                      href={`/admin/artikler/${article.id}/rediger`}
                      className="text-xs font-semibold text-white bg-[#2B2B2B] hover:bg-black px-3 py-1.5 rounded-lg transition-colors"
                    >
                      Rediger
                    </Link>

                    {/* View public */}
                    {article.published && (
                      <Link
                        href={`/artikler/${article.slug}`}
                        target="_blank"
                        className="text-xs text-gray-300 hover:text-gray-500 px-2 py-1.5 transition-colors"
                        title="Se publisert artikkel"
                      >
                        ↗
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
