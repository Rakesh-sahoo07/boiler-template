const { task } = require("hardhat/config");

task("contract-info", "Gets information about a deployed contract")
  .addParam("address", "Contract address")
  .addParam("name", "Contract name")
  .setAction(async (taskArgs, hre) => {
    const Contract = await hre.ethers.getContractFactory(taskArgs.name);
    const contract = Contract.attach(taskArgs.address);
    
    console.log(`\n=== ${taskArgs.name} Contract Info ===`);
    console.log(`Address: ${taskArgs.address}`);
    
    try {
      if (taskArgs.name.includes("Token") || taskArgs.name === "UpgradeableContract") {
        console.log(`Name: ${await contract.name()}`);
        console.log(`Symbol: ${await contract.symbol()}`);
        console.log(`Total Supply: ${hre.ethers.formatEther(await contract.totalSupply())} tokens`);
        console.log(`Decimals: ${await contract.decimals()}`);
        console.log(`Owner: ${await contract.owner()}`);
        console.log(`Paused: ${await contract.paused()}`);
        
        if (taskArgs.name === "UpgradeableContract") {
          console.log(`Version: ${await contract.version()}`);
        }
      }
      
      if (taskArgs.name === "NFTCollection") {
        console.log(`Name: ${await contract.name()}`);
        console.log(`Symbol: ${await contract.symbol()}`);
        console.log(`Total Supply: ${await contract.totalSupply()}`);
        console.log(`Base URI: ${await contract.baseURI()}`);
        console.log(`Owner: ${await contract.owner()}`);
        console.log(`Paused: ${await contract.paused()}`);
      }
      
      if (taskArgs.name === "PriceConsumer") {
        console.log(`Owner: ${await contract.owner()}`);
        console.log(`Paused: ${await contract.paused()}`);
        const priceFeeds = await contract.getAllPriceFeeds();
        console.log(`Price Feeds: ${priceFeeds.join(", ")}`);
      }
      
      if (taskArgs.name === "VRFConsumer") {
        console.log(`Owner: ${await contract.owner()}`);
        console.log(`Last Request ID: ${await contract.lastRequestId()}`);
        const config = await contract.getVRFConfig();
        console.log(`VRF Config:`);
        console.log(`  Key Hash: ${config._keyHash}`);
        console.log(`  Subscription ID: ${config._subscriptionId}`);
        console.log(`  Callback Gas Limit: ${config._callbackGasLimit}`);
        console.log(`  Request Confirmations: ${config._requestConfirmations}`);
      }
      
    } catch (error) {
      console.error("Error getting contract info:", error.message);
    }
  });

task("mint-tokens", "Mints tokens to an address")
  .addParam("contract", "Contract address")
  .addParam("name", "Contract name")
  .addParam("to", "Recipient address")
  .addParam("amount", "Amount to mint (in ETH units for tokens, quantity for NFTs)")
  .setAction(async (taskArgs, hre) => {
    const [signer] = await hre.ethers.getSigners();
    const Contract = await hre.ethers.getContractFactory(taskArgs.name);
    const contract = Contract.attach(taskArgs.contract);
    
    console.log(`Minting with account: ${signer.address}`);
    
    try {
      let tx;
      
      if (taskArgs.name.includes("Token") || taskArgs.name === "UpgradeableContract") {
        const amount = hre.ethers.parseEther(taskArgs.amount);
        tx = await contract.mint(taskArgs.to, amount);
        console.log(`Minting ${taskArgs.amount} tokens to ${taskArgs.to}`);
      } else if (taskArgs.name === "NFTCollection") {
        const quantity = parseInt(taskArgs.amount);
        if (quantity === 1) {
          tx = await contract.mint(taskArgs.to);
        } else {
          tx = await contract.batchMint(taskArgs.to, quantity);
        }
        console.log(`Minting ${quantity} NFT(s) to ${taskArgs.to}`);
      } else {
        throw new Error(`Minting not supported for ${taskArgs.name}`);
      }
      
      console.log(`Transaction hash: ${tx.hash}`);
      await tx.wait();
      console.log("Minting completed successfully!");
      
    } catch (error) {
      console.error("Minting failed:", error.message);
    }
  });

