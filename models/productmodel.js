import mongoose, { Schema, model } from "mongoose";
const productSchema = new Schema(
  {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
    },
    Promocode: {
      type: Number,
    },
    images: [
      {
        type: String,
      },
    ],
    avgRating: {
      type: Number,
      default: 0,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    tags: [
      {
        type: String,
      },
    ],
    isAvailble: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);
export default model("Product", productSchema);
