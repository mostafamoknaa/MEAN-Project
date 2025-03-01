import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    order_id: { type: mongoose.Schema.Types.ObjectId, ref: "order", required: true },
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: "product", required: true },
    quantity: { type: Number, required: true, default: 1 },
    price: { type: Number, required: true }, // Price at the time of purchase
  },
  { timestamps: true,
    versionKey: false
    
   }
);

const OrderItem = mongoose.model("orderItem", orderItemSchema);
export default OrderItem;
