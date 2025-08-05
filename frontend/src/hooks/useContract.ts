import { useMemo } from 'react'
import { useAccount, usePublicClient, useWalletClient } from 'wagmi'
import { ethers } from 'ethers'
import { getContractAddress, isChainSupported, type ContractName } from '../lib/web3-config'

// Import ABIs
import SimpleTokenABI from '../contracts/abis/SimpleToken.json'
import NFTCollectionABI from '../contracts/abis/NFTCollection.json'
import PriceConsumerABI from '../contracts/abis/PriceConsumer.json'
import VRFConsumerABI from '../contracts/abis/VRFConsumer.json'
import UpgradeableContractABI from '../contracts/abis/UpgradeableContract.json'

// ABI mapping
const CONTRACT_ABIS = {
  SimpleToken: SimpleTokenABI,
  NFTCollection: NFTCollectionABI,
  PriceConsumer: PriceConsumerABI,
  VRFConsumer: VRFConsumerABI,
  UpgradeableContract: UpgradeableContractABI,
} as const

export const useContract = (contractName: ContractName) => {
  const { address, chainId } = useAccount()
  const publicClient = usePublicClient()
  const { data: walletClient } = useWalletClient()

  const contract = useMemo(() => {
    if (!chainId || !isChainSupported(chainId)) return null

    const contractAddress = getContractAddress(chainId, contractName)
    const abi = CONTRACT_ABIS[contractName]

    if (!contractAddress || contractAddress === '0x0000000000000000000000000000000000000000') {
      return null
    }

    try {
      // For read operations, use public client
      if (publicClient) {
        const provider = new ethers.BrowserProvider(publicClient as any)
        return new ethers.Contract(contractAddress, abi, provider)
      }
    } catch (error) {
      console.error(`Error creating contract ${contractName}:`, error)
    }

    return null
  }, [contractName, chainId, publicClient])

  const writeContract = useMemo(() => {
    if (!chainId || !isChainSupported(chainId) || !walletClient || !address) return null

    const contractAddress = getContractAddress(chainId, contractName)
    const abi = CONTRACT_ABIS[contractName]

    if (!contractAddress || contractAddress === '0x0000000000000000000000000000000000000000') {
      return null
    }

    try {
      // For write operations, use wallet client
      const provider = new ethers.BrowserProvider(walletClient as any)
      return new ethers.Contract(contractAddress, abi, provider)
    } catch (error) {
      console.error(`Error creating write contract ${contractName}:`, error)
    }

    return null
  }, [contractName, chainId, walletClient, address])

  return {
    contract, // Read-only contract
    writeContract, // Contract with signer for write operations
    address: chainId && isChainSupported(chainId) ? getContractAddress(chainId, contractName) : null,
    isSupported: chainId ? isChainSupported(chainId) : false,
  }
}

// Specific contract hooks for better type safety
export const useSimpleToken = () => useContract('SimpleToken')
export const useNFTCollection = () => useContract('NFTCollection')
export const usePriceConsumer = () => useContract('PriceConsumer')
export const useVRFConsumer = () => useContract('VRFConsumer')
export const useUpgradeableContract = () => useContract('UpgradeableContract')