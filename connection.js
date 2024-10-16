import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URL;
    if (!mongoURI) {
      throw new Error("MONGO_URL is not defined in the .env file");
    }
    const connect = await mongoose.connect(mongoURI);
    console.log(`MongoDb connected ${connect.connection.host}`);
  } catch (error) {
    console.error(`MongoDb error: ${error}`);
    process.exit(1);
  }
};
