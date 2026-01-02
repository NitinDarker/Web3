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
import '@solana/wallet-adapter-react-ui/styles.css'
import Airdrop from './components/Airdrop'
import './App.css'
import ShowBalance from './components/ShowBalance'
import DoTransaction from './components/DoTransaction'

export default function App () {
  const network = WalletAdapterNetwork.Devnet
  const wallets = useMemo(() => [], [network])

  return (
    <div className='bg-neutral-800 h-screen text-neutral-300'>
      <ConnectionProvider endpoint={'https://api.devnet.solana.com'}>
        <WalletProvider wallets={wallets} autoConnect>
          <WalletModalProvider>
            <div className='flex flex-col items-center justify-center gap-3 pt-5'>
              <WalletMultiButton />
              <WalletDisconnectButton />
            </div>
            <Airdrop/>
            <ShowBalance />
            <DoTransaction />
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </div>
  )
}
