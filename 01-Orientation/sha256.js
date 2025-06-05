const crypto = require("crypto");

const input = "Nitin";

// Create a hash object using the SHA-256 algorithm
const hash = crypto.createHash("sha256");

// Update the hash content with the input string.
hash.update(input);

// Generate the hashed output in hexadecimal format.
const output = hash.digest("hex");

console.log(output);
