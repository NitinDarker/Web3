const address: Record<string, string> = {
  SOL: "So11111111111111111111111111111111111111112",
  USDC: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
  USDT: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
};

export default async function calculatePrice(
  inputToken: string,
  outputToken: string,
  amount: number,
  taker: string
) {
  const apiKey = import.meta.env.VITE_JUPITER_API;
  const options = {
    method: "GET",
    headers: { "x-api-key": apiKey as string },
  };

  try {
    const res = await fetch(
      `https://api.jup.ag/ultra/v1/order?inputMint=${address[inputToken]}&outputMint=${address[outputToken]}&amount=${amount}&taker=${taker}`,
      options,
    );
    const json = await res.json();
    console.log(json);
  } catch (e) {
    console.log(e);
  }
}
