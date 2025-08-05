import React from 'react'
import { useSimpleWeb3 } from '../../contexts/SimpleWeb3Context'
import { Button } from '../ui/Button'

export const SimpleWalletConnect: React.FC = () => {
  const { isConnected, address, chainId, connect, disconnect } = useSimpleWeb3()

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  const getNetworkName = (chainId: number) => {
    switch (chainId) {
      case 1: return 'Ethereum'
      case 11155111: return 'Sepolia'
      case 137: return 'Polygon'
      case 80001: return 'Mumbai'
      default: return `Chain ${chainId}`
    }
  }

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-4">
        <div className="text-sm">
          <div className="font-medium">{formatAddress(address)}</div>
          {chainId && (
            <div className="text-muted-foreground">{getNetworkName(chainId)}</div>
          )}
        </div>
        <Button variant="outline" size="sm" onClick={disconnect}>
          Disconnect
        </Button>
      </div>
    )
  }

  return (
    <Button onClick={connect}>
      Connect Wallet
    </Button>
  )
}