import { cart } from "../Model/cart_model.js";
import { PromoCode } from "../Model/promocode_model.js";
import { orderModel } from "../Model/order_model.js";
import { sendEmail } from "../Email/ordermail.js";

const makeorder = async(req, res) => {
    try {
        const userid = req.user.id;
        const email = req.user.email;
        const { shippingAddress, paymentMethod, promoCode } = req.body;


        const usercart = await cart.findOne({ userid }).populate("products.productid");
        if (!usercart || usercart.products.length === 0) {
            return res.status(400).json({ message: "Your cart is empty" });
        }

        let totalAmount = usercart.products.reduce((sum, item) => sum + item.productid.price * item.quantity, 0);
        let discountAmount = 0;


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
        const orderid = req.params.id;
        const order = await orderModel
            .findById(orderid)
            .populate("user", "email");
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        if (order.status === "cancelled") {
            return res.status(400).json({ message: "Order already cancelled" });
        }
        if (order.status === "delivered") {
            return res.status(400).json({ message: "Order already delivered" });
        }
        if (order.status === "processing") {
            return res.status(400).json({ message: "Order already in processing" });
        }
        order.status = "cancelled";
        await order.save();
        sendEmail(order.user.email, order);
        res.status(200).json({ message: "Order cancelled successfully" });

    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

const deliverorder = async(req, res) => {
    try {
        const orderid = req.params.id;
        const order = await orderModel
            .findById(orderid)
            .populate("user", "email");
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        if (order.status === "cancelled") {
            return res.status(400).json({ message: "Order already cancelled" });
        }
        if (order.status === "delivered") {
            return res.status(400).json({ message: "Order already delivered" });
        }
        if (order.status === "processing") {
            return res.status(400).json({ message: "Order already in processing" });
        }
        order.status = "delivered";
        await order.save();
        sendEmail(order.user.email, order);
        res.status(200).json({ message: "Order delivered successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}



export { makeorder, getallorders, getuserorder, cancleorder, deliverorder };