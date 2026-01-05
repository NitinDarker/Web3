import Button from '../ui/Button'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import {
  createInitializeMetadataPointerInstruction,
  createInitializeMint2Instruction,
  ExtensionType,
  getMintLen,
  LENGTH_SIZE,
  TOKEN_2022_PROGRAM_ID,
  TYPE_SIZE
} from '@solana/spl-token'
import { Keypair, SystemProgram, Transaction } from '@solana/web3.js'
import Input from '../ui/Input'
import { useRef, useState } from 'react'
import {
  createInitializeInstruction,
  pack,
  type TokenMetadata
} from '@solana/spl-token-metadata'

export default function CreateToken () {
  const wallet = useWallet()
  const { connection } = useConnection()
  const tokenNameRef = useRef<HTMLInputElement>(null)
  const symbolRef = useRef<HTMLInputElement>(null)
  const imageRef = useRef<HTMLInputElement>(null)
  const [mintPublicKey, setMintPublicKey] = useState<string | null>(null)

  async function createToken () {
    if (!wallet.publicKey) {
      alert('Connect to a wallet first!')
      return
    }

    if (!tokenNameRef.current?.value || !symbolRef.current?.value || !imageRef.current?.value) {
      alert('Input fields cannot by empty!')
      return
    }

    const programId = TOKEN_2022_PROGRAM_ID
    const mintKey = Keypair.generate()
    const payer = wallet.publicKey

    const metadata: TokenMetadata = {
      mint: mintKey.publicKey,
      name: tokenNameRef.current.value,
      symbol: symbolRef.current.value,
      uri: imageRef.current.value,
      additionalMetadata: []
    }
    console.log("Metadata:", metadata);

    const mintLen = getMintLen([ExtensionType.MetadataPointer])
    const metadataLen = TYPE_SIZE + LENGTH_SIZE + pack(metadata).length
    const lamports = await connection.getMinimumBalanceForRentExemption(
      mintLen + metadataLen
    )
    console.log("Lamports:", lamports)

    try {
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
          wallet.publicKey,
          mintKey.publicKey,
          TOKEN_2022_PROGRAM_ID
        ),
        createInitializeMint2Instruction(
          mintKey.publicKey,
          9,
          payer,
          payer,
          programId
        ),
        createInitializeInstruction({
          programId: TOKEN_2022_PROGRAM_ID,
          mint: mintKey.publicKey,
          metadata: mintKey.publicKey,
          name: metadata.name,
          symbol: metadata.symbol,
          uri: metadata.uri,
          mintAuthority: wallet.publicKey,
          updateAuthority: wallet.publicKey
        })
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
      console.log(`Token mint created at ${mintKey.publicKey.toBase58()}`)
      alert(`Token mint created successfully!`)
      setMintPublicKey(mintKey.publicKey.toBase58())
    } catch (e) {
      console.log(e)
      alert('Token creation failed!')
    }
  }

  return (
    <div className='flex flex-col justify-center items-center gap-3 m-5'>
      <p className='font-bold text-lg'>Create a new Token</p>
      <Input ref={tokenNameRef} placeholder='Token Name' />
      <Input ref={symbolRef} placeholder='Token Symbol' />
      <Input ref={imageRef} placeholder='Image URI' />
      <Button onClick={createToken}>Create Token</Button>
      {mintPublicKey && (
        <div>
          <p>Mint Public Key: </p>
          <p>{mintPublicKey}</p>
        </div>
      )}
    </div>
  )
}
