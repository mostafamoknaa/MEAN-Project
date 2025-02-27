import orderModel from "../MODELS/orderModel.js"


const getOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.status(200).json(orders);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};


const createOrder = async (req, res) => {
  try {
    req.body.user=req.user.id;
    const order = new orderModel(req.body);
    await order.save();
    res.status(201).json(order);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log(userId);

    // Find all orders where the user field matches the logged-in user's ID
    const orders = await orderModel.find({ user: userId });

    if (!orders.length) {
      return res.status(404).json({ message: "No orders found for this user" });
    }

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { getOrders, createOrder, getUserOrders }          
