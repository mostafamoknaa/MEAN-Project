import { Schema, model } from "mongoose";
const bannerSchema = new Schema(
  {
    imageUrl: String,
   
  },
  { timestamps: true }
);

export default model("Banner", bannerSchema);
