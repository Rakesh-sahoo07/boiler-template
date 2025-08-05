const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const VRFConsumerModule = buildModule("VRFConsumerModule", (m) => {
  // Parameters with defaults for different networks
  const vrfCoordinator = m.getParameter("vrfCoordinator", {
    sepolia: "0x8103B0A8A00be2DDC778e6e7eaa21791Cd364625",
    mainnet: "0x271682DEB8C4E0901D1a1550aD2e64D568E69909"
  });
  
  const keyHash = m.getParameter("keyHash", {
    sepolia: "0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c", // 30 gwei
    mainnet: "0x8af398995b04c28e9951adb9721ef74c74f93e6a478f39e7e0777be13527e7ef"  // 200 gwei
  });
  
  const subscriptionId = m.getParameter("subscriptionId", "1234"); // Default subscription ID
  const initialOwner = m.getParameter("initialOwner", "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
  
  // Deploy the contract
  const vrfConsumer = m.contract("VRFConsumer", [
    vrfCoordinator,
    keyHash,
    subscriptionId,
    initialOwner
  ]);

  return { vrfConsumer };
});

module.exports = VRFConsumerModule;