task("transfer-tokens", "Transfers tokens between addresses")
  .addParam("contract", "Contract address")
  .addParam("name", "Contract name")
  .addParam("to", "Recipient address")
  .addParam("amount", "Amount to transfer")
  .addOptionalParam("tokenid", "Token ID (for NFTs)")
  .setAction(async (taskArgs, hre) => {
    const [signer] = await hre.ethers.getSigners();
    const Contract = await hre.ethers.getContractFactory(taskArgs.name);
    const contract = Contract.attach(taskArgs.contract);
    
    console.log(`Transferring with account: ${signer.address}`);
    
    try {
      let tx;
      
      if (taskArgs.name.includes("Token") || taskArgs.name === "UpgradeableContract") {
        const amount = hre.ethers.parseEther(taskArgs.amount);
        tx = await contract.transfer(taskArgs.to, amount);
        console.log(`Transferring ${taskArgs.amount} tokens to ${taskArgs.to}`);
      } else if (taskArgs.name === "NFTCollection") {
        const tokenId = taskArgs.tokenid || "1";
        tx = await contract.safeTransferFrom(signer.address, taskArgs.to, tokenId);
        console.log(`Transferring NFT token ${tokenId} to ${taskArgs.to}`);
      } else {
        throw new Error(`Transfer not supported for ${taskArgs.name}`);
      }
      
      console.log(`Transaction hash: ${tx.hash}`);
      await tx.wait();
      console.log("Transfer completed successfully!");
      
    } catch (error) {
      console.error("Transfer failed:", error.message);
    }
  });

task("pause-contract", "Pauses a contract")
  .addParam("contract", "Contract address")
  .addParam("name", "Contract name")
  .setAction(async (taskArgs, hre) => {
    const [signer] = await hre.ethers.getSigners();
    const Contract = await hre.ethers.getContractFactory(taskArgs.name);
    const contract = Contract.attach(taskArgs.contract);
    
    console.log(`Pausing contract with account: ${signer.address}`);
    
    try {
      const tx = await contract.pause();
      console.log(`Transaction hash: ${tx.hash}`);
      await tx.wait();
      console.log("Contract paused successfully!");
      
    } catch (error) {
      console.error("Pause failed:", error.message);
    }
  });

task("unpause-contract", "Unpauses a contract")
  .addParam("contract", "Contract address")
  .addParam("name", "Contract name")
  .setAction(async (taskArgs, hre) => {
    const [signer] = await hre.ethers.getSigners();
    const Contract = await hre.ethers.getContractFactory(taskArgs.name);
    const contract = Contract.attach(taskArgs.contract);
    
    console.log(`Unpausing contract with account: ${signer.address}`);
    
    try {
      const tx = await contract.unpause();
      console.log(`Transaction hash: ${tx.hash}`);
      await tx.wait();
      console.log("Contract unpaused successfully!");
      
    } catch (error) {
      console.error("Unpause failed:", error.message);
    }
  });

task("add-price-feed", "Adds a price feed to PriceConsumer")
  .addParam("contract", "PriceConsumer contract address")
  .addParam("name", "Price feed name (e.g., ETH/USD)")
  .addParam("aggregator", "Aggregator contract address")
  .setAction(async (taskArgs, hre) => {
    const [signer] = await hre.ethers.getSigners();
    const PriceConsumer = await hre.ethers.getContractFactory("PriceConsumer");
    const contract = PriceConsumer.attach(taskArgs.contract);
    
    console.log(`Adding price feed with account: ${signer.address}`);
    
    try {
      const tx = await contract.addPriceFeed(taskArgs.name, taskArgs.aggregator);
      console.log(`Adding price feed ${taskArgs.name} with aggregator ${taskArgs.aggregator}`);
      console.log(`Transaction hash: ${tx.hash}`);
      await tx.wait();
      console.log("Price feed added successfully!");
      
    } catch (error) {
      console.error("Adding price feed failed:", error.message);
    }
  });

task("request-random", "Requests random words from VRFConsumer")
  .addParam("contract", "VRFConsumer contract address")
  .addOptionalParam("words", "Number of random words to request", "1")
  .setAction(async (taskArgs, hre) => {
    const [signer] = await hre.ethers.getSigners();
    const VRFConsumer = await hre.ethers.getContractFactory("VRFConsumer");
    const contract = VRFConsumer.attach(taskArgs.contract);
    
    console.log(`Requesting random words with account: ${signer.address}`);
    
    try {
      const tx = await contract.requestRandomWords(parseInt(taskArgs.words));
      console.log(`Requesting ${taskArgs.words} random word(s)`);
      console.log(`Transaction hash: ${tx.hash}`);
      
      const receipt = await tx.wait();
      console.log("Random words requested successfully!");
      
      // Extract request ID from events
      const event = receipt.logs.find(log => 
        log.topics[0] === hre.ethers.id("RandomWordsRequested(uint256,address,uint32)")
      );
      
      if (event) {
        const requestId = hre.ethers.getBigInt(event.topics[1]);
        console.log(`Request ID: ${requestId}`);
      }
      
    } catch (error) {
      console.error("Random words request failed:", error.message);
    }
  });