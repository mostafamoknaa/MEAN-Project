import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    isconfermed: { type: Boolean, default: false },
    name: { type: String },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    password: { type: String, required: false },
    role: { type: String, enum: ['customer', 'seller', 'admin'], default: 'customer' },
    address: {
        street: String,
        city: String,
        country: String
    },
    paymentMethods: String,

    wishlist: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "product",
        }

    ]
}, {
    timestamps: true,
    versionKey: false
});

const userModel = mongoose.model("User", userSchema);
export default userModel;