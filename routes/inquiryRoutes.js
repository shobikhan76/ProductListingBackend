import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createInquiry,
  getInquiries,
} from "../controllers/inquiryController.js";

const router = express.Router();

/**
 * @swagger
 * /api/inquiry:
 *   post:
 *     summary: Create a new inquiry (Public - guest allowed)
 *     tags:
 *       - Inquiries
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: integer
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               message:
 *                 type: string
 *     responses:
 *       201:
 *         description: Inquiry created successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
router.post("/", createInquiry);

/**
 * @swagger
 * /api/inquiry:
 *   get:
 *     summary: Get all inquiries (Admin only)
 *     tags:
 *       - Inquiries
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all inquiries
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Not authorized - Admin only
 *       500:
 *         description: Server error
 */
router.get("/", protect, getInquiries);

export default router;
