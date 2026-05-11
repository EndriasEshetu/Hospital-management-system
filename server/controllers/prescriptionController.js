import Prescription from "../models/Prescription.js";
import Doctor from "../models/Doctor.js";
import Patient from "../models/Patient.js";

// @desc    Create a prescription
// @route   POST /api/prescriptions
// @access  Private (Doctor)
export const createPrescription = async (req, res) => {
  try {
    const { patientId, appointmentId, medicines } = req.body;
    
    const doctor = await Doctor.findOne({ userId: req.user._id });
    if (!doctor) return res.status(404).json({ message: "Doctor profile not found" });

    const prescription = await Prescription.create({
      patientId,
      doctorId: doctor._id,
      appointmentId,
      medicines
    });

    res.status(201).json(prescription);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get patient prescriptions
// @route   GET /api/prescriptions/:patientId
// @access  Private
export const getPatientPrescriptions = async (req, res) => {
  try {
    let patientObjId = req.params.patientId;
    
    if (patientObjId === 'me' && req.user.role === 'patient') {
      const patient = await Patient.findOne({ userId: req.user._id });
      if (!patient) return res.status(404).json({ message: "Patient profile not found" });
      patientObjId = patient._id.toString();
    } else if (req.user.role === 'patient') {
      const patient = await Patient.findOne({ userId: req.user._id });
      if (!patient || patient._id.toString() !== patientObjId) {
         return res.status(403).json({ message: "Not authorized to view these prescriptions" });
      }
    }

    const prescriptions = await Prescription.find({ patientId: patientObjId })
      .populate({ path: "doctorId", populate: { path: "userId", select: "name email" }})
      .populate("appointmentId");
      
    res.json(prescriptions);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
