/**
 * Vipps MobilePay eCommerce v2 API client
 *
 * Env vars required:
 *   VIPPS_CLIENT_ID
 *   VIPPS_CLIENT_SECRET
 *   VIPPS_SUBSCRIPTION_KEY   (Ocp-Apim-Subscription-Key)
 *   VIPPS_MSN                (Merchant Serial Number)
 */

const BASE = 'https://api.vipps.no'

interface VippsConfig {
  clientId:        string
  clientSecret:    string
  subscriptionKey: string
  msn:             string
}

function getConfig(): VippsConfig {
  const clientId        = process.env.VIPPS_CLIENT_ID
  const clientSecret    = process.env.VIPPS_CLIENT_SECRET
  const subscriptionKey = process.env.VIPPS_SUBSCRIPTION_KEY
  const msn             = process.env.VIPPS_MSN

  if (!clientId || !clientSecret || !subscriptionKey || !msn) {
    throw new Error('Missing Vipps environment variables (VIPPS_CLIENT_ID, VIPPS_CLIENT_SECRET, VIPPS_SUBSCRIPTION_KEY, VIPPS_MSN)')
  }
  return { clientId, clientSecret, subscriptionKey, msn }
}

// Module-level token cache (valid per server instance)
let _tokenCache: { value: string; expiresAt: number } | null = null

async function getAccessToken(cfg: VippsConfig): Promise<string> {
  if (_tokenCache && _tokenCache.expiresAt > Date.now() + 60_000) {
    return _tokenCache.value
  }

  const res = await fetch(`${BASE}/accesstoken/get`, {
    method: 'POST',
    headers: {
      'client_id':                  cfg.clientId,
      'client_secret':              cfg.clientSecret,
      'Ocp-Apim-Subscription-Key':  cfg.subscriptionKey,
      'Content-Type':               'application/json',
    },
  })

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Vipps auth failed: ${res.status} ${body}`)
  }

  const data = await res.json()
  _tokenCache = {
    value:     data.access_token,
    expiresAt: Date.now() + (Number(data.expires_in) - 60) * 1000,
  }
  return _tokenCache.value
}

function commonHeaders(cfg: VippsConfig, token: string) {
  return {
    'Authorization':              `Bearer ${token}`,
    'Content-Type':               'application/json',
    'Ocp-Apim-Subscription-Key':  cfg.subscriptionKey,
    'Merchant-Serial-Number':     cfg.msn,
    'Vipps-System-Name':          'TinyRent',
    'Vipps-System-Version':       '1.0.0',
  }
}

// ─── Initiate payment ─────────────────────────────────────────────────────────

export async function initiateVippsPayment({
  orderId,
  amountNok,       // Amount in NOK (will be converted to øre internally)
  redirectUrl,     // Where user goes after payment
  callbackPrefix,  // Base URL for Vipps to POST callback to
  transactionText,
  customerPhone,
}: {
  orderId:         string
  amountNok:       number
  redirectUrl:     string
  callbackPrefix:  string
  transactionText: string
  customerPhone?:  string
}): Promise<string> {
  const cfg   = getConfig()
  const token = await getAccessToken(cfg)

  const body: Record<string, unknown> = {
    merchantInfo: {
      merchantSerialNumber: cfg.msn,
      callbackPrefix,
      redirectUrl,
      isApp: false,
    },
    customerInfo: customerPhone ? { mobileNumber: customerPhone.replace(/\D/g, '') } : {},
    transaction: {
      orderId,
      amount:          Math.round(amountNok * 100),   // øre
      transactionText: transactionText.slice(0, 100), // max 100 chars
    },
  }

  const res = await fetch(`${BASE}/ecomm/v2/payments`, {
    method:  'POST',
    headers: commonHeaders(cfg, token),
    body:    JSON.stringify(body),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Vipps payment init failed: ${res.status} ${err}`)
  }

  const data = await res.json()
  return data.url as string  // Vipps landing page URL
}

// ─── Capture reserved payment ─────────────────────────────────────────────────

export async function captureVippsPayment({
  orderId,
  amountNok,
}: {
  orderId:   string
  amountNok: number
}): Promise<void> {
  const cfg   = getConfig()
  const token = await getAccessToken(cfg)

  const res = await fetch(`${BASE}/ecomm/v2/payments/${orderId}/capture`, {
    method:  'POST',
    headers: {
      ...commonHeaders(cfg, token),
      'X-Request-Id': orderId,  // Idempotency key
    },
    body: JSON.stringify({
      merchantInfo: { merchantSerialNumber: cfg.msn },
      transaction: {
        amount:          Math.round(amountNok * 100),
        transactionText: 'Leie hos TinyRent',
      },
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Vipps capture failed: ${res.status} ${err}`)
  }
}

// ─── Get payment details ──────────────────────────────────────────────────────

export interface VippsPaymentStatus {
  orderId:       string
  latestStatus:  string  // e.g. 'RESERVE', 'CAPTURE', 'SALE', 'VOID', 'REJECTED'
  transactionId: string | null
  amount:        number | null  // in NOK
}

export async function getVippsPaymentDetails(orderId: string): Promise<VippsPaymentStatus> {
  const cfg   = getConfig()
  const token = await getAccessToken(cfg)

  const res = await fetch(`${BASE}/ecomm/v2/payments/${orderId}/details`, {
    headers: {
      ...commonHeaders(cfg, token),
    },
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Vipps status failed: ${res.status} ${err}`)
  }

  const data = await res.json()
  const log  = data.transactionLogHistory as Array<{ operation: string; transactionId: string; amount: number; operationSuccess: boolean }> | undefined
  const latest = log?.find(l => l.operationSuccess) ?? log?.[0]

  return {
    orderId,
    latestStatus:  latest?.operation  ?? 'UNKNOWN',
    transactionId: latest?.transactionId ?? null,
    amount:        latest?.amount != null ? latest.amount / 100 : null,
  }
}
