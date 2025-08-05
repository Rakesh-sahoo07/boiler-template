# Web3 Integration Guide

This boilerplate provides a comprehensive Web3 integration with wallet connection, smart contract interaction, and multi-network support.

## 🚀 Features

### Wallet Connection
- **Multi-wallet support**: MetaMask, WalletConnect, and browser wallets
- **Automatic reconnection**: Maintains wallet connection across sessions
- **Connection status**: Real-time connection status and wallet information
- **Error handling**: Graceful handling of connection errors and user rejections

### Smart Contract Integration
- **Type-safe contracts**: TypeScript integration with ethers.js
- **Multi-contract support**: Ready-to-use contracts for tokens, NFTs, and DeFi
- **ABI management**: Automatic ABI extraction from compiled contracts
- **Transaction handling**: Comprehensive transaction state management

### Network Support
- **Multi-chain**: Ethereum, Polygon, Arbitrum, Optimism, and testnets
- **Network switching**: Seamless network switching with user prompts
- **Chain validation**: Automatic validation of supported networks
- **Custom networks**: Easy configuration for additional networks

## 📦 Architecture

### Web3 Context (`src/contexts/Web3Context.tsx`)
The Web3Provider wraps the application and provides Web3 functionality through Wagmi and React Query.

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
Central configuration for:
- Supported chains and networks
- Contract addresses per network
- RPC endpoints
- Wallet connectors

```typescript
import { config, CONTRACT_ADDRESSES, getContractAddress } from './lib/web3-config'

// Get contract address for current network
const tokenAddress = getContractAddress(chainId, 'SimpleToken')
```

### Contract Hooks (`src/hooks/useContract.ts`)
Type-safe hooks for interacting with smart contracts:

```typescript
import { useSimpleToken, useNFTCollection } from './hooks/useContract'

function MyComponent() {
  const { contract, writeContract, address, isSupported } = useSimpleToken()
  
  const handleMint = async () => {
    if (!writeContract) return
    
    const signer = await writeContract.runner?.provider?.getSigner()
    const contractWithSigner = writeContract.connect(signer!)
    
    const tx = await contractWithSigner.mint(recipient, amount)
    await tx.wait()
  }
}
```

### Utility Functions (`src/lib/web3-utils.ts`)
Helper functions for common Web3 operations:

```typescript
import { 
  formatAddress, 
  formatTokenAmount, 
  isValidAddress,
  getTxExplorerUrl 
} from './lib/web3-utils'

// Format address: 0x1234...5678
const formatted = formatAddress(address)

// Format token amount with decimals
const amount = formatTokenAmount(balance, 18, 4)

// Validate Ethereum address
const valid = isValidAddress(userInput)

// Get explorer URL
const explorerUrl = getTxExplorerUrl(txHash, chainId)
```

## 🛠️ Components

### WalletConnect (`src/components/web3/WalletConnect.tsx`)
Wallet connection component with modal interface:

```typescript
import { WalletConnect } from './components/web3/WalletConnect'

<WalletConnect className="my-custom-styles" />
```

### NetworkSwitch (`src/components/web3/NetworkSwitch.tsx`)
Network switching component with supported chains:

```typescript
import { NetworkSwitch } from './components/web3/NetworkSwitch'

<NetworkSwitch className="ml-2" />
```

### Web3Status (`src/components/web3/Web3Status.tsx`)
Comprehensive wallet status display:

```typescript
import { Web3Status } from './components/web3/Web3Status'

<Web3Status className="max-w-md" />
```

### Contract Demo Components
Interactive contract demonstration components:

```typescript
import { SimpleTokenDemo, NFTCollectionDemo } from './components/web3'

<SimpleTokenDemo />
<NFTCollectionDemo />
```

## 🔧 Setup Guide

### 1. Contract Deployment
Deploy your smart contracts and update the contract addresses in `src/lib/web3-config.ts`:

```typescript
export const CONTRACT_ADDRESSES = {
  [mainnet.id]: {
    SimpleToken: '0xYourTokenAddress',
    NFTCollection: '0xYourNFTAddress',
    // ... other contracts
  },
  // ... other networks
}
```

