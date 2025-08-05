import React, { useState } from 'react'
import { useAccount, useSwitchChain } from 'wagmi'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { Modal } from '../feedback/Modal'
import { chains, getNetworkConfig, isChainSupported } from '../../lib/web3-config'

interface NetworkSwitchProps {
  className?: string
}

export const NetworkSwitch: React.FC<NetworkSwitchProps> = ({ className }) => {
  const { chainId, isConnected } = useAccount()
  const { switchChain, isPending } = useSwitchChain()
  const [showModal, setShowModal] = useState(false)

  const currentNetwork = chainId ? getNetworkConfig(chainId) : null
  const isUnsupported = chainId && !isChainSupported(chainId)

  const handleSwitchNetwork = (targetChainId: number) => {
    switchChain({ chainId: targetChainId })
    setShowModal(false)
  }

  if (!isConnected) {
    return null
  }

  return (
    <>
      <Button
        variant={isUnsupported ? "destructive" : "outline"}
        size="sm"
        onClick={() => setShowModal(true)}
        disabled={isPending}
        className={`flex items-center gap-2 ${className}`}
      >
        {currentNetwork && (
          <div 
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: currentNetwork.color }}
          />
        )}
        <span>
          {isPending ? 'Switching...' : 
           isUnsupported ? 'Unsupported Network' : 
           currentNetwork?.shortName.toUpperCase() || 'Unknown'}
        </span>
        <svg 
          width="12" 
          height="12" 
          viewBox="0 0 12 12" 
          fill="currentColor"
          className="opacity-50"
        >
          <path d="M6 8.5 2.5 5h7L6 8.5Z" />
        </svg>
      </Button>

      <Modal 
        open={showModal} 
        onClose={() => setShowModal(false)}
      >
        <div className="space-y-4">
          <div className="pb-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Select Network
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
              Choose a network to switch to
            </p>
          </div>
          
          <div className="space-y-3">
            {chains.map((chain) => {
              const networkConfig = getNetworkConfig(chain.id)
              const isCurrentNetwork = chainId === chain.id
              
              if (!networkConfig) return null

              return (
                <Card 
                  key={chain.id}
                  className={`p-4 cursor-pointer transition-all ${
                    isCurrentNetwork 
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                      : 'hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-blue-200 dark:hover:border-blue-600'
                  }`}
                  onClick={() => !isCurrentNetwork && handleSwitchNetwork(chain.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                        style={{ backgroundColor: networkConfig.color }}
                      >
                        {networkConfig.shortName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-gray-100">
                          {networkConfig.name}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {networkConfig.currency}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {isCurrentNetwork && (
                        <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                          <div className="w-2 h-2 bg-green-500 rounded-full" />
                          <span className="text-xs font-medium">Connected</span>
                        </div>
                      )}
                      {!isCurrentNetwork && (
                        <div className="text-gray-400">
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                            <path d="M8.22 2.97a.75.75 0 0 0-1.06 0L3.41 6.72a.75.75 0 0 0 1.06 1.06L7.25 5V13a.75.75 0 0 0 1.5 0V5l2.78 2.78a.75.75 0 1 0 1.06-1.06L8.22 2.97Z" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>

          {isUnsupported && (
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg">
              <div className="flex items-start gap-3">
                <div className="text-yellow-600 dark:text-yellow-400 mt-0.5">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1ZM7.25 4a.75.75 0 0 1 1.5 0v3.5a.75.75 0 0 1-1.5 0V4ZM8.75 10a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                    Unsupported Network
                  </h4>
                  <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                    Please switch to a supported network to use this dApp.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </>
  )
}