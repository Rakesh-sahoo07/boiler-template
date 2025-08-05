const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await ethers.provider.getBalance(deployer.address)).toString());

  // Get contract name from command line arguments
  const contractName = process.argv[2];
  
  if (!contractName) {
    console.error("Please provide a contract name as an argument");
    console.log("Usage: npx hardhat run scripts/deploy.js [ContractName]");
    process.exit(1);
  }

  try {
    const Contract = await ethers.getContractFactory(contractName);
    
    let contract;
    
    // Deploy different contracts with appropriate parameters
    switch (contractName) {
      case "SimpleToken":
        contract = await Contract.deploy(
          "Simple Token",
          "SMP",
          ethers.parseEther("1000000"), // 1M tokens
          deployer.address
        );
        break;
        
      case "NFTCollection":
        contract = await Contract.deploy(
          "Boiler NFT Collection",
          "BNC",
          "https://api.example.com/metadata/",
          deployer.address,
          deployer.address // royalty receiver
        );
        break;
        
      case "PriceConsumer":
        contract = await Contract.deploy(deployer.address);
        break;
        
      case "VRFConsumer":
        // These values are for Sepolia testnet
        const vrfCoordinator = "0x8103B0A8A00be2DDC778e6e7eaa21791Cd364625";
        const keyHash = "0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c";
        const subscriptionId = "1"; // You need to create this on Chainlink VRF
        
        contract = await Contract.deploy(
          vrfCoordinator,
          keyHash,
          subscriptionId,
          deployer.address
        );
        break;
        
      default:
        console.error(`Unknown contract: ${contractName}`);
        process.exit(1);
    }

    await contract.waitForDeployment();

    console.log(`${contractName} deployed to:`, contract.target);
    console.log("Deployment transaction hash:", contract.deploymentTransaction().hash);

    // Verify on block explorer if on a public network
    if (network.name !== "hardhat" && network.name !== "localhost") {
      console.log("Waiting for block confirmations...");
      await contract.deploymentTransaction().wait(6);
      
      console.log("Verifying contract...");
      try {
        await hre.run("verify:verify", {
          address: contract.target,
          constructorArguments: getConstructorArgs(contractName, deployer.address),
        });
      } catch (error) {
        console.log("Verification failed:", error.message);
      }
    }

  } catch (error) {
    console.error("Deployment failed:", error);
    process.exit(1);
  }
}

function getConstructorArgs(contractName, deployerAddress) {
  switch (contractName) {
    case "SimpleToken":
      return [
        "Simple Token",
        "SMP",
        ethers.parseEther("1000000"),
        deployerAddress
      ];
      
    case "NFTCollection":
      return [
        "Boiler NFT Collection",
        "BNC",
        "https://api.example.com/metadata/",
        deployerAddress,
        deployerAddress
      ];
      
    case "PriceConsumer":
      return [deployerAddress];
      
    case "VRFConsumer":
      return [
        "0x8103B0A8A00be2DDC778e6e7eaa21791Cd364625",
        "0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c",
        "1",
        deployerAddress
      ];
      
    default:
      return [];
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });