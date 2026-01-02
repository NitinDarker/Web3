# 01-Orientation: Hashing & Proof of Work

This module introduces foundational concepts for understanding blockchain technology through hands-on JavaScript exercises using SHA-256 hashing.

## Files Overview

### `sha256.js`
Basic example demonstrating how to generate a SHA-256 hash using Node.js `crypto` module.

### `assignment-01.js`
**Goal:** Find an input string that produces a SHA-256 hash starting with `00000`.

Brute-forces through numbers until it finds one whose hash has the required prefix. This demonstrates the computational difficulty of finding specific hash outputs.

### `assignment-02.js`
**Goal:** Find a hash starting with `00000`, but the input must begin with `100xdevs`.

Introduces key blockchain terminology:
- **Data** - The fixed part of the input (`100xdevs`)
- **Nonce** - The variable number being incremented
- **Prefix** - The required starting characters of the hash output

### `assignment-03.js`
**Goal:** Generalized solution to find a nonce for any data and prefix.

Creates a reusable `findHash(data, prefix)` function. The example simulates finding a valid hash for transaction data:
```
harkirat => Raman | Rs 100
Ram => Ankit | Rs 10
```

## Key Concepts

These assignments demonstrate **Proof of Work** - the mechanism used by Bitcoin and other blockchains where miners must find a nonce that produces a hash with a specific prefix. The difficulty increases with more leading zeros required.

## Run

```bash
node sha256.js
node assignment-01.js
node assignment-02.js
node assignment-03.js
```
