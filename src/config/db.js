import mongoose from "mongoose";
import { env } from "./env.js";

export const connectDB = async () => {
  try {
    await mongoose.connect(env.MONGODB_URI);
    console.log("Connected to DB...");
  } catch (err) {
    console.error("Coudln't connect to DB due to", err);
    process.exit(1);
  }
};
