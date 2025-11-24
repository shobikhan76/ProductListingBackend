import { sequelize } from "../config/db.js";    
import Cart from "../models/Cart.js";
import CartItem from "../models/CartItem.js";
import Order from "../models/Order.js";
import OrderItem from "../models/OrderItem.js";
import Product from "../models/Product.js";

export const createOrder = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { shippingAddress, paymentMethod } = req.body; // paymentMethod can be e.g., 'stripe' or 'cod'

    const cart = await Cart.findOne({
      where: { userId: req.user.id },
      include: { model: CartItem, include: Product },
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    if (!cart || cart.CartItems.length === 0) {
      await t.rollback();
      return res.status(400).json({ message: "Cart is empty" });
    }

    // calculate total
    const total = cart.CartItems.reduce((sum, ci) => sum + ci.quantity * ci.priceAtAdd, 0);

    // Optionally: Integrate payment here (Stripe, PayPal...) and confirm payment before creating order.
    // If using Stripe, create payment intent and confirm client-side then call this route to finalize.

    // Create order
    const order = await Order.create(
      {
        userId: req.user.id,
        status: paymentMethod === "cod" ? "pending" : "paid", // adjust as per real payment result
        total,
        shippingAddress,
        paymentInfo: { method: paymentMethod },
      },
      { transaction: t }
    );

    // create order items
    for (const ci of cart.CartItems) {
      await OrderItem.create(
        {
          orderId: order.id,
          productId: ci.productId,
          quantity: ci.quantity,
          price: ci.priceAtAdd,
        },
        { transaction: t }
      );
      // Optionally: reduce product stock if you have inventory
    }

    // clear cart
    await CartItem.destroy({ where: { cartId: cart.id }, transaction: t });

    await t.commit();

    const fullOrder = await Order.findByPk(order.id, { include: OrderItem });
    res.json(fullOrder);
  } catch (err) {
    await t.rollback();
    res.status(500).json({ error: err.message });
  }
};

export const getOrders = async (req, res) => {
  try {
    // if admin: return all, else only user's orders
    if (req.user.role === "admin") {
      const orders = await Order.findAll({ include: OrderItem });
      return res.json(orders);
    }
    const orders = await Order.findAll({ where: { userId: req.user.id }, include: OrderItem });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, { include: OrderItem });
    if (!order) return res.status(404).json({ message: "Not found" });
    if (req.user.role !== "admin" && order.userId !== req.user.id)
      return res.status(403).json({ message: "Not allowed" });

    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    if (req.user.role !== "admin") return res.status(403).json({ message: "Admin only" });

    const order = await Order.findByPk(req.params.id);
    if (!order) return res.status(404).json({ message: "Not found" });

    const { status } = req.body;
    order.status = status;
    await order.save();

    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
