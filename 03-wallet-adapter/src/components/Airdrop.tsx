import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { LAMPORTS_PER_SOL } from '@solana/web3.js'
import { useRef } from 'react'
import Button from '../ui/Button'
import Input from '../ui/Input'

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
    const dropped = await connection.requestAirdrop(
      publicKey,
      sol * LAMPORTS_PER_SOL
    )
    console.log('dropped:', dropped)
  }

  return (
    <div className='flex flex-col justify-center items-center p-10 pb-0 w-screen gap-3 trasition-all'>
      <div>
        <p className='text-center'>Hi</p>
        {publicKey !== null ? (
          <p>Your Public Key: {publicKey?.toString()}</p>
        ) : (
          <p className='text-red-400'>Connect to a wallet first</p>
        )}
      </div>
      <Input placeholder='Enter amount' ref={airdropCount}></Input>
      <Button onClick={sendAirdrop} variant='primary'>
        Request Airdrop
      </Button>
    </div>
  )
}
