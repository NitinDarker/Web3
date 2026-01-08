import { useState } from 'react'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { SendTransactionError } from '@solana/web3.js'
import TokenForm from './TokenForm'
import PublicKeyCard from './PublicKeyCard'
import { useToast } from '../ui/Toast'
import {
  buildCreateTokenTransaction,
  type TokenFormData
} from '../lib/createTokenTransaction'

function getErrorMessage (error: unknown): string {
  if (error instanceof SendTransactionError) {
    return 'Transaction failed. Please check your wallet balance.'
  }

  if (error instanceof Error) {
    const message = error.message.toLowerCase()

    if (message.includes('user rejected')) {
      return 'Transaction cancelled by user'
    }
    if (message.includes('insufficient')) {
      return 'Insufficient SOL balance for transaction'
    }
    if (message.includes('timeout') || message.includes('timed out')) {
      return 'Transaction timed out. Please try again.'
    }
    if (message.includes('blockhash')) {
      return 'Transaction expired. Please try again.'
    }
    if (message.includes('network') || message.includes('fetch')) {
      return 'Network error. Please check your connection.'
    }
    if (message.includes('cloudinary') || message.includes('upload')) {
      return 'Failed to upload metadata. Please try again.'
    }

    return error.message
  }

  return 'An unexpected error occurred'
}

export default function CreateToken () {
  const wallet = useWallet()
  const { connection } = useConnection()
  const { showToast } = useToast()
  const [mintPublicKey, setMintPublicKey] = useState<string | null>(null)
  const [ataKey, setAtaKey] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [revokeMint, setRevokeMint] = useState<boolean>(false)
  const [revokeFreeze, setRevokeFreeze] = useState<boolean>(false)

  async function handleCreateToken (formData: TokenFormData) {
    if (!wallet.publicKey) {
      showToast('Connect to a wallet first!', 'error')
      return
    }

    if (!wallet.signTransaction) {
      showToast('Wallet does not support signing transactions', 'error')
      return
    }

    try {
      setIsLoading(true)

      const { transaction, result } = await buildCreateTokenTransaction(
        connection,
        wallet.publicKey,
        formData
      )

      const { blockhash, lastValidBlockHeight } =
        await connection.getLatestBlockhash()
      transaction.feePayer = wallet.publicKey
      transaction.recentBlockhash = blockhash
      transaction.partialSign(result.mintKeypair)

      const sig = await wallet.sendTransaction(transaction, connection)
      await connection.confirmTransaction(
        { signature: sig, blockhash, lastValidBlockHeight },
        'confirmed'
      )

      setMintPublicKey(result.mintAddress)
      setAtaKey(result.ataAddress)
      showToast('Token created successfully!', 'success')
    } catch (error) {
      console.error('Token creation error:', error)
      showToast(getErrorMessage(error), 'error')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='w-full flex justify-center items-center'>
      <div className='flex flex-col justify-center items-center gap-5 m-5 border border-neutral-800 rounded-2xl p-8 transition-all duration-500 shadow-2xl shadow-black/50 bg-neutral-900 w-5xl'>
        <p className='font-bold text-lg'>Create a new Token</p>

        <TokenForm
          onSubmit={handleCreateToken}
          isLoading={isLoading}
          revokeMint={revokeMint}
          revokeFreeze={revokeFreeze}
          onRevokeMintChange={setRevokeMint}
          onRevokeFreezeChange={setRevokeFreeze}
        />

        {(mintPublicKey || ataKey) && (
          <div className='flex gap-4 mt-4'>
            {mintPublicKey && (
              <PublicKeyCard
                label='Token Mint Public Key'
                publicKey={mintPublicKey}
              />
            )}
            {ataKey && (
              <PublicKeyCard
                label='Associated Token Account'
                publicKey={ataKey}
              />
            )}
          </div>
        )}
      </div>
    </div>
  )
}
