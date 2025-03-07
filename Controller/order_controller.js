import { cart } from "../Model/cart_model.js";
import { PromoCode } from "../Model/promocode_model.js";
import { orderModel } from "../Model/order_model.js";
import { sendEmail } from "../Email/ordermail.js";
import { Product } from "../Model/product_model.js";

const makeorder = async(req, res) => {
    try {
        const userid = req.user.id;
        const email = req.user.email;
        const { shippingAddress, paymentMethod, promoCode } = req.body;


        const usercart = await cart.findOne({ userid }).populate("products.productid");
        if (!usercart || usercart.products.length === 0) {
            return res.status(400).json({ message: "Your cart is empty" });
        }

        let totalAmount = 0;
        let discountAmount = 0;
        let productUpdates = [];
        for (const item of usercart.products) {
            const product = await Product.findOne({ _id: item.productid._id, stock: { $gte: item.quantity } });

            if (!product) {
                return res.status(400).json({ message: `Product '${item.productid.name}' is out of stock or unavailable.` });
            }

            totalAmount += item.productid.price * item.quantity;



            productUpdates.push({
                productId: product._id,
                newStock: product.stock - item.quantity
            });
        }



        if (promoCode) {
            const promoCodeData = await PromoCode.findOne({ code: promoCode });

            if (promoCodeData && promoCodeData.isActive && promoCodeData.expirationDate > new Date()) {
                discountAmount = (totalAmount * promoCodeData.discountValue) / 100;
                totalAmount -= discountAmount;
            }
        }


        let paymentStatus = paymentMethod === "card" ? "pending" : "paid";

        const newOrder = new orderModel({
            user: userid,
            items: usercart.products.map((item) => ({
                product: item.productid._id,
                name: item.productid.name,
                price: item.productid.price,
                quantity: item.quantity,
            })),
            totalAmount,
            discount: { code: promoCode || null, amount: discountAmount },
            status: "processing",
            shippingAddress,
            paymentMethod,
            paymentStatus
        });

        await newOrder.save();
        sendEmail(email, newOrder);
        await cart.findOneAndUpdate({ userid }, { $set: { products: [] } });

        for (const update of productUpdates) {
            await Product.findByIdAndUpdate(update.productId, { stock: update.newStock });
        }


        res.status(201).json({ message: "Order placed successfully", order: newOrder });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getallorders = async(req, res) => {
    try {
        const orders = await orderModel.find({});
        res.status(200).json({ orders });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}
const getuserorder = async(req, res) => {
    try {
        const userid = req.user.id;
        const orders = await orderModel.find({ user: userid });
        res.status(200).json({ orders });

    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

const cancleorder = async(req, res) => {
    try {
        const orderId = req.params.orderId;
        const userId = req.user.id;


        const order = await orderModel.findOne({ _id: orderId, user: userId });

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        if (order.status !== "processing") {
            return res.status(400).json({ message: "Order cannot be canceled at this stage" });
        }

        for (const item of order.items) {
            await Product.findByIdAndUpdate(item.product, {
                $inc: { stock: item.quantity }
            });
        }

        order.status = "cancelled";
        await order.save();

        res.status(200).json({ message: "Order canceled successfully, stock restored", order });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const deliverorder = async(req, res) => {
    try {
        const { orderId } = req.params;
        const userId = req.user.id;


        const order = await orderModel.findOne({ _id: orderId, user: userId });

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        if (order.status !== "processing") {
            return res.status(400).json({ message: "Order cannot be marked as delivered at this stage" });
        }

        order.status = "delivered";
        await order.save();

        res.status(200).json({ message: "Order marked as delivered successfully", order });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }

}



export { makeorder, getallorders, getuserorder, cancleorder, deliverorder };