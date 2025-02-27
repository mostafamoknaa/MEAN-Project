import express from "express";
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct } from "../Controllers/product.Controller.js";

export const productRoutes = express.Router();

productRoutes.get("/products", getProducts);
productRoutes.get("/products/:id", getProductById);
productRoutes.post("/products", createProduct);
productRoutes.put("/products/:id", updateProduct);
productRoutes.delete("/products/:id", deleteProduct);