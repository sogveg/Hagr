'use server'

import { createServiceClient, createClient } from '@/lib/supabase-server'
import { sendReviewRequest } from '@/lib/emails/send'
import { revalidatePath } from 'next/cache'

export async function sendReviewRequestAction(
  bookingId: string,
): Promise<{ success: boolean; error?: string }> {
  const authClient = await createClient()
  const { data: { user } } = await authClient.auth.getUser()
  if (!user) return { success: false, error: 'Ikke innlogget' }

  const supabase = createServiceClient()

  const { data: booking } = await supabase
    .from('bookings')
    .select('id, customers(first_name, last_name, email)')
    .eq('id', bookingId)
    .single()

  if (!booking) return { success: false, error: 'Booking ikke funnet' }

  const customer = (booking as any).customers as {
    first_name?: string; last_name?: string; email: string
  } | null

  if (!customer?.email) return { success: false, error: 'Ingen e-post på kunden' }

  const customerName =
    `${customer.first_name ?? ''} ${customer.last_name ?? ''}`.trim() || customer.email

  await sendReviewRequest({ to: customer.email, customerName, bookingId })

  revalidatePath(`/admin/bookings/${bookingId}`)
  return { success: true }
}
