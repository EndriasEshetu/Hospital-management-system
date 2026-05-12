import { Link } from "react-router-dom";
import { CalendarDays, Stethoscope, Users, Clock3, CheckCircle2, XCircle, CircleDot } from "lucide-react";
import { useAdminDashboard } from "../hooks/useAdmin";

const statusMeta = {
  Pending: { label: "Pending", color: "text-amber-400", icon: CircleDot },
  Confirmed: { label: "Confirmed", color: "text-sky-400", icon: Clock3 },
  Completed: { label: "Completed", color: "text-emerald-400", icon: CheckCircle2 },
  Cancelled: { label: "Cancelled", color: "text-red-400", icon: XCircle },
};

const cardThemes = {
  blue: { bg: "bg-blue-500/10", border: "border-blue-500/20", text: "text-blue-400" },
  emerald: { bg: "bg-emerald-500/10", border: "border-emerald-500/20", text: "text-emerald-400" },
  violet: { bg: "bg-violet-500/10", border: "border-violet-500/20", text: "text-violet-400" },
};

const AdminDashboard = () => {
  const { data, isLoading, isError } = useAdminDashboard();

  if (isLoading) {
    return <div className="text-center py-20 text-gray-400">Loading analytics...</div>;
  }

  if (isError) {
    return <div className="text-center py-20 text-red-400">Failed to load dashboard metrics.</div>;
  }

  const appointmentsByStatus = data?.appointmentsByStatus || {};
  const totalAppointments = Object.values(appointmentsByStatus).reduce((sum, value) => sum + value, 0);

  const cards = [
    {
      label: "Total Patients",
      value: data?.totalPatients || 0,
      helper: "Registered patient accounts",
      icon: Users,
      accent: "blue",
      href: "/admin/patients",
    },
    {
      label: "Total Active Doctors",
      value: data?.activeDoctors || 0,
      helper: `${data?.totalDoctors || 0} doctor records`,
      icon: Stethoscope,
      accent: "emerald",
      href: "/admin/doctors",
    },
    {
      label: "Total Appointments",
      value: totalAppointments,
      helper: "Across all appointment states",
      icon: CalendarDays,
      accent: "violet",
      href: "/admin/appointments",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-white tracking-wide">Admin Dashboard</h1>
        <p className="text-sm text-gray-400">Live hospital activity at a glance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {cards.map((card) => {
          const Icon = card.icon;
          const theme = cardThemes[card.accent];
          return (
            <Link
              key={card.label}
              to={card.href}
              className="bg-[#1f2937] border border-gray-800 rounded-2xl p-6 shadow-xl hover:border-gray-700 transition-colors flex items-center justify-between gap-4"
            >
              <div>
                <p className="text-sm text-gray-400 mb-1">{card.label}</p>
                <p className="text-3xl font-bold text-white">{card.value}</p>
                <p className="text-xs text-gray-500 mt-2">{card.helper}</p>
              </div>
              <div className={`p-4 rounded-2xl border ${theme.bg} ${theme.border}`}>
                <Icon className={theme.text} size={30} />
              </div>
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#1f2937] border border-gray-800 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-lg font-semibold text-white">Appointment Status</h2>
              <p className="text-sm text-gray-400">Current workflow distribution</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(statusMeta).map(([status, meta]) => {
              const Icon = meta.icon;
              return (
                <div key={status} className="bg-[#111827] rounded-xl border border-gray-800 p-4 flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-white/5 ${meta.color}`}>
                    <Icon size={18} />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-gray-500">{meta.label}</p>
                    <p className={`text-xl font-bold ${meta.color}`}>{appointmentsByStatus[status] || 0}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-[#1f2937] border border-gray-800 rounded-2xl p-6 shadow-xl">
          <h2 className="text-lg font-semibold text-white mb-5">Recent Doctor Registrations</h2>
          <div className="space-y-3">
            {(data?.recentDoctors || []).length === 0 ? (
              <p className="text-sm text-gray-500 py-6 text-center">No doctors found.</p>
            ) : (
              data.recentDoctors.map((doctor) => (
                <div key={doctor._id} className="bg-[#111827] rounded-xl border border-gray-800 p-4 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-white font-medium">{doctor.userId?.name || "Unknown Doctor"}</p>
                    <p className="text-xs text-gray-500">{doctor.userId?.email || "No email"}</p>
                    <p className="text-xs text-gray-400 mt-1">{doctor.specialization || "No specialization"}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full border ${doctor.isActive ? "text-emerald-400 border-emerald-500/20 bg-emerald-500/10" : "text-red-400 border-red-500/20 bg-red-500/10"}`}>
                    {doctor.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="bg-[#1f2937] border border-gray-800 rounded-2xl p-6 shadow-xl">
        <h2 className="text-lg font-semibold text-white mb-5">Recent Appointments</h2>
        <div className="space-y-3">
          {(data?.recentAppointments || []).length === 0 ? (
            <p className="text-sm text-gray-500 py-6 text-center">No appointments found.</p>
          ) : (
            data.recentAppointments.map((appointment) => (
              <div key={appointment._id} className="bg-[#111827] rounded-xl border border-gray-800 p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <p className="text-white font-medium">{appointment.patientId?.name || "Unknown Patient"}</p>
                  <p className="text-xs text-gray-500">Dr. {appointment.doctorId?.name || "Unknown Doctor"}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(appointment.appointmentDateTime).toLocaleString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <span className="text-xs font-medium px-3 py-1 rounded-full border border-gray-700 text-gray-200 w-fit">
                  {appointment.status}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
