import { cart } from "../Model/cart_model.js"
import { Product } from "../Model/product_model.js";
import { Payment } from "../Model/payment_model.js";
import { PromoCode } from "../Model/promocode_model.js";
import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const getusercart = async(req, res) => {
    try {

        const userid = req.user.id;
        const cartdata = await cart.find({ userid: userid })
        res.status(200).json(cartdata.length ? cartdata : "Your Cart is empty");
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



const addtousercart = async(req, res) => {
    try {
        const userid = req.user.id;
        const { productid, quantity } = req.body;
        let userCart = await cart.findOne({ userid });

        if (userCart) {
            const product = userCart.products.find((item) => item.productid == productid);
            if (product) {
                res.json({ message: "Product already exists in your cart" });
            } else {
                userCart.products.push({ productid });
            }

            await userCart.save();
            res.json({ message: "Product added to cart" });

        } else {
            const newCart = new cart({
                userid,
                products: [{ productid, quantity }]
            });

            await newCart.save();
            res.json({ message: "New cart created and product added" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updatecartquantity = async(req, res) => {
    try {
        const userid = req.user.id;
        const { productid, quantity } = req.body;
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

const deletefromcart = async(req, res) => {
    try {
        const userid = req.user.id;
        const { productid } = req.body;
        const userCart = await cart.findOne({ userid });
        if (userCart) {
            const productIndex = userCart.products.findIndex((product) => product.productid == productid);
            if (productIndex >= 0) {
                userCart.products.splice(productIndex, 1);
                await userCart.save();
                res.json({ message: "Product deleted from cart" });
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



const gustuser = async(req, res) => {
    try {
        req.session.cart = req.body.cart || [];
        const cart = req.session.cart;
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const processPayment = async(req, res) => {
    try {
        const userid = req.user.id;

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
        const userid = req.user.id;
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





export { addtousercart, getusercart, updatecartquantity, deletefromcart, processPayment, gustuser, applypromocode }