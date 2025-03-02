import { cart } from "../Model/cart_model.js";
import { PromoCode } from "../Model/promocode_model.js";
import { orderModel } from "../Model/order_model.js";

const makeorder = async(req, res) => {
    try {
        const { userid } = req.params;
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
        const { userid } = req.params;
        const orders = await orderModel.find({ user: userid });
        res.status(200).json({ orders });

    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

export { makeorder, getallorders, getuserorder };