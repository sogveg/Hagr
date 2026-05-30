export const dynamic = 'force-dynamic'

import { notFound } from 'next/navigation'
import { createServiceClient } from '@/lib/supabase-server'
import { ProductForm } from '@/components/admin/product-form'
import { updateProduct } from '@/app/actions/admin'
import Link from 'next/link'

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = createServiceClient()

  const [{ data: product }, { data: categories }, { data: locations }] = await Promise.all([
    supabase.from('products').select('*').eq('id', id).single(),
    supabase.from('categories').select('id, name').order('name'),
    supabase.from('locations').select('id, name').order('name'),
  ])

  if (!product) notFound()

  async function handleSave(input: Parameters<typeof updateProduct>[1]): Promise<{ success: boolean; error?: string }> {
    'use server'
    return updateProduct(id, input)
  }

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-8">
        <Link
          href="/admin/products"
          className="text-xs text-gray-400 hover:text-gray-600 transition-colors mb-3 inline-block"
        >
          ← Tilbake til produkter
        </Link>
        <h1 className="text-2xl font-bold text-[#2B2B2B] tracking-tight">
          Rediger produkt
        </h1>
        <p className="text-sm text-gray-400 mt-1 font-mono">{product.slug}</p>
      </div>

      <ProductForm
        categories={categories ?? []}
        locations={locations ?? []}
        product={product}
        onSave={handleSave}
      />
    </div>
  )
}
