import { Resend } from 'resend'
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM_EMAIL = process.env.EMAIL_FROM ?? 'noreply@skattesmart.no'

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('nb-NO', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function buildEmailHtml(params: {
  companyName: string
  meetingDate: string
  location: string
  participants: { name: string; role: string }[]
  agendaItems: { order_number: number; title: string; description?: string }[]
  calledBy: string
}): string {
  const agendaRows = params.agendaItems
    .sort((a, b) => a.order_number - b.order_number)
    .map(
      item => `
      <tr>
        <td style="padding:8px 12px;border-bottom:1px solid #f3f4f6;color:#6b7280;font-size:13px;width:32px;">${item.order_number}.</td>
        <td style="padding:8px 12px;border-bottom:1px solid #f3f4f6;font-size:14px;">
          <strong>${item.title}</strong>
          ${item.description ? `<div style="color:#6b7280;font-size:12px;margin-top:2px;">${item.description}</div>` : ''}
        </td>
      </tr>`
    )
    .join('')

  const participantList = params.participants
    .map(p => `<li style="margin-bottom:4px;font-size:14px;">${p.name} <span style="color:#9ca3af;">(${p.role})</span></li>`)
    .join('')

  return `
<!DOCTYPE html>
<html lang="no">
<head><meta charset="UTF-8"><title>Styremøteinnkalling</title></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#f9fafb;margin:0;padding:32px 0;">
  <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,.1);">

    <div style="background:linear-gradient(135deg,#1d4ed8,#3b82f6);padding:28px 32px;">
      <p style="color:rgba(255,255,255,.8);font-size:12px;text-transform:uppercase;letter-spacing:.08em;margin:0 0 8px;">Innkalling til styremøte</p>
      <h1 style="color:#fff;font-size:22px;font-weight:700;margin:0;">${params.companyName}</h1>
    </div>

    <div style="padding:28px 32px;border-bottom:1px solid #f3f4f6;">
      <table style="width:100%;border-collapse:collapse;">
        <tr>
          <td style="width:120px;font-size:13px;color:#6b7280;padding-bottom:10px;">Dato</td>
          <td style="font-size:14px;font-weight:600;padding-bottom:10px;">${formatDate(params.meetingDate)}</td>
        </tr>
        <tr>
          <td style="font-size:13px;color:#6b7280;padding-bottom:10px;">Sted</td>
          <td style="font-size:14px;padding-bottom:10px;">${params.location}</td>
        </tr>
        <tr>
          <td style="font-size:13px;color:#6b7280;">Innkalt av</td>
          <td style="font-size:14px;">${params.calledBy}</td>
        </tr>
      </table>
    </div>

    <div style="padding:28px 32px;border-bottom:1px solid #f3f4f6;">
      <h2 style="font-size:15px;font-weight:600;margin:0 0 12px;">Agenda</h2>
      <table style="width:100%;border-collapse:collapse;border:1px solid #f3f4f6;border-radius:8px;overflow:hidden;">
        ${agendaRows}
      </table>
    </div>

    <div style="padding:28px 32px;border-bottom:1px solid #f3f4f6;">
      <h2 style="font-size:15px;font-weight:600;margin:0 0 12px;">Deltakere</h2>
      <ul style="margin:0;padding-left:20px;">
        ${participantList}
      </ul>
    </div>

    <div style="padding:20px 32px;background:#f9fafb;">
      <p style="font-size:12px;color:#9ca3af;margin:0;">
        Denne innkallingen er sendt fra SkatteSmart. Styremøtet gjennomføres i henhold til aksjeloven § 6-29.
      </p>
    </div>
  </div>
</body>
</html>`
}

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { meeting_id, recipient_emails } = await req.json()
    if (!meeting_id || !recipient_emails?.length) {
      return NextResponse.json({ error: 'meeting_id and recipient_emails required' }, { status: 400 })
    }

    // Fetch meeting
    const { data: meeting, error: meetingError } = await supabase
      .from('board_meetings')
      .select('*, companies(name)')
      .eq('id', meeting_id)
      .single()

    if (meetingError || !meeting) {
      return NextResponse.json({ error: 'Meeting not found' }, { status: 404 })
    }

    // Fetch agenda items
    const { data: agendaItems = [] } = await supabase
      .from('agenda_items')
      .select('*')
      .eq('meeting_id', meeting_id)
      .order('order_number')

    // Fetch participants
    const { data: participantsData } = await supabase
      .from('meeting_participants')
      .select('*, company_people(name, role)')
      .eq('meeting_id', meeting_id)
    const participants = participantsData ?? []

    const companyName = (meeting.companies as { name: string })?.name ?? 'Selskapet'
    const calledBy = user.email ?? 'Styremedlem'

    const htmlContent = buildEmailHtml({
      companyName,
      meetingDate: meeting.meeting_date,
      location: meeting.location ?? 'Ikke oppgitt',
      participants: participants.map((p: { company_people: { name: string; role: string } }) => ({
        name: p.company_people?.name ?? '',
        role: p.company_people?.role ?? '',
      })),
      agendaItems: agendaItems as { order_number: number; title: string; description?: string }[],
      calledBy,
    })

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: recipient_emails,
      subject: `Innkalling til styremøte – ${companyName} – ${formatDate(meeting.meeting_date)}`,
      html: htmlContent,
    })

    if (error) {
      console.error('Resend error:', error)
      return NextResponse.json({ error: 'Email send failed' }, { status: 500 })
    }

    return NextResponse.json({ success: true, email_id: data?.id })
  } catch (err) {
    console.error('Email route error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
