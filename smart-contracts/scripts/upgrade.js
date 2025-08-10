const { ethers, upgrades } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Upgrading contracts with the account:", deployer.address);

  const proxyAddress = process.argv[2];
  const newContractName = process.argv[3];

  if (!proxyAddress || !newContractName) {
    console.error("Please provide proxy address and new contract name");
    console.log("Usage: npx hardhat run scripts/upgrade.js [ProxyAddress] [NewContractName]");
    process.exit(1);
  }

  try {
    const NewContract = await ethers.getContractFactory(newContractName);
    const upgraded = await upgrades.upgradeProxy(proxyAddress, NewContract);
    
    console.log("Contract upgraded successfully!");
    console.log("Proxy address:", upgraded.target);

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