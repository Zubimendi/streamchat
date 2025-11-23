import { Router } from "express";
import {
  getCurrentUser,
  updateProfile,
  getUserById,
  searchUsers,
  updateStatus,
} from "../controllers/user.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const userRoutes = Router();

// All routes require authentication
userRoutes.use(verifyToken);

userRoutes.get("/me", getCurrentUser);
userRoutes.put("/me", updateProfile);
userRoutes.get("/search", searchUsers);
userRoutes.get("/:id", getUserById);
userRoutes.put("/status", updateStatus);

export default userRoutes;
