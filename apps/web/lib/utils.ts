export function formatDate(dateStr: string): string {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('nb-NO', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function formatCurrency(amount: number): string {
  return amount.toLocaleString('nb-NO') + ' kr'
}
