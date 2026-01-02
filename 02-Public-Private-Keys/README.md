# 02-Public-Private-Keys: Bytes & Encoding

This module covers how data is represented and encoded in blockchain systems - essential knowledge for working with wallets, keys, and addresses.

## Files Overview

### `Uint8Array.js`
Demonstrates `Uint8Array` behavior, including automatic value wrapping for out-of-range values (256 becomes 0, etc.).

### `ascii-to-bytes.js`
Converts a string to its byte representation using ASCII character codes.
```
"Hello" → [72, 101, 108, 108, 111]
```

### `bytes-to-ascii.js`
Reverse operation - converts a byte array back to a readable string using `TextDecoder`.
```
[72, 101, 108, 108, 111] → "Hello"
```

### `base58.js`
Encoding/decoding with Base58 using the `bs58` library. Used by Bitcoin and Solana for wallet addresses.

## Concepts

### Uint8Array
A memory-efficient way to store byte data in JavaScript.

| Type | Memory per element |
|------|-------------------|
| Native Array | 64 bits (8 bytes) |
| Uint8Array | 8 bits (1 byte) |

Values automatically wrap to 0-255 range:
```javascript
new Uint8Array([256, -1]) // → [0, 255]
```

### Base58 Encoding
A human-friendly encoding that excludes visually similar characters:
- **Excluded:** `0`, `O`, `I`, `l`, `+`, `/`
- **Used by:** Bitcoin addresses, Solana public keys

### Why This Matters
- Private keys are 32-byte arrays
- Public keys are 32-byte (Ed25519) or 64-byte arrays
- Wallet addresses are Base58-encoded public keys
- Understanding these conversions is essential for signing transactions

## Run

```bash
node Uint8Array.js
node ascii-to-bytes.js
node bytes-to-ascii.js
node base58.js  # requires: npm install bs58
```
