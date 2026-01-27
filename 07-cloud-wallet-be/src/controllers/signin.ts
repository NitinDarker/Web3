import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import { prisma } from "../lib/db";
import jwt from "jsonwebtoken";

export default async function signin(req: Request, res: Response) {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      success: false,
      error: "Username and password required",
    });
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        username,
      },
    });

    if (!user) {
      throw new Error("User with this username not found!");
    }
    if (!(await bcrypt.compare(password, user.password))) {
      throw new Error("Wrong password");
    }
    const token = jwt.sign({ username }, process.env.JWT_KEY as string, {
      expiresIn: "24h",
    });
    return res.status(201).json({
      success: true,
      jwt: token
    });
  } catch (e: any) {
    console.log(e);
    return res.status(401).json({
      success: false,
      error: e.message,
    });
  }
}
