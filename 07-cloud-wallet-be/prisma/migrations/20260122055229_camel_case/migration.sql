/*
  Warnings:

  - You are about to drop the column `auth_tag` on the `Wallet` table. All the data in the column will be lost.
  - You are about to drop the column `encrypted_key` on the `Wallet` table. All the data in the column will be lost.
  - Added the required column `authTag` to the `Wallet` table without a default value. This is not possible if the table is not empty.
  - Added the required column `encryptedKey` to the `Wallet` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Wallet" DROP COLUMN "auth_tag",
DROP COLUMN "encrypted_key",
ADD COLUMN     "authTag" TEXT NOT NULL,
ADD COLUMN     "encryptedKey" TEXT NOT NULL;
