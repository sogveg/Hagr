// SkatteSmart — personalised tax-saving recommendations
// Generated from company profile + module usage data

export interface Recommendation {
  id: string
  title: string
  description: string
  potential_saving_nok?: number
  potential_saving_label?: string
  priority: 'high' | 'medium' | 'low'
  href: string
  cta: string
  icon: string          // lucide icon name
  color: 'green' | 'blue' | 'amber' | 'purple' | 'red'
  category: 'ytelse' | 'fradrag' | 'planlegging' | 'dokument'
  done?: boolean        // already being used
}

export interface CompanyContext {
  // Company profile
  owner_employed: boolean
  payroll_active: boolean
  has_employees: boolean
  employee_count: number
  spouse_involved: boolean
  uses_phone_for_work: boolean
  company_pays_phone: boolean
  works_from_home: boolean
  company_pays_internet: boolean
  has_company_car: boolean
  uses_private_car_for_biz: boolean
  has_cabin_boat: boolean
  holds_board_meetings: boolean
  holds_strategy_gatherings: boolean
  has_client_entertainment: boolean
  approx_annual_profit: number | null
  current_owner_salary: number | null
  aga_zone: string

  // Usage counts (current year)
  phone_benefit_count: number
  mileage_trip_count: number
  gift_count: number
  board_meeting_count: number
  strategy_gathering_count: number
  representation_count: number
  welfare_count: number
}

