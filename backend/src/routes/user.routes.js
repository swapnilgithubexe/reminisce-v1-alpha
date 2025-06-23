import express from 'express';
import { protectedRoute } from '../middlewares/auth.middleware.js';
import { getRecommendedUsers } from '../controllers/user.controller.js';

export const userRouter = express.Router();

//! will be applied on all routes
userRouter.use(protectedRoute)

userRouter.get("/", getRecommendedUsers);

