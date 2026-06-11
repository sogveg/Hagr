import type { Metadata } from 'next'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { CartContent } from './cart-content'

export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export default function CartPage() {
  return (
    <main className="min-h-screen bg-[var(--color-background)]">
      <Header />
      <CartContent />
      <Footer />
    </main>
  )
}
