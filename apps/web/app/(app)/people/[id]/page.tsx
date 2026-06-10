'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import {
  User, Mail, Phone, Building2, ArrowLeft, Gift, Smartphone,
  Car, Anchor, Heart, ChevronDown, ChevronUp, Edit3, Save, X,
  BadgeCheck, AlertTriangle, FileText, TrendingUp,
} from 'lucide-react'

const ROLE_LABELS: Record<string, string> = {
  OWNER: 'Eier', BOARD_MEMBER: 'Styremedlem', BOARD_CHAIR: 'Styreleder',
  CEO: 'Daglig leder', EMPLOYEE: 'Ansatt', ACCOUNTANT: 'Regnskapsfører',
  AUDITOR: 'Revisor', SPOUSE: 'Ektefelle/samboer', OTHER: 'Annen',
}

interface Person {
  id: string
  name: string
  email: string | null
  phone: string | null
  role: string
  is_owner: boolean
  ownership_percentage: number | null
  is_employee: boolean
  employment_percentage: number | null
  family_relation: string | null
  birth_year: number | null
  address: string | null
  bank_account: string | null
  notes: string | null
  company_id: string
  companies?: { name: string }
}

interface Gift {
  id: string
  description: string
  amount_nok: number
  date: string
  is_cash_equivalent: boolean
  risk_level: string
}

interface PhoneBenefit {
  id: string
  description: string
  monthly_cost_nok: number
  annual_cost_nok: number
  months: number
  device_type: string
}

interface CarBenefit {
  id: string
  description: string
  list_price_nok: number
  annual_benefit_nok: number
  is_electric: boolean
  car_age_years: number
}

interface MileageTrip {
  id: string
  trip_date: string
  from_location: string
  to_location: string
  purpose: string
  km: number
  reimbursement_nok: number | null
}

function SectionCard({ title, icon: Icon, children, count }: {
  title: string
  icon: React.ElementType
  children: React.ReactNode
  count?: number
}) {
  const [open, setOpen] = useState(true)
  return (
    <div className="card overflow-hidden">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-5 py-4 text-left"
      >
        <span className="flex items-center gap-2 font-semibold text-gray-900">
          <Icon size={16} className="text-gray-400" strokeWidth={2} />
          {title}
          {count !== undefined && (
            <span className="text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full">{count}</span>
          )}
        </span>
        {open ? <ChevronUp size={15} className="text-gray-400" /> : <ChevronDown size={15} className="text-gray-400" />}
      </button>
      {open && <div className="border-t border-gray-100 px-5 py-4">{children}</div>}
    </div>
  )
}

