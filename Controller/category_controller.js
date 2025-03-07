import Category from "../models/Category";
import userModel from "../models/User";
export async function createCategory(req, res) {
  try {
    const { name, description } = req.body;
    if (!name) {
      return res.status(400).json({ error: "Category name is required" });
    }
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({ error: "Category already exists" });
    }
    const category = new Category({ name, description });
    await category.save();
    res
      .status(201)
      .json({ message: "Category created successfully", category });
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
export async function getCategoryById(req, res) {
  try {
    const category = await Category.findById(req.params.id);
    res.status(200).json(category);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
export async function updateCategory(req, res) {
  try {
    const { name, description } = req.body;
    const categoryId = req.params.id;
    const existingCategory = await Category.findById(categoryId);
    if (!existingCategory) {
      return res.status(404).json({ error: "Category not found" });
    }
    const updatedCategory = await Category.findByIdAndUpdate(
      categoryId,
      req.body,
      { new: true }
    );
    if (name && name !== existingCategory.name) {
      await Product.updateMany(
        { category: existingCategory.name },
        { category: name }
      );
    }
    res.status(200).json(updatedCategory);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
export async function deleteCategory(req, res) {
  try {
    const categoryId = req.params.id;
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }
    await Product.deleteMany({ category: category.name });
    await Category.findByIdAndDelete(categoryId);
    res.status(204).json();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
