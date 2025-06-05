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