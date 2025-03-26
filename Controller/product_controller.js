import { Product } from "../Model/product_model.js";
import { categoryModel as Category  } from "../Model/category_model.js";

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
            const foundCategory = await Category.findOne({ name: category });
            if (foundCategory) {
                query.category = foundCategory._id; 
            } else {
                return res.status(404).json({ message: "Category not found" });
            }
        }

        if (sortBy) {
            const validFields = ["price", "createdAt"];
            if (validFields.includes(sortBy)) {
                sortOptions[sortBy] = order === "desc" ? -1 : 1;
            }
        }

        const products = await Product.find(query)
        .populate("category", "name _id")
        .select("_id name") 
        .sort(sortOptions);
    

        if (products.length === 0) {
            return res.status(404).json({ message: "No products found matching your search." });
        }

        res.status(200).json({ message: "Done", data: products });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
};


// Get product by ID
const getProductById = async(req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json({ message: "Done", data: product });
    } catch (error) {
        res.status(500).json({ error: "Invalid ID format or internal error" });
    }
};

// // Create new product
// const createProduct = async(req, res) => {
//     const newProduct = new Product(req.body);
//     await newProduct.save();
//     res.status(201).json({ message: "Product created", data: newProduct });
// };

// // Update product
// const updateProduct = async(req, res) => {
//     const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     if (!updatedProduct) return res.status(404).json({ message: "Product not found" });
//     res.status(200).json({ message: "Product updated", data: updatedProduct });
// };

// // Delete product
// const deleteProduct = async(req, res) => {
//     const deletedProduct = await Product.findByIdAndDelete(req.params.id);
//     if (!deletedProduct) return res.status(404).json({ message: "Product not found" });
//     res.status(200).json({ message: "Product deleted" });
// };

// Stock availability
const getStockAvailability = async(req, res) => {
    try {
        const stock = await Product.find({ stock: { $gt: 0 } });

        if (stock.length === 0) {
            return res.status(404).json({ message: "No products in stock" });
        }

        res.status(200).json({ message: "Done", data: stock });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
};

// Stock availability By Id
const getStockAvailabilityById = async(req, res) => {
    try {
        const product = await Product.findById(req.params.id);
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


export async function createProduct(req, res) {
    try {
        const product = new Product(req.body);
        const savedProduct = await product.save();
        return res.status(201).json(savedProduct);
    } catch (error) {
        console.error("Error creating product:", error);
        return res.status(500).json({ error: " error" });
    }
}

export async function getAllProducts(req, res) {
    try {
        const products = await Product.find();
        return res.status(200).json(products);
    } catch (error) {
        console.error("Error fetching products:", error);
        return res.status(500).json({ error: " error" });
    }
}

// export async function getProductById(req, res) {
//     try {
//         const product = await Product.findById(req.params.id);
//         if (!product) {
//             return res.status(404).json({ error: "Product not found" });
//         }
//         return res.status(200).json(product);
//     } catch (error) {
//         console.error("Error fetching product:", error);
//         return res.status(500).json({ error: " error" });
//     }
// }

export async function updateProduct(req, res) {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            req.body, { new: true }
        );
        if (!updatedProduct) {
            return res.status(404).json({ error: "Product not found" });
        }
        return res.status(200).json(updatedProduct);
    } catch (error) {
        console.error("Error updating product:", error);
        return res.status(500).json({ error: " error" });
    }
}

export async function deleteProduct(req, res) {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        if (!deletedProduct) {
            return res.status(404).json({ error: "Product not found" });
        }
        return res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        console.error("Error deleting product:", error);
        return res.status(500).json({ error: " error" });
    }
}

export {
    getProducts,
    getProductById,
    // createProduct,
    // updateProduct,
    // deleteProduct,
    getStockAvailability,
    getStockAvailabilityById
};