const { expect } = require("chai");
const { ethers } = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");

describe("SimpleToken", function () {
  async function deploySimpleTokenFixture() {
    const [owner, addr1, addr2] = await ethers.getSigners();

    const name = "Test Token";
    const symbol = "TEST";
    const initialSupply = ethers.parseEther("1000000"); // 1M tokens
    
    const SimpleToken = await ethers.getContractFactory("SimpleToken");
    const token = await SimpleToken.deploy(name, symbol, initialSupply, owner.address);

    return { token, owner, addr1, addr2, name, symbol, initialSupply };
  }

  describe("Deployment", function () {
    it("Should set the right name and symbol", async function () {
      const { token, name, symbol } = await loadFixture(deploySimpleTokenFixture);

      expect(await token.name()).to.equal(name);
      expect(await token.symbol()).to.equal(symbol);
    });

    it("Should set the right owner", async function () {
      const { token, owner } = await loadFixture(deploySimpleTokenFixture);

      expect(await token.owner()).to.equal(owner.address);
    });

    it("Should assign the total supply to the owner", async function () {
      const { token, owner, initialSupply } = await loadFixture(deploySimpleTokenFixture);

      const ownerBalance = await token.balanceOf(owner.address);
      expect(await token.totalSupply()).to.equal(ownerBalance);
      expect(ownerBalance).to.equal(initialSupply);
    });

    it("Should have 18 decimals", async function () {
      const { token } = await loadFixture(deploySimpleTokenFixture);

      expect(await token.decimals()).to.equal(18);
    });
  });

  describe("Transfers", function () {
    it("Should transfer tokens between accounts", async function () {
      const { token, owner, addr1, addr2 } = await loadFixture(deploySimpleTokenFixture);

      const transferAmount = ethers.parseEther("50");

      // Transfer 50 tokens from owner to addr1
      await expect(token.transfer(addr1.address, transferAmount))
        .to.changeTokenBalances(token, [owner, addr1], [-transferAmount, transferAmount]);

      // Transfer 50 tokens from addr1 to addr2
      await expect(token.connect(addr1).transfer(addr2.address, transferAmount))
        .to.changeTokenBalances(token, [addr1, addr2], [-transferAmount, transferAmount]);
    });

    it("Should emit Transfer events", async function () {
      const { token, owner, addr1 } = await loadFixture(deploySimpleTokenFixture);

      const transferAmount = ethers.parseEther("50");

      await expect(token.transfer(addr1.address, transferAmount))
        .to.emit(token, "Transfer")
        .withArgs(owner.address, addr1.address, transferAmount);
    });

    it("Should fail if sender doesn't have enough tokens", async function () {
      const { token, owner, addr1 } = await loadFixture(deploySimpleTokenFixture);

      const initialOwnerBalance = await token.balanceOf(owner.address);

      // Try to send 1 token from addr1 (0 tokens) to owner
      await expect(
        token.connect(addr1).transfer(owner.address, 1)
      ).to.be.revertedWithCustomError(token, "ERC20InsufficientBalance");

      // Owner balance shouldn't have changed
      expect(await token.balanceOf(owner.address)).to.equal(initialOwnerBalance);
    });
  });

  describe("Allowances", function () {
    it("Should approve tokens for delegated transfer", async function () {
      const { token, owner, addr1 } = await loadFixture(deploySimpleTokenFixture);

      const approveAmount = ethers.parseEther("100");

      await expect(token.approve(addr1.address, approveAmount))
        .to.emit(token, "Approval")
        .withArgs(owner.address, addr1.address, approveAmount);

      expect(await token.allowance(owner.address, addr1.address)).to.equal(approveAmount);
    });

    it("Should transfer tokens using transferFrom", async function () {
      const { token, owner, addr1, addr2 } = await loadFixture(deploySimpleTokenFixture);

      const approveAmount = ethers.parseEther("100");
      const transferAmount = ethers.parseEther("50");

      // Owner approves addr1 to spend tokens
      await token.approve(addr1.address, approveAmount);

      // addr1 transfers tokens from owner to addr2
      await expect(
        token.connect(addr1).transferFrom(owner.address, addr2.address, transferAmount)
      ).to.changeTokenBalances(token, [owner, addr2], [-transferAmount, transferAmount]);

      // Check remaining allowance
      expect(await token.allowance(owner.address, addr1.address))
        .to.equal(approveAmount - transferAmount);
    });

    it("Should fail transferFrom without sufficient allowance", async function () {
      const { token, owner, addr1, addr2 } = await loadFixture(deploySimpleTokenFixture);

      const transferAmount = ethers.parseEther("50");

      await expect(
        token.connect(addr1).transferFrom(owner.address, addr2.address, transferAmount)
      ).to.be.revertedWithCustomError(token, "ERC20InsufficientAllowance");
    });
  });

  describe("Minting", function () {
    it("Should allow owner to mint tokens", async function () {
      const { token, owner, addr1 } = await loadFixture(deploySimpleTokenFixture);

      const mintAmount = ethers.parseEther("1000");
      const initialSupply = await token.totalSupply();

      await expect(token.mint(addr1.address, mintAmount))
        .to.emit(token, "Transfer")
        .withArgs(ethers.ZeroAddress, addr1.address, mintAmount);

      expect(await token.balanceOf(addr1.address)).to.equal(mintAmount);
      expect(await token.totalSupply()).to.equal(initialSupply + mintAmount);
    });

    it("Should not allow non-owner to mint tokens", async function () {
      const { token, addr1, addr2 } = await loadFixture(deploySimpleTokenFixture);

      const mintAmount = ethers.parseEther("1000");

      await expect(
        token.connect(addr1).mint(addr2.address, mintAmount)
      ).to.be.revertedWithCustomError(token, "OwnableUnauthorizedAccount")
        .withArgs(addr1.address);
    });
  });

  describe("Burning", function () {
    it("Should allow users to burn their own tokens", async function () {
      const { token, owner } = await loadFixture(deploySimpleTokenFixture);

      const burnAmount = ethers.parseEther("100");
      const initialBalance = await token.balanceOf(owner.address);
      const initialSupply = await token.totalSupply();

      await expect(token.burn(burnAmount))
        .to.emit(token, "Transfer")
        .withArgs(owner.address, ethers.ZeroAddress, burnAmount);

      expect(await token.balanceOf(owner.address)).to.equal(initialBalance - burnAmount);
      expect(await token.totalSupply()).to.equal(initialSupply - burnAmount);
    });

    it("Should allow burning from allowance", async function () {
      const { token, owner, addr1 } = await loadFixture(deploySimpleTokenFixture);

      const allowanceAmount = ethers.parseEther("200");
      const burnAmount = ethers.parseEther("100");

      // Owner approves addr1 to spend tokens
      await token.approve(addr1.address, allowanceAmount);

      const initialBalance = await token.balanceOf(owner.address);
      const initialSupply = await token.totalSupply();

      // addr1 burns tokens from owner's account
      await expect(token.connect(addr1).burnFrom(owner.address, burnAmount))
        .to.emit(token, "Transfer")
        .withArgs(owner.address, ethers.ZeroAddress, burnAmount);

      expect(await token.balanceOf(owner.address)).to.equal(initialBalance - burnAmount);
      expect(await token.totalSupply()).to.equal(initialSupply - burnAmount);
      expect(await token.allowance(owner.address, addr1.address))
        .to.equal(allowanceAmount - burnAmount);
    });

    it("Should fail burn with insufficient balance", async function () {
      const { token, addr1 } = await loadFixture(deploySimpleTokenFixture);

      const burnAmount = ethers.parseEther("100");

      await expect(
        token.connect(addr1).burn(burnAmount)
      ).to.be.revertedWithCustomError(token, "ERC20InsufficientBalance");
    });
  });

  describe("Pausable", function () {
    it("Should allow owner to pause and unpause", async function () {
      const { token, owner } = await loadFixture(deploySimpleTokenFixture);

      await expect(token.pause())
        .to.emit(token, "Paused")
        .withArgs(owner.address);

      expect(await token.paused()).to.be.true;

      await expect(token.unpause())
        .to.emit(token, "Unpaused")
        .withArgs(owner.address);

      expect(await token.paused()).to.be.false;
    });

    it("Should prevent transfers when paused", async function () {
      const { token, owner, addr1 } = await loadFixture(deploySimpleTokenFixture);

      await token.pause();

      await expect(
        token.transfer(addr1.address, ethers.parseEther("100"))
      ).to.be.revertedWithCustomError(token, "EnforcedPause");
    });

    it("Should not allow non-owner to pause", async function () {
      const { token, addr1 } = await loadFixture(deploySimpleTokenFixture);

      await expect(
        token.connect(addr1).pause()
      ).to.be.revertedWithCustomError(token, "OwnableUnauthorizedAccount")
        .withArgs(addr1.address);
    });
  });
});