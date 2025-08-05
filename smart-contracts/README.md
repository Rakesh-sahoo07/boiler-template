# Smart Contracts Boilerplate

A comprehensive Solidity smart contracts boilerplate with Hardhat development environment, featuring OpenZeppelin contracts, Chainlink integrations, and best practices for modern DeFi and NFT development.

## 🏗️ Project Structure

```
smart-contracts/
├── contracts/                 # Smart contract source files
│   ├── SimpleToken.sol       # ERC20 token with mint/burn/pause
│   ├── NFTCollection.sol     # ERC721 NFT with advanced features
│   ├── PriceConsumer.sol     # Chainlink price feeds integration
│   ├── VRFConsumer.sol       # Chainlink VRF for randomness
│   ├── UpgradeableContract.sol # UUPS upgradeable ERC20
│   └── mocks/                # Mock contracts for testing
├── test/                     # Comprehensive test suites
├── scripts/                  # Deployment and interaction scripts
├── tasks/                    # Custom Hardhat tasks
├── ignition/                 # Hardhat Ignition deployment modules
├── deployments/              # Deployment artifacts (hardhat-deploy)
└── .env.example             # Environment variables template
```

## 🚀 Features

### Smart Contracts
- **SimpleToken**: Full-featured ERC20 with minting, burning, and pausing
- **NFTCollection**: Advanced ERC721 with whitelist, royalties, and batch operations
- **PriceConsumer**: Chainlink Price Feeds integration for DeFi applications
- **VRFConsumer**: Chainlink VRF v2 for provably fair randomness
- **UpgradeableContract**: UUPS upgradeable proxy pattern implementation

### Development Tools
- **Hardhat**: Modern Ethereum development environment
- **OpenZeppelin**: Battle-tested smart contract libraries
- **Chainlink**: Decentralized oracle integrations
- **Testing**: Comprehensive test suites with fixtures and mocks
- **Gas Optimization**: Gas reporter and contract size analysis
- **Upgrades**: OpenZeppelin upgrades plugin support
- **Multi-network**: Support for mainnet, testnets, and L2s

## 📦 Installation

1. **Clone and navigate to the smart-contracts directory:**
   ```bash
   cd smart-contracts
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

## 🔧 Configuration

### Environment Variables
Create a `.env` file with the following variables:

```env
# Private key for deployments (without 0x prefix)
PRIVATE_KEY=your_private_key_here

# RPC URLs
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_PROJECT_ID
MAINNET_RPC_URL=https://mainnet.infura.io/v3/YOUR_PROJECT_ID
POLYGON_RPC_URL=https://polygon-rpc.com/
ARBITRUM_RPC_URL=https://arb1.arbitrum.io/rpc
OPTIMISM_RPC_URL=https://mainnet.optimism.io

# API Keys for verification
ETHERSCAN_API_KEY=your_etherscan_api_key
POLYGONSCAN_API_KEY=your_polygonscan_api_key
BSCSCAN_API_KEY=your_bscscan_api_key
ARBISCAN_API_KEY=your_arbiscan_api_key
OPTIMISM_API_KEY=your_optimism_api_key

# Optional: Gas reporting
REPORT_GAS=true
COINMARKETCAP_API_KEY=your_coinmarketcap_api_key

# Chainlink VRF (for VRFConsumer)
VRF_SUBSCRIPTION_ID=your_vrf_subscription_id
```

## 🧪 Testing

Run the comprehensive test suite:

```bash
# Run all tests
npm run test

# Run tests with gas reporting
npm run test:gas

# Run coverage analysis
npm run coverage

# Run tests for a specific contract
npm run test test/SimpleToken.test.js
```

### Test Features
- **Fixtures**: Efficient test setup with loadFixture
- **Mocking**: Mock contracts for external dependencies
- **Coverage**: Complete line and branch coverage
- **Gas Analysis**: Gas usage reporting for optimizations

## 🚀 Deployment

### Using Hardhat Ignition (Recommended)

```bash
# Deploy SimpleToken
npx hardhat ignition deploy ignition/modules/SimpleToken.js --network sepolia

# Deploy NFTCollection
npx hardhat ignition deploy ignition/modules/NFTCollection.js --network sepolia

