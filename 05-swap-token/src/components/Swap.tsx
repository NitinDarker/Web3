import { useRef, useState } from 'react'
import Input from '../ui/Input'
import Button from '../ui/Button'
import Dropdown from '../ui/Dropdown'
import calculatePrice from '../lib/ultraswap'
import { useWallet } from '@solana/wallet-adapter-react'
import { LAMPORTS_PER_SOL } from '@solana/web3.js'

export default function Swap () {
  const fromRef = useRef<HTMLInputElement>(null)
  const toRef = useRef<HTMLInputElement>(null)
  const [token1, setToken1] = useState<string>('SOL')
  const [token2, setToken2] = useState<string>('SOL')
  // const apiKey = import.meta.env.VITE_JUPITER_API;
  const { publicKey } = useWallet()

  async function swapHandler () {
    calculatePrice(
      token1,
      token2,
      Number(fromRef.current?.value) * LAMPORTS_PER_SOL,
      publicKey!.toString()
    )
  }

  return (
    <div className='flex flex-col justify-center items-center mt-10 transition-all duration-200'>
      <div className='flex flex-col gap-5'>
        <h1 className='text-xl font-bold text-center'>Swap Token</h1>
        <div className='flex flex-col bg-neutral-800 gap-5 p-5 rounded-2xl border border-neutral-600'>
          <div className='flex flex-col relative'>
            <Dropdown
              value={token1}
              setValue={setToken1}
              className='absolute right-5 top-12 bg-neutral-900 p-2'
            />
            <Input
              placeholder='0'
              ref={fromRef}
              className='h-15 text-xl rounded-2xl'
              label='Sell'
              idx='1'
            />
          </div>
          <div className='flex flex-col relative'>
            <Dropdown
              value={token2}
              setValue={setToken2}
              className='absolute right-5 top-12 bg-neutral-900 p-2'
            />
            <Input
              placeholder='0'
              ref={toRef}
              className='h-15 text-xl rounded-2xl'
              label='Buy'
              idx='2'
            />
          </div>
          <Button onClick={swapHandler} className='h-10 rounded-2xl'>
            Swap
          </Button>
        </div>
      </div>
    </div>
  )
}
