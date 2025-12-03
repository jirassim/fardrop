const hre = require("hardhat");

async function main() {
  console.log("💰 Checking wallet balance on Base network...\n");

  // Get the deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log("📝 Wallet address:", deployer.address);

  // Check balance
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  const balanceInEth = hre.ethers.formatEther(balance);

  console.log("💵 Balance:", balanceInEth, "ETH");

  if (balance === 0n) {
    console.log("\n❌ Warning: Wallet has no ETH!");
    console.log("💡 You need ETH on Base network to deploy the contract.");
    console.log("📍 Send some ETH to:", deployer.address);
    console.log("\n🔗 Helpful links:");
    console.log("   - Bridge to Base: https://bridge.base.org");
    console.log("   - Buy on Base: https://base.org/ecosystem");
  } else {
    console.log("\n✅ Wallet has sufficient balance for deployment");

    // Estimate deployment cost
    try {
      const AirdropBadge = await hre.ethers.getContractFactory("AirdropBadge");
      const deployTransaction = AirdropBadge.getDeployTransaction();
      const estimatedGas = await hre.ethers.provider.estimateGas(deployTransaction);
      const feeData = await hre.ethers.provider.getFeeData();
      const gasPrice = feeData.gasPrice || 1000000000n; // 1 gwei fallback

      const estimatedCost = estimatedGas * gasPrice;
      const estimatedCostInEth = hre.ethers.formatEther(estimatedCost);

      console.log("\n⛽ Deployment estimates:");
      console.log("   Gas required:", estimatedGas.toString());
      console.log("   Gas price:", hre.ethers.formatUnits(gasPrice, "gwei"), "gwei");
      console.log("   Estimated cost:", estimatedCostInEth, "ETH");

      if (balance > estimatedCost * 2n) {
        console.log("\n🎉 Ready to deploy! Run: npx hardhat run scripts/deploy.js --network base");
      } else {
        console.log("\n⚠️  Balance is low. Consider adding more ETH for safety.");
      }
    } catch (error) {
      console.log("\n⚠️  Could not estimate deployment cost:", error.message);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
