import dotenv from "dotenv";
dotenv.config();

import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.send("Health Check")
})

app.listen(process.env.PORT, () => {
  console.log(`Server is up and running on PORT no: ${process.env.PORT}`);

})