'use server'

import { revalidatePath } from 'next/cache'
import { createServiceClient, createClient } from '@/lib/supabase-server'

export type DamageInput = {
  description:    string
  severity:       'minor' | 'moderate' | 'severe'
  amount_charged?: number | null
  photo_url?:     string | null
  product_id?:    string | null
}

// Admin: kan sette beløp, bruker service-klient
export async function addAdminDamageReport(
  bookingId: string,
  input: DamageInput
): Promise<{ success: boolean; error?: string }> {
  try {
    const authClient = await createClient()
    const { data: { user } } = await authClient.auth.getUser()
    if (!user) return { success: false, error: 'Ikke innlogget' }

    const adminEmails = (process.env.ADMIN_EMAILS ?? '').split(',').map(e => e.trim().toLowerCase()).filter(Boolean)
    if (adminEmails.length > 0 && !adminEmails.includes((user.email ?? '').toLowerCase())) {
      return { success: false, error: 'Ikke tilgang' }
    }

    const supabase = createServiceClient()
    const { error } = await (supabase.from as any)('damage_reports').insert({
      booking_id:     bookingId,
      reported_by:    'admin',
      description:    input.description,
      severity:       input.severity,
      amount_charged: input.amount_charged ?? null,
      photo_url:      input.photo_url ?? null,
      product_id:     input.product_id ?? null,
    })

    if (error) return { success: false, error: error.message }

    revalidatePath(`/admin/bookings/${bookingId}`)
    return { success: true }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}

// Kunde: kan ikke sette beløp, bruker user-klient (RLS)
export async function addCustomerDamageReport(
  bookingId: string,
  input: Omit<DamageInput, 'amount_charged'>
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, error: 'Ikke innlogget' }

    const { error } = await (supabase.from as any)('damage_reports').insert({
      booking_id:  bookingId,
      reported_by: 'customer',
      description: input.description,
      severity:    input.severity,
      photo_url:   input.photo_url ?? null,
      product_id:  input.product_id ?? null,
    })

    if (error) return { success: false, error: error.message }

    revalidatePath(`/account/bookings/${bookingId}`)
    return { success: true }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}

// Hent skaderapporter for en booking (service-klient)
export async function getDamageReports(bookingId: string) {
  const supabase = createServiceClient()
  const { data } = await (supabase.from as any)('damage_reports')
    .select('*')
    .eq('booking_id', bookingId)
    .order('created_at', { ascending: false })
  return data ?? []
}
