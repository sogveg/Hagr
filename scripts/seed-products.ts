import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function seed() {
  // 1. Lokasjoner
  const { data: existingLocs } = await supabase.from('locations').select('id, slug')
  let bergenId: string

  if (existingLocs?.find(l => l.slug === 'bergen')) {
    bergenId = existingLocs.find(l => l.slug === 'bergen')!.id
    console.log('Bergen finnes allerede')
  } else {
    const { data: loc, error } = await supabase
      .from('locations')
      .insert({ name: 'Bergen', slug: 'bergen', active: true })
      .select()
      .single()
    if (error) { console.error('Feil ved opprettelse av Bergen:', error.message); process.exit(1) }
    bergenId = loc.id
    console.log('✓ Bergen opprettet')
  }

  // 2. Kategorier
  const categoryData = [
    { name: 'Vogner', slug: 'vogner', description: 'Barnevogner og reisevogner', active: true, sort_order: 1 },
    { name: 'Soving', slug: 'soving', description: 'Hengekøyer, sideavleggere og vugger', active: true, sort_order: 2 },
    { name: 'Babyutstyr', slug: 'babyutstyr', description: 'Balansevipp, bilstoler og mer', active: true, sort_order: 3 },
    { name: 'Leker', slug: 'leker', description: 'Aktiviteter og leker', active: true, sort_order: 4 },
  ]

  const cat: Record<string, string> = {}
  for (const catItem of categoryData) {
    const { data: existing } = await supabase.from('categories').select('id').eq('slug', catItem.slug).single()
    if (existing) {
      cat[catItem.slug] = existing.id
    } else {
      const { data, error } = await supabase.from('categories').insert(catItem).select().single()
      if (error) { console.error(`Feil ved opprettelse av ${catItem.name}:`, error.message); continue }
      cat[catItem.slug] = data.id
      console.log(`✓ Kategori: ${catItem.name}`)
    }
  }

  // 3. Produkter
  const products = [
    {
      name: 'Moonboon Hengekøye',
      slug: 'moonboon-hengekøye',
      brand: 'Moonboon',
      model: 'Cotton Hammock',
      short_description: 'Den ikoniske hengekøya som sover babyer rolig og trygt – inspirert av mors vuggebevegelser.',
      description: 'Moonboon hengekøyen er laget av 100% organisk bomull og etterligner den rytmiske bevegelsen babyen kjenner fra mors mage. Enkel å sette opp og enkel å rengjøre. Perfekt for nyfødte opp til 6 måneder.',
      price_week: 349,
      price_month: 899,
      deposit_amount: 500,
      minimum_rental_days: 7,
      published: true,
      category_id: cat['soving'],
    },
    {
      name: 'Babyzen YOYO2',
      slug: 'babyzen-yoyo2',
      brand: 'Babyzen',
      model: 'YOYO2 6+',
      short_description: 'Verdens mest kompakte reisevogn. Fold den på sekunder og ta den med overalt.',
      description: 'Babyzen YOYO2 er den ultimate reisevognen – lett, kompakt og godkjent som håndbagasje på de fleste flyselskaper. Perfekt for familier på reise eller i Bergen sentrum der plass er begrenset.',
      price_week: 599,
      price_month: 1490,
      deposit_amount: 1000,
      minimum_rental_days: 3,
      published: true,
      category_id: cat['vogner'],
    },
    {
      name: 'SnuzPod 4 Sideavlegger',
      slug: 'snuzpod-4',
      brand: 'Snuz',
      model: 'SnuzPod4',
      short_description: 'Smart sideavlegger som gjør nattmatingen enklere. Trygt for babyen, skånsomt for deg.',
      description: 'SnuzPod4 festes til sengerammen og gir babyen et trygt, eget sovemiljø rett ved siden av deg. Justerbar høyde passer de fleste senger. Inkluderer madrass og påtrekk.',
      price_week: 449,
      price_month: 1099,
      deposit_amount: 600,
      minimum_rental_days: 7,
      published: true,
      category_id: cat['soving'],
    },
    {
      name: 'BabyBjörn Balansevipp',
      slug: 'babybjorn-balansevipp',
      brand: 'BabyBjörn',
      model: 'Bouncer Bliss',
      short_description: 'Klassisk balansevipp som roer babyen med naturlige bevegelser – ingen motor nødvendig.',
      description: 'BabyBjörn Bouncer Bliss bærer babyen ergonomisk korrekt og vugger naturlig med barnets egne bevegelser. Kan brukes fra nyfødt til 2 år. Stoff i organisk bomull, enkelt å vaske.',
      price_week: 249,
      price_month: 599,
      deposit_amount: 400,
      minimum_rental_days: 7,
      published: true,
      category_id: cat['babyutstyr'],
    },
    {
      name: 'Stokke Tripp Trapp',
      slug: 'stokke-tripp-trapp',
      brand: 'Stokke',
      model: 'Tripp Trapp + babysett',
      short_description: 'Den ikoniske høytstolen som vokser med barnet. Babysett inkludert for de minste.',
      description: 'Stokke Tripp Trapp gir barnet riktig sittestilling ved bordet fra spedbarnsalder. Inkludert babysett, setepute og bøyle. Justerbar i høyde og dybde, passer til alle bord.',
      price_week: 299,
      price_month: 749,
      deposit_amount: 500,
      minimum_rental_days: 7,
      published: true,
      category_id: cat['babyutstyr'],
    },
    {
      name: 'Cybex Cloud Z2',
      slug: 'cybex-cloud-z2',
      brand: 'Cybex',
      model: 'Cloud Z2 i-Size',
      short_description: 'Premiumbabysstol med 360° rotasjon og liggeposisjon. Enkel inn og ut av bilen.',
      description: 'Cybex Cloud Z2 roterer 360° og kan kjøres bakovervendt (anbefalt til 4 år) eller fremovervendt. Liggestilling for sovende barn. Kompatibel med de fleste Isofix-baser.',
      price_week: 499,
      price_month: 1199,
      deposit_amount: 800,
      minimum_rental_days: 3,
      published: true,
      category_id: cat['babyutstyr'],
    },
  ]

  let inserted = 0
  for (const product of products) {
    const { data: existing } = await supabase.from('products').select('id').eq('slug', product.slug).single()
    if (existing) {
      console.log(`→ ${product.name} finnes allerede`)
      continue
    }

    const { data, error } = await supabase.from('products').insert(product).select().single()
    if (error) { console.error(`❌ ${product.name}:`, error.message); continue }

    const { error: linkError } = await supabase
      .from('product_locations')
      .insert({ product_id: data.id, location_id: bergenId })

    if (linkError) {
      console.error(`❌ Kobling for ${product.name}:`, linkError.message)
    } else {
      console.log(`✓ ${product.name}`)
      inserted++
    }
  }

  console.log(`\nFerdig: ${inserted} nye produkter lagt til`)
}

seed().catch(console.error)
