import { productModel } from "../Model/product.model.js";

// Get all products
const getProducts = async (req, res) => {
    try {
        let { search, minPrice, maxPrice, category, sortBy, order } = req.query;
        let query = {};
        let sortOptions = {};

        if (search) {
            query.name = { $regex: search, $options: "i" };
        }

        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = parseFloat(minPrice);
            if (maxPrice) query.price.$lte = parseFloat(maxPrice);
        }

        if (category) {
            query.category = category;
        }

        if (sortBy) {
            const validFields = ["price", "createdAt"];
            if (validFields.includes(sortBy)) {
                sortOptions[sortBy] = order === "desc" ? -1 : 1;
            }
        }

        const products = await productModel.find(query).sort(sortOptions);

        if (products.length === 0) {
            return res.status(404).json({ message: "No products found matching your search." });
        }

        res.status(200).json({ message: "Done", data: products });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
};

// Get product by ID
const getProductById = async (req, res) => {
    try {
        const product = await productModel.findById(req.params.id);

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

// Stock availability
const getStockAvailability = async (req, res) => {
    try {
        const stock = await productModel.find({ stock: { $gt: 0 } });

        if (stock.length === 0) {
            return res.status(404).json({ message: "No products in stock" });
        }

        res.status(200).json({ message: "Done", data: stock });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
};

// Stock availability By Id
const getStockAvailabilityById = async (req, res) => {
    try {
        const product = await productModel.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json({ 
            message: "Stock availability fetched successfully", 
            stock: product.stock 
        });
    } catch (error) {
        console.error("Error fetching stock availability:", error);
        res.status(500).json({ message: "Server Error", error });
    }
};


export {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    getStockAvailability,
    getStockAvailabilityById
};
