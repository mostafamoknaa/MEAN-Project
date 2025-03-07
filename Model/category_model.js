import { Schema, model } from "mongoose";

const categorySchema = new Schema(
  {
    name: String,
  },
  { timestamps: true }
);

export default model("Category", categorySchema);
