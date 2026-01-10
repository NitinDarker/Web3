import toast from 'react-hot-toast'
import Button from '../ui/Button'
import { copyToClipboard } from '../lib/clipboard'

interface PublicKeyCardProps {
  label: string
  publicKey: string
}

export default function PublicKeyCard ({ label, publicKey }: PublicKeyCardProps) {
  async function handleCopy () {
    const success = await copyToClipboard(publicKey)
    if (success) {
      toast.success(`${label} copied to clipboard!`)
    } else {
      toast.error('Failed to copy to clipboard')
    }
  }

  return (
    <div className='flex flex-col items-center gap-2 p-4 bg-neutral-800 rounded-lg border border-neutral-700'>
      <p className='text-sm text-neutral-400'>{label}:</p>
      <p className='text-xs break-all text-center font-mono max-w-48 text-neutral-300'>
        {publicKey}
      </p>
      <Button onClick={handleCopy} variant='secondary'>
        Copy
      </Button>
    </div>
  )
}
