import { useQuery } from "@tanstack/react-query";
import api from "../api/authApi";
import { ClipboardList, User, Calendar, Search } from "lucide-react";

const DoctorMedicalRecords = () => {
  const { data: records = [], isLoading } = useQuery({
    queryKey: ["doctorMedicalRecords"],
    queryFn: async () => {
      const { data } = await api.get("/medical-records/doctor"); // I need to create this endpoint
      return data;
    }
  });

  if (isLoading) return <div className="text-center py-20 text-gray-400">Loading records...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-wide">Medical Records</h1>
        <p className="text-sm text-gray-400 mt-1">History of all clinical records you've created</p>
      </div>

      <div className="bg-[#1f2937] rounded-xl border border-gray-800 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#1a2332] text-gray-400 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-semibold">Patient</th>
                <th className="px-6 py-4 font-semibold">Date</th>
                <th className="px-6 py-4 font-semibold">Diagnosis</th>
                <th className="px-6 py-4 font-semibold">Symptoms</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {records.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-gray-500 text-sm">No medical records found.</td>
                </tr>
              ) : (
                records.map((record) => (
                  <tr key={record._id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 font-bold text-xs">
                          {record.patientId?.userId?.name?.[0].toUpperCase()}
                        </div>
                        <span className="text-sm text-white font-medium">{record.patientId?.userId?.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Calendar size={12} />
                        {new Date(record.createdAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-300 line-clamp-1">{record.diagnosis}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {record.symptoms?.slice(0, 2).map((s, i) => (
                          <span key={i} className="text-[10px] bg-gray-800 text-gray-400 px-2 py-0.5 rounded-full border border-gray-700">
                            {s}
                          </span>
                        ))}
                        {record.symptoms?.length > 2 && <span className="text-[10px] text-gray-500">+{record.symptoms.length - 2}</span>}
                      </div>
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

export default DoctorMedicalRecords;
