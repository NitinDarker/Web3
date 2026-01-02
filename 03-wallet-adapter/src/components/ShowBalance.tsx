import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { LAMPORTS_PER_SOL } from '@solana/web3.js'
import { useState } from 'react'

export default function ShowBalance () {
  const wallet = useWallet()
  const { connection } = useConnection()
  const [balance, setBalance] = useState('')

  async function getBalance () {
    if (balance) {
      setBalance('')
      return
    }
    const publicKey = wallet.publicKey
    const bal = await connection.getBalance(publicKey!)
    setBalance((bal / LAMPORTS_PER_SOL).toString() + ' SOL')
  }

  return (
    <div
      onClick={getBalance}
      className='flex flex-col justify-center items-center p-10 w-screen gap-3'
    >
      <button className='text-sm rounded-lg w-25 h-8 hover:cursor-pointer border-2 hover:bg-neutral-600 border-neutral-600 transition-all duration-500'>
        Get Balance
      </button>
      <div className='transition-all duration-300'>{balance}</div>
    </div>
  )
}
