import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { renderToBuffer } from '@react-pdf/renderer'
import { createElement } from 'react'
import { GiftsPDF } from '@/components/pdf/GiftsPDF'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const companyId = searchParams.get('company_id')
  const year = parseInt(searchParams.get('year') ?? String(new Date().getFullYear()))

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 })
  if (!companyId) return NextResponse.json({ error: 'company_id required' }, { status: 400 })

  const { data: company } = await supabase.from('companies').select('*').eq('id', companyId).single()
  const { data: gifts } = await supabase.from('gifts').select('*').eq('company_id', companyId).eq('year', year).order('date')
  const { data: discounts } = await supabase.from('personal_discounts').select('*').eq('company_id', companyId).eq('year', year).order('date')

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const buffer = await renderToBuffer(createElement(GiftsPDF, { company, year, gifts: gifts ?? [], discounts: discounts ?? [] }) as any)

  const filename = `Gaveliste_${company?.name ?? 'selskap'}_${year}.pdf`.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_\-.]/g, '')

  return new NextResponse(buffer as unknown as BodyInit, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  })
}
