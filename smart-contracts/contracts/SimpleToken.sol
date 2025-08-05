// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";

/**
 * @title SimpleToken
 * @dev A comprehensive ERC20 token with advanced features
 * Features:
 * - Mintable by owner
 * - Burnable by token holders
 * - Pausable by owner
 * - Permit functionality (EIP-2612)
 * - Transfer restrictions when paused
 */
contract SimpleToken is ERC20, ERC20Burnable, ERC20Pausable, Ownable, ERC20Permit {
    uint256 public constant MAX_SUPPLY = 1_000_000_000 * 10**18; // 1 billion tokens
    
    event TokensMinted(address indexed to, uint256 amount);
    event TokensBurned(address indexed from, uint256 amount);
    
    constructor(
        string memory name,
        string memory symbol,
        uint256 initialSupply,
        address initialOwner
    ) ERC20(name, symbol) Ownable(initialOwner) ERC20Permit(name) {
        require(initialSupply <= MAX_SUPPLY, "Initial supply exceeds max supply");
        if (initialSupply > 0) {
            _mint(initialOwner, initialSupply);
            emit TokensMinted(initialOwner, initialSupply);
        }
    }
    
    /**
     * @dev Mint new tokens to a specified address
     * @param to The address to mint tokens to
     * @param amount The amount of tokens to mint
     */
    function mint(address to, uint256 amount) public onlyOwner {
        require(to != address(0), "Cannot mint to zero address");
        require(totalSupply() + amount <= MAX_SUPPLY, "Would exceed max supply");
        
        _mint(to, amount);
        emit TokensMinted(to, amount);
    }
    
    /**
     * @dev Pause all token transfers
     */
    function pause() public onlyOwner {
        _pause();
    }
    
    /**
     * @dev Unpause all token transfers
     */
    function unpause() public onlyOwner {
        _unpause();
    }
    
    /**
     * @dev Override burn function to emit custom event
     */
    function burn(uint256 amount) public override {
        super.burn(amount);
        emit TokensBurned(_msgSender(), amount);
    }
    
    /**
     * @dev Override burnFrom function to emit custom event
     */
    function burnFrom(address account, uint256 amount) public override {
        super.burnFrom(account, amount);
        emit TokensBurned(account, amount);
    }
    
    // The following functions are overrides required by Solidity.
    function _update(address from, address to, uint256 value)
        internal
        override(ERC20, ERC20Pausable)
    {
        super._update(from, to, value);
    }
}