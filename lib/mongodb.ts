import mongoose from "mongoose";

const MONGODB_URI ="mongodb+srv://imgauravkumar7:RVlJEQ6sV1iFAnw8@cluster0.cltnw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"; 

const connectMongoDB = async () => {
  try {
    if (mongoose.connection.readyState >= 1) {
      console.log("MongoDB already connected.");
      return;
    }
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB!");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
};

export default connectMongoDB;


