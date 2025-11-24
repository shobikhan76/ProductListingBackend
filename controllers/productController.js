import Product from "../models/Product.js";
import Category from "../models/Category.js";

// ✅ Create Product (Admin)
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, categoryId } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ message: "Product image is required" });
    }

    const existingProduct = await Product.findOne({ where: { name } });
    if (existingProduct) {
      return res
        .status(400)
        .json({ message: "Product with this name already exists" });
    }
    
    // Optional: validate category exists
    const category = await Category.findByPk(categoryId);
    if (!category)
      return res.status(404).json({ message: "Category not found" });

    const product = await Product.create({
      name,
      description,
      price,
      image: req.file.path,
      categoryId,
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error("Error creating product:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

// ✅ Get All Products
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [
        { model: Category, as: "category", attributes: ["id", "name"] },
      ],
      order: [["id", "DESC"]],
    });

    res.status(200).json({ success: true, products });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ✅ Get Single Product
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [
        { model: Category, as: "category", attributes: ["id", "name"] },
      ],
    });

    if (!product) return res.status(404).json({ message: "Product not found" });

    res.status(200).json({ success: true, product });
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ✅ Update Product
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, categoryId } = req.body;

    const product = await Product.findByPk(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const updateData = { name, description, price, categoryId };
    if (req.file) {
      updateData.image = req.file.path;
    }

    await product.update(updateData);

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ✅ Delete Product
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    await product.destroy();

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
