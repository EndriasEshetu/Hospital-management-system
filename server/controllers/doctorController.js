import Doctor from "../models/Doctor.js";
import User from "../models/User.js";

// @desc    Get all doctors
// @route   GET /api/doctors
// @access  Public or Private
export const getDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find().populate("userId", "name email");
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Create doctor (Admin)
// @route   POST /api/doctors
// @access  Private (Admin)
export const createDoctor = async (req, res) => {
  try {
    const { name, email, password, specialization, department, availableDays } = req.body;
    
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User already exists" });

    const user = await User.create({ name, email, password, role: "doctor" });
    
    const doctor = await Doctor.create({
      userId: user._id,
      specialization,
      department,
      availableDays
    });

    res.status(201).json(doctor);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Update doctor
// @route   PUT /api/doctors/:id
// @access  Private (Admin or Doctor)
export const updateDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });
    res.json(doctor);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Delete doctor
// @route   DELETE /api/doctors/:id
// @access  Private (Admin)
export const deleteDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });
    
    await User.findByIdAndDelete(doctor.userId);
    await doctor.deleteOne();

    res.json({ message: "Doctor removed" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
