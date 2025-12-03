# 🎯 Farcaster Mini App Official Verification Guide

## สำหรับ Base & Farcaster Airdrop Eligibility

App นี้สร้างขึ้นเพื่อลุ้น Airdrop จาก Base และ Farcaster โดยต้อง verify อย่างเป็นทางการให้ทีมพัฒนาเห็น

---

## 📋 ข้อมูล Mini App

- **ชื่อ**: Airdrop Eligibility Checker
- **URL**: https://airdrop-checker-8n5u5g3t4-jirasssims-projects.vercel.app
- **Manifest**: https://airdrop-checker-8n5u5g3t4-jirasssims-projects.vercel.app/.well-known/farcaster.json
- **Contract**: 0xC9395584a678cAE3dF076fA9507D3259e53BC9Eb (Base Mainnet)
- **Framework**: Next.js 16 + RainbowKit + wagmi
- **Blockchain**: Base Mainnet (Chain ID: 8453)

---

## ✅ Checklist สำหรับ Official Verification

### 1. Prerequisites (ต้องมีก่อน verify)

- [ ] **Farcaster Account** - มี FID และ username
- [ ] **Wallet ที่เชื่อมกับ Farcaster** - ผ่าน Base App หรือ Warpcast
- [ ] **Domain ที่ deploy แล้ว** - Vercel production URL
- [ ] **Manifest endpoint เข้าถึงได้** - ไม่มี authentication protection
- [ ] **Smart Contract deployed** - บน Base Mainnet

### 2. Technical Requirements

- [x] **Manifest file** - `public/.well-known/farcaster.json`
- [x] **Frame metadata** - OpenGraph tags ใน `app/layout.tsx`
- [x] **OG Image API** - Dynamic preview image
- [x] **Responsive design** - Mobile + Desktop
- [x] **Wallet connection** - RainbowKit integration
- [x] **On-chain functionality** - NFT minting capability

---

## 🔐 Official Verification Process

### Step 1: ปิด Deployment Protection

**สำคัญมาก!** Farcaster ต้องอ่าน manifest ได้โดยไม่ต้อง auth

1. ไปที่: https://vercel.com/jirasssims-projects/airdrop-checker/settings/deployment-protection
2. เปลี่ยน **"Standard Protection"** → **"Only Preview Deployments"**
3. กด **Save**

**ทดสอบ:**
```bash
curl https://airdrop-checker-8n5u5g3t4-jirasssims-projects.vercel.app/.well-known/farcaster.json
```

ต้องได้ JSON กลับมา ไม่ใช่ "Authentication Required"

---

### Step 2: Generate Account Association (Official Ownership)

**จุดประสงค์**: พิสูจน์ว่าคุณเป็นเจ้าของ app และ link กับ Farcaster account

#### 2.1 ผ่าน Warpcast (แนะนำ)

