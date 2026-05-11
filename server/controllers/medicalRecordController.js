import MedicalRecord from "../models/MedicalRecord.js";
import Doctor from "../models/Doctor.js";
import Patient from "../models/Patient.js";

// @desc    Create a medical record
// @route   POST /api/medical-records
// @access  Private (Doctor)
export const createMedicalRecord = async (req, res) => {
  try {
    const { patientId, appointmentId, symptoms, diagnosis, notes } = req.body;
    
    const doctor = await Doctor.findOne({ userId: req.user._id });
    if (!doctor) return res.status(404).json({ message: "Doctor profile not found" });

    const record = await MedicalRecord.create({
      patientId,
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
