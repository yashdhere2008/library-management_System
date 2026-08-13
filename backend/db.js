import mongoose from "mongoose";
import dns from "dns";

dns.setServers(["8.8.8.8", "8.8.4.4"]);

const connectDB = async () => {
  try {
    // Already connected
    if (mongoose.connection.readyState === 1) {
      console.log("MongoDB already connected");
      return true;
    }

    const uri = process.env.MONGO_URI;

    if (!uri) {
      console.error("MONGO_URI is not defined");
      return false;
    }

    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
    });

    console.log("MongoDB Connected");

    return true;
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    return false;
  }
};

export default connectDB;