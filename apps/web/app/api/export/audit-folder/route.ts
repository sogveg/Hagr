import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { renderToBuffer } from '@react-pdf/renderer'
import { createElement } from 'react'
import JSZip from 'jszip'
import { BoardMeetingPDF } from '@/components/pdf/BoardMeetingPDF'
import { StrategyPDF } from '@/components/pdf/StrategyPDF'
import { GiftsPDF } from '@/components/pdf/GiftsPDF'

function slug(str: string) {
  return str.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_\-]/g, '').substring(0, 60)
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const companyId = searchParams.get('company_id')
  const year = parseInt(searchParams.get('year') ?? String(new Date().getFullYear()))

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 })
  if (!companyId) return NextResponse.json({ error: 'company_id required' }, { status: 400 })

  const { data: company } = await supabase.from('companies').select('*').eq('id', companyId).single()
  if (!company) return NextResponse.json({ error: 'Company not found' }, { status: 404 })

  const zip = new JSZip()
  const folderName = `Bokettersyn_${year}_${slug(company.name ?? 'selskap')}`
  const root = zip.folder(folderName)!

  // ── 01_Styremoter ──────────────────────────────────────────────────────────
  const meetingsFolder = root.folder('01_Styremoter')!
  const { data: meetings } = await supabase
    .from('board_meetings')
    .select('*, companies(*)')
    .eq('company_id', companyId)
    .gte('date', `${year}-01-01`)
    .lte('date', `${year}-12-31`)

  for (const meeting of meetings ?? []) {
    const { data: agenda } = await supabase.from('agenda_items').select('*').eq('board_meeting_id', meeting.id).order('order_index')
    const { data: parts } = await supabase.from('event_participants').select('*').eq('event_type', 'board_meeting').eq('event_id', meeting.id)
    const { data: risk } = await supabase.from('risk_assessments').select('*').eq('event_id', meeting.id).single()
    const buf = await renderToBuffer(createElement(BoardMeetingPDF, {
      meeting, company, agendaItems: agenda ?? [], participants: parts ?? [], risk: risk ?? null,
    }) as any)
    meetingsFolder.file(`Styreprotokoll_${meeting.meeting_number}_${meeting.date}.pdf`, buf)
  }

  if ((meetings ?? []).length === 0) {
    meetingsFolder.file('_ingen_styremoter.txt', `Ingen styremøter registrert for ${year}.`)
  }

  // ── 02_Strategisamlinger ────────────────────────────────────────────────────
  const stratFolder = root.folder('02_Strategisamlinger')!
  const { data: gatherings } = await supabase
    .from('strategy_gatherings')
    .select('*, companies(*)')
    .eq('company_id', companyId)
    .gte('date_from', `${year}-01-01`)
    .lte('date_from', `${year}-12-31`)

  for (const g of gatherings ?? []) {
    const { data: parts } = await supabase.from('event_participants').select('*').eq('event_type', 'strategy_gathering').eq('event_id', g.id)
    const { data: blocks } = await supabase.from('program_blocks').select('*').eq('strategy_gathering_id', g.id).order('day_number').order('start_time')
    const { data: risk } = await supabase.from('risk_assessments').select('*').eq('event_id', g.id).single()
    const buf = await renderToBuffer(createElement(StrategyPDF, {
      gathering: g, company, participants: parts ?? [], programBlocks: blocks ?? [], risk: risk ?? null,
    }) as any)
    stratFolder.file(`${slug(g.title ?? 'samling')}_${g.date_from}.pdf`, buf)
  }

  if ((gatherings ?? []).length === 0) {
    stratFolder.file('_ingen_strategisamlinger.txt', `Ingen strategisamlinger registrert for ${year}.`)
  }

  // ── 03_Gaver_og_Rabatter ────────────────────────────────────────────────────
  const giftsFolder = root.folder('03_Gaver_og_Rabatter')!
  const { data: gifts } = await supabase.from('gifts').select('*').eq('company_id', companyId).eq('year', year).order('date')
  const { data: discounts } = await supabase.from('personal_discounts').select('*').eq('company_id', companyId).eq('year', year).order('date')

  const giftsBuf = await renderToBuffer(createElement(GiftsPDF, { company, year, gifts: gifts ?? [], discounts: discounts ?? [] }) as any)
  giftsFolder.file(`Gaveliste_${company.name}_${year}.pdf`, giftsBuf)

  // ── 04_Telefon_Internett ─────────────────────────────────────────────────────
  const phoneFolder = root.folder('04_Telefon_Internett')!
  const { data: phoneBenefits } = await supabase.from('phone_internet_benefits').select('*').eq('company_id', companyId).eq('year', year)
  if ((phoneBenefits ?? []).length > 0) {
    const lines = [
      `Telefon og internett-ytelser — ${company.name} — ${year}`,
      '='.repeat(60),
      '',
      ...( phoneBenefits ?? []).map(b =>
        `${b.employee_name} | ${b.device_type} | Årskostand: ${Number(b.annual_cost_nok).toLocaleString('nb-NO')} kr | Skattepliktig fordel: ${Number(b.taxable_benefit_nok).toLocaleString('nb-NO')} kr | Innberettet: ${b.is_reported_a_melding ? 'Ja' : 'Nei'}`
      ),
      '',
      `Total skattepliktig fordel: ${(phoneBenefits ?? []).reduce((s, b) => s + Number(b.taxable_benefit_nok), 0).toLocaleString('nb-NO')} kr`,
    ]
    phoneFolder.file(`Telefon_internett_${year}.txt`, lines.join('\n'))
  } else {
    phoneFolder.file('_ingen_ytelser.txt', `Ingen telefon/internett-ytelser registrert for ${year}.`)
  }

  // ── 05_Representasjon ────────────────────────────────────────────────────────
  const repFolder = root.folder('05_Representasjon')!
  const { data: repEvents } = await supabase.from('representation_events').select('*').eq('company_id', companyId).gte('date', `${year}-01-01`).lte('date', `${year}-12-31`)
  if ((repEvents ?? []).length > 0) {
    const totalDed = (repEvents ?? []).reduce((s, e) => s + Number(e.deductible_amount), 0)
    const lines = [
      `Representasjon — ${company.name} — ${year}`,
      '='.repeat(60),
      '',
      ...(repEvents ?? []).map(e =>
        `${e.date} | ${e.purpose ?? e.rep_type} | ${Number(e.amount_nok).toLocaleString('nb-NO')} kr | Fradrag: ${Number(e.deductible_amount).toLocaleString('nb-NO')} kr | ${e.person_count} pers.`
      ),
      '',
      `Total fradragsberettiget representasjon: ${totalDed.toLocaleString('nb-NO')} kr`,
    ]
    repFolder.file(`Representasjon_${year}.txt`, lines.join('\n'))
  } else {
    repFolder.file('_ingen_representasjon.txt', `Ingen representasjon registrert for ${year}.`)
  }

  // ── 06_Firmakort ─────────────────────────────────────────────────────────────
  const cardFolder = root.folder('06_Firmakort')!
  const { data: cardEntries } = await supabase.from('cost_entries').select('*').eq('company_id', companyId).gte('date', `${year}-01-01`).lte('date', `${year}-12-31`)
  if ((cardEntries ?? []).length > 0) {
    const lines = [
      `Firmakort og mellomregning — ${company.name} — ${year}`,
      '='.repeat(60),
      '',
      ...(cardEntries ?? []).map(e =>
        `${e.date} | ${e.description} | ${Number(e.amount_nok).toLocaleString('nb-NO')} kr | ${e.entry_type} | Risiko: ${e.risk_level}`
      ),
    ]
    cardFolder.file(`Firmakort_${year}.txt`, lines.join('\n'))
  } else {
    cardFolder.file('_ingen_bilag.txt', `Ingen firmakort-bilag registrert for ${year}.`)
  }

  // ── README ──────────────────────────────────────────────────────────────────
  root.file('README.txt', [
    `BOKETTERSYNSMAPPE — ${company.name} — ${year}`,
    `Org.nr: ${company.org_number ?? '—'}`,
    `Generert av SkatteSmart: ${new Date().toLocaleDateString('nb-NO')}`,
    '',
    'Innhold:',
    '  01_Styremoter          — Styreprotokoller (PDF)',
    '  02_Strategisamlinger   — Strategisamlingsrapporter (PDF)',
    '  03_Gaver_og_Rabatter   — Gaveliste og personalrabatter (PDF)',
    '  04_Telefon_Internett   — EK-ytelse oversikt (TXT)',
    '  05_Representasjon      — Representasjonsoversikt (TXT)',
    '  06_Firmakort           — Firmakort og mellomregning (TXT)',
    '',
    'VIKTIG: Alle PDF-dokumenter er generert basert på data registrert i SkatteSmart.',
    'Kontroller alltid innholdet med din regnskapsfører før bokettersyn.',
  ].join('\n'))

  const zipBuffer = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' })
  const zipFilename = `${folderName}.zip`

  return new NextResponse(zipBuffer as unknown as BodyInit, {
    headers: {
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename="${zipFilename}"`,
    },
  })
}
