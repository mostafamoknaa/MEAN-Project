import { productModel } from "../../DataBase/Model/product.model.js";

// Get all products
const getProducts = async (req, res) => {
    const products = await productModel.find().populate("category subcategory seller");
    res.status(200).json({ message: "Done", data: products });
};

// Get product by ID
const getProductById = async (req, res) => {
    try {
        const product = await productModel.findById(req.params.id).populate({
            path: "category",
            select: "name _id"
        });

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json({ message: "Done", data: product });
    } catch (error) {
        res.status(500).json({ error: "Invalid ID format or internal error" });
    }
};


// Create new product
const createProduct = async (req, res) => {
    const newProduct = new productModel(req.body);
    await newProduct.save();
    res.status(201).json({ message: "Product created", data: newProduct });
};

// Update product
const updateProduct = async (req, res) => {
    const updatedProduct = await productModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedProduct) return res.status(404).json({ message: "Product not found" });
    res.status(200).json({ message: "Product updated", data: updatedProduct });
};

// Delete product
const deleteProduct = async (req, res) => {
    const deletedProduct = await productModel.findByIdAndDelete(req.params.id);
    if (!deletedProduct) return res.status(404).json({ message: "Product not found" });
    res.status(200).json({ message: "Product deleted" });
};

export {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};