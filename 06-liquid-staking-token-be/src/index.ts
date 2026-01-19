import express from "express";
const app = express();

app.use(express.json())

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Hey there!",
  });
});

app.post("/helius", (req, res) => {
  const fromAddress = req.body.from;
  const toAddress = req.body.to;
  const amount = req.body.amount;

  res.status(200).json({
    success: true,
    message: "Transaction successful"
  })
})

app.listen(3000, () => {
  console.log("Listening to port 3000");
});
