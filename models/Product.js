
import {sequelize} from "../config/db.js";
import { DataTypes } from "sequelize";
import Category from "./Category.js";

const Product = sequelize.define("Product", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING,
  },
  categoryId: {
    type: DataTypes.INTEGER,
    references: { model: "categories", key: "id" },
  },
  view:{
  type: DataTypes.INTEGER,
  defaultValue: 0,
}
}, {
  tableName: "products",   
  timestamps: true,
});

// Associations
Product.belongsTo(Category, { foreignKey: "categoryId", as: "category" });
Category.hasMany(Product, { foreignKey: "categoryId", as: "products" });

export default Product;
