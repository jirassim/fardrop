import React from 'react';

interface AirdropEstimateProps {
  estimate: {
    base: {
      tier: string;
      points: number;
      estimateMin: number;
      estimateMax: number;
      probability: string;
    };
    farcaster: {
      tier: string;
      points: number;
      estimateMin: number;
      estimateMax: number;
      probability: string;
    };
    disclaimer: string;
  };
}

export default function AirdropEstimate({ estimate }: AirdropEstimateProps) {
  const getProbabilityColor = (probability: string) => {
    switch (probability) {
      case 'High':
        return 'text-green-600 dark:text-green-400';
      case 'Medium':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'Low':
        return 'text-orange-600 dark:text-orange-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString('en-US');
  };

  return (
    <div className="mt-4 sm:mt-6 space-y-4 sm:space-y-6">
      {/* Title */}
      <div className="text-center">
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          💰 Potential Airdrop Estimate
        </h3>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
          Based on historical patterns (ARB, STRK)
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Base Estimate */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg p-4 sm:p-6 border-2 border-blue-300 dark:border-blue-700">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
              B
            </div>
            <h4 className="text-lg sm:text-xl font-bold text-blue-900 dark:text-blue-100">
              Base ($BASE)
            </h4>
          </div>

          <div className="space-y-3">
            <div>
              <p className="text-xs sm:text-sm text-blue-700 dark:text-blue-300 mb-1">Tier</p>
              <p className="text-base sm:text-lg font-bold text-blue-900 dark:text-blue-100">
                {estimate.base.tier}
              </p>
            </div>

            <div>
              <p className="text-xs sm:text-sm text-blue-700 dark:text-blue-300 mb-1">Points</p>
              <p className="text-base sm:text-lg font-bold text-blue-900 dark:text-blue-100">
                {formatNumber(estimate.base.points)}
              </p>
            </div>

            <div className="border-t-2 border-blue-300 dark:border-blue-700 pt-3">
              <p className="text-xs sm:text-sm text-blue-700 dark:text-blue-300 mb-2">
                Estimated Amount
              </p>
              <div className="bg-white dark:bg-blue-950 rounded-lg p-3 text-center">
                <p className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {formatNumber(estimate.base.estimateMin)} - {formatNumber(estimate.base.estimateMax)}
                </p>
                <p className="text-xs sm:text-sm text-blue-700 dark:text-blue-300 mt-1">
                  $BASE tokens
                </p>
              </div>
            </div>

            <div>
              <p className="text-xs sm:text-sm text-blue-700 dark:text-blue-300 mb-1">
                Probability
              </p>
              <span
                className={`inline-block px-3 py-1 text-sm font-semibold rounded-full ${getProbabilityColor(
                  estimate.base.probability
                )} bg-white dark:bg-blue-950`}
              >
                {estimate.base.probability}
              </span>
            </div>
          </div>
        </div>

        {/* Farcaster Estimate */}
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg p-4 sm:p-6 border-2 border-purple-300 dark:border-purple-700">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold">
              F
            </div>
            <h4 className="text-lg sm:text-xl font-bold text-purple-900 dark:text-purple-100">
              Farcaster ($FAR)
            </h4>
          </div>

          <div className="space-y-3">
            <div>
              <p className="text-xs sm:text-sm text-purple-700 dark:text-purple-300 mb-1">Tier</p>
              <p className="text-base sm:text-lg font-bold text-purple-900 dark:text-purple-100">
                {estimate.farcaster.tier}
              </p>
            </div>

            <div>
              <p className="text-xs sm:text-sm text-purple-700 dark:text-purple-300 mb-1">
                Points
              </p>
              <p className="text-base sm:text-lg font-bold text-purple-900 dark:text-purple-100">
                {formatNumber(estimate.farcaster.points)}
              </p>
            </div>

            <div className="border-t-2 border-purple-300 dark:border-purple-700 pt-3">
              <p className="text-xs sm:text-sm text-purple-700 dark:text-purple-300 mb-2">
                Estimated Amount
              </p>
              <div className="bg-white dark:bg-purple-950 rounded-lg p-3 text-center">
                <p className="text-2xl sm:text-3xl font-bold text-purple-600 dark:text-purple-400">
                  {formatNumber(estimate.farcaster.estimateMin)} -{' '}
                  {formatNumber(estimate.farcaster.estimateMax)}
                </p>
                <p className="text-xs sm:text-sm text-purple-700 dark:text-purple-300 mt-1">
                  $FAR tokens
                </p>
              </div>
            </div>

            <div>
              <p className="text-xs sm:text-sm text-purple-700 dark:text-purple-300 mb-1">
                Probability
              </p>
              <span
                className={`inline-block px-3 py-1 text-sm font-semibold rounded-full ${getProbabilityColor(
                  estimate.farcaster.probability
                )} bg-white dark:bg-purple-950`}
              >
                {estimate.farcaster.probability}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 p-4 rounded-r-lg">
        <div className="flex items-start gap-2">
          <span className="text-amber-600 dark:text-amber-400 text-lg flex-shrink-0">⚠️</span>
          <div>
            <p className="text-sm font-semibold text-amber-800 dark:text-amber-300 mb-1">
              Disclaimer
            </p>
            <p className="text-xs text-amber-700 dark:text-amber-400">{estimate.disclaimer}</p>
            <p className="text-xs text-amber-700 dark:text-amber-400 mt-2">
              Note: Farcaster founders have stated no plans for a $FAR token. Estimates shown are
              speculative based on ecosystem activity patterns.
            </p>
          </div>
        </div>
      </div>

      {/* How to Improve */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/10 dark:to-purple-900/10 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
        <h5 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
          <span>📈</span> How to Increase Your Chances
        </h5>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
          <div className="space-y-2">
            <p className="font-semibold text-blue-700 dark:text-blue-300">For Base:</p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1">
              <li>Increase transaction count (aim for 100+)</li>
              <li>Stay active across multiple days</li>
              <li>Interact with various dApps</li>
              <li>Provide liquidity on DEXs</li>
              <li>Bridge more assets to Base</li>
            </ul>
          </div>
          <div className="space-y-2">
            <p className="font-semibold text-purple-700 dark:text-purple-300">For Farcaster:</p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1">
              <li>Post regularly (daily casts)</li>
              <li>Engage with other users</li>
              <li>Build your following</li>
              <li>Consider Power Badge ($5/month)</li>
              <li>Create or moderate channels</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
