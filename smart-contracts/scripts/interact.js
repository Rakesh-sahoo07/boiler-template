const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Interacting with contracts using account:", deployer.address);

  const contractAddress = process.argv[2];
  const contractName = process.argv[3];
  const methodName = process.argv[4];
  const args = process.argv.slice(5);

  if (!contractAddress || !contractName || !methodName) {
    console.error("Please provide contract address, name, and method");
    console.log("Usage: npx hardhat run scripts/interact.js [ContractAddress] [ContractName] [MethodName] [Args...]");
    process.exit(1);
  }

  try {
    const Contract = await ethers.getContractFactory(contractName);
    const contract = Contract.attach(contractAddress);

    if (typeof contract[methodName] !== 'function') {
      console.error(`Method ${methodName} not found on contract ${contractName}`);
      process.exit(1);
    }

    const result = await contract[methodName](...args);
    
    if (result && typeof result === 'object' && result.wait) {
      console.log("Transaction hash:", result.hash);
      await result.wait();
      console.log("Transaction confirmed");
    } else {
      console.log("Result:", result.toString());
    }

  } catch (error) {
    console.error("Interaction failed:", error);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });