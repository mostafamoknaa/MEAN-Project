import mongoose from "mongoose";
const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String },
    category: { type: String },
    imageUrl: { type: String }
}, {
    timestamps: true,
    versionKey: false
});

export const Product = mongoose.model("Product", productSchema);