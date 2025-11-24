
import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
const CartItem = sequelize.define(
  "CartItem",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    cartId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "carts", key: "id" }, // lowercase table name
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "products", key: "id" },
    },
    quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
    priceAtAdd: { type: DataTypes.FLOAT, allowNull: false },
  },
  {
    timestamps: true,
    tableName: "cartitems", // ✅ force exact table name in DB
  }
);
export default CartItem;

