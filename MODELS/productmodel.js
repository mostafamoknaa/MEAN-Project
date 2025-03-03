import { Schema, model } from "mongoose";

const productSchema = new Schema(
  {

<<<<<<< HEAD
    userid:{
      type: Schema.Types.ObjectId,
      ref: 'User',
    },


=======
    seller_id:{
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    category:{
      type:String,
      required: true
    },
>>>>>>> master
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
<<<<<<< HEAD
    tags: [
      {
        type: String,
      },
    ],
=======
    
>>>>>>> master
    isAvailble: {
      type: Boolean,
      default: true,
    },
  },                                                                                                                                +
  
  {
    timestamps: true,
<<<<<<< HEAD
=======
    versionKey: false
>>>>>>> master
  }
);

const Productmodel = model("product", productSchema);

export default Productmodel;