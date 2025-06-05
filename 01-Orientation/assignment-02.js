// What if I ask you that the input string should start with 100xdevs ? 
const crypto = require("crypto");

let num = 0;
let input = num.toString();
let hash;

do {
    num++;
    input = "100xdevs" + num.toString();
    hash = crypto.createHash("sha256").update(input).digest("hex");
} while (!hash.startsWith("00000"));

console.log("Input: " + input);
console.log("Hash: " + hash);

// Here, 100xdevs is referred as 'data'
// And, the num is referred as 'nonce'
// Hence, input = data + nonce (input of sha-256 hash function)
// And, "00000" is referred as prefix of hash (output prefix)