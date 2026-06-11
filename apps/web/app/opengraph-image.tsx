import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'SkatteSmart — Lovlig skattegrep for AS-eiere'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          padding: '80px',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {/* Logo / brand */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '40px',
          }}
        >
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '14px',
              background: 'rgba(255,255,255,0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '28px',
            }}
          >
            💡
          </div>
          <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '28px', fontWeight: 500 }}>
            SkatteSmart
          </span>
        </div>

        {/* Headline */}
        <div
          style={{
            color: '#ffffff',
            fontSize: '64px',
            fontWeight: 800,
            lineHeight: 1.1,
            marginBottom: '24px',
            maxWidth: '900px',
          }}
        >
          Lovlig skattegrep for AS-eiere
        </div>

        {/* Subline */}
        <div
          style={{
            color: 'rgba(199,210,254,0.9)',
            fontSize: '28px',
            fontWeight: 400,
            lineHeight: 1.4,
            maxWidth: '780px',
          }}
        >
          Styremøter · Strategisamlinger · Lønn vs. utbytte · Firmabil · Gaver
        </div>

        {/* Bottom pill */}
        <div
          style={{
            position: 'absolute',
            bottom: '64px',
            right: '80px',
            background: 'rgba(255,255,255,0.12)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '999px',
            padding: '10px 24px',
            color: 'rgba(255,255,255,0.8)',
            fontSize: '20px',
          }}
        >
          skattesmart.no
        </div>
      </div>
    ),
    { ...size },
  )
}
