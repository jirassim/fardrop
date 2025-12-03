'use client';

import React from 'react';
import AirdropEstimate from './AirdropEstimate';
import MintBadge from './MintBadge';

interface OnChainData {
  txCount: number;
  activeDays: number;
  firstTx?: string;
  lastTx?: string;
}

interface FarcasterData {
  fid?: number;
  username?: string;
  displayName?: string;
  registrationDate?: string;
  postCount: number;
  followerCount?: number;
  followingCount?: number;
  proBadge: boolean;
}

interface DashboardProps {
  data: {
    onchain: OnChainData;
    farcaster: FarcasterData;
    score: number;
    eligibility: 'High' | 'Medium' | 'Low';
    airdropEstimate?: any;
  };
  walletAddress?: string;
}

export default function Dashboard({ data, walletAddress }: DashboardProps) {
  const getEligibilityColor = (level: string) => {
    switch (level) {
      case 'High':
        return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20';
      case 'Medium':
        return 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20';
      case 'Low':
        return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20';
      default:
        return 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  const getScorePercentage = () => {
    return Math.min((data.score / 200) * 100, 100);
  };

  return (
    <div className="mt-4 sm:mt-6 space-y-4 sm:space-y-6">
      {/* User Profile Card */}
      {data.farcaster.username && (
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg shadow-lg p-4 sm:p-6 border border-purple-200 dark:border-purple-800">
          <div className="flex items-center gap-3 sm:gap-4">
            {data.farcaster.fid && (
              <img
                src={`https://res.cloudinary.com/merkle-manufactory/image/fetch/c_fill,f_jpg,w_168/${encodeURIComponent(`https://i.seadn.io/s/raw/files/${data.farcaster.fid}`)}`}
                alt={data.farcaster.username}
                className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border-2 border-purple-400 dark:border-purple-600"
                onError={(e) => {
                  // Fallback to default avatar if image fails to load
                  (e.target as HTMLImageElement).src = `https://avatar.vercel.sh/${data.farcaster.username}`;
                }}
              />
            )}
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">
                  {data.farcaster.displayName || data.farcaster.username}
                </h3>
                {data.farcaster.proBadge && (
                  <span className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2 py-1 rounded-full font-semibold">
                    PRO
                  </span>
                )}
              </div>
              <p className="text-sm sm:text-base text-purple-600 dark:text-purple-400 font-medium">
                @{data.farcaster.username} · FID: {data.farcaster.fid}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Score Overview */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
            Your Eligibility Score
          </h2>
          <div className={`px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base rounded-full font-semibold ${getEligibilityColor(data.eligibility)}`}>
            {data.eligibility} Eligibility
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Total Score</span>
            <span className="font-bold text-gray-900 dark:text-gray-100">{data.score.toFixed(0)} / 200</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${getScorePercentage()}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Base On-Chain Metrics */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">Base Network Activity</h3>
          </div>
          {(data.onchain as any).isEstimated && (
            <span className="text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 px-2 py-1 rounded-full">
              Estimated
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Transactions</p>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{data.onchain.txCount}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-gray-500 dark:text-gray-400">Active Days</p>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{data.onchain.activeDays}</p>
          </div>
          {data.onchain.firstTx && (
            <div className="space-y-1 col-span-2">
              <p className="text-sm text-gray-500 dark:text-gray-400">First Transaction</p>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {new Date(data.onchain.firstTx).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Social Metrics */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-3 h-3 rounded-full bg-purple-500"></div>
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">Social Engagement</h3>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {data.farcaster.username && (
            <div className="space-y-1 col-span-2">
              <p className="text-sm text-gray-500 dark:text-gray-400">Username</p>
              <p className="text-lg font-bold text-purple-600 dark:text-purple-400">
                @{data.farcaster.username}
                {data.farcaster.proBadge && (
                  <span className="ml-2 text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2 py-1 rounded-full">
                    PRO
                  </span>
                )}
              </p>
            </div>
          )}
          <div className="space-y-1">
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Posts</p>
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{data.farcaster.postCount}</p>
          </div>
          {data.farcaster.followerCount !== undefined && (
            <div className="space-y-1">
              <p className="text-sm text-gray-500 dark:text-gray-400">Followers</p>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{data.farcaster.followerCount}</p>
            </div>
          )}
          {data.farcaster.registrationDate && (
            <div className="space-y-1 col-span-2">
              <p className="text-sm text-gray-500 dark:text-gray-400">Member Since</p>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {new Date(data.farcaster.registrationDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Airdrop Estimate */}
      {data.airdropEstimate && <AirdropEstimate estimate={data.airdropEstimate} />}

      {/* Mint Badge Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Mint Your Badge NFT
        </h3>
        <MintBadge
          score={data.score}
          basePoints={data.airdropEstimate?.base?.points || 0}
          farcasterPoints={data.airdropEstimate?.farcaster?.points || 0}
          tier={data.eligibility}
        />
      </div>

      {/* Share Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => {
            const baseEstimate = data.airdropEstimate?.base;
            const farEstimate = data.airdropEstimate?.farcaster;

            let text = `🎯 My Airdrop Eligibility Score: ${data.score.toFixed(0)}/200 (${data.eligibility})\n\n📊 Base: ${data.onchain.txCount} txs | ${data.onchain.activeDays} active days\n💬 Social: ${data.farcaster.postCount} posts${data.farcaster.proBadge ? ' | PRO' : ''}`;

            if (baseEstimate && farEstimate) {
              text += `\n\n💰 Estimated Airdrop:\n$BASE: ${baseEstimate.estimateMin.toLocaleString()}-${baseEstimate.estimateMax.toLocaleString()} (${baseEstimate.tier})\n$FAR: ${farEstimate.estimateMin.toLocaleString()}-${farEstimate.estimateMax.toLocaleString()} (${farEstimate.tier})`;
            }

            text += `\n\nCheck yours at: ${window.location.origin}`;

            // Share on Farcaster
            const farcasterUrl = `https://warpcast.com/~/compose?text=${encodeURIComponent(text)}`;
            window.open(farcasterUrl, '_blank');
          }}
          className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold py-2.5 sm:py-3 px-4 sm:px-6 text-sm sm:text-base rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.32 3H6.68C5.2 3 4 4.2 4 5.68v10.64C4 17.8 5.2 19 6.68 19h10.64c1.48 0 2.68-1.2 2.68-2.68V5.68C20 4.2 18.8 3 17.32 3zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/>
          </svg>
          <span>Farcaster</span>
        </button>

        <button
          onClick={() => {
            const baseEstimate = data.airdropEstimate?.base;
            const farEstimate = data.airdropEstimate?.farcaster;

            let text = `🎯 My Airdrop Eligibility Score: ${data.score.toFixed(0)}/200 (${data.eligibility})\n\n📊 Base: ${data.onchain.txCount} txs | ${data.onchain.activeDays} active days\n💬 Social: ${data.farcaster.postCount} posts${data.farcaster.proBadge ? ' | PRO' : ''}`;

            if (baseEstimate && farEstimate) {
              text += `\n\n💰 Estimated Airdrop:\n$BASE: ${baseEstimate.estimateMin.toLocaleString()}-${baseEstimate.estimateMax.toLocaleString()} (${baseEstimate.tier})\n$FAR: ${farEstimate.estimateMin.toLocaleString()}-${farEstimate.estimateMax.toLocaleString()} (${farEstimate.tier})`;
            }

            text += `\n\nCheck yours at: ${window.location.origin}`;

            // Share on X (Twitter)
            const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
            window.open(twitterUrl, '_blank');
          }}
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-2.5 sm:py-3 px-4 sm:px-6 text-sm sm:text-base rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
          <span>X (Twitter)</span>
        </button>
      </div>
    </div>
  );
}
