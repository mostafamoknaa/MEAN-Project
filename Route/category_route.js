import express from "express";
import {
    createcategoryModel,
    getCategories,
    getcategoryModelById,
    updatecategoryModel,
    deleteCategory,
} from "../Controller/category_controller.js";

export const catrouter = express.Router();

catrouter.post("/createcategory", createcategoryModel);
catrouter.get("/allcategory", getCategories);
catrouter.get("/getcategorybyid/:id", getcategoryModelById);
catrouter.put("/updatecategory/:id", updatecategoryModel);
catrouter.delete("/deletecategory/:id", deleteCategory);