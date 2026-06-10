import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { renderToBuffer } from '@react-pdf/renderer'
import { createElement } from 'react'
import { StrategyPDF } from '@/components/pdf/StrategyPDF'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 })

  const { data: gathering, error } = await supabase
    .from('strategy_gatherings')
    .select('*, companies(*)')
    .eq('id', id)
    .single()
  if (error || !gathering) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const { data: participants } = await supabase
    .from('event_participants')
    .select('*')
    .eq('event_type', 'strategy_gathering')
    .eq('event_id', id)

  const { data: programBlocks } = await supabase
    .from('program_blocks')
    .select('*')
    .eq('strategy_gathering_id', id)
    .order('day_number').order('start_time')

  const { data: risk } = await supabase
    .from('risk_assessments')
    .select('*')
    .eq('event_id', id)
    .single()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const buffer = await renderToBuffer(createElement(StrategyPDF, {
    gathering, company: gathering.companies, participants: participants ?? [], programBlocks: programBlocks ?? [], risk: risk ?? null,
  }) as any)

  const filename = `Strategisamling_${gathering.title ?? 'samling'}.pdf`
    .replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_\-.]/g, '')

  return new NextResponse(buffer as unknown as BodyInit, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  })
}
