import express from "express";
import {
  createMedicalRecord,
  getPatientMedicalRecords,
  getDoctorMedicalRecords,
} from "../controllers/medicalRecordController.js";
import { protect, doctorOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, doctorOnly, createMedicalRecord);
router.get("/doctor", protect, doctorOnly, getDoctorMedicalRecords);
router.get("/:patientId", protect, getPatientMedicalRecords);

export default router;
