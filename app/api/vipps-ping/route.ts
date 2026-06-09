/**
 * Temporary Vipps diagnostics endpoint
 * GET /api/vipps-ping
 * Returns raw Vipps auth + payment-init response so we can see the exact error.
 * DELETE THIS FILE after debugging is done.
 */
import { NextResponse } from 'next/server'

const BASE = 'https://api.vipps.no'

export async function GET() {
  const clientId        = process.env.VIPPS_CLIENT_ID
  const clientSecret    = process.env.VIPPS_CLIENT_SECRET
  const subscriptionKey = process.env.VIPPS_SUBSCRIPTION_KEY
  const msn             = process.env.VIPPS_MSN

  const envCheck = {
    VIPPS_CLIENT_ID:        clientId        ? clientId.slice(0, 8) + '...' : 'MISSING',
    VIPPS_CLIENT_SECRET:    clientSecret    ? clientSecret.slice(0, 4) + '...' : 'MISSING',
    VIPPS_SUBSCRIPTION_KEY: subscriptionKey ? subscriptionKey.slice(0, 8) + '...' : 'MISSING',
    VIPPS_MSN:              msn             ?? 'MISSING',
  }

  if (!clientId || !clientSecret || !subscriptionKey || !msn) {
    return NextResponse.json({ error: 'Missing env vars', envCheck }, { status: 500 })
  }

  // 1. Try auth
  const authRes = await fetch(`${BASE}/accesstoken/get`, {
    method: 'POST',
    headers: {
      'client_id':                 clientId,
      'client_secret':             clientSecret,
      'Ocp-Apim-Subscription-Key': subscriptionKey,
      'Content-Type':              'application/json',
    },
  })
  const authBody = await authRes.text()

  if (!authRes.ok) {
    return NextResponse.json({
      step:     'auth',
      status:   authRes.status,
      response: authBody,
      envCheck,
    })
  }

  const { access_token } = JSON.parse(authBody)

  // 2. Try minimal payment init with a test orderId
  const testOrderId = 'ping' + Date.now().toString().slice(-25)
  const payRes = await fetch(`${BASE}/ecomm/v2/payments`, {
    method: 'POST',
    headers: {
      'Authorization':             `Bearer ${access_token}`,
      'Content-Type':              'application/json',
      'Ocp-Apim-Subscription-Key': subscriptionKey,
      'Merchant-Serial-Number':    msn,
      'Vipps-System-Name':         'TinyRent',
      'Vipps-System-Version':      '1.0.0',
    },
    body: JSON.stringify({
      merchantInfo: {
        merchantSerialNumber: msn,
        callbackPrefix:       'https://www.tinyrent.no/api/vipps',
        redirectUrl:          'https://www.tinyrent.no/vipps/success',
        isApp:                false,
      },
      customerInfo: {},
      transaction: {
        orderId:         testOrderId,
        amount:          10000,  // 100 NOK in øre
        transactionText: 'TinyRent ping test',
      },
    }),
  })
  const payBody = await payRes.text()

  return NextResponse.json({
    step:          'payment_init',
    authStatus:    authRes.status,
    payStatus:     payRes.status,
    payResponse:   payBody,
    testOrderId,
    envCheck,
  })
}
