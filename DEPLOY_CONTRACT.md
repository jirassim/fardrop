# 🚀 วิธี Deploy Smart Contract บน Base Network

## 📋 เตรียมพร้อม

### 1. ข้อมูล Wallet
Smart contract จะถูก deploy ด้วย wallet address:
```
0x1082b499478280eF823409191fCb2D675936a4C6
```

Mnemonic phrase ถูกเก็บไว้ใน `.env.local` แล้ว (ห้ามแชร์!)

### 2. ตรวจสอบ Balance

ก่อน deploy ต้องมี ETH บน Base network เพื่อจ่ายค่า gas:

```bash
npx hardhat run scripts/check-balance.js --network base
```

**ต้องการ ETH ประมาณ:** 0.001 - 0.003 ETH (~$2-6 USD)

### 3. ช่องทางรับ ETH บน Base

**ตัวเลือก 1: Bridge จาก Ethereum**
- ไปที่: https://bridge.base.org
- เชื่อมต่อ wallet
- Bridge ETH จาก Ethereum → Base

**ตัวเลือก 2: ซื้อตรงบน Base**
- ผ่าน Coinbase
- ผ่าน DEX บน Base (Uniswap, etc.)

**ตัวเลือก 3: Send จาก Exchange**
- บางแลกเปลี่ยนรองรับ Base network
- ใช้ address: `0x1082b499478280eF823409191fCb2D675936a4C6`
- เลือก network: **Base** (ไม่ใช่ Ethereum!)

---

## 🛠️ ขั้นตอน Deploy

### ขั้นที่ 1: Compile Contract

```bash
npx hardhat compile
```

**ผลลัพธ์ที่ต้องการ:**
```
Compiled 20 Solidity files successfully
```

### ขั้นที่ 2: เช็ค Gas Price (Optional)

```bash
npx hardhat run scripts/check-balance.js --network base
```

Script นี้จะแสดง:
- Balance ปัจจุบัน
- Gas price ล่าสุด
- ประมาณการค่า deploy

### ขั้นที่ 3: Deploy Contract

**Deploy บน Base Mainnet:**
```bash
npx hardhat run scripts/deploy.js --network base
```

**หรือ Deploy บน Base Sepolia Testnet (ทดสอบก่อน):**
```bash
npx hardhat run scripts/deploy.js --network baseSepolia
```

> 💡 **แนะนำ:** ทดสอบบน testnet ก่อนเสมอ!

### ขั้นที่ 4: รอ Deployment เสร็จ

Script จะแสดง:
1. Account address ที่ใช้ deploy
2. Balance ก่อน deploy
3. Gas ที่ใช้
4. **Contract address** (เก็บไว้!)
5. Transaction hash

**ตัวอย่าง Output:**
```
🚀 Deploying AirdropBadge contract to Base network...
📝 Deploying with account: 0x1082b499478280eF823409191fCb2D675936a4C6
💰 Account balance: 0.005 ETH

⏳ Deploying contract...
⛽ Estimated gas: 2841952
💵 Gas price: 0.001 gwei
💸 Estimated deployment cost: 0.002841952 ETH

✅ AirdropBadge deployed to: 0xABCDEF1234567890...
📄 Deployment info saved to: deployment-info.json
📝 Updated .env.local with contract address

🎉 Deployment complete!
```

### ขั้นที่ 5: Verify Contract (Optional แต่แนะนำ)

```bash
npx hardhat verify --network base <CONTRACT_ADDRESS>
```

เช่น:
```bash
npx hardhat verify --network base 0xABCDEF1234567890ABCDEF1234567890ABCDEF12
```

---

## 📝 หลัง Deploy

### 1. เช็คว่า Contract ทำงาน

ไปที่ BaseScan:
```
https://basescan.org/address/<YOUR_CONTRACT_ADDRESS>
```

ควรเห็น:
- ✅ Contract creation transaction
- ✅ Contract code (ถ้า verify แล้ว)
- ✅ ABI

### 2. อัพเดทเว็บแอป

