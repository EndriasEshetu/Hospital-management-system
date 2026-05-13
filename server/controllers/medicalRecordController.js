import MedicalRecord from "../models/MedicalRecord.js";
import Doctor from "../models/Doctor.js";
import Patient from "../models/Patient.js";
import Appointment from "../models/Appointment.js";

// @desc    Create a medical record
// @route   POST /api/medical-records
// @access  Private (Doctor)
export const createMedicalRecord = async (req, res) => {
  try {
    const { patientId, appointmentId, symptoms, diagnosis, notes } = req.body;
    
    const doctor = await Doctor.findOne({ userId: req.user._id });
    if (!doctor) return res.status(404).json({ message: "Doctor profile not found" });

    // Rules: only doctor can create, doctor must own appointment
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) return res.status(404).json({ message: "Appointment not found" });

    if (appointment.doctorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to create a record for this appointment" });
    }

    // patientId coming from frontend (Appointment) is actually User._id. Resolve it to Patient._id.
    let resolvedPatientId = patientId;
    const patientProfile = await Patient.findOne({ userId: patientId });
    if (patientProfile) {
      resolvedPatientId = patientProfile._id;
    } else {
      // Check if it's already a valid patient ID
      const existingPatient = await Patient.findById(patientId);
      if (!existingPatient) return res.status(404).json({ message: "Patient profile not found for this user" });
    }

    const record = await MedicalRecord.create({
      patientId: resolvedPatientId,
      doctorId: doctor._id,
      appointmentId,
      symptoms,
      diagnosis,
      notes
    });

    res.status(201).json(record);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get patient medical records
// @route   GET /api/medical-records/:patientId
// @access  Private
export const getPatientMedicalRecords = async (req, res) => {
  try {
    let patientObjId = req.params.patientId;
    
    if (patientObjId === 'me' && req.user.role === 'patient') {
      const patient = await Patient.findOne({ userId: req.user._id });
      if (!patient) return res.status(404).json({ message: "Patient profile not found" });
      patientObjId = patient._id.toString();
    } else if (req.user.role === 'patient') {
      const patient = await Patient.findOne({ userId: req.user._id });
      if (!patient || patient._id.toString() !== patientObjId) {
         return res.status(403).json({ message: "Not authorized to view these records" });
      }
    }

    const records = await MedicalRecord.find({ patientId: patientObjId })
      .populate({ path: "doctorId", populate: { path: "userId", select: "name email" }})
      .populate("appointmentId");
      
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get all medical records created by the doctor
// @route   GET /api/medical-records/doctor
// @access  Private (Doctor)
export const getDoctorMedicalRecords = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.user._id });
    if (!doctor) return res.status(404).json({ message: "Doctor profile not found" });

    const records = await MedicalRecord.find({ doctorId: doctor._id })
      .populate({ path: "patientId", populate: { path: "userId", select: "name email" } })
      .populate("appointmentId")
      .sort({ createdAt: -1 });

    res.json(records);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
