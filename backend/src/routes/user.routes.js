import express from 'express';
import { protectedRoute } from '../middlewares/auth.middleware.js';
import { acceptFriendRequest, getFriendRequests, getMyFriends, getOutgoingRequests, getRecommendedUsers, sendFriendRequest } from '../controllers/user.controller.js';

export const userRouter = express.Router();

//! will be applied on all routes a.k.a global middleware
userRouter.use(protectedRoute)

userRouter.get("/", getRecommendedUsers);
userRouter.get('/friends', getMyFriends);

userRouter.post("/friend-request/:id", sendFriendRequest);
userRouter.put("/friend-request/:id/accept", acceptFriendRequest);

userRouter.get("/friend-requests", getFriendRequests);
userRouter.get("/outgoing-friend-requests", getOutgoingRequests);
