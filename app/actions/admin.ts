'use server'

import { revalidatePath } from 'next/cache'
import { createServiceClient, createClient } from '@/lib/supabase-server'

// ─── Auth helper ─────────────────────────────────────────────────────────────

async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Ikke innlogget')

  const raw = process.env.ADMIN_EMAILS ?? ''
  if (raw) {
    const adminEmails = raw.split(',').map(e => e.trim().toLowerCase())
    if (!adminEmails.includes((user.email ?? '').toLowerCase())) {
      throw new Error('Ikke tilgang')
    }
  }
  // If ADMIN_EMAILS is not set, allow all (dev mode)
}

// ─── Booking actions ──────────────────────────────────────────────────────────

// Used as a form action (must return void)
export async function updateBookingStatus(bookingId: string, status: string) {
  await requireAdmin()
  const supabase = createServiceClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await supabase.from('bookings').update({ status: status as any }).eq('id', bookingId)
  revalidatePath('/admin/bookings')
  revalidatePath(`/admin/bookings/${bookingId}`)
}

// Used by StatusDropdown (returns success/error for optimistic UI)
export async function setBookingStatus(
  bookingId: string,
  status: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await requireAdmin()
    const supabase = createServiceClient()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await supabase.from('bookings').update({ status: status as any }).eq('id', bookingId)
    if (error) return { success: false, error: error.message }
    revalidatePath('/admin/bookings')
    revalidatePath(`/admin/bookings/${bookingId}`)
    return { success: true }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}

// ─── Product actions ──────────────────────────────────────────────────────────

export type ProductInput = {
  name: string
  slug: string
  brand: string
  short_description: string
  short_description_en: string
  description: string
  description_en: string
  price_day: number | null
  price_week: number | null
  price_month: number | null
  deposit_amount: number
  minimum_rental_days: number
  published: boolean
  image_url: string
  images: string[]       // All images; image_url is kept as first for backward compat
  // Only used on create:
  category_id: string
  location_id: string
  inventory_count: number
}

// ─── Image upload (server-side, bypasses storage RLS) ────────────────────────

export async function uploadProductImage(
  formData: FormData
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    await requireAdmin()
    const file = formData.get('file') as File | null
    if (!file || file.size === 0) return { success: false, error: 'Ingen fil valgt' }

    const supabase = createServiceClient()
    const ext  = file.name.split('.').pop()?.toLowerCase() ?? 'jpg'
    const path = `products/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

    const arrayBuffer = await file.arrayBuffer()
    const { error: uploadErr } = await supabase.storage
      .from('product-images')
      .upload(path, Buffer.from(arrayBuffer), { contentType: file.type, upsert: false })

    if (uploadErr) return { success: false, error: uploadErr.message }

    const { data } = supabase.storage.from('product-images').getPublicUrl(path)
    return { success: true, url: data.publicUrl }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}

export async function createProduct(
  input: ProductInput
): Promise<{ success: boolean; error?: string }> {
  try {
    await requireAdmin()
    const supabase = createServiceClient()

    const images = input.images.length > 0 ? input.images : (input.image_url ? [input.image_url] : [])
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: product, error } = await (supabase.from('products') as any)
      .insert({
        name:                  input.name,
        slug:                  input.slug,
        brand:                 input.brand || null,
        short_description:     input.short_description || null,
        short_description_en:  input.short_description_en || null,
        description:           input.description || null,
        description_en:        input.description_en || null,
        price_day:             input.price_day,
        price_week:            input.price_week,
        price_month:           input.price_month,
        deposit_amount:        input.deposit_amount,
        minimum_rental_days:   input.minimum_rental_days,
        published:             input.published,
        image_url:             images[0] || null,
        images,
        category_id:           input.category_id || null,
      })
      .select('id')
      .single()

    if (error || !product) return { success: false, error: error?.message ?? 'Kunne ikke opprette produkt' }

    await supabase.from('product_locations').insert({
      product_id:  product.id,
      location_id: input.location_id,
    })

    if (input.inventory_count > 0) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const items: any[] = Array.from({ length: input.inventory_count }, (_, i) => ({
        product_id:    product.id,
        location_id:   input.location_id,
        status:        'available',
        internal_name: `${input.name} #${i + 1}`,
        condition:     'good',
      }))
      await supabase.from('inventory_items').insert(items)
    }

    revalidatePath('/admin/products')
    revalidatePath('/admin/inventory')
    return { success: true }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}

