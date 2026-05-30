import { ArticleForm } from '@/components/admin/article-form'
import { createArticle } from '@/app/actions/articles'

export default function NyArtikkel() {
  return <ArticleForm onSave={createArticle} />
}
