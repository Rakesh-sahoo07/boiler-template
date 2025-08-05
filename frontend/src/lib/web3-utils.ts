import { ethers } from 'ethers'

/**
 * Format an Ethereum address for display
 */
export const formatAddress = (address: string, chars = 4): string => {
  if (!address) return ''
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`
}

/**
 * Format a token amount with proper decimals
 */
export const formatTokenAmount = (
  amount: bigint | string,
  decimals: number = 18,
  displayDecimals: number = 4
): string => {
  const formatted = ethers.formatUnits(amount, decimals)
  const num = parseFloat(formatted)
  
  if (num === 0) return '0'
  if (num < 0.0001) return '< 0.0001'
  
  return num.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: displayDecimals,
  })
}

/**
 * Format a large number with K, M, B suffixes
 */
export const formatLargeNumber = (num: number): string => {
  if (num >= 1e9) {
    return (num / 1e9).toFixed(1) + 'B'
  }
  if (num >= 1e6) {
    return (num / 1e6).toFixed(1) + 'M'
  }
  if (num >= 1e3) {
    return (num / 1e3).toFixed(1) + 'K'
  }
  return num.toString()
}

/**
 * Validate Ethereum address
 */
export const isValidAddress = (address: string): boolean => {
  try {
    return ethers.isAddress(address)
  } catch {
    return false
  }
}

/**
 * Validate token amount input
 */
export const isValidAmount = (amount: string): boolean => {
  if (!amount || amount === '') return false
  
  try {
    const num = parseFloat(amount)
    return !isNaN(num) && num > 0
  } catch {
    return false
  }
}

/**
 * Parse token amount to wei
 */
export const parseTokenAmount = (amount: string, decimals: number = 18): bigint => {
  try {
    return ethers.parseUnits(amount, decimals)
  } catch (error) {
    throw new Error('Invalid amount format')
  }
}

/**
 * Get transaction explorer URL
 */
export const getTxExplorerUrl = (txHash: string, chainId: number): string => {
  const explorers: Record<number, string> = {
    1: 'https://etherscan.io/tx/',
    11155111: 'https://sepolia.etherscan.io/tx/',
    137: 'https://polygonscan.com/tx/',
    80001: 'https://mumbai.polygonscan.com/tx/',
    42161: 'https://arbiscan.io/tx/',
    10: 'https://optimistic.etherscan.io/tx/',
  }
  
  const baseUrl = explorers[chainId] || 'https://etherscan.io/tx/'
  return `${baseUrl}${txHash}`
}

/**
 * Get address explorer URL
 */
export const getAddressExplorerUrl = (address: string, chainId: number): string => {
  const explorers: Record<number, string> = {
    1: 'https://etherscan.io/address/',
    11155111: 'https://sepolia.etherscan.io/address/',
    137: 'https://polygonscan.com/address/',
    80001: 'https://mumbai.polygonscan.com/address/',
    42161: 'https://arbiscan.io/address/',
    10: 'https://optimistic.etherscan.io/address/',
  }
  
  const baseUrl = explorers[chainId] || 'https://etherscan.io/address/'
  return `${baseUrl}${address}`
}

/**
 * Wait for transaction confirmation
 */
export const waitForTransaction = async (
  provider: ethers.Provider,
  txHash: string,
  confirmations: number = 1
): Promise<ethers.TransactionReceipt | null> => {
  return provider.waitForTransaction(txHash, confirmations)
}

/**
 * Estimate gas for a transaction
 */
export const estimateGas = async (
  contract: ethers.Contract,
  method: string,
  args: any[]
): Promise<bigint> => {
  try {
    return await contract[method].estimateGas(...args)
  } catch (error) {
    console.error('Gas estimation failed:', error)
    throw new Error('Failed to estimate gas')
  }
}

/**
 * Get gas price
 */
export const getGasPrice = async (provider: ethers.Provider): Promise<bigint> => {
  const feeData = await provider.getFeeData()
  return feeData.gasPrice || 0n
}

/**
 * Format gas amount
 */
export const formatGas = (gas: bigint): string => {
  return gas.toLocaleString()
}

/**
 * Calculate transaction cost
 */
export const calculateTxCost = (gasLimit: bigint, gasPrice: bigint): string => {
  const cost = gasLimit * gasPrice
  return ethers.formatEther(cost)
}

/**
 * Retry a transaction with higher gas price
 */
export const retryTransaction = async (
  contract: ethers.Contract,
  method: string,
  args: any[],
  gasMultiplier: number = 1.2
): Promise<ethers.TransactionResponse> => {
  const estimatedGas = await estimateGas(contract, method, args)
  const provider = contract.runner?.provider as ethers.Provider
  const gasPrice = await getGasPrice(provider)
  
  const newGasPrice = BigInt(Math.floor(Number(gasPrice) * gasMultiplier))
  
  return contract[method](...args, {
    gasLimit: estimatedGas,
    gasPrice: newGasPrice,
  })
}

/**
 * Check if transaction was successful
 */
export const isTransactionSuccessful = (receipt: ethers.TransactionReceipt): boolean => {
  return receipt.status === 1
}

/**
 * Extract error message from transaction error
 */
export const extractErrorMessage = (error: any): string => {
  if (error?.reason) return error.reason
  if (error?.message) {
    // Common error patterns
    if (error.message.includes('user rejected')) {
      return 'Transaction rejected by user'
    }
    if (error.message.includes('insufficient funds')) {
      return 'Insufficient funds for transaction'
    }
    if (error.message.includes('gas too low')) {
      return 'Gas limit too low'
    }
    if (error.message.includes('nonce too low')) {
      return 'Transaction nonce too low'
    }
    if (error.message.includes('replacement underpriced')) {
      return 'Replacement transaction underpriced'
    }
    
    return error.message
  }
  
  return 'Transaction failed'
}

/**
 * Sleep utility for delays
 */
export const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Retry async function with exponential backoff
 */
export const retryWithBackoff = async <T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> => {
  let lastError: Error
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error as Error
      
      if (i === maxRetries - 1) {
        throw lastError
      }
      
      const delay = baseDelay * Math.pow(2, i)
      await sleep(delay)
    }
  }
  
  throw lastError!
}

/**
 * Debounce function for input handling
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

/**
 * Check if MetaMask is installed
 */
export const isMetaMaskInstalled = (): boolean => {
  return typeof window !== 'undefined' && typeof window.ethereum !== 'undefined'
}

/**
 * Switch to a specific network in MetaMask
 */
export const switchToNetwork = async (chainId: number): Promise<void> => {
  if (!isMetaMaskInstalled()) {
    throw new Error('MetaMask not installed')
  }

  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: `0x${chainId.toString(16)}` }],
    })
  } catch (error: any) {
    // This error code indicates that the chain has not been added to MetaMask
    if (error.code === 4902) {
      throw new Error('Network not added to wallet')
    }
    throw error
  }
}

/**
 * Add network to MetaMask
 */
export const addNetworkToMetaMask = async (networkConfig: {
  chainId: number
  chainName: string
  nativeCurrency: {
    name: string
    symbol: string
    decimals: number
  }
  rpcUrls: string[]
  blockExplorerUrls: string[]
}): Promise<void> => {
  if (!isMetaMaskInstalled()) {
    throw new Error('MetaMask not installed')
  }

  await window.ethereum.request({
    method: 'wallet_addEthereumChain',
    params: [
      {
        chainId: `0x${networkConfig.chainId.toString(16)}`,
        chainName: networkConfig.chainName,
        nativeCurrency: networkConfig.nativeCurrency,
        rpcUrls: networkConfig.rpcUrls,
        blockExplorerUrls: networkConfig.blockExplorerUrls,
      },
    ],
  })
}