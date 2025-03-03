import Productmodel from "../MODELS/productmodel.js";
import SellerModel from "../MODELS/sellerModel.js";

const createProduct = async (req, res) => {
  try {
    const sellerID = req.user.id; // This is the user's ID, not the seller's ID
    const { name, price, category, images, description } = req.body;

    // Find the seller by user_id instead of _id
    const seller = await SellerModel.findOne({ user_id: sellerID });
    if (!seller) {
      return res.status(404).json({ message: "Seller not found" });
    }

    // Create new product
    const newProduct = new Productmodel({
      name,
      price,
      category,
      images,
      description,
      seller_id: seller._id, // Use seller._id (actual seller document ID)
    });

    await newProduct.save();

    // Add product to seller's product list
    seller.products.push(newProduct._id);
    await seller.save();

    res.status(201).json({ message: "Product created successfully", newProduct });

  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};


const getSellerProducts = async (req, res) => {
  try {
    const seller = await SellerModel.findOne({ user_id: req.user.id }).populate("products");
    
    if (!seller) {
      return res.status(404).json({ message: "Seller not found" });
    }

    res.status(200).json({ message: "Products found", products: seller.products });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};


const updateProductBySeller = async (req, res) => {
  try {
    const productID = req.params.id;
    const { name, price, category, images, description } = req.body;
    const sellerID = req.user.id; // The authenticated user's ID

    // Find seller using the user ID
    const seller = await SellerModel.findOne({ user_id: sellerID });
    if (!seller) {
      return res.status(404).json({ message: "Seller not found" });
    }

    // Find the product
    const product = await Productmodel.findById(productID);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Ensure the product belongs to the seller
    if (product.seller_id.toString() !== seller._id.toString()) {
      return res.status(403).json({ message: "Unauthorized: Seller does not own this product" });
    }

    // Update fields only if provided in the request
    if (name !== undefined) product.name = name;
    if (price !== undefined) product.price = price;
    if (category !== undefined) product.category = category;
    if (images !== undefined) product.images = images;
    if (description !== undefined) product.description = description;

    await product.save();

    res.status(200).json({ message: "Product updated successfully", product });

  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

  
const deleteProductBySeller = async (req, res) => {
  try {
    const productID = req.params.id;
    const sellerID = req.user.id; // Authenticated user's ID

    // Find the seller using the user ID
    const seller = await SellerModel.findOne({ user_id: sellerID });
    if (!seller) {
      return res.status(404).json({ message: "Seller not found" });
    }

    // Find the product
    const product = await Productmodel.findById(productID);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Ensure the seller owns the product
    if (product.seller_id.toString() !== seller._id.toString()) {
      return res.status(403).json({ message: "Unauthorized: Seller does not own this product" });
    }

    // Delete the product
    await Productmodel.findByIdAndDelete(productID);

    // Remove the product from the seller's list
    await SellerModel.updateOne(
      { _id: seller._id },
      { $pull: { products: productID } }
    );

    res.status(200).json({ message: "Product deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};




const getAllProducts = async (req, res) => {
    try {
        const products = await Productmodel.find().populate("seller_id");

        if (!products.length) {
            return res.status(404).json({ message: "No products found" });
        }

        res.status(200).json({ message: "Products retrieved successfully", products });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

export { createProduct, getSellerProducts, updateProductBySeller, deleteProductBySeller, getAllProducts };