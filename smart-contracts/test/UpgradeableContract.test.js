const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");

describe("UpgradeableContract", function () {
  async function deployUpgradeableContractFixture() {
    const [owner, addr1, addr2] = await ethers.getSigners();

    const name = "Upgradeable Token";
    const symbol = "UPG";
    const initialSupply = ethers.parseEther("1000000"); // 1M tokens
    const version = "1.0.0";
    
    const UpgradeableContract = await ethers.getContractFactory("UpgradeableContract");
    
    // Deploy using OpenZeppelin's upgrades plugin for proper UUPS deployment
    const contract = await upgrades.deployProxy(
      UpgradeableContract,
      [name, symbol, initialSupply, owner.address, version],
      { 
        initializer: "initialize",
        kind: "uups"
      }
    );

    return { contract, owner, addr1, addr2, name, symbol, initialSupply, version };
  }

  describe("Deployment and Initialization", function () {
    it("Should set the right name and symbol", async function () {
      const { contract, name, symbol } = await loadFixture(deployUpgradeableContractFixture);

      expect(await contract.name()).to.equal(name);
      expect(await contract.symbol()).to.equal(symbol);
    });

    it("Should set the right owner", async function () {
      const { contract, owner } = await loadFixture(deployUpgradeableContractFixture);

      expect(await contract.owner()).to.equal(owner.address);
    });

    it("Should assign the total supply to the owner", async function () {
      const { contract, owner, initialSupply } = await loadFixture(deployUpgradeableContractFixture);

      const ownerBalance = await contract.balanceOf(owner.address);
      expect(await contract.totalSupply()).to.equal(ownerBalance);
      expect(ownerBalance).to.equal(initialSupply);
    });

    it("Should set the correct version", async function () {
      const { contract, version } = await loadFixture(deployUpgradeableContractFixture);

      expect(await contract.version()).to.equal(version);
    });

    it("Should prevent re-initialization", async function () {
      const { contract, name, symbol, initialSupply, owner, version } = await loadFixture(deployUpgradeableContractFixture);

      await expect(
        contract.initialize(name, symbol, initialSupply, owner.address, version)
      ).to.be.revertedWithCustomError(contract, "InvalidInitialization");
    });

    it("Should have 18 decimals", async function () {
      const { contract } = await loadFixture(deployUpgradeableContractFixture);

      expect(await contract.decimals()).to.equal(18);
    });
  });

  describe("ERC20 Functionality", function () {
    it("Should transfer tokens between accounts", async function () {
      const { contract, owner, addr1, addr2 } = await loadFixture(deployUpgradeableContractFixture);

      const transferAmount = ethers.parseEther("50");

      // Transfer 50 tokens from owner to addr1
      await expect(contract.transfer(addr1.address, transferAmount))
        .to.changeTokenBalances(contract, [owner, addr1], [-transferAmount, transferAmount]);

      // Transfer 50 tokens from addr1 to addr2
      await expect(contract.connect(addr1).transfer(addr2.address, transferAmount))
        .to.changeTokenBalances(contract, [addr1, addr2], [-transferAmount, transferAmount]);
    });

    it("Should emit Transfer events", async function () {
      const { contract, owner, addr1 } = await loadFixture(deployUpgradeableContractFixture);

      const transferAmount = ethers.parseEther("50");

      await expect(contract.transfer(addr1.address, transferAmount))
        .to.emit(contract, "Transfer")
        .withArgs(owner.address, addr1.address, transferAmount);
    });

    it("Should handle allowances correctly", async function () {
      const { contract, owner, addr1, addr2 } = await loadFixture(deployUpgradeableContractFixture);

      const approveAmount = ethers.parseEther("100");
      const transferAmount = ethers.parseEther("50");

      // Owner approves addr1 to spend tokens
      await contract.approve(addr1.address, approveAmount);
      expect(await contract.allowance(owner.address, addr1.address)).to.equal(approveAmount);

      // addr1 transfers tokens from owner to addr2
      await expect(
        contract.connect(addr1).transferFrom(owner.address, addr2.address, transferAmount)
      ).to.changeTokenBalances(contract, [owner, addr2], [-transferAmount, transferAmount]);

      // Check remaining allowance
      expect(await contract.allowance(owner.address, addr1.address))
        .to.equal(approveAmount - transferAmount);
    });
  });

  describe("Minting and Burning", function () {
    it("Should allow owner to mint tokens", async function () {
      const { contract, owner, addr1 } = await loadFixture(deployUpgradeableContractFixture);

      const mintAmount = ethers.parseEther("1000");
      const initialSupply = await contract.totalSupply();

      await expect(contract.mint(addr1.address, mintAmount))
        .to.emit(contract, "Transfer")
        .withArgs(ethers.ZeroAddress, addr1.address, mintAmount);

      expect(await contract.balanceOf(addr1.address)).to.equal(mintAmount);
      expect(await contract.totalSupply()).to.equal(initialSupply + mintAmount);
    });

    it("Should not allow non-owner to mint tokens", async function () {
      const { contract, addr1, addr2 } = await loadFixture(deployUpgradeableContractFixture);

      const mintAmount = ethers.parseEther("1000");

      await expect(
        contract.connect(addr1).mint(addr2.address, mintAmount)
      ).to.be.revertedWithCustomError(contract, "OwnableUnauthorizedAccount")
        .withArgs(addr1.address);
    });

    it("Should allow users to burn their own tokens", async function () {
      const { contract, owner } = await loadFixture(deployUpgradeableContractFixture);

      const burnAmount = ethers.parseEther("100");
      const initialBalance = await contract.balanceOf(owner.address);
      const initialSupply = await contract.totalSupply();

      await expect(contract.burn(burnAmount))
        .to.emit(contract, "Transfer")
        .withArgs(owner.address, ethers.ZeroAddress, burnAmount);

      expect(await contract.balanceOf(owner.address)).to.equal(initialBalance - burnAmount);
      expect(await contract.totalSupply()).to.equal(initialSupply - burnAmount);
    });
  });

  describe("Pausable Functionality", function () {
    it("Should allow owner to pause and unpause", async function () {
      const { contract, owner } = await loadFixture(deployUpgradeableContractFixture);

      await expect(contract.pause())
        .to.emit(contract, "Paused")
        .withArgs(owner.address);

      expect(await contract.paused()).to.be.true;

      await expect(contract.unpause())
        .to.emit(contract, "Unpaused")
        .withArgs(owner.address);

      expect(await contract.paused()).to.be.false;
    });

    it("Should prevent transfers when paused", async function () {
      const { contract, owner, addr1 } = await loadFixture(deployUpgradeableContractFixture);

      await contract.pause();

      await expect(
        contract.transfer(addr1.address, ethers.parseEther("100"))
      ).to.be.revertedWithCustomError(contract, "EnforcedPause");
    });

    it("Should not allow non-owner to pause", async function () {
      const { contract, addr1 } = await loadFixture(deployUpgradeableContractFixture);

      await expect(
        contract.connect(addr1).pause()
      ).to.be.revertedWithCustomError(contract, "OwnableUnauthorizedAccount")
        .withArgs(addr1.address);
    });
  });

  describe("Upgradeability", function () {
    it("Should allow owner to upgrade the contract", async function () {
      const { contract, owner } = await loadFixture(deployUpgradeableContractFixture);

      // Create a new version of the contract for testing
      const UpgradeableContractV2 = await ethers.getContractFactory("UpgradeableContract", owner);
      
      // Upgrade the contract
      const upgradedContract = await upgrades.upgradeProxy(contract.target, UpgradeableContractV2);

      // Verify the upgrade worked and state is preserved
      expect(await upgradedContract.owner()).to.equal(owner.address);
      expect(await upgradedContract.name()).to.equal("Upgradeable Token");
      expect(await upgradedContract.symbol()).to.equal("UPG");
    });

    it("Should not allow non-owner to upgrade", async function () {
      const { contract, addr1 } = await loadFixture(deployUpgradeableContractFixture);

      // Try to upgrade as non-owner
      const UpgradeableContractV2 = await ethers.getContractFactory("UpgradeableContract", addr1);
      
      await expect(
        upgrades.upgradeProxy(contract.target, UpgradeableContractV2)
      ).to.be.reverted; // The exact error depends on the OpenZeppelin implementation
    });

    it("Should preserve state across upgrades", async function () {
      const { contract, owner, addr1 } = await loadFixture(deployUpgradeableContractFixture);

      // Make some changes to the state
      const transferAmount = ethers.parseEther("1000");
      await contract.transfer(addr1.address, transferAmount);
      
      const balanceBefore = await contract.balanceOf(addr1.address);
      const totalSupplyBefore = await contract.totalSupply();

      // Upgrade the contract
      const UpgradeableContractV2 = await ethers.getContractFactory("UpgradeableContract", owner);
      const upgradedContract = await upgrades.upgradeProxy(contract.target, UpgradeableContractV2);

      // Verify state is preserved
      expect(await upgradedContract.balanceOf(addr1.address)).to.equal(balanceBefore);
      expect(await upgradedContract.totalSupply()).to.equal(totalSupplyBefore);
      expect(await upgradedContract.owner()).to.equal(owner.address);
    });
  });

  describe("Version Management", function () {
    it("Should allow owner to update version", async function () {
      const { contract, owner } = await loadFixture(deployUpgradeableContractFixture);

      const newVersion = "2.0.0";
      
      await expect(contract.updateVersion(newVersion))
        .to.emit(contract, "VersionUpdated")
        .withArgs("1.0.0", newVersion);

      expect(await contract.version()).to.equal(newVersion);
    });

    it("Should not allow non-owner to update version", async function () {
      const { contract, addr1 } = await loadFixture(deployUpgradeableContractFixture);

      const newVersion = "2.0.0";

      await expect(
        contract.connect(addr1).updateVersion(newVersion)
      ).to.be.revertedWithCustomError(contract, "OwnableUnauthorizedAccount")
        .withArgs(addr1.address);
    });

    it("Should not allow empty version string", async function () {
      const { contract, owner } = await loadFixture(deployUpgradeableContractFixture);

      await expect(
        contract.updateVersion("")
      ).to.be.revertedWith("Version cannot be empty");
    });
  });

  describe("Access Control", function () {
    it("Should maintain proper ownership", async function () {
      const { contract, owner, addr1 } = await loadFixture(deployUpgradeableContractFixture);

      expect(await contract.owner()).to.equal(owner.address);

      // Transfer ownership
      await contract.transferOwnership(addr1.address);
      expect(await contract.owner()).to.equal(addr1.address);
    });

    it("Should allow only owner to perform restricted functions", async function () {
      const { contract, owner, addr1 } = await loadFixture(deployUpgradeableContractFixture);

      // These should work for owner
      await expect(contract.mint(addr1.address, ethers.parseEther("100"))).to.not.be.reverted;
      await expect(contract.pause()).to.not.be.reverted;
      await expect(contract.unpause()).to.not.be.reverted;

      // These should fail for non-owner
      await expect(
        contract.connect(addr1).mint(addr1.address, ethers.parseEther("100"))
      ).to.be.revertedWithCustomError(contract, "OwnableUnauthorizedAccount");

      await expect(
        contract.connect(addr1).pause()
      ).to.be.revertedWithCustomError(contract, "OwnableUnauthorizedAccount");
    });
  });
});