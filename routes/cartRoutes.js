import express from "express";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} from "../controllers/cartController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect); // all cart routes require auth

/**
 * @swagger
 * /api/cart:
 *   get:
 *     summary: Get user's cart
 *     tags:
 *       - Cart
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User's cart with items
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get("/", getCart);

/**
 * @swagger
 * /api/cart:
 *   post:
 *     summary: Add item to cart
 *     tags:
 *       - Cart
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: integer
 *               quantity:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Item added to cart
 *       404:
 *         description: Product not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post("/", addToCart);

/**
 * @swagger
 * /api/cart/item/{cartItemId}:
 *   put:
 *     summary: Update cart item quantity
 *     tags:
 *       - Cart
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cartItemId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantity:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Cart item updated
 *       404:
 *         description: Item not found
 *       403:
 *         description: Not allowed
 *       500:
 *         description: Server error
 */
router.put("/item/:cartItemId", updateCartItem);

/**
 * @swagger
 * /api/cart/item/{cartItemId}:
 *   delete:
 *     summary: Remove item from cart
 *     tags:
 *       - Cart
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cartItemId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Item removed from cart
 *       404:
 *         description: Item not found
 *       403:
 *         description: Not allowed
 *       500:
 *         description: Server error
 */
router.delete("/item/:cartItemId", removeCartItem);

/**
 * @swagger
 * /api/cart:
 *   delete:
 *     summary: Clear entire cart
 *     tags:
 *       - Cart
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart cleared
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.delete("/", clearCart);

export default router;
