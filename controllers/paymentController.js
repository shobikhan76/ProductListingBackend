import stripe from "../config/stripe.js";
import CartItem from "../models/CartItem.js";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import OrderItem from "../models/OrderItem.js";
import { asyncHandler } from "../middleware/asyncHandler.js";


export const createCheckoutSession = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  // Fetch user's cart (we store cart per user) and its items
  // The request's `req.user` does not include cartId by default.
  const cart = await Cart.findOne({ where: { userId } });
  let cartId = cart ? cart.id : null;

  // If we couldn't find Cart via model lookup above, try a fallback: check req.user.cartId
  if (!cartId && req.user.cartId) cartId = req.user.cartId;

  // Fetch user's cart items with product details
  if (!cartId) return res.status(400).json({ message: "Cart is empty or not found" });

  const cartItems = await CartItem.findAll({
    where: { cartId },
    include: [{ model: Product }],
  });

  if (!cartItems.length) return res.status(400).json({ message: "Cart is empty" });

  // Map to Stripe line items
  const line_items = cartItems.map((item) => {
    const prod = item.Product || {};
    const unitPrice = item.priceAtAdd != null ? item.priceAtAdd : prod.price || 0;
    return {
      price_data: {
        currency: "usd",
        product_data: {
          name: prod.name || prod.title || "Product",
          description: prod.description || "",
        },
        unit_amount: Math.round(Number(unitPrice) * 100), // cents
      },
      quantity: item.quantity,
    };
  });

  // Create Stripe Checkout Session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items,
    mode: "payment",
    success_url: `${process.env.CLIENT_URL}/checkout-success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.CLIENT_URL}/cart`,
    metadata: { userId: userId.toString() },
  });

  res.json({ id: session.id });
});