export default function PersonProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const supabase = createClient()

  const [person, setPerson] = useState<Person | null>(null)
  const [gifts, setGifts] = useState<Gift[]>([])
  const [phoneBenefits, setPhoneBenefits] = useState<PhoneBenefit[]>([])
  const [carBenefits, setCarBenefits] = useState<CarBenefit[]>([])
  const [mileageTrips, setMileageTrips] = useState<MileageTrip[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [editForm, setEditForm] = useState<Partial<Person>>({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadAll()
  }, [id])

  async function loadAll() {
    setLoading(true)
    const [personRes, giftsRes, phoneRes, carRes, mileageRes] = await Promise.all([
      supabase.from('company_people').select('*, companies(name)').eq('id', id).single(),
      supabase.from('gifts').select('*').eq('recipient_id', id).order('date', { ascending: false }),
      supabase.from('phone_internet_benefits').select('*').eq('employee_id', id).order('created_at', { ascending: false }),
      supabase.from('car_benefits').select('*').eq('employee_id', id).order('created_at', { ascending: false }),
      supabase.from('mileage_trips').select('*').eq('employee_id', id).order('trip_date', { ascending: false }),
    ])

    if (personRes.data) {
      setPerson(personRes.data as Person)
      setEditForm(personRes.data as Person)
    }
    if (giftsRes.data) setGifts(giftsRes.data as Gift[])
    if (phoneRes.data) setPhoneBenefits(phoneRes.data as PhoneBenefit[])
    if (carRes.data) setCarBenefits(carRes.data as CarBenefit[])
    if (mileageRes.data) setMileageTrips(mileageRes.data as MileageTrip[])
    setLoading(false)
  }

  async function saveEdits() {
    if (!person) return
    setSaving(true)
    const { error } = await supabase
      .from('company_people')
      .update({
        phone: editForm.phone || null,
        birth_year: editForm.birth_year || null,
        address: editForm.address || null,
        bank_account: editForm.bank_account || null,
        notes: editForm.notes || null,
        employment_percentage: editForm.employment_percentage || null,
      })
      .eq('id', id)

    if (!error) {
      setPerson(p => p ? { ...p, ...editForm } : p)
      setEditing(false)
    }
    setSaving(false)
  }

  if (loading) {
    return (
      <div className="max-w-3xl">
        <div className="h-8 w-48 bg-gray-100 rounded animate-pulse mb-6" />
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-50 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  if (!person) {
    return (
      <div className="max-w-3xl">
        <Link href="/people" className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6">
          <ArrowLeft size={15} /> Tilbake
        </Link>
        <div className="card p-10 text-center">
          <p className="text-gray-500">Person ikke funnet.</p>
        </div>
      </div>
    )
  }

  const currentYearGifts = gifts.filter(g => new Date(g.date).getFullYear() === new Date().getFullYear())
  const giftTotal = currentYearGifts.reduce((s, g) => s + Number(g.amount_nok), 0)
  const GIFT_LIMIT = 5000
  const giftRemaining = Math.max(0, GIFT_LIMIT - giftTotal)
  const totalMileageKm = mileageTrips.reduce((s, t) => s + Number(t.km), 0)
  const totalMileageNok = mileageTrips.reduce((s, t) => s + Number(t.reimbursement_nok ?? 0), 0)

  return (
    <div className="max-w-3xl">
      {/* Back */}
      <Link href="/people" className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6">
        <ArrowLeft size={15} /> Tilbake til personer og roller
      </Link>

      {/* Header card */}
      <div className="card p-6 mb-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center text-white text-xl font-bold shrink-0">
              {person.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{person.name}</h1>
              <div className="flex flex-wrap gap-1.5 mt-2">
                <span className="text-xs bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 rounded-full font-medium">
                  {ROLE_LABELS[person.role] ?? person.role}
                </span>
                {person.is_owner && person.ownership_percentage && (
                  <span className="text-xs bg-purple-50 text-purple-700 border border-purple-100 px-2 py-0.5 rounded-full font-medium">
                    Eier {person.ownership_percentage}%
                  </span>
                )}
                {person.is_employee && person.employment_percentage && (
                  <span className="text-xs bg-green-50 text-green-700 border border-green-100 px-2 py-0.5 rounded-full font-medium">
                    Ansatt {person.employment_percentage}%
                  </span>
                )}
                {person.family_relation && (
                  <span className="text-xs bg-amber-50 text-amber-700 border border-amber-100 px-2 py-0.5 rounded-full">
                    {person.family_relation}
                  </span>
                )}
              </div>
              {person.email && (
                <div className="flex items-center gap-1.5 mt-2 text-sm text-gray-500">
                  <Mail size={13} /> {person.email}
                </div>
              )}
              {(person as any).companies?.name && (
                <div className="flex items-center gap-1.5 mt-1 text-sm text-gray-400">
                  <Building2 size={13} /> {(person as any).companies.name}
                </div>
              )}
            </div>
          </div>
          <button
            onClick={() => setEditing(v => !v)}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50 transition-all"
          >
            <Edit3 size={13} strokeWidth={2} />
            Rediger
          </button>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-4 gap-3 mt-5 pt-4 border-t border-gray-100">
          <div className="text-center">
            <p className="text-lg font-bold text-gray-900">{giftTotal.toLocaleString('nb-NO')} kr</p>
            <p className="text-xs text-gray-400 mt-0.5">Gaver i år</p>
          </div>
          <div className="text-center">
            <p className={`text-lg font-bold ${giftRemaining > 0 ? 'text-green-600' : 'text-red-500'}`}>
              {giftRemaining.toLocaleString('nb-NO')} kr
            </p>
            <p className="text-xs text-gray-400 mt-0.5">Gjenstår (gaver)</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-gray-900">{totalMileageKm.toLocaleString('nb-NO')} km</p>
            <p className="text-xs text-gray-400 mt-0.5">Kjøregodtgj.</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-blue-600">{phoneBenefits.length + carBenefits.length}</p>
            <p className="text-xs text-gray-400 mt-0.5">Aktive ytelser</p>
          </div>
        </div>
      </div>

      {/* Edit form */}
      {editing && (
        <div className="card p-5 mb-5 border-blue-200 bg-blue-50">
          <h2 className="font-semibold text-gray-900 mb-4">Rediger profilinformasjon</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Telefon</label>
              <input className="input" placeholder="+47 900 00 000" value={editForm.phone ?? ''} onChange={e => setEditForm(p => ({ ...p, phone: e.target.value }))} />
            </div>
            <div>
              <label className="label">Fødselsår</label>
              <input className="input" type="number" placeholder="1985" value={editForm.birth_year ?? ''} onChange={e => setEditForm(p => ({ ...p, birth_year: parseInt(e.target.value) || undefined }))} />
            </div>
            <div>
              <label className="label">Stillingsprosent</label>
              <input className="input" type="number" min="0" max="100" placeholder="100" value={editForm.employment_percentage ?? ''} onChange={e => setEditForm(p => ({ ...p, employment_percentage: parseFloat(e.target.value) || undefined }))} />
            </div>
            <div>
              <label className="label">Bankkonto (for utbetalinger)</label>
              <input className="input" placeholder="1234.56.78901" value={editForm.bank_account ?? ''} onChange={e => setEditForm(p => ({ ...p, bank_account: e.target.value }))} />
            </div>
            <div className="col-span-2">
              <label className="label">Adresse</label>
              <input className="input" placeholder="Gateveien 1, 0123 Oslo" value={editForm.address ?? ''} onChange={e => setEditForm(p => ({ ...p, address: e.target.value }))} />
            </div>
            <div className="col-span-2">
              <label className="label">Notater (intern informasjon)</label>
              <textarea className="input min-h-[80px] resize-none" placeholder="F.eks. AGA-sone, særavtaler, o.l." value={editForm.notes ?? ''} onChange={e => setEditForm(p => ({ ...p, notes: e.target.value }))} />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={saveEdits} disabled={saving} className="btn-primary flex items-center gap-2">
              <Save size={14} /> {saving ? 'Lagrer…' : 'Lagre'}
            </button>
            <button onClick={() => { setEditing(false); setEditForm(person) }} className="btn-secondary flex items-center gap-2">
              <X size={14} /> Avbryt
            </button>
          </div>
        </div>
      )}

      {/* Profile details */}
      {(person.phone || person.birth_year || person.address || person.bank_account || person.notes) && (
        <SectionCard title="Profilinformasjon" icon={User}>
          <div className="grid grid-cols-2 gap-4 text-sm">
            {person.phone && (
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Telefon</p>
                <p className="font-medium text-gray-800 flex items-center gap-1.5"><Phone size={13} className="text-gray-400" />{person.phone}</p>
              </div>
            )}
            {person.birth_year && (
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Fødselsår</p>
                <p className="font-medium text-gray-800">{person.birth_year} ({new Date().getFullYear() - person.birth_year} år)</p>
              </div>
            )}
            {person.employment_percentage && (
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Stillingsprosent</p>
                <p className="font-medium text-gray-800">{person.employment_percentage}%</p>
              </div>
            )}
            {person.bank_account && (
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Bankkonto</p>
                <p className="font-medium text-gray-800 font-mono">{person.bank_account}</p>
              </div>
            )}
            {person.address && (
              <div className="col-span-2">
                <p className="text-xs text-gray-400 mb-0.5">Adresse</p>
                <p className="font-medium text-gray-800">{person.address}</p>
              </div>
            )}
            {person.notes && (
              <div className="col-span-2">
                <p className="text-xs text-gray-400 mb-0.5">Notater</p>
                <p className="text-gray-700 bg-gray-50 rounded-lg p-3">{person.notes}</p>
              </div>
            )}
          </div>
        </SectionCard>
      )}

      {/* Gifts */}
      <SectionCard title="Gaver" icon={Gift} count={gifts.length}>
        {/* Progress bar */}
        <div className="mb-4">
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-gray-500">Brukt i {new Date().getFullYear()}</span>
            <span className={`font-semibold ${giftTotal >= GIFT_LIMIT ? 'text-red-600' : 'text-gray-700'}`}>
              {giftTotal.toLocaleString('nb-NO')} / {GIFT_LIMIT.toLocaleString('nb-NO')} kr
            </span>
          </div>
          <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${giftTotal >= GIFT_LIMIT ? 'bg-red-500' : giftTotal >= GIFT_LIMIT * 0.8 ? 'bg-amber-400' : 'bg-green-500'}`}
              style={{ width: `${Math.min(100, (giftTotal / GIFT_LIMIT) * 100)}%` }}
            />
          </div>
          {giftRemaining > 0
            ? <p className="text-xs text-green-600 mt-1">{giftRemaining.toLocaleString('nb-NO')} kr gjenstår skattefritt i år</p>
            : <p className="text-xs text-red-600 mt-1 flex items-center gap-1"><AlertTriangle size={11} /> Skattefri grense nådd — ytterligere gaver er skattepliktige</p>
          }
        </div>

        {gifts.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-4">Ingen gaver registrert</p>
        ) : (
          <div className="space-y-2">
            {gifts.slice(0, 10).map(g => (
              <div key={g.id} className="flex items-center justify-between text-sm py-2 border-b border-gray-50 last:border-0">
                <div>
                  <p className="font-medium text-gray-800">{g.description}</p>
                  <p className="text-xs text-gray-400">{new Date(g.date).toLocaleDateString('nb-NO')}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{Number(g.amount_nok).toLocaleString('nb-NO')} kr</p>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                    g.risk_level === 'green' ? 'bg-green-50 text-green-600' :
                    g.risk_level === 'yellow' ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-600'
                  }`}>{g.risk_level === 'green' ? 'Skattefri' : g.risk_level === 'yellow' ? 'Vurder' : 'Skattepliktig'}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        <Link href={`/gifts`} className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 mt-3">
          <Gift size={11} /> Registrer gave
        </Link>
      </SectionCard>

      {/* Phone/internet */}
      <SectionCard title="Telefon og internett" icon={Smartphone} count={phoneBenefits.length}>
        {phoneBenefits.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-4">Ingen ytelser registrert</p>
        ) : (
          <div className="space-y-3">
            {phoneBenefits.map(p => (
              <div key={p.id} className="flex justify-between items-start text-sm bg-gray-50 rounded-xl px-4 py-3">
                <div>
                  <p className="font-medium text-gray-800">{p.description}</p>
                  <p className="text-xs text-gray-400">{p.device_type} · {p.months} mnd</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{Number(p.annual_cost_nok).toLocaleString('nb-NO')} kr/år</p>
                  <p className="text-xs text-gray-400">{Number(p.monthly_cost_nok).toLocaleString('nb-NO')} kr/mnd</p>
                </div>
              </div>
            ))}
          </div>
        )}
        <Link href="/phone-internet" className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 mt-3">
          <Smartphone size={11} /> Legg til ytelse
        </Link>
      </SectionCard>

      {/* Car */}
      <SectionCard title="Bil og kjørebok" icon={Car} count={carBenefits.length + mileageTrips.length}>
        {carBenefits.length > 0 && (
          <div className="space-y-3 mb-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Firmabil</p>
            {carBenefits.map(c => (
              <div key={c.id} className="flex justify-between items-start text-sm bg-gray-50 rounded-xl px-4 py-3">
                <div>
                  <p className="font-medium text-gray-800">{c.description}</p>
                  <p className="text-xs text-gray-400">{c.is_electric ? 'El-bil' : 'Fossil'} · {c.car_age_years} år gammel</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{Number(c.annual_benefit_nok).toLocaleString('nb-NO')} kr/år fordel</p>
                  <p className="text-xs text-gray-400">Listepris {Number(c.list_price_nok).toLocaleString('nb-NO')} kr</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {mileageTrips.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Kjørebok</p>
            <div className="flex gap-4 text-sm mb-3">
              <div className="bg-blue-50 rounded-xl px-4 py-2 text-center">
                <p className="font-bold text-blue-700">{totalMileageKm.toLocaleString('nb-NO')} km</p>
                <p className="text-xs text-blue-500">Totalt</p>
              </div>
              <div className="bg-green-50 rounded-xl px-4 py-2 text-center">
                <p className="font-bold text-green-700">{totalMileageNok.toLocaleString('nb-NO')} kr</p>
                <p className="text-xs text-green-500">Godtgjørelse</p>
              </div>
            </div>
            <div className="space-y-1.5">
              {mileageTrips.slice(0, 5).map(t => (
                <div key={t.id} className="flex justify-between text-sm text-gray-600 py-1.5 border-b border-gray-50 last:border-0">
                  <div>
                    <p className="font-medium">{t.from_location} → {t.to_location}</p>
                    <p className="text-xs text-gray-400">{new Date(t.trip_date).toLocaleDateString('nb-NO')} · {t.purpose}</p>
                  </div>
                  <p className="font-semibold text-gray-800">{Number(t.km).toLocaleString('nb-NO')} km</p>
                </div>
              ))}
              {mileageTrips.length > 5 && (
                <p className="text-xs text-gray-400 pt-1">+ {mileageTrips.length - 5} flere turer</p>
              )}
            </div>
          </div>
        )}

        {carBenefits.length === 0 && mileageTrips.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-4">Ingen bil eller kjøreturer registrert</p>
        )}
        <Link href="/car" className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 mt-3">
          <Car size={11} /> Registrer kjøring
        </Link>
      </SectionCard>

      {/* Quick links */}
      <div className="card p-5">
        <p className="text-sm font-semibold text-gray-700 mb-3">Snarveier for {person.name.split(' ')[0]}</p>
        <div className="flex flex-wrap gap-2">
          {[
            { href: '/gifts', label: 'Gi gave', icon: Gift },
            { href: '/phone-internet', label: 'Telefon/internett', icon: Smartphone },
            { href: '/car', label: 'Bil og kjørebok', icon: Car },
            { href: '/cabin-boat', label: 'Hytte og båt', icon: Anchor },
            { href: '/welfare', label: 'Velferdstiltak', icon: Heart },
            { href: '/salary-dividend', label: 'Lønn vs. utbytte', icon: TrendingUp },
          ].map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition-all"
            >
              <Icon size={12} strokeWidth={2} />
              {label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
