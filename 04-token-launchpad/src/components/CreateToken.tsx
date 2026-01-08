import { useState } from 'react'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import Button from '../ui/Button'
import TokenForm from './TokenForm'
import {
  buildCreateTokenTransaction,
  type TokenFormData
} from '../lib/createTokenTransaction'
import { copyToClipboard } from '../lib/clipboard'

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
      alert('Connect to a wallet first!')
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
      console.log(`Token mint created at ${result.mintAddress}`)
      console.log(`ATA created at ${result.ataAddress}`)
      console.log('Token minted successfully!')
    } catch (e) {
      console.log(e)
      alert('Token creation failed!')
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
              <div className='flex flex-col items-center gap-2 p-4 bg-neutral-800 rounded-lg border border-neutral-700'>
                <p className='text-sm text-neutral-400'>
                  Token Mint Public Key:
                </p>
                <p className='text-xs break-all text-center font-mono max-w-48 text-neutral-300'>
                  {mintPublicKey}
                </p>
                <Button
                  onClick={() =>
                    copyToClipboard(mintPublicKey, 'Token Mint Public Key')
                  }
                  variant='secondary'
                >
                  Copy
                </Button>
              </div>
            )}
            {ataKey && (
              <div className='flex flex-col items-center gap-2 p-4 bg-neutral-800 rounded-lg border border-neutral-700'>
                <p className='text-sm text-neutral-400'>
                  Associated Token Account:
                </p>
                <p className='text-xs break-all text-center font-mono max-w-48 text-neutral-300'>
                  {ataKey}
                </p>
                <Button
                  onClick={() =>
                    copyToClipboard(ataKey, 'Associated Token Account')
                  }
                  variant='secondary'
                >
                  Copy
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
