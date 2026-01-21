import type { Request, Response } from "express";

export default function signup(req: Request, res: Response) {
  const { username, password } = req.body;
}
