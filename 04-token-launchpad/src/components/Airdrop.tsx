import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { LAMPORTS_PER_SOL } from '@solana/web3.js'
import { useRef, useState } from 'react'
import toast from 'react-hot-toast'
import Button from '../ui/Button'
import Input from '../ui/Input'

export default function Airdrop ({ onSuccess }: any) {
  const { connection } = useConnection()
  const wallet = useWallet()
  const [loading, setLoading] = useState(false)
  const airdropCount = useRef<HTMLInputElement>(null)
  const publicKey = wallet.publicKey

  async function sendAirdrop () {
    if (!publicKey) {
      toast.error('Please connect your wallet first.')
      return
    }

    if (!airdropCount.current?.value) {
      toast.error('Please enter an amount.')
      return
    }

    const sol = Number(airdropCount.current.value)
    if (isNaN(sol) || sol <= 0) {
      toast.error('Please enter a valid positive amount.')
      return
    }

    if (sol > 2) {
      toast.error('Maximum airdrop is 2 SOL per request.')
      return
    }

    try {
      setLoading(true)
      const signature = await connection.requestAirdrop(
        publicKey,
        sol * LAMPORTS_PER_SOL
      )
      await connection.confirmTransaction(signature, 'confirmed')
      toast.success(`Airdrop of ${sol} SOL successful!`)
      airdropCount.current.value = ''
      onSuccess?.()
    } catch (error) {
      console.error('Airdrop failed:', error)
      toast.error('Airdrop failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='flex flex-col gap-4'>
      <p className='text-sm text-neutral-400'>
        Request SOL tokens for testing on devnet. Maximum 2 SOL per request.
      </p>
      <Input
        placeholder='Enter amount (max 2 SOL)'
        ref={airdropCount}
        type='number'
        min='0.1'
        max='2'
        step='0.1'
      />
      <Button onClick={sendAirdrop} variant='primary' loading={loading}>
        Request Airdrop
      </Button>
    </div>
  )
}
