import { useMemo } from 'react'
import {
  ConnectionProvider,
  WalletProvider
} from '@solana/wallet-adapter-react'
import {
  WalletModalProvider,
  WalletMultiButton
} from '@solana/wallet-adapter-react-ui'
import { useNetwork } from '../context/NetworkContext'
import CreateToken from './CreateToken'
import NetworkControls from './NetworkControls'

export default function Launchpad () {
  const { endpoint, walletNetwork } = useNetwork()
  const wallets = useMemo(() => [], [walletNetwork])

  return (
    <div className='relative min-h-full text-neutral-100 bg-neutral-950'>
      <div className='absolute inset-0 bg-size-[40px_40px] bg-[linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)]' />
      <div className='absolute inset-0 pointer-events-none mask-[radial-gradient(ellipse_at_center,transparent_40%,black)] bg-neutral-950' />
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets} autoConnect>
          <WalletModalProvider>
            <div className='relative z-10'>
              <div className='flex justify-center pt-5'>
                <WalletMultiButton />
              </div>

              <div className='w-full flex justify-center items-center'>
                <div className='flex flex-col m-5 w-5xl'>
                  <div className='mb-3'>
                    <NetworkControls />
                  </div>
                  <CreateToken />
                </div>
              </div>
            </div>
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </div>
  )
}
