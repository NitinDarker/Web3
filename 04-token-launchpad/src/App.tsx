import '@solana/wallet-adapter-react-ui/styles.css'
import { Toaster } from 'react-hot-toast'
import Launchpad from './components/Launchpad'
import './App.css'

export default function App () {
  return (
    <>
      <Launchpad />
      <Toaster position='bottom-right' />
    </>
  )
}
