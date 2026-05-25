export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase-server'

export default async function HomePage() {
  const supabase = await createClient()
  const { data: locations, error } = await supabase.from('locations').select('*')

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>
        TinyRent
      </h1>
      <p className="text-lg mb-8" style={{ color: 'var(--color-primary-dark)' }}>
        Lei premium babyutstyr i Bergen
      </p>
      {error ? (
        <p className="text-red-500">Supabase ikke tilkoblet ennå — fyll inn .env.local</p>
      ) : (
        <p className="text-green-600">
          Supabase tilkoblet. Lokasjoner: {locations?.length ?? 0}
        </p>
      )}
    </main>
  )
}