1. เปิด **Warpcast** (https://warpcast.com)
2. ไปที่ **Settings** → **Advanced** → **Signed Key Requests**
3. คลิก **"Create new signed key request"**
4. เลือก scope: **"App verification"**
5. กรอก **App URL**: `https://airdrop-checker-8n5u5g3t4-jirasssims-projects.vercel.app`
6. กด **Sign** ด้วย wallet ของคุณ
7. คัดลอก **signature data**:
   - `header` (base64 encoded)
   - `payload` (JSON encoded)
   - `signature` (hex string)

#### 2.2 ผ่าน Farcaster API (Manual)

ถ้า Warpcast ไม่ได้:

```bash
# Install Farcaster Hub
npm install -g @farcaster/hub-nodejs

# Generate signature
farcaster-cli account-association create \
  --fid YOUR_FID \
  --app-url https://airdrop-checker-8n5u5g3t4-jirasssims-projects.vercel.app \
  --private-key YOUR_FARCASTER_PRIVATE_KEY
```

#### 2.3 บันทึก Signature

เก็บ signature ไว้ใน `.env.local`:

```env
FARCASTER_ACCOUNT_ASSOCIATION_HEADER=<header>
FARCASTER_ACCOUNT_ASSOCIATION_PAYLOAD=<payload>
FARCASTER_ACCOUNT_ASSOCIATION_SIGNATURE=<signature>
```

---

### Step 3: Update Manifest with Account Association

เพิ่ม account association ใน manifest:

**ก่อน:**
```json
{
  "name": "Airdrop Eligibility Checker",
  "description": "Check your Base & Farcaster activity for airdrop eligibility",
  "image": "https://airdrop-checker-8n5u5g3t4-jirasssims-projects.vercel.app/og-image.png",
  "url": "https://airdrop-checker-8n5u5g3t4-jirasssims-projects.vercel.app"
}
```

**หลัง:**
```json
{
  "name": "Airdrop Eligibility Checker",
  "description": "Check your Base & Farcaster activity for airdrop eligibility",
  "image": "https://airdrop-checker-8n5u5g3t4-jirasssims-projects.vercel.app/og-image.png",
  "url": "https://airdrop-checker-8n5u5g3t4-jirasssims-projects.vercel.app",
  "accountAssociation": {
    "header": "<your_header>",
    "payload": "<your_payload>",
    "signature": "<your_signature>"
  }
}
```

**Deploy:**
```bash
git add public/.well-known/farcaster.json
git commit -m "Add Farcaster account association for verification"
git push
```

---

### Step 4: Submit to Farcaster Mini Apps Directory

#### 4.1 เข้าสู่ Farcaster Developer Portal

1. **เปิด**: https://farcaster.xyz/miniapps
2. **Sign in** ด้วย Warpcast account
3. คลิก **"Submit App"** หรือ **"+"**

#### 4.2 กรอกข้อมูล

- **App URL**: `https://airdrop-checker-8n5u5g3t4-jirasssims-projects.vercel.app`
- **Name**: `Airdrop Eligibility Checker`
- **Category**: `Finance` หรือ `Utility`
- **Short Description**: `Check Base & Farcaster airdrop eligibility`
- **Full Description**:
  ```
  🎯 Airdrop Eligibility Checker

  A comprehensive tool to check your eligibility for Base and Farcaster airdrops
  by analyzing your on-chain activity and engagement.

  Features:
  • Base Network transaction analysis
  • Farcaster engagement tracking (casts, reactions, followers)
  • NFT ownership verification
  • Eligibility scoring system
  • Claim NFT badge on-chain

  Built on:
  • Next.js 16 with App Router
  • RainbowKit + wagmi for wallet connection
  • Base Mainnet smart contract
  • Neynar API for Farcaster data
  • Alchemy API for blockchain data

  Contract: 0xC9395584a678cAE3dF076fA9507D3259e53BC9Eb (Base)
  ```

#### 4.3 รอ Automatic Verification

Farcaster จะเช็คอัตโนมัติ:

- ✅ **Manifest accessible** - ไม่มี 404 หรือ auth
- ✅ **Valid JSON** - structure ถูกต้อง
- ✅ **Required fields** - name, description, image, url ครบ
- ✅ **Account association** - signature valid
- ✅ **Domain ownership** - verified ผ่าน DNS/SSL

**สถานะ:**
- ✅ **Approved** - ใช้งานได้ทันที (ส่วนใหญ่ instant)
- ⏳ **Under Review** - รอทีมดู (1-3 วัน)
- ❌ **Rejected** - แก้ไขตามข้อเสนอแนะ

---

### Step 5: Verify on Base.dev Console

**จุดประสงค์**: ให้ Base team เห็นและติดตาม app

#### 5.1 เปิด Base Developer Console

https://www.base.dev/preview

#### 5.2 Connect Wallet

1. คลิก **"Connect Wallet"**
2. เลือก **wallet ที่เชื่อมกับ Farcaster account**
3. ยืนยันการเชื่อมต่อ

#### 5.3 Verify Mini App Ownership

1. ค้นหา app ของคุณ (ถ้ามีใน list) หรือคลิก **"Add Mini App"**
2. กรอก **App URL**: `https://airdrop-checker-8n5u5g3t4-jirasssims-projects.vercel.app`
3. คลิก **"Verify Ownership"**
4. **Sign message** ที่ popup ขึ้นมา (ด้วย wallet)
5. รอ verification complete

**สถานะที่จะเห็น:**
- ✅ **Account associated** - wallet match กับ Farcaster
- ✅ **Domain matches** - URL ตรงกับ manifest
- ✅ **Signature verified** - account association valid

**หมายเหตุ**: ตาม Discord discussions, อาจมี signature mismatch bug ระหว่าง Farcaster และ Base.dev แต่ Base กำลังแก้ไข **ถ้า Farcaster บอก verified = ใช้งานได้**

---

### Step 6: Post Official Announcement on Farcaster

**จุดประสงค์**: ให้ทีม Base และ Farcaster เห็นผลงานและ engagement

#### 6.1 สร้าง Launch Post บน Warpcast

```
🚀 Launching: Airdrop Eligibility Checker

A mini app to check your Base & Farcaster activity for airdrop eligibility!

✨ Features:
• Base network transaction analysis
• Farcaster engagement tracking
• NFT badge on-chain reward
• Real-time eligibility scoring

Built with Next.js + RainbowKit on Base Mainnet 🔵

Try it now:
https://airdrop-checker-8n5u5g3t4-jirasssims-projects.vercel.app

Contract: 0xC9395584a678cAE3dF076fA9507D3259e53BC9Eb

#Base #Farcaster #MiniApps #Airdrop
```

#### 6.2 Tag Relevant Accounts

- `@base` - Official Base account
- `@farcaster` - Official Farcaster account
- `@coinbase` - Coinbase (parent company)
- `@jessepollak` - Base lead (Jesse Pollak)
- `@dwr.eth` - Farcaster creator (Dan Romero)

#### 6.3 Post Updates และ Engage

- โพสต์ screenshots ของ features
- แชร์ metrics (users, transactions, mints)
- ตอบคำถาม community
- Post technical updates

---

## 📊 Metrics สำหรับติดตาม Airdrop Eligibility

### On-Chain Metrics (Base)

- **Smart Contract Interactions**:
  - Total mints: ดูที่ Basescan
  - Unique wallets: count addresses
  - Total transactions: contract calls

- **Contract Verification**:
  - Verify บน Basescan: https://basescan.org/address/0xC9395584a678cAE3dF076fA9507D3259e53BC9Eb#code

```bash
# Verify contract on Basescan
npx hardhat verify --network base 0xC9395584a678cAE3dF076fA9507D3259e53BC9Eb
```

### Off-Chain Metrics (Farcaster & Web)

- **Farcaster Engagement**:
  - Casts mentioning app
  - Unique users interacting
  - Recasts and likes
  - Comments and discussions

- **Web Analytics** (Vercel):
  - Page views
  - Unique visitors
  - API calls
  - Conversion rate (visits → mints)

---

## 🎁 วิธีเพิ่มโอกาส Airdrop

### 1. Build in Public

- Post development updates บน Farcaster
- Share technical challenges และวิธีแก้
- แสดง code snippets
- Open source บน GitHub

### 2. Community Engagement

- ตอบคำถามใน `/base` channel
- ช่วยเหลือ developers คนอื่น
- แชร์ knowledge และ best practices
- Participate in Base ecosystem events

### 3. Technical Excellence

- Clean, well-documented code
- Security best practices
- Gas optimization
- Good UX/UI design
- Mobile responsive

### 4. Usage & Adoption

- Encourage users ใช้ app
- Track และ share metrics
- Fix bugs promptly
- Add features based on feedback

### 5. Official Recognition

- Featured in Base blog
- Mentioned in Farcaster updates
- Win hackathons/grants
- Community showcase

---

## 📞 Official Channels สำหรับ Visibility

### Base

- **Website**: https://base.org
- **Developer Portal**: https://docs.base.org
- **Twitter**: @BuildOnBase
- **Warpcast**: /base channel
- **Discord**: https://discord.gg/buildonbase
- **GitHub**: https://github.com/base-org

### Farcaster

- **Website**: https://www.farcaster.xyz
- **Developer Docs**: https://docs.farcaster.xyz
- **Warpcast**: https://warpcast.com
- **Mini Apps**: https://farcaster.xyz/miniapps
- **GitHub**: https://github.com/farcasterxyz

### การ Submit Official

- **Base Ecosystem Page**: https://base.org/ecosystem
- **Base Grants**: https://base.org/grants
- **Farcaster Showcase**: Post in /farcaster-dev channel

---

## ✅ Final Verification Checklist

### Technical

- [ ] Manifest accessible without auth
- [ ] Account association added and valid
- [ ] App submitted to Farcaster directory
- [ ] Verified on Base.dev console
- [ ] Contract verified on Basescan
- [ ] No console errors
- [ ] Mobile responsive
- [ ] Fast load times (<3s)

### Marketing & Community

- [ ] Launch post บน Warpcast
- [ ] Tagged official accounts
- [ ] Posted in relevant channels (/base, /farcaster-dev)
- [ ] Engaged with early users
- [ ] Shared metrics และ updates
- [ ] Added to personal portfolio
- [ ] Listed on Base ecosystem page
- [ ] Applied for grants (if applicable)

### Monitoring

- [ ] Analytics setup (Vercel + custom)
- [ ] Error tracking (Sentry หรือ similar)
- [ ] On-chain monitoring (Basescan alerts)
- [ ] Community feedback tracking
- [ ] Regular updates posted

---

## 🚀 Next Steps After Verification

1. **Monitor Performance**
   - Check Vercel analytics daily
   - Track on-chain transactions
   - Monitor Farcaster mentions

2. **Iterate Based on Feedback**
   - Fix bugs immediately
   - Add requested features
   - Improve UX continuously

3. **Scale & Optimize**
   - Add caching for API calls
   - Optimize gas usage
   - Improve loading speed
   - Add more eligibility criteria

4. **Community Building**
   - Create /airdrop-checker channel
   - Host AMAs
   - Share tips และ insights
   - Build a user base

5. **Official Recognition**
   - Apply for Base grants
   - Submit to hackathons
   - Request featured placement
   - Collaborate with other builders

---

## 📚 Resources

**Documentation:**
- [Farcaster Mini Apps Spec](https://docs.farcaster.xyz/developers/frames/spec)
- [Base Developer Docs](https://docs.base.org)
- [Account Association Guide](https://docs.farcaster.xyz/developers/accounts/verification)

**Tools:**
- [Warpcast Frame Validator](https://warpcast.com/~/developers/frames)
- [Farcaster Hub](https://docs.farcaster.xyz/reference/hubble/hubble)
- [Base Faucet](https://faucet.base.org) (testnet)
- [Basescan](https://basescan.org)

**Communities:**
- [Farcaster Discord](https://discord.gg/farcaster)
- [Base Discord](https://discord.gg/buildonbase)
- [/base on Warpcast](https://warpcast.com/~/channel/base)
- [/farcaster-dev on Warpcast](https://warpcast.com/~/channel/farcaster-dev)

---

## ⚠️ Important Notes

1. **Airdrop ไม่รับประกัน**: การ verify app ไม่ได้รับประกันว่าจะได้ airdrop แต่เพิ่มโอกาสถ้ามี

2. **Activity > Verification**: Base และ Farcaster มักดูที่ on-chain activity และ community engagement มากกว่าแค่การมี app

3. **Build for Value**: Focus ที่การสร้าง value จริงๆ ให้ users ไม่ใช่แค่เพื่อ airdrop

4. **Long-term Commitment**: Teams มักให้รางวัลกับ builders ที่ commit long-term ไม่ใช่ quick cash grab

5. **Security First**: ตรวจสอบ security ให้ดี อย่าให้มี vulnerabilities ที่จะทำร้าย users

---

## 🎯 Success Criteria

App ของคุณจะถูกมองเห็นโดย Base/Farcaster teams ถ้า:

✅ **Technical Quality**
- Clean code, good architecture
- No security issues
- Fast performance
- Great UX

✅ **Real Usage**
- Active users (>100 unique wallets)
- On-chain transactions (>50 mints)
- Community engagement (>20 casts)

✅ **Community Impact**
- Solves real problem
- Positive feedback
- Helps ecosystem grow
- Educational value

✅ **Visibility**
- Posted in official channels
- Mentioned by community members
- Featured in showcases
- Documented publicly

---

**Good luck! 🚀**

หลังจาก verify เสร็จ อย่าลืม:
1. Keep building และ improving
2. Engage กับ community
3. Share progress regularly
4. Help other builders

The best way to get airdrop = **be a valuable member of the ecosystem** 💙
