import React from 'react'
import { useAccount, useBalance, useBlockNumber } from 'wagmi'
import { Card } from '../ui/Card'
import { getNetworkConfig } from '../../lib/web3-config'
import { formatEther } from 'ethers'

interface Web3StatusProps {
  className?: string
}

export const Web3Status: React.FC<Web3StatusProps> = ({ className }) => {
  const { address, chainId, isConnected } = useAccount()
  const { data: balance } = useBalance({ address })
  const { data: blockNumber } = useBlockNumber({ watch: true })

  if (!isConnected || !address || !chainId) {
    return (
      <Card className={`p-6 ${className}`}>
        <div className="text-center">
          <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-gray-400">
              <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10"/>
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Wallet Not Connected
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Connect your wallet to view account information
          </p>
        </div>
      </Card>
    )
  }

  const networkConfig = getNetworkConfig(chainId)

  return (
    <Card className={`p-6 ${className}`}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Wallet Status
          </h3>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm text-green-600 dark:text-green-400 font-medium">
              Connected
            </span>
          </div>
        </div>

        <div className="space-y-3">
          {/* Address */}
          <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700">
            <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
              Address
            </span>
            <div className="flex items-center gap-2">
              <code className="text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded font-mono">
                {`${address.slice(0, 6)}...${address.slice(-4)}`}
              </code>
              <button
                onClick={() => navigator.clipboard.writeText(address)}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
                title="Copy address"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                  <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
                  <path d="m4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Network */}
          {networkConfig && (
            <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700">
              <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                Network
              </span>
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: networkConfig.color }}
                />
                <span className="text-sm text-gray-900 dark:text-gray-100">
                  {networkConfig.name}
                </span>
              </div>
            </div>
          )}

          {/* Balance */}
          {balance && (
            <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700">
              <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                Balance
              </span>
              <div className="text-right">
                <div className="text-sm text-gray-900 dark:text-gray-100 font-medium">
                  {parseFloat(formatEther(balance.value)).toFixed(4)} {balance.symbol}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {networkConfig?.currency}
                </div>
              </div>
            </div>
          )}

          {/* Block Number */}
          {blockNumber && (
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                Latest Block
              </span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-900 dark:text-gray-100 font-medium">
                  #{blockNumber.toString()}
                </span>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
          <div className="flex gap-2">
            {networkConfig && (
              <button
                onClick={() => window.open(`${networkConfig.blockExplorer}/address/${address}`, '_blank')}
                className="flex-1 px-3 py-2 text-xs bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-lg font-medium transition-colors"
              >
                View on Explorer
              </button>
            )}
            <button
              onClick={() => navigator.clipboard.writeText(address)}
              className="flex-1 px-3 py-2 text-xs bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg font-medium transition-colors"
            >
              Copy Address
            </button>
          </div>
        </div>
      </div>
    </Card>
  )
}