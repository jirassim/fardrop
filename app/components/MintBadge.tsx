'use client';

import { useState } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseAbi } from 'viem';

const CONTRACT_ADDRESS = '0xC9395584a678cAE3dF076fA9507D3259e53BC9Eb' as `0x${string}`;

const ABI = parseAbi([
  'function mintBadge(address to, uint256 score, uint256 basePoints, uint256 farcasterPoints, string tier, string tokenURI) external',
  'function hasBadge(address owner) external view returns (bool)',
]);

interface MintBadgeProps {
  score: number;
  basePoints: number;
  farcasterPoints: number;
  tier: string;
}

export default function MintBadge({ score, basePoints, farcasterPoints, tier }: MintBadgeProps) {
  const { address, isConnected } = useAccount();
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const [mintStatus, setMintStatus] = useState<{type: 'success' | 'error' | '', message: string}>({type: '', message: ''});

  const handleMint = async () => {
    if (!address) return;

    try {
      setMintStatus({type: '', message: ''});

      // Generate metadata URL
      const metadataUrl = `${window.location.origin}/api/badge-metadata`;

      // Call mint function
      writeContract({
        address: CONTRACT_ADDRESS,
        abi: ABI,
        functionName: 'mintBadge',
        args: [
          address,
          BigInt(score),
          BigInt(basePoints),
          BigInt(farcasterPoints),
          tier,
          metadataUrl,
        ],
      });
    } catch (err: any) {
      setMintStatus({
        type: 'error',
        message: `❌ Error: ${err.message || 'Failed to mint badge'}`
      });
    }
  };

  // Update status based on transaction state
  if (isSuccess && mintStatus.type !== 'success') {
    setMintStatus({
      type: 'success',
      message: '✅ Badge minted successfully! View on BaseScan'
    });
  }

  if (error && mintStatus.type !== 'error') {
    setMintStatus({
      type: 'error',
      message: `❌ Error: ${error.message}`
    });
  }

  return (
    <div className="space-y-3">
      {!isConnected ? (
        <div className="space-y-3">
          <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
            Connect your wallet using the button in the top-right corner to mint your eligibility badge NFT
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <button
            onClick={handleMint}
            disabled={isPending || isConfirming}
            className={`w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 ${
              (isPending || isConfirming) ? 'cursor-not-allowed opacity-70' : ''
            }`}
          >
            {isPending || isConfirming ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>{isConfirming ? 'Confirming...' : 'Minting...'}</span>
              </>
            ) : (
              <>
                <span className="text-xl">🎖️</span>
                <span>Mint Eligibility Badge NFT</span>
              </>
            )}
          </button>

          {mintStatus.message && (
            <div className={`p-3 rounded-lg text-sm ${
              mintStatus.type === 'success'
                ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800'
                : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800'
            }`}>
              {mintStatus.message}
              {hash && (
                <a
                  href={`https://basescan.org/tx/${hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block mt-2 text-blue-600 dark:text-blue-400 hover:underline text-xs"
                >
                  View transaction →
                </a>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
