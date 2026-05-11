import { useState } from "react";
import { useDoctorAppointments, useUpdateAppointmentStatus } from "../hooks/useDoctor";
import StatusBadge from "../components/StatusBadge";
import AddRecordModal from "../components/AddRecordModal";
import IssuePrescriptionModal from "../components/IssuePrescriptionModal";

const DoctorAppointments = () => {
  const { data: appointments = [], isLoading, isError } = useDoctorAppointments();
  const updateStatusMutation = useUpdateAppointmentStatus();

  const [recordModalAppt, setRecordModalAppt] = useState(null);
  const [prescriptionModalAppt, setPrescriptionModalAppt] = useState(null);

  const handleStatusChange = (id, newStatus) => {
    updateStatusMutation.mutate({ id, status: newStatus });
  };

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

  if (isLoading) return <div className="text-center py-16 text-gray-400">Loading appointments...</div>;
  if (isError) return <div className="text-center py-16 text-red-400">Failed to load appointments.</div>;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white tracking-wide">Appointments</h1>
        <p className="text-sm text-gray-400 mt-1">Manage your schedule and patients</p>
      </div>

      <div className="space-y-4">
        {appointments.map((appt) => (
          <div key={appt._id} className="bg-[#1f2937] rounded-xl shadow-xl border border-gray-800 p-5 flex flex-col md:flex-row gap-4 hover:border-gray-700 transition-colors">
            
            {/* Info */}
            <div className="flex-1 space-y-1">
              <p className="text-sm font-semibold text-white">
                Patient: {appt.patientId?.name || "Unknown"}
              </p>
              <p className="text-xs text-gray-400">
                Email: {appt.patientId?.email}
              </p>
              <p className="text-sm text-emerald-400 mt-1">
                {formatDateTime(appt.appointmentDateTime)}
              </p>
              {appt.notes && (
                <p className="text-xs text-gray-500 italic mt-2 bg-[#111827] p-2 rounded-md">
                  "{appt.notes}"
                </p>
              )}
            </div>

            {/* Status and Actions */}
            <div className="flex flex-col gap-3 items-start md:items-end min-w-[200px]">
              <div className="flex items-center gap-2">
                <select
                  value={appt.status}
                  onChange={(e) => handleStatusChange(appt._id, e.target.value)}
                  disabled={updateStatusMutation.isPending}
                  className="bg-[#111827] border border-gray-700 text-gray-200 text-xs rounded-lg px-2 py-1 outline-none focus:border-emerald-500 transition-colors"
                >
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
                <StatusBadge status={appt.status} />
              </div>

              {appt.status === "Completed" && (
                <div className="flex gap-2 w-full mt-auto pt-2">
                  <button
                    onClick={() => setRecordModalAppt(appt)}
                    className="flex-1 px-3 py-1.5 text-xs font-medium rounded-md bg-blue-900/20 text-blue-400 hover:bg-blue-900/40 border border-blue-900/30 hover:border-blue-800 transition-colors"
                  >
                    + Record
                  </button>
                  <button
                    onClick={() => setPrescriptionModalAppt(appt)}
                    className="flex-1 px-3 py-1.5 text-xs font-medium rounded-md bg-emerald-900/20 text-emerald-400 hover:bg-emerald-900/40 border border-emerald-900/30 hover:border-emerald-800 transition-colors"
                  >
                    + Prescription
                  </button>
                </div>
              )}
            </div>

          </div>
        ))}

        {appointments.length === 0 && (
          <div className="text-center py-16 bg-[#1f2937] rounded-xl shadow-xl border border-gray-800">
            <p className="text-gray-300 text-lg">No appointments scheduled.</p>
          </div>
        )}
      </div>

      {recordModalAppt && (
        <AddRecordModal
          appointment={recordModalAppt}
          onClose={() => setRecordModalAppt(null)}
        />
      )}

      {prescriptionModalAppt && (
        <IssuePrescriptionModal
          appointment={prescriptionModalAppt}
          onClose={() => setPrescriptionModalAppt(null)}
        />
      )}
    </div>
  );
};

export default DoctorAppointments;
