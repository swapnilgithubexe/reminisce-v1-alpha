import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import path from 'path';

import { authRouter } from "./routes/auth.route.js";
import { connectDatabase } from "./lib/db.js";
import logger from "./utils/logger.js";
import cookieParser from "cookie-parser";
import { userRouter } from "./routes/user.routes.js";
import { globalApiLimiter } from "./middlewares/rateLimiter.middleware.js";
import { chatRouter } from "./routes/chat.route.js";

const app = express();
const __dirname = path.resolve();

// app.use(cors({
//   origin: "http://localhost:5173",
//   credentials: true //! allowing incoming cookies
// }))
app.use(cors({
  origin: ["https://reminisce-v1-alpha.onrender.com", "http://localhost:5173"],
  credentials: true, //! allowing incoming requests
}));

app.use(express.json());
app.use(cookieParser());

app.get("/health", (req, res) => {
  res.send("Health Check")
})

//! Global Api rate Limiter
app.use("/api/v1", globalApiLimiter)

//routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/chat", chatRouter);

//! join the frontend and backend in prod env
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  //! any path other than the above given routes index.html will be returned
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
  })
}

app.listen(process.env.PORT, () => {
  console.log(__dirname);
  //TODO: In production mode add the below commented line
  logger.info(`Server started at PORT no: ${process.env.PORT}`)

  console.log(`Dev Mode -> Server is up and running on PORT no: ${process.env.PORT}`);
  connectDatabase();

})