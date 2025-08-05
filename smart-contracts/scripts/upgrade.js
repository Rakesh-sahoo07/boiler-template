const { ethers, upgrades } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Upgrading contracts with the account:", deployer.address);

  // Get proxy address from command line arguments
  const proxyAddress = process.argv[2];
  const newContractName = process.argv[3] || "UpgradeableContract";

  if (!proxyAddress) {
    console.error("Please provide the proxy address as an argument");
    console.log("Usage: npx hardhat run scripts/upgrade.js [ProxyAddress] [NewContractName]");
    process.exit(1);
  }

  try {
    console.log(`Upgrading proxy at ${proxyAddress} to ${newContractName}...`);

    const NewContract = await ethers.getContractFactory(newContractName);
    
    // Upgrade the proxy
    const upgraded = await upgrades.upgradeProxy(proxyAddress, NewContract);
    
    console.log("Contract upgraded successfully!");
    console.log("Proxy address:", upgraded.target);
    console.log("Implementation address:", await upgrades.erc1967.getImplementationAddress(upgraded.target));

    // Update version if the contract has a version function
    try {
      const currentVersion = await upgraded.version();
      console.log("Current version:", currentVersion);
      
      // You can update the version here if needed
      // await upgraded.updateVersion("2.0.0");
    } catch (error) {
      console.log("Version function not available or failed to call");
    }

    // Verify on block explorer if on a public network
    if (network.name !== "hardhat" && network.name !== "localhost") {
      console.log("Waiting for block confirmations...");
      await upgraded.deploymentTransaction().wait(6);
      
      console.log("Verifying new implementation...");
      try {
        const implementationAddress = await upgrades.erc1967.getImplementationAddress(upgraded.target);
        await hre.run("verify:verify", {
          address: implementationAddress,
          constructorArguments: [],
        });
      } catch (error) {
        console.log("Verification failed:", error.message);
      }
    }

  } catch (error) {
    console.error("Upgrade failed:", error);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });