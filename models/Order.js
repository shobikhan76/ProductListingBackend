import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const Order = sequelize.define(
  "Order",
  {
    userId: { type: DataTypes.INTEGER, allowNull: false },
    status: {
      type: DataTypes.ENUM("pending", "paid", "shipped", "cancelled"),
      defaultValue: "pending",
    },
    total: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 },
    paymentInfo: { type: DataTypes.STRING, allowNull: true },
    address: { type: DataTypes.JSON, allowNull: true },
  },
  {
    tableName: "orders",
    timestamps: true,
  }
);

export default Order;
