import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { LAMPORTS_PER_SOL } from '@solana/web3.js'
import { useState } from 'react'

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
    <div className='flex flex-col justify-center items-center p-10 w-screen gap-3'>
      <button
        onClick={getBalance}
        className='text-sm rounded-lg w-25 h-8 hover:cursor-pointer border-2 hover:bg-neutral-600 border-neutral-600 transition-all duration-500'
      >
        {balance === null ? 'Get Balance' : 'Hide Balance'}
      </button>
      {balance !== null && (
        <div className='transition-all duration-300'>
          {balance.toString()} SOL
        </div>
      )}
    </div>
  )
}
