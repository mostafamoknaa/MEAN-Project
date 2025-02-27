import { Timestamp } from "bson";
import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    products: [{
        productid: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        quantity: {
            type: Number,
            default: 1,
            min: 1
        }
    }]

}, {
    timestamps: true,
    versionKey: false
});

export const cart = mongoose.model('Cart', cartSchema)