import { useState } from "react";
import { useAllAppointments } from "../hooks/useAdmin";
import StatusBadge from "../components/StatusBadge";

const AdminAppointments = () => {
  const { data: appointments = [], isLoading, isError } = useAllAppointments();
  
  const [filterStatus, setFilterStatus] = useState("all");

  const filtered = appointments.filter((appt) => {
    return filterStatus === "all" || appt.status === filterStatus;
  });

  const formatDateTime = (dateStr) => {
    return new Date(dateStr).toLocaleString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  if (isLoading) return <div className="text-center py-20 text-gray-400">Loading appointments...</div>;
  if (isError) return <div className="text-center py-20 text-red-400">Failed to load appointments.</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-wide">All Appointments</h1>
          <p className="text-sm text-gray-400 mt-1">Platform-wide appointment schedule</p>
        </div>
        <div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-[#1f2937] border border-gray-700 text-gray-200 text-sm rounded-lg px-4 py-2 outline-none focus:border-purple-500 transition-colors"
          >
            <option value="all">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="bg-[#1f2937] rounded-xl shadow-xl border border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="bg-[#111827] border-b border-gray-800">
                <th className="px-6 py-4 font-semibold text-gray-300">Date & Time</th>
                <th className="px-6 py-4 font-semibold text-gray-300">Patient</th>
                <th className="px-6 py-4 font-semibold text-gray-300">Doctor</th>
                <th className="px-6 py-4 font-semibold text-gray-300 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                    No appointments found.
                  </td>
                </tr>
              ) : (
                filtered.map((appt) => (
                  <tr key={appt._id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 text-purple-400 font-medium">
                      {formatDateTime(appt.appointmentDateTime)}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-white">{appt.patientId?.name || "Unknown"}</p>
                      <p className="text-xs text-gray-500">{appt.patientId?.email}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-white">Dr. {appt.doctorId?.name || "Unknown"}</p>
                      <p className="text-xs text-gray-500">{appt.doctorId?.email}</p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <StatusBadge status={appt.status} />
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

export default AdminAppointments;
