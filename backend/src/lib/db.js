import mongoose from "mongoose";
import logger from "../utils/logger.js";


export const connectDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    // logger.info("Database connection successful")
    // TODO: In production add the logger.info
    console.log("Dev Mode -> DB connected");


  } catch (error) {
    logger.error("Database connection failed")
    process.exit(1);

  }
}