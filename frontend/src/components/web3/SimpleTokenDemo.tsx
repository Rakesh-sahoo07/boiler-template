import React, { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { formatEther, parseEther } from 'ethers'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
// import { Toast } from '../ui/Toast' // TODO: Implement toast component
import { useSimpleToken } from '../../hooks/useContract'

interface SimpleTokenDemoProps {
  className?: string
}

export const SimpleTokenDemo: React.FC<SimpleTokenDemoProps> = ({ className }) => {
  const { address, isConnected } = useAccount()
  const { contract, writeContract, address: contractAddress, isSupported } = useSimpleToken()
  
  const [tokenInfo, setTokenInfo] = useState<{
    name: string
    symbol: string
    totalSupply: string
    balance: string
    decimals: number
  } | null>(null)
  
  const [transferTo, setTransferTo] = useState('')
  const [transferAmount, setTransferAmount] = useState('')
  const [mintTo, setMintTo] = useState('')
  const [mintAmount, setMintAmount] = useState('')
  const [burnAmount, setBurnAmount] = useState('')
  
  const [loading, setLoading] = useState<string | null>(null)
  // const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  // Load token information
  useEffect(() => {
    const loadTokenInfo = async () => {
      if (!contract || !address) return

      try {
        const [name, symbol, totalSupply, balance, decimals] = await Promise.all([
          contract.name(),
          contract.symbol(),
          contract.totalSupply(),
          contract.balanceOf(address),
          contract.decimals()
        ])

        setTokenInfo({
          name,
          symbol,
          totalSupply: formatEther(totalSupply),
          balance: formatEther(balance),
          decimals: Number(decimals)
        })
      } catch (error) {
        console.error('Error loading token info:', error)
      }
    }

    loadTokenInfo()
  }, [contract, address])

  const showToast = (message: string, type: 'success' | 'error') => {
    console.log(`${type.toUpperCase()}: ${message}`)
    // TODO: Implement toast functionality
  }

  const handleTransfer = async () => {
    if (!writeContract || !transferTo || !transferAmount) return

    try {
      setLoading('transfer')
      const tx = await (writeContract as any).transfer(transferTo, parseEther(transferAmount))
      await tx.wait()
      
      showToast(`Successfully transferred ${transferAmount} tokens`, 'success')
      setTransferTo('')
      setTransferAmount('')
      
      // Reload token info
      if (contract && address) {
        const balance = await contract.balanceOf(address)
        setTokenInfo(prev => prev ? { ...prev, balance: formatEther(balance) } : null)
      }
    } catch (error: any) {
      console.error('Transfer error:', error)
      showToast(error.message || 'Transfer failed', 'error')
    } finally {
      setLoading(null)
    }
  }

  const handleMint = async () => {
    if (!writeContract || !mintTo || !mintAmount) return

    try {
      setLoading('mint')
      const tx = await (writeContract as any).mint(mintTo, parseEther(mintAmount))
      await tx.wait()
      
      showToast(`Successfully minted ${mintAmount} tokens`, 'success')
      setMintTo('')
      setMintAmount('')
      
      // Reload token info
      if (contract && address) {
        const [totalSupply, balance] = await Promise.all([
          contract.totalSupply(),
          contract.balanceOf(address)
        ])
        setTokenInfo(prev => prev ? { 
          ...prev, 
          totalSupply: formatEther(totalSupply),
          balance: formatEther(balance) 
        } : null)
      }
    } catch (error: any) {
      console.error('Mint error:', error)
      showToast(error.message || 'Mint failed', 'error')
    } finally {
      setLoading(null)
    }
  }

  const handleBurn = async () => {
    if (!writeContract || !burnAmount) return

    try {
      setLoading('burn')
      const tx = await (writeContract as any).burn(parseEther(burnAmount))
      await tx.wait()
      
      showToast(`Successfully burned ${burnAmount} tokens`, 'success')
      setBurnAmount('')
      
      // Reload token info
      if (contract && address) {
        const [totalSupply, balance] = await Promise.all([
          contract.totalSupply(),
          contract.balanceOf(address)
        ])
        setTokenInfo(prev => prev ? { 
          ...prev, 
          totalSupply: formatEther(totalSupply),
          balance: formatEther(balance) 
        } : null)
      }
    } catch (error: any) {
      console.error('Burn error:', error)
      showToast(error.message || 'Burn failed', 'error')
    } finally {
      setLoading(null)
    }
  }

  if (!isConnected) {
    return (
      <Card className={`p-6 ${className}`}>
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Simple Token Demo
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Connect your wallet to interact with the Simple Token contract
          </p>
        </div>
      </Card>
    )
  }

  if (!isSupported || !contractAddress || contractAddress === '0x0000000000000000000000000000000000000000') {
    return (
      <Card className={`p-6 ${className}`}>
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Simple Token Demo
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Simple Token contract not deployed on this network
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
            Deploy the contract or switch to a supported network
          </p>
        </div>
      </Card>
    )
  }

  return (
    <>
      <Card className={`p-6 ${className}`}>
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <circle cx="12" cy="12" r="8"/>
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Simple Token Demo
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Interact with ERC20 token contract
              </p>
            </div>
          </div>

          {/* Token Information */}
          {tokenInfo && (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-3">
              <h4 className="font-medium text-gray-900 dark:text-gray-100">Token Information</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Name:</span>
                  <span className="ml-2 font-medium text-gray-900 dark:text-gray-100">
                    {tokenInfo.name}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Symbol:</span>
                  <span className="ml-2 font-medium text-gray-900 dark:text-gray-100">
                    {tokenInfo.symbol}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Total Supply:</span>
                  <span className="ml-2 font-medium text-gray-900 dark:text-gray-100">
                    {parseFloat(tokenInfo.totalSupply).toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Your Balance:</span>
                  <span className="ml-2 font-medium text-gray-900 dark:text-gray-100">
                    {parseFloat(tokenInfo.balance).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Transfer Section */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900 dark:text-gray-100">Transfer Tokens</h4>
            <div className="space-y-3">
              <Input
                placeholder="Recipient address (0x...)"
                value={transferTo}
                onChange={(e) => setTransferTo(e.target.value)}
              />
              <Input
                placeholder="Amount to transfer"
                type="number"
                value={transferAmount}
                onChange={(e) => setTransferAmount(e.target.value)}
              />
              <Button
                onClick={handleTransfer}
                disabled={!transferTo || !transferAmount || loading === 'transfer'}
                className="w-full"
              >
                {loading === 'transfer' ? 'Transferring...' : 'Transfer'}
              </Button>
            </div>
          </div>

          {/* Mint Section (Owner only) */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900 dark:text-gray-100">Mint Tokens</h4>
            <div className="space-y-3">
              <Input
                placeholder="Mint to address (0x...)"
                value={mintTo}
                onChange={(e) => setMintTo(e.target.value)}
              />
              <Input
                placeholder="Amount to mint"
                type="number"
                value={mintAmount}
                onChange={(e) => setMintAmount(e.target.value)}
              />
              <Button
                onClick={handleMint}
                disabled={!mintTo || !mintAmount || loading === 'mint'}
                className="w-full"
                variant="secondary"
              >
                {loading === 'mint' ? 'Minting...' : 'Mint'}
              </Button>
            </div>
          </div>

          {/* Burn Section */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900 dark:text-gray-100">Burn Tokens</h4>
            <div className="space-y-3">
              <Input
                placeholder="Amount to burn"
                type="number"
                value={burnAmount}
                onChange={(e) => setBurnAmount(e.target.value)}
              />
              <Button
                onClick={handleBurn}
                disabled={!burnAmount || loading === 'burn'}
                className="w-full"
                variant="destructive"
              >
                {loading === 'burn' ? 'Burning...' : 'Burn'}
              </Button>
            </div>
          </div>

          {/* Contract Address */}
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Contract Address:</span>
              <code className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded font-mono">
                {contractAddress}
              </code>
            </div>
          </div>
        </div>
      </Card>

      {/* TODO: Add toast component */}
    </>
  )
}