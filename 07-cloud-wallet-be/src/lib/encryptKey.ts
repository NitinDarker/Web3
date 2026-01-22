import { createCipheriv, createDecipheriv, randomBytes } from "crypto";

const masterKey = Buffer.from(process.env.WALLET_SECRET_KEY!, "utf-8");

export function encryptKey(privateKey: string) {
  const iv = randomBytes(16); // 16 bytes is standard for AES
  const cipher = createCipheriv("aes-256-gcm", masterKey, iv);

  let encrypted = cipher.update(privateKey, "utf8", "hex");
  encrypted += cipher.final("hex");

  const authTag = cipher.getAuthTag().toString("hex");

  return {
    encryptedKey: encrypted,
    iv: iv.toString("hex"),
    authTag: authTag,
  };
}

export function decryptKey(encryptedKey: string, iv: string, authTag: string) {
  const decipher = createDecipheriv(
    "aes-256-gcm",
    masterKey,
    Buffer.from(iv, "hex"),
  );

  decipher.setAuthTag(Buffer.from(authTag, "hex"));

  let decrypted = decipher.update(encryptedKey, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}
