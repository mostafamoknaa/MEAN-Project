import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, default: "" },
    price: { type: Number, required: true, min: 0 },
    discountPrice: { type: Number, min: 0 },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: false },
    subcategory: { type: mongoose.Schema.Types.ObjectId, ref: "Subcategory" },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    images: [{ type: String, match: /^https?:\/\/.+/, required: false }],
    stock: { type: Number, required: true, min: 0, default: 0 },
    variations: { type: Object, default: {} }
}, {
    timestamps: true,
    versionKey: false
});
export const productModel = mongoose.model("Product", productSchema);