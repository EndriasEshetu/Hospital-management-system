import express from "express";
import { getDashboardMetrics } from "../controllers/adminController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/dashboard", protect, adminOnly, getDashboardMetrics);

export default router;