import { useRef, useState } from 'react'
import Input from '../ui/Input'
import Button from '../ui/Button'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import {
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction
} from '@solana/web3.js'

export default function DoTransaction () {
  const { connection } = useConnection()
  const wallet = useWallet()
  const publicKey = wallet.publicKey
  const toRef = useRef<HTMLInputElement>(null)
  const amtRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)

  async function sendTransaction () {
    if (!publicKey) {
      alert('Please connect your wallet first.')
      return
    }

    if (!toRef.current?.value || !amtRef.current?.value) {
      alert('Please fill in all fields.')
      return
    }

    try {
      setLoading(true)
      const to = new PublicKey(toRef.current.value)
      const amt = Number(amtRef.current.value)

      const transaction = new Transaction()
      transaction.add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: to,
          lamports: amt * LAMPORTS_PER_SOL
        })
      )
      const txn = await wallet.sendTransaction(transaction, connection)
      console.log('txn:', txn)
      alert(`Successfully sent ${amt} SOL!`)
      toRef.current.value = ''
      amtRef.current.value = ''
    } catch (error) {
      console.error('Transaction failed:', error)
      alert('Transaction failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='flex flex-col justify-center items-center gap-4 w-full max-w-md mx-auto p-10 pb-0'>
      <p className='text-lg font-bold'>Send SOL</p>
      <Input placeholder='To' ref={toRef} />
      <Input placeholder='SOL' ref={amtRef} />
      <Button onClick={sendTransaction} loading={loading}>Send SOL</Button>
    </div>
  )
}
