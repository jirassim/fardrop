import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { address, score, basePoints, farcasterPoints, tier } = await request.json();

    // Generate badge metadata based on tier
    const metadata = {
      name: `Airdrop Eligibility Badge - ${tier}`,
      description: `Proof of airdrop eligibility for ${address.slice(0, 6)}...${address.slice(-4)}. Score: ${score}/200`,
      image: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://your-domain.vercel.app'}/api/badge-image?tier=${tier}&score=${score}`,
      attributes: [
        {
          trait_type: 'Tier',
          value: tier,
        },
        {
          trait_type: 'Total Score',
          value: score,
          max_value: 200,
        },
        {
          trait_type: 'Base Points',
          value: basePoints,
        },
        {
          trait_type: 'Farcaster Points',
          value: farcasterPoints,
        },
        {
          trait_type: 'Minted At',
          value: new Date().toISOString(),
        },
      ],
      external_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://your-domain.vercel.app'}`,
    };

    return NextResponse.json(metadata);
  } catch (error) {
    console.error('Error generating badge metadata:', error);
    return NextResponse.json(
      { error: 'Failed to generate metadata' },
      { status: 500 }
    );
  }
}
