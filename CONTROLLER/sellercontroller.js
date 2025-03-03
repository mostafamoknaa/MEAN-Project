import userModel from '../MODELS/userModel.js'
import  SellerModel from '../MODELS/sellerModel.js'


const createseller = async (req, res) => {
    try {
      const userID = req.user?.id; // Ensure req.user exists
      if (!userID) {
        return res.status(401).json({ message: "Unauthorized: No user ID found" });
      }
  
      const { store_name, store_description, phone, street, city } = req.body;
  
      // Check if user exists
      const user = await userModel.findById(userID);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Check if user is already a seller
      if (user.role === "seller") {
        return res.status(400).json({ message: "User is already a seller" });
      }
  
      // Check if store name is unique
      const existingStore = await SellerModel.findOne({ store_name });
      if (existingStore) {
        return res.status(400).json({ message: "Store name already exists" });
      }
  
      // Update user role to seller
      user.role = "seller";
      await user.save();
  
      // Create new seller profile
      const newSeller = new SellerModel({
        user_id: userID,
        store_name,
        store_description,
        contact: { email: user.email, phone }, // Use the user's email
        address: { street, city }
      });
  
      await newSeller.save();
  
      res.status(201).json({ message: "Seller profile created successfully", seller: newSeller });
  
    } catch (error) {
      console.error("Error creating seller:", error);
      res.status(500).json({ message: "Internal server error", error: error.message });
    }
  };
  
export {createseller};