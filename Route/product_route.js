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
  checkCoupon,
  checkPromoCode,
  getFeaturedProducts,
  getProductsOnSale,
} from "../Controller/product_controller.js";

export const productRoutes = express.Router();

// Original routes
productRoutes.get("/products", getProducts);
productRoutes.get("/products/stock", getStockAvailability);
productRoutes.get("/products/stock/:id", getStockAvailabilityById);
productRoutes.get("/products/:id", getProductById);

productRoutes.post("/createproduct", createProduct);
productRoutes.get("/allproduct", getAllProducts);
productRoutes.get("/getproduct/:id", getProductById);
productRoutes.put("/updataproduct/:id", updateProduct); // Note: The typo "updata" is maintained for backward compatibility
productRoutes.delete("/deleteproduct/:id", deleteProduct);

// Coupon/promo code routes
productRoutes.post("/checkcoupon", checkCoupon); // Original route for checking coupon code
productRoutes.post("/checkpromocode", checkPromoCode); // New alias route with updated function name

// New routes for added functionality
productRoutes.get("/featuredproducts", getFeaturedProducts); // Get featured products
productRoutes.get("/saleproducts", getProductsOnSale); // Get products on sale
