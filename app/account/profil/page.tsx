export const dynamic = 'force-dynamic'

import { redirect } from 'next/navigation'
import { createClient, createServiceClient } from '@/lib/supabase-server'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { updateProfile } from '@/app/actions/customer'
import Link from 'next/link'

export default async function ProfilPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error: errorMsg } = await searchParams

  // Auth: use user client
  const authClient = await createClient()
  const { data: { user } } = await authClient.auth.getUser()
  if (!user) redirect('/login')

  // Fetch customer: use service client to bypass RLS (row may not exist yet)
  const supabase = createServiceClient()
  const { data: customer } = await supabase
    .from('customers')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle()

  async function handleUpdate(formData: FormData) {
    'use server'
    const result = await updateProfile({
      first_name:    formData.get('first_name') as string,
      last_name:     formData.get('last_name')  as string,
      phone:         formData.get('phone')       as string,
      address_line1: formData.get('address_line1') as string,
      postal_code:   formData.get('postal_code') as string,
      city:          formData.get('city')        as string,
    })
    if (result.success) {
      redirect('/account')
    } else {
      redirect(`/account/profil?error=${encodeURIComponent(result.error ?? 'Noe gikk galt')}`)
    }
  }

  return (
    <main className="min-h-screen bg-[var(--color-background)]">
      <Header />

      <div className="max-w-[560px] mx-auto px-6 py-12">
        <div className="mb-8">
          <Link href="/account" className="text-xs font-medium text-[var(--color-muted)] hover:text-[var(--color-foreground)] transition-colors mb-4 inline-block">
            ← Min konto
          </Link>
          <h1 className="text-2xl font-bold text-[var(--color-foreground)] tracking-tight">Rediger profil</h1>
        </div>

        <div className="bg-white rounded-2xl border border-[var(--color-border)] p-8">
          {errorMsg && (
            <div className="mb-5 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
              <p className="text-sm text-red-600">{errorMsg}</p>
            </div>
          )}
          <form action={handleUpdate} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                  Fornavn
                </label>
                <input
                  name="first_name"
                  defaultValue={customer?.first_name ?? ''}
                  className="w-full border border-black/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#8FA68B]/40"
                  placeholder="Ola"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                  Etternavn
                </label>
                <input
                  name="last_name"
                  defaultValue={customer?.last_name ?? ''}
                  className="w-full border border-black/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#8FA68B]/40"
                  placeholder="Nordmann"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                E-post
              </label>
              <input
                type="email"
                value={user.email ?? ''}
                disabled
                className="w-full border border-black/10 rounded-xl px-4 py-2.5 text-sm bg-gray-50 text-gray-400 cursor-not-allowed"
              />
              <p className="text-xs text-gray-400 mt-1">E-post kan ikke endres her</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                Telefon
              </label>
              <input
                name="phone"
                type="tel"
                defaultValue={customer?.phone ?? ''}
                className="w-full border border-black/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#8FA68B]/40"
                placeholder="+47 000 00 000"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                Adresse
              </label>
              <input
                name="address_line1"
                defaultValue={customer?.address_line1 ?? ''}
                className="w-full border border-black/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#8FA68B]/40"
                placeholder="Gateveien 1"
              />
            </div>

            <div className="grid grid-cols-[1fr_2fr] gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                  Postnummer
                </label>
                <input
                  name="postal_code"
                  defaultValue={customer?.postal_code ?? ''}
                  className="w-full border border-black/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#8FA68B]/40"
                  placeholder="5000"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                  By
                </label>
                <input
                  name="city"
                  defaultValue={customer?.city ?? ''}
                  className="w-full border border-black/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#8FA68B]/40"
                  placeholder="Bergen"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Link
                href="/account"
                className="flex-1 text-center border border-black/10 text-[var(--color-muted)] text-sm font-medium rounded-xl py-2.5 hover:bg-gray-50 transition-colors"
              >
                Avbryt
              </Link>
              <button
                type="submit"
                className="flex-1 bg-[var(--color-foreground)] text-white text-sm font-semibold rounded-xl py-2.5 hover:bg-black transition-colors"
              >
                Lagre endringer
              </button>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </main>
  )
}
