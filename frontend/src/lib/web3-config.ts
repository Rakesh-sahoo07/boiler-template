import { http, createConfig } from 'wagmi'
import { mainnet, sepolia, polygon, polygonMumbai, arbitrum, optimism } from 'wagmi/chains'
import { injected, metaMask, walletConnect } from 'wagmi/connectors'

// WalletConnect Project ID - Replace with your own
// For development, we'll make WalletConnect optional
const projectId = process.env.VITE_WALLETCONNECT_PROJECT_ID || 'demo-project-id'

// Supported chains
export const chains = [
  mainnet,
  sepolia,
  polygon,
  polygonMumbai,
  arbitrum,
  optimism,
] as const

// Contract addresses for different networks
export const CONTRACT_ADDRESSES = {
  [mainnet.id]: {
    SimpleToken: '0x0000000000000000000000000000000000000000',
    NFTCollection: '0x0000000000000000000000000000000000000000',
    PriceConsumer: '0x0000000000000000000000000000000000000000',
    VRFConsumer: '0x0000000000000000000000000000000000000000',
    UpgradeableContract: '0x0000000000000000000000000000000000000000',
  },
  [sepolia.id]: {
    SimpleToken: '0x0000000000000000000000000000000000000000',
    NFTCollection: '0x0000000000000000000000000000000000000000',
    PriceConsumer: '0x0000000000000000000000000000000000000000',
    VRFConsumer: '0x0000000000000000000000000000000000000000',
    UpgradeableContract: '0x0000000000000000000000000000000000000000',
  },
  [polygon.id]: {
    SimpleToken: '0x0000000000000000000000000000000000000000',
    NFTCollection: '0x0000000000000000000000000000000000000000',
    PriceConsumer: '0x0000000000000000000000000000000000000000',
    VRFConsumer: '0x0000000000000000000000000000000000000000',
    UpgradeableContract: '0x0000000000000000000000000000000000000000',
  },
} as const

// RPC URLs
const RPC_URLS = {
  [mainnet.id]: 'https://ethereum-rpc.publicnode.com',
  [sepolia.id]: 'https://ethereum-sepolia-rpc.publicnode.com',
  [polygon.id]: 'https://polygon-rpc.com',
  [polygonMumbai.id]: 'https://rpc-mumbai.maticvigil.com',
  [arbitrum.id]: 'https://arb1.arbitrum.io/rpc',
  [optimism.id]: 'https://mainnet.optimism.io',
}

// Create connectors array
const getConnectors = () => {
  const connectors = [
    injected(),
    metaMask(),
  ]
  
  // Only add WalletConnect if we have a valid project ID
  if (projectId && projectId !== 'demo-project-id') {
    connectors.push(
      walletConnect({ 
        projectId,
        metadata: {
          name: 'Boiler Template DApp',
          description: 'Full-stack Web3 boilerplate',
          url: 'https://your-dapp.com',
          icons: ['https://your-dapp.com/icon.png']
        }
      }) as any
    )
  }
  
  return connectors
}

// Wagmi configuration
export const config = createConfig({
  chains,
  connectors: getConnectors(),
  transports: {
    [mainnet.id]: http(RPC_URLS[mainnet.id]),
    [sepolia.id]: http(RPC_URLS[sepolia.id]),
    [polygon.id]: http(RPC_URLS[polygon.id]),
    [polygonMumbai.id]: http(RPC_URLS[polygonMumbai.id]),
    [arbitrum.id]: http(RPC_URLS[arbitrum.id]),
    [optimism.id]: http(RPC_URLS[optimism.id]),
  },
})

// Network configurations
export const NETWORK_CONFIG = {
  [mainnet.id]: {
    name: 'Ethereum Mainnet',
    shortName: 'eth',
    currency: 'ETH',
    blockExplorer: 'https://etherscan.io',
    color: '#627EEA',
  },
  [sepolia.id]: {
    name: 'Sepolia Testnet',
    shortName: 'sep',
    currency: 'ETH',
    blockExplorer: 'https://sepolia.etherscan.io',
    color: '#627EEA',
  },
  [polygon.id]: {
    name: 'Polygon',
    shortName: 'matic',
    currency: 'MATIC',
    blockExplorer: 'https://polygonscan.com',
    color: '#8247E5',
  },
  [polygonMumbai.id]: {
    name: 'Mumbai Testnet',
    shortName: 'mumbai',
    currency: 'MATIC',
    blockExplorer: 'https://mumbai.polygonscan.com',
    color: '#8247E5',
  },
  [arbitrum.id]: {
    name: 'Arbitrum One',
    shortName: 'arb',
    currency: 'ETH',
    blockExplorer: 'https://arbiscan.io',
    color: '#28A0F0',
  },
  [optimism.id]: {
    name: 'Optimism',
    shortName: 'op',
    currency: 'ETH',
    blockExplorer: 'https://optimistic.etherscan.io',
    color: '#FF0420',
  },
} as const

// Contract types
export type ContractName = keyof typeof CONTRACT_ADDRESSES[typeof mainnet.id]
export type SupportedChainId = keyof typeof CONTRACT_ADDRESSES

// Helper functions
export const getContractAddress = (chainId: SupportedChainId, contractName: ContractName): string => {
  return CONTRACT_ADDRESSES[chainId]?.[contractName] || '0x0000000000000000000000000000000000000000'
}

export const getNetworkConfig = (chainId: number) => {
  return NETWORK_CONFIG[chainId as SupportedChainId]
}

export const isChainSupported = (chainId: number): chainId is SupportedChainId => {
  return chainId in CONTRACT_ADDRESSES
}