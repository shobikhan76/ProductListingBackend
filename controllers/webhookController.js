import stripe from "../config/stripe.js";
import Order from "../models/Order.js";
import OrderItem from "../models/OrderItem.js";
import CartItem from "../models/CartItem.js";
import Product from "../models/Product.js";
import Cart from "../models/Cart.js";

export const stripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error("Webhook Error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const userId = session.metadata.userId;

    // Find user's cart first
    const cart = await Cart.findOne({ where: { userId } });
    if (!cart) return res.status(400).json({ message: "Cart not found" });

    // Fetch cart items
    const cartItems = await CartItem.findAll({
      where: { cartId: cart.id },
      include: Product,
    });

    if (!cartItems.length)
      return res.status(400).json({ message: "Cart empty" });

    // Create Order
    const order = await Order.create({
      userId: userId,
      status: "paid",
      total: session.amount_total / 100,
      paymentInfo: session.payment_intent,
    });

    // Create OrderItems
    const orderItemsData = cartItems.map((item) => ({
      orderId: order.id,
      productId: item.Product.id,
      quantity: item.quantity,
      price: item.Product.price,
    }));

    await OrderItem.bulkCreate(orderItemsData);

    // Clear Cart
    await CartItem.destroy({ where: { cartId: cart.id } });
  }

  res.json({ received: true });
};