### 2. WalletConnect Configuration
Get your WalletConnect Project ID from [WalletConnect Cloud](https://cloud.walletconnect.com/) and update:

```typescript
// In src/lib/web3-config.ts
const projectId = 'YOUR_WALLETCONNECT_PROJECT_ID'
```

### 3. RPC Configuration
Update RPC URLs in `web3-config.ts` with your preferred providers:

```typescript
const RPC_URLS = {
  [mainnet.id]: 'https://your-mainnet-rpc-url',
  [sepolia.id]: 'https://your-sepolia-rpc-url',
  // ... other networks
}
```

### 4. ABI Updates
When you update smart contracts, regenerate ABIs:

```bash
npm run extract-abis
```

This runs the `scripts/extract-abis.js` script to copy ABIs from the smart-contracts folder.

## 📱 Usage Examples

### Basic Wallet Connection
```typescript
import { useAccount, useConnect, useDisconnect } from 'wagmi'

function WalletButton() {
  const { address, isConnected } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()

  if (isConnected) {
    return (
      <div>
        <p>Connected: {address}</p>
        <button onClick={() => disconnect()}>Disconnect</button>
      </div>
    )
  }

  return (
    <div>
      {connectors.map((connector) => (
        <button
          key={connector.id}
          onClick={() => connect({ connector })}
        >
          Connect {connector.name}
        </button>
      ))}
    </div>
  )
}
```

### Smart Contract Interaction
```typescript
import { useSimpleToken } from './hooks/useContract'
import { parseEther } from 'ethers'

function TokenInteraction() {
  const { contract, writeContract } = useSimpleToken()
  const [recipient, setRecipient] = useState('')
  const [amount, setAmount] = useState('')

  const handleTransfer = async () => {
    if (!writeContract || !recipient || !amount) return

    try {
      const signer = await writeContract.runner?.provider?.getSigner()
      const contractWithSigner = writeContract.connect(signer!)
      
      const tx = await contractWithSigner.transfer(
        recipient, 
        parseEther(amount)
      )
      
      const receipt = await tx.wait()
      console.log('Transaction confirmed:', receipt.hash)
    } catch (error) {
      console.error('Transfer failed:', error)
    }
  }

  return (
    <div>
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
      <button onClick={handleTransfer}>
        Transfer Tokens
      </button>
    </div>
  )
}
```

### Reading Contract Data
```typescript
import { useReadContract } from 'wagmi'
import { getContractAddress } from './lib/web3-config'
import SimpleTokenABI from './contracts/abis/SimpleToken.json'

function TokenBalance({ address }: { address: string }) {
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
```typescript
import { useSwitchChain } from 'wagmi'
import { sepolia, polygon } from 'wagmi/chains'

function NetworkSwitcher() {
  const { switchChain } = useSwitchChain()

  return (
    <div>
      <button onClick={() => switchChain({ chainId: sepolia.id })}>
        Switch to Sepolia
      </button>
      <button onClick={() => switchChain({ chainId: polygon.id })}>
        Switch to Polygon
      </button>
    </div>
  )
}
```

## 🔒 Security Best Practices

### 1. Input Validation
Always validate user inputs before sending transactions:

```typescript
import { isValidAddress, isValidAmount } from './lib/web3-utils'

const handleTransfer = async () => {
  if (!isValidAddress(recipient)) {
    showError('Invalid recipient address')
    return
  }
  
  if (!isValidAmount(amount)) {
    showError('Invalid amount')
    return
  }
  
  // Proceed with transaction
}
```

### 2. Error Handling
Implement comprehensive error handling:

```typescript
import { extractErrorMessage } from './lib/web3-utils'

try {
  const tx = await contract.someFunction()
  await tx.wait()
} catch (error) {
  const message = extractErrorMessage(error)
  showError(message)
}
```

### 3. Transaction Confirmation
Always wait for transaction confirmation:

```typescript
const tx = await contract.transfer(to, amount)
setLoading(true)

try {
  const receipt = await tx.wait()
  if (receipt.status === 1) {
    showSuccess('Transaction successful')
  } else {
    showError('Transaction failed')
  }
} finally {
  setLoading(false)
}
```

### 4. Gas Estimation
Estimate gas before transactions:

```typescript
import { estimateGas } from './lib/web3-utils'

const estimatedGas = await estimateGas(contract, 'transfer', [to, amount])
console.log('Estimated gas:', estimatedGas.toString())
```

## 🚀 Advanced Features

### Custom Network Configuration
Add custom networks to MetaMask:

```typescript
import { addNetworkToMetaMask } from './lib/web3-utils'

const addCustomNetwork = async () => {
  await addNetworkToMetaMask({
    chainId: 1337,
    chainName: 'Local Testnet',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: ['http://localhost:8545'],
    blockExplorerUrls: ['http://localhost:8545'],
  })
}
```

### Transaction Retry Logic
Implement transaction retry with higher gas:

```typescript
import { retryTransaction } from './lib/web3-utils'

try {
  const tx = await contract.transfer(to, amount)
  await tx.wait()
} catch (error) {
  if (error.code === 'UNPREDICTABLE_GAS_LIMIT') {
    // Retry with higher gas
    const retryTx = await retryTransaction(
      contract, 
      'transfer', 
      [to, amount], 
      1.5 // 50% higher gas
    )
    await retryTx.wait()
  }
}
```

### Event Listening
Listen to contract events:

```typescript
useEffect(() => {
  if (!contract) return

  const handleTransfer = (from: string, to: string, value: bigint) => {
    console.log('Transfer event:', { from, to, value: value.toString() })
  }

  contract.on('Transfer', handleTransfer)

  return () => {
    contract.off('Transfer', handleTransfer)
  }
}, [contract])
```

## 📊 Monitoring and Analytics

### Transaction Tracking
Track transaction states and user interactions:

```typescript
const [txState, setTxState] = useState<{
  hash?: string
  status: 'idle' | 'pending' | 'success' | 'error'
  error?: string
}>({ status: 'idle' })

const handleTransaction = async () => {
  try {
    setTxState({ status: 'pending' })
    
    const tx = await contract.someFunction()
    setTxState({ status: 'pending', hash: tx.hash })
    
    const receipt = await tx.wait()
    setTxState({ status: 'success', hash: tx.hash })
    
  } catch (error) {
    setTxState({ 
      status: 'error', 
      error: extractErrorMessage(error) 
    })
  }
}
```

### Performance Monitoring
Monitor Web3 performance and errors:

```typescript
const performanceLog = {
  connectionTime: 0,
  transactionTime: 0,
  errors: [] as string[],
}

// Track connection time
const startTime = Date.now()
await connect({ connector })
performanceLog.connectionTime = Date.now() - startTime
```

## 🛠️ Troubleshooting

### Common Issues

1. **MetaMask Not Detected**
   ```typescript
   if (!window.ethereum) {
     showError('MetaMask not installed')
     return
   }
   ```

2. **Wrong Network**
   ```typescript
   if (!isChainSupported(chainId)) {
     showError('Please switch to a supported network')
     return
   }
   ```

3. **Insufficient Gas**
   ```typescript
   try {
     const tx = await contract.someFunction()
   } catch (error) {
     if (error.code === 'INSUFFICIENT_FUNDS') {
       showError('Insufficient funds for gas')
     }
   }
   ```

4. **Contract Not Deployed**
   ```typescript
   if (!contractAddress || contractAddress === '0x0000000000000000000000000000000000000000') {
     showError('Contract not deployed on this network')
     return
   }
   ```

### Debug Mode
Enable debug logging:

```typescript
// In development
if (process.env.NODE_ENV === 'development') {
  console.log('Web3 Debug Info:', {
    chainId,
    address,
    contracts: CONTRACT_ADDRESSES[chainId],
  })
}
```

## 🔄 Updates and Maintenance

### Updating ABIs
When smart contracts are updated:

1. Recompile contracts in the smart-contracts folder
2. Run the ABI extraction script:
   ```bash
   npm run extract-abis
   ```

### Adding New Contracts
1. Add contract ABI to `src/contracts/abis/`
2. Update `CONTRACT_ADDRESSES` in `web3-config.ts`
3. Create contract hook in `useContract.ts`
4. Add demo component if needed

### Network Updates
To add new networks:
1. Update `chains` array in `web3-config.ts`
2. Add contract addresses for the new network
3. Update `NETWORK_CONFIG` with network details
4. Add RPC URL to `RPC_URLS`

This comprehensive Web3 integration provides a solid foundation for building modern dApps with excellent developer experience and user interface.