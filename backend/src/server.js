import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { authRouter } from "./routes/auth.route.js";
import { connectDatabase } from "./lib/db.js";

const app = express();

app.get("/", (req, res) => {
  res.send("Health Check")
})

//routes
app.use("/api/v1/auth", authRouter);

app.listen(process.env.PORT, () => {
  console.log(`Server is up and running on PORT no: ${process.env.PORT}`);
  connectDatabase();

})