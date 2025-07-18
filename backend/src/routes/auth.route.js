import express from "express";
import { login, logout, onBoard, signUp } from "../controllers/auth.controller.js";
import { protectedRoute } from "../middlewares/auth.middleware.js";
import { loginLimiter, registerLimiter } from "../middlewares/rateLimiter.middleware.js";

export const authRouter = express.Router();

authRouter.post("/signup", registerLimiter, signUp);
authRouter.post("/login", login);
authRouter.post("/logout", logout);

authRouter.post("/onboarding", protectedRoute, onBoard);

//! health check & auth route
authRouter.get("/me", protectedRoute, (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user
  })
})