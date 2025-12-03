import { NextRequest, NextResponse } from 'next/server';

// Helper function to fetch Base transactions using Alchemy API
async function fetchBaseTransactions(address: string) {
  const apiKey = process.env.ALCHEMY_API_KEY;

  if (!apiKey || apiKey === 'your_alchemy_api_key_here') {
    console.log('No Alchemy API key, using fallback');
    return await fetchBaseTransactionsBasic(address);
  }

  try {
    const alchemyUrl = `https://base-mainnet.g.alchemy.com/v2/${apiKey}`;

    // Fetch asset transfers using Alchemy's enhanced API
    // This gets both sent and received transactions efficiently
    const [sentResponse, receivedResponse] = await Promise.all([
      fetch(alchemyUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'alchemy_getAssetTransfers',
          params: [{
            fromAddress: address,
            category: ['external', 'internal', 'erc20', 'erc721', 'erc1155'],
            maxCount: '0x3e8', // 1000 transactions
            order: 'desc',
          }],
          id: 1,
        }),
      }),
      fetch(alchemyUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'alchemy_getAssetTransfers',
          params: [{
            toAddress: address,
            category: ['external', 'internal', 'erc20', 'erc721', 'erc1155'],
            maxCount: '0x3e8', // 1000 transactions
            order: 'desc',
          }],
          id: 2,
        }),
      }),
    ]);

    if (!sentResponse.ok || !receivedResponse.ok) {
      console.error('Alchemy API error');
      return await fetchBaseTransactionsBasic(address);
    }

    const sentData = await sentResponse.json();
    const receivedData = await receivedResponse.json();

    const sentTransfers = sentData.result?.transfers || [];
    const receivedTransfers = receivedData.result?.transfers || [];

    // Combine and deduplicate by hash
    const txMap = new Map();
    [...sentTransfers, ...receivedTransfers].forEach((tx: any) => {
      if (tx.hash && tx.metadata?.blockTimestamp) {
        txMap.set(tx.hash, tx);
      }
    });

    const allTxs = Array.from(txMap.values());

    if (allTxs.length === 0) {
      return {
        txCount: 0,
        activeDays: 0,
      };
    }

    // Sort by timestamp (newest first)
    allTxs.sort((a: any, b: any) => {
      const timeA = new Date(a.metadata.blockTimestamp).getTime();
      const timeB = new Date(b.metadata.blockTimestamp).getTime();
      return timeB - timeA;
    });

    const txCount = allTxs.length;
    const lastTx = allTxs[0]; // Newest
    const firstTx = allTxs[allTxs.length - 1]; // Oldest

    const firstTxDate = new Date(firstTx.metadata.blockTimestamp);
    const lastTxDate = new Date(lastTx.metadata.blockTimestamp);

    // Calculate unique active days
    const uniqueDays = new Set<string>();
    allTxs.forEach((tx: any) => {
      const date = new Date(tx.metadata.blockTimestamp);
      const dayKey = date.toISOString().split('T')[0]; // YYYY-MM-DD
      uniqueDays.add(dayKey);
    });

    return {
      txCount,
      activeDays: uniqueDays.size,
      firstTx: firstTxDate.toISOString(),
      lastTx: lastTxDate.toISOString(),
    };
  } catch (error) {
    console.error('Error fetching Base transactions from Alchemy:', error);
    return await fetchBaseTransactionsBasic(address);
  }
}

// Fallback method using basic RPC (estimates only)
async function fetchBaseTransactionsBasic(address: string) {
  try {
    const BASE_RPC_URL = 'https://mainnet.base.org';

    const response = await fetch(BASE_RPC_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'eth_getTransactionCount',
        params: [address, 'latest'],
        id: 1,
      }),
    });

    const data = await response.json();
    const txCount = parseInt(data.result, 16);

    // Estimate active days (rough approximation)
    const estimatedActiveDays = Math.min(Math.floor(txCount / 2), 365);

    // Base mainnet launched in August 2023
    const baseMainnetLaunch = new Date('2023-08-09').getTime();
    const now = Date.now();
    const calculatedFirstTx = now - (estimatedActiveDays * 24 * 60 * 60 * 1000);
    const firstTxTimestamp = Math.max(baseMainnetLaunch, Math.min(calculatedFirstTx, now - (7 * 24 * 60 * 60 * 1000)));

    return {
      txCount,
      activeDays: estimatedActiveDays,
      firstTx: new Date(firstTxTimestamp).toISOString(),
      lastTx: new Date().toISOString(),
      isEstimated: true, // Flag to indicate this is estimated data
    };
  } catch (error) {
    console.error('Error fetching Base transactions (basic):', error);
    return {
      txCount: 0,
      activeDays: 0,
      isEstimated: true,
    };
  }
}

