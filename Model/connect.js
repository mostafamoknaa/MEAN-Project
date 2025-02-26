import mongoose from "mongoose";

export const connectDB = mongoose.connect("mongodb://localhost:27017/Project")
    .then(() => console.log("connected to Database"))
    .catch(err => console.error('Failed to connect to MongoDB', err));