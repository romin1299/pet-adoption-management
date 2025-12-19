import express from "express";
import { registerUser, loginUser, getAuthenticatedUser, logout } from "../controllers/auth.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", authMiddleware, getAuthenticatedUser);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", authMiddleware, logout);

export default router;
