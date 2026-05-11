import api from "./authApi";

// ─── Patient -> Doctor API ──────────────────────────────
export const getDoctors = async () => {
  const { data } = await api.get("/doctors");
  return data;
};

// ─── Patient Appointment API ───────────────────────────────
export const bookAppointment = async (appointmentData) => {
  const { data } = await api.post("/appointments", appointmentData);
  return data;
};

export const getMyAppointments = async () => {
  const { data } = await api.get("/appointments/me");
  return data;
};

export const rescheduleAppointment = async ({ id, appointmentDateTime }) => {
  const { data } = await api.put(`/appointments/${id}/reschedule`, {
    appointmentDateTime,
  });
  return data;
};

export const cancelAppointment = async (id) => {
  const { data } = await api.put(`/appointments/${id}/cancel`);
  return data;
};

// ─── Clinical API ───────────────────────────────
export const getMyRecords = async (patientId) => {
  const { data } = await api.get(`/medical-records/${patientId}`);
  return data;
};

export const getMyPrescriptions = async (patientId) => {
  const { data } = await api.get(`/prescriptions/${patientId}`);
  return data;
};
