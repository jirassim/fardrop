'use client';

import { useState, useEffect } from 'react';
import { useAccount, useConnect, useDisconnect, useSwitchChain } from 'wagmi';
import { base } from 'wagmi/chains';

export default function WalletConnect() {
  const { address, isConnected, chain } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();
  const [showModal, setShowModal] = useState(false);

  // Auto-switch to Base mainnet when connected
  useEffect(() => {
    if (isConnected && chain && chain.id !== base.id) {
      switchChain({ chainId: base.id });
    }
  }, [isConnected, chain, switchChain]);

  const handleConnect = (connector: any) => {
    connect({ connector });
    setShowModal(false);
  };

  return (
    <>
      {/* Connect Button */}
      <div className="fixed top-4 right-4 z-50">
        {!isConnected ? (
          <button
            onClick={() => setShowModal(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-2 px-4 sm:py-3 sm:px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 text-sm sm:text-base"
          >
            <span>🔗</span>
            <span>Connect Wallet</span>
          </button>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-3">
              <div className="flex items-center gap-2 flex-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                  {address?.slice(0, 6)}...{address?.slice(-4)}
                </span>
              </div>
              <button
                onClick={() => disconnect()}
                className="text-xs text-red-600 dark:text-red-400 hover:underline whitespace-nowrap"
              >
                Disconnect
              </button>
            </div>
            {chain && (
              <div className="px-3 py-1 sm:px-4 sm:py-2 bg-blue-50 dark:bg-blue-900/20 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-1 text-xs text-blue-700 dark:text-blue-300">
                  <span className="font-medium">{chain.name}</span>
                  {chain.id !== base.id && (
                    <button
                      onClick={() => switchChain({ chainId: base.id })}
                      className="ml-2 underline hover:no-underline"
                    >
                      Switch to Base
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl max-w-md w-full p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                Connect Wallet
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400">
              Choose your preferred wallet to connect to Base network
            </p>

            <div className="space-y-2">
              {connectors.map((connector) => (
                <button
                  key={connector.id}
                  onClick={() => handleConnect(connector)}
                  className="w-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-between group"
                >
                  <span className="flex items-center gap-3">
                    <span className="text-2xl">
                      {connector.name === 'MetaMask' && '🦊'}
                      {connector.name === 'WalletConnect' && '🔗'}
                      {connector.name === 'Coinbase Wallet' && '🔵'}
                      {!['MetaMask', 'WalletConnect', 'Coinbase Wallet'].includes(connector.name) && '👛'}
                    </span>
                    <span>{connector.name}</span>
                  </span>
                  <svg
                    className="w-5 h-5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              ))}
            </div>

            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                By connecting, you agree to Base network terms
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
