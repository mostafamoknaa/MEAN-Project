import express from "express";
import {
    createcategoryModel,
    getCategories,
    getcategoryModelById,
    updatecategoryModel,
    deleteCategory,
} from "../Controller/category_controller.js";
import { authMiddleware } from "../Middleware/auth_token.js";


export const catrouter = express.Router();

 // catrouter.use(authMiddleware);

catrouter.post("/createcategory",authMiddleware ,createcategoryModel);
catrouter.get("/allcategory", authMiddleware,getCategories);
catrouter.get("/getcategorybyid/:id",authMiddleware, getcategoryModelById);
catrouter.put("/updatecategory/:id",authMiddleware, updatecategoryModel);
catrouter.delete("/deletecategory/:id", authMiddleware,deleteCategory);