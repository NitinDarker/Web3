import { useState } from 'react'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import toast from 'react-hot-toast'
import TokenForm from './TokenForm'
import PublicKeyCard from './PublicKeyCard'
import {
  buildCreateTokenTransaction,
  type TokenFormData
} from '../lib/createTokenTransaction'

export default function CreateToken () {
  const wallet = useWallet()
  const { connection } = useConnection()
  const [mintPublicKey, setMintPublicKey] = useState<string | null>(null)
  const [ataKey, setAtaKey] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [revokeMint, setRevokeMint] = useState<boolean>(false)
  const [revokeFreeze, setRevokeFreeze] = useState<boolean>(false)

  async function handleCreateToken (formData: TokenFormData) {
    if (!wallet.publicKey) {
      toast.error('Connect to a wallet first!')
      return
    }

    if (!wallet.signTransaction) {
      toast.error('Wallet does not support signing transactions')
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
      toast.success('Token created successfully!')
    } catch (error) {
      console.error('Token creation error:', error)
      toast.error('Transaction failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='flex flex-col justify-center items-center gap-5 border border-neutral-800 rounded-2xl p-8 transition-all duration-500 shadow-2xl shadow-black/50 bg-neutral-900'>
      <p className='font-bold text-2xl'>Solana Token Launchpad</p>

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
  )
}
