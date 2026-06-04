import {
  Body, Container, Head, Heading, Html,
  Link, Preview, Section, Text, Hr,
} from '@react-email/components'

interface CustomerMessageProps {
  customerName: string
  message: string
  bookingId: string
  bookingUrl: string
}

export function CustomerMessageEmail({
  customerName, message, bookingId, bookingUrl,
}: CustomerMessageProps) {
  return (
    <Html lang="no">
      <Head />
      <Preview>Melding fra TinyRent, booking #{bookingId.slice(0, 8).toUpperCase()}</Preview>
      <Body style={{ backgroundColor: '#F8F7F4', fontFamily: 'Arial, sans-serif' }}>
        <Container style={{ maxWidth: '560px', margin: '0 auto', padding: '0 0 40px' }}>

          <Section style={{ backgroundColor: '#2B2B2B', padding: '28px 36px', borderRadius: '16px 16px 0 0' }}>
            <Heading style={{ color: '#F8F7F4', fontSize: '22px', fontWeight: '700', margin: 0 }}>
              TinyRent
            </Heading>
            <Text style={{ color: '#A8BFA3', fontSize: '13px', margin: '4px 0 0' }}>
              Lei premium babyutstyr i Bergen
            </Text>
          </Section>

          <Section style={{ backgroundColor: '#fff', padding: '28px 36px' }}>
            <Text style={{ color: '#2B2B2B', fontSize: '15px', margin: '0 0 12px' }}>
              Hei {customerName},
            </Text>
            <Text style={{ color: '#2B2B2B', fontSize: '15px', margin: '0 0 20px' }}>
              Du har mottatt en melding fra TinyRent angående booking{' '}
              <strong>#{bookingId.slice(0, 8).toUpperCase()}</strong>:
            </Text>

            <Section style={{
              backgroundColor: '#F0EAE0', borderRadius: '12px',
              padding: '16px 20px', margin: '0 0 20px',
            }}>
              <Text style={{ color: '#2B2B2B', fontSize: '15px', lineHeight: '1.6', margin: 0, whiteSpace: 'pre-wrap' }}>
                {message}
              </Text>
            </Section>

            <Text style={{ color: '#6B7280', fontSize: '13px', margin: '0 0 20px' }}>
              Har du spørsmål? Svar på denne e-posten eller kontakt oss på{' '}
              <Link href="mailto:hei@tinyrent.no" style={{ color: '#8FA68B' }}>hei@tinyrent.no</Link>
            </Text>
          </Section>

          <Section style={{ backgroundColor: '#fff', padding: '0 36px 28px', textAlign: 'center' as const }}>
            <Link
              href={bookingUrl}
              style={{
                backgroundColor: '#8FA68B', color: '#fff', borderRadius: '999px',
                padding: '12px 28px', fontSize: '14px', fontWeight: '600',
                textDecoration: 'none', display: 'inline-block',
              }}
            >
              Se booking på Min side
            </Link>
          </Section>

          <Section style={{ backgroundColor: '#F8F7F4', padding: '20px 36px', borderRadius: '0 0 16px 16px' }}>
            <Text style={{ color: '#9CA3AF', fontSize: '12px', margin: 0 }}>
              TinyRent · Bergen, Norge
            </Text>
          </Section>

        </Container>
      </Body>
    </Html>
  )
}
