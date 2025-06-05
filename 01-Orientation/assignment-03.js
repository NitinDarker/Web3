// What if I ask you to find a nonce for different data
const crypto = require('crypto');

function findHash(data, prefix) {
    let input, hash;
    let num = 0;
    
    do {
        num++;
        input = data.toString() + num.toString();
        hash = crypto.createHash("sha256").update(input).digest("hex");
    } while (!hash.startsWith(prefix.toString()));

    return {
        input: input,
        nonce: num,
        hash: hash
    };
}

const data = "harkirat => Raman | Rs 100\nRam => Ankit | Rs 10\n"
const hashObj = findHash(data, "00000")

console.log("Nonce: " + hashObj.nonce);
console.log("Hash: " + hashObj.hash);
console.log("Input: " + hashObj.input);