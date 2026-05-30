'use server'

import { revalidatePath } from 'next/cache'
import { createServiceClient } from '@/lib/supabase-server'

export async function subscribeNewsletter(
  email: string,
  name?: string
): Promise<{ success: boolean; error?: string; alreadySubscribed?: boolean }> {
  if (!email || !email.includes('@')) {
    return { success: false, error: 'Ugyldig e-postadresse' }
  }

  const supabase = createServiceClient()

  // Sjekk om allerede registrert
  const { data: existing } = await (supabase.from as any)('newsletter_subscribers')
    .select('id, active')
    .eq('email', email.toLowerCase().trim())
    .single()

  if (existing) {
    if (existing.active) return { success: true, alreadySubscribed: true }
    // Reaktiver
    await (supabase.from as any)('newsletter_subscribers')
      .update({ active: true, name: name || null })
      .eq('id', existing.id)
    return { success: true }
  }

  const { error } = await (supabase.from as any)('newsletter_subscribers').insert({
    email: email.toLowerCase().trim(),
    name:  name || null,
  })

  if (error) return { success: false, error: 'Kunne ikke registrere e-post. Prøv igjen.' }

  revalidatePath('/admin/abonnenter')
  return { success: true }
}

export async function unsubscribeNewsletter(id: string) {
  const supabase = createServiceClient()
  await (supabase.from as any)('newsletter_subscribers').update({ active: false }).eq('id', id)
  revalidatePath('/admin/abonnenter')
}
