import {
  getOrCreateAssociatedTokenAccount,
  mintTo,
  TOKEN_2022_PROGRAM_ID,
} from "@solana/spl-token";
import dotenv from "dotenv";
import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import bs58 from "bs58";
dotenv.config();

export async function mintTokens(toAddress: string, amount: number) {
  const connection = new Connection(
    "https://api.devnet.solana.com",
    "confirmed",
  );
  const payer = Keypair.fromSecretKey(
    bs58.decode(process.env.private_key as string),
  );
  const mintKey = new PublicKey(process.env.mint_key as string);

  try {
    const destination = await getOrCreateAssociatedTokenAccount(
      connection,
      payer,
      mintKey,
      new PublicKey(toAddress),
      false,
      "confirmed",
      undefined,
      TOKEN_2022_PROGRAM_ID,
    );

    const response = await mintTo(
      connection,
      payer,
      mintKey,
      destination.address,
      payer,
      amount,
      undefined,
      { commitment: "confirmed" },
      TOKEN_2022_PROGRAM_ID,
    );
    console.log("response:", response);
  } catch (e) {
    console.log("error:", e);
  }
}
