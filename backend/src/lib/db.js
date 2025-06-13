import mongoose from "mongoose";


export const connectDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log("Database Connected");

  } catch (error) {
    console.log("Error connecting DB");
    process.exit(1);

  }
}