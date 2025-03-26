import express from "express";
import {
    createcategoryModel,
    getCategories,
    getcategoryModelById,
    getProductsByCategory,
    updatecategoryModel,
    deleteCategory,
} from "../Controller/category_controller.js";
import { authMiddleware } from "../Middleware/auth_token.js";


export const catrouter = express.Router();

catrouter.use(authMiddleware);

catrouter.post("/createcategory", createcategoryModel);
catrouter.get("/allcategory", getCategories);
catrouter.get("/getcategorybyid/:id", getcategoryModelById);
catrouter.get("/getproductsbycategory/:categoryId", getProductsByCategory);
catrouter.put("/updatecategory/:id", updatecategoryModel);
catrouter.delete("/deletecategory/:id", deleteCategory);