# Deploy with custom parameters
npx hardhat ignition deploy ignition/modules/SimpleToken.js --network sepolia --parameters '{"name": "My Token", "symbol": "MTK"}'
```

### Using Custom Tasks

```bash
# Deploy contracts using custom tasks
npx hardhat deploy-simple-token --network sepolia --name "My Token" --symbol "MTK"
npx hardhat deploy-nft --network sepolia --name "My NFT" --symbol "MNFT"
npx hardhat deploy-price-consumer --network sepolia
npx hardhat deploy-vrf-consumer --network sepolia --subscriptionid 123
npx hardhat deploy-upgradeable --network sepolia
```

### Using Legacy Scripts

```bash
# Deploy using scripts
npx hardhat run scripts/deploy.js SimpleToken --network sepolia
npx hardhat run scripts/deploy.js NFTCollection --network sepolia
```

## 🔄 Contract Upgrades

For upgradeable contracts using UUPS pattern:

```bash
# Deploy upgradeable contract
npx hardhat deploy-upgradeable --network sepolia

# Upgrade existing contract
npx hardhat run scripts/upgrade.js PROXY_ADDRESS --network sepolia
```

## 🛠️ Custom Tasks

The project includes custom Hardhat tasks for common operations:

### Account Management
```bash
# List all accounts and balances
npx hardhat accounts

# Check specific account balance
npx hardhat balance --account 0x123...

# Send ETH between accounts
npx hardhat send-eth --to 0x123... --amount 1.0
```

### Contract Interaction
```bash
# Get contract information
npx hardhat contract-info --address 0x123... --name SimpleToken

# Mint tokens
npx hardhat mint-tokens --contract 0x123... --name SimpleToken --to 0x456... --amount 1000

# Transfer tokens
npx hardhat transfer-tokens --contract 0x123... --name SimpleToken --to 0x456... --amount 100

# Pause/unpause contracts
npx hardhat pause-contract --contract 0x123... --name SimpleToken
npx hardhat unpause-contract --contract 0x123... --name SimpleToken
```

### Chainlink Integration
```bash
# Add price feed to PriceConsumer
npx hardhat add-price-feed --contract 0x123... --name "ETH/USD" --aggregator 0x456...

# Request random words from VRFConsumer
npx hardhat request-random --contract 0x123... --words 5
```

## 📊 Analysis and Optimization

### Gas Analysis
```bash
# Generate gas report
npm run test:gas

# Analyze contract sizes
npx hardhat compile
# Contract sizes are displayed automatically
```

### Security Analysis
```bash
# Install slither for static analysis
pip3 install slither-analyzer

# Run slither analysis
slither .

# Install mythril for security analysis
pip3 install mythril

# Run mythril analysis
myth analyze contracts/SimpleToken.sol
```

## 🌐 Supported Networks

The configuration supports multiple networks:

- **Mainnet**: Ethereum mainnet
- **Sepolia**: Ethereum testnet
- **Polygon**: Polygon mainnet
- **Mumbai**: Polygon testnet
- **BSC**: Binance Smart Chain
- **BSC Testnet**: Binance testnet
- **Arbitrum**: Arbitrum One
- **Optimism**: Optimism mainnet

## 📝 Contract Documentation

### SimpleToken.sol
ERC20 token with additional features:
- Minting and burning capabilities
- Pausable transfers
- Owner access control
- Full OpenZeppelin compatibility

### NFTCollection.sol
Advanced ERC721 implementation:
- Batch minting capabilities
- Whitelist functionality
- EIP-2981 royalty support
- Role-based access control
- Pausable transfers

### PriceConsumer.sol
Chainlink Price Feeds integration:
- Multiple price feed management
- Batch price retrieval
- Formatted price conversion
- Historical data access
- Emergency pause functionality

### VRFConsumer.sol
Chainlink VRF v2 implementation:
- Multiple random word requests
- Request tracking and fulfillment
- Configurable VRF parameters
- Random number range generation
- Reentrancy protection

### UpgradeableContract.sol
UUPS upgradeable token:
- Proxy pattern implementation
- Version management
- Upgrade authorization
- State preservation
- Full ERC20 compatibility

## 🔒 Security Best Practices

1. **Access Control**: All contracts implement proper access control
2. **Pausability**: Critical functions can be paused in emergencies
3. **Reentrancy Protection**: Guards against reentrancy attacks
4. **Input Validation**: Comprehensive parameter validation
5. **Upgrade Safety**: Proper upgrade mechanisms for upgradeable contracts

## 📚 Additional Resources

- [OpenZeppelin Documentation](https://docs.openzeppelin.com/)
- [Chainlink Documentation](https://docs.chain.link/)
- [Hardhat Documentation](https://hardhat.org/docs)
- [Solidity Documentation](https://docs.soliditylang.org/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Add comprehensive tests
4. Follow the existing code style
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## ⚠️ Disclaimer

These contracts are provided as-is for educational and development purposes. Always conduct thorough testing and security audits before deploying to mainnet with real funds.