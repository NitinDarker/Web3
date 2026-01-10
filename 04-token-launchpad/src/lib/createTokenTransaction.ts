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
import {
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction
} from '@solana/web3.js'
import {
  createInitializeInstruction,
  pack,
  type TokenMetadata
} from '@solana/spl-token-metadata'
import uploadToCloud from './uploadToCloud'

export interface TokenFormData {
  name: string
  symbol: string
  decimals: number
  initialSupply: number
  imageUrl: string
  description: string
  revokeMint: boolean
  revokeFreeze: boolean
}

export interface CreateTokenResult {
  mintAddress: string
  ataAddress: string
  mintKeypair: Keypair
}

export async function buildCreateTokenTransaction (
  connection: Connection,
  payer: PublicKey,
  formData: TokenFormData
): Promise<{ transaction: Transaction; result: CreateTokenResult }> {
  const programId = TOKEN_2022_PROGRAM_ID
  const mintKey = Keypair.generate()

  const decimals =
    isNaN(formData.decimals) || formData.decimals < 0 || formData.decimals > 9
      ? 9
      : formData.decimals

  const initialSupply =
    isNaN(formData.initialSupply) || formData.initialSupply <= 0
      ? 1
      : formData.initialSupply

  const initialAmount = initialSupply * Math.pow(10, decimals)

  const jsonData = {
    name: formData.name,
    symbol: formData.symbol,
    description: formData.description,
    image: formData.imageUrl,
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
    name: formData.name,
    symbol: formData.symbol,
    uri: URI,
    additionalMetadata: formData.description
      ? [['description', formData.description]]
      : []
  }

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
      formData.revokeFreeze ? payer : null,
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

  if (formData.revokeMint) {
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

  if (formData.revokeFreeze) {
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

  return {
    transaction,
    result: {
      mintAddress: mintKey.publicKey.toBase58(),
      ataAddress: associatedToken.toBase58(),
      mintKeypair: mintKey
    }
  }
}

