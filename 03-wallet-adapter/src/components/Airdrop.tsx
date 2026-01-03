import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { LAMPORTS_PER_SOL } from '@solana/web3.js'
import { useRef, useState } from 'react'
import Button from '../ui/Button'
import Input from '../ui/Input'

export default function Airdrop () {
  const wallet = useWallet()
  const { connection } = useConnection()
  const publicKey = wallet.publicKey
  const airdropCount = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)

  async function sendAirdrop () {
    if (!publicKey) {
      alert('Please connect your wallet first.')
      return
    }

    if (!airdropCount.current) {
      alert('Please enter an amount.')
      return
    }

    const sol = Number(airdropCount.current.value)

    try {
      setLoading(true)
      const dropped = await connection.requestAirdrop(
        publicKey,
        sol * LAMPORTS_PER_SOL
      )
      console.log('dropped:', dropped)
      alert(`Airdrop of ${sol} SOL successful!`)
      airdropCount.current.value = ''
    } catch (error) {
      console.error('Airdrop failed:', error)
      alert('Airdrop failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='flex flex-col justify-center items-center p-10 pb-0 w-full max-w-md mx-auto gap-3 transition-all'>
      <div>
        <p className='text-center'>Hi</p>
        {publicKey !== null ? (
          <p>Your Public Key: {publicKey?.toString()}</p>
        ) : (
          <p className='text-red-400'>Please connect your wallet first.</p>
        )}
      </div>
      <p className='text-lg font-bold pt-5'>Request Airdrop</p>
      <Input placeholder='Enter amount' ref={airdropCount}></Input>
      <Button onClick={sendAirdrop} variant='primary' loading={loading}>
        Request Airdrop
      </Button>
    </div>
  )
}
