import Appointment from "../models/Appointment.js";
import Doctor from "../models/Doctor.js";
import Patient from "../models/Patient.js";

const emptyStatusCounts = {
  Pending: 0,
  Confirmed: 0,
  Completed: 0,
  Cancelled: 0,
};

// @desc    Get admin dashboard metrics
// @route   GET /api/admin/dashboard
// @access  Private / Admin
export const getDashboardMetrics = async (req, res) => {
  try {
    const [
      totalPatients,
      activeDoctors,
      totalDoctors,
      appointmentStatusCounts,
      recentAppointments,
      recentDoctors,
    ] = await Promise.all([
      Patient.countDocuments({}),
      Doctor.countDocuments({
        $or: [{ isActive: { $ne: false } }, { isActive: { $exists: false } }],
      }),
      Doctor.countDocuments({}),
      Appointment.aggregate([
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ]),
      Appointment.find({})
        .sort({ appointmentDateTime: -1 })
        .limit(5)
        .populate("patientId", "name email")
        .populate("doctorId", "name email"),
      Doctor.find({})
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("userId", "name email isActive"),
    ]);

    const appointmentsByStatus = { ...emptyStatusCounts };
    appointmentStatusCounts.forEach((item) => {
      if (item?._id && appointmentsByStatus[item._id] !== undefined) {
        appointmentsByStatus[item._id] = item.count;
      }
    });

    res.json({
      totalPatients,
      totalDoctors,
      activeDoctors,
      appointmentsByStatus,
      recentAppointments,
      recentDoctors,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
