import { useState } from 'react'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import Airdrop from './Airdrop'

export default function NetworkControls ({ network, setNetwork }: any) {
  const [isAirdropOpen, setisAirdropOpen] = useState(false)

  return (
    <div className='relative flex items-center justify-center'>
      <div className='flex items-center gap-1 bg-neutral-800 rounded-lg p-1'>
        <button
          onClick={() => setNetwork('mainnet')}
          className={`px-3 py-1 rounded-md text-sm font-medium transition-all duration-500 cursor-pointer ${
            network === 'mainnet'
              ? 'bg-violet-700 text-white'
              : 'text-neutral-400 hover:text-neutral-100'
          }`}
        >
          Mainnet
        </button>
        <button
          onClick={() => setNetwork('devnet')}
          className={`px-3 py-1 rounded-md text-sm font-medium transition-all duration-500 cursor-pointer ${
            network === 'devnet'
              ? 'bg-violet-700 text-white'
              : 'text-neutral-400 hover:text-neutral-100'
          }`}
        >
          Devnet
        </button>
        {network === 'devnet' && (
          <Button
            onClick={() => setisAirdropOpen(true)}
            variant='secondary'
            className='absolute ml-2 left-7/12 text-sm px-3 py-1.5 rounded-lg w-auto h-auto bg-neutral-800 hover:text-neutral-300'
          >
            Request Airdrop
          </Button>
        )}
      </div>

      <Modal
        isOpen={isAirdropOpen}
        onClose={() => setisAirdropOpen(false)}
        title='Request Airdrop'
      >
        <Airdrop onSuccess={() => setisAirdropOpen(false)} />
      </Modal>
    </div>
  )
}
