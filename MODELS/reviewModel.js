import { Schema, model } from "mongoose";

import userModel from './userModel.js'

import Productmodel from './productmodel.js'

const reviewModel = Schema({

    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true

    },

    product_id: {
        type: Schema.Types.ObjectId,
        ref: 'product',
        required: true

    }
    ,
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



},{ timestamps: true,
    versionKey: false
});
const ReviewModel = model('review', reviewModel);
export default ReviewModel;

