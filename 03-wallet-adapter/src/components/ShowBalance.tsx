import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { LAMPORTS_PER_SOL } from '@solana/web3.js'
import { useState } from 'react'
import Button from '../ui/Button'

export default function ShowBalance () {
  const wallet = useWallet()
  const { connection } = useConnection()
  const [balance, setBalance] = useState<Number | null>(null)
  const publicKey = wallet.publicKey

  async function getBalance () {
    if (!publicKey) {
      alert('Connect wallet first')
      return
    }

    if (balance !== null) {
      setBalance(null)
      return
    }
    const lamp = await connection.getBalance(publicKey!)
    setBalance(lamp / LAMPORTS_PER_SOL)
  }

  return (
    <div className='flex flex-col justify-center items-center pt-10 w-screen gap-3'>
      <Button onClick={getBalance} variant='secondary'>
        {balance === null ? 'Get Balance' : 'Hide Balance'}
      </Button>
      {balance !== null && (
        <div className='transition-all duration-300'>
          {balance.toString()} SOL
        </div>
      )}
    </div>
  )
}
