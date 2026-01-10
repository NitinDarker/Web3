import { createContext, useContext, useState, type ReactNode } from 'react'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'

type NetworkType = 'devnet' | 'mainnet'

interface NetworkContextType {
  network: NetworkType
  setNetwork: (network: NetworkType) => void
  endpoint: string
  walletNetwork: WalletAdapterNetwork
}

const NetworkContext = createContext<NetworkContextType | null>(null)

const ENDPOINTS: Record<NetworkType, string> = {
  devnet: 'https://api.devnet.solana.com',
  mainnet: 'https://api.mainnet-beta.solana.com'
}

export function useNetwork () {
  const context = useContext(NetworkContext)
  if (!context) {
    throw new Error('useNetwork must be used within a NetworkProvider')
  }
  return context
}

interface NetworkProviderProps {
  children: ReactNode
}

export function NetworkProvider ({ children }: NetworkProviderProps) {
  const [network, setNetwork] = useState<NetworkType>('devnet')

  const endpoint = ENDPOINTS[network]
  const walletNetwork =
    network === 'devnet'
      ? WalletAdapterNetwork.Devnet
      : WalletAdapterNetwork.Mainnet

  return (
    <NetworkContext.Provider
      value={{ network, setNetwork, endpoint, walletNetwork }}
    >
      {children}
    </NetworkContext.Provider>
  )
}
