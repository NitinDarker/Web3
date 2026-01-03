import Button from '../ui/Button'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import {
  createInitializeMint2Instruction,
  getMinimumBalanceForRentExemptMint,
  MINT_SIZE,
  TOKEN_PROGRAM_ID
} from '@solana/spl-token'
import { Keypair, SystemProgram, Transaction } from '@solana/web3.js'

export default function CreateToken () {
  const wallet = useWallet()
  const { connection } = useConnection()

  async function createToken () {
    if (!wallet.publicKey) {
      alert('Connect to a wallet first!')
      return
    }

    const programId = TOKEN_PROGRAM_ID
    const mintKey = Keypair.generate()
    const lamports = await getMinimumBalanceForRentExemptMint(connection)
    const payer = wallet.publicKey
    const space = MINT_SIZE

    const transaction = new Transaction().add(
      SystemProgram.createAccount({
        fromPubkey: payer,
        newAccountPubkey: mintKey.publicKey,
        space,
        lamports,
        programId
      }),
      createInitializeMint2Instruction(
        mintKey.publicKey,
        9,
        payer,
        payer,
        programId
      )
    )

    const { blockhash, lastValidBlockHeight } =
      await connection.getLatestBlockhash()
    transaction.recentBlockhash = blockhash
    transaction.feePayer = payer
    transaction.partialSign(mintKey)

    const sig = await wallet.sendTransaction(transaction, connection)
    await connection.confirmTransaction(
      { signature: sig, blockhash, lastValidBlockHeight },
      'confirmed'
    )
    console.log(`Token mint created at ${mintKey.publicKey.toBase58()}`)
    alert(`Token mint created at ${mintKey.publicKey.toBase58()}`)
  }

  return (
    <div className='flex flex-col justify-center items-center gap-3 m-5'>
      <p className='font-bold text-lg'>Create a new Token</p>
      <Button onClick={createToken}>Create Token</Button>
    </div>
  )
}
