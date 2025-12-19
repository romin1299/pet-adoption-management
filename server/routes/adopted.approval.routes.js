import express from "express";
import {
  getAdoptionRequests,
  ApprovalAndRejectOfRequest,
} from "../controllers/adopted.approval.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
import authorizeRoles from "../middleware/authorization.middleware.js";

const router = express.Router();

router.get("/adoptions", authMiddleware, getAdoptionRequests);
router.post("/:id/decision", authMiddleware, authorizeRoles("admin"), ApprovalAndRejectOfRequest);

export default router;
