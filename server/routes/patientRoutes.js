import express from "express";
import {
  getPatients,
  getPatientById,
  updatePatient,
  deletePatient,
} from "../controllers/patientController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, adminOnly, getPatients);
router.get("/:id", protect, adminOnly, getPatientById);
router.put("/:id", protect, adminOnly, updatePatient);
router.delete("/:id", protect, adminOnly, deletePatient);

export default router;
