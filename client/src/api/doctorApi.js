import api from "./authApi";

export const getDoctorAppointments = async () => {
  const { data } = await api.get("/appointments/doctor");
  return data;
};

export const updateAppointmentStatus = async ({ id, status }) => {
  const { data } = await api.put(`/appointments/${id}/status`, { status });
  return data;
};

export const createMedicalRecord = async (recordData) => {
  const { data } = await api.post("/medical-records", recordData);
  return data;
};

export const createPrescription = async (prescriptionData) => {
  const { data } = await api.post("/prescriptions", prescriptionData);
  return data;
};
