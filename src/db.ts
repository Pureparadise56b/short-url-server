import mongoose from "mongoose";
import { DB_NAME } from "./constants";

const connectDb = async () => {
  try {
    const connectionResponse = await mongoose.connect(
      `${process.env.DATABASE_URL}/${DB_NAME}`
    );
    console.log("\nMongodb Connected...🟢");
    console.log("Connected Host: ", connectionResponse.connection.host);
  } catch (error: any) {
    console.error("Database Connection Error ❌ :: ", error.message);
    process.exit(1);
  }
};

export { connectDb };
