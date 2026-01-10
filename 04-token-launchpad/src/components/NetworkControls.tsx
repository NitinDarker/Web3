import { useState } from 'react'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import Airdrop from './Airdrop'

type NetworkType = 'devnet' | 'mainnet'

interface NetworkControlsProps {
  network: NetworkType
  setNetwork: (network: NetworkType) => void
}

export default function NetworkControls ({ network, setNetwork }: NetworkControlsProps) {
  const [isAirdropModalOpen, setIsAirdropModalOpen] = useState(false)

  return (
    <div className='relative flex items-center justify-center'>
      <div className='flex items-center gap-1 bg-neutral-800 rounded-lg p-1'>
        <button
          onClick={() => setNetwork('mainnet')}
          className={`px-3 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${
            network === 'mainnet'
              ? 'bg-violet-600 text-white'
              : 'text-neutral-400 hover:text-neutral-100'
          }`}
        >
          Mainnet
        </button>
        <button
          onClick={() => setNetwork('devnet')}
          className={`px-3 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${
            network === 'devnet'
              ? 'bg-violet-600 text-white'
              : 'text-neutral-400 hover:text-neutral-100'
          }`}
        >
          Devnet
        </button>
      </div>

      {network === 'devnet' && (
        <Button
          onClick={() => setIsAirdropModalOpen(true)}
          variant='secondary'
          className='absolute left-full ml-2 text-xs px-3 py-1 h-auto'
        >
          Airdrop
        </Button>
      )}

      <Modal
        isOpen={isAirdropModalOpen}
        onClose={() => setIsAirdropModalOpen(false)}
        title='Request Airdrop'
      >
        <Airdrop onSuccess={() => setIsAirdropModalOpen(false)} />
      </Modal>
    </div>
  )
}
