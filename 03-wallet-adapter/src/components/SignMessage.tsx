import { ed25519 } from '@noble/curves/ed25519.js'
import { useWallet } from '@solana/wallet-adapter-react'
import bs58 from 'bs58'
import Input from '../ui/Input'
import Button from '../ui/Button'
import { useRef, useState } from 'react'

export function SignMessage () {
  const wallet = useWallet()
  const msgRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)
  const [signature, setSignature] = useState<string | null>(null)

  async function onClick () {
    const publicKey = wallet.publicKey
    const signMessage = wallet.signMessage

    if (!publicKey) {
      alert('Please connect your wallet first.')
      return
    }

    if (!signMessage) {
      alert('Wallet does not support message signing.')
      return
    }

    if (!msgRef.current) {
      return
    }

    try {
      setLoading(true)
      const message = msgRef.current.value
      const encodedMessage = new TextEncoder().encode(message)
      const signature = await signMessage(encodedMessage)

      if (!ed25519.verify(signature, encodedMessage, publicKey.toBytes())) {
        throw new Error('Message signature invalid!')
      }

      setSignature(bs58.encode(signature))
      msgRef.current.value = ''
    } catch (error) {
      console.error('Signing failed:', error)
      alert('Signing failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  function copySignature () {
    if (signature) {
      navigator.clipboard.writeText(signature)
      alert('Signature copied to clipboard!')
    }
  }

  return (
    <div className='flex flex-col justify-center items-center p-10 gap-3'>
      <p className='text-lg font-bold'>Sign Message</p>
      <Input placeholder='Enter message' ref={msgRef} />
      <Button onClick={onClick} loading={loading}>
        Sign Message
      </Button>
      {signature && (
        <div className='flex flex-col items-center gap-2 mt-4 p-4 bg-neutral-800 rounded-lg max-w-md'>
          <p className='text-sm text-neutral-400'>Signature:</p>
          <p className='text-xs break-all text-center font-mono'>{signature}</p>
          <Button onClick={copySignature} variant='secondary'>
            Copy
          </Button>
        </div>
      )}
    </div>
  )
}
