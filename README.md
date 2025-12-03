# 🎯 Airdrop Eligibility Checker

A Farcaster Mini App that checks airdrop eligibility by combining on-chain activity from Base network with Farcaster social metrics.

## 🌟 Features

- **Base Network Analysis**: Transaction count, active days, account age
- **Farcaster Metrics**: Posts, followers, account age, Power Badge
- **Intelligent Scoring**: Combined algorithm for eligibility estimation
- **Beautiful UI**: Dark/light mode support, responsive design
- **Share Results**: Easy sharing on Farcaster

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- Neynar API key (get free at [neynar.com](https://neynar.com))
- Alchemy API key (get free at [alchemy.com](https://www.alchemy.com)) - **Recommended for accurate data**
- Vercel account for deployment

### Installation

1. Clone the repository:
```bash
cd airdrop-checker
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` and add your API keys:
```
NEXT_PUBLIC_NEYNAR_API_KEY=your_actual_neynar_key
ALCHEMY_API_KEY=your_actual_alchemy_key
```

> 💡 **Tip**: Without Alchemy API key, the app will use fallback RPC which provides estimated data. See [ALCHEMY_SETUP.md](./ALCHEMY_SETUP.md) for setup instructions.

4. Run development server:
```bash
npm run dev
```

Visit `http://localhost:3000` to see the app.

## 📦 Deployment to Vercel

### Option 1: Deploy via Vercel Dashboard

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "Import Project"
4. Select your repository
5. Add environment variables:
   - `NEXT_PUBLIC_NEYNAR_API_KEY`
   - `ALCHEMY_API_KEY` (recommended)
6. Click "Deploy"

### Option 2: Deploy via CLI

```bash
npm install -g vercel
vercel login
vercel
```

Follow the prompts and add environment variables when asked.

## 🔧 Farcaster Integration

### 1. Update Manifest

After deployment, update `/public/.well-known/farcaster.json` with your actual Vercel URL:

```json
{
  "name": "Airdrop Eligibility Checker",
  "description": "Check your Base & Farcaster activity for airdrop eligibility",
  "image": "https://your-actual-url.vercel.app/og-image.png",
  "url": "https://your-actual-url.vercel.app"
}
```

### 2. Verify Manifest

Test your manifest at: `https://your-url.vercel.app/.well-known/farcaster.json`

### 3. Submit to Farcaster

1. Visit [farcaster.xyz/miniapps](https://farcaster.xyz/miniapps)
2. Click "Submit App"
3. Enter your URL
4. Complete verification

## 📊 Scoring Algorithm

### Base Network (Max 100 points)
- **Transactions** (40 pts): 100+ txs = 40pts, 50+ = 30pts, 20+ = 20pts
- **Active Days** (40 pts): 90+ days = 40pts, 60+ = 30pts, 30+ = 20pts
- **Early Adopter** (20 pts): 180+ days = 20pts, 90+ = 15pts

### Farcaster (Max 100 points)
- **Casts** (30 pts): 200+ = 30pts, 100+ = 25pts, 50+ = 20pts
- **Followers** (25 pts): 1000+ = 25pts, 500+ = 20pts
- **Account Age** (25 pts): 180+ days = 25pts, 90+ = 20pts
- **Power Badge** (20 pts): Yes = 20pts

### Eligibility Levels
- **High**: 120+ points
- **Medium**: 60-119 points
- **Low**: 0-59 points

## 🔒 Security

- ✅ API keys stored in environment variables
- ✅ `.env.local` excluded from git via `.gitignore`
- ✅ No private keys in frontend code
- ✅ No wallet connections required
- ✅ Read-only blockchain queries

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS
- **APIs**:
  - Neynar (Farcaster data)
  - Alchemy (Base on-chain data - recommended)
  - Base RPC (fallback for on-chain data)
- **Deployment**: Vercel

## 📱 Usage Examples

### Check by Wallet Address
```
Input: 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
Output: Base network activity + estimated score
```

### Check by Farcaster FID
```
Input: 3621
Output: Farcaster metrics + estimated score
```

## 🐛 Troubleshooting

### API Key Issues
- Ensure your Neynar API key is valid
- Check environment variables are set in Vercel
- Redeploy after adding env vars

### Manifest Not Found
- Verify file exists at `/public/.well-known/farcaster.json`
- Check Vercel deployment logs
- Clear browser cache

### Rate Limiting
- Neynar free tier: ~1000 requests/day
- Alchemy free tier: 300M compute units/month (~100k+ requests)
- Base RPC fallback is rate-limited on public endpoint
- Consider upgrading API plans for production

### Data Accuracy
- **With Alchemy API**: Real transaction data, accurate dates, fast (~1-3 seconds)
- **Without Alchemy API**: Estimated data with "Estimated" badge, less accurate
- See [ALCHEMY_SETUP.md](./ALCHEMY_SETUP.md) for setup instructions

## 📝 Development Notes

This app uses:
- Server-side API routes for data fetching
- Client-side components for interactivity
- Edge-optimized deployment on Vercel
- No sensitive operations (read-only)

## 🔗 Useful Links

- [Base Documentation](https://docs.base.org)
- [Neynar API Docs](https://docs.neynar.com)
- [Farcaster Mini Apps](https://docs.farcaster.xyz/developers/frames/v2/miniapps)
- [Vercel Deployment](https://vercel.com/docs)

## ⚠️ Disclaimer

This tool provides estimated eligibility scores based on public data. Actual airdrop criteria are determined by individual projects and may differ significantly. Use for informational purposes only.

## 📄 License

MIT License - feel free to use and modify for your projects.

---

Built with ❤️ for the Base and Farcaster communities
