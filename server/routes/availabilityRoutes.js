import express from "express";
import {
  getMyAvailability,
  createAvailability,
  updateAvailability,
  getPublicAvailability,
} from "../controllers/availabilityController.js";
import { protect, adminOnly, doctorOrAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public route — any authenticated user can see available slots
router.get("/", protect, getPublicAvailability);

// Admin or Doctor routes below
router.get("/me", protect, doctorOrAdmin, getMyAvailability);
router.post("/", protect, doctorOrAdmin, createAvailability);
router.put("/:id", protect, doctorOrAdmin, updateAvailability);

export default router;
