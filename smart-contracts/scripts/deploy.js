const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await ethers.provider.getBalance(deployer.address)).toString());

  const contractName = process.argv[2];
  
  if (!contractName) {
    console.error("Please provide a contract name as an argument");
    console.log("Usage: npx hardhat run scripts/deploy.js [ContractName]");
    process.exit(1);
  }

  try {
    const Contract = await ethers.getContractFactory(contractName);
    const contract = await Contract.deploy();
    
    await contract.waitForDeployment();

    console.log(`${contractName} deployed to:`, contract.target);
    console.log("Deployment transaction hash:", contract.deploymentTransaction().hash);

  } catch (error) {
    console.error("Deployment failed:", error);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });