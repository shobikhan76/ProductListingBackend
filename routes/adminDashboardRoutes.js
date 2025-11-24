import express from "express";
import {
  getAdminStats,
  getMonthlyUserStats,
  getMonthlyProductStats,
  getLatestUsers,
  getLatestInquiries,
  getLowStockProducts,
  getMostWishlisted,
} from "../controllers/adminDashboardController.js";
import { protect, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * /api/admin/dashboard/stats:
 *   get:
 *     summary: Get admin dashboard statistics (Admin only)
 *     tags:
 *       - Admin Dashboard
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Not authorized - Admin only
 *       500:
 *         description: Server error
 */
router.get("/stats", protect, isAdmin, getAdminStats);

/**
 * @swagger
 * /api/admin/dashboard/charts/users:
 *   get:
 *     summary: Get monthly user statistics (Admin only)
 *     tags:
 *       - Admin Dashboard
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Monthly user data for charts
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Not authorized - Admin only
 *       500:
 *         description: Server error
 */
router.get("/charts/users", protect, isAdmin, getMonthlyUserStats);

/**
 * @swagger
 * /api/admin/dashboard/charts/products:
 *   get:
 *     summary: Get monthly product statistics (Admin only)
 *     tags:
 *       - Admin Dashboard
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Monthly product data for charts
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Not authorized - Admin only
 *       500:
 *         description: Server error
 */
router.get("/charts/products", protect, isAdmin, getMonthlyProductStats);

/**
 * @swagger
 * /api/admin/dashboard/latest/users:
 *   get:
 *     summary: Get latest registered users (Admin only)
 *     tags:
 *       - Admin Dashboard
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of latest users
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Not authorized - Admin only
 *       500:
 *         description: Server error
 */
router.get("/latest/users", protect, isAdmin, getLatestUsers);

/**
 * @swagger
 * /api/admin/dashboard/latest/inquiries:
 *   get:
 *     summary: Get latest customer inquiries (Admin only)
 *     tags:
 *       - Admin Dashboard
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of latest inquiries
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Not authorized - Admin only
 *       500:
 *         description: Server error
 */
router.get("/latest/inquiries", protect, isAdmin, getLatestInquiries);

/**
 * @swagger
 * /api/admin/dashboard/products/low-stock:
 *   get:
 *     summary: Get low stock products (Admin only)
 *     tags:
 *       - Admin Dashboard
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of low stock products
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Not authorized - Admin only
 *       500:
 *         description: Server error
 */
router.get("/products/low-stock", protect, isAdmin, getLowStockProducts);

/**
 * @swagger
 * /api/admin/dashboard/products/most-wishlisted:
 *   get:
 *     summary: Get most wishlisted products (Admin only)
 *     tags:
 *       - Admin Dashboard
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of most wishlisted products
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Not authorized - Admin only
 *       500:
 *         description: Server error
 */
router.get("/products/most-wishlisted", protect, isAdmin, getMostWishlisted);

export default router;
