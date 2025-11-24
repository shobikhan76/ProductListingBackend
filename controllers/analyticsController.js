import Product from "../models/Product.js";
import Inquiry from "../models/Inquiry.js";
import { Sequelize } from "sequelize";

// ========== TOP VIEWED PRODUCTS ==========
export const getTopViewedProducts = async (req, res) => {
  try {
    // Note: Product model uses 'view' (singular) and 'name' for title
    const products = await Product.findAll({
      order: [["view", "DESC"]],
      limit: 10,
      attributes: ["id", "name", "price", "view", "createdAt"],
    });

    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ========== TOTAL COUNTS ==========
export const getCounts = async (req, res) => {
  try {
    const productsCount = await Product.count();
    const inquiriesCount = await Inquiry.count();

    // Sum the 'view' column (matches Product model)
    const totalViews = await Product.sum("view");

    res.json({
      productsCount,
      inquiriesCount,
      totalViews,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
