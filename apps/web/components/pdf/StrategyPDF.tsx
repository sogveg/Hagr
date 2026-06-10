import React from 'react'
import { Document, Page, Text, View } from '@react-pdf/renderer'
import { styles, colors } from './pdfStyles'

interface Props {
  gathering: any
  company: any
  participants: any[]
  programBlocks: any[]
  risk: any | null
}

function formatDate(d?: string) {
  if (!d) return '—'
  try { return new Date(d).toLocaleDateString('nb-NO', { day: '2-digit', month: '2-digit', year: 'numeric' }) }
  catch { return d }
}

const BLOCK_TYPE_LABELS: Record<string, string> = {
  professional: 'Faglig',
  social: 'Sosialt',
  break: 'Pause',
}

export function StrategyPDF({ gathering, company, participants, programBlocks, risk }: Props) {
  const riskStyle = risk?.level === 'green' ? styles.riskGreen : risk?.level === 'red' ? styles.riskRed : styles.riskYellow
  const riskLabel = risk?.level === 'green' ? 'Lav risiko' : risk?.level === 'red' ? 'Høy risiko' : 'Moderat risiko'

  const professionalMinutes = programBlocks.filter(b => b.block_type === 'professional').reduce((s, b) => {
    const [sh, sm] = b.start_time.split(':').map(Number)
    const [eh, em] = b.end_time.split(':').map(Number)
    return s + Math.max(0, (eh * 60 + em) - (sh * 60 + sm))
  }, 0)
  const totalMinutes = programBlocks.reduce((s, b) => {
    const [sh, sm] = b.start_time.split(':').map(Number)
    const [eh, em] = b.end_time.split(':').map(Number)
    return s + Math.max(0, (eh * 60 + em) - (sh * 60 + sm))
  }, 0)
  const professionalPct = totalMinutes > 0 ? Math.round(professionalMinutes / totalMinutes * 100) : 0

  return (
    <Document title={`Strategisamling ${gathering.title ?? ''}`} author="SkatteSmart">
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.logo}>SkatteSmart</Text>
            <Text style={styles.docTitle}>Strategisamlingsrapport</Text>
            <Text style={styles.docSubtitle}>{gathering.title} · Generert {new Date().toLocaleDateString('nb-NO')}</Text>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.companyName}>{company?.name ?? '—'}</Text>
            <Text style={styles.companyMeta}>Org.nr: {company?.org_number ?? '—'}</Text>
            {risk && <Text style={[riskStyle, { marginTop: 4 }]}>{riskLabel} (score: {risk.score})</Text>}
          </View>
        </View>

        {/* Basisinfo */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Samlingsinformasjon</Text>
          <View style={styles.infoGrid}>
            <View style={styles.infoItem}><Text style={styles.infoLabel}>Fra dato</Text><Text style={styles.infoValue}>{formatDate(gathering.date_from)}</Text></View>
            <View style={styles.infoItem}><Text style={styles.infoLabel}>Til dato</Text><Text style={styles.infoValue}>{formatDate(gathering.date_to)}</Text></View>
            <View style={styles.infoItem}><Text style={styles.infoLabel}>Sted</Text><Text style={styles.infoValue}>{gathering.location ?? '—'}</Text></View>
            <View style={styles.infoItem}><Text style={styles.infoLabel}>Overnatting</Text><Text style={styles.infoValue}>{gathering.overnight_stay ? 'Ja' : 'Nei'}</Text></View>
            <View style={styles.infoItem}><Text style={styles.infoLabel}>Reise inkludert</Text><Text style={styles.infoValue}>{gathering.travel_included ? 'Ja' : 'Nei'}</Text></View>
            <View style={styles.infoItem}><Text style={styles.infoLabel}>Status</Text><Text style={styles.infoValue}>{gathering.status === 'finalized' ? 'Ferdigstilt' : 'Utkast'}</Text></View>
          </View>
        </View>

        {/* Formål */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Forretningsmessig formål</Text>
          <Text style={styles.textSm}>{gathering.purpose ?? '—'}</Text>
          {gathering.business_relevance && (
            <View style={styles.mt8}>
              <Text style={[styles.textXs, styles.gray, { marginBottom: 2 }]}>Forretningsrelevans:</Text>
              <Text style={styles.textSm}>{gathering.business_relevance}</Text>
            </View>
          )}
          {gathering.location_rationale && (
            <View style={styles.mt8}>
              <Text style={[styles.textXs, styles.gray, { marginBottom: 2 }]}>Begrunnelse for valg av sted:</Text>
              <Text style={styles.textSm}>{gathering.location_rationale}</Text>
            </View>
          )}
        </View>

        {/* Deltakere */}
        {participants.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Deltakere og roller</Text>
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={[styles.tableHeaderCell, { flex: 1.5 }]}>Navn</Text>
                <Text style={[styles.tableHeaderCell, { flex: 3 }]}>Faglig rolle og begrunnelse</Text>
              </View>
              {participants.map((p, i) => (
                <View key={i} style={[styles.tableRow, i % 2 === 1 ? styles.tableRowAlt : {}]}>
                  <Text style={[styles.tableCell, { flex: 1.5 }]}>{p.name}</Text>
                  <Text style={[styles.tableCell, { flex: 3 }]}>{p.role_explanation ?? '—'}</Text>
                </View>
              ))}
            </View>
            {gathering.companions && (
              <Text style={[styles.textXs, styles.gray, { marginTop: 6 }]}>Ledsagere: {gathering.companions}</Text>
            )}
          </View>
        )}

        {/* Program */}
        {programBlocks.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Faglig program — {professionalPct}% faglig innhold
            </Text>
            {programBlocks.length > 0 && (
              <View style={{ flexDirection: 'row', gap: 8, marginBottom: 8 }}>
                <View style={[styles.riskGreen, { flexDirection: 'row', gap: 4 }]}>
                  <Text>Faglig: {professionalMinutes} min ({professionalPct}%)</Text>
                </View>
                <View style={[professionalPct >= 70 ? styles.riskGreen : styles.riskYellow]}>
                  <Text>{professionalPct >= 70 ? '✓ Over 70% faglig' : '⚠ Under 70% faglig'}</Text>
                </View>
              </View>
            )}
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={[styles.tableHeaderCell, { width: 30 }]}>Dag</Text>
                <Text style={[styles.tableHeaderCell, { width: 70 }]}>Tid</Text>
                <Text style={[styles.tableHeaderCell, { flex: 3 }]}>Aktivitet</Text>
                <Text style={[styles.tableHeaderCell, { width: 55 }]}>Type</Text>
              </View>
              {programBlocks.map((b, i) => (
                <View key={i} style={[styles.tableRow, i % 2 === 1 ? styles.tableRowAlt : {}]}>
                  <Text style={[styles.tableCell, { width: 30 }]}>{b.day_number}</Text>
                  <Text style={[styles.tableCell, { width: 70 }]}>{b.start_time}–{b.end_time}</Text>
                  <Text style={[styles.tableCell, { flex: 3 }]}>{b.title}</Text>
                  <Text style={[styles.tableCell, { width: 55, color: b.block_type === 'professional' ? colors.green : colors.gray500 }]}>
                    {BLOCK_TYPE_LABELS[b.block_type] ?? b.block_type}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Sosialt/privat */}
        {(gathering.social_program || gathering.private_activities) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Sosialt program og private innslag</Text>
            {gathering.social_program && (
              <View style={styles.mt4}>
                <Text style={[styles.textXs, styles.gray]}>Sosialt program:</Text>
                <Text style={styles.textSm}>{gathering.social_program}</Text>
              </View>
            )}
            {gathering.private_activities && (
              <View style={styles.mt8}>
                <Text style={[styles.textXs, { color: colors.yellow }]}>Private aktiviteter (reduserer fradragsrett forholdsmessig):</Text>
                <Text style={styles.textSm}>{gathering.private_activities}</Text>
              </View>
            )}
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
            {(risk.risk_reducing_actions ?? []).length > 0 && (
              <View style={styles.mt8}>
                <Text style={[styles.textXs, styles.bold, { marginBottom: 4 }]}>Risikoreduserende tiltak:</Text>
                {risk.risk_reducing_actions.map((a: string, i: number) => (
                  <Text key={i} style={styles.textXs}>☐  {a}</Text>
                ))}
              </View>
            )}
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>SkatteSmart · Strategisamlingsrapport</Text>
          <Text style={styles.footerText} render={({ pageNumber, totalPages }) => `Side ${pageNumber} av ${totalPages}`} />
          <Text style={styles.footerText}>Generert {new Date().toLocaleDateString('nb-NO')}</Text>
        </View>
      </Page>
    </Document>
  )
}
