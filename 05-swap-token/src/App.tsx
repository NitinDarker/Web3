import { useMemo } from 'react'
import {
  ConnectionProvider,
  WalletProvider
} from '@solana/wallet-adapter-react'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import {
  WalletModalProvider,
  WalletMultiButton
} from '@solana/wallet-adapter-react-ui'
import '@solana/wallet-adapter-react-ui/styles.css'
import './App.css'
import Swap from './components/Swap'

export default function App () {
  const network = WalletAdapterNetwork.Devnet
  const wallets = useMemo(() => [], [network])

  return (
    <div className='bg-neutral-900 h-screen text-neutral-300'>
      <ConnectionProvider endpoint={'https://api.devnet.solana.com'}>
        <WalletProvider wallets={wallets} autoConnect>
          <WalletModalProvider>
            <div className='flex flex-col items-center justify-center gap-3 pt-5'>
              <WalletMultiButton />
              <p className='text-neutral-500 text-center text-sm'>
                Connected to Devnet
              </p>
            </div>
            <Swap />
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </div>
  )
}
