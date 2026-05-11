import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllPatients,
  deletePatient,
  getAllDoctors,
  deleteDoctor,
  getAllAppointments,
} from "../api/adminApi";

export const useAllPatients = () => {
  return useQuery({
    queryKey: ["allPatients"],
    queryFn: getAllPatients,
  });
};

export const useDeletePatient = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deletePatient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allPatients"] });
    },
  });
};

export const useAllDoctors = () => {
  return useQuery({
    queryKey: ["allDoctors"],
    queryFn: getAllDoctors,
  });
};

export const useDeleteDoctor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteDoctor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allDoctors"] });
    },
  });
};

export const useAllAppointments = () => {
  return useQuery({
    queryKey: ["allAppointments"],
    queryFn: getAllAppointments,
  });
};
