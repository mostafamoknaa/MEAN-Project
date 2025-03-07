import mongoose from "mongoose";

const sellerSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    store_name: {
        type: String,
        required: true

    },
    store_description: {
        type: String,
        trim: true,
    },
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
    }, ],
    is_verified: {
        type: Boolean,
        default: false,
    },
    address: {
        street: { type: String, trim: true },
        city: { type: String, trim: true },
    },
    contact: {
        email: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
        },
    },
}, { timestamps: true, versionKey: false });

const SellerModel = mongoose.model("Seller", sellerSchema);

export default SellerModel;