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

export async function updateBookingStatus(bookingId: string, status: string) {
  await requireAdmin()
  const supabase = createServiceClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await supabase.from('bookings').update({ status: status as any }).eq('id', bookingId)
  revalidatePath('/admin/bookings')
  revalidatePath(`/admin/bookings/${bookingId}`)
}

// ─── Product actions ──────────────────────────────────────────────────────────

export type ProductInput = {
  name: string
  slug: string
  brand: string
  short_description: string
  description: string
  price_day: number | null
  price_week: number | null
  price_month: number | null
  deposit_amount: number
  minimum_rental_days: number
  published: boolean
  image_url: string
  // Only used on create:
  category_id: string
  location_id: string
  inventory_count: number
}

export async function createProduct(
  input: ProductInput
): Promise<{ success: boolean; error?: string }> {
  try {
    await requireAdmin()
    const supabase = createServiceClient()

    const { data: product, error } = await supabase
      .from('products')
      .insert({
        name:                input.name,
        slug:                input.slug,
        brand:               input.brand || null,
        short_description:   input.short_description || null,
        description:         input.description || null,
        price_day:           input.price_day,
        price_week:          input.price_week,
        price_month:         input.price_month,
        deposit_amount:      input.deposit_amount,
        minimum_rental_days: input.minimum_rental_days,
        published:           input.published,
        image_url:           input.image_url || null,
      })
      .select('id')
      .single()

    if (error || !product) return { success: false, error: error?.message ?? 'Kunne ikke opprette produkt' }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await supabase.from('product_locations').insert({
      product_id:  product.id,
      location_id: input.location_id,
      category_id: input.category_id,
    } as any)

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
  input: ProductInput          // category_id / location_id / inventory_count are accepted but ignored
): Promise<{ success: boolean; error?: string }> {
  try {
    await requireAdmin()
    const supabase = createServiceClient()

    const { error } = await supabase
      .from('products')
      .update({
        name:                input.name,
        slug:                input.slug,
        brand:               input.brand || null,
        short_description:   input.short_description || null,
        description:         input.description || null,
        price_day:           input.price_day,
        price_week:          input.price_week,
        price_month:         input.price_month,
        deposit_amount:      input.deposit_amount,
        minimum_rental_days: input.minimum_rental_days,
        published:           input.published,
        image_url:           input.image_url || null,
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
