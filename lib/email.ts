import { Resend } from 'resend'
import type { ReactElement } from 'react'

let _resend: Resend | null = null

// Char codes of invisible characters that cause ByteString errors in HTTP headers:
//   65279 = U+FEFF  BOM / Zero-Width No-Break Space
//    8203 = U+200B  Zero-Width Space
//    8204 = U+200C  Zero-Width Non-Joiner
//    8205 = U+200D  Zero-Width Joiner
//     173 = U+00AD  Soft Hyphen
const INVISIBLE_CODES = new Set([65279, 8203, 8204, 8205, 173])

function stripInvisible(s: string): string {
  return Array.from(s)
    .filter(ch => !INVISIBLE_CODES.has(ch.charCodeAt(0)))
    .join('')
    .trim()
}

function getResend(): Resend | null {
  const raw = process.env.RESEND_API_KEY ?? ''
  const key = stripInvisible(raw)
  if (!key) return null
  if (!_resend) _resend = new Resend(key)
  return _resend
}

export const FROM_ADDRESS  = 'TinyRent <hei@tinyrent.no>'
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
    from:     FROM_ADDRESS,
    to,
    subject:  stripInvisible(subject),
    react,
    replyTo:  replyTo ?? 'hei@tinyrent.no',
  })

  if (error) {
    console.error('[Email] Send failed:', error)
    return { success: false, error: error.message }
  }

  return { success: true }
}
