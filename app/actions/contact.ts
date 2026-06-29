'use server'

import { sendEmail, ADMIN_EMAIL } from '@/lib/email'
import { createServiceClient } from '@/lib/supabase-server'
import React from 'react'
import { ContactEmail } from '@/lib/emails/contact-email'

export async function sendContactMessage(input: {
  name:      string
  email:     string
  subject:   string
  message:   string
  bookingId?: string
}): Promise<{ success: boolean; error?: string }> {
  if (!input.name || !input.email || !input.message) {
    return { success: false, error: 'Fyll ut alle påkrevde felt' }
  }
  if (!input.email.includes('@')) {
    return { success: false, error: 'Ugyldig e-postadresse' }
  }

  try {
    await sendEmail({
      to:      ADMIN_EMAIL(),
      replyTo: input.email,
      subject: input.bookingId
        ? `Kontakt, booking #${input.bookingId.slice(0, 8).toUpperCase()}: ${input.subject}`
        : `Kontakt: ${input.subject}`,
      react: React.createElement(ContactEmail, {
        name:      input.name,
        email:     input.email,
        subject:   input.subject,
        message:   input.message,
        bookingId: input.bookingId,
      }),
    })

    const supabase = createServiceClient()
    if (input.bookingId) {
      // Lagre i booking-tråden
      await (supabase as any)
        .from('booking_messages')
        .insert({
          booking_id: input.bookingId,
          sender:     'customer',
          body:       `Emne: ${input.subject}\n\n${input.message}`,
        })
    } else {
      // Lagre som generell kontakthenvendelse
      await (supabase as any)
        .from('contact_messages')
        .insert({
          name:    input.name,
          email:   input.email,
          subject: input.subject || null,
          body:    input.message,
        })
    }

    return { success: true }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}
