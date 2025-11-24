import express from "express";
import {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
} from "../controllers/orderController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

/**
 * @swagger
 * /api/order:
 *   post:
 *     summary: Create a new order from cart
 *     tags:
 *       - Orders
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Order created successfully
 *       400:
 *         description: Cart is empty
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post("/", createOrder);

/**
 * @swagger
 * /api/order:
 *   get:
 *     summary: Get orders (Admin gets all, User gets own)
 *     tags:
 *       - Orders
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of orders
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get("/", getOrders);

/**
 * @swagger
 * /api/order/{id}:
 *   get:
 *     summary: Get order details by ID
 *     tags:
 *       - Orders
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Order details
 *       404:
 *         description: Order not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get("/:id", getOrderById);

/**
 * @swagger
 * /api/order/{id}/status:
 *   put:
 *     summary: Update order status (Admin only)
 *     tags:
 *       - Orders
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
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
 *               status:
 *                 type: string
 *                 enum: [pending, confirmed, shipped, delivered, cancelled]
 *     responses:
 *       200:
 *         description: Order status updated
 *       404:
 *         description: Order not found
 *       403:
 *         description: Not authorized
 *       500:
 *         description: Server error
 */
router.put("/:id/status", updateOrderStatus);

export default router;
