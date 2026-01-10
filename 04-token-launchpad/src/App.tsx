import '@solana/wallet-adapter-react-ui/styles.css'
import { Toaster } from 'react-hot-toast'
import { NetworkProvider } from './context/NetworkContext'
import Launchpad from './components/Launchpad'
import './App.css'

export default function App () {
  return (
    <NetworkProvider>
      <Launchpad />
      <Toaster position='bottom-right' />
    </NetworkProvider>
  )
}
