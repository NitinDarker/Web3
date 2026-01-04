import { useMemo } from 'react'
import {
  ConnectionProvider,
  WalletProvider
} from '@solana/wallet-adapter-react'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import {
  WalletDisconnectButton,
  WalletModalProvider,
  WalletMultiButton
} from '@solana/wallet-adapter-react-ui'
import Airdrop from './components/Airdrop'
import ShowBalance from './components/ShowBalance'
import DoTransaction from './components/DoTransaction'
import SignMessage from './components/SignMessage'
import Greet from './components/Greet'
import '@solana/wallet-adapter-react-ui/styles.css'
import './App.css'

export default function App () {
  const network = WalletAdapterNetwork.Devnet
  const wallets = useMemo(() => [], [network])

  return (
    <div className='bg-neutral-800 h-full text-neutral-300'>
      <ConnectionProvider endpoint={'https://api.devnet.solana.com'}>
        <WalletProvider wallets={wallets} autoConnect>
          <WalletModalProvider>
            <div className='flex flex-col items-center justify-center gap-3 pt-5'>
              <WalletMultiButton />
              <WalletDisconnectButton />
              <p className='text-neutral-500 text-center text-sm'>
                Connected to Devnet
              </p>
            </div>
            <Greet />
            <ShowBalance />
            <Airdrop />
            <DoTransaction />
            <SignMessage />
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </div>
  )
}
