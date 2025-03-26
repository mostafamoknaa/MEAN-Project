import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        default: "usd"
    },
    paymentMethodId: {
        type: String,
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ["pending", "successful", "failed"],
        default: "pending"
    },
    transactionId: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

export const Payment = mongoose.model("Payment", paymentSchema);