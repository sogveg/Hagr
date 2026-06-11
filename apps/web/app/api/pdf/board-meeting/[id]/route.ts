import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { renderToBuffer } from '@react-pdf/renderer'
import { createElement } from 'react'
import { BoardMeetingPDF } from '@/components/pdf/BoardMeetingPDF'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 })

  // Fetch meeting + company
  const { data: meeting, error } = await supabase
    .from('board_meetings')
    .select('*, companies(*)')
    .eq('id', id)
    .single()
  if (error || !meeting) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  // Fetch agenda items
  const { data: agendaItems } = await supabase
    .from('agenda_items')
    .select('*')
    .eq('board_meeting_id', id)
    .order('order_index')

  // Fetch participants
  const { data: participants } = await supabase
    .from('event_participants')
    .select('*')
    .eq('event_type', 'board_meeting')
    .eq('event_id', id)

  // Fetch risk assessment
  const { data: risk } = await supabase
    .from('risk_assessments')
    .select('*')
    .eq('event_id', id)
    .single()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const buffer = await renderToBuffer(createElement(BoardMeetingPDF, {
    meeting, company: meeting.companies, agendaItems: agendaItems ?? [], participants: participants ?? [], risk: risk ?? null,
  }) as any)

  const filename = `Styreprotokoll_${meeting.companies?.name ?? 'selskap'}_${meeting.date}.pdf`
    .replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_\-.]/g, '')

  return new NextResponse(buffer as unknown as BodyInit, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  })
}
