import { Timestamp } from "bson";
import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
}, {
    timestamps: true,
    versionKey: false
});

export const categoryModel = mongoose.model('Category', categorySchema)