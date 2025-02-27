import mongoose from "mongoose";
export const myconnection = mongoose
  .connect("mongodb://localhost:27017/Product")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Failed to connect to MongoDB", err));
