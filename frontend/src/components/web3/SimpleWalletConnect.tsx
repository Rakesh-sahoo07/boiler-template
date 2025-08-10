import React from 'react'
import { useSimpleWeb3 } from '../../contexts/SimpleWeb3Context'
import { Button } from '../ui/Button'

export const SimpleWalletConnect: React.FC = () => {
  const { isConnected, address, chainId, connect, disconnect } = useSimpleWeb3()

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 4)}...${addr.slice(-4)}`
  }

  const getNetworkName = (chainId: number) => {
    switch (chainId) {
      case 1: return 'Ethereum'
      case 11155111: return 'Sepolia'
      case 137: return 'Polygon'
      case 80001: return 'Mumbai'
      case 56: return 'BNB Chain'
      default: return `Chain ${chainId}`
    }
  }

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-2 md:gap-4">
        <div className="text-xs md:text-sm">
          <div className="font-medium">{formatAddress(address)}</div>
          {chainId && (
            <div className="text-muted-foreground hidden md:block">{getNetworkName(chainId)}</div>
          )}
        </div>
        <Button variant="outline" size="sm" onClick={disconnect} className="text-xs md:text-sm px-2 md:px-4 bg-primary text-primary-foreground cursor-pointer">
          Disconnect
        </Button>
      </div>
    )
  }

  return (
    <Button onClick={connect} className="text-xs md:text-sm px-2 md:px-4 bg-primary text-primary-foreground cursor-pointer">
      Connect Wallet
    </Button>
  )
}