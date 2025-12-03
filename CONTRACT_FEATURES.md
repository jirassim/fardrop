# 🎖️ NFT Badge Features

## สรุปฟีเจอร์ Smart Contract ที่เพิ่มเข้ามา

### 📦 ไฟล์ที่สร้าง

#### Smart Contract
- **`contracts/AirdropBadge.sol`** - ERC721 NFT สำหรับ mint badge แสดงผล eligibility
  - ✅ Soulbound NFT (ห้ามโอน)
  - ✅ 1 address = 1 badge
  - ✅ Updatable (อัพเดทคะแนนได้)
  - ✅ On-chain metadata

#### Hardhat Configuration
- **`hardhat.config.js`** - Config สำหรับ deploy บน Base
- **`scripts/deploy.js`** - Deploy script พร้อม minimal gas settings
- **`scripts/check-balance.js`** - เช็ค wallet balance และประมาณการค่า gas

#### API Routes
- **`app/api/badge-metadata/route.ts`** - Generate NFT metadata (JSON)
- **`app/api/badge-image/route.ts`** - Generate badge image (SVG)

#### UI Components
- **`app/components/Dashboard.tsx`** - เพิ่มปุ่ม "Mint Eligibility Badge NFT"

#### Documentation
- **`DEPLOY_CONTRACT.md`** - คู่มือ deploy contract แบบละเอียด
- **`CONTRACT_FEATURES.md`** - เอกสารนี้

---

## 🔧 คุณสมบัติ Contract

### 1. Soulbound NFT
Badge ไม่สามารถโอนหรือขายได้ เพื่อ:
- ป้องกันการซื้อขาย badge
- รักษาความถูกต้องของผลคะแนน
- ประหยัด gas (ไม่ต้อง implement transfer logic)

```solidity
function _update(address to, uint256 tokenId, address auth)
    internal
    override
    returns (address)
{
    address from = _ownerOf(tokenId);

    // Allow minting but block transfers
    if (from != address(0)) {
        require(to == address(0), "Soulbound: Badge cannot be transferred");
    }

    return super._update(to, tokenId, auth);
}
```

### 2. One Badge Per Address
แต่ละ address สามารถมี badge ได้เพียง 1 อัน:

```solidity
mapping(address => uint256) public addressToTokenId;

function mintBadge(...) public onlyOwner {
    require(addressToTokenId[to] == 0, "Address already has a badge");
    // ... mint logic
}
```

### 3. Updatable Badges
เจ้าของ contract สามารถอัพเดท badge ที่มีอยู่:

```solidity
function updateBadge(
    address owner,
    uint256 newScore,
    uint256 newBasePoints,
    uint256 newFarcasterPoints,
    string memory newTier,
    string memory newTokenURI
) public onlyOwner {
    // Update badge data and metadata
}
```

### 4. On-Chain Data Storage

```solidity
struct BadgeData {
    uint256 score;
    uint256 basePoints;
    uint256 farcasterPoints;
    string tier;
    uint256 mintedAt;
}

mapping(uint256 => BadgeData) public tokenToBadgeData;
```

---

## 🎨 Badge Design

### Badge Tiers & Colors

