function asciiToBytes(str) {
  const arr = []; // const arr = [...str]
  for (let i = 0; i < str.length; i++) {
    arr.push(str.charCodeAt(i)); // Push the ascii value to arr
  }
  return arr;
}

const ascii = "Hello";
const nativeArray = asciiToBytes(ascii);
const byteArray = new Uint8Array(nativeArray);
console.log(byteArray); // Output: Uint8Array(5) [72, 101, 108, 108, 111]
