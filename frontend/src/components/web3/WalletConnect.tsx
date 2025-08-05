import React, { useState } from 'react'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { Modal } from '../feedback/Modal'

interface WalletConnectProps {
  className?: string
}

export const WalletConnect: React.FC<WalletConnectProps> = ({ className }) => {
  const { address, isConnected } = useAccount()
  const { connectors, connect, isPending, error } = useConnect()
  const { disconnect } = useDisconnect()
  const [showModal, setShowModal] = useState(false)

  // Debug logging
  React.useEffect(() => {
    console.log('WalletConnect Debug:', {
      connectors: connectors.map(c => ({ id: c.id, name: c.name })),
      isConnected,
      address,
      isPending,
      error
    })
  }, [connectors, isConnected, address, isPending, error])

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  const handleConnect = async (connectorId: string) => {
    const connector = connectors.find(c => c.id === connectorId)
    if (connector) {
      try {
        console.log('Attempting to connect with:', connector.name)
        connect({ connector })
        setShowModal(false)
      } catch (error) {
        console.error('Connection error:', error)
      }
    }
  }

  const handleDisconnect = () => {
    disconnect()
  }

  if (isConnected && address) {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <div className="flex items-center gap-2 px-3 py-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-sm font-medium text-green-700 dark:text-green-300">
            {formatAddress(address)}
          </span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleDisconnect}
          className="text-red-600 hover:bg-red-50 hover:border-red-200 dark:text-red-400 dark:hover:bg-red-900/20"
        >
          Disconnect
        </Button>
      </div>
    )
  }

  return (
    <>
      <Button
        onClick={() => setShowModal(true)}
        disabled={isPending}
        className={className}
      >
        {isPending ? 'Connecting...' : 'Connect Wallet'}
      </Button>

      <Modal 
        open={showModal} 
        onClose={() => setShowModal(false)}
      >
        <div className="space-y-4">
          <div className="pb-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Connect Wallet
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
              Choose a wallet to connect to the dApp
            </p>
          </div>
          
          <div className="space-y-3">
            {connectors.map((connector) => (
              <Card 
                key={connector.id}
                className="p-4 cursor-pointer transition-all hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-blue-200 dark:hover:border-blue-600"
                onClick={() => handleConnect(connector.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <span className="text-white text-sm font-bold">
                        {connector.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-gray-100">
                        {connector.name}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {getConnectorDescription(connector.id)}
                      </p>
                    </div>
                  </div>
                  <div className="text-gray-400">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M8.22 2.97a.75.75 0 0 0-1.06 0L3.41 6.72a.75.75 0 0 0 1.06 1.06L7.25 5V13a.75.75 0 0 0 1.5 0V5l2.78 2.78a.75.75 0 1 0 1.06-1.06L8.22 2.97Z" />
                    </svg>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
              By connecting a wallet, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>
      </Modal>
    </>
  )
}

const getConnectorDescription = (connectorId: string): string => {
  switch (connectorId) {
    case 'injected':
      return 'Browser extension wallet'
    case 'metaMask':
      return 'Connect with MetaMask'
    case 'walletConnect':
      return 'Scan QR code with wallet'
    default:
      return 'Connect with this wallet'
  }
}