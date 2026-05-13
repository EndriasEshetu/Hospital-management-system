import api from "./authApi";

export const getDoctorAppointments = async (params) => {
  const { data } = await api.get("/appointments/doctor", { params });
  return data;
};

export const updateAppointmentStatus = async ({ id, status }) => {
  const { data } = await api.put(`/appointments/${id}/status`, { status });
  return data;
};

export const completeAppointment = async (id) => {
  const { data } = await api.patch(`/appointments/${id}/complete`);
  return data;
};

export const fetchPatientDetails = async (userId) => {
  const { data } = await api.get(`/patients/profile/${userId}`);
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
