import {
  Body, Container, Head, Heading, Hr, Html,
  Link, Preview, Section, Text, Row, Column,
} from '@react-email/components'

interface BookingReminderProps {
  customerName: string
  bookingId: string
  productName: string
  startDate: string
  bookingUrl: string
}

export function BookingReminderEmail({
  customerName,
  bookingId,
  productName,
  startDate,
  bookingUrl,
}: BookingReminderProps) {
  return (
    <Html lang="no">
      <Head />
      <Preview>Påminnelse: hent {productName} i morgen</Preview>
      <Body style={main}>
        <Container style={container}>

          <Section style={header}>
            <Heading style={logo}>TinyRent</Heading>
            <Text style={tagline}>Lei premium babyutstyr i Bergen</Text>
          </Section>

          <Section style={section}>
            <Heading as="h2" style={h2}>Husk: henting i morgen</Heading>
            <Text style={text}>Hei {customerName},</Text>
            <Text style={text}>
              Dette er en påminnelse om at din leieperiode starter i morgen, {startDate}.
              Vi gleder oss til å se deg!
            </Text>
          </Section>

          <Hr style={hr} />

          <Section style={section}>
            <Heading as="h3" style={h3}>Din booking</Heading>
            <Row style={detailRow}>
              <Column style={detailLabel}>Produkt</Column>
              <Column style={detailValue}>{productName}</Column>
            </Row>
            <Row style={detailRow}>
              <Column style={detailLabel}>Hentedato</Column>
              <Column style={detailValue}>{startDate}</Column>
            </Row>
            <Row style={detailRow}>
              <Column style={detailLabel}>Booking-ID</Column>
              <Column style={detailValue}>#{bookingId.slice(0, 8).toUpperCase()}</Column>
            </Row>
          </Section>

          <Hr style={hr} />

          <Section style={section}>
            <Text style={infoBox}>
              Vi tar kontakt for å avtale detaljer. Har du spørsmål? Svar på denne e-posten
              eller kontakt oss på hei@tinyrent.no
            </Text>
          </Section>

          <Section style={{ ...section, textAlign: 'center' as const }}>
            <Link href={bookingUrl} style={button}>Se booking på Min side</Link>
          </Section>

          <Hr style={hr} />

          <Section style={footer}>
            <Text style={footerText}>Booking-ID: {bookingId}</Text>
            <Text style={footerText}>
              Spørsmål? Kontakt oss på{' '}
              <Link href="mailto:hei@tinyrent.no" style={link}>hei@tinyrent.no</Link>
            </Text>
            <Text style={footerText}>TinyRent · Bergen, Norge</Text>
          </Section>

        </Container>
      </Body>
    </Html>
  )
}

const main       = { backgroundColor: '#F8F7F4', fontFamily: "'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif" }
const container  = { margin: '0 auto', padding: '0 0 48px', maxWidth: '600px' }
const header     = { backgroundColor: '#2B2B2B', padding: '32px 40px', borderRadius: '16px 16px 0 0', textAlign: 'center' as const }
const logo       = { color: '#F8F7F4', fontSize: '28px', fontWeight: '700', margin: '0', letterSpacing: '-0.5px' }
const tagline    = { color: '#A8BFA3', fontSize: '14px', margin: '4px 0 0' }
const section    = { padding: '24px 40px', backgroundColor: '#ffffff' }
const h2         = { color: '#2B2B2B', fontSize: '22px', fontWeight: '700', margin: '0 0 16px' }
const h3         = { color: '#2B2B2B', fontSize: '16px', fontWeight: '600', margin: '0 0 12px' }
const text       = { color: '#2B2B2B', fontSize: '15px', lineHeight: '1.6', margin: '0 0 12px' }
const detailRow  = { marginBottom: '8px' }
const detailLabel = { color: '#6B7280', fontSize: '14px', width: '40%' }
const detailValue = { color: '#2B2B2B', fontSize: '14px' }
const infoBox    = { backgroundColor: '#EAE4DA', borderRadius: '10px', padding: '14px 18px', color: '#2B2B2B', fontSize: '14px', lineHeight: '1.5', margin: '0' }
const button     = { backgroundColor: '#8FA68B', borderRadius: '999px', color: '#ffffff', display: 'inline-block', fontSize: '15px', fontWeight: '600', padding: '14px 32px', textDecoration: 'none' }
const hr         = { borderColor: '#E5E7EB', margin: '0' }
const footer     = { padding: '24px 40px', backgroundColor: '#F8F7F4', borderRadius: '0 0 16px 16px' }
const footerText = { color: '#9CA3AF', fontSize: '12px', lineHeight: '1.5', margin: '0 0 4px' }
const link       = { color: '#8FA68B' }
