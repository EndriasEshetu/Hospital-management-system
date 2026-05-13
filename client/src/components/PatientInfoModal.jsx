import { usePatientDetails } from "../hooks/useDoctor";
import { X, User, Phone, MapPin, Droplets, Calendar, Mail } from "lucide-react";

const PatientInfoModal = ({ userId, onClose }) => {
  const { data: patient, isLoading, isError } = usePatientDetails(userId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-[#1f2937] rounded-2xl shadow-2xl w-full max-w-lg mx-auto overflow-hidden border border-gray-800 animate-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-center bg-[#1a2332]">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <User size={20} className="text-emerald-400" />
            Patient Information
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white p-1 transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          {isLoading ? (
            <div className="text-center py-12 text-gray-500">Loading patient details...</div>
          ) : isError ? (
            <div className="text-center py-12 text-red-400">Failed to load patient information.</div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center gap-4 p-4 bg-[#111827] rounded-xl border border-gray-800">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-2xl font-bold text-emerald-400">
                  {patient.userId?.name?.[0].toUpperCase()}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{patient.userId?.name}</h3>
                  <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                    <Mail size={12} />
                    {patient.userId?.email}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-[#111827] rounded-xl border border-gray-800 space-y-1">
                  <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">Age</p>
                  <p className="text-white font-medium flex items-center gap-2">
                    <Calendar size={14} className="text-blue-400" />
                    {patient.age || "N/A"} years
                  </p>
                </div>
                <div className="p-4 bg-[#111827] rounded-xl border border-gray-800 space-y-1">
                  <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">Gender</p>
                  <p className="text-white font-medium flex items-center gap-2">
                    <User size={14} className="text-purple-400" />
                    {patient.gender || "N/A"}
                  </p>
                </div>
                <div className="p-4 bg-[#111827] rounded-xl border border-gray-800 space-y-1">
                  <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">Blood Group</p>
                  <p className="text-white font-medium flex items-center gap-2">
                    <Droplets size={14} className="text-red-400" />
                    {patient.bloodGroup || "N/A"}
                  </p>
                </div>
                <div className="p-4 bg-[#111827] rounded-xl border border-gray-800 space-y-1">
                  <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">Phone</p>
                  <p className="text-white font-medium flex items-center gap-2 truncate">
                    <Phone size={14} className="text-emerald-400" />
                    {patient.phone || "N/A"}
                  </p>
                </div>
              </div>

              <div className="p-4 bg-[#111827] rounded-xl border border-gray-800 space-y-2">
                <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">Address</p>
                <p className="text-white text-sm flex items-start gap-2 leading-relaxed">
                  <MapPin size={14} className="text-amber-400 mt-1 flex-shrink-0" />
                  {patient.address || "No address provided."}
                </p>
              </div>

              <button 
                onClick={onClose}
                className="w-full py-3 bg-gray-800 hover:bg-gray-700 text-white font-bold rounded-xl transition-all border border-gray-700"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientInfoModal;
