import { generateStreamToken } from "../lib/stream.js";
import logger from "../utils/logger.js";

export const getStreamToken = (req, res) => {
  try {
    const token = generateStreamToken(req.user.id);

    logger.info(`Token has been generated for ${req.user.fullName}`);
    res.status(200).json({ token });
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
