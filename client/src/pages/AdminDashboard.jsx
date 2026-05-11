import { useAllPatients, useAllDoctors, useAllAppointments } from "../hooks/useAdmin";
import { Users, UserSquare2, CalendarDays } from "lucide-react";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const { data: patients = [], isLoading: pLoading } = useAllPatients();
  const { data: doctors = [], isLoading: dLoading } = useAllDoctors();
  const { data: appointments = [], isLoading: aLoading } = useAllAppointments();

  const isLoading = pLoading || dLoading || aLoading;

  if (isLoading) {
    return <div className="text-center py-20 text-gray-400">Loading analytics...</div>;
  }

  const pendingAppointments = appointments.filter(a => a.status === "Pending").length;

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white tracking-wide">Platform Analytics</h1>
        <p className="text-sm text-gray-400 mt-1">Overview of your hospital management system</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#1f2937] p-6 rounded-xl border border-gray-800 flex items-center justify-between shadow-xl">
          <div>
            <p className="text-sm text-gray-400 font-medium mb-1">Total Patients</p>
            <p className="text-3xl font-bold text-white">{patients.length}</p>
            <Link to="/admin/patients" className="text-xs text-blue-400 hover:underline mt-2 inline-block">Manage Patients &rarr;</Link>
          </div>
          <div className="p-4 bg-blue-500/10 rounded-xl border border-blue-500/20">
            <Users className="text-blue-500" size={32} />
          </div>
        </div>

        <div className="bg-[#1f2937] p-6 rounded-xl border border-gray-800 flex items-center justify-between shadow-xl">
          <div>
            <p className="text-sm text-gray-400 font-medium mb-1">Total Doctors</p>
            <p className="text-3xl font-bold text-white">{doctors.length}</p>
            <Link to="/admin/doctors" className="text-xs text-emerald-400 hover:underline mt-2 inline-block">Manage Doctors &rarr;</Link>
          </div>
          <div className="p-4 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
            <UserSquare2 className="text-emerald-500" size={32} />
          </div>
        </div>

        <div className="bg-[#1f2937] p-6 rounded-xl border border-gray-800 flex items-center justify-between shadow-xl">
          <div>
            <p className="text-sm text-gray-400 font-medium mb-1">Total Appointments</p>
            <p className="text-3xl font-bold text-white">{appointments.length}</p>
            <Link to="/admin/appointments" className="text-xs text-purple-400 hover:underline mt-2 inline-block">View Schedule &rarr;</Link>
          </div>
          <div className="p-4 bg-purple-500/10 rounded-xl border border-purple-500/20">
            <CalendarDays className="text-purple-500" size={32} />
          </div>
        </div>
      </div>

      <div className="bg-[#1f2937] rounded-xl border border-gray-800 shadow-xl p-6 mt-8">
        <h2 className="text-lg font-semibold text-white mb-4">Quick Stats</h2>
        <div className="flex flex-wrap gap-4">
          <div className="bg-[#111827] px-4 py-3 rounded-lg border border-gray-800 flex-1 min-w-[200px]">
            <p className="text-xs text-gray-500 font-medium">Pending Appointments</p>
            <p className="text-xl font-bold text-amber-500 mt-1">{pendingAppointments}</p>
          </div>
          <div className="bg-[#111827] px-4 py-3 rounded-lg border border-gray-800 flex-1 min-w-[200px]">
            <p className="text-xs text-gray-500 font-medium">Completed Appointments</p>
            <p className="text-xl font-bold text-emerald-500 mt-1">
              {appointments.filter(a => a.status === "Completed").length}
            </p>
          </div>
          <div className="bg-[#111827] px-4 py-3 rounded-lg border border-gray-800 flex-1 min-w-[200px]">
            <p className="text-xs text-gray-500 font-medium">Cancelled Appointments</p>
            <p className="text-xl font-bold text-red-500 mt-1">
              {appointments.filter(a => a.status === "Cancelled").length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
