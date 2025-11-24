import express from "express";
import dotenv from "dotenv";
import serverless from "serverless-http";

dotenv.config();

import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import WishlistRoutes from "./routes/wishlistRoutes.js";
import inquiryRoutes from "./routes/inquiryRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import adminDashboardRoutes from "./routes/adminDashboardRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import xss from "xss-clean";
import { apiLimiter as rateLimiter } from "./middleware/apiLimiter.js";
import hpp from "hpp";
import paymentRoutes from "./routes/paymentRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import { swaggerSpec } from "./config/swagger.js";
import swaggerUi from "swagger-ui-express";

const app = express();

// Connect DB ONCE for serverless
connectDB();

// Middlewares
app.use(helmet());
app.use(express.json());
app.use(cors());
app.use(morgan("combined"));
app.use(hpp());
app.use(xss());

// Routes
app.use("/api/auth", rateLimiter, authRoutes);
app.use("/api/product", productRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/wishlist", WishlistRoutes);
app.use("/api/inquiry", inquiryRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/admin/dashboard", adminDashboardRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/chat", chatRoutes);

app.get("/", (req, res) => {
  res.send("API is running on Vercel...");
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// 🚫 REMOVE app.listen()
// ✅ EXPORT serverless handler
export default serverless(app);
