import {
  Body, Container, Head, Heading, Hr, Html,
  Link, Preview, Section, Text,
} from '@react-email/components'

interface ReviewRequestProps {
  customerName: string
  bookingId: string
  bookingUrl: string
}

export function ReviewRequestEmail({ customerName, bookingId, bookingUrl }: ReviewRequestProps) {
  return (
    <Html lang="no">
      <Head />
      <Preview>Takk for at du leide hos TinyRent! Del gjerne din opplevelse</Preview>
      <Body style={main}>
        <Container style={container}>

          <Section style={header}>
            <Heading style={logo}>TinyRent</Heading>
            <Text style={tagline}>Lei premium babyutstyr i Bergen</Text>
          </Section>

          <Section style={section}>
            <Heading as="h2" style={h2}>Takk for at du leide hos oss!</Heading>
            <Text style={text}>Hei {customerName},</Text>
            <Text style={text}>
              Vi håper du og babyen hadde en fin tid i Bergen og at utstyret fungerte godt.
              Din tilbakemelding betyr mye for oss og hjelper andre familier å velge TinyRent.
            </Text>
          </Section>

          <Hr style={hr} />

          <Section style={{ ...section, textAlign: 'center' as const }}>
            <Text style={{ ...text, marginBottom: '24px' }}>
              Har du 2 minutter? En Google-anmeldelse hjelper oss enormt.
            </Text>
            <Link
              href="https://g.page/r/tinyrent/review"
              style={button}
            >
              Skriv en Google-anmeldelse
            </Link>
            <Text style={smallText}>
              Det tar under 2 minutter og betyr veldig mye for en liten bedrift som oss.
            </Text>
          </Section>

          <Hr style={hr} />

          <Section style={section}>
            <Text style={text}>
              Hadde du spørsmål eller noe som ikke fungerte som forventet? Svar på denne
              e-posten eller kontakt oss på{' '}
              <Link href="mailto:hei@tinyrent.no" style={link}>hei@tinyrent.no</Link>{' '}
              — vi svarer alltid.
            </Text>
          </Section>

          <Hr style={hr} />

          <Section style={footer}>
            <Text style={footerText}>Booking-ID: {bookingId}</Text>
            <Text style={footerText}>
              <Link href={bookingUrl} style={link}>Se din booking</Link>
              {' · '}
              <Link href="mailto:hei@tinyrent.no" style={link}>hei@tinyrent.no</Link>
            </Text>
            <Text style={footerText}>TinyRent · Bergen, Norge</Text>
          </Section>

        </Container>
      </Body>
    </Html>
  )
}

const main = {
  backgroundColor: '#F8F7F4',
  fontFamily: "'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif",
}
const container = { margin: '0 auto', padding: '0 0 48px', maxWidth: '600px' }
const header    = { backgroundColor: '#2B2B2B', padding: '32px 40px', borderRadius: '16px 16px 0 0', textAlign: 'center' as const }
const logo      = { color: '#F8F7F4', fontSize: '28px', fontWeight: '700', margin: '0', letterSpacing: '-0.5px' }
const tagline   = { color: '#A8BFA3', fontSize: '14px', margin: '4px 0 0' }
const section   = { padding: '24px 40px', backgroundColor: '#ffffff' }
const h2        = { color: '#2B2B2B', fontSize: '22px', fontWeight: '700', margin: '0 0 16px' }
const text      = { color: '#2B2B2B', fontSize: '15px', lineHeight: '1.6', margin: '0 0 12px' }
const smallText = { color: '#9CA3AF', fontSize: '13px', lineHeight: '1.5', margin: '16px 0 0' }
const button    = {
  backgroundColor: '#4A6741',
  borderRadius: '999px',
  color: '#ffffff',
  display: 'inline-block',
  fontSize: '15px',
  fontWeight: '600',
  padding: '14px 32px',
  textDecoration: 'none',
}
const hr         = { borderColor: '#E5E7EB', margin: '0' }
const footer     = { padding: '24px 40px', backgroundColor: '#F8F7F4', borderRadius: '0 0 16px 16px' }
const footerText = { color: '#9CA3AF', fontSize: '12px', lineHeight: '1.5', margin: '0 0 4px' }
const link       = { color: '#8FA68B' }
