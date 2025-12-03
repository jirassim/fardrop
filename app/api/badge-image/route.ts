import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const tier = searchParams.get('tier') || 'Low';
  const score = searchParams.get('score') || '0';

  // Define colors based on tier
  const tierColors: Record<string, { bg: string; primary: string; secondary: string }> = {
    High: {
      bg: '#10B981',
      primary: '#059669',
      secondary: '#D1FAE5',
    },
    Medium: {
      bg: '#F59E0B',
      primary: '#D97706',
      secondary: '#FEF3C7',
    },
    Low: {
      bg: '#EF4444',
      primary: '#DC2626',
      secondary: '#FEE2E2',
    },
  };

  const colors = tierColors[tier] || tierColors.Low;

  // Generate SVG badge
  const svg = `
    <svg width="400" height="500" viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg">
      <!-- Background -->
      <defs>
        <linearGradient id="bgGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:${colors.bg};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${colors.primary};stop-opacity:1" />
        </linearGradient>
        <filter id="shadow">
          <feDropShadow dx="0" dy="4" stdDeviation="8" flood-opacity="0.3"/>
        </filter>
      </defs>

      <!-- Main Card -->
      <rect width="400" height="500" fill="url(#bgGradient)" rx="20"/>

      <!-- Decorative circles -->
      <circle cx="350" cy="50" r="60" fill="${colors.secondary}" opacity="0.2"/>
      <circle cx="50" cy="450" r="80" fill="${colors.secondary}" opacity="0.2"/>

      <!-- Badge Icon -->
      <circle cx="200" cy="150" r="70" fill="white" opacity="0.9" filter="url(#shadow)"/>
      <text x="200" y="175" text-anchor="middle" font-size="60" fill="${colors.primary}">🎖️</text>

      <!-- Tier Text -->
      <text x="200" y="270" text-anchor="middle" font-family="Arial, sans-serif" font-size="36" font-weight="bold" fill="white">
        ${tier} Tier
      </text>

      <!-- Score Box -->
      <rect x="100" y="300" width="200" height="80" fill="white" opacity="0.9" rx="10" filter="url(#shadow)"/>
      <text x="200" y="335" text-anchor="middle" font-family="Arial, sans-serif" font-size="20" fill="${colors.primary}">
        Score
      </text>
      <text x="200" y="370" text-anchor="middle" font-family="Arial, sans-serif" font-size="36" font-weight="bold" fill="${colors.primary}">
        ${score}/200
      </text>

      <!-- Badge Title -->
      <text x="200" y="430" text-anchor="middle" font-family="Arial, sans-serif" font-size="18" fill="white" opacity="0.9">
        Airdrop Eligibility
      </text>
      <text x="200" y="455" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" fill="white" opacity="0.8">
        Base + Farcaster
      </text>
    </svg>
  `;

  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
