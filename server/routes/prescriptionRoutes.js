import express from "express";
import {
  createPrescription,
  getPatientPrescriptions,
} from "../controllers/prescriptionController.js";
import { protect, doctorOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, doctorOnly, createPrescription);
router.get("/:patientId", protect, getPatientPrescriptions);

export default router;
