import cron from "node-cron";
import Appointment from "../models/Appointment.js";
import { sendReminderEmail } from "../services/emailService.js";

export const initCronJobs = () => {
  // Run every 30 minutes
  cron.schedule("*/30 * * * *", async () => {
    console.log("[Cron] Running reminder job...");
    try {
      const now = new Date();
      // Look for appointments in the next 24 hours
      const next24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      
      const appointments = await Appointment.find({
        status: "Confirmed",
        reminderSent: false,
        appointmentDateTime: { $gt: now, $lte: next24Hours }
      }).populate("patientId", "name email").populate("doctorId", "name email");

      if (appointments.length > 0) {
        console.log(`[Cron] Found ${appointments.length} appointments to remind.`);
      }

      for (const appt of appointments) {
        if (!appt.patientId?.email) continue;

        try {
          // Send email
          await sendReminderEmail({
            to: appt.patientId.email,
            patientName: appt.patientId.name,
            doctorName: appt.doctorId?.name || "your doctor",
            date: new Date(appt.appointmentDateTime).toLocaleDateString("en-US", { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }),
            time: new Date(appt.appointmentDateTime).toLocaleTimeString("en-US", { hour: 'numeric', minute: '2-digit' }),
          });

          // Mark as sent
          appt.reminderSent = true;
          await appt.save();
        } catch (err) {
          console.error(`[Cron] Failed to send reminder for appointment ${appt._id}`, err);
        }
      }
    } catch (err) {
      console.error("[Cron] Error in reminder cron job:", err);
    }
  });
  
  console.log("Cron jobs initialized.");
};
