import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#1e1b4b',
          backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '40px',
          }}
        >
          <div
            style={{
              fontSize: 72,
              fontWeight: 'bold',
              color: 'white',
              marginBottom: '20px',
              textShadow: '0 4px 6px rgba(0,0,0,0.3)',
            }}
          >
            🎯 Airdrop Checker
          </div>
          <div
            style={{
              fontSize: 36,
              color: '#e0e7ff',
              marginBottom: '40px',
            }}
          >
            Check Your Base & Farcaster Eligibility
          </div>
          <div
            style={{
              fontSize: 28,
              color: '#c7d2fe',
              display: 'flex',
              gap: '20px',
            }}
          >
            <span>📊 Base Network</span>
            <span>•</span>
            <span>💬 Farcaster</span>
            <span>•</span>
            <span>🎖️ NFT Badge</span>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
