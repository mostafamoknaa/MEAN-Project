import { Schema, model } from "mongoose";

const productSchema = new Schema(
  {

    seller_id:{
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    category:{
      type:String,
      required: true
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
      type: String,
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
    
    isAvailble: {
      type: Boolean,
      default: true,
    },
  },                                                                                                                                +
  
  {
    timestamps: true,
    versionKey: false
  }
);

const Productmodel = model("product", productSchema);

export default Productmodel;