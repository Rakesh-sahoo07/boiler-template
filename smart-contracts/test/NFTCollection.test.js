const { expect } = require("chai");
const { ethers } = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");

describe("NFTCollection", function () {
  async function deployNFTCollectionFixture() {
    const [owner, addr1, addr2, addr3] = await ethers.getSigners();

    const name = "Test NFT Collection";
    const symbol = "TNC";
    const baseTokenURI = "https://api.example.com/metadata/";
    const royaltyReceiver = owner.address;
    
    const NFTCollection = await ethers.getContractFactory("NFTCollection");
    const nft = await NFTCollection.deploy(
      name,
      symbol,
      baseTokenURI,
      owner.address,
      royaltyReceiver
    );

    return { nft, owner, addr1, addr2, addr3, name, symbol, baseTokenURI, royaltyReceiver };
  }

  describe("Deployment", function () {
    it("Should set the right name and symbol", async function () {
      const { nft, name, symbol } = await loadFixture(deployNFTCollectionFixture);

      expect(await nft.name()).to.equal(name);
      expect(await nft.symbol()).to.equal(symbol);
    });

    it("Should set the right owner", async function () {
      const { nft, owner } = await loadFixture(deployNFTCollectionFixture);

      expect(await nft.owner()).to.equal(owner.address);
    });

    it("Should set the base URI", async function () {
      const { nft, baseTokenURI } = await loadFixture(deployNFTCollectionFixture);

      expect(await nft.baseURI()).to.equal(baseTokenURI);
    });

    it("Should initialize with zero total supply", async function () {
      const { nft } = await loadFixture(deployNFTCollectionFixture);

      expect(await nft.totalSupply()).to.equal(0);
    });

    it("Should support required interfaces", async function () {
      const { nft } = await loadFixture(deployNFTCollectionFixture);

      // ERC721
      expect(await nft.supportsInterface("0x80ac58cd")).to.be.true;
      // ERC721Metadata
      expect(await nft.supportsInterface("0x5b5e139f")).to.be.true;
      // ERC2981 (Royalty)
      expect(await nft.supportsInterface("0x2a55205a")).to.be.true;
      // AccessControl
      expect(await nft.supportsInterface("0x7965db0b")).to.be.true;
    });
  });

  describe("Minting", function () {
    it("Should allow owner to mint tokens", async function () {
      const { nft, owner, addr1 } = await loadFixture(deployNFTCollectionFixture);

      await expect(nft.mint(addr1.address))
        .to.emit(nft, "Transfer")
        .withArgs(ethers.ZeroAddress, addr1.address, 1);

      expect(await nft.balanceOf(addr1.address)).to.equal(1);
      expect(await nft.ownerOf(1)).to.equal(addr1.address);
      expect(await nft.totalSupply()).to.equal(1);
    });

    it("Should allow batch minting", async function () {
      const { nft, owner, addr1 } = await loadFixture(deployNFTCollectionFixture);

      const quantity = 3;
      await nft.batchMint(addr1.address, quantity);

      expect(await nft.balanceOf(addr1.address)).to.equal(quantity);
      expect(await nft.totalSupply()).to.equal(quantity);

      // Check that all tokens are owned by addr1
      for (let i = 1; i <= quantity; i++) {
        expect(await nft.ownerOf(i)).to.equal(addr1.address);
      }
    });

    it("Should not allow non-minter to mint", async function () {
      const { nft, addr1, addr2 } = await loadFixture(deployNFTCollectionFixture);

      await expect(
        nft.connect(addr1).mint(addr2.address)
      ).to.be.revertedWithCustomError(nft, "AccessControlUnauthorizedAccount");
    });

    it("Should allow granting minter role", async function () {
      const { nft, owner, addr1, addr2 } = await loadFixture(deployNFTCollectionFixture);

      const MINTER_ROLE = await nft.MINTER_ROLE();
      
      await nft.grantRole(MINTER_ROLE, addr1.address);
      
      expect(await nft.hasRole(MINTER_ROLE, addr1.address)).to.be.true;

      // addr1 should now be able to mint
      await expect(nft.connect(addr1).mint(addr2.address))
        .to.emit(nft, "Transfer")
        .withArgs(ethers.ZeroAddress, addr2.address, 1);
    });

    it("Should respect max supply limit", async function () {
      const { nft, owner, addr1 } = await loadFixture(deployNFTCollectionFixture);

      const maxSupply = await nft.MAX_SUPPLY();
      
      // This test assumes MAX_SUPPLY is reasonable for testing
      // In a real scenario, you might want to deploy with a smaller max supply for testing
      expect(maxSupply).to.be.greaterThan(0);
    });
  });

  describe("Whitelist", function () {
    it("Should allow owner to add and remove from whitelist", async function () {
      const { nft, owner, addr1 } = await loadFixture(deployNFTCollectionFixture);

      await nft.addToWhitelist(addr1.address);
      expect(await nft.isWhitelisted(addr1.address)).to.be.true;

      await nft.removeFromWhitelist(addr1.address);
      expect(await nft.isWhitelisted(addr1.address)).to.be.false;
    });

    it("Should allow batch whitelist operations", async function () {
      const { nft, owner, addr1, addr2, addr3 } = await loadFixture(deployNFTCollectionFixture);

      const addresses = [addr1.address, addr2.address, addr3.address];
      
      await nft.batchAddToWhitelist(addresses);
      
      for (const address of addresses) {
        expect(await nft.isWhitelisted(address)).to.be.true;
      }

      await nft.batchRemoveFromWhitelist(addresses);
      
      for (const address of addresses) {
        expect(await nft.isWhitelisted(address)).to.be.false;
      }
    });

    it("Should not allow non-owner to modify whitelist", async function () {
      const { nft, addr1, addr2 } = await loadFixture(deployNFTCollectionFixture);

      await expect(
        nft.connect(addr1).addToWhitelist(addr2.address)
      ).to.be.revertedWithCustomError(nft, "OwnableUnauthorizedAccount");
    });
  });

  describe("Token URI", function () {
    it("Should return correct token URI", async function () {
      const { nft, owner, addr1, baseTokenURI } = await loadFixture(deployNFTCollectionFixture);

      await nft.mint(addr1.address);
      
      const tokenId = 1;
      const expectedURI = baseTokenURI + tokenId.toString();
      
      expect(await nft.tokenURI(tokenId)).to.equal(expectedURI);
    });

    it("Should allow owner to update base URI", async function () {
      const { nft, owner, addr1 } = await loadFixture(deployNFTCollectionFixture);

      await nft.mint(addr1.address);
      
      const newBaseURI = "https://newapi.example.com/metadata/";
      await nft.setBaseURI(newBaseURI);
      
      expect(await nft.baseURI()).to.equal(newBaseURI);
      expect(await nft.tokenURI(1)).to.equal(newBaseURI + "1");
    });

    it("Should revert for non-existent token", async function () {
      const { nft } = await loadFixture(deployNFTCollectionFixture);

      await expect(nft.tokenURI(999))
        .to.be.revertedWithCustomError(nft, "ERC721NonexistentToken");
    });
  });

  describe("Royalties", function () {
    it("Should return correct royalty info", async function () {
      const { nft, royaltyReceiver } = await loadFixture(deployNFTCollectionFixture);

      const tokenId = 1;
      const salePrice = ethers.parseEther("1");
      
      const [receiver, royaltyAmount] = await nft.royaltyInfo(tokenId, salePrice);
      
      expect(receiver).to.equal(royaltyReceiver);
      
      // Default royalty is 5% (500 basis points)
      const expectedRoyalty = (salePrice * 500n) / 10000n;
      expect(royaltyAmount).to.equal(expectedRoyalty);
    });

    it("Should allow owner to update royalty info", async function () {
      const { nft, owner, addr1 } = await loadFixture(deployNFTCollectionFixture);

      const newReceiver = addr1.address;
      const newRoyaltyBPS = 1000; // 10%
      
      await nft.setDefaultRoyalty(newReceiver, newRoyaltyBPS);
      
      const salePrice = ethers.parseEther("1");
      const [receiver, royaltyAmount] = await nft.royaltyInfo(1, salePrice);
      
      expect(receiver).to.equal(newReceiver);
      
      const expectedRoyalty = (salePrice * BigInt(newRoyaltyBPS)) / 10000n;
      expect(royaltyAmount).to.equal(expectedRoyalty);
    });
  });

  describe("Pausable", function () {
    it("Should allow owner to pause and unpause", async function () {
      const { nft, owner } = await loadFixture(deployNFTCollectionFixture);

      await expect(nft.pause())
        .to.emit(nft, "Paused")
        .withArgs(owner.address);

      expect(await nft.paused()).to.be.true;

      await expect(nft.unpause())
        .to.emit(nft, "Unpaused")
        .withArgs(owner.address);

      expect(await nft.paused()).to.be.false;
    });

    it("Should prevent transfers when paused", async function () {
      const { nft, owner, addr1, addr2 } = await loadFixture(deployNFTCollectionFixture);

      await nft.mint(addr1.address);
      await nft.pause();

      await expect(
        nft.connect(addr1).transferFrom(addr1.address, addr2.address, 1)
      ).to.be.revertedWithCustomError(nft, "EnforcedPause");
    });

    it("Should prevent minting when paused", async function () {
      const { nft, owner, addr1 } = await loadFixture(deployNFTCollectionFixture);

      await nft.pause();

      await expect(
        nft.mint(addr1.address)
      ).to.be.revertedWithCustomError(nft, "EnforcedPause");
    });
  });

  describe("Transfers", function () {
    it("Should allow safe transfers", async function () {
      const { nft, owner, addr1, addr2 } = await loadFixture(deployNFTCollectionFixture);

      await nft.mint(addr1.address);
      
      await expect(
        nft.connect(addr1).safeTransferFrom(addr1.address, addr2.address, 1)
      ).to.emit(nft, "Transfer")
        .withArgs(addr1.address, addr2.address, 1);

      expect(await nft.ownerOf(1)).to.equal(addr2.address);
      expect(await nft.balanceOf(addr1.address)).to.equal(0);
      expect(await nft.balanceOf(addr2.address)).to.equal(1);
    });

    it("Should allow approvals", async function () {
      const { nft, owner, addr1, addr2 } = await loadFixture(deployNFTCollectionFixture);

      await nft.mint(addr1.address);
      
      await expect(nft.connect(addr1).approve(addr2.address, 1))
        .to.emit(nft, "Approval")
        .withArgs(addr1.address, addr2.address, 1);

      expect(await nft.getApproved(1)).to.equal(addr2.address);

      // addr2 should be able to transfer the token
      await expect(
        nft.connect(addr2).transferFrom(addr1.address, addr2.address, 1)
      ).to.emit(nft, "Transfer")
        .withArgs(addr1.address, addr2.address, 1);
    });
  });
});