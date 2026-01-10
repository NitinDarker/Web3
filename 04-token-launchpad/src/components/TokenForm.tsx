import { useRef } from 'react'
import toast from 'react-hot-toast'
import Button from '../ui/Button'
import Input from '../ui/Input'
import Textarea from '../ui/Textarea'
import Toggle from '../ui/Toggle'
import type { TokenFormData } from '../lib/createTokenTransaction'

interface TokenFormProps {
  onSubmit: (formData: TokenFormData) => void
  isLoading: boolean
  revokeMint: boolean
  revokeFreeze: boolean
  onRevokeMintChange: (value: boolean) => void
  onRevokeFreezeChange: (value: boolean) => void
}

export default function TokenForm ({
  onSubmit,
  isLoading,
  revokeMint,
  revokeFreeze,
  onRevokeMintChange,
  onRevokeFreezeChange
}: TokenFormProps) {
  const tokenNameRef = useRef<HTMLInputElement>(null)
  const symbolRef = useRef<HTMLInputElement>(null)
  const decimalsRef = useRef<HTMLInputElement>(null)
  const initialSupplyRef = useRef<HTMLInputElement>(null)
  const imageRef = useRef<HTMLInputElement>(null)
  const descRef = useRef<HTMLTextAreaElement>(null)

  function handleSubmit () {
    const name = tokenNameRef.current?.value?.trim() ?? ''
    const symbol = symbolRef.current?.value?.trim() ?? ''
    const decimalsValue = parseInt(decimalsRef.current?.value || '9')
    const supplyValue = parseFloat(initialSupplyRef.current?.value || '1')

    if (!name) {
      toast.error('Token name is required')
      return
    }

    if (!symbol) {
      toast.error('Token symbol is required')
      return
    }

    if (isNaN(decimalsValue) || decimalsValue < 0 || decimalsValue > 9) {
      toast.error('Decimals must be between 0 and 9')
      return
    }

    if (isNaN(supplyValue) || supplyValue <= 0) {
      toast.error('Initial supply must be greater than 0')
      return
    }

    const formData: TokenFormData = {
      name,
      symbol,
      decimals: decimalsValue,
      initialSupply: supplyValue,
      imageUrl: imageRef.current?.value ?? '',
      description: descRef.current?.value ?? '',
      revokeMint,
      revokeFreeze
    }
    onSubmit(formData)
  }

  return (
    <>
      <div className='flex gap-5 w-full'>
        <Input ref={tokenNameRef} label='Token Name' placeholder='Ex: Solana' />
        <Input
          ref={decimalsRef}
          label='Decimals'
          placeholder='0-9'
          type='number'
          defaultValue={9}
        />
      </div>

      <div className='flex gap-5 w-full'>
        <Input ref={symbolRef} label='Token Symbol' placeholder='Ex: SOL' />
        <Input
          ref={initialSupplyRef}
          label='Initial Supply'
          placeholder='Enter amount'
          type='number'
          defaultValue={1}
        />
      </div>

      <div className='flex gap-5 w-full'>
        <div className='flex flex-col gap-5 flex-1'>
          <Input ref={imageRef} label='Image URL' placeholder='https://...' />
          <div className='space-y-4'>
            <Toggle
              label='Revoke Mint Authority'
              description='Prevents creating more tokens'
              checked={revokeMint}
              onChange={onRevokeMintChange}
            />
            <Toggle
              label='Revoke Freeze Authority'
              description='Prevents freezing accounts'
              checked={revokeFreeze}
              onChange={onRevokeFreezeChange}
            />
          </div>
        </div>
        <Textarea
          ref={descRef}
          label='Description'
          placeholder='A brief description of your token'
          rows={7}
        />
      </div>

      <Button
        onClick={handleSubmit}
        loading={isLoading}
        className='w-full mt-4'
      >
        Create Token
      </Button>
    </>
  )
}
