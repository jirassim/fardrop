# 🖼️ Farcaster Frame Deployment Guide

## สรุปขั้นตอนการ Deploy แบบ Frame

### 📋 สิ่งที่ต้องเตรียม

1. ✅ GitHub account
2. ✅ Vercel account (ฟรี)
3. ✅ API Keys:
   - Neynar API key (สำหรับ Farcaster data)
   - Alchemy API key (optional, สำหรับ Base blockchain data)
   - WalletConnect Project ID (optional, สำหรับ wallet connect)

---

## 🚀 ขั้นตอนการ Deploy (5 ขั้นตอน)

### ขั้นตอนที่ 1: Push Code ขึ้น GitHub

```bash
# 1. สร้าง repository ใหม่บน GitHub
# 2. ใน terminal:

git init
git add .
git commit -m "Initial commit: Airdrop Checker Frame"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main
```

### ขั้นตอนที่ 2: Deploy บน Vercel

1. ไปที่ **https://vercel.com**
2. คลิก **"Add New Project"**
3. เลือก **Import Git Repository**
4. เลือก repo ที่เพิ่ง push
5. คลิก **Deploy** (ไม่ต้องแก้ไขอะไร)

### ขั้นตอนที่ 3: ตั้งค่า Environment Variables

หลัง deploy เสร็จ:

1. ไปที่ **Project Settings → Environment Variables**
2. เพิ่มตัวแปรเหล่านี้:

```
NEXT_PUBLIC_NEYNAR_API_KEY=<your-neynar-key>
ALCHEMY_API_KEY=<your-alchemy-key>
WALLET_PRIVATE_KEY=<your-private-key>
NEXT_PUBLIC_CONTRACT_ADDRESS=0xC9395584a678cAE3dF076fA9507D3259e53BC9Eb
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=<your-project-id>
NEXT_PUBLIC_URL=https://your-app.vercel.app
```

3. คลิก **Save**
4. ไปที่ **Deployments** → คลิก latest deployment → **Redeploy**

### ขั้นตอนที่ 4: ทดสอบ Frame

เปิด browser ทดสอบ:

```
https://your-app.vercel.app        → เว็บหลัก
https://your-app.vercel.app/api/og → OG image preview
```

### ขั้นตอนที่ 5: แชร์บน Farcaster

**วิธีที่ 1: แชร์ใน Warpcast (ง่ายที่สุด)**

1. เปิด **Warpcast** app/website
2. สร้าง Cast ใหม่
3. **วาง URL**: `https://your-app.vercel.app`
4. จะเห็น **Frame Preview Card** พร้อมปุ่ม
5. **Cast** ออกไป
6. ✅ เสร็จ! คนอื่นคลิกใน Frame ได้เลย

**วิธีที่ 2: Share direct link**

แชร์ URL ตรงๆ ใน Warpcast:
```
Check your airdrop eligibility! 🎯
https://your-app.vercel.app
```

---

## 🎨 Frame จะแสดงใน Warpcast แบบนี้

```
┌─────────────────────────────────┐
│   🎯 Airdrop Checker            │
│                                 │
│   Check Your Base & Farcaster   │
│   Eligibility                   │
│                                 │
│   📊 Base Network               │
│   💬 Farcaster                  │
│   🎖️ NFT Badge                  │
│                                 │
│   [ Check Eligibility ]         │ ← ปุ่มคลิกได้
└─────────────────────────────────┘
```

เมื่อคลิกปุ่ม → เปิด Mini App เต็มหน้าจอใน Farcaster

---

## ✅ Checklist หลัง Deploy

ใช้ checklist นี้เช็คว่าทุกอย่างทำงาน:

- [ ] **Deploy สำเร็จ** - เห็น URL ของ Vercel
- [ ] **เว็บเปิดได้** - `https://your-app.vercel.app`
- [ ] **OG Image ขึ้น** - `/api/og` เห็นรูป preview
- [ ] **Environment variables ครบ** - เช็คใน Vercel Settings
- [ ] **Redeploy แล้ว** - หลังเพิ่ม env vars
- [ ] **Cast ใน Warpcast** - เห็น Frame preview
- [ ] **คลิกปุ่มได้** - เปิด app ใหม่
- [ ] **Check eligibility ได้** - กรอก address ทำงาน
- [ ] **Connect wallet ได้** - ปุ่มมุมขวาบนทำงาน
- [ ] **Mint NFT ได้** - หลัง connect wallet

---

## 🐛 แก้ปัญหาที่พบบ่อย

### ปัญหา: Frame ไม่แสดง preview ใน Warpcast

**วิธีแก้:**
1. เช็คว่า deploy สำเร็จ
2. ลอง **ลบและวาง URL ใหม่** ใน Warpcast
3. ทดสอบ `/api/og` ว่าเปิดได้
4. รอ 1-2 นาที ให้ cache clear

