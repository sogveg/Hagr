'use server'

import { sendEmail, ADMIN_EMAIL } from '@/lib/email'
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
        ? `Kontakt — Booking #${input.bookingId.slice(0, 8).toUpperCase()}: ${input.subject}`
        : `Kontakt — ${input.subject}`,
      react: React.createElement(ContactEmail, {
        name:      input.name,
        email:     input.email,
        subject:   input.subject,
        message:   input.message,
        bookingId: input.bookingId,
      }),
    })
    return { success: true }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}
