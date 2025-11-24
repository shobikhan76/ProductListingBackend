import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { createCheckoutSession } from "../controllers/paymentController.js";
import { stripeWebhook } from "../controllers/webhookController.js";
import bodyParser from "body-parser";

const router = express.Router();

/**
 * @swagger
 * /api/payment/create-checkout-session:
 *   post:
 *     summary: Create Stripe checkout session
 *     tags:
 *       - Payments
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: integer
 *                     quantity:
 *                       type: integer
 *     responses:
 *       200:
 *         description: Checkout session created
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post("/create-checkout-session", protect, createCheckoutSession);

/**
 * @swagger
 * /api/payment/webhook:
 *   post:
 *     summary: Stripe webhook endpoint
 *     tags:
 *       - Payments
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Webhook received
 *       400:
 *         description: Invalid signature
 *       500:
 *         description: Server error
 */
router.post(
  "/webhook",
  bodyParser.raw({ type: "application/json" }),
  stripeWebhook
);

export default router;