export async function updateProduct(
  id: string,
  input: ProductInput          // location_id / inventory_count are accepted but ignored on update
): Promise<{ success: boolean; error?: string }> {
  try {
    await requireAdmin()
    const supabase = createServiceClient()

    const images = input.images.length > 0 ? input.images : (input.image_url ? [input.image_url] : [])
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase.from('products') as any)
      .update({
        name:                  input.name,
        slug:                  input.slug,
        brand:                 input.brand || null,
        short_description:     input.short_description || null,
        short_description_en:  input.short_description_en || null,
        description:           input.description || null,
        description_en:        input.description_en || null,
        price_day:             input.price_day,
        price_week:            input.price_week,
        price_month:           input.price_month,
        deposit_amount:        input.deposit_amount,
        minimum_rental_days:   input.minimum_rental_days,
        published:             input.published,
        image_url:             images[0] || null,
        images,
        category_id:           input.category_id || null,
      })
      .eq('id', id)

    if (error) return { success: false, error: error.message }

    revalidatePath('/admin/products')
    revalidatePath(`/admin/products/${id}/edit`)
    return { success: true }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}

// ─── Category actions ─────────────────────────────────────────────────────────

function toSlug(text: string) {
  return text
    .toLowerCase()
    .replace(/æ/g, 'ae').replace(/ø/g, 'o').replace(/å/g, 'a')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export async function createCategory(
  input: { name: string; slug?: string; description?: string }
): Promise<{ success: boolean; error?: string }> {
  try {
    await requireAdmin()
    const supabase = createServiceClient()
    const slug = input.slug?.trim() || toSlug(input.name)
    const { error } = await supabase.from('categories').insert({
      name:        input.name.trim(),
      slug,
      description: input.description?.trim() || null,
      active:      true,
    })
    if (error) return { success: false, error: error.message }
    revalidatePath('/admin/categories')
    return { success: true }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}

export async function updateCategory(
  id: string,
  input: { name: string; slug: string; description?: string; active: boolean }
): Promise<{ success: boolean; error?: string }> {
  try {
    await requireAdmin()
    const supabase = createServiceClient()
    const { error } = await supabase.from('categories').update({
      name:        input.name.trim(),
      slug:        input.slug.trim(),
      description: input.description?.trim() || null,
      active:      input.active,
    }).eq('id', id)
    if (error) return { success: false, error: error.message }
    revalidatePath('/admin/categories')
    return { success: true }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}

export async function deleteCategory(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    await requireAdmin()
    const supabase = createServiceClient()
    const { error } = await supabase.from('categories').delete().eq('id', id)
    if (error) return { success: false, error: error.message }
    revalidatePath('/admin/categories')
    return { success: true }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}

export async function deleteProduct(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    await requireAdmin()
    const supabase = createServiceClient()
    // Remove related records first
    await supabase.from('inventory_items').delete().eq('product_id', id)
    await supabase.from('product_locations').delete().eq('product_id', id)
    const { error } = await supabase.from('products').delete().eq('id', id)
    if (error) return { success: false, error: error.message }
    revalidatePath('/admin/products')
    return { success: true }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}

export async function toggleProductPublished(id: string, published: boolean) {
  await requireAdmin()
  const supabase = createServiceClient()
  await supabase.from('products').update({ published }).eq('id', id)
  revalidatePath('/admin/products')
}

// ─── Inventory actions ────────────────────────────────────────────────────────

export async function updateInventoryStatus(itemId: string, status: string) {
  await requireAdmin()
  const supabase = createServiceClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await supabase.from('inventory_items').update({ status: status as any }).eq('id', itemId)
  revalidatePath('/admin/inventory')
}

export async function addInventoryItem(
  productId: string,
  locationId: string,
  internalName: string
) {
  await requireAdmin()
  const supabase = createServiceClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await supabase.from('inventory_items').insert({
    product_id:    productId,
    location_id:   locationId,
    status:        'available' as any,
    internal_name: internalName,
    condition:     'good',
  })
  revalidatePath('/admin/inventory')
  revalidatePath('/admin/products')
}
