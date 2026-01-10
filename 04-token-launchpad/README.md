# Solana Token Launchpad

A Solana token launchpad that allows users to create SPL tokens using the Token-2022 program.

## Screenshot

![Token Launchpad Screenshot](/public/image.png)

## Features

- Create custom SPL tokens on Solana (Devnet or Mainnet)
- Network switching between Devnet and Mainnet
- Request SOL airdrop on Devnet for testing
- Upload token metadata to Cloudinary
- Automatic Associated Token Account (ATA) creation
- Copy token addresses to clipboard
- Toast notifications for better UX

## How It Works

1. **Connect Wallet** - Connect your Solana wallet (Phantom, Solflare, etc.)
2. **Select Network** - Choose between Devnet (testing) or Mainnet (production)
3. **Request Airdrop** - On Devnet, request SOL for testing
4. **Fill Token Details** - Enter token name, symbol, decimals, initial supply, description, and image URL
5. **Configure Authorities** - Optionally revoke mint and/or freeze authorities
6. **Create Token** - The app creates a single transaction that:
   - Creates a new mint account with metadata pointer
   - Initializes the mint with your specified decimals
   - Uploads metadata JSON to Cloudinary and stores the URI on-chain
   - Creates your Associated Token Account
   - Mints initial supply to your wallet
   - Revokes authorities if selected

## Project Structure

```
src/
├── components/
│   ├── Airdrop.tsx        # SOL airdrop modal for Devnet
│   ├── CreateToken.tsx    # Main token creation logic
│   ├── GithubLink.tsx     # GitHub repository link
│   ├── Launchpad.tsx      # Main layout with wallet providers
│   ├── NetworkControls.tsx # Devnet/Mainnet toggle
│   ├── PublicKeyCard.tsx  # Display and copy public keys
│   └── TokenForm.tsx      # Token details form
├── lib/
│   ├── clipboard.ts       # Clipboard utility
│   ├── createTokenTransaction.ts # Token creation transaction builder
│   └── uploadToCloud.ts   # Cloudinary upload utility
├── ui/
│   ├── Button.tsx         # Reusable button component
│   ├── Input.tsx          # Reusable input component
│   ├── Modal.tsx          # Reusable modal component
│   ├── Textarea.tsx       # Reusable textarea component
│   └── Toggle.tsx         # Reusable toggle component
├── App.tsx                # Root component
└── main.tsx               # Entry point
```

## Tech Stack

- React 19 + TypeScript + Vite
- Solana Web3.js & SPL Token libraries (Token-2022)
- Wallet Adapter for wallet connections
- Cloudinary for metadata storage
- Tailwind CSS v4 for styling
- React Hot Toast for notifications

## Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/NitinDarker/Web3.git
   cd Web3/04-token-launchpad
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with your Cloudinary credentials:
   ```
   VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
   VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

## Usage

### On Devnet (Testing)
1. Switch to Devnet using the network toggle
2. Connect your wallet (make sure wallet is also on Devnet)
3. Click "Request Airdrop" to get test SOL
4. Fill in token details and create your token

### On Mainnet (Production)
1. Switch to Mainnet using the network toggle
2. Connect your wallet (make sure wallet is also on Mainnet)
3. Ensure you have enough SOL for transaction fees (~0.01 SOL)
4. Fill in token details and create your token

## License

MIT
