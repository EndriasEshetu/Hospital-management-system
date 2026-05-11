import { Navigate, Outlet } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";

export const AdminRoute = () => {
  const { user } = useAuthStore();
  return user && user.role === "admin" ? <Outlet /> : <Navigate to="/login" replace />;
};

export const DoctorRoute = () => {
  const { user } = useAuthStore();
  return user && user.role === "doctor" ? <Outlet /> : <Navigate to="/login" replace />;
};

export const PatientRoute = () => {
  const { user } = useAuthStore();
  return user && user.role === "patient" ? <Outlet /> : <Navigate to="/login" replace />;
};
