const hre = require("hardhat");

async function main() {
  console.log("🚀 Deploying AirdropBadge contract to Base network...");

  // Get the deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log("📝 Deploying with account:", deployer.address);

  // Check balance
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", hre.ethers.formatEther(balance), "ETH");

  if (balance === 0n) {
    console.error("❌ Error: Account has no ETH for gas fees!");
    console.log("💡 Please send some ETH to:", deployer.address);
    process.exit(1);
  }

  // Deploy the contract
  console.log("\n⏳ Deploying contract...");
  const AirdropBadge = await hre.ethers.getContractFactory("AirdropBadge");

  // Estimate gas
  const deployTransaction = AirdropBadge.getDeployTransaction();
  const estimatedGas = await hre.ethers.provider.estimateGas(deployTransaction);
  console.log("⛽ Estimated gas:", estimatedGas.toString());

  const gasPrice = await hre.ethers.provider.getFeeData();
  console.log("💵 Gas price:", hre.ethers.formatUnits(gasPrice.gasPrice || 0n, "gwei"), "gwei");

  const estimatedCost = estimatedGas * (gasPrice.gasPrice || 0n);
  console.log("💸 Estimated deployment cost:", hre.ethers.formatEther(estimatedCost), "ETH");

  // Deploy with sufficient gas limit
  const airdropBadge = await AirdropBadge.deploy({
    gasLimit: 3000000, // 3M gas limit
  });

  await airdropBadge.waitForDeployment();

  const contractAddress = await airdropBadge.getAddress();
  console.log("\n✅ AirdropBadge deployed to:", contractAddress);

  // Save deployment info
  const fs = require("fs");
  const deploymentInfo = {
    network: hre.network.name,
    contractAddress: contractAddress,
    deployer: deployer.address,
    deployedAt: new Date().toISOString(),
    transactionHash: airdropBadge.deploymentTransaction()?.hash,
  };

  const deploymentPath = "./deployment-info.json";
  fs.writeFileSync(deploymentPath, JSON.stringify(deploymentInfo, null, 2));
  console.log("📄 Deployment info saved to:", deploymentPath);

  // Update .env.local with contract address
  const envPath = "./.env.local";
  let envContent = fs.readFileSync(envPath, "utf8");

  if (envContent.includes("NEXT_PUBLIC_CONTRACT_ADDRESS=")) {
    envContent = envContent.replace(
      /NEXT_PUBLIC_CONTRACT_ADDRESS=.*/,
      `NEXT_PUBLIC_CONTRACT_ADDRESS=${contractAddress}`
    );
  } else {
    envContent += `\n# Contract Address\nNEXT_PUBLIC_CONTRACT_ADDRESS=${contractAddress}\n`;
  }

  fs.writeFileSync(envPath, envContent);
  console.log("📝 Updated .env.local with contract address");

  console.log("\n🎉 Deployment complete!");
  console.log("\n📋 Next steps:");
  console.log("1. Verify contract on BaseScan:");
  console.log(`   npx hardhat verify --network base ${contractAddress}`);
  console.log("2. Test minting a badge from the web app");
  console.log("3. View contract on BaseScan:");
  console.log(`   https://basescan.org/address/${contractAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
