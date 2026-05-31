'use client'

import Link from 'next/link'
import { useCart } from '@/context/cart-context'

export function CartIcon() {
  const { totalItems } = useCart()

  return (
    <Link
      href="/cart"
      className="relative flex items-center justify-center w-10 h-10 rounded-full hover:bg-black/[0.05] transition-colors"
      aria-label={`Handlevogn${totalItems > 0 ? ` (${totalItems} varer)` : ''}`}
    >
      {/* Shopping bag icon */}
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
        <line x1="3" y1="6" x2="21" y2="6"/>
        <path d="M16 10a4 4 0 0 1-8 0"/>
      </svg>

      {/* Badge */}
      {totalItems > 0 && (
        <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[#4A6741] text-white text-[10px] font-bold flex items-center justify-center leading-none">
          {totalItems > 9 ? '9+' : totalItems}
        </span>
      )}
    </Link>
  )
}
