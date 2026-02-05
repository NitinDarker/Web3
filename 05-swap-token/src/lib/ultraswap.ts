const address: Record<string, string> = {
  SOL: "So11111111111111111111111111111111111111112",
  USDC: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
  USDT: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
};

export default async function calculatePrice(
  inputToken: string,
  outputToken: string,
  amount: number,
  taker: string,
) {
  const apiKey = import.meta.env.VITE_JUPITER_API;
  const orderOptions = {
    method: "GET",
    headers: { "x-api-key": apiKey as string },
  };

  const execOptions = {
    method: "POST",
    headers: {
      "x-api-key": apiKey as string,
      "Content-Type": "application/json",
    },
    body: '',
  };

  try {
    const order = await fetch(
      `https://api.jup.ag/ultra/v1/order?inputMint=${address[inputToken]}&outputMint=${address[outputToken]}&amount=${amount}&taker=${taker}`,
      orderOptions,
    );
    // TODO: Transaction
    const orderData = await order.json();
    execOptions.body = JSON.stringify({
      signedTransaction:
        "AQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAEN...",
      requestId: orderData.requestId,
    });

    const transact = await fetch(
      "https://api.jup.ag/ultra/v1/execute",
      execOptions,
    );
    const res = transact.json();
    console.log(res);
  } catch (e) {
    console.log(e);
  }
}
