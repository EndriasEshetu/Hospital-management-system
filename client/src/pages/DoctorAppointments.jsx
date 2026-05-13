import { useState } from "react";
import { 
  useDoctorAppointments, 
  useCompleteAppointment 
} from "../hooks/useDoctor";
import StatusBadge from "../components/StatusBadge";
import { 
  Search, 
  Calendar, 
  Filter, 
  CheckCircle, 
  User, 
  ClipboardList, 
  FilePlus, 
  MoreVertical,
  ChevronRight
} from "lucide-react";
import PatientInfoModal from "../components/PatientInfoModal";
import MedicalRecordForm from "../components/MedicalRecordForm";
import PrescriptionForm from "../components/PrescriptionForm";

const DoctorAppointments = () => {
  const [filters, setFilters] = useState({
    date: "",
    status: ""
  });

  const { data: appointments = [], isLoading, isError } = useDoctorAppointments(filters);
  const completeMutation = useCompleteAppointment();

  // Modals state
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [medicalRecordAppt, setMedicalRecordAppt] = useState(null);
  const [prescriptionAppt, setPrescriptionAppt] = useState(null);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleComplete = (id) => {
    if (window.confirm("Mark this appointment as completed?")) {
      completeMutation.mutate(id);
    }
  };

  if (isError) return <div className="text-center py-20 text-red-400 font-medium">Failed to load appointments.</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-wide">Manage Appointments</h1>
          <p className="text-sm text-gray-400 mt-1">Review and manage your patient consultations</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-[#1f2937] p-4 rounded-xl border border-gray-800 shadow-xl flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2 bg-[#111827] px-3 py-2 rounded-lg border border-gray-700 flex-1 min-w-[200px]">
          <Calendar size={18} className="text-gray-500" />
          <input
            type="date"
            name="date"
            value={filters.date}
            onChange={handleFilterChange}
            className="bg-transparent border-none text-gray-200 text-sm focus:outline-none w-full"
          />
        </div>
        <div className="flex items-center gap-2 bg-[#111827] px-3 py-2 rounded-lg border border-gray-700 w-full sm:w-48">
          <Filter size={18} className="text-gray-500" />
          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            className="bg-transparent border-none text-gray-200 text-sm focus:outline-none w-full"
          >
            <option value="">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
        <button 
          onClick={() => setFilters({ date: "", status: "" })}
          className="text-xs text-gray-500 hover:text-white transition-colors"
        >
          Reset Filters
        </button>
      </div>

      {/* Appointments List */}
      <div className="bg-[#1f2937] rounded-xl border border-gray-800 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#1a2332] text-gray-400 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-semibold">Patient</th>
                <th className="px-6 py-4 font-semibold">Date & Time</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {isLoading ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-gray-500">Loading appointments...</td>
                </tr>
              ) : appointments.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-gray-500 text-sm">No appointments found matching your filters.</td>
                </tr>
              ) : (
                appointments.map((appt) => (
                  <tr key={appt._id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold">
                          {appt.patientId?.name?.[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-white text-sm">{appt.patientId?.name}</p>
                          <button 
                            onClick={() => setSelectedPatientId(appt.patientId?._id)}
                            className="text-[10px] text-emerald-500 hover:underline flex items-center gap-1 mt-0.5"
                          >
                            <User size={10} /> View Profile
                          </button>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-300 font-medium">
                        {new Date(appt.appointmentDateTime).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(appt.appointmentDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={appt.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {appt.status === "Confirmed" && (
                          <button
                            onClick={() => handleComplete(appt._id)}
                            disabled={completeMutation.isPending}
                            className="p-2 text-emerald-500 hover:bg-emerald-500/10 rounded-lg transition-all border border-transparent hover:border-emerald-500/20"
                            title="Mark as Completed"
                          >
                            <CheckCircle size={18} />
                          </button>
                        )}
                        
                        {appt.status === "Completed" && (
                          <>
                            <button
                              onClick={() => setMedicalRecordAppt(appt)}
                              className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-lg transition-all border border-transparent hover:border-blue-400/20"
                              title="Add Medical Record"
                            >
                              <ClipboardList size={18} />
                            </button>
                            <button
                              onClick={() => setPrescriptionAppt(appt)}
                              className="p-2 text-purple-400 hover:bg-purple-400/10 rounded-lg transition-all border border-transparent hover:border-purple-400/20"
                              title="Issue Prescription"
                            >
                              <FilePlus size={18} />
                            </button>
                          </>
                        )}
                        <div className="h-4 w-[1px] bg-gray-800 mx-1"></div>
                        <button className="p-2 text-gray-500 hover:text-white transition-colors">
                          <ChevronRight size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      {selectedPatientId && (
        <PatientInfoModal 
          userId={selectedPatientId} 
          onClose={() => setSelectedPatientId(null)} 
        />
      )}

      {medicalRecordAppt && (
        <MedicalRecordForm 
          appointment={medicalRecordAppt} 
          onClose={() => setMedicalRecordAppt(null)} 
        />
      )}

      {prescriptionAppt && (
        <PrescriptionForm 
          appointment={prescriptionAppt} 
          onClose={() => setPrescriptionAppt(null)} 
        />
      )}
    </div>
  );
};

export default DoctorAppointments;
