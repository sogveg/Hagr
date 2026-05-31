'use server'

import { revalidatePath } from 'next/cache'
import { createServiceClient, createClient } from '@/lib/supabase-server'

async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Ikke innlogget')
  const adminEmails = (process.env.ADMIN_EMAILS ?? '').split(',').map(e => e.trim().toLowerCase()).filter(Boolean)
  if (adminEmails.length > 0 && !adminEmails.includes((user.email ?? '').toLowerCase())) {
    throw new Error('Ikke tilgang')
  }
}

export type ArticleInput = {
  title: string
  slug: string
  excerpt: string
  content: string
  cover_image: string
  author: string
  published: boolean
}

async function uniqueSlug(base: string, excludeId?: string): Promise<string> {
  const supabase = createServiceClient()
  let slug = base
  let n = 1
  while (true) {
    const q = (supabase.from as any)('articles').select('id').eq('slug', slug)
    if (excludeId) q.neq('id', excludeId)
    const { data } = await q.maybeSingle()
    if (!data) return slug
    n++
    slug = `${base}-${n}`
  }
}

export async function createArticle(input: ArticleInput): Promise<{ success: boolean; error?: string }> {
  try {
    await requireAdmin()
    const supabase = createServiceClient()
    const slug = await uniqueSlug(input.slug)
    const { error } = await (supabase.from as any)('articles').insert({
      ...input,
      slug,
      published_at: input.published ? new Date().toISOString() : null,
    })
    if (error) return { success: false, error: error.message }
    revalidatePath('/admin/artikler')
    revalidatePath('/artikler')
    return { success: true }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}

export async function updateArticle(id: string, input: ArticleInput): Promise<{ success: boolean; error?: string }> {
  try {
    await requireAdmin()
    const supabase = createServiceClient()
    const { data: current } = await (supabase.from as any)('articles').select('published, published_at').eq('id', id).single()
    const slug = await uniqueSlug(input.slug, id)
    const { error } = await (supabase.from as any)('articles').update({
      ...input,
      slug,
      published_at: input.published && !current?.published_at ? new Date().toISOString() : current?.published_at,
      updated_at: new Date().toISOString(),
    }).eq('id', id)
    if (error) return { success: false, error: error.message }
    revalidatePath('/admin/artikler')
    revalidatePath('/artikler')
    revalidatePath(`/artikler/${slug}`)
    return { success: true }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}

export async function toggleArticlePublished(id: string, published: boolean) {
  await requireAdmin()
  const supabase = createServiceClient()
  await (supabase.from as any)('articles').update({
    published,
    published_at: published ? new Date().toISOString() : null,
    updated_at: new Date().toISOString(),
  }).eq('id', id)
  revalidatePath('/admin/artikler')
  revalidatePath('/artikler')
}

export async function deleteArticle(id: string) {
  await requireAdmin()
  const supabase = createServiceClient()
  await (supabase.from as any)('articles').delete().eq('id', id)
  revalidatePath('/admin/artikler')
  revalidatePath('/artikler')
}