export function generateRecommendations(ctx: CompanyContext): Recommendation[] {
  const recs: Recommendation[] = []

  // ── 1. Telefon og internett ────────────────────────────────────────────────
  if (ctx.uses_phone_for_work && !ctx.company_pays_phone && ctx.phone_benefit_count === 0) {
    const employees = Math.max(1, ctx.employee_count || 1)
    recs.push({
      id: 'phone_benefit',
      title: 'Dekk mobil via selskapet',
      description: `Selskapet kan betale mobilen og trekke fra hele kostnaden. ${ctx.has_employees ? `Dine ${employees} ansatte` : 'Du'} beskattes bare av et fast sjablongbeløp på 4 392 kr/år — uansett telefonkostnad.`,
      potential_saving_nok: Math.round(employees * 6000 * 0.22), // ca. 22% skattefordel på 6k/ansatt
      potential_saving_label: `Estimert skattefordel: ~${Math.round(employees * 6000 * 0.22).toLocaleString('nb-NO')} kr/år`,
      priority: 'high',
      href: '/phone-internet',
      cta: 'Registrer telefonytelse',
      icon: 'Smartphone',
      color: 'blue',
      category: 'ytelse',
    })
  } else if (ctx.company_pays_phone && ctx.phone_benefit_count === 0) {
    recs.push({
      id: 'phone_register',
      title: 'Registrer telefonytelsen',
      description: 'Du har sagt at selskapet dekker mobil — husk å registrere dette for korrekt innberetning.',
      priority: 'high',
      href: '/phone-internet',
      cta: 'Registrer nå',
      icon: 'Smartphone',
      color: 'amber',
      category: 'dokument',
    })
  }

  // ── 2. Kjørebok ────────────────────────────────────────────────────────────
  if (ctx.uses_private_car_for_biz && ctx.mileage_trip_count === 0) {
    recs.push({
      id: 'mileage_log',
      title: 'Start kjørebok',
      description: 'Kjøring med privatbil i jobbsammenheng gir rett til 4,50 kr/km skattefritt. Uten kjørebok kan du ikke kreve dette.',
      potential_saving_label: '4,50 kr/km skattefritt — 10 000 km/år = 45 000 kr',
      priority: 'high',
      href: '/car',
      cta: 'Åpne kjørebok',
      icon: 'Navigation',
      color: 'green',
      category: 'ytelse',
    })
  }

  // ── 3. Gaver til ansatte ────────────────────────────────────────────────────
  if ((ctx.has_employees || ctx.owner_employed) && ctx.gift_count === 0) {
    const count = Math.max(1, ctx.employee_count || 1)
    recs.push({
      id: 'gifts',
      title: 'Gi gaver skattefritt',
      description: `5 000 kr per person per år er skattefritt i naturalier. Med ${count} ${count === 1 ? 'person' : 'ansatte'} kan du gi inntil ${(count * 5000).toLocaleString('nb-NO')} kr uten at noen betaler skatt.`,
      potential_saving_nok: Math.round(count * 5000 * 0.22),
      potential_saving_label: `Inntil ${(count * 5000).toLocaleString('nb-NO')} kr kan gis skattefritt`,
      priority: ctx.employee_count > 0 ? 'high' : 'medium',
      href: '/gifts',
      cta: 'Registrer gave',
      icon: 'Gift',
      color: 'green',
      category: 'ytelse',
    })
  }

  // ── 4. Styremøter ───────────────────────────────────────────────────────────
  if (ctx.holds_board_meetings && ctx.board_meeting_count === 0) {
    recs.push({
      id: 'board_meetings',
      title: 'Dokumenter styremøtene',
      description: 'Styreprotokoll er lovpålagt for AS. Møtemat, reise og lokale er fradragsberettiget — men krever dokumentasjon.',
      priority: 'high',
      href: '/board-meetings/new',
      cta: 'Opprett styreprotokoll',
      icon: 'ClipboardList',
      color: 'purple',
      category: 'dokument',
    })
  } else if (!ctx.holds_board_meetings) {
    recs.push({
      id: 'board_meetings_start',
      title: 'Hold styremøter — det er lovpålagt',
      description: 'AS-eiere har plikt til å avholde styremøter. Dokumenterte møter gir også fradragsrett for tilhørende kostnader.',
      priority: 'medium',
      href: '/board-meetings/new',
      cta: 'Opprett første styreprotokoll',
      icon: 'ClipboardList',
      color: 'amber',
      category: 'fradrag',
    })
  }

  // ── 5. Strategisamlinger ────────────────────────────────────────────────────
  if (ctx.holds_strategy_gatherings && ctx.strategy_gathering_count === 0) {
    recs.push({
      id: 'strategy',
      title: 'Dokumenter strategisamlinger',
      description: 'Reise, overnatting, mat og lokale er fradragsberettiget når samlingen har minimum 6 timer faglig program per dag.',
      priority: 'medium',
      href: '/strategy/new',
      cta: 'Registrer samling',
      icon: 'Target',
      color: 'purple',
      category: 'fradrag',
    })
  }

  // ── 6. Representasjon ───────────────────────────────────────────────────────
  if (ctx.has_client_entertainment && ctx.representation_count === 0) {
    recs.push({
      id: 'representation',
      title: 'Registrer ekstern representasjon',
      description: 'Middag med kunder: 560 kr/person eks. mva gir skattefradrag. Lunsj i arbeidstid: fullt fradrag. Uten bilag = tapt fradrag.',
      priority: 'medium',
      href: '/representation',
      cta: 'Registrer representasjon',
      icon: 'Coffee',
      color: 'blue',
      category: 'fradrag',
    })
  }

  // ── 7. Lønn vs. utbytte-optimalisering ─────────────────────────────────────
  if (ctx.owner_employed && ctx.approx_annual_profit && ctx.approx_annual_profit > 500000) {
    const profit = ctx.approx_annual_profit
    const salary = ctx.current_owner_salary ?? 0
    const pensionMax = 927658 // 7.1 × G 2026
    const needsOptimization = salary < pensionMax * 0.8 || salary > pensionMax * 1.3
    if (needsOptimization) {
      recs.push({
        id: 'salary_dividend',
        title: 'Optimaliser lønn vs. utbytte',
        description: salary < pensionMax
          ? `Du tar ut ${salary.toLocaleString('nb-NO')} kr i lønn, men 7,1 G (${pensionMax.toLocaleString('nb-NO')} kr) gir full pensjonopptjening og sykepengedekning. Det kan lønne seg å øke lønnen.`
          : `Du tar mer i lønn enn 7,1 G. Over kryssingspunktet (980 100 kr) er utbytte skattemessig bedre. Vurder å ta resten som utbytte.`,
        priority: 'high',
        href: '/salary-dividend',
        cta: 'Åpne kalkulator',
        icon: 'TrendingUp',
        color: 'blue',
        category: 'planlegging',
      })
    }
  } else if (ctx.owner_employed && !ctx.approx_annual_profit) {
    recs.push({
      id: 'salary_dividend_setup',
      title: 'Beregn optimal lønn vs. utbytte',
      description: 'Feil balanse mellom lønn og utbytte er den vanligste skattefeilen for AS-eiere. Vi hjelper deg finne det optimale splittet.',
      priority: 'medium',
      href: '/salary-dividend',
      cta: 'Start beregning',
      icon: 'TrendingUp',
      color: 'blue',
      category: 'planlegging',
    })
  }

  // ── 8. Velferdstiltak ──────────────────────────────────────────────────────
  if (ctx.has_employees && ctx.welfare_count === 0) {
    const count = Math.max(1, ctx.employee_count)
    recs.push({
      id: 'welfare',
      title: 'Velferdstiltak for ansatte',
      description: `Julebord, sommerfest og teambuilding: ca. 5 000 kr per ansatt kan dekkes av selskapet skattefritt. Med ${count} ansatte er det potensielt ${(count * 5000).toLocaleString('nb-NO')} kr.`,
      potential_saving_label: `Ca. ${(count * 5000).toLocaleString('nb-NO')} kr kan dekkes skattefritt`,
      priority: 'low',
      href: '/welfare',
      cta: 'Se velferdstiltak',
      icon: 'Heart',
      color: 'green',
      category: 'ytelse',
    })
  }

  // ── 9. Hytte/båt ───────────────────────────────────────────────────────────
  if (ctx.has_cabin_boat) {
    recs.push({
      id: 'cabin_boat',
      title: 'Beregn fordel for hytte/båt',
      description: 'Privat bruk av selskapets hytte eller båt er skattepliktig — 1 135 kr/dag høysesong. Kombiner med styremøter for å redusere den private andelen.',
      priority: 'medium',
      href: '/cabin-boat',
      cta: 'Beregn fordelen',
      icon: 'Anchor',
      color: 'amber',
      category: 'ytelse',
    })
  }

  // Sort: high → medium → low, then by category
  const priorityOrder = { high: 0, medium: 1, low: 2 }
  recs.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])

  return recs
}
