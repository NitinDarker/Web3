import express from "express";
import { router } from "./routes";

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use("/app/v1", router);

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to Cloud wallet -- by Nitin Sharma",
  });
});

// Catch-All Middleware
app.use((req, res, next) => {
  res.status(404).send("Route Not Found");
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
