import mongoose from "mongoose";

const wishlistSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
}, {
    timestamps: true,
    versionKey: false


});

const Wishlist = mongoose.model("Wishlist", wishlistSchema);
export default Wishlist;