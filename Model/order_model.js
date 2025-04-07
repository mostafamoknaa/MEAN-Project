import mongoose from "mongoose";

const orderschema = mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
       
    },

    items: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true
        },
        name: { type: String, required: true },
        price: { type: Number, required: true, min: 0 },
        quantity: { type: Number, required: true, min: 1 },
        subtotal: {
            type: Number,
            required: true,
            default: function() {
                return this.price * this.quantity;
            }
        }
    }],
    totalAmount: { type: Number, required: true, min: 1 },
    status: {
        type: String,
        enum: ["pending", "processing", "shipped", "delivered", "cancelled", "returned"],
        default: "pending"
    },
    shippingAddress: { type: String, required: true },
    paymentMethod: {
        type: { type: String, enum: ["card", "paypal", "cod", "wallet", "cash"], default: "cash" }
    },
    paymentStatus: {
        type: String,
        enum: ["pending", "paid", "failed", "refunded", "succeeded"],
        default: "pending",
        required: true
    },
    discount: {
        code: { type: String, default: null },
        amount: { type: Number, default: 0, min: 0 }
    }


}, {
    timestamps: true,
    versionKey: false
});

export const orderModel = mongoose.model("order", orderschema);