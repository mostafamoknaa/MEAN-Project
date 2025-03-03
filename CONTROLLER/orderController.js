import orderModel from "../MODELS/orderModel.js"
import Productmodel from "../MODELS/productmodel.js";
import userModel from "../MODELS/userModel.js";




const getOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const userinfo=await userModel.findById(userId);
   
    let userrole=userinfo.role;
     if(userrole=="admin"){

    const orders = await orderModel.find({});
    res.status(200).json(orders);
     }else{

      res.status(400).json({massege:"your role not admin "});
     }
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};


const createOrder = async (req, res) => {
  try {
      const {  products, shippingAddress, paymentMethod, discount } = req.body;

      if (!products || products.length === 0) {
          return res.status(400).json({ message: "No products in the order." });
      }

      let calculatedTotalPrice = 0;
      const orderProducts = [];

     
      for (const item of products) {
          const product = await Productmodel.findById(item.product);
          if (!product) {
              return res.status(404).json({ message: `Product with ID ${item.product} not found.` });
          }

       
          orderProducts.push({
              product: item.product,
              quantity: item.quantity,
              price: product.price * item.quantity, 
          });

          calculatedTotalPrice += product.price * item.quantity;
      }

   
      if (discount?.amount) {
          calculatedTotalPrice -= discount.amount;
      }

     
      const newOrder = new orderModel({
          user: req.user.id,
          products: orderProducts,
          total_price: calculatedTotalPrice,
          shippingAddress,
          paymentMethod,
          discount,
      });

      await newOrder.save();
      res.status(201).json({ message: "Order created successfully", order: newOrder });

  } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
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

const updateOrder = async (req, res) => {
  try {
      const orderid = req.params.id;
      const { status, shippingAddress, paymentMethod, discount, products } = req.body;

      
      const order = await orderModel.findOne({ user: req.user.id, _id: orderid });
      if (!order) {
          return res.status(404).json({ message: "Order not found" });
      }

     
      if (status) {
          order.status = status;
      }
      if (shippingAddress) {
          order.shippingAddress = shippingAddress;
      }
      if (paymentMethod) {
          order.paymentMethod = paymentMethod;
      }
      if (discount) {
          order.discount = discount;
      }

      
      if (products && products.length > 0) {
          let calculatedTotalPrice = 0;
          const updatedProducts = [];

          for (const item of products) {
              const product = await Productmodel.findById(item.product);
              if (!product) {
                  return res.status(404).json({ message: `Product with ID ${item.product} not found.` });
              }

              updatedProducts.push({
                  product: item.product,
                  quantity: item.quantity,
                  price: product.price * item.quantity, 
              });

              calculatedTotalPrice += product.price * item.quantity;
          }

          order.products = updatedProducts;
          order.total_price = calculatedTotalPrice - (order.discount?.amount || 0);
      }

      await order.save();
      res.status(200).json({ message: "Order updated successfully", order });

  } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
  }
};




const deleteorder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const userId = req.user.id;
    const userinfo=await userModel.findById(userId);
   
    let userrole=userinfo.role;

    
    const order = await orderModel.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

  
    if (order.user.toString() !== userId && userrole !== "admin") {
      return res.status(403).json({ message: "Not authorized to delete this order" });
    }


    await orderModel.findByIdAndDelete(orderId);

    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};





export { getOrders, createOrder, getUserOrders ,updateOrder,deleteorder}          
