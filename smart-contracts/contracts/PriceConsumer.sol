// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title PriceConsumer
 * @dev A contract that consumes price data from Chainlink Price Feeds
 * Features:
 * - Get latest price from multiple price feeds
 * - Support for multiple token pairs
 * - Price feed management by owner
 * - Price staleness checking
 * - Decimal handling for different price feeds
 */
contract PriceConsumer is Ownable {
    mapping(string => AggregatorV3Interface) public priceFeeds;
    mapping(string => uint256) public heartbeat; // Max time between updates
    
    event PriceFeedAdded(string pair, address feed, uint256 heartbeat);
    event PriceFeedUpdated(string pair, address feed, uint256 heartbeat);
    event PriceFeedRemoved(string pair);
    
    constructor(address initialOwner) Ownable(initialOwner) {}
    
    /**
     * @dev Add a new price feed
     * @param pair The trading pair name (e.g., "ETH/USD")
     * @param feed The Chainlink price feed address
     * @param _heartbeat Maximum seconds between price updates
     */
    function addPriceFeed(
        string memory pair,
        address feed,
        uint256 _heartbeat
    ) external onlyOwner {
        require(feed != address(0), "Invalid feed address");
        require(_heartbeat > 0, "Invalid heartbeat");
        
        priceFeeds[pair] = AggregatorV3Interface(feed);
        heartbeat[pair] = _heartbeat;
        
        emit PriceFeedAdded(pair, feed, _heartbeat);
    }
    
    /**
     * @dev Update an existing price feed
     * @param pair The trading pair name
     * @param feed The new Chainlink price feed address
     * @param _heartbeat New maximum seconds between price updates
     */
    function updatePriceFeed(
        string memory pair,
        address feed,
        uint256 _heartbeat
    ) external onlyOwner {
        require(address(priceFeeds[pair]) != address(0), "Price feed does not exist");
        require(feed != address(0), "Invalid feed address");
        require(_heartbeat > 0, "Invalid heartbeat");
        
        priceFeeds[pair] = AggregatorV3Interface(feed);
        heartbeat[pair] = _heartbeat;
        
        emit PriceFeedUpdated(pair, feed, _heartbeat);
    }
    
    /**
     * @dev Remove a price feed
     * @param pair The trading pair name to remove
     */
    function removePriceFeed(string memory pair) external onlyOwner {
        require(address(priceFeeds[pair]) != address(0), "Price feed does not exist");
        
        delete priceFeeds[pair];
        delete heartbeat[pair];
        
        emit PriceFeedRemoved(pair);
    }
    
    /**
     * @dev Get the latest price for a trading pair
     * @param pair The trading pair name
     * @return price The latest price
     * @return decimals The number of decimals in the price
     * @return timestamp The timestamp of the price update
     */
    function getLatestPrice(string memory pair)
        external
        view
        returns (int256 price, uint8 decimals, uint256 timestamp)
    {
        AggregatorV3Interface priceFeed = priceFeeds[pair];
        require(address(priceFeed) != address(0), "Price feed not found");
        
        (
            uint80 roundId,
            int256 _price,
            uint256 startedAt,
            uint256 updatedAt,
            uint80 answeredInRound
        ) = priceFeed.latestRoundData();
        
        require(_price > 0, "Invalid price");
        require(updatedAt > 0, "Price data not available");
        require(block.timestamp - updatedAt <= heartbeat[pair], "Price data is stale");
        
        return (_price, priceFeed.decimals(), updatedAt);
    }
    
    /**
     * @dev Get historical price data for a specific round
     * @param pair The trading pair name
     * @param roundId The round ID to get data for
     * @return price The price for that round
     * @return decimals The number of decimals in the price
     * @return timestamp The timestamp of the price update
     */
    function getHistoricalPrice(string memory pair, uint80 roundId)
        external
        view
        returns (int256 price, uint8 decimals, uint256 timestamp)
    {
        AggregatorV3Interface priceFeed = priceFeeds[pair];
        require(address(priceFeed) != address(0), "Price feed not found");
        
        (
            uint80 id,
            int256 _price,
            uint256 startedAt,
            uint256 updatedAt,
            uint80 answeredInRound
        ) = priceFeed.getRoundData(roundId);
        
        require(_price > 0, "Invalid price");
        require(updatedAt > 0, "Price data not available");
        
        return (_price, priceFeed.decimals(), updatedAt);
    }
    
    /**
     * @dev Check if price data is fresh (not stale)
     * @param pair The trading pair name
     * @return isFresh True if price is fresh, false if stale
     */
    function isPriceFresh(string memory pair) external view returns (bool isFresh) {
        AggregatorV3Interface priceFeed = priceFeeds[pair];
        require(address(priceFeed) != address(0), "Price feed not found");
        
        (, , , uint256 updatedAt, ) = priceFeed.latestRoundData();
        
        return (block.timestamp - updatedAt <= heartbeat[pair]);
    }
    
    /**
     * @dev Get price feed description
     * @param pair The trading pair name
     * @return description The price feed description
     */
    function getPriceFeedDescription(string memory pair)
        external
        view
        returns (string memory description)
    {
        AggregatorV3Interface priceFeed = priceFeeds[pair];
        require(address(priceFeed) != address(0), "Price feed not found");
        
        return priceFeed.description();
    }
    
    /**
     * @dev Get price feed version
     * @param pair The trading pair name
     * @return version The price feed version
     */
    function getPriceFeedVersion(string memory pair)
        external
        view
        returns (uint256 version)
    {
        AggregatorV3Interface priceFeed = priceFeeds[pair];
        require(address(priceFeed) != address(0), "Price feed not found");
        
        return priceFeed.version();
    }
    
    /**
     * @dev Convert price with different decimals to a standard decimal (18)
     * @param pair The trading pair name
     * @param amount The amount to convert
     * @return convertedAmount The amount converted to 18 decimals
     */
    function convertToStandardDecimals(string memory pair, int256 amount)
        external
        view
        returns (int256 convertedAmount)
    {
        AggregatorV3Interface priceFeed = priceFeeds[pair];
        require(address(priceFeed) != address(0), "Price feed not found");
        
        uint8 decimals = priceFeed.decimals();
        
        if (decimals < 18) {
            return amount * int256(10**(18 - decimals));
        } else if (decimals > 18) {
            return amount / int256(10**(decimals - 18));
        } else {
            return amount;
        }
    }
}