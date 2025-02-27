import { cart } from "../Model/cart_model.js"

const getusercart = async(req, res) => {
    try {
        const { userid } = req.params;
        const cartdata = await cart.find({ userid: userid })
        res.status(200).json(cartdata.length ? cartdata : "Your Cart is empty");
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



const addtousercart = async(req, res) => {
    try {
        const { userid } = req.params;
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
        const { userid } = req.params;
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
        const { userid } = req.params;
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


export { addtousercart, getusercart, updatecartquantity, deletefromcart }