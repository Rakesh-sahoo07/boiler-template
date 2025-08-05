// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20BurnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20PermitUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

/**
 * @title UpgradeableContract
 * @dev An upgradeable ERC20 token using OpenZeppelin's upgradeable contracts
 * Features:
 * - UUPS (Universal Upgradeable Proxy Standard) upgradeable
 * - All standard ERC20 features
 * - Mintable, burnable, pausable
 * - Permit functionality (EIP-2612)
 * - Version tracking
 */
contract UpgradeableContract is 
    Initializable, 
    ERC20Upgradeable, 
    ERC20BurnableUpgradeable, 
    ERC20PausableUpgradeable, 
    OwnableUpgradeable, 
    ERC20PermitUpgradeable, 
    UUPSUpgradeable 
{
    uint256 public constant MAX_SUPPLY = 1_000_000_000 * 10**18; // 1 billion tokens
    string public version;
    
    event TokensMinted(address indexed to, uint256 amount);
    event TokensBurned(address indexed from, uint256 amount);
    event ContractUpgraded(string oldVersion, string newVersion);
    
    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }
    
    /**
     * @dev Initialize the contract (replaces constructor for upgradeable contracts)
     * @param name Token name
     * @param symbol Token symbol
     * @param initialSupply Initial token supply
     * @param initialOwner Initial owner address
     * @param _version Contract version
     */
    function initialize(
        string memory name,
        string memory symbol,
        uint256 initialSupply,
        address initialOwner,
        string memory _version
    ) public initializer {
        require(initialSupply <= MAX_SUPPLY, "Initial supply exceeds max supply");
        require(initialOwner != address(0), "Invalid owner address");
        
        __ERC20_init(name, symbol);
        __ERC20Burnable_init();
        __ERC20Pausable_init();
        __Ownable_init(initialOwner);
        __ERC20Permit_init(name);
        __UUPSUpgradeable_init();
        
        version = _version;
        
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
    
    /**
     * @dev Update contract version (for tracking upgrades)
     * @param newVersion The new version string
     */
    function updateVersion(string memory newVersion) external onlyOwner {
        string memory oldVersion = version;
        version = newVersion;
        emit ContractUpgraded(oldVersion, newVersion);
    }
    
    /**
     * @dev Get contract version
     * @return The current contract version
     */
    function getVersion() external view returns (string memory) {
        return version;
    }
    
    /**
     * @dev Authorize upgrade (required by UUPSUpgradeable)
     * @param newImplementation Address of the new implementation
     */
    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}
    
    // The following functions are overrides required by Solidity.
    function _update(address from, address to, uint256 value)
        internal
        override(ERC20Upgradeable, ERC20PausableUpgradeable)
    {
        super._update(from, to, value);
    }
}