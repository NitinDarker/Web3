import { ed25519 } from '@noble/curves/ed25519.js'
import { useWallet } from '@solana/wallet-adapter-react'
import bs58 from 'bs58'
import Input from '../ui/Input'
import Button from '../ui/Button'
import { useRef } from 'react'

export function SignMessage () {
  const wallet = useWallet()
  const msgRef = useRef<HTMLInputElement>(null)

  async function onClick () {
    const publicKey = wallet.publicKey
    const signMessage = wallet.signMessage

    if (!publicKey) {
      alert('Connect wallet first!')
      return
    }

    if (!signMessage) {
      alert('Wallet does not support message signing!')
      return
    }

    if (!msgRef.current) {
      return
    }

    const message = msgRef.current.value
    const encodedMessage = new TextEncoder().encode(message)
    const signature = await signMessage(encodedMessage)

    if (!ed25519.verify(signature, encodedMessage, publicKey.toBytes())) {
      throw new Error('Message signature invalid!')
    }

    alert(`Message signature: ${bs58.encode(signature)}`)
  }

  return (
    <div className='flex flex-col justify-center items-center p-10 gap-3'>
      <p className='text-lg font-bold'>Sign Message</p>
      <Input placeholder='Enter message' ref={msgRef} />
      <Button onClick={onClick}>Sign Message</Button>
    </div>
  )
}
