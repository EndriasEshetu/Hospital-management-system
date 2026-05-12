import Appointment from "../models/Appointment.js";
import User from "../models/User.js";
import { sendReminderEmail } from "../services/emailService.js";

// @desc    Get all appointments for the logged-in doctor
// @route   GET /api/appointments/doctor
// @access  Private / Doctor
export const getDoctorAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({
      doctorId: req.user._id,
    })
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

// @desc    Reschedule an appointment (change date/time)
// @route   PUT /api/appointments/:id/reschedule
// @access  Private (Patient, owner only)
export const rescheduleAppointment = async (req, res) => {
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

    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    if (appointment.patientId.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to reschedule this appointment" });
    }

    if (appointment.status === "Cancelled") {
      return res
        .status(400)
        .json({ message: "Cannot reschedule a cancelled appointment" });
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

// @desc    Cancel an appointment
// @route   PUT /api/appointments/:id/cancel
// @access  Private (Patient, owner only)
export const cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    if (appointment.patientId.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to cancel this appointment" });
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
