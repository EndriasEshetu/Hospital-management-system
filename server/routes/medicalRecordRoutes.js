import express from "express";
import {
  createMedicalRecord,
  getPatientMedicalRecords,
} from "../controllers/medicalRecordController.js";
import { protect, doctorOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, doctorOnly, createMedicalRecord);
router.get("/:patientId", protect, getPatientMedicalRecords);

export default router;
