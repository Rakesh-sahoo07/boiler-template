import React, { createContext, useContext, useEffect, useState } from 'react'
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { config } from '../lib/web3-config'

// Create a query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
})

// Web3 Context
interface Web3ContextType {
  isInitialized: boolean
}

const Web3Context = createContext<Web3ContextType>({
  isInitialized: false,
})

export const useWeb3 = () => {
  const context = useContext(Web3Context)
  if (!context) {
    throw new Error('useWeb3 must be used within a Web3Provider')
  }
  return context
}

interface Web3ProviderProps {
  children: React.ReactNode
}

export const Web3Provider: React.FC<Web3ProviderProps> = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    setIsInitialized(true)
  }, [])

  return (
    <Web3Context.Provider value={{ isInitialized }}>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </WagmiProvider>
    </Web3Context.Provider>
  )
}