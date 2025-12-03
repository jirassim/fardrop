/**
 * Generate Farcaster Account Association Signature
 *
 * This script helps create the signature needed to verify Mini App ownership
 *
 * Requirements:
 * - Your Farcaster FID (Farcaster ID)
 * - Your Farcaster custody address private key (or use Warpcast signing)
 *
 * Usage:
 * 1. Get your FID from Warpcast profile
 * 2. Run: node scripts/generate-account-association.js
 */

const { ethers } = require('ethers');

// Configuration
const APP_URL = 'https://airdrop-checker-8n5u5g3t4-jirasssims-projects.vercel.app';
const APP_DOMAIN = new URL(APP_URL).hostname;

/**
 * Generate account association message
 */
async function generateAccountAssociation(fid, privateKey) {
  console.log('🔐 Generating Farcaster Account Association...\n');

  // Create wallet from private key
  const wallet = new ethers.Wallet(privateKey);
  const address = await wallet.getAddress();

  console.log('📊 Details:');
  console.log(`   FID: ${fid}`);
  console.log(`   Address: ${address}`);
  console.log(`   App URL: ${APP_URL}`);
  console.log(`   Domain: ${APP_DOMAIN}\n`);

  // Create the message payload
  const timestamp = Math.floor(Date.now() / 1000);
  const payload = {
    domain: APP_DOMAIN,
    fid: parseInt(fid),
    timestamp: timestamp,
    address: address
  };

  // Encode payload as JSON
  const payloadJson = JSON.stringify(payload);
  const payloadBase64 = Buffer.from(payloadJson).toString('base64');

  console.log('📦 Payload:');
  console.log(payloadJson);
  console.log('');

  // Create the message to sign
  // Format: "Farcaster Account Association\n\n{payload}"
  const message = `Farcaster Account Association

Domain: ${APP_DOMAIN}
FID: ${fid}
Timestamp: ${timestamp}
Address: ${address}

I authorize this app to act on behalf of my Farcaster account.`;

  console.log('📝 Message to sign:');
  console.log(message);
  console.log('');

  // Sign the message
  const signature = await wallet.signMessage(message);

  console.log('✅ Signature Generated!\n');

  // Create header (metadata about the signature)
  const header = {
    t: 'account_association',
    v: '1',
    alg: 'ES256K'
  };
  const headerBase64 = Buffer.from(JSON.stringify(header)).toString('base64');

  // Display results
  console.log('═══════════════════════════════════════════');
  console.log('📋 ACCOUNT ASSOCIATION DATA');
  console.log('═══════════════════════════════════════════\n');

  console.log('1️⃣  HEADER:');
  console.log(headerBase64);
  console.log('');

  console.log('2️⃣  PAYLOAD:');
  console.log(payloadBase64);
  console.log('');

  console.log('3️⃣  SIGNATURE:');
  console.log(signature);
  console.log('');

  console.log('═══════════════════════════════════════════');
  console.log('📄 MANIFEST JSON');
  console.log('═══════════════════════════════════════════\n');

  const manifestAccountAssociation = {
    header: headerBase64,
    payload: payloadBase64,
    signature: signature
  };

  console.log(JSON.stringify(manifestAccountAssociation, null, 2));
  console.log('');

  console.log('═══════════════════════════════════════════');
  console.log('🔧 NEXT STEPS');
  console.log('═══════════════════════════════════════════\n');

  console.log('1. Add to public/.well-known/farcaster.json:');
  console.log('');
  console.log('   {');
  console.log('     "name": "Airdrop Eligibility Checker",');
  console.log('     "description": "Check your Base & Farcaster activity",');
  console.log('     "image": "https://...",');
  console.log('     "url": "https://...",');
  console.log('     "accountAssociation": {');
  console.log(`       "header": "${headerBase64}",`);
  console.log(`       "payload": "${payloadBase64}",`);
  console.log(`       "signature": "${signature}"`);
  console.log('     }');
  console.log('   }');
  console.log('');

  console.log('2. Add to Vercel environment variables:');
  console.log(`   FARCASTER_ACCOUNT_ASSOCIATION_HEADER=${headerBase64}`);
  console.log(`   FARCASTER_ACCOUNT_ASSOCIATION_PAYLOAD=${payloadBase64}`);
  console.log(`   FARCASTER_ACCOUNT_ASSOCIATION_SIGNATURE=${signature}`);
  console.log('');

  console.log('3. Deploy to Vercel:');
  console.log('   git add public/.well-known/farcaster.json');
  console.log('   git commit -m "Add account association"');
  console.log('   git push');
  console.log('');

  console.log('4. Verify:');
  console.log(`   curl ${APP_URL}/.well-known/farcaster.json`);
  console.log('');

  return {
    header: headerBase64,
    payload: payloadBase64,
    signature: signature
  };
}

// Main execution
async function main() {
  // Check for required arguments
  if (process.argv.length < 4) {
    console.log('❌ Missing arguments\n');
    console.log('Usage:');
    console.log('  node scripts/generate-account-association.js <FID> <PRIVATE_KEY>\n');
    console.log('Example:');
    console.log('  node scripts/generate-account-association.js 3621 0x1234...\n');
    console.log('📌 Get your FID from: https://warpcast.com/~/settings');
    console.log('📌 Private key: Your Farcaster custody address private key');
    console.log('');
    console.log('⚠️  WARNING: Never share your private key!');
    console.log('   This script runs locally and does not send data anywhere.');
    process.exit(1);
  }

  const fid = process.argv[2];
  const privateKey = process.argv[3];

  try {
    await generateAccountAssociation(fid, privateKey);
    console.log('✅ Account association generated successfully!\n');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { generateAccountAssociation };
