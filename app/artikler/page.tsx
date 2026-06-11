export const dynamic = 'force-dynamic'

import { createServiceClient } from '@/lib/supabase-server'
import { getServerT } from '@/lib/get-locale'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Artikler & Tips',
  description: 'Les våre artikler om babyutstyr, reiser med baby og tips til foreldre i Bergen.',
  alternates: {
    canonical: 'https://www.tinyrent.no/artikler',
  },
  openGraph: {
    title: 'Artikler & Tips',
    description: 'Les våre artikler om babyutstyr, reiser med baby og tips til foreldre i Bergen.',
    url: 'https://www.tinyrent.no/artikler',
    images: [
      {
        url: '/images/hero.jpg',
        width: 1200,
        height: 630,
        alt: 'TinyRent – Artikler og tips om babyutstyr',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Artikler & Tips',
    description: 'Les våre artikler om babyutstyr, reiser med baby og tips til foreldre i Bergen.',
    images: ['/images/hero.jpg'],
  },
}

export default async function ArticlesPage() {
  const supabase = createServiceClient()
  const { locale } = await getServerT()
  const { data: articles } = await (supabase.from as any)('articles')
    .select('*')
    .eq('published', true)
    .order('published_at', { ascending: false })

  return (
    <main className="min-h-screen bg-[var(--color-background)]">
      <Header />

      <div className="max-w-[960px] mx-auto px-6 py-16">
        <div className="mb-12 text-center">
          <p className="text-xs font-bold text-[var(--color-primary)] uppercase tracking-widest mb-3">
            {locale === 'en' ? 'Tips & advice' : 'Tips & råd'}
          </p>
          <h1 className="text-4xl font-bold text-[var(--color-foreground)] tracking-tight">
            {locale === 'en' ? 'Articles from TinyRent' : 'Artikler fra TinyRent'}
          </h1>
          <p className="text-[var(--color-muted)] mt-3 max-w-lg mx-auto">
            {locale === 'en'
              ? 'Everything you need to know about baby gear, travelling with a baby, and smart choices for the little ones.'
              : 'Alt du trenger å vite om babyutstyr, reiser med baby og kloke valg for de små.'}
          </p>
        </div>

        {(articles ?? []).length === 0 ? (
          <div className="text-center py-20">
            <p className="text-[var(--color-muted)] text-sm">
              {locale === 'en' ? 'No articles published yet. Check back soon!' : 'Ingen artikler publisert ennå. Kom tilbake snart!'}
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            {(articles ?? []).map((article: any) => {
              const displayTitle   = locale === 'en' ? (article.title_en   || article.title)   : article.title
              const displayExcerpt = locale === 'en' ? (article.excerpt_en || article.excerpt) : article.excerpt
              return (
                <Link
                  key={article.id}
                  href={`/artikler/${article.slug}`}
                  className="group bg-white rounded-2xl border border-[var(--color-border)] overflow-hidden hover:shadow-md transition-shadow"
                >
                  {article.cover_image && (
                    <div className="aspect-[16/9] overflow-hidden bg-[var(--color-sand)]">
                      <img
                        src={article.cover_image}
                        alt={displayTitle}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    {article.published_at && (
                      <p className="text-xs text-[var(--color-muted)] mb-2">
                        {new Date(article.published_at).toLocaleDateString(locale === 'en' ? 'en-GB' : 'nb-NO', {
                          day: 'numeric', month: 'long', year: 'numeric'
                        })}
                        {article.author && ` · ${article.author}`}
                      </p>
                    )}
                    <h2 className="text-lg font-bold text-[var(--color-foreground)] leading-snug mb-2 group-hover:text-[var(--color-primary-dark)] transition-colors">
                      {displayTitle}
                    </h2>
                    {displayExcerpt && (
                      <p className="text-sm text-[var(--color-muted)] leading-relaxed line-clamp-3">
                        {displayExcerpt}
                      </p>
                    )}
                    <p className="text-xs font-semibold text-[var(--color-primary-dark)] mt-4">
                      {locale === 'en' ? 'Read more →' : 'Les mer →'}
                    </p>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>

      <Footer />
    </main>
  )
}
