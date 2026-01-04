import { useWallet } from '@solana/wallet-adapter-react'

export default function Greet () {
  const { publicKey } = useWallet()

  return (
    <div className='flex flex-col justify-center items-center p-10 pb-0 w-full max-w-md mx-auto gap-3 transition-all'>
      <div>
        <p className='text-center font-bold'>Hi</p>
        {publicKey !== null ? (
          <p>Your Public Key: {publicKey.toString()}</p>
        ) : (
          <p className='text-red-400'>Please connect your wallet first.</p>
        )}
      </div>
    </div>
  )
}
