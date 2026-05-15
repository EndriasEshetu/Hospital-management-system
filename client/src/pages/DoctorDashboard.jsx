import { useDoctorAppointments } from "../hooks/useDoctor";
import StatusBadge from "../components/StatusBadge";
import { Users, CheckCircle, Clock, CalendarDays, UserCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { useMemo } from "react";

const DoctorDashboard = () => {
  const { data: appointments = [], isLoading, isError } = useDoctorAppointments();

  const {
    todaysAppointments,
    confirmedCount,
    completedCount,
    uniquePatientsCount,
    upcomingConsultations
  } = useMemo(() => {
    const now = new Date();
    const todayStart = new Date(now.setHours(0, 0, 0, 0));
    const todayEnd = new Date(todayStart);
    todayEnd.setDate(todayEnd.getDate() + 1);

    const today = appointments.filter(appt => {
      const d = new Date(appt.appointmentDateTime);
      return d >= todayStart && d < todayEnd;
    });

    const confirmedCount = appointments.filter(a => a.status === "Confirmed").length;
    const completed = appointments.filter(a => a.status === "Completed").length;
    
    // Unique patients handled (based on User ID)
    const patientIds = new Set(appointments.map(a => a.patientId?._id).filter(id => !!id));

    const upcoming = appointments
      .filter(a => new Date(a.appointmentDateTime) > new Date() && a.status === "Confirmed")
      .slice(0, 5);

    return {
      todaysAppointments: today,
      confirmedCount,
      completedCount: completed,
      uniquePatientsCount: patientIds.size,
      upcomingConsultations: upcoming
    };
  }, [appointments]);

  if (isLoading) return <div className="text-center py-16 text-gray-400">Loading dashboard...</div>;
  if (isError) return <div className="text-center py-16 text-red-400">Failed to load dashboard.</div>;

  const stats = [
    { label: "Today's Patients", value: todaysAppointments.length, icon: <Users size={24} />, color: "text-blue-400", bg: "bg-blue-400/10" },
    { label: "Confirmed", value: confirmedCount, icon: <CheckCircle size={24} />, color: "text-sky-400", bg: "bg-sky-400/10" },
    { label: "Total Completed", value: completedCount, icon: <CheckCircle size={24} />, color: "text-emerald-400", bg: "bg-emerald-400/10" },
    { label: "Patients Handled", value: uniquePatientsCount, icon: <UserCheck size={24} />, color: "text-purple-400", bg: "bg-purple-400/10" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Doctor Dashboard</h1>
          <p className="text-gray-400 mt-2">Daily overview and clinical performance</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-[#1f2937] p-6 rounded-2xl border border-gray-800 shadow-xl flex items-center gap-4">
            <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-400">{stat.label}</p>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Today's Schedule */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <CalendarDays size={20} className="text-emerald-400" />
              Today's Schedule
            </h2>
            <Link to="/doctor/appointments" className="text-sm text-emerald-400 hover:underline">
              View All
            </Link>
          </div>

          <div className="bg-[#1f2937] rounded-2xl border border-gray-800 shadow-xl overflow-hidden">
            <div className="divide-y divide-gray-800">
              {todaysAppointments.length === 0 ? (
                <div className="p-12 text-center text-gray-500">
                  <p>No appointments scheduled for today.</p>
                </div>
              ) : (
                todaysAppointments.map((appt) => (
                  <div key={appt._id} className="p-5 flex items-center justify-between hover:bg-white/5 transition-colors group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-[#111827] border border-gray-800 flex items-center justify-center text-gray-400 font-bold group-hover:border-emerald-500/50 transition-colors">
                        {appt.patientId?.name?.[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-white">{appt.patientId?.name || "Unknown Patient"}</p>
                        <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                          <Clock size={12} />
                          {new Date(appt.appointmentDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                    <StatusBadge status={appt.status} />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Upcoming Consultations */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <UserCheck size={20} className="text-blue-400" />
            Upcoming
          </h2>
          <div className="space-y-3">
            {upcomingConsultations.length > 0 ? (
              upcomingConsultations.map((appt) => (
                <div key={appt._id} className="bg-[#1f2937] p-4 rounded-xl border border-gray-800 hover:border-gray-700 transition-all">
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-white font-bold text-sm truncate max-w-[120px]">{appt.patientId?.name}</p>
                    <span className="text-[10px] text-gray-500">
                      {new Date(appt.appointmentDateTime).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-400 line-clamp-1 italic">
                    {appt.notes || "No additional notes provided."}
                  </p>
                </div>
              ))
            ) : (
              <div className="p-8 bg-[#1f2937] rounded-xl border border-dashed border-gray-800 text-center text-gray-500 text-sm">
                No upcoming confirmed consultations.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
