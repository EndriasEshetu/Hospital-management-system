import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getDoctorAppointments,
  updateAppointmentStatus,
  completeAppointment,
  fetchPatientDetails,
  createMedicalRecord,
  createPrescription,
} from "../api/doctorApi";

export const useDoctorAppointments = (filters) => {
  return useQuery({
    queryKey: ["doctorAppointments", filters],
    queryFn: () => getDoctorAppointments(filters),
  });
};

export const useUpdateAppointmentStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateAppointmentStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doctorAppointments"] });
      queryClient.invalidateQueries({ queryKey: ["adminDashboard"] });
      queryClient.invalidateQueries({ queryKey: ["adminAppointments"] });
      queryClient.invalidateQueries({ queryKey: ["myAppointments"] });
    },
  });
};

export const useCompleteAppointment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: completeAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doctorAppointments"] });
      queryClient.invalidateQueries({ queryKey: ["doctorDashboard"] });
    },
  });
};

export const usePatientDetails = (userId) => {
  return useQuery({
    queryKey: ["patientDetails", userId],
    queryFn: () => fetchPatientDetails(userId),
    enabled: !!userId,
  });
};

export const useCreateMedicalRecord = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createMedicalRecord,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myRecords"] });
    },
  });
};

export const useCreatePrescription = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createPrescription,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myPrescriptions"] });
    },
  });
};
