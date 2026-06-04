import {
  Body, Container, Head, Heading, Html,
  Link, Preview, Section, Text, Row, Column, Hr,
} from '@react-email/components'

interface AdminNewBookingProps {
  bookingId:      string
  customerName:   string
  customerEmail:  string
  customerPhone?: string | null
  productNames:   string[]
  startDate:      string
  endDate:        string
  totalAmount:    number
  depositAmount:  number
  adminUrl:       string
}

export function AdminNewBookingEmail({
  bookingId, customerName, customerEmail, customerPhone,
  productNames, startDate, endDate, totalAmount, depositAmount, adminUrl,
}: AdminNewBookingProps) {
  const rentalAmount = totalAmount - depositAmount

  return (
    <Html lang="no">
      <Head />
      <Preview>Ny booking fra {customerName}: {productNames.join(', ')}</Preview>
      <Body style={{ backgroundColor: '#F8F7F4', fontFamily: 'Arial, sans-serif' }}>
        <Container style={{ maxWidth: '560px', margin: '0 auto', padding: '0 0 40px' }}>

          <Section style={{ backgroundColor: '#2B2B2B', padding: '28px 36px', borderRadius: '16px 16px 0 0' }}>
            <Heading style={{ color: '#F8F7F4', fontSize: '22px', fontWeight: '700', margin: 0 }}>
              🎉 Ny booking
            </Heading>
            <Text style={{ color: '#A8BFA3', fontSize: '13px', margin: '4px 0 0' }}>TinyRent — Intern varsling</Text>
          </Section>

          <Section style={{ backgroundColor: '#fff', padding: '28px 36px' }}>
            <Heading as="h2" style={{ color: '#2B2B2B', fontSize: '17px', fontWeight: '600', margin: '0 0 16px' }}>
              {customerName} har forespurt en booking
            </Heading>

            <Row style={{ marginBottom: '10px' }}>
              <Column style={{ color: '#6B7280', fontSize: '13px', width: '40%' }}>Produkt</Column>
              <Column style={{ color: '#2B2B2B', fontSize: '13px', fontWeight: '600' }}>
                {productNames.join(', ')}
              </Column>
            </Row>
            <Row style={{ marginBottom: '10px' }}>
              <Column style={{ color: '#6B7280', fontSize: '13px', width: '40%' }}>Periode</Column>
              <Column style={{ color: '#2B2B2B', fontSize: '13px' }}>{startDate} – {endDate}</Column>
            </Row>
            <Row style={{ marginBottom: '10px' }}>
              <Column style={{ color: '#6B7280', fontSize: '13px', width: '40%' }}>Leiebeløp</Column>
              <Column style={{ color: '#2B2B2B', fontSize: '13px', fontWeight: '600' }}>
                {rentalAmount.toLocaleString('nb-NO')} kr
              </Column>
            </Row>

            <Hr style={{ borderColor: '#E5E7EB', margin: '16px 0' }} />

            <Heading as="h3" style={{ color: '#2B2B2B', fontSize: '15px', fontWeight: '600', margin: '0 0 12px' }}>
              Kontaktinfo
            </Heading>
            <Row style={{ marginBottom: '8px' }}>
              <Column style={{ color: '#6B7280', fontSize: '13px', width: '40%' }}>Navn</Column>
              <Column style={{ color: '#2B2B2B', fontSize: '13px' }}>{customerName}</Column>
            </Row>
            <Row style={{ marginBottom: '8px' }}>
              <Column style={{ color: '#6B7280', fontSize: '13px', width: '40%' }}>E-post</Column>
              <Column style={{ color: '#2B2B2B', fontSize: '13px' }}>
                <Link href={`mailto:${customerEmail}`} style={{ color: '#8FA68B' }}>{customerEmail}</Link>
              </Column>
            </Row>
            {customerPhone && (
              <Row>
                <Column style={{ color: '#6B7280', fontSize: '13px', width: '40%' }}>Telefon</Column>
                <Column style={{ color: '#2B2B2B', fontSize: '13px' }}>
                  <Link href={`tel:${customerPhone}`} style={{ color: '#8FA68B' }}>{customerPhone}</Link>
                </Column>
              </Row>
            )}
          </Section>

          <Section style={{ backgroundColor: '#fff', padding: '0 36px 28px', textAlign: 'center' as const }}>
            <Link
              href={adminUrl}
              style={{
                backgroundColor: '#8FA68B', color: '#fff', borderRadius: '999px',
                padding: '12px 28px', fontSize: '14px', fontWeight: '600',
                textDecoration: 'none', display: 'inline-block',
              }}
            >
              Åpne booking i admin →
            </Link>
          </Section>

          <Section style={{ backgroundColor: '#F8F7F4', padding: '20px 36px', borderRadius: '0 0 16px 16px' }}>
            <Text style={{ color: '#9CA3AF', fontSize: '12px', margin: 0 }}>
              Booking-ID: {bookingId} · TinyRent Bergen
            </Text>
          </Section>

        </Container>
      </Body>
    </Html>
  )
}
