import React, { createContext, useContext, useState, useEffect } from 'react'

// Simple Web3 Context without complex dependencies
interface SimpleWeb3ContextType {
  isConnected: boolean
  address: string | null
  chainId: number | null
  connect: () => Promise<void>
  disconnect: () => void
}

const SimpleWeb3Context = createContext<SimpleWeb3ContextType>({
  isConnected: false,
  address: null,
  chainId: null,
  connect: async () => {},
  disconnect: () => {},
})

export const useSimpleWeb3 = () => {
  const context = useContext(SimpleWeb3Context)
  if (!context) {
    throw new Error('useSimpleWeb3 must be used within a SimpleWeb3Provider')
  }
  return context
}

interface SimpleWeb3ProviderProps {
  children: React.ReactNode
}

export const SimpleWeb3Provider: React.FC<SimpleWeb3ProviderProps> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false)
  const [address, setAddress] = useState<string | null>(null)
  const [chainId, setChainId] = useState<number | null>(null)

  const connect = async () => {
    try {
      if (typeof window !== 'undefined' && window.ethereum) {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        })
        
        if (accounts.length > 0) {
          setAddress(accounts[0])
          setIsConnected(true)
          
          const chainId = await window.ethereum.request({
            method: 'eth_chainId',
          })
          setChainId(parseInt(chainId, 16))
        }
      } else {
        alert('MetaMask is not installed!')
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error)
    }
  }

  const disconnect = () => {
    setIsConnected(false)
    setAddress(null)
    setChainId(null)
  }

  // Check if already connected on load
  useEffect(() => {
    const checkConnection = async () => {
      try {
        if (typeof window !== 'undefined' && window.ethereum) {
          const accounts = await window.ethereum.request({
            method: 'eth_accounts',
          })
          
          if (accounts.length > 0) {
            setAddress(accounts[0])
            setIsConnected(true)
            
            const chainId = await window.ethereum.request({
              method: 'eth_chainId',
            })
            setChainId(parseInt(chainId, 16))
          }
        }
      } catch (error) {
        console.error('Failed to check wallet connection:', error)
      }
    }

    checkConnection()
  }, [])

  const value = {
    isConnected,
    address,
    chainId,
    connect,
    disconnect,
  }

  return (
    <SimpleWeb3Context.Provider value={value}>
      {children}
    </SimpleWeb3Context.Provider>
  )
}