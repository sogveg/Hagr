import { Resend } from 'resend'
import type { ReactElement } from 'react'

let _resend: Resend | null = null

function getResend(): Resend | null {
  if (!process.env.RESEND_API_KEY) return null
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY)
  return _resend
}

export const FROM_ADDRESS  = 'TinyRent <noreply@tinyrent.no>'
export const ADMIN_EMAIL   = () =>
  (process.env.ADMIN_EMAILS ?? '').split(',')[0]?.trim() ?? 'hei@tinyrent.no'

export async function sendEmail({
  to,
  subject,
  react,
  replyTo,
}: {
  to:       string | string[]
  subject:  string
  react:    ReactElement
  replyTo?: string
}): Promise<{ success: boolean; error?: string }> {
  const resend = getResend()

  if (!resend) {
    console.log('[Email] Skipped — no RESEND_API_KEY', { to, subject })
    return { success: true }
  }

  const { error } = await resend.emails.send({
    from: FROM_ADDRESS,
    to,
    subject,
    react,
    ...(replyTo ? { reply_to: replyTo } : {}),
  })

  if (error) {
    console.error('[Email] Send failed:', error)
    return { success: false, error: error.message }
  }

  return { success: true }
}
