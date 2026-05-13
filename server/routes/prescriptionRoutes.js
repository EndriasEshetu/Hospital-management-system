import express from "express";
import {
  createPrescription,
  getPatientPrescriptions,
  getDoctorPrescriptions,
} from "../controllers/prescriptionController.js";
import { protect, doctorOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, doctorOnly, createPrescription);
router.get("/doctor", protect, doctorOnly, getDoctorPrescriptions);
router.get("/:patientId", protect, getPatientPrescriptions);

export default router;