#### High Tier (Score >= 120)
- Background: Green gradient (#10B981 → #059669)
- Icon: 🎖️
- Text: "High Tier"

#### Medium Tier (Score 60-119)
- Background: Orange gradient (#F59E0B → #D97706)
- Icon: 🎖️
- Text: "Medium Tier"

#### Low Tier (Score < 60)
- Background: Red gradient (#EF4444 → #DC2626)
- Icon: 🎖️
- Text: "Low Tier"

### Badge Components
1. **Background** - Gradient based on tier
2. **Decorative Circles** - Visual elements
3. **Badge Icon** - 🎖️ emoji in center
4. **Tier Text** - Tier name
5. **Score Box** - Shows score/200
6. **Badge Title** - "Airdrop Eligibility"
7. **Subtitle** - "Base + Farcaster"

---

## 📡 API Endpoints

### 1. Badge Metadata API
**Endpoint:** `POST /api/badge-metadata`

**Request Body:**
```json
{
  "address": "0x1234...",
  "score": 150,
  "basePoints": 85,
  "farcasterPoints": 65,
  "tier": "High"
}
```

**Response:**
```json
{
  "name": "Airdrop Eligibility Badge - High",
  "description": "Proof of airdrop eligibility for 0x1234...5678. Score: 150/200",
  "image": "https://your-domain.com/api/badge-image?tier=High&score=150",
  "attributes": [
    {"trait_type": "Tier", "value": "High"},
    {"trait_type": "Total Score", "value": 150, "max_value": 200},
    {"trait_type": "Base Points", "value": 85},
    {"trait_type": "Farcaster Points", "value": 65},
    {"trait_type": "Minted At", "value": "2024-12-03T12:00:00Z"}
  ]
}
```

### 2. Badge Image API
**Endpoint:** `GET /api/badge-image?tier=High&score=150`

**Response:** SVG image (400x500px)

---

## 💰 Gas Cost Estimates

| Operation | Estimated Cost (Base Mainnet) |
|-----------|------------------------------|
| Contract Deploy | 0.001 - 0.003 ETH (~$2-6) |
| Mint Badge | 0.0001 - 0.0003 ETH (~$0.20-0.60) |
| Update Badge | 0.00005 - 0.0002 ETH (~$0.10-0.40) |
| View Badge Data | FREE (read-only) |

> 💡 Base network มีค่า gas ถูกกว่า Ethereum ~10-50x

---

## 🚀 ขั้นตอนการใช้งาน

### สำหรับ Developer

#### 1. เตรียม Wallet
```bash
# เช็ค balance
npx hardhat run scripts/check-balance.js --network base
```

Wallet address: `0x1082b499478280eF823409191fCb2D675936a4C6`
ต้องมี ETH บน Base network (~0.003 ETH)

#### 2. Compile Contract
```bash
npx hardhat compile
```

#### 3. Deploy Contract
```bash
# Deploy บน Base Mainnet
npx hardhat run scripts/deploy.js --network base

# หรือ testnet ก่อน
npx hardhat run scripts/deploy.js --network baseSepolia
```

#### 4. Verify Contract (Optional)
```bash
npx hardhat verify --network base <CONTRACT_ADDRESS>
```

#### 5. Update .env.local
Contract address จะถูกเติมอัตโนมัติใน `.env.local`:
```bash
NEXT_PUBLIC_CONTRACT_ADDRESS=0xABCD...
```

#### 6. Restart Web App
```bash
npm run dev
```

### สำหรับ User

#### 1. เช็คคะแนน
- เปิด http://localhost:3000
- กรอก wallet address หรือ FID
- ดูผลคะแนน eligibility

#### 2. Mint Badge
- กดปุ่ม **"Mint Eligibility Badge NFT"**
- Confirm transaction ใน wallet
- รอ transaction complete
- Badge NFT จะถูก mint ไปยัง wallet

#### 3. View Badge
- เช็ค badge บน OpenSea หรือ NFT marketplace
- ดู metadata และ image
- แชร์ badge บน social media

---

## 🔒 Security Features

### Contract Security
- ✅ `onlyOwner` modifier สำหรับ mint/update
- ✅ Soulbound (ห้ามโอน)
- ✅ 1 badge per address (ป้องกัน spam)
- ✅ OpenZeppelin contracts (audited)

### Deployment Security
- ✅ Mnemonic เก็บใน `.env.local`
- ✅ `.env.local` อยู่ใน `.gitignore`
- ✅ Minimal gas settings (ประหยัดค่าใช้จ่าย)
- ✅ Read-only wallet (ไม่เก็บเงินจำนวนมาก)

---

## 🧪 Testing

### Local Testing
```bash
# Compile
npx hardhat compile

# Run tests (if you add test files)
npx hardhat test

# Check balance
npx hardhat run scripts/check-balance.js --network base
```

### Testnet Testing
1. Deploy บน Base Sepolia testnet
2. Get testnet ETH จาก faucet
3. ทดสอบ mint badge
4. เช็ค metadata และ image
5. Verify ทุกอย่างทำงานถูกต้อง

---

## 📝 TODOs

- [x] สร้าง Smart Contract (AirdropBadge.sol)
- [x] สร้าง Deployment Scripts
- [x] สร้าง Badge Metadata API
- [x] สร้าง Badge Image API (SVG)
- [x] เพิ่มปุ่ม Mint ใน UI
- [ ] Deploy contract บน Base mainnet
- [ ] Implement actual minting logic
- [ ] Connect Web3 wallet (MetaMask, WalletConnect)
- [ ] Test minting flow end-to-end
- [ ] Add loading states
- [ ] Add error handling
- [ ] Verify contract on BaseScan

---

## 📚 Resources

- [AirdropBadge Contract](./contracts/AirdropBadge.sol)
- [Deployment Guide](./DEPLOY_CONTRACT.md)
- [Base Documentation](https://docs.base.org)
- [OpenZeppelin](https://docs.openzeppelin.com/contracts)
- [Hardhat](https://hardhat.org/docs)

---

## 🎉 Summary

### ✅ สิ่งที่พร้อมใช้งาน:
1. Smart contract พร้อม deploy
2. Deployment scripts
3. Badge metadata & image APIs
4. UI with mint button
5. Complete documentation

### ⏳ สิ่งที่ต้องทำต่อ:
1. ส่ง ETH ไปยัง deployment wallet
2. Deploy contract บน Base
3. เชื่อมต่อ Web3 wallet
4. Test mint badge
5. Verify contract

**ตอนนี้พร้อม deploy แล้ว!** 🚀

เพียงส่ง ~0.003 ETH ไปที่ `0x1082b499478280eF823409191fCb2D675936a4C6` แล้วรัน:
```bash
npx hardhat run scripts/deploy.js --network base
```
