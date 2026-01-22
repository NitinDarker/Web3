import { Keypair } from "@solana/web3.js";
import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import { encryptKey } from "../lib/encryptKey";
import { prisma } from "../lib/db";

export default async function signup(req: Request, res: Response) {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      success: false,
      error: "Username and password required",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newKey = Keypair.generate();
  const publicKey = newKey.publicKey.toBase58();
  const { encryptedKey, iv, authTag } = encryptKey(
    Buffer.from(newKey.secretKey).toString("base64"),
  );

  try {
    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
      },
    });

    const wallet = await prisma.wallet.create({
      data: {
        publicKey,
        encryptedKey,
        iv,
        authTag,
        userId: user.id,
      },
    });
    return res.status(201).json({
      success: true,
      message: "New user created",
      publicKey: wallet.publicKey,
    });
  } catch (e: any) {
    if (e.code === "P2002") {
      return res.status(409).json({
        success: false,
        error: "Username already exists",
      });
    }
    console.log(e);
    return res.status(500).json({
      success: false,
      error: "Error occurred",
    });
  }
}
