import { notFound, redirect } from 'next/navigation'
import { createServiceClient } from '@/lib/supabase-server'
import { ArticleForm } from '@/components/admin/article-form'
import { updateArticle, deleteArticle } from '@/app/actions/articles'
import type { ArticleInput } from '@/app/actions/articles'

export default async function RedigerArtikkel({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = createServiceClient()
  const { data: article } = await (supabase.from as any)('articles')
    .select('*')
    .eq('id', id)
    .single()

  if (!article) notFound()

  async function handleSave(input: ArticleInput): Promise<{ success: boolean; error?: string }> {
    'use server'
    return updateArticle(id, input)
  }

  async function handleDelete(): Promise<void> {
    'use server'
    await deleteArticle(id)
    redirect('/admin/artikler')
  }

  return (
    <ArticleForm
      onSave={handleSave}
      onDelete={handleDelete}
      article={article}
    />
  )
}
