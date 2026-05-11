import express from "express";
import {
  getPatients,
  getPatientById,
  updatePatient,
} from "../controllers/patientController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, adminOnly, getPatients);
router.get("/:id", protect, getPatientById);
router.put("/:id", protect, updatePatient);

export default router;
