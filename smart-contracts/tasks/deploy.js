const { task } = require("hardhat/config");

task("deploy-simple-token", "Deploys the SimpleToken contract")
  .addOptionalParam("name", "Token name", "Simple Token")
  .addOptionalParam("symbol", "Token symbol", "SMP")
  .addOptionalParam("supply", "Initial supply in ETH units", "1000000")
  .setAction(async (taskArgs, hre) => {
    const [deployer] = await hre.ethers.getSigners();
    
    console.log("Deploying SimpleToken with account:", deployer.address);
    
    const SimpleToken = await hre.ethers.getContractFactory("SimpleToken");
    const token = await SimpleToken.deploy(
      taskArgs.name,
      taskArgs.symbol,
      hre.ethers.parseEther(taskArgs.supply),
      deployer.address
    );
    
    await token.waitForDeployment();
    
    console.log("SimpleToken deployed to:", token.target);
    console.log(`Name: ${taskArgs.name}, Symbol: ${taskArgs.symbol}, Supply: ${taskArgs.supply} tokens`);
  });

task("deploy-nft", "Deploys the NFTCollection contract")
  .addOptionalParam("name", "Collection name", "Boiler NFT Collection")
  .addOptionalParam("symbol", "Collection symbol", "BNC")
  .addOptionalParam("baseuri", "Base token URI", "https://api.example.com/metadata/")
  .setAction(async (taskArgs, hre) => {
    const [deployer] = await hre.ethers.getSigners();
    
    console.log("Deploying NFTCollection with account:", deployer.address);
    
    const NFTCollection = await hre.ethers.getContractFactory("NFTCollection");
    const nft = await NFTCollection.deploy(
      taskArgs.name,
      taskArgs.symbol,
      taskArgs.baseuri,
      deployer.address,
      deployer.address // royalty receiver
    );
    
    await nft.waitForDeployment();
    
    console.log("NFTCollection deployed to:", nft.target);
    console.log(`Name: ${taskArgs.name}, Symbol: ${taskArgs.symbol}, Base URI: ${taskArgs.baseuri}`);
  });

task("deploy-price-consumer", "Deploys the PriceConsumer contract")
  .setAction(async (taskArgs, hre) => {
    const [deployer] = await hre.ethers.getSigners();
    
    console.log("Deploying PriceConsumer with account:", deployer.address);
    
    const PriceConsumer = await hre.ethers.getContractFactory("PriceConsumer");
    const priceConsumer = await PriceConsumer.deploy(deployer.address);
    
    await priceConsumer.waitForDeployment();
    
    console.log("PriceConsumer deployed to:", priceConsumer.target);
  });

task("deploy-vrf-consumer", "Deploys the VRFConsumer contract")
  .addOptionalParam("coordinator", "VRF Coordinator address")
  .addOptionalParam("keyhash", "Key hash")
  .addOptionalParam("subscriptionid", "Subscription ID", "1")
  .setAction(async (taskArgs, hre) => {
    const [deployer] = await hre.ethers.getSigners();
    
    console.log("Deploying VRFConsumer with account:", deployer.address);
    
    // Default values for different networks
    let coordinator, keyHash;
    
    if (hre.network.name === "sepolia") {
      coordinator = taskArgs.coordinator || "0x8103B0A8A00be2DDC778e6e7eaa21791Cd364625";
      keyHash = taskArgs.keyhash || "0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c";
    } else if (hre.network.name === "mainnet") {
      coordinator = taskArgs.coordinator || "0x271682DEB8C4E0901D1a1550aD2e64D568E69909";
      keyHash = taskArgs.keyhash || "0x8af398995b04c28e9951adb9721ef74c74f93e6a478f39e7e0777be13527e7ef";
    } else {
      throw new Error("Please provide coordinator and keyhash for this network");
    }
    
    const VRFConsumer = await hre.ethers.getContractFactory("VRFConsumer");
    const vrfConsumer = await VRFConsumer.deploy(
      coordinator,
      keyHash,
      taskArgs.subscriptionid,
      deployer.address
    );
    
    await vrfConsumer.waitForDeployment();
    
    console.log("VRFConsumer deployed to:", vrfConsumer.target);
    console.log(`Coordinator: ${coordinator}, Key Hash: ${keyHash}, Subscription ID: ${taskArgs.subscriptionid}`);
  });

task("deploy-upgradeable", "Deploys the UpgradeableContract using OpenZeppelin upgrades")
  .addOptionalParam("name", "Token name", "Upgradeable Token")
  .addOptionalParam("symbol", "Token symbol", "UPG")
  .addOptionalParam("supply", "Initial supply in ETH units", "1000000")
  .addOptionalParam("contractversion", "Contract version", "1.0.0")
  .setAction(async (taskArgs, hre) => {
    const [deployer] = await hre.ethers.getSigners();
    
    console.log("Deploying UpgradeableContract with account:", deployer.address);
    
    const UpgradeableContract = await hre.ethers.getContractFactory("UpgradeableContract");
    
    const contract = await hre.upgrades.deployProxy(
      UpgradeableContract,
      [
        taskArgs.name,
        taskArgs.symbol,
        hre.ethers.parseEther(taskArgs.supply),
        deployer.address,
        taskArgs.contractversion
      ],
      { 
        initializer: "initialize",
        kind: "uups"
      }
    );
    
    await contract.waitForDeployment();
    
    console.log("UpgradeableContract proxy deployed to:", contract.target);
    console.log("Implementation address:", await hre.upgrades.erc1967.getImplementationAddress(contract.target));
    console.log(`Name: ${taskArgs.name}, Symbol: ${taskArgs.symbol}, Supply: ${taskArgs.supply} tokens, Version: ${taskArgs.contractversion}`);
  });