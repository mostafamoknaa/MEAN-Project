import mongoose from "mongoose";

const sellerSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Links to the User model (every seller is a user)
      required: true,
    },
    store_name: {
      type: String,
      required: true,
      unique: true, // Ensure store names are unique
     
    },
    store_description: {
      type: String,
      trim: true,
    },
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product", // Links to the Product model
      },
    ],
    is_verified: {
      type: Boolean,
      default: false, // Default seller is not verified
    },
    address: {
      street: String,
      city: String
     
    },
    contact: {
      email: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
      },
    }
   
  },
  { timestamps: true }
);

const SellerModel = mongoose.model("seller", sellerSchema);

export default SellerModel;
