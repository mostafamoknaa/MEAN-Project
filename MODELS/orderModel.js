import mongoose from "mongoose";

import  Productmodel from './productmodel.js'
import userModel from './userModel.js'

const orderschema = new mongoose.Schema({
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User",  
      required: true 
    },

    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "product",  
          required: true
        },
        quantity: {
          type: Number,
          required: true,
          default: 1
        },
        price: {
          type: Number,
          required: true
        }
      }
    ],

    total_price: { type: Number, required: true },
     
    status: { 
      type: String, 
      enum: ["pending", "processing", "shipped", "delivered", "cancelled", "returned"], 
      default: "pending" 
    },

    shippingAddress: {
      street: { type: String, required: true },
      city: { type: String, required: true }
    },

    paymentMethod: {
      type: { type: String, enum: ["card", "paypal", "cod", "wallet"], required: true }
    },

    paymentStatus: { 
      type: String, 
      enum: ["pending", "paid", "failed", "refunded"], 
      default: "pending" 
    },

    discount: {
      code: { type: String, default: null },
      amount: { type: Number, default: 0 }
    }

}, {
    timestamps: true,
    versionKey: false
});

const orderModel = mongoose.model("order", orderschema);
export default orderModel;
