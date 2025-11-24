import express from "express";
import {
  getTopViewedProducts,
  getCounts,
} from "../controllers/analyticsController.js";

import { protect, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * /api/analytics/top-viewed:
 *   get:
 *     summary: Get top viewed products (Admin only)
 *     tags:
 *       - Analytics
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of top viewed products
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Not authorized - Admin only
 *       500:
 *         description: Server error
 */
router.get("/top-viewed", protect, isAdmin, getTopViewedProducts);

/**
 * @swagger
 * /api/analytics/counts:
 *   get:
 *     summary: Get analytics counts (Admin only)
 *     tags:
 *       - Analytics
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Analytics data including user count, product count, order count, etc.
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Not authorized - Admin only
 *       500:
 *         description: Server error
 */
router.get("/counts", protect, isAdmin, getCounts);

export default router;
