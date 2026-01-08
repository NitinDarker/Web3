import { useRef, useState } from 'react'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import {
  AuthorityType,
  createAssociatedTokenAccountInstruction,
  createInitializeMetadataPointerInstruction,
  createInitializeMint2Instruction,
  createMintToInstruction,
  createSetAuthorityInstruction,
  ExtensionType,
  getAssociatedTokenAddressSync,
  getMintLen,
  LENGTH_SIZE,
  TOKEN_2022_PROGRAM_ID,
  TYPE_SIZE
} from '@solana/spl-token'
import { Keypair, SystemProgram, Transaction } from '@solana/web3.js'
import {
  createInitializeInstruction,
  pack,
  type TokenMetadata
} from '@solana/spl-token-metadata'
import Button from '../ui/Button'
import Input from '../ui/Input'
import Textarea from '../ui/Textarea'
import Toggle from '../ui/Toggle'
import uploadToCloud from '../lib/uploadToCloud'

export default function CreateToken () {
  const tokenNameRef = useRef<HTMLInputElement>(null)
  const symbolRef = useRef<HTMLInputElement>(null)
  const decimalsRef = useRef<HTMLInputElement>(null)
  const initialSupplyRef = useRef<HTMLInputElement>(null)
  const imageRef = useRef<HTMLInputElement>(null)
  const descRef = useRef<HTMLTextAreaElement>(null)
  const wallet = useWallet()
  const { connection } = useConnection()
  const [mintPublicKey, setMintPublicKey] = useState<string | null>(null)
  const [ataKey, setAtaKey] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [revokeMint, setRevokeMint] = useState<boolean>(false)
  const [revokeFreeze, setRevokeFreeze] = useState<boolean>(false)

  function copyMintKey () {
    if (mintPublicKey) {
      navigator.clipboard.writeText(mintPublicKey)
      alert('Token Mint Public Key copied to clipboard!')
    }
  }

  function copyAtaKey () {
    if (ataKey) {
      navigator.clipboard.writeText(ataKey)
      alert('ATA Public Key copied to clipboard!')
    }
  }

  async function createToken () {
    if (!wallet.publicKey) {
      alert('Connect to a wallet first!')
      return
    }

    try {
      setIsLoading(true)
      const programId = TOKEN_2022_PROGRAM_ID
      const mintKey = Keypair.generate()
      const payer = wallet.publicKey
      const decimalsInput = parseInt(decimalsRef.current?.value || '9')
      const decimals =
        isNaN(decimalsInput) || decimalsInput < 0 || decimalsInput > 9
          ? 9
          : decimalsInput
      const supplyInput = parseFloat(initialSupplyRef.current?.value || '1')
      const initialSupply =
        isNaN(supplyInput) || supplyInput <= 0 ? 1 : supplyInput
      const initialAmount = initialSupply * Math.pow(10, decimals)

      const jsonData = {
        name: tokenNameRef.current?.value ?? '',
        symbol: symbolRef.current?.value ?? '',
        description: descRef.current?.value ?? '',
        image: imageRef.current?.value ?? '',
        attributes: [
          {
            trait_type: 'Item',
            value: 'Developer Portal'
          }
        ]
      }

      const URI: string = await uploadToCloud(jsonData)

      const metadata: TokenMetadata = {
        mint: mintKey.publicKey,
        name: tokenNameRef.current?.value ?? '',
        symbol: symbolRef.current?.value ?? '',
        uri: URI,
        additionalMetadata: descRef.current?.value
          ? [['description', descRef.current.value]]
          : []
      }
      console.log('Metadata:', metadata)

      const mintLen = getMintLen([ExtensionType.MetadataPointer])
      const metadataLen = TYPE_SIZE + LENGTH_SIZE + pack(metadata).length
      const lamports = await connection.getMinimumBalanceForRentExemption(
        mintLen + metadataLen
      )

      const associatedToken = getAssociatedTokenAddressSync(
        mintKey.publicKey,
        payer,
        false,
        programId
      )

      const transaction = new Transaction().add(
        SystemProgram.createAccount({
          fromPubkey: payer,
          newAccountPubkey: mintKey.publicKey,
          space: mintLen,
          lamports,
          programId
        }),
        createInitializeMetadataPointerInstruction(
          mintKey.publicKey,
          payer,
          mintKey.publicKey,
          programId
        ),
        createInitializeMint2Instruction(
          mintKey.publicKey,
          decimals,
          payer,
          revokeFreeze ? payer : null,
          programId
        ),
        createInitializeInstruction({
          programId: programId,
          mint: mintKey.publicKey,
          metadata: mintKey.publicKey,
          name: metadata.name,
          symbol: metadata.symbol,
          uri: URI,
          mintAuthority: payer,
          updateAuthority: payer
        }),
        createAssociatedTokenAccountInstruction(
          payer,
          associatedToken,
          payer,
          mintKey.publicKey,
          programId
        ),
        createMintToInstruction(
          mintKey.publicKey,
          associatedToken,
          payer,
          initialAmount,
          [],
          programId
        )
      )

      if (revokeMint) {
        transaction.add(
          createSetAuthorityInstruction(
            mintKey.publicKey,
            payer,
            AuthorityType.MintTokens,
            null,
            [],
            programId
          )
        )
      }

      if (revokeFreeze) {
        transaction.add(
          createSetAuthorityInstruction(
            mintKey.publicKey,
            payer,
            AuthorityType.FreezeAccount,
            null,
            [],
            programId
          )
        )
      }

      const { blockhash, lastValidBlockHeight } =
        await connection.getLatestBlockhash()
      transaction.feePayer = payer
      transaction.recentBlockhash = blockhash
      transaction.partialSign(mintKey)

      const sig = await wallet.sendTransaction(transaction, connection)
      await connection.confirmTransaction(
        { signature: sig, blockhash, lastValidBlockHeight },
        'confirmed'
      )

      const mintAddress = mintKey.publicKey.toBase58()
      const ataAddress = associatedToken.toBase58()
      setMintPublicKey(mintAddress)
      setAtaKey(ataAddress)
      console.log(`Token mint created at ${mintAddress}`)
      console.log(`ATA created at ${ataAddress}`)
      console.log('Token minted successfully!')
    } catch (e) {
      console.log(e)
      alert('Token creation failed!')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='w-full flex justify-center items-center'>
      <div className='flex flex-col justify-center items-center gap-5 m-5 border border-neutral-800 rounded-2xl p-8 transition-all duration-500 shadow-2xl shadow-black/50 bg-neutral-900 w-5xl'>
        <p className='font-bold text-lg'>Create a new Token</p>

        <div className='flex gap-5 w-full'>
          <Input
            ref={tokenNameRef}
            label='Token Name'
            placeholder='Ex: Solana'
          />
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
                onChange={setRevokeMint}
              />
              <Toggle
                label='Revoke Freeze Authority'
                description='Prevents freezing accounts'
                checked={revokeFreeze}
                onChange={setRevokeFreeze}
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
          onClick={createToken}
          loading={isLoading}
          className='w-full mt-4'
        >
          Create Token
        </Button>

        {(mintPublicKey || ataKey) && (
          <div className='flex gap-4 mt-4'>
            {mintPublicKey && (
              <div className='flex flex-col items-center gap-2 p-4 bg-neutral-800 rounded-lg border border-neutral-700'>
                <p className='text-sm text-neutral-400'>
                  Token Mint Public Key:
                </p>
                <p className='text-xs break-all text-center font-mono max-w-48 text-neutral-300'>
                  {mintPublicKey}
                </p>
                <Button onClick={copyMintKey} variant='secondary'>
                  Copy
                </Button>
              </div>
            )}
            {ataKey && (
              <div className='flex flex-col items-center gap-2 p-4 bg-neutral-800 rounded-lg border border-neutral-700'>
                <p className='text-sm text-neutral-400'>
                  Associated Token Account:
                </p>
                <p className='text-xs break-all text-center font-mono max-w-48 text-neutral-300'>
                  {ataKey}
                </p>
                <Button onClick={copyAtaKey} variant='secondary'>
                  Copy
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
