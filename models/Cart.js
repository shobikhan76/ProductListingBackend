import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import User from "./User.js";
import CartItem from "./CartItem.js";
import Product from "./Product.js";
const Cart = sequelize.define(
  "Cart",
  {
    userId: { type: DataTypes.INTEGER, allowNull: false, unique: true },
  },
  {
    tableName: "carts",
    timestamps: true,
  }
);

User.hasOne(Cart, { foreignKey: "userId", onDelete: "CASCADE" });
Cart.belongsTo(User, { foreignKey: "userId" });

Cart.hasMany(CartItem, { foreignKey: "cartId", onDelete: "CASCADE" });
CartItem.belongsTo(Cart, { foreignKey: "cartId" });

Product.hasMany(CartItem, { foreignKey: "productId", onDelete: "CASCADE" });
CartItem.belongsTo(Product, { foreignKey: "productId" });

export default Cart;
