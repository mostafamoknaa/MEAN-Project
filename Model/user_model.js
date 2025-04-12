import mongoose from "mongoose";
import {Product} from './product_model.js';

const userSchema = mongoose.Schema({
    isconfermed: { type: Boolean, default: false },
    name: { type: String },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    password: { type: String, required: true },
    role: { type: String, enum: ['customer', 'seller', 'admin'], default: 'customer' },
    
    address: { type: String },
    point: {
        type: Number,
        default: 2,
        
    },
    status: {
        type: String,
        enum: ["pending", "accepted", "rejected"],
        default: "pending",
    },
    paymentMethods: String,
    wishlist: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
    }]
}, {
    timestamps: true,
    versionKey: false
});

const userModel = mongoose.model("User", userSchema);
export default userModel;