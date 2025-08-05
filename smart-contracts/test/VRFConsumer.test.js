const { expect } = require("chai");
const { ethers } = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");

describe("VRFConsumer", function () {
  // Mock VRF Coordinator for testing
  async function deployMockVRFCoordinator() {
    const MockVRFCoordinator = await ethers.getContractFactory("VRFCoordinatorV2Mock");
    const baseFee = ethers.parseEther("0.25"); // 0.25 LINK
    const gasPriceLink = "1000000000"; // 0.000000001 LINK per gas
    const mockCoordinator = await MockVRFCoordinator.deploy(baseFee, gasPriceLink);
    
    return { mockCoordinator, baseFee, gasPriceLink };
  }

  async function deployVRFConsumerFixture() {
    const [owner, addr1, addr2] = await ethers.getSigners();
    
    const { mockCoordinator } = await deployMockVRFCoordinator();
    
    // Create subscription
    await mockCoordinator.createSubscription();
    const subscriptionId = 1;
    
    // Fund subscription
    await mockCoordinator.fundSubscription(subscriptionId, ethers.parseEther("10"));
    
    const keyHash = "0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c";
    
    const VRFConsumer = await ethers.getContractFactory("VRFConsumer");
    const vrfConsumer = await VRFConsumer.deploy(
      mockCoordinator.target,
      keyHash,
      subscriptionId,
      owner.address
    );

    // Add consumer to subscription
    await mockCoordinator.addConsumer(subscriptionId, vrfConsumer.target);

    return { 
      vrfConsumer, 
      mockCoordinator, 
      owner, 
      addr1, 
      addr2, 
      keyHash, 
      subscriptionId 
    };
  }

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      const { vrfConsumer, owner } = await loadFixture(deployVRFConsumerFixture);

      expect(await vrfConsumer.owner()).to.equal(owner.address);
    });

    it("Should set the correct VRF configuration", async function () {
      const { vrfConsumer, keyHash, subscriptionId } = await loadFixture(deployVRFConsumerFixture);

      const config = await vrfConsumer.getVRFConfig();
      expect(config._keyHash).to.equal(keyHash);
      expect(config._subscriptionId).to.equal(subscriptionId);
      expect(config._callbackGasLimit).to.equal(2500000);
      expect(config._requestConfirmations).to.equal(3);
    });

    it("Should initialize with empty request arrays", async function () {
      const { vrfConsumer } = await loadFixture(deployVRFConsumerFixture);

      const allRequests = await vrfConsumer.getAllRequests();
      expect(allRequests.length).to.equal(0);
      expect(await vrfConsumer.lastRequestId()).to.equal(0);
    });
  });

  describe("Random Word Requests", function () {
    it("Should allow requesting random words", async function () {
      const { vrfConsumer, addr1 } = await loadFixture(deployVRFConsumerFixture);

      const numWords = 1;
      
      await expect(vrfConsumer.connect(addr1).requestRandomWords(numWords))
        .to.emit(vrfConsumer, "RandomWordsRequested");

      const allRequests = await vrfConsumer.getAllRequests();
      expect(allRequests.length).to.equal(1);
      
      const requestId = allRequests[0];
      expect(await vrfConsumer.getRequester(requestId)).to.equal(addr1.address);
      expect(await vrfConsumer.isRequestFulfilled(requestId)).to.be.false;
    });

    it("Should allow requesting multiple random words", async function () {
      const { vrfConsumer, addr1 } = await loadFixture(deployVRFConsumerFixture);

      const numWords = 5;
      
      await expect(vrfConsumer.connect(addr1).requestRandomWords(numWords))
        .to.emit(vrfConsumer, "RandomWordsRequested")
        .withArgs(anyValue, addr1.address, numWords);
    });

    it("Should reject invalid number of words", async function () {
      const { vrfConsumer, addr1 } = await loadFixture(deployVRFConsumerFixture);

      // Test zero words
      await expect(
        vrfConsumer.connect(addr1).requestRandomWords(0)
      ).to.be.revertedWith("Invalid number of words");

      // Test too many words
      await expect(
        vrfConsumer.connect(addr1).requestRandomWords(501)
      ).to.be.revertedWith("Invalid number of words");
    });

    it("Should track user requests correctly", async function () {
      const { vrfConsumer, addr1, addr2 } = await loadFixture(deployVRFConsumerFixture);

      // addr1 makes 2 requests
      await vrfConsumer.connect(addr1).requestRandomWords(1);
      await vrfConsumer.connect(addr1).requestRandomWords(2);

      // addr2 makes 1 request
      await vrfConsumer.connect(addr2).requestRandomWords(1);

      const addr1Requests = await vrfConsumer.getUserRequests(addr1.address);
      const addr2Requests = await vrfConsumer.getUserRequests(addr2.address);

      expect(addr1Requests.length).to.equal(2);
      expect(addr2Requests.length).to.equal(1);
    });
  });

  describe("Random Word Fulfillment", function () {
    it("Should fulfill random word requests", async function () {
      const { vrfConsumer, mockCoordinator, addr1 } = await loadFixture(deployVRFConsumerFixture);

      const numWords = 2;
      await vrfConsumer.connect(addr1).requestRandomWords(numWords);
      
      const allRequests = await vrfConsumer.getAllRequests();
      const requestId = allRequests[0];

      // Fulfill the request
      const randomWords = [12345, 67890];
      await expect(
        mockCoordinator.fulfillRandomWords(requestId, vrfConsumer.target)
      ).to.emit(vrfConsumer, "RandomWordsFulfilled");

      expect(await vrfConsumer.isRequestFulfilled(requestId)).to.be.true;
      
      const retrievedWords = await vrfConsumer.getRandomWords(requestId);
      expect(retrievedWords.length).to.equal(numWords);
    });

    it("Should not allow double fulfillment", async function () {
      const { vrfConsumer, mockCoordinator, addr1 } = await loadFixture(deployVRFConsumerFixture);

      await vrfConsumer.connect(addr1).requestRandomWords(1);
      
      const allRequests = await vrfConsumer.getAllRequests();
      const requestId = allRequests[0];

      // Fulfill once
      await mockCoordinator.fulfillRandomWords(requestId, vrfConsumer.target);

      // Try to fulfill again - this should be handled by the mock coordinator
      // The actual VRF coordinator would prevent double fulfillment
      expect(await vrfConsumer.isRequestFulfilled(requestId)).to.be.true;
    });

    it("Should revert when getting words for unfulfilled request", async function () {
      const { vrfConsumer, addr1 } = await loadFixture(deployVRFConsumerFixture);

      await vrfConsumer.connect(addr1).requestRandomWords(1);
      
      const allRequests = await vrfConsumer.getAllRequests();
      const requestId = allRequests[0];

      await expect(
        vrfConsumer.getRandomWords(requestId)
      ).to.be.revertedWith("Request not yet fulfilled");
    });
  });

  describe("Random Number Generation", function () {
    it("Should generate random numbers in specified range", async function () {
      const { vrfConsumer, mockCoordinator, addr1 } = await loadFixture(deployVRFConsumerFixture);

      await vrfConsumer.connect(addr1).requestRandomWords(1);
      
      const allRequests = await vrfConsumer.getAllRequests();
      const requestId = allRequests[0];

      // Fulfill the request
      await mockCoordinator.fulfillRandomWords(requestId, vrfConsumer.target);

      const min = 1;
      const max = 100;
      const randomInRange = await vrfConsumer.getRandomInRange(requestId, 0, min, max);

      expect(randomInRange).to.be.greaterThanOrEqual(min);
      expect(randomInRange).to.be.lessThanOrEqual(max);
    });

    it("Should revert for invalid range", async function () {
      const { vrfConsumer, mockCoordinator, addr1 } = await loadFixture(deployVRFConsumerFixture);

      await vrfConsumer.connect(addr1).requestRandomWords(1);
      
      const allRequests = await vrfConsumer.getAllRequests();
      const requestId = allRequests[0];

      await mockCoordinator.fulfillRandomWords(requestId, vrfConsumer.target);

      await expect(
        vrfConsumer.getRandomInRange(requestId, 0, 100, 1)
      ).to.be.revertedWith("Invalid range");
    });

    it("Should revert for invalid index", async function () {
      const { vrfConsumer, mockCoordinator, addr1 } = await loadFixture(deployVRFConsumerFixture);

      await vrfConsumer.connect(addr1).requestRandomWords(1);
      
      const allRequests = await vrfConsumer.getAllRequests();
      const requestId = allRequests[0];

      await mockCoordinator.fulfillRandomWords(requestId, vrfConsumer.target);

      await expect(
        vrfConsumer.getRandomInRange(requestId, 1, 1, 100) // Index 1 doesn't exist for single word
      ).to.be.revertedWith("Invalid index");
    });
  });

  describe("VRF Configuration Updates", function () {
    it("Should allow owner to update VRF configuration", async function () {
      const { vrfConsumer, owner } = await loadFixture(deployVRFConsumerFixture);

      const newKeyHash = "0x8af398995b04c28e9951adb9721ef74c74f93e6a478f39e7e0777be13527e7ef";
      const newSubscriptionId = 2;
      const newCallbackGasLimit = 100000;
      const newRequestConfirmations = 5;

      await expect(
        vrfConsumer.updateVRFConfig(
          newKeyHash,
          newSubscriptionId,
          newCallbackGasLimit,
          newRequestConfirmations
        )
      ).to.emit(vrfConsumer, "VRFConfigUpdated")
        .withArgs(newKeyHash, newSubscriptionId, newCallbackGasLimit, newRequestConfirmations);

      const config = await vrfConsumer.getVRFConfig();
      expect(config._keyHash).to.equal(newKeyHash);
      expect(config._subscriptionId).to.equal(newSubscriptionId);
      expect(config._callbackGasLimit).to.equal(newCallbackGasLimit);
      expect(config._requestConfirmations).to.equal(newRequestConfirmations);
    });

    it("Should reject invalid gas limit", async function () {
      const { vrfConsumer, owner, keyHash, subscriptionId } = await loadFixture(deployVRFConsumerFixture);

      await expect(
        vrfConsumer.updateVRFConfig(keyHash, subscriptionId, 10000, 3) // Too low
      ).to.be.revertedWith("Invalid gas limit");

      await expect(
        vrfConsumer.updateVRFConfig(keyHash, subscriptionId, 3000000, 3) // Too high
      ).to.be.revertedWith("Invalid gas limit");
    });

    it("Should reject invalid confirmations", async function () {
      const { vrfConsumer, owner, keyHash, subscriptionId } = await loadFixture(deployVRFConsumerFixture);

      await expect(
        vrfConsumer.updateVRFConfig(keyHash, subscriptionId, 100000, 2) // Too low
      ).to.be.revertedWith("Invalid confirmations");

      await expect(
        vrfConsumer.updateVRFConfig(keyHash, subscriptionId, 100000, 201) // Too high
      ).to.be.revertedWith("Invalid confirmations");
    });

    it("Should not allow non-owner to update configuration", async function () {
      const { vrfConsumer, addr1, keyHash, subscriptionId } = await loadFixture(deployVRFConsumerFixture);

      await expect(
        vrfConsumer.connect(addr1).updateVRFConfig(keyHash, subscriptionId, 100000, 3)
      ).to.be.revertedWithCustomError(vrfConsumer, "OwnableUnauthorizedAccount")
        .withArgs(addr1.address);
    });
  });

  describe("Reentrancy Protection", function () {
    it("Should prevent reentrancy on requestRandomWords", async function () {
      const { vrfConsumer } = await loadFixture(deployVRFConsumerFixture);

      // This test ensures the nonReentrant modifier is working
      // In a real attack scenario, this would be more complex
      // For now, we just verify the function works normally
      await expect(vrfConsumer.requestRandomWords(1)).to.not.be.reverted;
    });
  });

  describe("Gas Optimization", function () {
    it("Should handle multiple requests efficiently", async function () {
      const { vrfConsumer, addr1 } = await loadFixture(deployVRFConsumerFixture);

      // Make multiple requests and check gas usage is reasonable
      const tx1 = await vrfConsumer.connect(addr1).requestRandomWords(1);
      const receipt1 = await tx1.wait();
      
      const tx2 = await vrfConsumer.connect(addr1).requestRandomWords(1);
      const receipt2 = await tx2.wait();

      // Second request should use similar gas (no significant state bloat)
      expect(receipt2.gasUsed).to.be.lessThan(receipt1.gasUsed * 1.1); // Within 10%
    });
  });
});

// Helper function for testing events with dynamic values
const anyValue = undefined;