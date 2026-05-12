import Doctor from "../models/Doctor.js";
import User from "../models/User.js";

const populateDoctor = (doctor) =>
  doctor.populate("userId", "name email role isActive");

// @desc    Get all doctors
// @route   GET /api/doctors
// @access  Public or Private
export const getDoctors = async (req, res) => {
  try {
    const query =
      req.user?.role === "admin"
        ? {}
        : {
            $or: [
              { isActive: { $ne: false } },
              { isActive: { $exists: false } },
            ],
          };
    const doctors = await Doctor.find(query).populate(
      "userId",
      "name email role isActive",
    );
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get doctor by ID
// @route   GET /api/doctors/:id
// @access  Private / Admin
export const getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id).populate(
      "userId",
      "name email role isActive",
    );

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.json(doctor);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Create doctor (Admin)
// @route   POST /api/doctors
// @access  Private (Admin)
export const createDoctor = async (req, res) => {
  try {
    const {
      fullName,
      name,
      email,
      password,
      specialization,
      department,
      availableDays,
    } = req.body;

    const doctorName = fullName || name;

    if (!doctorName || !email || !password) {
      return res
        .status(400)
        .json({ message: "fullName, email and password are required" });
    }

    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "User already exists" });

    const user = await User.create({
      name: doctorName,
      email,
      password,
      role: "doctor",
      isActive: true,
    });

    const doctor = await Doctor.create({
      userId: user._id,
      specialization,
      department,
      availableDays,
      isActive: true,
    });

    res.status(201).json(await populateDoctor(doctor));
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Update doctor
// @route   PUT /api/doctors/:id
// @access  Private (Admin or Doctor)
export const updateDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    const user = await User.findById(doctor.userId);
    if (!user)
      return res.status(404).json({ message: "Linked user account not found" });

    const {
      fullName,
      name,
      email,
      specialization,
      department,
      availableDays,
      isActive,
    } = req.body;
    const doctorName = fullName || name;

    if (doctorName) {
      user.name = doctorName;
    }

    if (email) {
      const emailExists = await User.findOne({ email, _id: { $ne: user._id } });
      if (emailExists) {
        return res.status(400).json({ message: "Email already in use" });
      }
      user.email = email;
    }

    if (isActive !== undefined) {
      user.isActive = isActive;
      doctor.isActive = isActive;
    }

    if (specialization !== undefined) doctor.specialization = specialization;
    if (department !== undefined) doctor.department = department;
    if (availableDays !== undefined) doctor.availableDays = availableDays;

    await user.save();
    await doctor.save();
    const populatedDoctor = await populateDoctor(doctor);

    res.json(populatedDoctor);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Deactivate doctor
// @route   PATCH /api/doctors/:id/deactivate
// @access  Private (Admin)
export const deactivateDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    const user = await User.findById(doctor.userId);
    if (!user)
      return res.status(404).json({ message: "Linked user account not found" });

    doctor.isActive = false;
    user.isActive = false;

    await doctor.save();
    await user.save();

    res.json({ message: "Doctor deactivated" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
