import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import logger from '../utils/logger.js';

export const protectedRoute = async (req, res, next) => {
  try {
    //! token extraction from cookies
    const token = req.cookies.jwt;

    if (!token) {
      logger.error("Unauthorized - No/Invalid token")
      return res.status(401).json({
        message: "Unauthorized - No/Invalid token"
      })
    }

    //! token validation check
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);


    if (!decoded) {
      logger.error("Unauthorized - User not found")
      return res.status(401).json({
        message: "Unauthorized - User not found"
      })
    }

    //! finding user
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      logger.error("User not found")
      return res.status(401).json({
        message: "Unauthorized - User not found"
      })
    }
    req.user = user;

    next();
  } catch (error) {
    logger.error(error.message)
  }
}