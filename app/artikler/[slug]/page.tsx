export const dynamic = 'force-dynamic'

import { notFound } from 'next/navigation'
import { createServiceClient } from '@/lib/supabase-server'
import { getServerT } from '@/lib/get-locale'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import Link from 'next/link'
import type { Metadata } from 'next'
import { marked } from 'marked'
import { ArticleSchema } from '@/components/seo/json-ld'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const supabase = createServiceClient()
  const { data } = await (supabase.from as any)('articles')
    .select('title, excerpt, cover_image')
    .eq('slug', slug)
    .eq('published', true)
    .single()
  if (!data) return {}
  const ogImage = data.cover_image
    ? { url: data.cover_image, width: 1200, height: 630, alt: data.title }
    : { url: '/images/hero.jpg', width: 1200, height: 630, alt: 'TinyRent – Babyutstyr til leie i Bergen' }
  return {
    title: `${data.title} | TinyRent`,
    description: data.excerpt ?? undefined,
    openGraph: {
      title: data.title,
      description: data.excerpt ?? undefined,
      type: 'article',
      images: [ogImage],
    },
    twitter: {
      card: 'summary_large_image',
      title: data.title,
      description: data.excerpt ?? undefined,
      images: [ogImage.url],
    },
  }
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = createServiceClient()
  const { locale } = await getServerT()
  const { data: article } = await (supabase.from as any)('articles')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single()

  if (!article) notFound()

  // Use English fields when locale is EN, fall back to Norwegian
  const displayTitle   = locale === 'en' ? (article.title_en   || article.title)   : article.title
  const displayExcerpt = locale === 'en' ? (article.excerpt_en || article.excerpt) : article.excerpt
  const displayContent = locale === 'en' ? (article.content_en || article.content) : article.content

  const htmlContent = displayContent
    ? await marked.parse(displayContent, { async: true })
    : ''

  return (
    <main className="min-h-screen bg-[var(--color-background)]">
      <ArticleSchema
        title={article.title}
        excerpt={article.excerpt}
        coverImage={article.cover_image}
        publishedAt={article.published_at}
        updatedAt={article.updated_at}
        author={article.author}
        slug={slug}
      />
      <Header />

      <article className="max-w-[720px] mx-auto px-6 py-16">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link href="/artikler" className="text-xs font-medium text-[var(--color-muted)] hover:text-[var(--color-foreground)] transition-colors">
            ← {locale === 'en' ? 'Articles' : 'Artikler'}
          </Link>
        </div>

        {/* Header */}
        <header className="mb-10">
          {article.published_at && (
            <p className="text-xs text-[var(--color-muted)] mb-3">
              {new Date(article.published_at).toLocaleDateString(locale === 'en' ? 'en-GB' : 'nb-NO', {
                day: 'numeric', month: 'long', year: 'numeric'
              })}
              {article.author && ` · ${locale === 'en' ? 'By' : 'Av'} ${article.author}`}
            </p>
          )}
          <h1 className="text-4xl font-bold text-[var(--color-foreground)] tracking-tight leading-tight mb-4">
            {displayTitle}
          </h1>
          {displayExcerpt && (
            <p className="text-lg text-[var(--color-muted)] leading-relaxed">
              {displayExcerpt}
            </p>
          )}
        </header>

        {/* Cover image */}
        {article.cover_image && (
          <div className="rounded-2xl overflow-hidden aspect-[16/9] bg-[var(--color-sand)] mb-12">
            <img
              src={article.cover_image}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Content */}
        {htmlContent && (
          <div
            className="prose prose-lg prose-neutral max-w-none"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        )}

        {/* Footer CTA */}
        <div className="mt-16 pt-12 border-t border-[var(--color-border)] text-center">
          <p className="text-sm text-[var(--color-muted)] mb-4">
            {locale === 'en' ? 'Need baby gear in Bergen?' : 'Trenger du babyutstyr i Bergen?'}
          </p>
          <Link
            href="/bergen"
            className="inline-flex items-center gap-2 bg-[var(--color-foreground)] text-white font-semibold rounded-xl px-6 py-3 text-sm hover:bg-black transition-colors"
          >
            {locale === 'en' ? 'See available gear →' : 'Se tilgjengelig utstyr →'}
          </Link>
        </div>
      </article>

      <Footer />
    </main>
  )
}
