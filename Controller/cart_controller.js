import { cart } from "../Model/cart_model.js"
import { Product } from "../Model/product_model.js";
import { Payment } from "../Model/payment_model.js";
import { PromoCode } from "../Model/promocode_model.js";
import Stripe from "stripe";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);


//get user id by using middleware it take atoken and get of it the id of the current user 
const getusercart = async(req, res) => {
    try {

        const userid = req.user.id;
        
        const cartdata = await cart.find({ userid: userid }).populate("products.productid");
        res.status(200).json(cartdata.length ? cartdata : "Your Cart is empty");
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



const addToUserCart = async (req, res) => {
    try {
        const userid = req.user.id;
        const {  products } = req.body;
        let userCart = await cart.findOne({ userid });

        if (userCart) {
            for (const newProduct of products) {
                const { productid, quantity } = newProduct;
                const existingProduct = userCart.products.find((item) => item.productid.toString() === productid);

                if (existingProduct) {
                    return res.status(400).json({ message: `Product ${productid} already exists in your cart` });
                } else {
                    userCart.products.push({ productid, quantity });
                }
            }

            await userCart.save();
            return res.json({ message: "Product(s) added to cart" ,"usercart":userCart});

        } else {
            const newCart = new cart({
                userid,
                products
            });

            await newCart.save();
            return res.json({ message: "New cart created and product(s) added" });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const updatecartquantity = async(req, res) => {
    try {
        //const userid = req.user.id;
        const { userid, productid, quantity } = req.body;
        const userCart = await cart.findOne({ userid });
        if (userCart) {
            const productIndex = userCart.products.findIndex((product) => product.productid == productid);
            if (productIndex >= 0) {
                userCart.products[productIndex].quantity = quantity;
                await userCart.save();
                res.json({ message: "Product quantity updated" });
            } else {
                res.json({ message: "Product not found in cart" });
            }
        } else {
            res.json({ message: "Cart not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteFromCart = async (req, res) => {
    try {
        const userid = req.user.id; // Assuming req.user is set by authentication middleware
        const productid = req.params.id;

        // Validate productid
        if (!mongoose.Types.ObjectId.isValid(productid)) {
            return res.status(400).json({ message: 'Invalid product ID' });
        }

        // Use atomic update to remove product from array
        const result = await cart.updateOne(
            { userid },
            { $pull: { products: { productid: new mongoose.Types.ObjectId(productid) } } }
        );

        if (result.modifiedCount > 0) {
            return res.status(200).json({ message: 'Product removed from cart successfully' });
        } else {
            // Check if cart exists
            const cartExists = await cart.findOne({ userid });
            if (!cartExists) {
                return res.status(404).json({ message: 'Cart not found' });
            }
            return res.status(404).json({ message: 'Product not found in cart' });
        }
    } catch (error) {
        console.error('Error deleting from cart:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};



const gustuser = async(req, res) => {
    try {
        const cart = req.body.cart || [];
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const processPayment = async(req, res) => {
    try {

        const userid = req.params.userid;
        const userCart = await cart.findOne({ userid }).populate("products.productid");
        if (!userCart || userCart.products.length === 0) {
            return res.status(400).json({ message: "Cart is empty" });
        }

        const totalAmount = userCart.products.reduce(
            (sum, item) => sum + item.productid.price * item.quantity,
            0
        );

        if (totalAmount <= 0) {
            return res.status(400).json({ message: "Invalid total amount", totalAmount });
        }

        return res.status(200).json({ message: "Total Amount Calculated", totalAmount });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const applypromocode = async(req, res) => {
    try {
        const userid = req.params.userid;
        const { promocode } = req.body;
        const userCart = await cart.findOne({ userid }).populate("products.productid");
        if (!userCart || userCart.products.length === 0) {
            return res.status(400).json({ message: "Cart is empty" });
        }
        const promocodeData = await PromoCode.findOne({ code: promocode });
        if (!promocodeData) {
            return res.status(400).json({ message: "Invalid promocode" });
        }
        const totalAmount = userCart.products.reduce(
            (sum, item) => sum + item.productid.price * item.quantity,
            0
        );
        const discount = (totalAmount * promocodeData.discountValue) / 100;
        const finalAmount = totalAmount - discount;
        return res.status(200).json({ message: "Promocode applied", finalAmount });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



// const processPayment = async(req, res) => {
//     try {
//         const { userid } = req.params;
//         const { paymentMethodId } = req.body; 

//         // ✅ Fetch User Cart
//         const userCart = await cart.findOne({ userid }).populate({
//             path: "products.productid",
//             model: "Product"
//         });

//         if (!userCart || userCart.products.length === 0) {
//             return res.status(400).json({ message: "Cart is empty" });
//         }


//         const totalAmount = userCart.products.reduce(
//             (sum, item) => sum + item.productid.price * item.quantity,
//             0
//         );

//         if (totalAmount <= 0) {
//             return res.status(400).json({ message: "Invalid total amount", totalAmount });
//         }


//         const paymentIntent = await stripe.paymentIntents.create({
//             amount: Math.round(totalAmount * 100), 
//             currency: "usd",
//             payment_method: paymentMethodId,
//             confirm: true,
//         });


//         const newPayment = new Payment({
//             userid,
//             amount: totalAmount,
//             currency: "usd",
//             paymentMethodId,
//             paymentStatus: "successful",
//             transactionId: paymentIntent.id
//         });

//         await newPayment.save();


//         userCart.products = [];
//         await userCart.save();

//         res.status(200).json({
//             message: "Payment successful",
//             paymentIntent,
//             totalAmount
//         });

//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };





export { addToUserCart, getusercart, updatecartquantity, deleteFromCart, processPayment, gustuser, applypromocode }