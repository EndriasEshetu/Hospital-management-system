import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getMyAvailability,
  createAvailability,
  updateAvailability,
  getPublicAvailability,
} from "../api/dashboardApi";

// ─── Fetch all public availability slots ────────────────────────
export const usePublicAvailability = () => {
  return useQuery({
    queryKey: ["availability", "public"],
    queryFn: getPublicAvailability,
  });
};

// ─── Fetch all availability slots ───────────────────────────
export const useMyAvailability = () => {
  return useQuery({
    queryKey: ["availability"],
    queryFn: getMyAvailability,
  });
};

// ─── Create a new slot ──────────────────────────────────────
export const useCreateAvailability = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAvailability,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["availability"] });
    },
  });
};

// ─── Update an existing slot ────────────────────────────────
export const useUpdateAvailability = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateAvailability,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["availability"] });
    },
  });
};
