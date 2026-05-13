import { useQuery } from "@tanstack/react-query";
import api from "../api/authApi";
import { Pill, User, Calendar, Clock } from "lucide-react";

const DoctorPrescriptions = () => {
  const { data: prescriptions = [], isLoading } = useQuery({
    queryKey: ["doctorPrescriptions"],
    queryFn: async () => {
      const { data } = await api.get("/prescriptions/doctor"); // Need to create this endpoint
      return data;
    }
  });

  if (isLoading) return <div className="text-center py-20 text-gray-400">Loading prescriptions...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-wide">Prescriptions</h1>
        <p className="text-sm text-gray-400 mt-1">History of all digital prescriptions you've issued</p>
      </div>

      <div className="bg-[#1f2937] rounded-xl border border-gray-800 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#1a2332] text-gray-400 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-semibold">Patient</th>
                <th className="px-6 py-4 font-semibold">Date</th>
                <th className="px-6 py-4 font-semibold">Medications</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {prescriptions.length === 0 ? (
                <tr>
                  <td colSpan="3" className="px-6 py-12 text-center text-gray-500 text-sm">No prescriptions found.</td>
                </tr>
              ) : (
                prescriptions.map((pres) => (
                  <tr key={pres._id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400 font-bold text-xs">
                          {pres.patientId?.userId?.name?.[0].toUpperCase()}
                        </div>
                        <span className="text-sm text-white font-medium">{pres.patientId?.userId?.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Calendar size={12} />
                        {new Date(pres.createdAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        {pres.medicines?.slice(0, 2).map((med, i) => (
                          <div key={i} className="text-xs text-gray-300 flex items-center gap-2">
                            <div className="w-1 h-1 bg-purple-500 rounded-full"></div>
                            <span className="font-medium text-purple-400">{med.name}</span>
                            <span className="text-gray-500 text-[10px]">({med.dosage})</span>
                          </div>
                        ))}
                        {pres.medicines?.length > 2 && <p className="text-[10px] text-gray-500 pl-3">+{pres.medicines.length - 2} more</p>}
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

export default DoctorPrescriptions;
