## `Uint8Array`
`Uint8Array` offers a more efficient way to handle byte data in JavaScript compared to regular arrays.

### Why use `Uint8Array`?

1.  **Space Efficiency:**
    * **Native Array:** Each number (even 0 or 1) uses **64 bits (8 bytes)**.
    * **`Uint8Array`:** Each value uses **8 bits (1 byte)**.
    * **Result:** `Uint8Array` consumes **8x less memory** for byte data.

2.  **Constraint Enforcement:**
    * `Uint8Array` automatically ensures all elements are within the valid byte range (0-255). Values outside this range are wrapped (e.g., 256 becomes 0, -1 becomes 255).

### Example:

```javascript
let bytes = new Uint8Array([0, 255, 127, 128]);
console.log(bytes); // Uint8Array(4) [ 0, 255, 127, 128 ]

// Value outside range wraps:
let wrappedByte = new Uint8Array([256, -1]);
console.log(wrappedByte); // Uint8Array(2) [ 0, 255 ]