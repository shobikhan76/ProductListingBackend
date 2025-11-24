import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { sendMessage, getChatHistory } from "../controllers/chatController.js";

const router = express.Router();

/**
 * @swagger
 * /api/chat/send:
 *   post:
 *     summary: Send message to chatbot
 *     tags:
 *       - Chat
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: "Hello, I need help with my order"
 *     responses:
 *       200:
 *         description: Chatbot response
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post("/send", protect, sendMessage);

/**
 * @swagger
 * /api/chat/history:
 *   get:
 *     summary: Get chat history
 *     tags:
 *       - Chat
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User's chat history
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get("/history", protect, getChatHistory);

export default router;
