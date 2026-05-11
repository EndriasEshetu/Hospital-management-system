import express from "express";
import {
  getDoctors,
  createDoctor,
  updateDoctor,
  deleteDoctor,
} from "../controllers/doctorController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getDoctors);
router.post("/", protect, adminOnly, createDoctor);
router.put("/:id", protect, updateDoctor); // Admin or the doctor themselves
router.delete("/:id", protect, adminOnly, deleteDoctor);

export default router;
