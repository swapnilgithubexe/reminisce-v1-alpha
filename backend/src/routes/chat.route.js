import express from 'express';
import { protectedRoute } from '../middlewares/auth.middleware.js';
import { getStreamToken } from '../controllers/chat.controller.js';

export const chatRouter = express.Router();

chatRouter.get("/token", protectedRoute, getStreamToken)