import jwt from "jsonwebtoken";
import User from "../models/User.js";

const protect = async (req, res, next) => {
  const token =
    req.headers.authorization && req.headers.authorization.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Fetch user from database
    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user; // store full user object
    next();
  } catch (error) {
    console.error("Protect middleware error:", error.message);
    res.status(401).json({ message: "Token is not valid" });
  }
};

const isAdmin = (req, res, next) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(403).json({ message: "User not found" });
    }

    if (user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    next();
  } catch (error) {
    console.error("isAdmin middleware error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export { protect, isAdmin };
