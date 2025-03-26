import { Schema, model } from "mongoose";


const reviewModel = Schema({

    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true

    },

    product_id: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true

    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    review: {
        type: String,
        required: true
    },



}, {
    timestamps: true,
    versionKey: false
});
const ReviewModel = model('Review', reviewModel);
export default ReviewModel;