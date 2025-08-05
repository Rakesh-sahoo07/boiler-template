import React from 'react'
import { useAccount, useConnect, useConfig } from 'wagmi'
import { Card } from '../ui/Card'

export const Web3Debug: React.FC = () => {
  const { address, isConnected, chainId, status } = useAccount()
  const { connectors, connect, isPending, error } = useConnect()
  const config = useConfig()

  return (
    <Card className="p-6 space-y-4">
      <h3 className="text-lg font-semibold">Web3 Debug Information</h3>
      
      <div className="space-y-2 text-sm">
        <div>
          <strong>Status:</strong> {status}
        </div>
        <div>
          <strong>Connected:</strong> {isConnected ? 'Yes' : 'No'}
        </div>
        <div>
          <strong>Address:</strong> {address || 'None'}
        </div>
        <div>
          <strong>Chain ID:</strong> {chainId || 'None'}
        </div>
        <div>
          <strong>Pending:</strong> {isPending ? 'Yes' : 'No'}
        </div>
        <div>
          <strong>Error:</strong> {error?.message || 'None'}
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="font-medium">Available Connectors:</h4>
        {connectors.length === 0 ? (
          <p className="text-red-500">No connectors available!</p>
        ) : (
          connectors.map((connector) => (
            <div key={connector.id} className="flex items-center justify-between p-2 border rounded">
              <div>
                <strong>{connector.name}</strong> ({connector.id})
              </div>
              <button
                onClick={() => {
                  console.log('Debug: Connecting with', connector.name)
                  connect({ connector })
                }}
                className="px-2 py-1 bg-blue-500 text-white rounded text-xs"
                disabled={isPending}
              >
                {isPending ? 'Connecting...' : 'Connect'}
              </button>
            </div>
          ))
        )}
      </div>

      <div className="space-y-2">
        <h4 className="font-medium">Config Info:</h4>
        <div className="text-xs">
          <div>Chains: {config.chains.map(c => c.name).join(', ')}</div>
          <div>Connectors: {config.connectors.length}</div>
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="font-medium">Browser Info:</h4>
        <div className="text-xs">
          <div>Has ethereum: {typeof window !== 'undefined' && window.ethereum ? 'Yes' : 'No'}</div>
          <div>MetaMask: {typeof window !== 'undefined' && window.ethereum?.isMetaMask ? 'Yes' : 'No'}</div>
        </div>
      </div>
    </Card>
  )
}