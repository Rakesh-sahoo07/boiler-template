const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const UpgradeableContractModule = buildModule("UpgradeableContractModule", (m) => {
  // Parameters with defaults
  const name = m.getParameter("name", "Upgradeable Token");
  const symbol = m.getParameter("symbol", "UPG");
  const initialSupply = m.getParameter("initialSupply", "1000000000000000000000000"); // 1M tokens
  const initialOwner = m.getParameter("initialOwner", "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
  const version = m.getParameter("version", "1.0.0");
  
  // Deploy the implementation contract
  const upgradeableContract = m.contract("UpgradeableContract");
  
  // Deploy the proxy using OpenZeppelin's UUPS proxy pattern
  // Note: In a real deployment, you would use the OpenZeppelin Hardhat Upgrades plugin
  // This is a simplified version for demonstration
  const proxy = m.contract("ERC1967Proxy", [
    upgradeableContract,
    m.encodeFunctionCall(upgradeableContract, "initialize", [
      name,
      symbol,
      initialSupply,
      initialOwner,
      version
    ])
  ], {
    id: "UpgradeableProxy"
  });

  return { 
    upgradeableContract, 
    proxy,
    // Return the proxy address as the main contract address
    upgradeableTokenProxy: proxy
  };
});

module.exports = UpgradeableContractModule;