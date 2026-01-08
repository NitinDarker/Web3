# Token Launchpad

A Solana token launchpad that allows users to create SPL tokens using the Token-2022 program with on-chain metadata.

## Features

- Create custom SPL tokens on Solana Devnet
- Upload token metadata to Cloudinary
- Automatic Associated Token Account (ATA) creation
- Initial token minting (1 SOL worth of tokens)

## How It Works

1. **Connect Wallet** - Connect your Solana wallet (Phantom, Solflare, etc.)
2. **Fill Token Details** - Enter token name, symbol, description, and image URL
3. **Create Token** - The app creates a single transaction that:
   - Creates a new mint account with metadata pointer
   - Initializes the mint with 9 decimals
   - Uploads metadata JSON to Cloudinary and stores the URI on-chain
   - Creates your Associated Token Account
   - Mints initial supply to your wallet

## Tech Stack

- React + TypeScript + Vite
- Solana Web3.js & SPL Token libraries
- Wallet Adapter for wallet connections
- Cloudinary for metadata storage
- Tailwind CSS for styling

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file with your Cloudinary credentials:
   ```
   VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
   VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

## Network

Currently configured to run on **Solana Devnet**. Make sure your wallet is set to Devnet and has some SOL for transaction fees.
