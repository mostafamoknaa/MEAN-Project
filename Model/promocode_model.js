import mongoose from "mongoose";

const promoCodeSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true },
    discountValue: { type: Number, required: true },
    expirationDate: { type: Date, required: true },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

export const PromoCode = mongoose.model("PromoCode", promoCodeSchema);