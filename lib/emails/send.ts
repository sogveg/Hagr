import { render } from '@react-email/components'
import { getResend } from '@/lib/resend'
import { BookingConfirmedEmail } from './booking-confirmed'
import { ReviewRequestEmail } from './review-request'
import { BookingReminderEmail } from './booking-reminder'

const FROM = 'TinyRent <hei@tinyrent.no>'
const BASE_URL = process.env.NEXT_PUBLIC_URL ?? 'https://www.tinyrent.no'

export async function sendBookingConfirmed(params: {
  to: string
  customerName: string
  bookingId: string
  productName: string
  startDate: string
  endDate: string
  totalAmount: number
  depositAmount: number
  agreementAcceptedAt?: string
}) {
  const html = await render(
    BookingConfirmedEmail({
      customerName: params.customerName,
      bookingId: params.bookingId,
      productName: params.productName,
      startDate: formatDate(params.startDate),
      endDate: formatDate(params.endDate),
      totalAmount: params.totalAmount,
      depositAmount: params.depositAmount,
      bookingUrl: `${BASE_URL}/account/bookings/${params.bookingId}`,
      agreementAcceptedAt: params.agreementAcceptedAt,
    })
  )

  return getResend().emails.send({
    from: FROM,
    to: params.to,
    subject: `Booking bekreftet: ${params.productName}`,
    html,
  })
}

export async function sendReviewRequest(params: {
  to: string
  customerName: string
  bookingId: string
}) {
  const bookingUrl = `${BASE_URL}/account/bookings/${params.bookingId}`
  const html = await render(
    ReviewRequestEmail({ customerName: params.customerName, bookingId: params.bookingId, bookingUrl })
  )
  return getResend().emails.send({
    from: FROM,
    to: params.to,
    subject: 'Takk for at du leide hos TinyRent! Del gjerne din opplevelse',
    html,
  })
}

export async function sendBookingReminder(params: {
  to: string
  customerName: string
  bookingId: string
  productName: string
  startDate: string
}) {
  const bookingUrl = `${BASE_URL}/account/bookings/${params.bookingId}`
  const html = await render(
    BookingReminderEmail({
      customerName: params.customerName,
      bookingId: params.bookingId,
      productName: params.productName,
      startDate: formatDate(params.startDate),
      bookingUrl,
    })
  )
  return getResend().emails.send({
    from: FROM,
    to: params.to,
    subject: `Påminnelse: hent ${params.productName} i morgen`,
    html,
  })
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('nb-NO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}
