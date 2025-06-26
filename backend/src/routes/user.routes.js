import express from 'express';
import { protectedRoute } from '../middlewares/auth.middleware.js';
import { getMyFriends, getRecommendedUsers, sendFriendRequest } from '../controllers/user.controller.js';

export const userRouter = express.Router();

//! will be applied on all routes a.k.a global middleware
userRouter.use(protectedRoute)

userRouter.get("/", getRecommendedUsers);
userRouter.get('/friends', getMyFriends);

userRouter.get("/friend-request/:id", sendFriendRequest);
