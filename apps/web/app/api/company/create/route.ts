import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

export async function POST(req: NextRequest) {
  // 1. Verify the user session
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: () => {},
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Ikke innlogget' }, { status: 401 })
  }

  // 2. Parse body
  const body = await req.json()
  const {
    name, org_number, company_type,
    has_employees, employee_count,
    owner_employed, payroll_active, spouse_involved,
    uses_phone_for_work, company_pays_phone,
    works_from_home, company_pays_internet,
    has_company_car, uses_private_car_for_biz,
    has_cabin_boat, holds_board_meetings,
    holds_strategy_gatherings, has_client_entertainment,
    approx_annual_profit, current_owner_salary,
    aga_zone, onboarding_completed,
  } = body

  if (!name || !company_type) {
    return NextResponse.json({ error: 'Mangler påkrevde felt' }, { status: 400 })
  }

  // 3. Use service role to bypass RLS
  const admin = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // 4. Check subscription limits
  const { data: sub } = await admin
    .from('subscriptions')
    .select('plan_id, extra_companies')
    .eq('user_id', user.id)
    .single()

  const planLimits: Record<string, number> = { start: 1, pro: 4, premium: 10 }
  if (sub) {
    const { data: accessRows } = await admin
      .from('company_access')
      .select('company_id')
      .eq('user_id', user.id)
    const currentCount = accessRows?.length ?? 0
    const maxAllowed = (planLimits[sub.plan_id] ?? 1) + (sub.plan_id === 'premium' ? (sub.extra_companies ?? 0) : 0)
    if (currentCount >= maxAllowed) {
      return NextResponse.json(
        { error: `Abonnementet ditt (${sub.plan_id}) tillater maks ${maxAllowed} selskap` },
        { status: 403 }
      )
    }
  }

  // 5. Upsert subscription (trialing) if none exists
  await admin.from('subscriptions').upsert({
    user_id: user.id,
    plan_id: 'start',
    status: 'trialing',
    current_period_end: new Date(Date.now() + 30 * 86400000).toISOString(),
  }, { onConflict: 'user_id', ignoreDuplicates: true })

  // 6. Create company
  const { data: company, error: compError } = await admin
    .from('companies')
    .insert({
      name,
      org_number: org_number?.replace(/\s/g, '') || null,
      company_type,
      has_employees: has_employees ?? false,
      employee_count: employee_count ?? 0,
      owner_employed: owner_employed ?? true,
      payroll_active: payroll_active ?? false,
      spouse_involved: spouse_involved ?? false,
      uses_phone_for_work: uses_phone_for_work ?? false,
      company_pays_phone: company_pays_phone ?? false,
      works_from_home: works_from_home ?? false,
      company_pays_internet: company_pays_internet ?? false,
      has_company_car: has_company_car ?? false,
      uses_private_car_for_biz: uses_private_car_for_biz ?? false,
      has_cabin_boat: has_cabin_boat ?? false,
      holds_board_meetings: holds_board_meetings ?? false,
      holds_strategy_gatherings: holds_strategy_gatherings ?? false,
      has_client_entertainment: has_client_entertainment ?? false,
      approx_annual_profit: approx_annual_profit ?? null,
      current_owner_salary: current_owner_salary ?? null,
      aga_zone: aga_zone ?? 'zone1',
      onboarding_completed: onboarding_completed ?? true,
    })
    .select()
    .single()

  if (compError || !company) {
    return NextResponse.json({ error: compError?.message ?? 'Feil ved opprettelse' }, { status: 500 })
  }

  // 7. Grant owner access
  await admin.from('company_access').insert({
    company_id: company.id,
    user_id: user.id,
    role: 'owner',
  })

  return NextResponse.json({ company })
}
