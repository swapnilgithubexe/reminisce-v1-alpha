import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

import { authRouter } from "./routes/auth.route.js";
import { connectDatabase } from "./lib/db.js";
import logger from "./utils/logger.js";
import cookieParser from "cookie-parser";
import { userRouter } from "./routes/user.routes.js";
import { globalApiLimiter } from "./middlewares/rateLimiter.middleware.js";
import { chatRouter } from "./routes/chat.route.js";

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true //! allowing incoming cookies
}))

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Health Check")
})

//! Global Api rate Limiter
app.use("/api/v1", globalApiLimiter)

//routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/chat", chatRouter);

app.listen(process.env.PORT, () => {
  //TODO: In production mode add the below commented line
  // logger.info(`Server started at PORT no: ${process.env.PORT}`)

  console.log(`Dev Mode -> Server is up and running on PORT no: ${process.env.PORT}`);
  connectDatabase();

})