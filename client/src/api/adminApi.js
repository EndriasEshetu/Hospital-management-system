import api from "./authApi";

export const getAllPatients = async () => {
  const { data } = await api.get("/patients");
  return data;
};

export const deletePatient = async (id) => {
  const { data } = await api.delete(`/patients/${id}`);
  return data;
};

export const getAllDoctors = async () => {
  const { data } = await api.get("/doctors");
  return data;
};

export const deleteDoctor = async (id) => {
  const { data } = await api.delete(`/doctors/${id}`);
  return data;
};

export const getAllAppointments = async () => {
  const { data } = await api.get("/appointments");
  return data;
};
