// Give me an input string that outputs a SHA-256 hash that starts with 00000
const crypto = require("crypto");

let num = 0;
let hash;

do {
    num++;
    const input = num.toString();
    hash = crypto.createHash("sha256").update(input).digest("hex");
} while (!hash.startsWith("00000"));

console.log("Input: " + num);
console.log("Hash: " + hash);