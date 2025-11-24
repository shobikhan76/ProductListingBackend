import Cart from "../models/Cart.js";
import CartItem from "../models/CartItem.js";
import Product from "../models/Product.js";
export const getCart = async (req, res) => {
  try {
    // ensure cart exists
    let cart = await Cart.findOne({
      where: { userId: req.user.id },
      include: { model: CartItem, include: Product },
    });

    if (!cart) {
      cart = await Cart.create({ userId: req.user.id });
    }

    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/*   When a user clicks “Add to Cart” on your website:

Check if the product exists

Check if the user has a cart

Create cart if not existing

Check if this item already exists in the cart

If exists → increase quantity

If not exists → add new item

Return updated cart with all items   */
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity  } = req.body;

    const product = await Product.findByPk(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    let cart = await Cart.findOne({ where: { userId: req.user.id } });
    if (!cart) cart = await Cart.create({ userId: req.user.id });

    // check if item exists
    let item = await CartItem.findOne({
      where: { cartId: cart.id, productId },
    });

    if (item) {
      item.quantity = item.quantity + Number(quantity);
      await item.save();
    } else {
      item = await CartItem.create({
        cartId: cart.id,
        productId,
        quantity,
        priceAtAdd: product.price,
      });
    }

    const updated = await Cart.findByPk(cart.id, { include: { model: CartItem, include: Product } });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const { cartItemId } = req.params;
    const { quantity } = req.body;

    const item = await CartItem.findByPk(cartItemId, { include: Cart });
    if (!item) return res.status(404).json({ message: "Item not found" });
    if (item.Cart.userId !== req.user.id) return res.status(403).json({ message: "Not allowed" });

    item.quantity = Number(quantity);
    await item.save();

    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const removeCartItem = async (req, res) => {
  try {
    const { cartItemId } = req.params;

    const item = await CartItem.findByPk(cartItemId, { include: Cart });
    if (!item) return res.status(404).json({ message: "Item not found" });
    if (item.Cart.userId !== req.user.id) return res.status(403).json({ message: "Not allowed" });

    await item.destroy();
    res.json({ message: "Removed" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ where: { userId: req.user.id } });
    if (!cart) return res.json({ message: "Cart already empty" });

    await CartItem.destroy({ where: { cartId: cart.id } });
    res.json({ message: "Cart cleared" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};