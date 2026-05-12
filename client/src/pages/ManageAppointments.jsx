import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import StatusBadge from "../components/StatusBadge";
import {
  useAllDoctors,
  useAdminAppointments,
  useUpdateAdminAppointment,
} from "../hooks/useAdmin";

const statusOptions = ["Pending", "Confirmed", "Completed", "Cancelled"];

const ManageAppointments = () => {
  const { data: doctors = [] } = useAllDoctors();
  const [filters, setFilters] = useState({ status: "", date: "", doctor: "" });
  const [query, setQuery] = useState("");

  const apiFilters = useMemo(() => {
    const next = {};
    if (filters.status) next.status = filters.status;
    if (filters.date) next.date = filters.date;
    if (filters.doctor) next.doctor = filters.doctor;
    return next;
  }, [filters]);

  const {
    data: appointments = [],
    isLoading,
    isError,
  } = useAdminAppointments(apiFilters);
  const updateMutation = useUpdateAdminAppointment();

  const filteredAppointments = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return appointments;

    return appointments.filter((appointment) => {
      const patientName = appointment.patientId?.name || "";
      const patientEmail = appointment.patientId?.email || "";
      const doctorName = appointment.doctorId?.name || "";
      const doctorEmail = appointment.doctorId?.email || "";
      return [patientName, patientEmail, doctorName, doctorEmail].some(
        (value) => value.toLowerCase().includes(needle),
      );
    });
  }, [appointments, query]);

  const handleStatusUpdate = (id, status) => {
    updateMutation.mutate({ id, status });
  };

  const formatDateTime = (dateStr) =>
    new Date(dateStr).toLocaleString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });

  if (isLoading) {
    return (
      <div className="text-center py-20 text-gray-400">
        Loading appointments...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-20 text-red-400">
        Failed to load appointments.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-wide">
            Manage Appointments
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Filter appointments and update their status
          </p>
        </div>
        <div className="text-sm text-gray-400">
          {filteredAppointments.length} appointments
        </div>
      </div>

      <div className="bg-[#1f2937] border border-gray-800 rounded-2xl p-4 shadow-xl space-y-4">
        <div className="relative max-w-xl">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by patient or doctor"
            className="w-full bg-[#111827] border border-gray-700 rounded-xl pl-10 pr-4 py-3 text-sm text-gray-200 outline-none focus:border-emerald-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <label className="space-y-2">
            <span className="text-xs text-gray-400 uppercase tracking-wide">
              Status
            </span>
            <select
              value={filters.status}
              onChange={(e) =>
                setFilters({ ...filters, status: e.target.value })
              }
              className="w-full bg-[#111827] border border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-200 outline-none focus:border-emerald-500"
            >
              <option value="">All statuses</option>
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2">
            <span className="text-xs text-gray-400 uppercase tracking-wide">
              Date
            </span>
            <input
              type="date"
              value={filters.date}
              onChange={(e) => setFilters({ ...filters, date: e.target.value })}
              className="w-full bg-[#111827] border border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-200 outline-none focus:border-emerald-500"
            />
          </label>

          <label className="space-y-2">
            <span className="text-xs text-gray-400 uppercase tracking-wide">
              Doctor
            </span>
            <select
              value={filters.doctor}
              onChange={(e) =>
                setFilters({ ...filters, doctor: e.target.value })
              }
              className="w-full bg-[#111827] border border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-200 outline-none focus:border-emerald-500"
            >
              <option value="">All doctors</option>
              {doctors.map((doctor) => (
                <option key={doctor._id} value={doctor._id}>
                  {doctor.userId?.name || "Unknown Doctor"}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="bg-[#1f2937] rounded-2xl shadow-xl border border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="bg-[#111827] border-b border-gray-800">
                <th className="px-6 py-4 font-semibold text-gray-300">
                  Patient
                </th>
                <th className="px-6 py-4 font-semibold text-gray-300">
                  Doctor
                </th>
                <th className="px-6 py-4 font-semibold text-gray-300">
                  Appointment Date
                </th>
                <th className="px-6 py-4 font-semibold text-gray-300">
                  Status
                </th>
                <th className="px-6 py-4 text-right font-semibold text-gray-300">
                  Update
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {filteredAppointments.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    No appointments found.
                  </td>
                </tr>
              ) : (
                filteredAppointments.map((appointment) => (
                  <tr
                    key={appointment._id}
                    className="hover:bg-white/5 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <p className="font-medium text-white">
                        {appointment.patientId?.name || "Unknown"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {appointment.patientId?.email || "No email"}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-white">
                        Dr. {appointment.doctorId?.name || "Unknown"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {appointment.doctorId?.email || "No email"}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-gray-300">
                      {formatDateTime(appointment.appointmentDateTime)}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={appointment.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <select
                        value={appointment.status}
                        onChange={(e) =>
                          handleStatusUpdate(appointment._id, e.target.value)
                        }
                        disabled={updateMutation.isPending}
                        className="bg-[#111827] border border-gray-700 text-gray-200 text-xs rounded-lg px-3 py-2 outline-none focus:border-emerald-500"
                      >
                        {statusOptions.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageAppointments;
