import { useRef, useState } from 'react'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import {
  createAssociatedTokenAccountInstruction,
  createInitializeMetadataPointerInstruction,
  createInitializeMint2Instruction,
  createMintToInstruction,
  ExtensionType,
  getAssociatedTokenAddressSync,
  getMintLen,
  LENGTH_SIZE,
  TOKEN_2022_PROGRAM_ID,
  TYPE_SIZE
} from '@solana/spl-token'
import {
  Keypair,
  LAMPORTS_PER_SOL,
  SystemProgram,
  Transaction
} from '@solana/web3.js'
import {
  createInitializeInstruction,
  pack,
  type TokenMetadata
} from '@solana/spl-token-metadata'
import Button from '../ui/Button'
import Input from '../ui/Input'
import uploadToCloud from '../lib/uploadToCloud'

export default function CreateToken () {
  const tokenNameRef = useRef<HTMLInputElement>(null)
  const symbolRef = useRef<HTMLInputElement>(null)
  const imageRef = useRef<HTMLInputElement>(null)
  const descRef = useRef<HTMLInputElement>(null)
  const wallet = useWallet()
  const { connection } = useConnection()
  const [mintPublicKey, setMintPublicKey] = useState<string | null>(null)
  const [ataKey, setAtaKey] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)

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

    if (!tokenNameRef.current?.value || !symbolRef.current?.value) {
      alert('Input fields cannot be empty!')
      return
    }

    try {
      setIsLoading(true)
      const programId = TOKEN_2022_PROGRAM_ID
      const mintKey = Keypair.generate()
      const payer = wallet.publicKey
      const decimals = 9
      const initialAmount = 1 * LAMPORTS_PER_SOL

      const jsonData = {
        name: tokenNameRef.current!.value,
        symbol: symbolRef.current!.value,
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

      if (!URI) {
        console.error('Failed to upload the metadata to cloudinary')
        throw new Error('Failed to get a valid URI from cloud upload')
      }

      const metadata: TokenMetadata = {
        mint: mintKey.publicKey,
        name: tokenNameRef.current.value,
        symbol: symbolRef.current.value,
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
          null,
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
      <div className='flex flex-col justify-center items-center gap-5 m-5 border-2 border-neutral-600 rounded-2xl p-5 w-xl transition-all duration-500 shadow-lg shadow-neutral-800 bg-neutral-800'>
        <p className='font-bold text-lg'>Create a new Token</p>
        <Input ref={tokenNameRef} placeholder='Token Name' />
        <Input ref={symbolRef} placeholder='Token Symbol' />
        <Input ref={imageRef} placeholder='Image URL' />
        <Button onClick={createToken} loading={isLoading}>Create Token</Button>
        {mintPublicKey && (
          <div className='flex flex-col items-center gap-2 mt-4 p-4 pb-0 bg-neutral-800 rounded-lg max-w-md'>
            <p className='text-sm text-neutral-400'>Token Mint Public Key:</p>
            <p className='text-xs break-all text-center font-mono'>
              {mintPublicKey}
            </p>
            <Button
              onClick={copyMintKey}
              variant='secondary'
              loading={isLoading}
            >
              Copy
            </Button>
          </div>
        )}
        {ataKey && (
          <div className='flex flex-col items-center gap-2 mt-4 p-4 pt-0 bg-neutral-800 rounded-lg max-w-md'>
            <p className='text-sm text-neutral-400'>
              Associated Token Account Public Key:
            </p>
            <p className='text-xs break-all text-center font-mono'>{ataKey}</p>
            <Button
              onClick={copyAtaKey}
              variant='secondary'
              loading={isLoading}
            >
              Copy
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
