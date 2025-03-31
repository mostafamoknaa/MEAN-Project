import { Category } from "../Model/category_model.js";
import { Product } from "../Model/product_model.js";
import mongoose from "mongoose";

export async function createcategoryModel(req, res) {
  try {
    const { name, description, image } = req.body;
    if (!name) {
      return res.status(400).json({ error: "categoryModel name is required" });
    }
    const existingcategoryModel = await Category.findOne({ name });
    if (existingcategoryModel) {
      return res.status(400).json({ error: "categoryModel already exists" });
    }
    const category = new Category({ name, description, image });
    await category.save();
    res.status(201).json({
      message: "categoryModel created successfully",
      Category: category,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function getCategories(req, res) {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
export async function getcategoryModelById(req, res) {
  try {
    const Category = await Category.findById(req.params.id);
    res.status(200).json(Category);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
export async function updatecategoryModel(req, res) {
  try {
    const { name, description } = req.body;
    const categoryModelId = req.params.id;
    const existingcategoryModel = await Category.findById(categoryModelId);
    if (!existingcategoryModel) {
      return res.status(404).json({ error: "categoryModel not found" });
    }
    const updatedcategoryModel = await Category.findByIdAndUpdate(
      categoryModelId,
      req.body,
      { new: true }
    );
    if (name && name !== existingcategoryModel.name) {
      await Product.updateMany(
        { Category: existingcategoryModel.name },
        { Category: name }
      );
    }
    res.status(200).json(updatedcategoryModel);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function deleteCategory(req, res) {
  try {
    const categoryId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(400).json({ error: "Invalid category ID format" });
    }

    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    await Product.deleteMany({ category: category._id });

    await Category.findByIdAndDelete(categoryId);

    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
