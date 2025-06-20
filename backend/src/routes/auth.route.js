import express from "express";
import { login, logout, signUp } from "../controllers/auth.controller.js";

export const authRouter = express.Router();

authRouter.post("/signup", signUp);
authRouter.post("/login", login);
authRouter.post("/logout", logout);