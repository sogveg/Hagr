import { render } from '@react-email/components'
import { resend } from '@/lib/resend'
import { BookingConfirmedEmail } from './booking-confirmed'

const FROM = 'TinyRent <onboarding@resend.dev>'
const BASE_URL = process.env.NEXT_PUBLIC_URL ?? 'https://tinyrent-rouge.vercel.app'

export async function sendBookingConfirmed(params: {
  to: string
  customerName: string
  bookingId: string
  productName: string
  startDate: string
  endDate: string
  totalAmount: number
  depositAmount: number
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
    })
  )

  return resend.emails.send({
    from: FROM,
    to: params.to,
    subject: `Booking bekreftet — ${params.productName}`,
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
