'use server'

import { revalidatePath } from 'next/cache'
import { createClient, createServiceClient } from '@/lib/supabase-server'
import { sendEmail, ADMIN_EMAIL } from '@/lib/email'
import { CustomerMessageEmail } from '@/lib/emails/customer-message'
import React from 'react'

export type ProfileInput = {
  first_name:    string
  last_name:     string
  phone:         string
  address_line1: string
  postal_code:   string
  city:          string
}

export async function updateProfile(
  input: ProfileInput
): Promise<{ success: boolean; error?: string }> {
  try {
    const authClient = await createClient()
    const { data: { user } } = await authClient.auth.getUser()
    if (!user) return { success: false, error: 'Ikke innlogget' }

    // Use service client to bypass RLS — upsert creates the row if it doesn't exist yet
    const supabase = createServiceClient()
    const { error } = await supabase
      .from('customers')
      .upsert({
        user_id:       user.id,
        email:         user.email!,
        first_name:    input.first_name    || null,
        last_name:     input.last_name     || null,
        phone:         input.phone         || null,
        address_line1: input.address_line1 || null,
        postal_code:   input.postal_code   || null,
        city:          input.city          || null,
      }, { onConflict: 'user_id' })

    if (error) return { success: false, error: error.message }
    revalidatePath('/account')
    revalidatePath('/account/profil')
    return { success: true }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}

export async function sendMessageToCustomer(
  bookingId: string,
  message: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Verify admin
    const authClient = await createClient()
    const { data: { user } } = await authClient.auth.getUser()
    if (!user) return { success: false, error: 'Ikke innlogget' }
    const adminEmails = (process.env.ADMIN_EMAILS ?? '').split(',').map(e => e.trim().toLowerCase()).filter(Boolean)
    if (adminEmails.length > 0 && !adminEmails.includes((user.email ?? '').toLowerCase())) {
      return { success: false, error: 'Ikke tilgang' }
    }

    const supabase = createServiceClient()
    const { data: booking } = await supabase
      .from('bookings')
      .select('id, customer_id')
      .eq('id', bookingId)
      .single()

    if (!booking?.customer_id) return { success: false, error: 'Booking ikke funnet' }

    const { data: customer } = await supabase
      .from('customers')
      .select('first_name, last_name, email')
      .eq('id', booking.customer_id)
      .single()

    if (!customer?.email) return { success: false, error: 'Kunde mangler e-post' }

    await sendEmail({
      to:      customer.email,
      subject: `Melding fra TinyRent — booking #${bookingId.slice(0, 8).toUpperCase()}`,
      react:   React.createElement(CustomerMessageEmail, {
        customerName: `${customer.first_name ?? ''} ${customer.last_name ?? ''}`.trim() || customer.email,
        message,
        bookingId,
        bookingUrl: `https://www.tinyrent.no/account/bookings/${bookingId}`,
      }),
    })

    return { success: true }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}