### ปัญหา: Environment variables ไม่โหลด

**วิธีแก้:**
1. เปิด Vercel Dashboard
2. ไปที่ Settings → Environment Variables
3. **เช็คว่าเพิ่มครบทุกตัว**
4. ต้อง **Redeploy** หลังเพิ่ม env vars

### ปัญหา: "No Alchemy API key, using fallback"

**วิธีแก้:**
- ถ้า**ไม่มี** Alchemy key → ใช้ fallback ได้ (ช้ากว่า)
- ถ้า**มี** key แต่ไม่ทำงาน → เช็คใน Vercel env vars
- ได้ key ฟรีที่: https://www.alchemy.com

### ปัญหา: Connect wallet ไม่ได้

**วิธีแก้:**
1. เช็คว่ามี **MetaMask** หรือ wallet extension
2. เช็ค **NEXT_PUBLIC_CONTRACT_ADDRESS** ตรงไหม
3. เช็ค network เป็น **Base Mainnet** (Chain ID: 8453)

---

## 📱 Viewport Settings (สำหรับ Frame)

App นี้ตั้งค่าให้พอดีหน้าจอ Farcaster แล้ว:

```javascript
{
  width: 'device-width',      // ปรับตามหน้าจอ
  initialScale: 1,            // ไม่ zoom
  maximumScale: 1,            // ห้าม zoom
  userScalable: false,        // ห้ามยืด-หด
}
```

จะทำให้:
- ✅ พอดีหน้าต่าง Farcaster Mini App
- ✅ ไม่มี scroll bar แปลกๆ
- ✅ UI responsive บน mobile/desktop

---

## 🎯 Frame Metadata ที่ใช้

```html
<meta property="fc:frame" content="vNext" />
<meta property="fc:frame:image" content="/api/og" />
<meta property="fc:frame:button:1" content="Check Eligibility" />
<meta property="fc:frame:button:1:action" content="link" />
<meta property="fc:frame:button:1:target" content="/" />
```

**คำอธิบาย:**
- `fc:frame: vNext` → ใช้ Farcaster Frame version ใหม่
- `fc:frame:image` → รูป preview (1200x630px)
- `fc:frame:button:1` → ชื่อปุ่มที่ 1
- `button:1:action: link` → คลิกแล้วเปิด link
- `button:1:target: /` → ไปที่ URL หลัก

---

## 💡 Tips

### เพิ่มปุ่มใน Frame (Optional)

แก้ไขใน `app/layout.tsx`:

```typescript
other: {
  'fc:frame': 'vNext',
  'fc:frame:image': '/api/og',
  'fc:frame:button:1': 'Check Eligibility',
  'fc:frame:button:1:action': 'link',
  'fc:frame:button:1:target': '/',
  // เพิ่มปุ่มที่ 2
  'fc:frame:button:2': 'View on Base',
  'fc:frame:button:2:action': 'link',
  'fc:frame:button:2:target': 'https://basescan.org',
}
```

### Custom Domain (Optional)

ถ้าอยากใช้ domain เอง (เช่น `airdrop.yourdomain.com`):

1. ซื้อ domain
2. ไปที่ Vercel → Settings → Domains
3. เพิ่ม domain
4. ตั้งค่า DNS ตามที่ Vercel บอก
5. อัปเดต `NEXT_PUBLIC_URL` ใน env vars
6. Redeploy

---

## 📚 Resources

**Documentation:**
- [Farcaster Frames Spec](https://docs.farcaster.xyz/developers/frames/spec)
- [Vercel Deployment](https://vercel.com/docs)
- [Next.js OG Images](https://nextjs.org/docs/app/api-reference/functions/image-response)

**Tools:**
- [Warpcast Frame Validator](https://warpcast.com/~/developers/frames)
- [OG Image Preview](https://www.opengraph.xyz/)

**Get API Keys:**
- [Neynar](https://neynar.com) - Farcaster API
- [Alchemy](https://www.alchemy.com) - Base RPC
- [WalletConnect](https://cloud.walletconnect.com) - Wallet Connect

---

## 🎉 เสร็จแล้ว!

หลัง deploy แล้ว คุณจะมี:

✅ **Farcaster Frame** - แชร์ได้ใน Warpcast
✅ **Mini App** - เปิดเต็มหน้าจอได้
✅ **Airdrop Checker** - เช็ค eligibility
✅ **NFT Badge** - mint ได้บน Base
✅ **Wallet Connect** - connect MetaMask ได้

**แชร์ใน Warpcast เลย!** 🚀

---

**Need Help?**
- Vercel Support: https://vercel.com/support
- Warpcast Developers: https://warpcast.com/~/developers
