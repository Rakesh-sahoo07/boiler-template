const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const SimpleTokenModule = buildModule("SimpleTokenModule", (m) => {
  // Parameters with defaults
  const name = m.getParameter("name", "Simple Token");
  const symbol = m.getParameter("symbol", "SMP");
  const initialSupply = m.getParameter("initialSupply", "1000000000000000000000000"); // 1M tokens
  const initialOwner = m.getParameter("initialOwner", "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"); // Default Hardhat account
  
  // Deploy the contract
  const simpleToken = m.contract("SimpleToken", [
    name,
    symbol,
    initialSupply,
    initialOwner
  ]);

  return { simpleToken };
});

module.exports = SimpleTokenModule;