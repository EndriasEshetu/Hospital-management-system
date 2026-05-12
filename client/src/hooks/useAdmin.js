import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAdminDashboard,
  getAllPatients,
  getPatientById,
  updatePatient,
  getAllDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deactivateDoctor,
  getAdminAppointments,
  updateAdminAppointment,
} from "../api/adminApi";

export const useAdminDashboard = () => {
  return useQuery({
    queryKey: ["adminDashboard"],
    queryFn: getAdminDashboard,
  });
};

export const useAllPatients = () => {
  return useQuery({
    queryKey: ["adminPatients"],
    queryFn: getAllPatients,
  });
};

export const useAdminPatient = (id) => {
  return useQuery({
    queryKey: ["adminPatient", id],
    queryFn: () => getPatientById(id),
    enabled: Boolean(id),
  });
};

export const useUpdatePatient = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updatePatient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminPatients"] });
      queryClient.invalidateQueries({ queryKey: ["adminDashboard"] });
    },
  });
};

export const useAllDoctors = () => {
  return useQuery({
    queryKey: ["adminDoctors"],
    queryFn: getAllDoctors,
  });
};

export const useDoctorDetails = (id) => {
  return useQuery({
    queryKey: ["adminDoctor", id],
    queryFn: () => getDoctorById(id),
    enabled: Boolean(id),
  });
};

export const useCreateDoctor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createDoctor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminDoctors"] });
      queryClient.invalidateQueries({ queryKey: ["adminDashboard"] });
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
    },
  });
};

export const useUpdateDoctor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateDoctor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminDoctors"] });
      queryClient.invalidateQueries({ queryKey: ["adminDashboard"] });
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
    },
  });
};

export const useDeactivateDoctor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deactivateDoctor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminDoctors"] });
      queryClient.invalidateQueries({ queryKey: ["adminDashboard"] });
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
    },
  });
};

export const useAdminAppointments = (params = {}) => {
  return useQuery({
    queryKey: ["adminAppointments", params],
    queryFn: () => getAdminAppointments(params),
  });
};

export const useUpdateAdminAppointment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateAdminAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminAppointments"] });
      queryClient.invalidateQueries({ queryKey: ["adminDashboard"] });
      queryClient.invalidateQueries({ queryKey: ["doctorAppointments"] });
      queryClient.invalidateQueries({ queryKey: ["myAppointments"] });
    },
  });
};
