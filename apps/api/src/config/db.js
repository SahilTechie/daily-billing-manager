import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../../../../.env") });

// Development: Auto-start in-memory MongoDB if MONGO_URI not set or connection fails
export const connectDB = async () => {
  let mongoUri = process.env.MONGO_URI;
  const hasConfiguredMongoUri = Boolean(mongoUri);

  if (process.env.NODE_ENV !== "production" && !mongoUri) {
    mongoUri = "mongodb://127.0.0.1:27017/bill_memo_dev";
  }

  if (!mongoUri) {
    throw new Error("MONGO_URI is missing in environment variables");
  }

  try {
    await mongoose.connect(mongoUri);
    console.log("MongoDB connected successfully");
  } catch (err) {
    if (hasConfiguredMongoUri) {
      throw new Error(`Failed to connect to configured MongoDB URI: ${err.message}`);
    }

    console.warn("MongoDB connection failed, attempting in-memory database...");
    try {
      const { MongoMemoryServer } = await import("mongodb-memory-server");
      const mongoServer = await MongoMemoryServer.create();
      const mongoUri = mongoServer.getUri();
      await mongoose.connect(mongoUri);
      console.log("In-memory MongoDB started for development");
    } catch (memErr) {
      throw new Error(
        `Failed to connect to MongoDB: ${err.message}\nFailed to start in-memory MongoDB: ${memErr.message}`
      );
    }
  }
};
