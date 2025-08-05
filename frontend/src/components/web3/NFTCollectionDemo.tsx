import React, { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
// import { Toast } from '../ui/Toast' // TODO: Implement toast component
import { useNFTCollection } from '../../hooks/useContract'

interface NFTCollectionDemoProps {
  className?: string
}

interface NFTInfo {
  name: string
  symbol: string
  totalSupply: string
  balance: string
  baseURI: string
}

export const NFTCollectionDemo: React.FC<NFTCollectionDemoProps> = ({ className }) => {
  const { address, isConnected } = useAccount()
  const { contract, writeContract, address: contractAddress, isSupported } = useNFTCollection()
  
  const [nftInfo, setNftInfo] = useState<NFTInfo | null>(null)
  const [mintTo, setMintTo] = useState('')
  const [transferTo, setTransferTo] = useState('')
  const [tokenId, setTokenId] = useState('')
  const [whitelistAddress, setWhitelistAddress] = useState('')
  const [batchMintTo, setBatchMintTo] = useState('')
  const [batchAmount, setBatchAmount] = useState('')
  
  const [loading, setLoading] = useState<string | null>(null)
  // const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  // Load NFT information
  useEffect(() => {
    const loadNFTInfo = async () => {
      if (!contract || !address) return

      try {
        const [name, symbol, totalSupply, balance, baseURI] = await Promise.all([
          contract.name(),
          contract.symbol(),
          contract.totalSupply(),
          contract.balanceOf(address),
          contract.baseURI()
        ])

        setNftInfo({
          name,
          symbol,
          totalSupply: totalSupply.toString(),
          balance: balance.toString(),
          baseURI
        })
      } catch (error) {
        console.error('Error loading NFT info:', error)
      }
    }

    loadNFTInfo()
  }, [contract, address])

  const showToast = (message: string, type: 'success' | 'error') => {
    console.log(`[${type.toUpperCase()}]: ${message}`)
    // TODO: Implement proper toast display
  }

  const handleMint = async () => {
    if (!writeContract || !mintTo) return

    try {
      setLoading('mint')
      const tx = await (writeContract as any).mint(mintTo)
      const receipt = await tx.wait()
      
      // Find the Transfer event to get the token ID
      const transferEvent = receipt.logs.find((log: any) => 
        log.topics && log.topics[0] === '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'
      )
      
      let tokenIdMinted = 'N/A'
      if (transferEvent && transferEvent.topics && transferEvent.topics[3]) {
        tokenIdMinted = parseInt(transferEvent.topics[3], 16).toString()
      }
      
      showToast(`Successfully minted NFT #${tokenIdMinted}`, 'success')
      setMintTo('')
      
      // Reload NFT info
      if (contract && address) {
        const [totalSupply, balance] = await Promise.all([
          contract.totalSupply(),
          contract.balanceOf(address)
        ])
        setNftInfo(prev => prev ? { 
          ...prev, 
          totalSupply: totalSupply.toString(),
          balance: balance.toString() 
        } : null)
      }
    } catch (error: any) {
      console.error('Mint error:', error)
      showToast(error.message || 'Mint failed', 'error')
    } finally {
      setLoading(null)
    }
  }

  const handleBatchMint = async () => {
    if (!writeContract || !batchMintTo || !batchAmount) return

    try {
      setLoading('batchMint')
      const tx = await (writeContract as any).batchMint(batchMintTo, parseInt(batchAmount))
      await tx.wait()
      
      showToast(`Successfully batch minted ${batchAmount} NFTs`, 'success')
      setBatchMintTo('')
      setBatchAmount('')
      
      // Reload NFT info
      if (contract && address) {
        const [totalSupply, balance] = await Promise.all([
          contract.totalSupply(),
          contract.balanceOf(address)
        ])
        setNftInfo(prev => prev ? { 
          ...prev, 
          totalSupply: totalSupply.toString(),
          balance: balance.toString() 
        } : null)
      }
    } catch (error: any) {
      console.error('Batch mint error:', error)
      showToast(error.message || 'Batch mint failed', 'error')
    } finally {
      setLoading(null)
    }
  }

  const handleTransfer = async () => {
    if (!writeContract || !transferTo || !tokenId || !address) return

    try {
      setLoading('transfer')
      const tx = await (writeContract as any).safeTransferFrom(address, transferTo, tokenId)
      await tx.wait()
      
      showToast(`Successfully transferred NFT #${tokenId}`, 'success')
      setTransferTo('')
      setTokenId('')
      
      // Reload NFT info
      if (contract && address) {
        const balance = await contract.balanceOf(address)
        setNftInfo(prev => prev ? { ...prev, balance: balance.toString() } : null)
      }
    } catch (error: any) {
      console.error('Transfer error:', error)
      showToast(error.message || 'Transfer failed', 'error')
    } finally {
      setLoading(null)
    }
  }

  const handleAddToWhitelist = async () => {
    if (!writeContract || !whitelistAddress) return

    try {
      setLoading('whitelist')
      const tx = await (writeContract as any).addToWhitelist(whitelistAddress)
      await tx.wait()
      
      showToast(`Successfully added ${whitelistAddress} to whitelist`, 'success')
      setWhitelistAddress('')
    } catch (error: any) {
      console.error('Whitelist error:', error)
      showToast(error.message || 'Whitelist operation failed', 'error')
    } finally {
      setLoading(null)
    }
  }

  if (!isConnected) {
    return (
      <Card className={`p-6 ${className}`}>
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            NFT Collection Demo
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Connect your wallet to interact with the NFT Collection contract
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
            NFT Collection Demo
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            NFT Collection contract not deployed on this network
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
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <path d="M4 4h16v16H4V4z" />
                <path d="M8 8h8v8H8V8z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                NFT Collection Demo
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Interact with ERC721 NFT contract
              </p>
            </div>
          </div>

          {/* NFT Information */}
          {nftInfo && (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-3">
              <h4 className="font-medium text-gray-900 dark:text-gray-100">Collection Information</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Name:</span>
                  <span className="ml-2 font-medium text-gray-900 dark:text-gray-100">
                    {nftInfo.name}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Symbol:</span>
                  <span className="ml-2 font-medium text-gray-900 dark:text-gray-100">
                    {nftInfo.symbol}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Total Supply:</span>
                  <span className="ml-2 font-medium text-gray-900 dark:text-gray-100">
                    {nftInfo.totalSupply}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Your Balance:</span>
                  <span className="ml-2 font-medium text-gray-900 dark:text-gray-100">
                    {nftInfo.balance}
                  </span>
                </div>
              </div>
              <div className="col-span-2">
                <span className="text-gray-600 dark:text-gray-400">Base URI:</span>
                <div className="mt-1 text-xs bg-gray-100 dark:bg-gray-700 p-2 rounded font-mono break-all">
                  {nftInfo.baseURI}
                </div>
              </div>
            </div>
          )}

          {/* Single Mint Section */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900 dark:text-gray-100">Mint Single NFT</h4>
            <div className="space-y-3">
              <Input
                placeholder="Mint to address (0x...)"
                value={mintTo}
                onChange={(e) => setMintTo(e.target.value)}
              />
              <Button
                onClick={handleMint}
                disabled={!mintTo || loading === 'mint'}
                className="w-full"
              >
                {loading === 'mint' ? 'Minting...' : 'Mint NFT'}
              </Button>
            </div>
          </div>

          {/* Batch Mint Section */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900 dark:text-gray-100">Batch Mint NFTs</h4>
            <div className="space-y-3">
              <Input
                placeholder="Mint to address (0x...)"
                value={batchMintTo}
                onChange={(e) => setBatchMintTo(e.target.value)}
              />
              <Input
                placeholder="Number of NFTs to mint"
                type="number"
                min="1"
                max="10"
                value={batchAmount}
                onChange={(e) => setBatchAmount(e.target.value)}
              />
              <Button
                onClick={handleBatchMint}
                disabled={!batchMintTo || !batchAmount || loading === 'batchMint'}
                className="w-full"
                variant="secondary"
              >
                {loading === 'batchMint' ? 'Batch Minting...' : 'Batch Mint'}
              </Button>
            </div>
          </div>

          {/* Transfer Section */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900 dark:text-gray-100">Transfer NFT</h4>
            <div className="space-y-3">
              <Input
                placeholder="Transfer to address (0x...)"
                value={transferTo}
                onChange={(e) => setTransferTo(e.target.value)}
              />
              <Input
                placeholder="Token ID"
                type="number"
                value={tokenId}
                onChange={(e) => setTokenId(e.target.value)}
              />
              <Button
                onClick={handleTransfer}
                disabled={!transferTo || !tokenId || loading === 'transfer'}
                className="w-full"
                variant="outline"
              >
                {loading === 'transfer' ? 'Transferring...' : 'Transfer NFT'}
              </Button>
            </div>
          </div>

          {/* Whitelist Section */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900 dark:text-gray-100">Whitelist Management</h4>
            <div className="space-y-3">
              <Input
                placeholder="Address to whitelist (0x...)"
                value={whitelistAddress}
                onChange={(e) => setWhitelistAddress(e.target.value)}
              />
              <Button
                onClick={handleAddToWhitelist}
                disabled={!whitelistAddress || loading === 'whitelist'}
                className="w-full"
                variant="secondary"
              >
                {loading === 'whitelist' ? 'Adding...' : 'Add to Whitelist'}
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