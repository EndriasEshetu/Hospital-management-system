import { useAllPatients, useDeletePatient } from "../hooks/useAdmin";
import { Trash2 } from "lucide-react";

const AdminPatients = () => {
  const { data: patients = [], isLoading, isError } = useAllPatients();
  const deleteMutation = useDeletePatient();

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to remove this patient? This will also delete their user account.")) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) return <div className="text-center py-20 text-gray-400">Loading patients...</div>;
  if (isError) return <div className="text-center py-20 text-red-400">Failed to load patients.</div>;

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white tracking-wide">Patients Directory</h1>
        <p className="text-sm text-gray-400 mt-1">Manage all registered patients</p>
      </div>

      <div className="bg-[#1f2937] rounded-xl shadow-xl border border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="bg-[#111827] border-b border-gray-800">
                <th className="px-6 py-4 font-semibold text-gray-300">Name</th>
                <th className="px-6 py-4 font-semibold text-gray-300">Email</th>
                <th className="px-6 py-4 font-semibold text-gray-300">Phone</th>
                <th className="px-6 py-4 font-semibold text-gray-300">Blood Group</th>
                <th className="px-6 py-4 text-right font-semibold text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {patients.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                    No patients found.
                  </td>
                </tr>
              ) : (
                patients.map((patient) => (
                  <tr key={patient._id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-medium text-white">{patient.userId?.name || "N/A"}</td>
                    <td className="px-6 py-4 text-gray-400">{patient.userId?.email || "N/A"}</td>
                    <td className="px-6 py-4 text-gray-400">{patient.phone || "N/A"}</td>
                    <td className="px-6 py-4 text-gray-400">
                      {patient.bloodGroup ? (
                        <span className="px-2 py-1 bg-red-500/10 text-red-400 rounded border border-red-500/20 text-xs">
                          {patient.bloodGroup}
                        </span>
                      ) : (
                        "N/A"
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(patient._id)}
                        disabled={deleteMutation.isPending}
                        className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                        title="Delete Patient"
                      >
                        <Trash2 size={16} />
                      </button>
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

export default AdminPatients;