// Helper function to fetch Farcaster data
async function fetchFarcasterData(fid: string) {
  const apiKey = process.env.NEXT_PUBLIC_NEYNAR_API_KEY;

  if (!apiKey || apiKey === 'your_neynar_api_key_here') {
    // Return mock data if no API key
    return {
      fid: parseInt(fid),
      username: 'demo_user',
      displayName: 'Demo User',
      registrationDate: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
      postCount: 150,
      followerCount: 200,
      followingCount: 180,
      proBadge: false,
    };
  }

  try {
    const response = await fetch(`https://api.neynar.com/v2/farcaster/user/bulk?fids=${fid}`, {
      headers: {
        'api_key': apiKey,
        'accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch Farcaster data');
    }

    const data = await response.json();
    const user = data.users[0];

    if (!user) {
      throw new Error('User not found');
    }

    return {
      fid: user.fid,
      username: user.username,
      displayName: user.display_name || user.username,
      registrationDate: user.registered_at || new Date().toISOString(),
      postCount: user.cast_count || 0,
      followerCount: user.follower_count || 0,
      followingCount: user.following_count || 0,
      proBadge: user.power_badge || false,
    };
  } catch (error) {
    console.error('Error fetching Farcaster data:', error);
    throw error;
  }
}

// Scoring algorithm
function calculateScore(onchain: any, farcaster: any) {
  let score = 0;

  // Base on-chain scoring (max 100 points)
  // Transactions: up to 40 points
  if (onchain.txCount > 100) score += 40;
  else if (onchain.txCount > 50) score += 30;
  else if (onchain.txCount > 20) score += 20;
  else if (onchain.txCount > 5) score += 10;

  // Active days: up to 40 points
  if (onchain.activeDays > 90) score += 40;
  else if (onchain.activeDays > 60) score += 30;
  else if (onchain.activeDays > 30) score += 20;
  else if (onchain.activeDays > 10) score += 10;

  // Early adopter bonus: up to 20 points
  if (onchain.firstTx) {
    const daysSinceFirst = Math.floor(
      (Date.now() - new Date(onchain.firstTx).getTime()) / (1000 * 60 * 60 * 24)
    );
    if (daysSinceFirst > 180) score += 20;
    else if (daysSinceFirst > 90) score += 15;
    else if (daysSinceFirst > 30) score += 10;
  }

  // Farcaster scoring (max 100 points)
  // Posts: up to 30 points
  if (farcaster.postCount > 200) score += 30;
  else if (farcaster.postCount > 100) score += 25;
  else if (farcaster.postCount > 50) score += 20;
  else if (farcaster.postCount > 20) score += 15;
  else if (farcaster.postCount > 5) score += 10;

  // Followers: up to 25 points
  if (farcaster.followerCount > 1000) score += 25;
  else if (farcaster.followerCount > 500) score += 20;
  else if (farcaster.followerCount > 100) score += 15;
  else if (farcaster.followerCount > 50) score += 10;

  // Account age: up to 25 points
  if (farcaster.registrationDate) {
    const daysSinceReg = Math.floor(
      (Date.now() - new Date(farcaster.registrationDate).getTime()) / (1000 * 60 * 60 * 24)
    );
    if (daysSinceReg > 180) score += 25;
    else if (daysSinceReg > 90) score += 20;
    else if (daysSinceReg > 30) score += 15;
    else if (daysSinceReg > 7) score += 10;
  }

  // Pro badge: 20 points
  if (farcaster.proBadge) score += 20;

  return score;
}

function getEligibility(score: number): 'High' | 'Medium' | 'Low' {
  if (score >= 120) return 'High';
  if (score >= 60) return 'Medium';
  return 'Low';
}

// Calculate estimated airdrop amounts based on tier and activity
function calculateAirdropEstimate(onchain: any, farcaster: any, score: number, eligibility: string) {
  // Base airdrop calculation
  // Points = (Tx x 1) + (Active days x 5) + bonuses
  const basePoints = (onchain.txCount || 0) * 1 + (onchain.activeDays || 0) * 5;

  let baseMin = 0, baseMax = 0, baseTier = '';

  if (basePoints > 500) {
    baseTier = 'Tier 1 (High)';
    baseMin = 5000;
    baseMax = 10000;
  } else if (basePoints >= 200) {
    baseTier = 'Tier 2 (Medium)';
    baseMin = 1000;
    baseMax = 5000;
  } else if (basePoints >= 50) {
    baseTier = 'Tier 3 (Low)';
    baseMin = 100;
    baseMax = 1000;
  } else {
    baseTier = 'Below Threshold';
    baseMin = 0;
    baseMax = 100;
  }

  // Early adopter bonus (+20%)
  if (onchain.firstTx) {
    const daysSinceFirst = Math.floor(
      (Date.now() - new Date(onchain.firstTx).getTime()) / (1000 * 60 * 60 * 24)
    );
    if (daysSinceFirst > 180) {
      baseMin = Math.floor(baseMin * 1.2);
      baseMax = Math.floor(baseMax * 1.2);
    }
  }

  // Farcaster airdrop calculation
  // Points = (Posts x 2) + (Interactions x 1) + (Days since reg / 30) + (Badge x 100)
  const daysSinceReg = farcaster.registrationDate
    ? Math.floor((Date.now() - new Date(farcaster.registrationDate).getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  const farPoints =
    (farcaster.postCount || 0) * 2 +
    (farcaster.followerCount || 0) * 1 +
    (daysSinceReg / 30) +
    (farcaster.proBadge ? 100 : 0);

  let farMin = 0, farMax = 0, farTier = '';

  if (farPoints > 300) {
    farTier = 'Tier 1 (High)';
    farMin = 2000;
    farMax = 5000;
  } else if (farPoints >= 100) {
    farTier = 'Tier 2 (Medium)';
    farMin = 500;
    farMax = 2000;
  } else if (farPoints >= 20) {
    farTier = 'Tier 3 (Low)';
    farMin = 100;
    farMax = 500;
  } else {
    farTier = 'Below Threshold';
    farMin = 0;
    farMax = 100;
  }

  // Pro badge bonus (+30%)
  if (farcaster.proBadge) {
    farMin = Math.floor(farMin * 1.3);
    farMax = Math.floor(farMax * 1.3);
  }

  return {
    base: {
      tier: baseTier,
      points: basePoints,
      estimateMin: baseMin,
      estimateMax: baseMax,
      probability: basePoints > 500 ? 'High' : basePoints >= 200 ? 'Medium' : basePoints >= 50 ? 'Low' : 'Very Low',
    },
    farcaster: {
      tier: farTier,
      points: Math.floor(farPoints),
      estimateMin: farMin,
      estimateMax: farMax,
      probability: farPoints > 300 ? 'High' : farPoints >= 100 ? 'Medium' : farPoints >= 20 ? 'Low' : 'Very Low',
    },
    disclaimer: 'These are speculative estimates based on historical airdrop patterns (ARB, STRK). Actual amounts may vary significantly. Base and Farcaster have not officially confirmed any token airdrops.',
  };
}

export async function POST(request: NextRequest) {
  try {
    const { input, type } = await request.json();

    if (!input) {
      return NextResponse.json(
        { error: 'Input is required' },
        { status: 400 }
      );
    }

    let onchainData = { txCount: 0, activeDays: 0 };
    let farcasterData = {
      postCount: 0,
      followerCount: 0,
      followingCount: 0,
      proBadge: false,
    };

    // Determine input type
    const isAddress = input.startsWith('0x') && input.length === 42;
    const isFID = /^\d+$/.test(input);

    if (isAddress) {
      // Fetch Base on-chain data
      onchainData = await fetchBaseTransactions(input);

      // Try to find associated Farcaster account (mock for now)
      farcasterData = {
        postCount: 0,
        followerCount: 0,
        followingCount: 0,
        proBadge: false,
      };
    } else if (isFID) {
      // Fetch Farcaster data
      farcasterData = await fetchFarcasterData(input);

      // Mock on-chain data (in production, fetch from verified addresses)
      onchainData = {
        txCount: 0,
        activeDays: 0,
      };
    } else {
      return NextResponse.json(
        { error: 'Invalid input. Please provide a valid wallet address (0x...) or Farcaster FID (number)' },
        { status: 400 }
      );
    }

    // Calculate score
    const score = calculateScore(onchainData, farcasterData);
    const eligibility = getEligibility(score);

    // Calculate airdrop estimates
    const airdropEstimate = calculateAirdropEstimate(onchainData, farcasterData, score, eligibility);

    return NextResponse.json({
      onchain: onchainData,
      farcaster: farcasterData,
      score,
      eligibility,
      airdropEstimate,
    });
  } catch (error) {
    console.error('Error in check-eligibility:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data. Please try again.' },
      { status: 500 }
    );
  }
}
