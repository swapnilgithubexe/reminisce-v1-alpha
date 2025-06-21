import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { authRouter } from "./routes/auth.route.js";
import { connectDatabase } from "./lib/db.js";
import logger from "./utils/logger.js";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Health Check")
})

//routes
app.use("/api/v1/auth", authRouter);

app.listen(process.env.PORT, () => {
  //TODO: In production mode add the below commented line
  // logger.info(`Server started at PORT no: ${process.env.PORT}`)

  console.log(`Dev Mode -> Server is up and running on PORT no: ${process.env.PORT}`);
  connectDatabase();

})