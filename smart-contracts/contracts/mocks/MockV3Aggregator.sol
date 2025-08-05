// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";

/**
 * @title MockV3Aggregator
 * @dev Mock implementation of Chainlink V3 Aggregator for testing purposes
 */
contract MockV3Aggregator is AggregatorV3Interface {
    uint256 public constant override version = 1;
    uint8 public override decimals;
    string public override description;

    int256 private latestAnswer;
    uint256 private latestTimestamp;
    uint256 private latestRound;

    mapping(uint256 => int256) private answers;
    mapping(uint256 => uint256) private timestamps;
    mapping(uint256 => uint256) private startedAts;

    constructor(uint8 _decimals, int256 _initialAnswer) {
        decimals = _decimals;
        description = "Mock Aggregator";
        updateAnswer(_initialAnswer);
    }

    function updateAnswer(int256 _answer) public {
        latestAnswer = _answer;
        latestTimestamp = block.timestamp;
        latestRound++;
        answers[latestRound] = _answer;
        timestamps[latestRound] = block.timestamp;
        startedAts[latestRound] = block.timestamp;
    }

    function updateRoundData(
        uint80 _roundId,
        int256 _answer,
        uint256 _timestamp,
        uint256 _startedAt
    ) public {
        answers[_roundId] = _answer;
        timestamps[_roundId] = _timestamp;
        startedAts[_roundId] = _startedAt;
    }

    function latestRoundData()
        external
        view
        override
        returns (
            uint80 roundId,
            int256 answer,
            uint256 startedAt,
            uint256 updatedAt,
            uint80 answeredInRound
        )
    {
        return (
            uint80(latestRound),
            latestAnswer,
            latestTimestamp,
            latestTimestamp,
            uint80(latestRound)
        );
    }

    function getRoundData(uint80 _roundId)
        external
        view
        override
        returns (
            uint80 roundId,
            int256 answer,
            uint256 startedAt,
            uint256 updatedAt,
            uint80 answeredInRound
        )
    {
        return (
            _roundId,
            answers[_roundId],
            startedAts[_roundId],
            timestamps[_roundId],
            _roundId
        );
    }

    function getLatestAnswer() external view returns (int256) {
        return latestAnswer;
    }

    function getLatestTimestamp() external view returns (uint256) {
        return latestTimestamp;
    }

    function getLatestRound() external view returns (uint256) {
        return latestRound;
    }

    function getAnswer(uint256 _roundId) external view returns (int256) {
        return answers[_roundId];
    }

    function getTimestamp(uint256 _roundId) external view returns (uint256) {
        return timestamps[_roundId];
    }
}