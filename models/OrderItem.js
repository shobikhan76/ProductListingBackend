import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const OrderItem = sequelize.define(
  "OrderItem",
  {
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "orders", key: "id" },
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "products", key: "id" },
    },
    quantity: { type: DataTypes.INTEGER, allowNull: false },
    price: { type: DataTypes.FLOAT, allowNull: false }, // snapshot price
  },
  {
    tableName: "orderitems",
    timestamps: true,
  }
);

export default OrderItem;
