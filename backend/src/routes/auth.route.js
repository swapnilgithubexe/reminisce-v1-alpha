import express from "express";
import { login, logout, onBoard, signUp } from "../controllers/auth.controller.js";
import { protectedRoute } from "../middlewares/auth.middleware.js";

export const authRouter = express.Router();

authRouter.post("/signup", signUp);
authRouter.post("/login", login);
authRouter.post("/logout", logout);

authRouter.post("/onboarding", protectedRoute, onBoard);