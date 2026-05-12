import express from "express";
import {
  getDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deactivateDoctor,
  reactivateDoctor,
} from "../controllers/doctorController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getDoctors);
router.get("/:id", protect, adminOnly, getDoctorById);
router.post("/", protect, adminOnly, createDoctor);
router.put("/:id", protect, adminOnly, updateDoctor);
router.patch("/:id/deactivate", protect, adminOnly, deactivateDoctor);
router.patch("/:id/reactivate", protect, adminOnly, reactivateDoctor);

export default router;
