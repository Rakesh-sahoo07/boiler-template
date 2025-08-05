// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title NFTCollection
 * @dev A comprehensive ERC721 NFT collection with advanced features
 * Features:
 * - Enumerable (track all tokens)
 * - URI Storage (individual token URIs)
 * - Pausable functionality
 * - Burnable tokens
 * - Royalty support (EIP-2981)
 * - Batch minting
 * - Whitelist minting
 * - Public sale with configurable price
 */
contract NFTCollection is 
    ERC721, 
    ERC721Enumerable, 
    ERC721URIStorage, 
    ERC721Pausable, 
    Ownable, 
    ERC721Burnable,
    ReentrancyGuard 
{
    uint256 public constant MAX_SUPPLY = 10000;
    uint256 public constant MAX_MINT_PER_TX = 20;
    
    uint256 public mintPrice = 0.08 ether;
    uint256 public whitelistPrice = 0.05 ether;
    uint256 private _nextTokenId = 1;
    
    bool public publicSaleActive = false;
    bool public whitelistSaleActive = false;
    
    string private _baseTokenURI;
    mapping(address => bool) public whitelist;
    mapping(address => uint256) public whitelistMinted;
    uint256 public maxWhitelistMint = 5;
    
    // Royalty info
    address public royaltyReceiver;
    uint256 public royaltyPercentage = 500; // 5%
    
    event PublicSaleToggled(bool active);
    event WhitelistSaleToggled(bool active);
    event MintPriceUpdated(uint256 newPrice);
    event WhitelistPriceUpdated(uint256 newPrice);
    event BaseURIUpdated(string newBaseURI);
    event RoyaltyUpdated(address receiver, uint256 percentage);
    
    constructor(
        string memory name,
        string memory symbol,
        string memory baseTokenURI,
        address initialOwner,
        address _royaltyReceiver
    ) ERC721(name, symbol) Ownable(initialOwner) {
        _baseTokenURI = baseTokenURI;
        royaltyReceiver = _royaltyReceiver;
    }
    
    /**
     * @dev Add addresses to whitelist
     */
    function addToWhitelist(address[] calldata addresses) external onlyOwner {
        for (uint256 i = 0; i < addresses.length; i++) {
            whitelist[addresses[i]] = true;
        }
    }
    
    /**
     * @dev Remove addresses from whitelist
     */
    function removeFromWhitelist(address[] calldata addresses) external onlyOwner {
        for (uint256 i = 0; i < addresses.length; i++) {
            whitelist[addresses[i]] = false;
        }
    }
    
    /**
     * @dev Whitelist mint function
     */
    function whitelistMint(uint256 quantity) external payable nonReentrant {
        require(whitelistSaleActive, "Whitelist sale not active");
        require(whitelist[msg.sender], "Not whitelisted");
        require(quantity <= MAX_MINT_PER_TX, "Exceeds max mint per transaction");
        require(whitelistMinted[msg.sender] + quantity <= maxWhitelistMint, "Exceeds whitelist allocation");
        require(_nextTokenId + quantity - 1 <= MAX_SUPPLY, "Exceeds max supply");
        require(msg.value >= whitelistPrice * quantity, "Insufficient payment");
        
        whitelistMinted[msg.sender] += quantity;
        
        for (uint256 i = 0; i < quantity; i++) {
            _safeMint(msg.sender, _nextTokenId++);
        }
    }
    
    /**
     * @dev Public mint function
     */
    function publicMint(uint256 quantity) external payable nonReentrant {
        require(publicSaleActive, "Public sale not active");
        require(quantity <= MAX_MINT_PER_TX, "Exceeds max mint per transaction");
        require(_nextTokenId + quantity - 1 <= MAX_SUPPLY, "Exceeds max supply");
        require(msg.value >= mintPrice * quantity, "Insufficient payment");
        
        for (uint256 i = 0; i < quantity; i++) {
            _safeMint(msg.sender, _nextTokenId++);
        }
    }
    
    /**
     * @dev Owner mint function (no payment required)
     */
    function ownerMint(address to, uint256 quantity) external onlyOwner {
        require(quantity <= MAX_MINT_PER_TX, "Exceeds max mint per transaction");
        require(_nextTokenId + quantity - 1 <= MAX_SUPPLY, "Exceeds max supply");
        
        for (uint256 i = 0; i < quantity; i++) {
            _safeMint(to, _nextTokenId++);
        }
    }
    
    /**
     * @dev Set mint price for public sale
     */
    function setMintPrice(uint256 _mintPrice) external onlyOwner {
        mintPrice = _mintPrice;
        emit MintPriceUpdated(_mintPrice);
    }
    
    /**
     * @dev Set mint price for whitelist sale
     */
    function setWhitelistPrice(uint256 _whitelistPrice) external onlyOwner {
        whitelistPrice = _whitelistPrice;
        emit WhitelistPriceUpdated(_whitelistPrice);
    }
    
    /**
     * @dev Toggle public sale state
     */
    function togglePublicSale() external onlyOwner {
        publicSaleActive = !publicSaleActive;
        emit PublicSaleToggled(publicSaleActive);
    }
    
    /**
     * @dev Toggle whitelist sale state
     */
    function toggleWhitelistSale() external onlyOwner {
        whitelistSaleActive = !whitelistSaleActive;
        emit WhitelistSaleToggled(whitelistSaleActive);
    }
    
    /**
     * @dev Set base URI for metadata
     */
    function setBaseURI(string memory baseTokenURI) external onlyOwner {
        _baseTokenURI = baseTokenURI;
        emit BaseURIUpdated(baseTokenURI);
    }
    
    /**
     * @dev Set royalty info
     */
    function setRoyaltyInfo(address _receiver, uint256 _percentage) external onlyOwner {
        require(_percentage <= 1000, "Royalty percentage too high"); // Max 10%
        royaltyReceiver = _receiver;
        royaltyPercentage = _percentage;
        emit RoyaltyUpdated(_receiver, _percentage);
    }
    
    /**
     * @dev Pause contract
     */
    function pause() public onlyOwner {
        _pause();
    }
    
    /**
     * @dev Unpause contract
     */
    function unpause() public onlyOwner {
        _unpause();
    }
    
    /**
     * @dev Withdraw contract balance
     */
    function withdraw() external onlyOwner nonReentrant {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        
        (bool success, ) = payable(owner()).call{value: balance}("");
        require(success, "Withdrawal failed");
    }
    
    /**
     * @dev Get total minted tokens
     */
    function totalMinted() public view returns (uint256) {
        return _nextTokenId - 1;
    }
    
    // Override functions required by Solidity
    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }
    
    function _update(address to, uint256 tokenId, address auth)
        internal
        override(ERC721, ERC721Enumerable, ERC721Pausable)
        returns (address)
    {
        return super._update(to, tokenId, auth);
    }
    
    function _increaseBalance(address account, uint128 value)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._increaseBalance(account, value);
    }
    
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }
    
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
    
    /**
     * @dev EIP-2981 royalty info
     */
    function royaltyInfo(uint256, uint256 salePrice)
        external
        view
        returns (address receiver, uint256 royaltyAmount)
    {
        receiver = royaltyReceiver;
        royaltyAmount = (salePrice * royaltyPercentage) / 10000;
    }
}