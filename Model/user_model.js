import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    isconfermed: { type: Boolean, default: false },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    password: { type: String, required: false },
    role: { type: String, enum: ['customer', 'seller', 'admin'], default: 'customer' },
    address: {
        street: { type: String, required: true },
        city: { type: String, required: true },
        country: { type: String, required: true }
    },
    point: {
        type: Number,
        default: 2,
        required: true
    },
    paymentMethods: String,
    wishlist: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
    }]
}, {
    timestamps: true,
    versionKey: false
});

const userModel = mongoose.model("User", userSchema);
export default userModel;