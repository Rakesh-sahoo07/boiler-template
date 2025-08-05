const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const PriceConsumerModule = buildModule("PriceConsumerModule", (m) => {
  // Parameters
  const initialOwner = m.getParameter("initialOwner", "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
  
  // Deploy the contract
  const priceConsumer = m.contract("PriceConsumer", [initialOwner]);

  // After deployment, we can add price feeds
  // Note: This would typically be done in a separate script or through tasks
  // Example price feeds for different networks:
  const networkPriceFeeds = m.getParameter("priceFeeds", {
    "ETH/USD": {
      sepolia: "0x694AA1769357215DE4FAC081bf1f309aDC325306",
      mainnet: "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419"
    },
    "BTC/USD": {
      sepolia: "0x1b44F3514812d835EB1BDB0acB33d3fA3351Ee43", 
      mainnet: "0xF4030086522a5bEEa4988F8cA5B36dbC97BeE88c"
    }
  });

  return { priceConsumer, networkPriceFeeds };
});

module.exports = PriceConsumerModule;