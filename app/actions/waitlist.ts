'use server'

import { createServiceClient } from '@/lib/supabase-server'

export async function addToWaitlist(
  productId: string,
  locationId: string,
  email: string,
  name?: string,
  message?: string
): Promise<{ success: boolean; error?: string }> {
  if (!email || !email.includes('@')) {
    return { success: false, error: 'Ugyldig e-postadresse' }
  }

  const supabase = createServiceClient()

  // Sjekk om allerede på venteliste for dette produktet
  const { data: existing } = await (supabase.from as any)('waitlist')
    .select('id')
    .eq('product_id', productId)
    .eq('email', email.toLowerCase().trim())
    .single()

  if (existing) {
    return { success: true } // Allerede på listen — still en suksess for brukeren
  }

  const { error } = await (supabase.from as any)('waitlist').insert({
    product_id:  productId,
    location_id: locationId,
    email:       email.toLowerCase().trim(),
    name:        name || null,
    message:     message || null,
  })

  if (error) return { success: false, error: 'Kunne ikke legge deg på ventelisten. Prøv igjen.' }
  return { success: true }
}

export async function markWaitlistNotified(id: string) {
  const supabase = createServiceClient()
  await (supabase.from as any)('waitlist').update({ notified: true }).eq('id', id)
}
