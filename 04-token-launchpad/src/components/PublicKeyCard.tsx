import Button from '../ui/Button'
import { useToast } from '../ui/Toast'
import { copyToClipboard } from '../lib/clipboard'

interface PublicKeyCardProps {
  label: string
  publicKey: string
}

export default function PublicKeyCard ({ label, publicKey }: PublicKeyCardProps) {
  const { showToast } = useToast()

  async function handleCopy () {
    const success = await copyToClipboard(publicKey)
    if (success) {
      showToast(`${label} copied to clipboard!`, 'success')
    } else {
      showToast('Failed to copy to clipboard', 'error')
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
