'use client';

import { useState, useEffect } from 'react';
import Dashboard from './Dashboard';
import sdk from '@farcaster/miniapp-sdk';

export default function CheckerForm() {
  const [input, setInput] = useState('');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [context, setContext] = useState<any>(null);

  useEffect(() => {
    // Get Farcaster context if available
    const loadContext = async () => {
      try {
        const ctx = await sdk.context;
        setContext(ctx);
        // Auto-fill FID if user is in Farcaster
        if (ctx?.user?.fid && !input) {
          setInput(ctx.user.fid.toString());
        }
      } catch (error) {
        console.log('Not in Farcaster context');
      }
    };
    loadContext();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setData(null);

    try {
      // Validate input
      const isAddress = input.startsWith('0x') && input.length === 42;
      const isFID = /^\d+$/.test(input);

      if (!isAddress && !isFID) {
        throw new Error('Please enter a valid wallet address (0x...) or Farcaster FID (number)');
      }

      // Call API
      const response = await fetch('/api/check-eligibility', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: input.trim(),
          type: isAddress ? 'address' : 'fid',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch data');
      }

      const result = await response.json();
      setData(result);
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    if (input) {
      handleSubmit(new Event('submit') as any);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-2">
      {context?.user && (
        <div className="mb-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-3 text-center">
          <p className="text-sm text-purple-800 dark:text-purple-300">
            👋 Hi <span className="font-semibold">@{context.user.username || 'user'}</span>! Your FID is auto-filled.
          </p>
        </div>
      )}
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
        <div className="space-y-4">
          <div>
            <label htmlFor="input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Enter Wallet Address or Farcaster FID
            </label>
            <input
              id="input"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="0x... or FID number (e.g., 3621)"
              className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100 transition-all"
              required
              disabled={loading}
            />
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              Example: 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb or 3621
            </p>
          </div>

          <div className="flex gap-2 sm:gap-3">
            <button
              type="submit"
              disabled={loading || !input}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 sm:py-3 px-4 sm:px-6 text-sm sm:text-base rounded-lg transition-all duration-200 shadow-md hover:shadow-lg disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Checking...
                </span>
              ) : (
                'Check Eligibility'
              )}
            </button>

            {data && (
              <button
                type="button"
                onClick={handleRefresh}
                disabled={loading}
                className="px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-semibold rounded-lg transition-all duration-200"
              >
                Refresh
              </button>
            )}
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span>{error}</span>
              </div>
            </div>
          )}
        </div>
      </form>

      {data && <Dashboard data={data} />}

      {/* Tips Section */}
      <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">💡 Tips to Improve Your Score</h4>
        <ul className="text-sm text-blue-800 dark:text-blue-400 space-y-1 list-disc list-inside">
          <li>Increase transaction activity on Base network</li>
          <li>Engage regularly on Farcaster (cast, reply, like)</li>
          <li>Build your Farcaster following</li>
          <li>Consider getting a Farcaster Power Badge</li>
          <li>Stay active consistently over time</li>
        </ul>
      </div>
    </div>
  );
}
