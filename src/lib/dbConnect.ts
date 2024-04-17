import { DB_NAME } from "@/constants";
import mongoose from "mongoose";

// types
interface connectionObject {
  isConnected?: number;
}

const connection: connectionObject = {};

export default async function dbConnect(): Promise<void> {
  if (connection.isConnected) {
    console.log("Already connected to MongoDB ❤️");
    return;
  }

  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}` || ""
    );
    console.log(
      `MongoDB connected successfully 🥳🎊 :: DB HOST :: ${connectionInstance.connections[0].host}`
    );
    connection.isConnected = connectionInstance.connections[0].readyState;
  } catch (error) {
    console.error("MongoDB connection Failed 😭😭 :: ", error);
    // exit the node process
    process.exit(1);
  }
}
