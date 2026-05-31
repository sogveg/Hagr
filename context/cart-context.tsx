'use client'

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CartRental {
  cartId:            string
  productId:         string
  productName:       string
  productSlug:       string
  locationId:        string
  locationName:      string
  locationSlug:      string
  categorySlug:      string
  imageUrl:          string
  startDate:         string  // YYYY-MM-DD
  endDate:           string  // YYYY-MM-DD
  priceDay:          number | null
  priceWeek:         number | null
  priceMonth:        number | null
  depositAmount:     number
  minimumRentalDays: number
}

export interface CartAccessory {
  id:       string
  name:     string
  price:    number
  quantity: number
}

interface CartContextValue {
  rentals:         CartRental[]
  accessories:     CartAccessory[]
  addRental:       (item: Omit<CartRental, 'cartId'>) => boolean   // returns true if newly added
  removeRental:    (cartId: string) => void
  updateDates:     (cartId: string, start: string, end: string) => void
  setAccessoryQty: (id: string, name: string, price: number, qty: number) => void
  clearCart:       () => void
  totalItems:      number
}

// ─── Context ──────────────────────────────────────────────────────────────────

const CartCtx = createContext<CartContextValue | null>(null)

const STORAGE_KEY = 'tinyrent_cart_v1'

function genId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function CartProvider({ children }: { children: ReactNode }) {
  const [rentals,     setRentals]     = useState<CartRental[]>([])
  const [accessories, setAccessories] = useState<CartAccessory[]>([])
  const [hydrated,    setHydrated]    = useState(false)

  // Hydrate from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw)
        setRentals(parsed.rentals    ?? [])
        setAccessories(parsed.accessories ?? [])
      }
    } catch {}
    setHydrated(true)
  }, [])

  // Persist to localStorage
  useEffect(() => {
    if (!hydrated) return
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ rentals, accessories }))
  }, [rentals, accessories, hydrated])

  const addRental = useCallback((item: Omit<CartRental, 'cartId'>) => {
    let added = false
    setRentals(prev => {
      // Don't add if exact same product+dates already in cart
      const dup = prev.some(
        x => x.productId === item.productId &&
             x.startDate === item.startDate &&
             x.endDate   === item.endDate
      )
      if (dup) return prev
      added = true
      return [...prev, { ...item, cartId: genId() }]
    })
    return added
  }, [])

  const removeRental = useCallback((cartId: string) => {
    setRentals(prev => prev.filter(x => x.cartId !== cartId))
  }, [])

  const updateDates = useCallback((cartId: string, start: string, end: string) => {
    setRentals(prev => prev.map(x => x.cartId === cartId ? { ...x, startDate: start, endDate: end } : x))
  }, [])

  const setAccessoryQty = useCallback((id: string, name: string, price: number, qty: number) => {
    setAccessories(prev => {
      if (qty <= 0) return prev.filter(x => x.id !== id)
      const exists = prev.some(x => x.id === id)
      if (exists) return prev.map(x => x.id === id ? { ...x, quantity: qty } : x)
      return [...prev, { id, name, price, quantity: qty }]
    })
  }, [])

  const clearCart = useCallback(() => {
    setRentals([])
    setAccessories([])
  }, [])

  const totalItems = rentals.length + accessories.reduce((s, a) => s + a.quantity, 0)

  return (
    <CartCtx.Provider value={{
      rentals, accessories,
      addRental, removeRental, updateDates, setAccessoryQty, clearCart,
      totalItems,
    }}>
      {children}
    </CartCtx.Provider>
  )
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useCart() {
  const ctx = useContext(CartCtx)
  if (!ctx) throw new Error('useCart must be inside CartProvider')
  return ctx
}

// ─── Price helpers ─────────────────────────────────────────────────────────────

export function calcRentalPrice(
  startDate: string,
  endDate: string,
  priceDay:   number | null,
  priceWeek:  number | null,
  priceMonth: number | null,
): { total: number; label: string } | null {
  const days = Math.ceil(
    (new Date(endDate).getTime() - new Date(startDate).getTime()) / 86_400_000
  )
  if (days <= 0) return null

  const opts: { total: number; label: string }[] = []
  if (priceDay   != null) opts.push({ total: priceDay   * days,                    label: `${days} dag${days !== 1 ? 'er' : ''} × ${priceDay} kr/dag` })
  if (priceWeek  != null) opts.push({ total: priceWeek  * Math.ceil(days / 7),     label: `${Math.ceil(days / 7)} uke${Math.ceil(days / 7) !== 1 ? 'r' : ''} × ${priceWeek} kr/uke` })
  if (priceMonth != null) opts.push({ total: priceMonth * Math.ceil(days / 30),    label: `${Math.ceil(days / 30)} mnd × ${priceMonth} kr/mnd` })

  if (!opts.length) return null
  return opts.reduce((best, curr) => curr.total < best.total ? curr : best)
}
