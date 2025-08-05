const { expect } = require("chai");
const { ethers } = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");

describe("PriceConsumer", function () {
  // Mock aggregator contract for testing
  async function deployMockAggregator() {
    const MockAggregator = await ethers.getContractFactory("MockV3Aggregator");
    const decimals = 8;
    const initialAnswer = 200000000000; // $2000.00 with 8 decimals
    const mockAggregator = await MockAggregator.deploy(decimals, initialAnswer);
    return { mockAggregator, decimals, initialAnswer };
  }

  async function deployPriceConsumerFixture() {
    const [owner, addr1, addr2] = await ethers.getSigners();
    
    const PriceConsumer = await ethers.getContractFactory("PriceConsumer");
    const priceConsumer = await PriceConsumer.deploy(owner.address);

    return { priceConsumer, owner, addr1, addr2 };
  }

  async function deployWithMockAggregator() {
    const { priceConsumer, owner, addr1, addr2 } = await loadFixture(deployPriceConsumerFixture);
    const { mockAggregator, decimals, initialAnswer } = await deployMockAggregator();

    // Add the mock aggregator as a price feed
    await priceConsumer.addPriceFeed("ETH/USD", mockAggregator.target);

    return { 
      priceConsumer, 
      mockAggregator, 
      owner, 
      addr1, 
      addr2, 
      decimals, 
      initialAnswer 
    };
  }

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      const { priceConsumer, owner } = await loadFixture(deployPriceConsumerFixture);

      expect(await priceConsumer.owner()).to.equal(owner.address);
    });

    it("Should initialize with zero price feeds", async function () {
      const { priceConsumer } = await loadFixture(deployPriceConsumerFixture);

      const priceFeeds = await priceConsumer.getAllPriceFeeds();
      expect(priceFeeds.length).to.equal(0);
    });
  });

  describe("Price Feed Management", function () {
    it("Should allow owner to add price feeds", async function () {
      const { priceConsumer, owner } = await loadFixture(deployPriceConsumerFixture);
      const { mockAggregator } = await deployMockAggregator();

      const feedName = "ETH/USD";
      
      await expect(priceConsumer.addPriceFeed(feedName, mockAggregator.target))
        .to.emit(priceConsumer, "PriceFeedAdded")
        .withArgs(feedName, mockAggregator.target);

      expect(await priceConsumer.priceFeeds(feedName)).to.equal(mockAggregator.target);
      
      const allFeeds = await priceConsumer.getAllPriceFeeds();
      expect(allFeeds).to.include(feedName);
    });

    it("Should allow owner to remove price feeds", async function () {
      const { priceConsumer, mockAggregator, owner } = await loadFixture(deployWithMockAggregator);

      const feedName = "ETH/USD";
      
      await expect(priceConsumer.removePriceFeed(feedName))
        .to.emit(priceConsumer, "PriceFeedRemoved")
        .withArgs(feedName);

      expect(await priceConsumer.priceFeeds(feedName)).to.equal(ethers.ZeroAddress);
      
      const allFeeds = await priceConsumer.getAllPriceFeeds();
      expect(allFeeds).to.not.include(feedName);
    });

    it("Should not allow non-owner to add price feeds", async function () {
      const { priceConsumer, addr1 } = await loadFixture(deployPriceConsumerFixture);
      const { mockAggregator } = await deployMockAggregator();

      await expect(
        priceConsumer.connect(addr1).addPriceFeed("ETH/USD", mockAggregator.target)
      ).to.be.revertedWithCustomError(priceConsumer, "OwnableUnauthorizedAccount")
        .withArgs(addr1.address);
    });

    it("Should not allow adding feed with zero address", async function () {
      const { priceConsumer, owner } = await loadFixture(deployPriceConsumerFixture);

      await expect(
        priceConsumer.addPriceFeed("ETH/USD", ethers.ZeroAddress)
      ).to.be.revertedWith("Invalid aggregator address");
    });

    it("Should not allow adding feed with empty name", async function () {
      const { priceConsumer, owner } = await loadFixture(deployPriceConsumerFixture);
      const { mockAggregator } = await deployMockAggregator();

      await expect(
        priceConsumer.addPriceFeed("", mockAggregator.target)
      ).to.be.revertedWith("Invalid price feed name");
    });

    it("Should not allow duplicate price feed names", async function () {
      const { priceConsumer, mockAggregator, owner } = await loadFixture(deployWithMockAggregator);

      await expect(
        priceConsumer.addPriceFeed("ETH/USD", mockAggregator.target)
      ).to.be.revertedWith("Price feed already exists");
    });
  });

  describe("Price Reading", function () {
    it("Should return correct latest price", async function () {
      const { priceConsumer, mockAggregator, initialAnswer } = await loadFixture(deployWithMockAggregator);

      const price = await priceConsumer.getLatestPrice("ETH/USD");
      expect(price).to.equal(initialAnswer);
    });

    it("Should return formatted price with correct decimals", async function () {
      const { priceConsumer, mockAggregator, initialAnswer, decimals } = await loadFixture(deployWithMockAggregator);

      const formattedPrice = await priceConsumer.getFormattedPrice("ETH/USD");
      
      // The formatted price should be the raw price scaled to 18 decimals
      const expectedPrice = BigInt(initialAnswer) * (10n ** (18n - BigInt(decimals)));
      expect(formattedPrice).to.equal(expectedPrice);
    });

    it("Should return historical price", async function () {
      const { priceConsumer, mockAggregator } = await loadFixture(deployWithMockAggregator);

      // Mock aggregator should have at least one round
      const roundId = 1;
      const historicalPrice = await priceConsumer.getHistoricalPrice("ETH/USD", roundId);
      
      expect(historicalPrice).to.be.a('bigint');
      expect(historicalPrice).to.be.greaterThan(0);
    });

    it("Should revert for non-existent price feed", async function () {
      const { priceConsumer } = await loadFixture(deployPriceConsumerFixture);

      await expect(
        priceConsumer.getLatestPrice("BTC/USD")
      ).to.be.revertedWith("Price feed not found");
    });

    it("Should handle price feed updates", async function () {
      const { priceConsumer, mockAggregator } = await loadFixture(deployWithMockAggregator);

      const newPrice = 250000000000; // $2500.00
      await mockAggregator.updateAnswer(newPrice);

      const price = await priceConsumer.getLatestPrice("ETH/USD");
      expect(price).to.equal(newPrice);
    });
  });

  describe("Batch Operations", function () {
    it("Should get multiple prices at once", async function () {
      const { priceConsumer, owner } = await loadFixture(deployPriceConsumerFixture);
      
      // Deploy multiple mock aggregators
      const { mockAggregator: ethAgg } = await deployMockAggregator();
      const { mockAggregator: btcAgg } = await deployMockAggregator();
      
      // Add multiple price feeds
      await priceConsumer.addPriceFeed("ETH/USD", ethAgg.target);
      await priceConsumer.addPriceFeed("BTC/USD", btcAgg.target);

      const feedNames = ["ETH/USD", "BTC/USD"];
      const prices = await priceConsumer.getMultiplePrices(feedNames);
      
      expect(prices.length).to.equal(2);
      expect(prices[0]).to.be.greaterThan(0);
      expect(prices[1]).to.be.greaterThan(0);
    });

    it("Should revert if any feed in batch doesn't exist", async function () {
      const { priceConsumer, mockAggregator } = await loadFixture(deployWithMockAggregator);

      const feedNames = ["ETH/USD", "NONEXISTENT/USD"];
      
      await expect(
        priceConsumer.getMultiplePrices(feedNames)
      ).to.be.revertedWith("Price feed not found");
    });
  });

  describe("Price Feed Information", function () {
    it("Should return correct decimals for price feed", async function () {
      const { priceConsumer, mockAggregator, decimals } = await loadFixture(deployWithMockAggregator);

      const feedDecimals = await priceConsumer.getDecimals("ETH/USD");
      expect(feedDecimals).to.equal(decimals);
    });

    it("Should return correct description for price feed", async function () {
      const { priceConsumer, mockAggregator } = await loadFixture(deployWithMockAggregator);

      const description = await priceConsumer.getDescription("ETH/USD");
      expect(description).to.be.a('string');
      expect(description.length).to.be.greaterThan(0);
    });

    it("Should return correct version for price feed", async function () {
      const { priceConsumer, mockAggregator } = await loadFixture(deployWithMockAggregator);

      const version = await priceConsumer.getVersion("ETH/USD");
      expect(version).to.be.greaterThan(0);
    });
  });

  describe("Emergency Functions", function () {
    it("Should allow owner to pause contract", async function () {
      const { priceConsumer, owner } = await loadFixture(deployPriceConsumerFixture);

      await expect(priceConsumer.pause())
        .to.emit(priceConsumer, "Paused")
        .withArgs(owner.address);

      expect(await priceConsumer.paused()).to.be.true;
    });

    it("Should prevent operations when paused", async function () {
      const { priceConsumer, mockAggregator, owner } = await loadFixture(deployWithMockAggregator);

      await priceConsumer.pause();

      await expect(
        priceConsumer.getLatestPrice("ETH/USD")
      ).to.be.revertedWithCustomError(priceConsumer, "EnforcedPause");
    });

    it("Should allow owner to unpause contract", async function () {
      const { priceConsumer, owner } = await loadFixture(deployPriceConsumerFixture);

      await priceConsumer.pause();
      
      await expect(priceConsumer.unpause())
        .to.emit(priceConsumer, "Unpaused")
        .withArgs(owner.address);

      expect(await priceConsumer.paused()).to.be.false;
    });

    it("Should not allow non-owner to pause", async function () {
      const { priceConsumer, addr1 } = await loadFixture(deployPriceConsumerFixture);

      await expect(
        priceConsumer.connect(addr1).pause()
      ).to.be.revertedWithCustomError(priceConsumer, "OwnableUnauthorizedAccount")
        .withArgs(addr1.address);
    });
  });
});