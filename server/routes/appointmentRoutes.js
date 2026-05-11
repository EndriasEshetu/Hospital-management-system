import express from "express";
import {
  getDoctorAppointments,
  updateAppointmentStatus,
  createAppointment,
  getMyAppointments,
  rescheduleAppointment,
  cancelAppointment,
  getAllAppointments,
} from "../controllers/appointmentController.js";
import { protect, doctorOnly, patientOnly, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// ── Admin routes ─────────────────────────────────
router.get("/", protect, adminOnly, getAllAppointments);

// ── Patient routes ─────────────────────────────────
router.post("/", protect, patientOnly, createAppointment);
router.get("/me", protect, patientOnly, getMyAppointments);
router.put("/:id/reschedule", protect, patientOnly, rescheduleAppointment);
router.put("/:id/cancel", protect, patientOnly, cancelAppointment);

// ── Doctor routes ───────────────────────────
router.get("/doctor", protect, doctorOnly, getDoctorAppointments);
router.put("/:id/status", protect, doctorOnly, updateAppointmentStatus);

export default router;
