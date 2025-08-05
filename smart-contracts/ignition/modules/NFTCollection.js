const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const NFTCollectionModule = buildModule("NFTCollectionModule", (m) => {
  // Parameters with defaults
  const name = m.getParameter("name", "Boiler NFT Collection");
  const symbol = m.getParameter("symbol", "BNC");
  const baseTokenURI = m.getParameter("baseTokenURI", "https://api.example.com/metadata/");
  const initialOwner = m.getParameter("initialOwner", "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
  const royaltyReceiver = m.getParameter("royaltyReceiver", "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
  
  // Deploy the contract
  const nftCollection = m.contract("NFTCollection", [
    name,
    symbol,
    baseTokenURI,
    initialOwner,
    royaltyReceiver
  ]);

  return { nftCollection };
});

module.exports = NFTCollectionModule;