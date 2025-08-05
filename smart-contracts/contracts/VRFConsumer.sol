// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@chainlink/contracts/src/v0.8/vrf/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/vrf/interfaces/VRFCoordinatorV2Interface.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title VRFConsumer
 * @dev A contract that uses Chainlink VRF v2 for generating random numbers
 * Features:
 * - Generate random numbers using Chainlink VRF
 * - Configurable gas limits and confirmation blocks
 * - Request tracking and fulfillment
 * - Multiple random number requests support
 * - Emergency functions for stuck requests
 */
contract VRFConsumer is VRFConsumerBaseV2, Ownable, ReentrancyGuard {
    VRFCoordinatorV2Interface private immutable COORDINATOR;
    
    // VRF Configuration
    bytes32 private keyHash;
    uint64 private subscriptionId;
    uint32 private callbackGasLimit = 2500000;
    uint16 private requestConfirmations = 3;
    uint32 private numWords = 1;
    
    // Request tracking
    mapping(uint256 => address) public requestToSender;
    mapping(uint256 => uint256[]) public requestToRandomWords;
    mapping(uint256 => bool) public requestFulfilled;
    mapping(address => uint256[]) public userRequests;
    
    uint256[] public allRequests;
    uint256 public lastRequestId;
    
    event RandomWordsRequested(
        uint256 indexed requestId,
        address indexed requester,
        uint32 numWords
    );
    
    event RandomWordsFulfilled(
        uint256 indexed requestId,
        uint256[] randomWords
    );
    
    event VRFConfigUpdated(
        bytes32 keyHash,
        uint64 subscriptionId,
        uint32 callbackGasLimit,
        uint16 requestConfirmations
    );
    
    constructor(
        address vrfCoordinator,
        bytes32 _keyHash,
        uint64 _subscriptionId,
        address initialOwner
    ) VRFConsumerBaseV2(vrfCoordinator) Ownable(initialOwner) {
        COORDINATOR = VRFCoordinatorV2Interface(vrfCoordinator);
        keyHash = _keyHash;
        subscriptionId = _subscriptionId;
    }
    
    /**
     * @dev Request random words from Chainlink VRF
     * @param _numWords Number of random words to request (max 500)
     * @return requestId The ID of the VRF request
     */
    function requestRandomWords(uint32 _numWords) 
        external 
        nonReentrant 
        returns (uint256 requestId) 
    {
        require(_numWords > 0 && _numWords <= 500, "Invalid number of words");
        
        requestId = COORDINATOR.requestRandomWords(
            keyHash,
            subscriptionId,
            requestConfirmations,
            callbackGasLimit,
            _numWords
        );
        
        // Store request information
        requestToSender[requestId] = msg.sender;
        requestFulfilled[requestId] = false;
        userRequests[msg.sender].push(requestId);
        allRequests.push(requestId);
        lastRequestId = requestId;
        
        emit RandomWordsRequested(requestId, msg.sender, _numWords);
    }
    
    /**
     * @dev Callback function used by VRF Coordinator
     * @param requestId The ID of the VRF request
     * @param randomWords The random result returned by the oracle
     */
    function fulfillRandomWords(
        uint256 requestId,
        uint256[] memory randomWords
    ) internal override {
        require(!requestFulfilled[requestId], "Request already fulfilled");
        
        requestToRandomWords[requestId] = randomWords;
        requestFulfilled[requestId] = true;
        
        emit RandomWordsFulfilled(requestId, randomWords);
    }
    
    /**
     * @dev Get random words for a specific request
     * @param requestId The request ID
     * @return randomWords Array of random words
     */
    function getRandomWords(uint256 requestId) 
        external 
        view 
        returns (uint256[] memory randomWords) 
    {
        require(requestFulfilled[requestId], "Request not yet fulfilled");
        return requestToRandomWords[requestId];
    }
    
    /**
     * @dev Get the requester of a specific request
     * @param requestId The request ID
     * @return requester Address that made the request
     */
    function getRequester(uint256 requestId) 
        external 
        view 
        returns (address requester) 
    {
        return requestToSender[requestId];
    }
    
    /**
     * @dev Check if a request has been fulfilled
     * @param requestId The request ID
     * @return fulfilled True if fulfilled, false otherwise
     */
    function isRequestFulfilled(uint256 requestId) 
        external 
        view 
        returns (bool fulfilled) 
    {
        return requestFulfilled[requestId];
    }
    
    /**
     * @dev Get all request IDs for a user
     * @param user The user address
     * @return requests Array of request IDs
     */
    function getUserRequests(address user) 
        external 
        view 
        returns (uint256[] memory requests) 
    {
        return userRequests[user];
    }
    
    /**
     * @dev Get all request IDs
     * @return requests Array of all request IDs
     */
    function getAllRequests() 
        external 
        view 
        returns (uint256[] memory requests) 
    {
        return allRequests;
    }
    
    /**
     * @dev Update VRF configuration (only owner)
     * @param _keyHash New key hash
     * @param _subscriptionId New subscription ID
     * @param _callbackGasLimit New callback gas limit
     * @param _requestConfirmations New request confirmations
     */
    function updateVRFConfig(
        bytes32 _keyHash,
        uint64 _subscriptionId,
        uint32 _callbackGasLimit,
        uint16 _requestConfirmations
    ) external onlyOwner {
        require(_callbackGasLimit >= 20000 && _callbackGasLimit <= 2500000, "Invalid gas limit");
        require(_requestConfirmations >= 3 && _requestConfirmations <= 200, "Invalid confirmations");
        
        keyHash = _keyHash;
        subscriptionId = _subscriptionId;
        callbackGasLimit = _callbackGasLimit;
        requestConfirmations = _requestConfirmations;
        
        emit VRFConfigUpdated(_keyHash, _subscriptionId, _callbackGasLimit, _requestConfirmations);
    }
    
    /**
     * @dev Get current VRF configuration
     * @return _keyHash Current key hash
     * @return _subscriptionId Current subscription ID
     * @return _callbackGasLimit Current callback gas limit
     * @return _requestConfirmations Current request confirmations
     */
    function getVRFConfig() 
        external 
        view 
        returns (
            bytes32 _keyHash,
            uint64 _subscriptionId,
            uint32 _callbackGasLimit,
            uint16 _requestConfirmations
        ) 
    {
        return (keyHash, subscriptionId, callbackGasLimit, requestConfirmations);
    }
    
    /**
     * @dev Generate a random number in a specific range
     * @param requestId The fulfilled request ID
     * @param index Index of the random word to use
     * @param min Minimum value (inclusive)
     * @param max Maximum value (inclusive)
     * @return randomNumber Random number in the specified range
     */
    function getRandomInRange(
        uint256 requestId,
        uint256 index,
        uint256 min,
        uint256 max
    ) external view returns (uint256 randomNumber) {
        require(requestFulfilled[requestId], "Request not yet fulfilled");
        require(min <= max, "Invalid range");
        require(index < requestToRandomWords[requestId].length, "Invalid index");
        
        uint256 randomWord = requestToRandomWords[requestId][index];
        return (randomWord % (max - min + 1)) + min;
    }
}