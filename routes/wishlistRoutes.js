import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
} from "../controllers/wishlistController.js";

const router = express.Router();

/**
 * @swagger
 * /api/wishlist:
 *   get:
 *     summary: Get user's wishlist
 *     tags:
 *       - Wishlist
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User's wishlist items
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get("/", protect, getWishlist);

/**
 * @swagger
 * /api/wishlist:
 *   post:
 *     summary: Add product to wishlist
 *     tags:
 *       - Wishlist
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
 *     responses:
 *       201:
 *         description: Product added to wishlist
 *       404:
 *         description: Product not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post("/", protect, addToWishlist);

/**
 * @swagger
 * /api/wishlist/{productId}:
 *   delete:
 *     summary: Remove product from wishlist
 *     tags:
 *       - Wishlist
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Product removed from wishlist
 *       404:
 *         description: Item not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.delete("/:productId", protect, removeFromWishlist);

export default router;
