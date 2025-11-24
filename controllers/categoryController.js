import Category from "../models/Category.js";

// ✅ CREATE Category
export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    // Check if category already exists
    const existingCategory = await Category.findOne({ where: { name } });
    if (existingCategory) {
      return res.status(400).json({ message: "Category already exists" });
    }

    const category = await Category.create({ name });
    res.status(201).json({ message: "Category created successfully", category });
  } catch (error) {
    console.error("Create category error:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

// ✅ READ all Categories
export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.status(200).json(categories);
  } catch (error) {
    console.error("Get categories error:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

// ✅ READ single Category by ID
export const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json(category);
  } catch (error) {
    console.error("Get category by ID error:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

// ✅ UPDATE Category
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    category.name = name || category.name;
    await category.save();

    res.status(200).json({ message: "Category updated successfully", category });
  } catch (error) {
    console.error("Update category error:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

// ✅ DELETE Category
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    await category.destroy();
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Delete category error:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};
