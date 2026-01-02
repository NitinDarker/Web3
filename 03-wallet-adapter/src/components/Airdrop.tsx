import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { LAMPORTS_PER_SOL } from '@solana/web3.js'
import { useRef } from 'react'

export default function Airdrop () {
  const wallet = useWallet()
  const { connection } = useConnection()
  const publicKey = wallet.publicKey
  const airdropCount = useRef<HTMLInputElement>(null)

  async function sendAirdrop () {
    if (!publicKey) {
      alert('Connect wallet first!')
      return
    }

    if (!airdropCount.current) {
      alert('Enter an amount first!')
      return
    }

    const sol = Number(airdropCount.current.value)
    const drop = await connection.requestAirdrop(
      publicKey,
      sol * LAMPORTS_PER_SOL
    )
    console.log(drop)
  }

  return (
    <div className='flex flex-col justify-center items-center p-10 pb-0 w-screen gap-3 trasition-all'>
      <div>
        <p className='text-center'>Hi</p>
        {publicKey !== null ? (
          <p>Your Public Key: {publicKey?.toString()}</p>
        ) : (
          <p>Connect to a wallet first</p>
        )}
      </div>
      <input
        className='border border-neutral-400 rounded-lg p-1 text-sm w-lg'
        type='text'
        placeholder='Enter amount'
        ref={airdropCount}
      ></input>
      <button
        onClick={sendAirdrop}
        className='w-lg text-white p-1 cursor-pointer bg-violet-800 hover:scale-105 transition-all duration-700 rounded-lg'
      >
        Send Airdrop
      </button>
    </div>
  )
}
