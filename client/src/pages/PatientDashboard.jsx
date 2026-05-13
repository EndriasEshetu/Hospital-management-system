import { useMemo } from "react";
import { Link } from "react-router-dom";
import { 
  useMyAppointments, 
  useMyRecords, 
  useMyPrescriptions 
} from "../hooks/usePatient";
import useAuthStore from "../store/useAuthStore";
import StatusBadge from "../components/StatusBadge";
import { 
  Calendar, 
  FileText, 
  Pill, 
  Clock, 
  ArrowRight, 
  User, 
  Activity,
  CheckCircle2,
  CalendarDays
} from "lucide-react";

const PatientDashboard = () => {
  const { user } = useAuthStore();
  const { data: appointments = [], isLoading: apptsLoading } = useMyAppointments();
  const { data: records = [], isLoading: recordsLoading } = useMyRecords();
  const { data: prescriptions = [], isLoading: prescriptionsLoading } = useMyPrescriptions();

  const nextAppointment = useMemo(() => {
    const now = new Date();
    return appointments
      .filter(a => new Date(a.appointmentDateTime) > now && a.status !== "Cancelled")
      .sort((a, b) => new Date(a.appointmentDateTime) - new Date(b.appointmentDateTime))[0];
  }, [appointments]);

  const recentPrescriptions = useMemo(() => {
    return [...prescriptions]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 3);
  }, [prescriptions]);

  const stats = [
    {
      label: "Upcoming",
      value: appointments.filter(a => new Date(a.appointmentDateTime) > new Date() && a.status !== "Cancelled").length,
      icon: <Clock size={24} className="text-amber-400" />,
      bg: "bg-amber-400/10",
      border: "border-amber-400/20"
    },
    {
      label: "Completed",
      value: appointments.filter(a => a.status === "Completed").length,
      icon: <CheckCircle2 size={24} className="text-emerald-400" />,
      bg: "bg-emerald-400/10",
      border: "border-emerald-400/20"
    },
    {
      label: "Records",
      value: records.length,
      icon: <FileText size={24} className="text-blue-400" />,
      bg: "bg-blue-400/10",
      border: "border-blue-400/20"
    },
    {
      label: "Prescriptions",
      value: prescriptions.length,
      icon: <Pill size={24} className="text-purple-400" />,
      bg: "bg-purple-400/10",
      border: "border-purple-400/20"
    }
  ];

  if (apptsLoading || recordsLoading || prescriptionsLoading) {
    return <div className="text-center py-20 text-gray-400">Loading your dashboard...</div>;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Welcome back, {user?.name}!</h1>
          <p className="text-gray-400 mt-1">Here's a summary of your health activity and upcoming schedules.</p>
        </div>
        <Link 
          to="/patient/book" 
          className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 w-fit"
        >
          <Calendar size={18} />
          Book Appointment
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className={`p-6 rounded-2xl border ${stat.border} ${stat.bg} shadow-sm flex items-center gap-4`}>
            <div className="p-3 bg-white/5 rounded-xl">
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
        {/* Next Appointment */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <CalendarDays size={20} className="text-emerald-400" />
              Next Appointment
            </h2>
            <Link to="/patient/appointments" className="text-sm text-emerald-400 hover:underline flex items-center gap-1">
              View all <ArrowRight size={14} />
            </Link>
          </div>
          
          {nextAppointment ? (
            <div className="bg-[#1f2937] rounded-2xl border border-gray-800 p-6 shadow-xl hover:border-gray-700 transition-all group">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center flex-shrink-0 border border-emerald-500/20 group-hover:scale-110 transition-transform">
                  <Calendar size={32} className="text-emerald-400" />
                </div>
                <div className="flex-1 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-bold text-white">Dr. {nextAppointment.doctorId?.name}</h3>
                      <p className="text-gray-400 text-sm">{nextAppointment.doctorId?.specialization || "General Physician"}</p>
                    </div>
                    <StatusBadge status={nextAppointment.status} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-800">
                    <div className="flex items-center gap-3 text-gray-300">
                      <div className="p-2 bg-gray-800 rounded-lg"><Calendar size={16} /></div>
                      <span className="text-sm">
                        {new Date(nextAppointment.appointmentDateTime).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-300">
                      <div className="p-2 bg-gray-800 rounded-lg"><Clock size={16} /></div>
                      <span className="text-sm">
                        {new Date(nextAppointment.appointmentDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-[#1f2937] rounded-2xl border border-dashed border-gray-700 p-12 text-center shadow-sm">
              <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-600">
                <Calendar size={32} />
              </div>
              <h3 className="text-lg font-bold text-gray-300">No upcoming appointments</h3>
              <p className="text-gray-500 mt-2 max-w-xs mx-auto text-sm">Schedule your next consultation with our expert doctors today.</p>
              <Link to="/patient/book" className="text-emerald-400 hover:underline mt-4 inline-block font-medium">Book Now</Link>
            </div>
          )}

          {/* Quick Actions / Activity Placeholder */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
            <Link to="/patient/profile" className="bg-[#1f2937] p-5 rounded-2xl border border-gray-800 hover:border-gray-700 transition-all flex items-center gap-4 group">
              <div className="p-3 bg-blue-500/10 rounded-xl group-hover:bg-blue-500/20 transition-all">
                <User size={20} className="text-blue-400" />
              </div>
              <div>
                <p className="text-white font-bold">Update Profile</p>
                <p className="text-xs text-gray-500">Manage your contact details</p>
              </div>
            </Link>
            <Link to="/patient/records" className="bg-[#1f2937] p-5 rounded-2xl border border-gray-800 hover:border-gray-700 transition-all flex items-center gap-4 group">
              <div className="p-3 bg-emerald-500/10 rounded-xl group-hover:bg-emerald-500/20 transition-all">
                <Activity size={20} className="text-emerald-400" />
              </div>
              <div>
                <p className="text-white font-bold">View Health History</p>
                <p className="text-xs text-gray-500">Access your clinical records</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Recent Prescriptions */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Pill size={20} className="text-purple-400" />
              Recent Prescriptions
            </h2>
            <Link to="/patient/prescriptions" className="text-sm text-purple-400 hover:underline">
              All
            </Link>
          </div>
          
          <div className="space-y-3">
            {recentPrescriptions.length > 0 ? (
              recentPrescriptions.map((pres, i) => (
                <div key={pres._id} className="bg-[#1f2937] rounded-xl border border-gray-800 p-4 hover:border-gray-700 transition-all">
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-white font-bold text-sm">Dr. {pres.doctorId?.userId?.name}</p>
                    <span className="text-[10px] text-gray-500">{new Date(pres.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="space-y-2">
                    {pres.medicines?.slice(0, 2).map((med, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-gray-400">
                        <div className="w-1 h-1 bg-emerald-500 rounded-full"></div>
                        <span className="font-medium text-emerald-400/80">{med.name}</span>
                        <span>•</span>
                        <span>{med.dosage}</span>
                      </div>
                    ))}
                    {pres.medicines?.length > 2 && (
                      <p className="text-[10px] text-gray-500 pl-3">+{pres.medicines.length - 2} more medications</p>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-[#1f2937] rounded-xl border border-dashed border-gray-700 p-8 text-center">
                <p className="text-gray-500 text-sm">No prescriptions found.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
