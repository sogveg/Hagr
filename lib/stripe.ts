import Stripe from 'stripe'

let _stripe: Stripe | null = null

export function getStripe(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY
    if (!key) throw new Error('STRIPE_SECRET_KEY er ikke satt i .env.local')
    _stripe = new Stripe(key, { apiVersion: '2026-04-22.dahlia' })
  }
  return _stripe
}

// Behold named export for bakoverkompatibilitet — evalueres kun ved første kall
export { _stripe as stripe }
