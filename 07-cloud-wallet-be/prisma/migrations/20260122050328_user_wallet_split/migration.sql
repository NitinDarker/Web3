/*
  Warnings:

  - You are about to drop the column `privateKey` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `publicKey` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "privateKey",
DROP COLUMN "publicKey";

-- CreateTable
CREATE TABLE "Wallet" (
    "id" TEXT NOT NULL,
    "publicKey" TEXT NOT NULL,
    "encrypted_key" TEXT NOT NULL,
    "iv" TEXT NOT NULL,
    "auth_tag" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Wallet_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Wallet" ADD CONSTRAINT "Wallet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
