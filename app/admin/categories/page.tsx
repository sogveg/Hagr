export const dynamic = 'force-dynamic'

import { createServiceClient } from '@/lib/supabase-server'
import { CategoryManager } from './category-manager'

export default async function CategoriesPage() {
  const supabase = createServiceClient()
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order')
    .order('name')

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#2B2B2B] tracking-tight">Kategorier</h1>
        <p className="text-sm text-gray-500 mt-1">
          Administrer produktkategorier som vises på nettstedet
        </p>
      </div>

      <CategoryManager initialCategories={categories ?? []} />
    </div>
  )
}
