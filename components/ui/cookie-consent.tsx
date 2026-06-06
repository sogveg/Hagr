'use client'

import { useEffect, useState } from 'react'
import Script from 'next/script'

const GA_ID = process.env.NEXT_PUBLIC_GA_ID

type Consent = 'accepted' | 'declined' | null

// Helper — safely call gtag if it exists on window
function updateConsent(granted: boolean) {
  if (typeof window === 'undefined') return
  const w = window as any
  if (typeof w.gtag !== 'function') return
  w.gtag('consent', 'update', {
    analytics_storage: granted ? 'granted' : 'denied',
    ad_storage: 'denied', // We don't run ads
  })
}

export function CookieConsent() {
  const [consent, setConsent] = useState<Consent>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('cookie_consent') as Consent
    if (stored === 'accepted') {
      setConsent('accepted')
      updateConsent(true)
    } else if (stored === 'declined') {
      setConsent('declined')
    } else {
      // Small delay so it doesn't flash on first paint
      const t = setTimeout(() => setVisible(true), 800)
      return () => clearTimeout(t)
    }
  }, [])

  function accept() {
    localStorage.setItem('cookie_consent', 'accepted')
    setConsent('accepted')
    setVisible(false)
    updateConsent(true)
  }

  function decline() {
    localStorage.setItem('cookie_consent', 'declined')
    setConsent('declined')
    setVisible(false)
  }

  return (
    <>
      {/* GA4 — Consent Mode v2: script always loads, default denied, updated on accept */}
      {GA_ID && (
        <>
          <Script id="ga4-consent-default" strategy="beforeInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('consent', 'default', {
                analytics_storage: 'denied',
                ad_storage: 'denied',
                wait_for_update: 500,
              });
            `}
          </Script>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_ID}', { anonymize_ip: true });
            `}
          </Script>
        </>
      )}

      {/* Cookie banner */}
      {visible && (
        <div
          role="dialog"
          aria-label="Cookie-samtykke"
          className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4 md:px-6 md:pb-6"
        >
          <div className="max-w-2xl mx-auto bg-[var(--color-foreground)] text-white rounded-2xl px-6 py-5 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold mb-1">Vi bruker informasjonskapsler</p>
              <p className="text-xs text-white/60 leading-relaxed">
                Vi bruker Google Analytics for å forstå hvordan siden brukes, slik at vi kan gjøre den bedre.
                Les mer i vår{' '}
                <a href="/personvern" className="underline hover:text-white transition-colors">
                  personvernerklæring
                </a>
                .
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={decline}
                className="text-xs font-semibold text-white/60 hover:text-white transition-colors px-3 py-2"
              >
                Avslå
              </button>
              <button
                onClick={accept}
                className="text-xs font-bold bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white rounded-xl px-4 py-2 transition-colors"
              >
                Godta
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
