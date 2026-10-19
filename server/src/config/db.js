import mongoose from "mongoose";
import { config } from "./env.js";

export const connectDB = async () => {
  if (config.isPlaceholder(config.mongodbUri)) {
    console.warn(
      "\n=======================================================\n" +
      "[Database Notice]: MONGODB_URI is currently set to placeholder '##########'.\n" +
      "MongoDB connection is paused until you provide your connection string.\n" +
      "The server is running in standalone mode.\n" +
      "=======================================================\n"
    );
    return;
  }

  try {
    const conn = await mongoose.connect(config.mongodbUri, {
      autoIndex: true,
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[Database]: MongoDB connected successfully: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[Database Error]: Failed to connect to MongoDB: ${error.message}`);
  }
};

