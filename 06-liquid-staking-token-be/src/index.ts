import express from "express";
import { mintTokens } from "./lib/mintToken";
const app = express();

app.use(express.json())

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Hey there!",
  });
});

app.post("/helius", async (req, res) => {
  const toAddress = req.body.to;
  const amount = req.body.amount / 1e9;
  await mintTokens(toAddress, amount)
  res.status(200).json({
    success: true,
    message: "Transaction successful"
  })
})

app.listen(3000, () => {
  console.log("Listening to port 3000");
});