Contract address ถูกบันทึกใน:
- `.env.local` → ตัวแปร `NEXT_PUBLIC_CONTRACT_ADDRESS`
- `deployment-info.json` → ข้อมูลทั้งหมด

**Restart dev server:**
```bash
npm run dev
```

### 3. ทดสอบ Mint Badge

1. เปิด http://localhost:3000
2. เช็คผลคะแนน
3. กดปุ่ม **"Mint Eligibility Badge NFT"**
4. ติดตาม transaction บน BaseScan

---

## 🔧 Config Files

### hardhat.config.js

```javascript
networks: {
  base: {
    url: "https://mainnet.base.org",
    accounts: {
      mnemonic: process.env.WALLET_MNEMONIC,
    },
    gasPrice: 1000000000, // 1 gwei - ต่ำสุด
    chainId: 8453,
  },
}
```

### .env.local

```bash
WALLET_MNEMONIC=fabric genre clump rhythm science pause metal submit vehicle coffee reduce catalog rapid cheap rhythm fence move error hazard alarm trust wasp salute glow

NEXT_PUBLIC_CONTRACT_ADDRESS=<จะถูกเติมหลัง deploy>
```

---

## ⚠️ ข้อควรระวัง

### Security
- ✅ `.env.local` อยู่ใน `.gitignore` แล้ว
- ❌ **ห้าม** commit private keys หรือ mnemonic ขึ้น git
- ❌ **ห้าม** แชร์ mnemonic ให้ใคร
- ✅ Wallet นี้ใช้สำหรับ deploy เท่านั้น (ไม่ควรเก็บเงินจำนวนมาก)

### Gas Optimization
Contract ถูกออกแบบให้:
- ✅ ใช้ gas ต่ำสุด (optimizer enabled)
- ✅ Soulbound NFT (ห้ามโอน = ประหยัด gas)
- ✅ 1 address = 1 badge เท่านั้น

### Contract Features
- **Soulbound**: Badge ไม่สามารถโอนได้ (ป้องกันการขาย/ซื้อ)
- **One per address**: แต่ละ address mint ได้แค่ 1 badge
- **Updatable**: เจ้าของ contract สามารถอัพเดท badge ที่มีอยู่ได้
- **Metadata on-chain**: เก็บคะแนนและ tier ใน contract

---

## 🆘 Troubleshooting

### Problem: "Account has no ETH"
**Solution:** ส่ง ETH ไปที่ wallet address ก่อน (ดูขั้นตอนด้านบน)

### Problem: "Gas price too high"
**Solution:**
- รอให้ gas ต่ำลง (เช็คที่ https://basescan.org/gastracker)
- หรือปรับ `gasPrice` ใน `hardhat.config.js`

### Problem: "Nonce too low/high"
**Solution:**
```bash
npx hardhat clean
npx hardhat compile
```
แล้ว deploy ใหม่

### Problem: "Contract verification failed"
**Solution:**
- เช็คว่า Solidity version ตรง (0.8.20)
- เช็คว่า constructor arguments ถูกต้อง
- ใช้ `--constructor-args` ถ้าจำเป็น

---

## 📊 ค่าใช้จ่ายประมาณการ

| รายการ | ประมาณการ (Base Mainnet) |
|--------|---------------------------|
| Contract Deploy | 0.001 - 0.003 ETH (~$2-6) |
| Mint Badge | 0.0001 - 0.0003 ETH (~$0.20-0.60) |
| Update Badge | 0.00005 - 0.0002 ETH (~$0.10-0.40) |

> 💡 Base มีค่า gas ถูกกว่า Ethereum มาก (~10-50x ถูกกว่า)

---

## 📚 อ้างอิง

- [Base Documentation](https://docs.base.org)
- [Hardhat Documentation](https://hardhat.org/docs)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts)
- [BaseScan](https://basescan.org)

---

**สำเร็จแล้ว?** ✅
Contract address ของคุณ: `_________________`

อย่าลืม verify contract และทดสอบ mint badge! 🎖️
