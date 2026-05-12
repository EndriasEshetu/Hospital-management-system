import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    specialization: {
      type: String,
    },
    department: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    availableDays: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  },
);

const Doctor = mongoose.model("Doctor", doctorSchema);

export default Doctor;
