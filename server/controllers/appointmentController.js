import Appointment from "../models/Appointment.js";
import User from "../models/User.js";
import { sendReminderEmail } from "../services/emailService.js";

// @desc    Get all appointments for the logged-in doctor
// @route   GET /api/appointments/doctor
// @access  Private / Doctor
export const getDoctorAppointments = async (req, res) => {
  try {
    const { status, date } = req.query;
    const query = { doctorId: req.user._id };

    if (status) {
      query.status = status;
    } else {
      // Dashboard rule: Doctor views Confirmed and Completed appointments
      query.status = { $in: ["Confirmed", "Completed"] };
    }

    if (date) {
      const start = new Date(date);
      if (isNaN(start.getTime())) {
        return res.status(400).json({ message: "Invalid date filter" });
      }
      const end = new Date(start);
      end.setDate(end.getDate() + 1);
      query.appointmentDateTime = { $gte: start, $lt: end };
    }

    const appointments = await Appointment.find(query)
      .populate("patientId", "name email") // populate patient info
      .sort({ appointmentDateTime: 1 }); // upcoming first

    res.json(appointments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get all appointments (Admin)
// @route   GET /api/appointments
// @access  Private / Admin
export const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({})
      .populate("patientId", "name email")
      .populate("doctorId", "name email")
      .sort({ appointmentDateTime: -1 });

    res.json(appointments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get all appointments for admin views with optional filters
// @route   GET /api/appointments/admin
// @access  Private / Admin
export const getAdminAppointments = async (req, res) => {
  try {
    const { date, status, doctor } = req.query;
    const query = {};

    if (status) {
      query.status = status;
    }

    if (doctor) {
      query.doctorId = doctor;
    }

    if (date) {
      const start = new Date(date);
      if (Number.isNaN(start.getTime())) {
        return res.status(400).json({ message: "Invalid date filter" });
      }

      const end = new Date(start);
      end.setDate(end.getDate() + 1);
      query.appointmentDateTime = { $gte: start, $lt: end };
    }

    const appointments = await Appointment.find(query)
      .populate("patientId", "name email")
      .populate("doctorId", "name email")
      .sort({ appointmentDateTime: -1 });

    res.json(appointments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Update appointment status (Admin)
// @route   PATCH /api/appointments/:id
// @access  Private / Admin
export const updateAppointmentByAdmin = async (req, res) => {
  try {
    const { status } = req.body;
    const allowedStatuses = ["Confirmed", "Cancelled"];

    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: `Admin can only set status to: ${allowedStatuses.join(", ")}`,
      });
    }

    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    appointment.status = status;
    await appointment.save();
    await appointment.populate("patientId", "name email");
    await appointment.populate("doctorId", "name email");

    res.json(appointment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Update the status of an appointment
// @route   PUT /api/appointments/:id/status
// @access  Private / Doctor
export const updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowedStatuses = ["Pending", "Confirmed", "Completed", "Cancelled"];

    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: `Invalid status. Allowed values: ${allowedStatuses.join(", ")}`,
      });
    }

    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Make sure this appointment belongs to the logged-in doctor
    if (appointment.doctorId.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this appointment" });
    }

    appointment.status = status;
    const updated = await appointment.save();

    await updated.populate("patientId", "name email");

    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Mark appointment completed
// @route   PATCH /api/appointments/:id/complete
// @access  Private / Doctor
export const completeAppointmentPatch = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Rule: doctor only, assigned doctor only
    if (appointment.doctorId.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to complete this appointment" });
    }

    // Rule: only Confirmed appointments can become Completed
    if (appointment.status !== "Confirmed") {
      return res.status(400).json({
        message: `Cannot complete a ${appointment.status} appointment. It must be Confirmed first.`,
      });
    }

    appointment.status = "Completed";
    const updated = await appointment.save();

    await updated.populate("patientId", "name email");
    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ════════════════════════════════════════════════════════════
//  PATIENT CONTROLLERS
// ════════════════════════════════════════════════════════════

// @desc    Create a new appointment (patient books a slot)
// @route   POST /api/appointments
// @access  Private (Patient)
export const createAppointment = async (req, res) => {
  try {
    const { doctorId, appointmentDateTime, notes } = req.body;

    if (!doctorId || !appointmentDateTime) {
      return res
        .status(400)
        .json({ message: "doctorId and appointmentDateTime are required" });
    }

    const parsedDateTime = new Date(appointmentDateTime);
    if (isNaN(parsedDateTime.getTime())) {
      return res.status(400).json({ message: "Invalid appointmentDateTime" });
    }

    // Validation: only future dates
    if (parsedDateTime <= new Date()) {
      return res.status(400).json({ message: "Appointment must be in the future" });
    }

    // Validation: doctor must exist and be a doctor
    const doctor = await User.findOne({ _id: doctorId, role: "doctor" });
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const conflict = await Appointment.findOne({
      doctorId,
      appointmentDateTime: parsedDateTime,
      status: { $ne: "Cancelled" },
    });

    if (conflict) {
      return res
        .status(409)
        .json({ message: "This time slot is already booked" });
    }

    const appointment = await Appointment.create({
      patientId: req.user._id,
      doctorId,
      appointmentDateTime: parsedDateTime,
      status: "Pending",
      notes: notes || "",
    });

    await appointment.populate("doctorId", "name email");

    res.status(201).json(appointment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get all appointments for logged-in patient
// @route   GET /api/appointments/me
// @access  Private (Patient)
export const getMyAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({
      patientId: req.user._id,
    })
      .populate("doctorId", "name email")
      .sort({ appointmentDateTime: 1 });

    res.json(appointments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Cancel an appointment
// @route   PATCH /api/appointments/:id/cancel
// @access  Private (Patient, owner only)
export const cancelAppointmentPatch = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Rule: only patient can cancel own appointment
    if (appointment.patientId.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to cancel this appointment" });
    }

    // Rule: cannot cancel completed appointment
    if (appointment.status === "Completed") {
      return res
        .status(400)
        .json({ message: "Cannot cancel a completed appointment" });
    }

    if (appointment.status === "Cancelled") {
      return res
        .status(400)
        .json({ message: "Appointment is already cancelled" });
    }

    appointment.status = "Cancelled";
    const updated = await appointment.save();

    await updated.populate("doctorId", "name email");
    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Reschedule an appointment
// @route   PATCH /api/appointments/:id/reschedule
// @access  Private (Patient, owner only)
export const rescheduleAppointmentPatch = async (req, res) => {
  try {
    const { appointmentDateTime } = req.body;

    if (!appointmentDateTime) {
      return res
        .status(400)
        .json({ message: "New appointmentDateTime is required" });
    }

    const parsedDateTime = new Date(appointmentDateTime);
    if (isNaN(parsedDateTime.getTime())) {
      return res.status(400).json({ message: "Invalid appointmentDateTime" });
    }

    // Rule: new date must be future date
    if (parsedDateTime <= new Date()) {
      return res.status(400).json({ message: "New appointment must be in the future" });
    }

    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Rule: only owner patient
    if (appointment.patientId.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to reschedule this appointment" });
    }

    // Rule: only confirmed or pending appointments
    if (!["Confirmed", "Pending"].includes(appointment.status)) {
      return res
        .status(400)
        .json({ message: `Cannot reschedule a ${appointment.status} appointment` });
    }

    const conflict = await Appointment.findOne({
      doctorId: appointment.doctorId,
      appointmentDateTime: parsedDateTime,
      status: { $ne: "Cancelled" },
      _id: { $ne: appointment._id },
    });

    if (conflict) {
      return res
        .status(409)
        .json({ message: "The new time slot is already booked" });
    }

    appointment.appointmentDateTime = parsedDateTime;
    appointment.status = "Pending";
    appointment.reminderSent = false;
    const updated = await appointment.save();

    await updated.populate("doctorId", "name email");
    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Keep existing ones for compatibility if needed, but the user requested PATCH routes specifically.
// I'll name the new ones specifically and update the routes.

// @desc    Reschedule an appointment (change date/time)
// @route   PUT /api/appointments/:id/reschedule
// @access  Private (Patient, owner only)
export const rescheduleAppointment = async (req, res) => {
  // ... (keeping for now)
  return rescheduleAppointmentPatch(req, res);
};

// @desc    Cancel an appointment
// @route   PUT /api/appointments/:id/cancel
// @access  Private (Patient, owner only)
export const cancelAppointment = async (req, res) => {
  // ... (keeping for now)
  return cancelAppointmentPatch(req, res);
};
