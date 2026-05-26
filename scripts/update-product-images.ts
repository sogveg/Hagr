import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const imageMap: Record<string, string> = {
  'moonboon-hengekøye':    '/images/products/soving.jpg',
  'snuzpod-4':             '/images/products/soving.jpg',
  'babyzen-yoyo2':         '/images/products/vogner.jpg',
  'babybjorn-balansevipp': '/images/products/babyutstyr.jpg',
  'stokke-tripp-trapp':    '/images/products/babyutstyr.jpg',
  'cybex-cloud-z2':        '/images/products/vogner.jpg',
}

async function run() {
  // Legg til image_url-kolonnen hvis den ikke finnes
  const { error: colError } = await supabase.rpc('exec_sql', {
    sql: 'ALTER TABLE products ADD COLUMN IF NOT EXISTS image_url TEXT;'
  })
  if (colError) {
    // Prøv direkte SQL via REST API
    const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY!,
        'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY!}`,
      },
      body: JSON.stringify({ sql: 'ALTER TABLE products ADD COLUMN IF NOT EXISTS image_url TEXT;' })
    })
    console.log('SQL res:', res.status, await res.text())
  }

  // Oppdater hvert produkt
  for (const [slug, image_url] of Object.entries(imageMap)) {
    const { data: product } = await supabase.from('products').select('id').eq('slug', slug).single()
    if (!product) { console.log(`→ Fant ikke ${slug}`); continue }

    const { error } = await supabase.rpc('exec_sql', {
      sql: `UPDATE products SET image_url = '${image_url}' WHERE id = '${product.id}';`
    })
    if (error) {
      // Fallback via fetch
      await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/products?id=eq.${product.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY!,
          'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY!}`,
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({ image_url })
      })
    }
    console.log(`✓ ${slug} → ${image_url}`)
  }
}

run().catch(console.error)
