import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    isconfermed: { type: Boolean, default: false },
    name: { type: String,required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    password: { type: String, required: false },
    role: { type: String, enum: ['customer', 'seller', 'admin'], default: 'customer' },
    address: {
        street: { type: String },
        city: { type: String },
        country: { type: String }
    },
    point: {
        type: Number,
        default: 2,
        required: true
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