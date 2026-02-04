import { useRef } from 'react'
import Input from '../ui/Input'
import Button from '../ui/Button'
import Dropdown from '../ui/Dropdown'

export default function Swap () {
  const fromRef = useRef<HTMLInputElement>(null)
  const toRef = useRef<HTMLInputElement>(null)
  // const apiKey = import.meta.env.VITE_JUPITER_API;

  async function swapHandler () {}

  return (
    <div className='flex flex-col justify-center items-center mt-10 transition-all duration-200'>
      <div className='flex flex-col gap-5'>
        <h1 className='text-xl font-bold text-center'>Swap Token</h1>
        <div className='flex flex-col bg-neutral-800 gap-5 p-5 rounded-2xl border border-neutral-600'>
          <div className='flex flex-col relative'>
            <Dropdown className='absolute right-5 top-12 bg-neutral-900 p-2' />
            <Input
              placeholder='0'
              ref={fromRef}
              className='h-15 text-xl rounded-2xl'
              label='Sell'
              idx='1'
            />
          </div>
          <Input
            placeholder='0'
            ref={toRef}
            className='h-15 text-xl rounded-2xl'
            label='Buy'
            idx='2'
          />
          <Button onClick={swapHandler} className='h-10 rounded-2xl'>
            Swap
          </Button>
        </div>
      </div>
    </div>
  )
}
