import {
  Body, Container, Head, Heading, Hr, Html,
  Link, Preview, Section, Text, Row, Column,
} from '@react-email/components'

interface BookingConfirmedProps {
  customerName: string
  bookingId: string
  productName: string
  startDate: string
  endDate: string
  totalAmount: number
  depositAmount: number
  bookingUrl: string
}

export function BookingConfirmedEmail({
  customerName,
  bookingId,
  productName,
  startDate,
  endDate,
  totalAmount,
  depositAmount,
  bookingUrl,
}: BookingConfirmedProps) {
  const rentalAmount = totalAmount - depositAmount

  return (
    <Html lang="no">
      <Head />
      <Preview>Bookingen din er bekreftet: {productName}</Preview>
      <Body style={main}>
        <Container style={container}>

          {/* Header */}
          <Section style={header}>
            <Heading style={logo}>TinyRent</Heading>
            <Text style={tagline}>Lei premium babyutstyr i Bergen</Text>
          </Section>

          {/* Intro */}
          <Section style={section}>
            <Heading as="h2" style={h2}>Booking bekreftet</Heading>
            <Text style={text}>Hei {customerName},</Text>
            <Text style={text}>
              Vi har mottatt betalingen din og bookingen er bekreftet.
              Vi tar kontakt for å avtale levering.
            </Text>
          </Section>

          <Hr style={hr} />

          {/* Booking detaljer */}
          <Section style={section}>
            <Heading as="h3" style={h3}>Bookingdetaljer</Heading>
            <Row style={detailRow}>
              <Column style={detailLabel}>Produkt</Column>
              <Column style={detailValue}>{productName}</Column>
            </Row>
            <Row style={detailRow}>
              <Column style={detailLabel}>Leieperiode</Column>
              <Column style={detailValue}>{startDate} – {endDate}</Column>
            </Row>
            <Row style={detailRow}>
              <Column style={detailLabel}>Leiebeløp</Column>
              <Column style={detailValue}>{formatNOK(rentalAmount)}</Column>
            </Row>
            <Row style={detailRow}>
              <Column style={detailLabel}>Depositum</Column>
              <Column style={detailValue}>{formatNOK(depositAmount)}</Column>
            </Row>
            <Row style={{ ...detailRow, borderTop: '2px solid #2B2B2B', marginTop: '8px', paddingTop: '8px' }}>
              <Column style={{ ...detailLabel, fontWeight: '700' }}>Totalt betalt</Column>
              <Column style={{ ...detailValue, fontWeight: '700' }}>{formatNOK(totalAmount)}</Column>
            </Row>
          </Section>

          <Hr style={hr} />

          {/* Depositum info */}
          <Section style={section}>
            <Text style={infoBox}>
              Depositumet på {formatNOK(depositAmount)} refunderes etter at produktet er returnert i samme stand.
            </Text>
          </Section>

          {/* CTA */}
          <Section style={{ ...section, textAlign: 'center' as const }}>
            <Link href={bookingUrl} style={button}>
              Se booking på Min side
            </Link>
          </Section>

          <Hr style={hr} />

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              Booking-ID: {bookingId}
            </Text>
            <Text style={footerText}>
              Spørsmål? Svar på denne e-posten eller kontakt oss på{' '}
              <Link href="mailto:hei@tinyrent.no" style={link}>hei@tinyrent.no</Link>
            </Text>
            <Text style={footerText}>TinyRent · Bergen, Norge</Text>
          </Section>

        </Container>
      </Body>
    </Html>
  )
}

function formatNOK(amount: number): string {
  return new Intl.NumberFormat('nb-NO', { style: 'currency', currency: 'NOK', maximumFractionDigits: 0 }).format(amount)
}

const main = {
  backgroundColor: '#F8F7F4',
  fontFamily: "'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif",
}

const container = {
  margin: '0 auto',
  padding: '0 0 48px',
  maxWidth: '600px',
}

const header = {
  backgroundColor: '#2B2B2B',
  padding: '32px 40px',
  borderRadius: '16px 16px 0 0',
  textAlign: 'center' as const,
}

const logo = {
  color: '#F8F7F4',
  fontSize: '28px',
  fontWeight: '700',
  margin: '0',
  letterSpacing: '-0.5px',
}

const tagline = {
  color: '#A8BFA3',
  fontSize: '14px',
  margin: '4px 0 0',
}

const section = {
  padding: '24px 40px',
  backgroundColor: '#ffffff',
}

const h2 = {
  color: '#2B2B2B',
  fontSize: '22px',
  fontWeight: '700',
  margin: '0 0 16px',
}

const h3 = {
  color: '#2B2B2B',
  fontSize: '16px',
  fontWeight: '600',
  margin: '0 0 12px',
}

const text = {
  color: '#2B2B2B',
  fontSize: '15px',
  lineHeight: '1.6',
  margin: '0 0 12px',
}

const detailRow = {
  marginBottom: '8px',
}

const detailLabel = {
  color: '#6B7280',
  fontSize: '14px',
  width: '40%',
}

const detailValue = {
  color: '#2B2B2B',
  fontSize: '14px',
}

const infoBox = {
  backgroundColor: '#EAE4DA',
  borderRadius: '10px',
  padding: '14px 18px',
  color: '#2B2B2B',
  fontSize: '14px',
  lineHeight: '1.5',
  margin: '0',
}

const button = {
  backgroundColor: '#8FA68B',
  borderRadius: '999px',
  color: '#ffffff',
  display: 'inline-block',
  fontSize: '15px',
  fontWeight: '600',
  padding: '14px 32px',
  textDecoration: 'none',
}

const hr = {
  borderColor: '#E5E7EB',
  margin: '0',
}

const footer = {
  padding: '24px 40px',
  backgroundColor: '#F8F7F4',
  borderRadius: '0 0 16px 16px',
}

const footerText = {
  color: '#9CA3AF',
  fontSize: '12px',
  lineHeight: '1.5',
  margin: '0 0 4px',
}

const link = {
  color: '#8FA68B',
}
