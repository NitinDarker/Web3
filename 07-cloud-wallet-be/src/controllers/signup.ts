import { Keypair } from "@solana/web3.js";
import type { Request, Response } from "express";
import bcrypt from "bcrypt"

export default async function signup(req: Request, res: Response) {
  const { username, password } = req.body;
  const keyPair = Keypair.generate();
  const hashedPassword = await bcrypt.hash(password, 10);
}
