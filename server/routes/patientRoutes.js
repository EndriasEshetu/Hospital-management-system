import express from "express";
import {
  getPatients,
  getPatientById,
  updatePatient,
  deletePatient,
  getPatientProfile,
  updatePatientProfile,
  getPatientProfileByUserId,
} from "../controllers/patientController.js";
import { protect, adminOnly, patientOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/profile", protect, patientOnly, getPatientProfile);
router.put("/profile", protect, patientOnly, updatePatientProfile);
router.get("/profile/:userId", protect, getPatientProfileByUserId);

router.get("/", protect, adminOnly, getPatients);
router.get("/:id", protect, adminOnly, getPatientById);
router.put("/:id", protect, adminOnly, updatePatient);
router.delete("/:id", protect, adminOnly, deletePatient);

export default router;
