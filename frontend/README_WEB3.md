# Web3 Frontend Integration

A complete Web3 frontend boilerplate with wallet connection, smart contract integration, and multi-network support built with React, TypeScript, ethers.js, and Wagmi.

## 🚀 Features

### ✅ **Complete Web3 Integration**
- **Multi-wallet support**: MetaMask, WalletConnect, and browser wallets
- **Multi-network support**: Ethereum, Polygon, Arbitrum, Optimism, and testnets
- **Smart contract integration**: Ready-to-use contracts with type safety
- **Real-time updates**: Live wallet status, balances, and transaction monitoring
- **Error handling**: Comprehensive error handling and user feedback

### ✅ **Developer Experience**
- **TypeScript support**: Full type safety for Web3 operations
- **Hot reloading**: Automatic ABI extraction and updates
- **Modern tooling**: Wagmi, React Query, and ethers.js v6
- **Component library**: Reusable Web3 components
- **Utility functions**: Helper functions for common Web3 operations

### ✅ **Production Ready**
- **Security best practices**: Input validation and error handling
- **Performance optimized**: Efficient state management and caching
- **Responsive design**: Mobile-friendly Web3 interfaces
- **Accessibility**: WCAG compliant components

## 📦 Quick Start

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Configure WalletConnect (Optional)
Get your project ID from [WalletConnect Cloud](https://cloud.walletconnect.com/) and update:

```typescript
// In src/lib/web3-config.ts
const projectId = 'YOUR_WALLETCONNECT_PROJECT_ID'
```

### 3. Deploy Smart Contracts
```bash
cd ../smart-contracts
npm run deploy:sepolia  # or your preferred network
```

### 4. Update Contract Addresses
After deployment, update the addresses in `src/lib/web3-config.ts`:

```typescript
export const CONTRACT_ADDRESSES = {  
  [sepolia.id]: {
    SimpleToken: '0xYourDeployedTokenAddress',
    NFTCollection: '0xYourDeployedNFTAddress',
    // ... other contracts
  },
}
```

### 5. Extract ABIs and Start Development
```bash
npm run dev:web3
```

This command will:
- Extract ABIs from deployed contracts
- Start the development server
- Enable hot reloading for contract changes

## 🏗️ Architecture

### Web3 Provider (`src/contexts/Web3Context.tsx`)
Wraps the app with Wagmi and React Query providers:

```typescript
import { Web3Provider } from './contexts/Web3Context'

function App() {
  return (
    <Web3Provider>
      <YourApp />
    </Web3Provider>
  )
}
```

### Configuration (`src/lib/web3-config.ts`)
Central configuration for networks, contracts, and connectors:

```typescript
// Supported networks
export const chains = [mainnet, sepolia, polygon, arbitrum, optimism]

// Contract addresses per network
export const CONTRACT_ADDRESSES = {
  [mainnet.id]: { SimpleToken: '0x...', NFTCollection: '0x...' },
  [sepolia.id]: { SimpleToken: '0x...', NFTCollection: '0x...' },
}

// Network configuration
export const NETWORK_CONFIG = {
  [mainnet.id]: { name: 'Ethereum', color: '#627EEA', ... },
}
```

### Contract Hooks (`src/hooks/useContract.ts`)
Type-safe contract interaction:

```typescript
export const useContract = (contractName: ContractName) => {
  // Returns read-only and write-enabled contract instances
  return { contract, writeContract, address, isSupported }
}

// Specific contract hooks
export const useSimpleToken = () => useContract('SimpleToken')
export const useNFTCollection = () => useContract('NFTCollection')
```

### Utility Functions (`src/lib/web3-utils.ts`)
Helper functions for common operations:

```typescript
// Address formatting
formatAddress('0x1234...5678') // '0x1234...5678'

// Token amount formatting  
formatTokenAmount(balance, 18, 4) // '1,234.5678'

// Address validation
isValidAddress(userInput) // boolean

// Explorer URLs
getTxExplorerUrl(txHash, chainId) // 'https://etherscan.io/tx/...'
```

## 🛠️ Components

### WalletConnect
Multi-wallet connection with modal interface:

```tsx
import { WalletConnect } from './components/web3/WalletConnect'

<WalletConnect className="custom-styles" />
```

### NetworkSwitch  
Network switching with supported chains:

```tsx
import { NetworkSwitch } from './components/web3/NetworkSwitch'

<NetworkSwitch />
```

### Web3Status
Comprehensive wallet status display:

```tsx
import { Web3Status } from './components/web3/Web3Status'

<Web3Status />
```

### Contract Demo Components
Interactive contract demonstrations:

```tsx
import { SimpleTokenDemo, NFTCollectionDemo } from './components/web3'

<SimpleTokenDemo />
<NFTCollectionDemo />
```

## 💡 Usage Examples

### Basic Wallet Connection
```tsx
import { useAccount, useConnect, useDisconnect } from 'wagmi'

function WalletButton() {
  const { address, isConnected } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()

  if (isConnected) {
    return (
      <div>
        <p>Connected: {formatAddress(address!)}</p>
        <button onClick={() => disconnect()}>Disconnect</button>
      </div>
    )
  }

  return (
    <div>
      {connectors.map(connector => (
        <button key={connector.id} onClick={() => connect({ connector })}>
          Connect {connector.name}
        </button>
      ))}
    </div>
  )
}
```

### Smart Contract Interaction
```tsx
import { useSimpleToken } from './hooks/useContract'
import { parseEther } from 'ethers'

function TokenTransfer() {
  const { writeContract } = useSimpleToken()
  const [recipient, setRecipient] = useState('')
  const [amount, setAmount] = useState('')

  const handleTransfer = async () => {
    if (!writeContract) return

    try {
      const tx = await (writeContract as any).transfer(
        recipient, 
        parseEther(amount)
      )
      await tx.wait()
      console.log('Transfer successful!')
    } catch (error) {
      console.error('Transfer failed:', error)
    }
  }

  return (
    <div className="space-y-4">
      <input 
        placeholder="Recipient address"
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
      />
      <input 
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button onClick={handleTransfer}>Transfer</button>
    </div>
  )
}
```

### Reading Contract Data
```tsx
import { useReadContract } from 'wagmi'
import { useAccount } from 'wagmi'

function TokenBalance() {
  const { address } = useAccount()
  const { data: balance } = useReadContract({
    address: getContractAddress(chainId, 'SimpleToken'),
    abi: SimpleTokenABI,
    functionName: 'balanceOf',
    args: [address],
  })

  return (
    <div>
      Balance: {balance ? formatEther(balance) : '0'} tokens
    </div>
  )
}
```

### Network Switching
```tsx
import { useSwitchChain } from 'wagmi'
import { sepolia, polygon } from 'wagmi/chains'

function NetworkSwitcher() {
  const { switchChain } = useSwitchChain()

  return (
    <div className="flex gap-2">
      <button onClick={() => switchChain({ chainId: sepolia.id })}>
        Sepolia
      </button>
      <button onClick={() => switchChain({ chainId: polygon.id })}>
        Polygon
      </button>
    </div>
  )
}
```

## 🔧 Development Workflow

### 1. Smart Contract Development
```bash
# In smart-contracts directory
npm run compile
npm run test
npm run deploy:sepolia
```

### 2. Frontend Development  
```bash
# In frontend directory
npm run extract-abis  # Extract updated ABIs
npm run dev:web3      # Start with ABI extraction
```

### 3. Production Build
```bash
npm run build:web3    # Build with latest ABIs
```

### 4. ABI Management
The `extract-abis.js` script automatically copies ABIs from the smart-contracts build artifacts:

```javascript
// Extracts ABIs for these contracts
const contracts = [
  'SimpleToken',
  'NFTCollection', 
  'PriceConsumer',
  'VRFConsumer',
  'UpgradeableContract'
]
```

## 🔒 Security Features

### Input Validation
```tsx
import { isValidAddress, isValidAmount } from './lib/web3-utils'

const validateInputs = () => {
  if (!isValidAddress(recipient)) {
    throw new Error('Invalid recipient address')
  }
  if (!isValidAmount(amount)) {
    throw new Error('Invalid amount')
  }
}
```

### Error Handling
```tsx
import { extractErrorMessage } from './lib/web3-utils'

try {
  const tx = await contract.someFunction()
  await tx.wait()
} catch (error) {
  const message = extractErrorMessage(error)
  // Handle user-friendly error message
}
```

### Transaction Safety
```tsx
// Always wait for confirmation
const tx = await contract.transfer(to, amount)
const receipt = await tx.wait()

if (receipt.status === 1) {
  // Transaction successful
} else {
  // Transaction failed
}
```

## 🌐 Multi-Network Support

### Supported Networks
- **Ethereum Mainnet** - Production deployments
- **Sepolia Testnet** - Testing and development  
- **Polygon** - Layer 2 scaling
- **Arbitrum** - Optimistic rollup
- **Optimism** - Optimistic rollup
- **Mumbai** - Polygon testnet

### Adding New Networks
1. Add to chains array in `web3-config.ts`
2. Add contract addresses for the network
3. Update `NETWORK_CONFIG` 
4. Add RPC URL to `RPC_URLS`

```typescript
// Example: Adding Avalanche
import { avalanche } from 'wagmi/chains'

export const chains = [...existingChains, avalanche]

export const CONTRACT_ADDRESSES = {
  ...existing,
  [avalanche.id]: {
    SimpleToken: '0xYourAvalancheAddress',
    // ... other contracts
  }
}
```

## 📱 Mobile Support

All Web3 components are responsive and mobile-friendly:

- **WalletConnect**: Mobile wallet integration
- **Responsive modals**: Touch-friendly interfaces
- **Mobile optimized**: Proper viewport handling
- **Progressive enhancement**: Works without wallet

## 🚀 Performance Optimization

### Efficient State Management
- **React Query**: Automatic caching and background updates
- **Wagmi hooks**: Optimized Web3 state management
- **Selective re-renders**: Minimize unnecessary updates

### Bundle Optimization
- **Tree shaking**: Only import needed functions
- **Code splitting**: Lazy load Web3 components
- **Modern build**: ES2020+ with Vite

### Caching Strategy
```tsx
// Automatic caching with React Query
const { data: balance, refetch } = useReadContract({
  address: contractAddress,
  abi: contractABI,
  functionName: 'balanceOf',
  args: [userAddress],
  // Cached for 30 seconds, refetch on window focus
})
```

## 🧪 Testing

### Component Testing
```tsx
import { render } from '@testing-library/react'
import { WalletConnect } from './WalletConnect'

test('renders wallet connect button', () => {
  const { getByText } = render(<WalletConnect />)
  expect(getByText('Connect Wallet')).toBeInTheDocument()
})
```

### Contract Testing
```tsx
// Mock wagmi hooks for testing
jest.mock('wagmi', () => ({
  useAccount: () => ({ address: '0x123...', isConnected: true }),
  useContract: () => ({ data: mockContract }),
}))
```

## 🔄 Updates and Maintenance

### Keeping Dependencies Updated
```bash
npm update ethers @wagmi/core @wagmi/connectors
```

### ABI Synchronization
Whenever smart contracts are updated:

1. Recompile contracts: `npm run compile` (in smart-contracts)
2. Extract ABIs: `npm run extract-abis` (in frontend)
3. Update contract addresses if redeployed
4. Test interactions in development

### Version Migration
Major version updates may require:
- Configuration updates
- Hook API changes  
- Component prop changes
- Breaking change adaptations

## 🐛 Troubleshooting

### Common Issues

**MetaMask Not Detected**
```tsx
if (!window.ethereum) {
  console.error('MetaMask not installed')
  // Show installation prompt
}
```

**Wrong Network**
```tsx
const { chainId } = useAccount()
if (!isChainSupported(chainId)) {
  // Show network switching prompt
}
```

**Transaction Failures**
```tsx
try {
  const tx = await contract.someFunction()
  await tx.wait()
} catch (error) {
  if (error.code === 'INSUFFICIENT_FUNDS') {
    // Show insufficient funds message
  } else if (error.code === 'USER_REJECTED') {
    // User canceled transaction
  }
}
```

**Contract Not Deployed**
```tsx
const contractAddress = getContractAddress(chainId, 'SimpleToken')
if (contractAddress === '0x0000000000000000000000000000000000000000') {
  // Contract not deployed on this network
}
```

### Debug Mode
Enable detailed logging in development:

```tsx
// Add to web3-config.ts
export const DEBUG = process.env.NODE_ENV === 'development'

// Use throughout the app
if (DEBUG) {
  console.log('Web3 State:', { chainId, address, contracts })
}
```

## 📚 Resources

### Documentation
- [Wagmi Documentation](https://wagmi.sh/)
- [ethers.js Documentation](https://docs.ethers.org/)
- [WalletConnect Documentation](https://docs.walletconnect.com/)
- [React Query Documentation](https://tanstack.com/query/)

### Examples
- [Web3 Integration Guide](./src/docs/WEB3_INTEGRATION.md)
- [Component Examples](./src/components/web3/)
- [Hook Examples](./src/hooks/useContract.ts)

### Tools
- [Hardhat](https://hardhat.org/) - Smart contract development
- [MetaMask](https://metamask.io/) - Browser wallet
- [WalletConnect](https://walletconnect.com/) - Mobile wallet connection
- [Etherscan](https://etherscan.io/) - Blockchain explorer

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/web3-enhancement`
3. Add comprehensive tests for Web3 functionality
4. Follow existing code style and patterns
5. Update documentation for new features
6. Submit a pull request

## 📄 License

This Web3 integration is part of the Boiler Template project and is licensed under the MIT License.

---

## 🎯 Next Steps

### Recommended Enhancements
1. **Add more wallets**: Coinbase Wallet, Rainbow, etc.
2. **Implement ENS**: Domain name resolution
3. **Add transaction history**: User transaction tracking
4. **Multi-signature support**: Safe wallet integration
5. **DeFi integrations**: DEX, lending protocols
6. **NFT marketplace**: Trading functionality
7. **Analytics**: User behavior tracking
8. **Push notifications**: Transaction alerts

### Production Checklist
- [ ] Configure WalletConnect Project ID
- [ ] Deploy smart contracts to production networks
- [ ] Update contract addresses in configuration
- [ ] Set up monitoring and error tracking
- [ ] Implement comprehensive error handling
- [ ] Add loading states and user feedback
- [ ] Test on multiple devices and wallets
- [ ] Optimize for performance and accessibility
- [ ] Set up CI/CD for automated deployments
- [ ] Configure environment-specific settings

This comprehensive Web3 integration provides everything needed to build modern, production-ready dApps with excellent developer experience and user interface. 🚀