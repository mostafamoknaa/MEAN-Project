import express from "express";
import {
    getProducts,
    getProductById,
    getStockAvailability,
    getStockAvailabilityById,
    createProduct,
    getAllProducts,
    updateProduct,
    deleteProduct,
} from "../Controller/product_controller.js";

export const productRoutes = express.Router();

productRoutes.get("/products", getProducts);
productRoutes.get("/products/stock", getStockAvailability);
productRoutes.get("/products/stock/:id", getStockAvailabilityById);
productRoutes.get("/products/:id", getProductById);
// productRoutes.post("/products", createProduct);
// productRoutes.put("/products/:id", updateProduct);
// productRoutes.delete("/products/:id", deleteProduct);


productRoutes.post("/createproduct", createProduct);
productRoutes.get("/allproduct", getAllProducts);
productRoutes.get("/getproduct/:id", getProductById);
productRoutes.put("/updataproduct/:id", updateProduct);
productRoutes.delete("/deleteproduct/:id", deleteProduct);