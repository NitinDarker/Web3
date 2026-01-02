import { useRef } from 'react'
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

  async function sendTransaction () {
    if (!publicKey) {
      alert('Connect wallet first')
      return
    }

    if (!toRef.current || !amtRef.current) {
      return
    }

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
    alert('Sent ' + amt + ' SOL to ' + to)
  }

  return (
    <div className='flex flex-col justify-center items-center gap-3 w-screen pt-5'>
      <p className='text-lg font-bold'>Send SOL</p>
      <Input placeholder='To' ref={toRef} />
      <Input placeholder='SOL' ref={amtRef} />
      <Button onClick={sendTransaction}>Send SOL</Button>
    </div>
  )
}
