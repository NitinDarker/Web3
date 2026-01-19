import { mintTo } from "@solana/spl-token";
import dotenv from "dotenv";
import { Connection, PublicKey, type Signer } from "@solana/web3.js";
import bs58 from "bs58";
dotenv.config();

export async function mintTokens(toAddress: string, amount: number) {
  const connection = new Connection("https://api.devnet.solana.com");
  const payer: Signer = {
    secretKey: bs58.decode(process.env.private_key as string),
    publicKey: new PublicKey(process.env.public_key as string),
  };
  const mintKey = new PublicKey(process.env.mint_key as string);
  const destination = new PublicKey(toAddress);
  const mintAuthority = new PublicKey(process.env.public_key as string);

  const response = await mintTo(connection, payer, mintKey, destination, mintAuthority, amount);
  console.log(response);
  return response;
}
