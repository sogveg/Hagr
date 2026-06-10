import React from 'react'
import { Document, Page, Text, View } from '@react-pdf/renderer'
import { styles, colors } from './pdfStyles'

interface Props {
  company: any
  year: number
  gifts: any[]
  discounts: any[]
}

export function GiftsPDF({ company, year, gifts, discounts }: Props) {
  const totalGiftTaxFree = gifts.reduce((s, g) => s + Number(g.tax_free_amount), 0)
  const totalGiftTaxable = gifts.reduce((s, g) => s + Number(g.taxable_amount), 0)
  const totalDiscountTaxFree = discounts.reduce((s, d) => s + (Number(d.market_value_nok) - Number(d.employee_paid_nok) - Number(d.taxable_amount)), 0)
  const totalDiscountTaxable = discounts.reduce((s, d) => s + Number(d.taxable_amount), 0)

  return (
    <Document title={`Gaveliste ${company?.name ?? ''} ${year}`} author="SkatteSmart">
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.logo}>SkatteSmart</Text>
            <Text style={styles.docTitle}>Gaveliste og personalrabatter</Text>
            <Text style={styles.docSubtitle}>Skatteår {year} · Generert {new Date().toLocaleDateString('nb-NO')}</Text>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.companyName}>{company?.name ?? '—'}</Text>
            <Text style={styles.companyMeta}>Org.nr: {company?.org_number ?? '—'}</Text>
          </View>
        </View>

        {/* Summary */}
        <View style={[styles.section, { flexDirection: 'row', gap: 12 }]}>
          <View style={{ flex: 1, backgroundColor: colors.greenLight, padding: 10, borderRadius: 4 }}>
            <Text style={[styles.textXs, { color: colors.green, marginBottom: 2 }]}>GAVER — Skattefri andel</Text>
            <Text style={[styles.bold, { fontSize: 14, color: colors.green }]}>{totalGiftTaxFree.toLocaleString('nb-NO')} kr</Text>
          </View>
          <View style={{ flex: 1, backgroundColor: colors.redLight, padding: 10, borderRadius: 4 }}>
            <Text style={[styles.textXs, { color: colors.red, marginBottom: 2 }]}>GAVER — Skattepliktig andel</Text>
            <Text style={[styles.bold, { fontSize: 14, color: colors.red }]}>{totalGiftTaxable.toLocaleString('nb-NO')} kr</Text>
          </View>
          <View style={{ flex: 1, backgroundColor: colors.greenLight, padding: 10, borderRadius: 4 }}>
            <Text style={[styles.textXs, { color: colors.green, marginBottom: 2 }]}>RABATTER — Skattefri andel</Text>
            <Text style={[styles.bold, { fontSize: 14, color: colors.green }]}>{totalDiscountTaxFree.toLocaleString('nb-NO')} kr</Text>
          </View>
          <View style={{ flex: 1, backgroundColor: colors.redLight, padding: 10, borderRadius: 4 }}>
            <Text style={[styles.textXs, { color: colors.red, marginBottom: 2 }]}>RABATTER — Skattepliktig</Text>
            <Text style={[styles.bold, { fontSize: 14, color: colors.red }]}>{totalDiscountTaxable.toLocaleString('nb-NO')} kr</Text>
          </View>
        </View>

        {/* Gifts table */}
        {gifts.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Gaver ({gifts.length} stk)</Text>
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={[styles.tableHeaderCell, { flex: 2 }]}>Mottaker</Text>
                <Text style={[styles.tableHeaderCell, { flex: 2 }]}>Beskrivelse</Text>
                <Text style={[styles.tableHeaderCell, { width: 55 }]}>Dato</Text>
                <Text style={[styles.tableHeaderCell, { width: 60, textAlign: 'right' }]}>Beløp</Text>
                <Text style={[styles.tableHeaderCell, { width: 60, textAlign: 'right' }]}>Skattefri</Text>
                <Text style={[styles.tableHeaderCell, { width: 60, textAlign: 'right' }]}>Skattep.</Text>
              </View>
              {gifts.map((g, i) => (
                <View key={i} style={[styles.tableRow, i % 2 === 1 ? styles.tableRowAlt : {}]}>
                  <Text style={[styles.tableCell, { flex: 2 }]}>{g.recipient_name}</Text>
                  <Text style={[styles.tableCell, { flex: 2 }]}>{g.description ?? '—'}</Text>
                  <Text style={[styles.tableCell, { width: 55 }]}>{g.date}</Text>
                  <Text style={[styles.tableCell, { width: 60, textAlign: 'right' }]}>{Number(g.amount_nok).toLocaleString('nb-NO')}</Text>
                  <Text style={[styles.tableCell, styles.green, { width: 60, textAlign: 'right' }]}>{Number(g.tax_free_amount).toLocaleString('nb-NO')}</Text>
                  <Text style={[styles.tableCell, Number(g.taxable_amount) > 0 ? styles.red : {}, { width: 60, textAlign: 'right' }]}>
                    {Number(g.taxable_amount).toLocaleString('nb-NO')}
                  </Text>
                </View>
              ))}
              {/* Totals */}
              <View style={[styles.tableRow, { borderTopWidth: 1.5, borderTopColor: colors.gray300, backgroundColor: colors.gray100 }]}>
                <Text style={[styles.tableCellBold, { flex: 2 }]}>Total</Text>
                <Text style={[styles.tableCellBold, { flex: 2 }]}> </Text>
                <Text style={[styles.tableCellBold, { width: 55 }]}> </Text>
                <Text style={[styles.tableCellBold, { width: 60, textAlign: 'right' }]}>{(totalGiftTaxFree + totalGiftTaxable).toLocaleString('nb-NO')}</Text>
                <Text style={[styles.tableCellBold, styles.green, { width: 60, textAlign: 'right' }]}>{totalGiftTaxFree.toLocaleString('nb-NO')}</Text>
                <Text style={[styles.tableCellBold, styles.red, { width: 60, textAlign: 'right' }]}>{totalGiftTaxable.toLocaleString('nb-NO')}</Text>
              </View>
            </View>
          </View>
        )}

        {/* Discounts table */}
        {discounts.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Personalrabatter ({discounts.length} stk)</Text>
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={[styles.tableHeaderCell, { flex: 2 }]}>Ansatt</Text>
                <Text style={[styles.tableHeaderCell, { flex: 2 }]}>Vare/tjeneste</Text>
                <Text style={[styles.tableHeaderCell, { width: 55 }]}>Dato</Text>
                <Text style={[styles.tableHeaderCell, { width: 60, textAlign: 'right' }]}>Markedspris</Text>
                <Text style={[styles.tableHeaderCell, { width: 60, textAlign: 'right' }]}>Betalt</Text>
                <Text style={[styles.tableHeaderCell, { width: 60, textAlign: 'right' }]}>Skattep.</Text>
              </View>
              {discounts.map((d, i) => (
                <View key={i} style={[styles.tableRow, i % 2 === 1 ? styles.tableRowAlt : {}]}>
                  <Text style={[styles.tableCell, { flex: 2 }]}>{d.employee_name}</Text>
                  <Text style={[styles.tableCell, { flex: 2 }]}>{d.description ?? '—'}</Text>
                  <Text style={[styles.tableCell, { width: 55 }]}>{d.date}</Text>
                  <Text style={[styles.tableCell, { width: 60, textAlign: 'right' }]}>{Number(d.market_value_nok).toLocaleString('nb-NO')}</Text>
                  <Text style={[styles.tableCell, { width: 60, textAlign: 'right' }]}>{Number(d.employee_paid_nok).toLocaleString('nb-NO')}</Text>
                  <Text style={[styles.tableCell, Number(d.taxable_amount) > 0 ? styles.red : {}, { width: 60, textAlign: 'right' }]}>
                    {Number(d.taxable_amount).toLocaleString('nb-NO')}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Disclaimer */}
        <View style={[styles.alertYellow, { marginTop: 16 }]}>
          <Text style={styles.alertText}>
            Dokumentet er generert av SkatteSmart og er ment som et hjelpemiddel ved bokettersyn. Kontroller alltid tallene med din regnskapsfører. Skattefrie grenser: gave 5 000 kr/person/år, personalrabatt 10 000 kr/person/år (2025).
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>SkatteSmart · Gaveliste {company?.name ?? ''} · {year}</Text>
          <Text style={styles.footerText} render={({ pageNumber, totalPages }) => `Side ${pageNumber} av ${totalPages}`} />
          <Text style={styles.footerText}>Generert {new Date().toLocaleDateString('nb-NO')}</Text>
        </View>
      </Page>
    </Document>
  )
}
