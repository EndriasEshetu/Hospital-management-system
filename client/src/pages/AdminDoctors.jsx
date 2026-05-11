import { useAllDoctors, useDeleteDoctor } from "../hooks/useAdmin";
import { Trash2 } from "lucide-react";

const AdminDoctors = () => {
  const { data: doctors = [], isLoading, isError } = useAllDoctors();
  const deleteMutation = useDeleteDoctor();

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to remove this doctor? This will also delete their user account.")) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) return <div className="text-center py-20 text-gray-400">Loading doctors...</div>;
  if (isError) return <div className="text-center py-20 text-red-400">Failed to load doctors.</div>;

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white tracking-wide">Doctors Directory</h1>
        <p className="text-sm text-gray-400 mt-1">Manage hospital staff</p>
      </div>

      <div className="bg-[#1f2937] rounded-xl shadow-xl border border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="bg-[#111827] border-b border-gray-800">
                <th className="px-6 py-4 font-semibold text-gray-300">Name</th>
                <th className="px-6 py-4 font-semibold text-gray-300">Email</th>
                <th className="px-6 py-4 font-semibold text-gray-300">Specialization</th>
                <th className="px-6 py-4 font-semibold text-gray-300">Department</th>
                <th className="px-6 py-4 text-right font-semibold text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {doctors.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                    No doctors found.
                  </td>
                </tr>
              ) : (
                doctors.map((doctor) => (
                  <tr key={doctor._id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-medium text-white">{doctor.userId?.name || "N/A"}</td>
                    <td className="px-6 py-4 text-gray-400">{doctor.userId?.email || "N/A"}</td>
                    <td className="px-6 py-4 text-emerald-400">{doctor.specialization || "N/A"}</td>
                    <td className="px-6 py-4 text-gray-400">{doctor.department || "N/A"}</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(doctor._id)}
                        disabled={deleteMutation.isPending}
                        className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                        title="Delete Doctor"
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

export default AdminDoctors;
