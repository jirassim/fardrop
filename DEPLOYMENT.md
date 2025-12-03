# 🚀 Deployment Guide

## Quick Deploy Checklist

- [ ] Get Neynar API key from https://neynar.com
- [ ] Push code to GitHub
- [ ] Deploy to Vercel
- [ ] Add environment variables in Vercel
- [ ] Update manifest with production URL
- [ ] Test manifest endpoint
- [ ] Submit to Farcaster

## Step-by-Step Deployment

### 1. Get API Keys

**Neynar API (Required for Farcaster data)**
1. Visit https://neynar.com
2. Sign up for free account
3. Go to Dashboard > API Keys
4. Copy your API key
5. Free tier: ~1000 requests/day

### 2. Prepare Your Code

```bash
# Ensure environment variables are NOT committed
cat .gitignore | grep -q ".env.local" && echo "✅ .env.local is gitignored" || echo "❌ Add .env.local to .gitignore"

# Test build locally
npm run build

# Initialize git if not already done
git init
git add .
git commit -m "Initial commit: Airdrop Eligibility Checker"
```

### 3. Push to GitHub

```bash
# Create new repository on GitHub first, then:
git remote add origin https://github.com/YOUR_USERNAME/airdrop-checker.git
git branch -M main
git push -u origin main
```

### 4. Deploy to Vercel

**Option A: Via Dashboard (Recommended)**

1. Go to https://vercel.com
2. Click "Add New..." > "Project"
3. Import your GitHub repository
4. Configure project:
   - Framework Preset: Next.js
   - Root Directory: `./airdrop-checker` (if nested) or `.` (if root)
   - Build Command: `npm run build`
   - Output Directory: `.next`

5. **Add Environment Variables:**
   ```
   NEXT_PUBLIC_NEYNAR_API_KEY=your_actual_key_here
   ```

6. Click "Deploy"
7. Wait for deployment (usually 2-3 minutes)
8. Copy your deployment URL (e.g., `https://airdrop-checker-xyz.vercel.app`)

**Option B: Via CLI**

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Add environment variable
vercel env add NEXT_PUBLIC_NEYNAR_API_KEY

# Deploy to production
vercel --prod
```

### 5. Update Farcaster Manifest

After deployment, update the manifest with your production URL:

```bash
# Edit public/.well-known/farcaster.json
{
  "name": "Airdrop Eligibility Checker",
  "description": "Check your Base & Farcaster activity for airdrop eligibility",
  "image": "https://YOUR-VERCEL-URL.vercel.app/og-image.png",
  "url": "https://YOUR-VERCEL-URL.vercel.app"
}
```

Then redeploy:
```bash
git add .
git commit -m "Update manifest with production URL"
git push
# Vercel will auto-deploy
```

### 6. Verify Deployment

Test these endpoints:

```bash
# Main page
curl https://your-url.vercel.app

# Manifest
curl https://your-url.vercel.app/.well-known/farcaster.json

# API health
curl -X POST https://your-url.vercel.app/api/check-eligibility \
  -H "Content-Type: application/json" \
  -d '{"input":"3621","type":"fid"}'
```

### 7. Submit to Farcaster

1. Visit https://farcaster.xyz/miniapps
2. Sign in with Farcaster account
3. Click "Submit App"
4. Enter your Vercel URL
5. Farcaster will verify:
   - ✅ Manifest is accessible
   - ✅ URL is valid
   - ✅ App responds correctly
6. Wait for approval (usually instant if valid)

### 8. Test Your Mini App

1. Open Base App or Farcaster
2. Search for "Airdrop Eligibility Checker"
3. Test with:
   - Wallet address: `0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb`
   - FID: `3621`

## Common Deployment Issues

### Issue: Build fails on Vercel

**Solution:**
```bash
# Test build locally first
npm run build

# Check for TypeScript errors
npm run build 2>&1 | grep "error"

# Fix any errors and redeploy
```

### Issue: Environment variables not working

**Solution:**
1. Go to Vercel Dashboard > Project > Settings > Environment Variables
2. Add `NEXT_PUBLIC_NEYNAR_API_KEY`
3. Select "Production", "Preview", and "Development"
4. Click "Save"
5. Redeploy: Dashboard > Deployments > Click latest > "Redeploy"

### Issue: Manifest returns 404

**Solution:**
```bash
# Verify file exists locally
ls -la public/.well-known/farcaster.json

# If missing, create it
mkdir -p public/.well-known
echo '{
  "name": "Airdrop Eligibility Checker",
  "url": "https://your-url.vercel.app"
}' > public/.well-known/farcaster.json

# Commit and push
git add public/.well-known/farcaster.json
git commit -m "Add Farcaster manifest"
git push
```

### Issue: API returns errors

**Possible causes:**
1. Invalid Neynar API key
   - Verify key in Vercel settings
   - Test key with curl: `curl -H "api_key: YOUR_KEY" https://api.neynar.com/v2/farcaster/user/bulk?fids=3621`

2. Rate limiting
   - Neynar free tier: 1000 req/day
   - Upgrade plan if needed

3. CORS issues
   - API routes are server-side, no CORS needed
   - If using client-side calls, add CORS headers

## Performance Optimization

### Enable Caching

Add to `next.config.js`:
```javascript
module.exports = {
  async headers() {
    return [
      {
        source: '/api/check-eligibility',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=60, stale-while-revalidate=120',
          },
        ],
      },
    ];
  },
};
```

### Monitor Usage

Check Vercel Dashboard:
- Analytics > Overview
- Monitor API response times
- Track error rates

## Production Checklist

- [ ] Environment variables set in Vercel
- [ ] Manifest URL updated with production domain
- [ ] API endpoints tested
- [ ] Error handling verified
- [ ] Rate limiting considered
- [ ] Analytics enabled (Vercel Analytics)
- [ ] App submitted to Farcaster
- [ ] Tested in Base App/Farcaster
- [ ] README updated with live URL
- [ ] Monitoring setup (optional)

## Updating Your App

```bash
# Make changes locally
# Test: npm run dev

# Commit changes
git add .
git commit -m "Description of changes"
git push

# Vercel auto-deploys from main branch
# Check deployment status in Vercel Dashboard
```

## Rollback Deployment

If something goes wrong:

1. Go to Vercel Dashboard > Deployments
2. Find previous working deployment
3. Click three dots > "Promote to Production"

Or via CLI:
```bash
vercel rollback
```

## Support

- Vercel Issues: https://vercel.com/support
- Farcaster Developer: https://warpcast.com/~/developers
- Base Documentation: https://docs.base.org

---

**Security Reminders:**
- ✅ Never commit `.env.local`
- ✅ Use environment variables for all secrets
- ✅ Regularly rotate API keys
- ✅ Monitor for unusual API usage
- ✅ Keep dependencies updated

Good luck with your deployment! 🚀
