import api from "./authApi";

export const getAdminDashboard = async () => {
  const { data } = await api.get("/admin/dashboard");
  return data;
};

export const getAllPatients = async () => {
  const { data } = await api.get("/patients");
  return data;
};

export const getPatientById = async (id) => {
  const { data } = await api.get(`/patients/${id}`);
  return data;
};

export const updatePatient = async ({ id, ...patientData }) => {
  const { data } = await api.put(`/patients/${id}`, patientData);
  return data;
};

export const getAllDoctors = async () => {
  const { data } = await api.get("/doctors");
  return data;
};

export const getDoctorById = async (id) => {
  const { data } = await api.get(`/doctors/${id}`);
  return data;
};

export const createDoctor = async (doctorData) => {
  const { data } = await api.post("/doctors", doctorData);
  return data;
};

export const updateDoctor = async ({ id, ...doctorData }) => {
  const { data } = await api.put(`/doctors/${id}`, doctorData);
  return data;
};

export const deactivateDoctor = async (id) => {
  const { data } = await api.patch(`/doctors/${id}/deactivate`);
  return data;
};

export const getAdminAppointments = async (params = {}) => {
  const { data } = await api.get("/appointments/admin", { params });
  return data;
};

export const updateAdminAppointment = async ({ id, status }) => {
  const { data } = await api.patch(`/appointments/${id}`, { status });
  return data;
};

export const reactivateDoctor = async (id) => {
  const { data } = await api.patch(`/doctors/${id}/reactivate`);
  return data;
};

export const deleteDoctor = async (id) => {
  const { data } = await api.delete(`/doctors/${id}`);
  return data;
};

export const deletePatient = async (id) => {
  const { data } = await api.delete(`/patients/${id}`);
  return data;
};
