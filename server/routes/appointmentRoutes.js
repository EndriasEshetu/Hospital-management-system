import express from "express";
import {
  getDoctorAppointments,
  updateAppointmentStatus,
  createAppointment,
  getMyAppointments,
  rescheduleAppointmentPatch,
  cancelAppointmentPatch,
  getAllAppointments,
  getAdminAppointments,
  updateAppointmentByAdmin,
} from "../controllers/appointmentController.js";
import {
  protect,
  doctorOnly,
  patientOnly,
  adminOnly,
} from "../middleware/authMiddleware.js";

const router = express.Router();

// ── Admin routes ─────────────────────────────────
router.get("/", protect, adminOnly, getAllAppointments);
router.get("/admin", protect, adminOnly, getAdminAppointments);
router.patch("/:id", protect, adminOnly, updateAppointmentByAdmin);

// ── Patient routes ─────────────────────────────────
router.post("/", protect, patientOnly, createAppointment);
router.get("/me", protect, patientOnly, getMyAppointments);
router.patch("/:id/reschedule", protect, patientOnly, rescheduleAppointmentPatch);
router.patch("/:id/cancel", protect, patientOnly, cancelAppointmentPatch);

// ── Doctor routes ───────────────────────────
router.get("/doctor", protect, doctorOnly, getDoctorAppointments);
router.put("/:id/status", protect, doctorOnly, updateAppointmentStatus);

export default router;
