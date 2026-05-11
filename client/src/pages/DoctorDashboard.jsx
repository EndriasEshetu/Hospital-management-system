import { useDoctorAppointments, useUpdateAppointmentStatus } from "../hooks/useDoctor";
import StatusBadge from "../components/StatusBadge";
import { Users, CheckCircle, Clock } from "lucide-react";
import { Link } from "react-router-dom";

const DoctorDashboard = () => {
  const { data: appointments = [], isLoading, isError } = useDoctorAppointments();
  const updateStatusMutation = useUpdateAppointmentStatus();

  const handleStatusChange = (id, newStatus) => {
    updateStatusMutation.mutate({ id, status: newStatus });
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const todaysAppointments = appointments.filter((appt) => {
    const apptDate = new Date(appt.appointmentDateTime);
    return apptDate >= today && apptDate < tomorrow;
  });

  const pendingCount = appointments.filter(a => a.status === "Pending").length;
  const completedCount = appointments.filter(a => a.status === "Completed").length;

  if (isLoading) return <div className="text-center py-16 text-gray-400">Loading dashboard...</div>;
  if (isError) return <div className="text-center py-16 text-red-400">Failed to load dashboard.</div>;

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white tracking-wide">Doctor Dashboard</h1>
        <p className="text-sm text-gray-400 mt-1">Overview of your clinical schedule</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#1f2937] p-5 rounded-xl border border-gray-800 flex items-center gap-4 shadow-lg">
          <div className="p-3 bg-blue-500/10 rounded-lg">
            <Users className="text-blue-400" size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-400 font-medium">Today's Patients</p>
            <p className="text-2xl font-bold text-white">{todaysAppointments.length}</p>
          </div>
        </div>
        <div className="bg-[#1f2937] p-5 rounded-xl border border-gray-800 flex items-center gap-4 shadow-lg">
          <div className="p-3 bg-amber-500/10 rounded-lg">
            <Clock className="text-amber-400" size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-400 font-medium">Pending Requests</p>
            <p className="text-2xl font-bold text-white">{pendingCount}</p>
          </div>
        </div>
        <div className="bg-[#1f2937] p-5 rounded-xl border border-gray-800 flex items-center gap-4 shadow-lg">
          <div className="p-3 bg-emerald-500/10 rounded-lg">
            <CheckCircle className="text-emerald-400" size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-400 font-medium">Total Completed</p>
            <p className="text-2xl font-bold text-white">{completedCount}</p>
          </div>
        </div>
      </div>

      {/* Today's Appointments */}
      <div className="bg-[#1f2937] rounded-xl border border-gray-800 shadow-xl overflow-hidden">
        <div className="p-5 border-b border-gray-800 flex justify-between items-center bg-[#1a2332]">
          <h2 className="text-lg font-semibold text-white">Today's Appointments</h2>
          <Link to="/doctor/appointments" className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors">
            View All
          </Link>
        </div>
        <div className="p-5 space-y-4">
          {todaysAppointments.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-4">No appointments scheduled for today.</p>
          ) : (
            todaysAppointments.map(appt => (
              <div key={appt._id} className="flex flex-col sm:flex-row justify-between sm:items-center p-4 bg-[#111827] rounded-lg border border-gray-800 gap-4">
                <div>
                  <p className="font-medium text-gray-200">{appt.patientId?.name || "Unknown Patient"}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(appt.appointmentDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <select
                    value={appt.status}
                    onChange={(e) => handleStatusChange(appt._id, e.target.value)}
                    disabled={updateStatusMutation.isPending}
                    className="bg-[#1f2937] border border-gray-700 text-gray-200 text-xs rounded-lg px-2 py-1 outline-none focus:border-emerald-500 transition-colors"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                  <StatusBadge status={appt.status} />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
