const { ethers } = require("hardhat");

async function main() {
  const [deployer, user1] = await ethers.getSigners();

  console.log("Interacting with contracts using account:", deployer.address);

  // Get contract address and name from command line arguments
  const contractAddress = process.argv[2];
  const contractName = process.argv[3];
  const action = process.argv[4];

  if (!contractAddress || !contractName || !action) {
    console.error("Please provide contract address, name, and action");
    console.log("Usage: npx hardhat run scripts/interact.js [ContractAddress] [ContractName] [Action]");
    console.log("Available actions: info, mint, transfer, burn, pause, unpause");
    process.exit(1);
  }

  try {
    const Contract = await ethers.getContractFactory(contractName);
    const contract = Contract.attach(contractAddress);

    switch (action) {
      case "info":
        await showContractInfo(contract, contractName);
        break;
      
      case "mint":
        await mintTokens(contract, contractName, user1.address);
        break;
      
      case "transfer":
        await transferTokens(contract, contractName, user1.address);
        break;
      
      case "burn":
        await burnTokens(contract, contractName);
        break;
      
      case "pause":
        await pauseContract(contract);
        break;
      
      case "unpause":
        await unpauseContract(contract);
        break;
      
      default:
        console.error(`Unknown action: ${action}`);
        console.log("Available actions: info, mint, transfer, burn, pause, unpause");
    }

  } catch (error) {
    console.error("Interaction failed:", error);
    process.exit(1);
  }
}

async function showContractInfo(contract, contractName) {
  console.log(`\n=== ${contractName} Contract Info ===`);
  
  try {
    if (contractName.includes("Token") || contractName === "UpgradeableContract") {
      console.log("Name:", await contract.name());
      console.log("Symbol:", await contract.symbol());
      console.log("Total Supply:", ethers.formatEther(await contract.totalSupply()));
      console.log("Decimals:", await contract.decimals());
      console.log("Owner:", await contract.owner());
      console.log("Paused:", await contract.paused());
      
      if (contractName === "UpgradeableContract") {
        console.log("Version:", await contract.version());
      }
    }
    
    if (contractName === "NFTCollection") {
      console.log("Name:", await contract.name());
      console.log("Symbol:", await contract.symbol());
      console.log("Total Supply:", await contract.totalSupply());
      console.log("Base URI:", await contract.baseURI());
      console.log("Owner:", await contract.owner());
      console.log("Paused:", await contract.paused());
    }
    
    if (contractName === "PriceConsumer") {
      console.log("Owner:", await contract.owner());
      console.log("Paused:", await contract.paused());
      const priceFeeds = await contract.getAllPriceFeeds();
      console.log("Price Feeds:", priceFeeds);
    }
    
    if (contractName === "VRFConsumer") {
      console.log("Owner:", await contract.owner());
      console.log("Last Request ID:", await contract.lastRequestId());
      const config = await contract.getVRFConfig();
      console.log("VRF Config:", {
        keyHash: config._keyHash,
        subscriptionId: config._subscriptionId.toString(),
        callbackGasLimit: config._callbackGasLimit.toString(),
        requestConfirmations: config._requestConfirmations.toString()
      });
    }
    
  } catch (error) {
    console.error("Error getting contract info:", error.message);
  }
}

async function mintTokens(contract, contractName, recipient) {
  console.log(`\n=== Minting Tokens ===`);
  
  try {
    if (contractName.includes("Token") || contractName === "UpgradeableContract") {
      const amount = ethers.parseEther("1000");
      const tx = await contract.mint(recipient, amount);
      console.log("Mint transaction hash:", tx.hash);
      await tx.wait();
      console.log(`Minted ${ethers.formatEther(amount)} tokens to ${recipient}`);
    }
    
    if (contractName === "NFTCollection") {
      const tx = await contract.mint(recipient);
      console.log("Mint transaction hash:", tx.hash);
      const receipt = await tx.wait();
      console.log(`Minted NFT to ${recipient}`);
      
      // Get the token ID from the Transfer event
      const transferEvent = receipt.logs.find(log => 
        log.topics[0] === ethers.id("Transfer(address,address,uint256)")
      );
      if (transferEvent) {
        const tokenId = ethers.getBigInt(transferEvent.topics[3]);
        console.log("Token ID:", tokenId.toString());
      }
    }
    
  } catch (error) {
    console.error("Error minting tokens:", error.message);
  }
}

async function transferTokens(contract, contractName, recipient) {
  console.log(`\n=== Transferring Tokens ===`);
  
  try {
    if (contractName.includes("Token") || contractName === "UpgradeableContract") {
      const amount = ethers.parseEther("100");
      const tx = await contract.transfer(recipient, amount);
      console.log("Transfer transaction hash:", tx.hash);
      await tx.wait();
      console.log(`Transferred ${ethers.formatEther(amount)} tokens to ${recipient}`);
    }
    
  } catch (error) {
    console.error("Error transferring tokens:", error.message);
  }
}

async function burnTokens(contract, contractName) {
  console.log(`\n=== Burning Tokens ===`);
  
  try {
    if (contractName.includes("Token") || contractName === "UpgradeableContract") {
      const amount = ethers.parseEther("50");
      const tx = await contract.burn(amount);
      console.log("Burn transaction hash:", tx.hash);
      await tx.wait();
      console.log(`Burned ${ethers.formatEther(amount)} tokens`);
    }
    
  } catch (error) {
    console.error("Error burning tokens:", error.message);
  }
}

async function pauseContract(contract) {
  console.log(`\n=== Pausing Contract ===`);
  
  try {
    const tx = await contract.pause();
    console.log("Pause transaction hash:", tx.hash);
    await tx.wait();
    console.log("Contract paused successfully");
    
  } catch (error) {
    console.error("Error pausing contract:", error.message);
  }
}

async function unpauseContract(contract) {
  console.log(`\n=== Unpausing Contract ===`);
  
  try {
    const tx = await contract.unpause();
    console.log("Unpause transaction hash:", tx.hash);
    await tx.wait();
    console.log("Contract unpaused successfully");
    
  } catch (error) {
    console.error("Error unpausing contract:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });