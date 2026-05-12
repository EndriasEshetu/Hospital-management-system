import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getDoctorAppointments,
  updateAppointmentStatus,
  createMedicalRecord,
  createPrescription,
} from "../api/doctorApi";

export const useDoctorAppointments = () => {
  return useQuery({
    queryKey: ["doctorAppointments"],
    queryFn: getDoctorAppointments,
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

export const useCreateMedicalRecord = () => {
  return useMutation({
    mutationFn: createMedicalRecord,
  });
};

export const useCreatePrescription = () => {
  return useMutation({
    mutationFn: createPrescription,
  });
};
