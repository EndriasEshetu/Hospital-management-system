import Patient from "../models/Patient.js";
import User from "../models/User.js";

// @desc    Get all patients
// @route   GET /api/patients
// @access  Private (Admin)
export const getPatients = async (req, res) => {
  try {
    const patients = await Patient.find().populate(
      "userId",
      "name email role isActive",
    );
    res.json(patients);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get patient by ID
// @route   GET /api/patients/:id
// @access  Private
export const getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id).populate(
      "userId",
      "name email role isActive",
    );
    if (!patient) return res.status(404).json({ message: "Patient not found" });
    res.json(patient);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Update patient
// @route   PUT /api/patients/:id
// @access  Private
export const updatePatient = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) return res.status(404).json({ message: "Patient not found" });

    const { age, gender, bloodGroup, phone, address } = req.body;

    if (age !== undefined) patient.age = age;
    if (gender !== undefined) patient.gender = gender;
    if (bloodGroup !== undefined) patient.bloodGroup = bloodGroup;
    if (phone !== undefined) patient.phone = phone;
    if (address !== undefined) patient.address = address;

    await patient.save();
    await patient.populate("userId", "name email role isActive");

    res.json(patient);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get current patient profile
// @route   GET /api/patients/profile
// @access  Private (Patient)
export const getPatientProfile = async (req, res) => {
  try {
    const patient = await Patient.findOne({ userId: req.user._id }).populate(
      "userId",
      "name email role isActive"
    );
    if (!patient) {
      return res.status(404).json({ message: "Patient profile not found" });
    }
    res.json(patient);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Update current patient profile
// @route   PUT /api/patients/profile
// @access  Private (Patient)
export const updatePatientProfile = async (req, res) => {
  try {
    const patient = await Patient.findOne({ userId: req.user._id });
    if (!patient) {
      return res.status(404).json({ message: "Patient profile not found" });
    }

    const { age, gender, bloodGroup, phone, address } = req.body;

    if (age !== undefined) patient.age = age;
    if (gender !== undefined) patient.gender = gender;
    if (bloodGroup !== undefined) patient.bloodGroup = bloodGroup;
    if (phone !== undefined) patient.phone = phone;
    if (address !== undefined) patient.address = address;

    await patient.save();
    await patient.populate("userId", "name email role isActive");

    res.json(patient);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Delete patient
// @route   DELETE /api/patients/:id
// @access  Private / Admin
export const deletePatient = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) return res.status(404).json({ message: "Patient not found" });

    // Also delete user
    if (patient.userId) {
      await User.findByIdAndDelete(patient.userId);
    }
    await patient.deleteOne();

    res.json({ message: "Patient removed" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
