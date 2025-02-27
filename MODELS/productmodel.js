import { Schema, model } from "mongoose";

const productSchema = new Schema(
  {

    userid:{
      type: Schema.Types.ObjectId,
      ref: 'User',
    },


    isfavourite:{
      type : Boolean,
      default : false
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
    },
    Promocode: {
      type: Number,
    },
    images: [
      {
        type: String,
      },
    ],
    avgRating: {
      type: Number,
      default: 0,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    tags: [
      {
        type: String,
      },
    ],
    isAvailble: {
      type: Boolean,
      default: true,
    },
  },                                                                                                                                +
  
  {
    timestamps: true,
  }
);

const Productmodel = model("product", productSchema);

export default Productmodel;