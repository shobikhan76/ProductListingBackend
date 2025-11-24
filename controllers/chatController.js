import ChatLog from "../models/ChatLog.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

// Simple rule-based bot response
const botReply = (message) => {
  const msg = message.toLowerCase();
  if (msg.includes("hello")) return "Hello! How can I help you today?";
  if (msg.includes("price")) return "You can check the product prices on our catalog page.";
  if (msg.includes("thanks") || msg.includes("thank")) return "You're welcome!";
  return "I am still learning. Can you rephrase?";
};

// POST /api/chat/send
export const sendMessage = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { message } = req.body;

  if (!message) return error(res, "Message is required", 400);

  const reply = botReply(message);

  const chat = await ChatLog.create({
    user_id: userId,
    message,
    bot_reply: reply,
  });

  res.status(201).json({
    success: true,
    message: "Message sent",
    chat,
  }); 
});

// GET /api/chat/history
export const getChatHistory = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const chats = await ChatLog.findAll({
    where: { user_id: userId },
    order: [["timestamp", "ASC"]],
  });

  res.status(200).json({
    success: true,
    chats,
  }); 
  
});
