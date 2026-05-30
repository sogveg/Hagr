import {
  Html, Head, Body, Container, Section, Text, Hr, Link, Preview
} from '@react-email/components'

interface ContactEmailProps {
  name:      string
  email:     string
  subject:   string
  message:   string
  bookingId?: string
}

export function ContactEmail({ name, email, subject, message, bookingId }: ContactEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>{`Ny henvendelse fra ${name}: ${subject}`}</Preview>
      <Body style={{ backgroundColor: '#F0EAE0', fontFamily: 'Inter, system-ui, sans-serif', margin: 0, padding: '32px 0' }}>
        <Container style={{ maxWidth: '560px', margin: '0 auto', backgroundColor: '#ffffff', borderRadius: '16px', overflow: 'hidden' }}>

          {/* Header */}
          <Section style={{ backgroundColor: '#2B2B2B', padding: '24px 32px' }}>
            <Text style={{ color: '#ffffff', fontSize: '18px', fontWeight: 700, margin: 0 }}>
              Ny henvendelse via kontaktskjemaet
            </Text>
            {bookingId && (
              <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', margin: '4px 0 0' }}>
                Gjelder booking #{bookingId.slice(0, 8).toUpperCase()}
              </Text>
            )}
          </Section>

          {/* Body */}
          <Section style={{ padding: '32px' }}>
            <Text style={{ fontSize: '13px', color: '#7A6E62', margin: '0 0 4px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Fra</Text>
            <Text style={{ fontSize: '15px', color: '#2B2B2B', fontWeight: 600, margin: '0 0 4px' }}>{name}</Text>
            <Link href={`mailto:${email}`} style={{ fontSize: '14px', color: '#4A6741' }}>{email}</Link>

            <Hr style={{ borderColor: 'rgba(0,0,0,0.06)', margin: '24px 0' }} />

            <Text style={{ fontSize: '13px', color: '#7A6E62', margin: '0 0 4px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Emne</Text>
            <Text style={{ fontSize: '15px', color: '#2B2B2B', fontWeight: 600, margin: '0 0 0' }}>{subject}</Text>

            <Hr style={{ borderColor: 'rgba(0,0,0,0.06)', margin: '24px 0' }} />

            <Text style={{ fontSize: '13px', color: '#7A6E62', margin: '0 0 8px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Melding</Text>
            <Text style={{ fontSize: '14px', color: '#2B2B2B', lineHeight: '1.7', backgroundColor: '#F0EAE0', padding: '16px', borderRadius: '8px', whiteSpace: 'pre-wrap', margin: 0 }}>
              {message}
            </Text>

            {bookingId && (
              <>
                <Hr style={{ borderColor: 'rgba(0,0,0,0.06)', margin: '24px 0' }} />
                <Link
                  href={`https://www.tinyrent.no/admin/bookings/${bookingId}`}
                  style={{ display: 'inline-block', backgroundColor: '#4A6741', color: '#ffffff', fontSize: '13px', fontWeight: 700, padding: '10px 20px', borderRadius: '10px', textDecoration: 'none' }}
                >
                  Åpne booking i admin →
                </Link>
              </>
            )}
          </Section>

          {/* Footer */}
          <Section style={{ backgroundColor: '#F8F7F4', padding: '16px 32px' }}>
            <Text style={{ color: '#A89F93', fontSize: '11px', margin: 0 }}>
              Svar direkte på denne e-posten for å nå {name}
            </Text>
          </Section>

        </Container>
      </Body>
    </Html>
  )
}
