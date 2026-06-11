import React from 'react'
import { Document, Page, Text, View } from '@react-pdf/renderer'
import { styles, colors } from './pdfStyles'

interface Props {
  meeting: any
  company: any
  agendaItems: any[]
  participants: any[]
  risk: any | null
}

function formatDate(d?: string) {
  if (!d) return '—'
  try { return new Date(d).toLocaleDateString('nb-NO', { day: '2-digit', month: '2-digit', year: 'numeric' }) }
  catch { return d }
}

export function BoardMeetingPDF({ meeting, company, agendaItems, participants, risk }: Props) {
  const riskStyle = risk?.level === 'green' ? styles.riskGreen : risk?.level === 'red' ? styles.riskRed : styles.riskYellow
  const riskLabel = risk?.level === 'green' ? 'Lav risiko' : risk?.level === 'red' ? 'Høy risiko' : 'Moderat risiko'

  return (
    <Document title={`Styreprotokoll ${company?.name ?? ''} ${meeting.date ?? ''}`} author="SkatteSmart">
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.logo}>SkatteSmart</Text>
            <Text style={styles.docTitle}>Styreprotokoll</Text>
            <Text style={styles.docSubtitle}>Møtenr. {meeting.meeting_number} · Generert {new Date().toLocaleDateString('nb-NO')}</Text>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.companyName}>{company?.name ?? '—'}</Text>
            <Text style={styles.companyMeta}>Org.nr: {company?.org_number ?? '—'}</Text>
            <Text style={styles.companyMeta}>{company?.company_type ?? ''}</Text>
            {risk && <Text style={[riskStyle, { marginTop: 4 }]}>{riskLabel} (score: {risk.score})</Text>}
          </View>
        </View>

        {/* Møteinfo */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Møteinformasjon</Text>
          <View style={styles.infoGrid}>
            <View style={styles.infoItem}><Text style={styles.infoLabel}>Dato</Text><Text style={styles.infoValue}>{formatDate(meeting.date)}</Text></View>
            <View style={styles.infoItem}><Text style={styles.infoLabel}>Tid</Text><Text style={styles.infoValue}>{meeting.start_time ?? '—'} – {meeting.end_time ?? '—'}</Text></View>
            <View style={styles.infoItem}><Text style={styles.infoLabel}>Sted / URL</Text><Text style={styles.infoValue}>{meeting.location ?? '—'}</Text></View>
            <View style={styles.infoItem}><Text style={styles.infoLabel}>Møteform</Text><Text style={styles.infoValue}>{meeting.meeting_format === 'physical' ? 'Fysisk' : meeting.meeting_format === 'digital' ? 'Digitalt' : 'Hybrid'}</Text></View>
            <View style={styles.infoItem}><Text style={styles.infoLabel}>Innkalt av</Text><Text style={styles.infoValue}>{meeting.called_by ?? '—'}</Text></View>
            <View style={styles.infoItem}><Text style={styles.infoLabel}>Møteleder</Text><Text style={styles.infoValue}>{meeting.chairperson ?? '—'}</Text></View>
            <View style={styles.infoItem}><Text style={styles.infoLabel}>Referent</Text><Text style={styles.infoValue}>{meeting.minute_taker ?? '—'}</Text></View>
            <View style={styles.infoItem}><Text style={styles.infoLabel}>Status</Text><Text style={styles.infoValue}>{meeting.status === 'finalized' ? 'Ferdigstilt' : 'Utkast'}</Text></View>
          </View>
        </View>

        {/* Deltakere */}
        {participants.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Deltakere</Text>
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={[styles.tableHeaderCell, { flex: 2 }]}>Navn</Text>
                <Text style={[styles.tableHeaderCell, { flex: 2 }]}>Rolle</Text>
              </View>
              {participants.map((p, i) => (
                <View key={i} style={[styles.tableRow, i % 2 === 1 ? styles.tableRowAlt : {}]}>
                  <Text style={[styles.tableCell, { flex: 2 }]}>{p.name}</Text>
                  <Text style={[styles.tableCell, { flex: 2 }]}>{p.role_explanation ?? '—'}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Dagsorden */}
        {agendaItems.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Dagsorden og saksbehandling</Text>
            {agendaItems.map((item, i) => (
              <View key={i} style={{ marginBottom: 10 }}>
                <Text style={[styles.bold, { fontSize: 10, marginBottom: 2 }]}>
                  Sak {item.order_index}: {item.title}
                </Text>
                {item.description ? <Text style={[styles.textSm, { color: colors.gray700, marginBottom: 3 }]}>{item.description}</Text> : null}
                {item.presenter ? <Text style={styles.textXs}><Text style={styles.gray}>Ansvarlig: </Text>{item.presenter}</Text> : null}
                {item.duration_minutes ? <Text style={styles.textXs}><Text style={styles.gray}>Varighet: </Text>{item.duration_minutes} min</Text> : null}
                {/* Vedtak placeholder */}
                <View style={{ marginTop: 6, borderTopWidth: 1, borderTopColor: colors.gray300, paddingTop: 4 }}>
                  <Text style={[styles.textXs, styles.gray]}>VEDTAK:</Text>
                  <Text style={{ fontSize: 9, color: colors.gray700, marginTop: 2 }}>
                    _______________________________________________________________
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Risikovurdering */}
        {risk && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Risikovurdering</Text>
            <View style={risk.level === 'green' ? styles.alertGreen : risk.level === 'red' ? styles.alertRed : styles.alertYellow}>
              <Text style={[styles.alertText, styles.bold]}>{riskLabel} · Score: {risk.score}/100</Text>
              {(risk.reasons ?? []).map((r: string, i: number) => (
                <Text key={i} style={[styles.alertText, { marginTop: 2 }]}>• {r}</Text>
              ))}
            </View>
            {(risk.required_documentation ?? []).length > 0 && (
              <View style={styles.mt8}>
                <Text style={[styles.textXs, styles.bold, { marginBottom: 4 }]}>Påkrevd dokumentasjon:</Text>
                {risk.required_documentation.map((d: string, i: number) => (
                  <Text key={i} style={styles.textXs}>☐  {d}</Text>
                ))}
              </View>
            )}
          </View>
        )}

        {/* Signatur */}
        <View style={[styles.section, { marginTop: 24 }]}>
          <Text style={styles.sectionTitle}>Signaturer</Text>
          <Text style={[styles.textXs, styles.gray, { marginBottom: 12 }]}>
            Protokollen bekreftes korrekt ved underskrift av samtlige styremedlemmer.
          </Text>
          <View style={styles.signatureBlock}>
            {participants.slice(0, 3).map((p, i) => (
              <View key={i} style={styles.signatureLine}>
                <Text style={[styles.textSm, { height: 30 }]}> </Text>
                <Text style={styles.signatureLabel}>{p.name}</Text>
              </View>
            ))}
            {participants.length === 0 && (
              <>
                {[0, 1, 2].map(i => (
                  <View key={i} style={styles.signatureLine}>
                    <Text style={[styles.textSm, { height: 30 }]}> </Text>
                    <Text style={styles.signatureLabel}>Styremedlem {i + 1}</Text>
                  </View>
                ))}
              </>
            )}
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>SkatteSmart · Styreprotokoll {company?.name ?? ''}</Text>
          <Text style={styles.footerText} render={({ pageNumber, totalPages }) => `Side ${pageNumber} av ${totalPages}`} />
          <Text style={styles.footerText}>Generert {new Date().toLocaleDateString('nb-NO')}</Text>
        </View>
      </Page>
    </Document>
  )
}
