import CheckerForm from './components/CheckerForm';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-3 sm:p-4 flex flex-col items-center">
      <div className="w-full max-w-4xl space-y-4 sm:space-y-8 py-4 sm:py-8">
        <div className="text-center space-y-2 sm:space-y-4 px-2">
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-blue-600 dark:text-blue-400">
            Airdrop Eligibility Checker
          </h1>
          <p className="text-sm sm:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Check your Base on-chain activity and social engagement to estimate your airdrop eligibility
          </p>
          <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              <span>On-Chain Activity</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-purple-500"></div>
              <span>Social Engagement</span>
            </div>
          </div>
        </div>

        <CheckerForm />

        <div className="text-center text-xs sm:text-sm text-gray-500 dark:text-gray-400 space-y-2 px-2">
          <p>
            This tool provides estimated eligibility scores based on on-chain and social metrics.
          </p>
          <p className="text-xs">
            Note: Actual airdrop criteria are determined by project teams and may differ from these estimates.
          </p>
        </div>
      </div>
    </div>
  );
}
