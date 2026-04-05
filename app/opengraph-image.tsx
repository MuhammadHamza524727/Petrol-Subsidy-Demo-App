import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Pakistan Petrol Subsidy Demo App'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #1d4ed8 0%, #1e3a8a 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
          gap: 24,
          padding: 60,
        }}
      >
        {/* Title */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <div style={{ fontSize: 72, color: '#bfdbfe' }}>⛽</div>
          <div style={{ fontSize: 52, fontWeight: 700, color: '#ffffff', textAlign: 'center', lineHeight: 1.2 }}>
            Pakistan Petrol
          </div>
          <div style={{ fontSize: 52, fontWeight: 700, color: '#93c5fd', textAlign: 'center' }}>
            Subsidy Demo App
          </div>
        </div>

        {/* Subtitle */}
        <div style={{ fontSize: 26, color: '#bfdbfe', textAlign: 'center' }}>
          AI-Powered · CNIC Check · QR Voucher · Dashboard
        </div>

        {/* Disclaimer badge */}
        <div
          style={{
            background: '#fef3c7',
            color: '#92400e',
            fontSize: 20,
            fontWeight: 600,
            padding: '10px 28px',
            borderRadius: 999,
            marginTop: 12,
          }}
        >
          ⚠️ DEMO ONLY — Not an Official Government Service
        </div>
      </div>
    ),
    { ...size }
  )
}
