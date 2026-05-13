import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getDoctors,
  bookAppointment,
  getMyAppointments,
  rescheduleAppointment,
  cancelAppointment,
  getMyRecords,
  getMyPrescriptions,
  getPatientProfile,
  updatePatientProfile,
} from "../api/patientApi";

export const useDoctors = () => {
  return useQuery({
    queryKey: ["doctors"],
    queryFn: getDoctors,
  });
};

export const useBookAppointment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: bookAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myAppointments"] });
      queryClient.invalidateQueries({ queryKey: ["adminDashboard"] });
      queryClient.invalidateQueries({ queryKey: ["adminAppointments"] });
    },
  });
};

export const useMyAppointments = () => {
  return useQuery({
    queryKey: ["myAppointments"],
    queryFn: getMyAppointments,
  });
};

export const useRescheduleAppointment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: rescheduleAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myAppointments"] });
      queryClient.invalidateQueries({ queryKey: ["adminDashboard"] });
      queryClient.invalidateQueries({ queryKey: ["adminAppointments"] });
    },
  });
};

export const useCancelAppointment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: cancelAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myAppointments"] });
      queryClient.invalidateQueries({ queryKey: ["adminDashboard"] });
      queryClient.invalidateQueries({ queryKey: ["adminAppointments"] });
    },
  });
};

export const useMyRecords = () => {
  return useQuery({
    queryKey: ["myRecords"],
    queryFn: () => getMyRecords("me"),
  });
};

export const useMyPrescriptions = () => {
  return useQuery({
    queryKey: ["myPrescriptions"],
    queryFn: () => getMyPrescriptions("me"),
  });
};

export const usePatientProfile = () => {
  return useQuery({
    queryKey: ["patientProfile"],
    queryFn: getPatientProfile,
  });
};

export const useUpdatePatientProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updatePatientProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patientProfile"] });
    },
  });
};
