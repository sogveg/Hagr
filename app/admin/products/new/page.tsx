export const dynamic = 'force-dynamic'

import { createServiceClient } from '@/lib/supabase-server'
import { ProductForm } from '@/components/admin/product-form'
import { createProduct } from '@/app/actions/admin'
import Link from 'next/link'

export default async function NewProductPage() {
  const supabase = createServiceClient()

  const [{ data: categories }, { data: locations }] = await Promise.all([
    supabase.from('categories').select('id, name').order('name'),
    supabase.from('locations').select('id, name').order('name'),
  ])

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-8">
        <Link
          href="/admin/products"
          className="text-xs text-gray-400 hover:text-gray-600 transition-colors mb-3 inline-block"
        >
          ← Tilbake til produkter
        </Link>
        <h1 className="text-2xl font-bold text-[#2B2B2B] tracking-tight">Nytt produkt</h1>
      </div>

      <ProductForm
        categories={categories ?? []}
        locations={locations ?? []}
        onSave={createProduct}
      />
    </div>
  )
}
