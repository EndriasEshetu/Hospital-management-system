import { useMemo, useState } from "react";
import { Pencil, Search, X } from "lucide-react";
import { useAllPatients, useUpdatePatient } from "../hooks/useAdmin";

const emptyForm = {
  age: "",
  gender: "",
  bloodGroup: "",
  phone: "",
  address: "",
};

const ManagePatients = () => {
  const { data: patients = [], isLoading, isError } = useAllPatients();
  const updateMutation = useUpdatePatient();

  const [query, setQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const filteredPatients = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return patients;

    return patients.filter((patient) => {
      const name = patient.userId?.name || "";
      const email = patient.userId?.email || "";
      const patientId = patient.patientId || "";
      const phone = patient.phone || "";
      const bloodGroup = patient.bloodGroup || "";
      return [name, email, patientId, phone, bloodGroup].some((value) => value.toLowerCase().includes(needle));
    });
  }, [patients, query]);

  const openEdit = (patient) => {
    setEditingPatient(patient);
    setForm({
      age: patient.age ?? "",
      gender: patient.gender || "",
      bloodGroup: patient.bloodGroup || "",
      phone: patient.phone || "",
      address: patient.address || "",
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    updateMutation.mutate(
      {
        id: editingPatient._id,
        age: form.age === "" ? undefined : Number(form.age),
        gender: form.gender,
        bloodGroup: form.bloodGroup,
        phone: form.phone,
        address: form.address,
      },
      {
        onSuccess: () => {
          setIsModalOpen(false);
          setEditingPatient(null);
          setForm(emptyForm);
        },
      }
    );
  };

  if (isLoading) {
    return <div className="text-center py-20 text-gray-400">Loading patients...</div>;
  }

  if (isError) {
    return <div className="text-center py-20 text-red-400">Failed to load patients.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-wide">Manage Patients</h1>
          <p className="text-sm text-gray-400 mt-1">Search and edit patient account details</p>
        </div>
        <div className="text-sm text-gray-400">{filteredPatients.length} patients</div>
      </div>

      <div className="bg-[#1f2937] border border-gray-800 rounded-2xl p-4 shadow-xl">
        <div className="relative max-w-xl">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, email, patient ID, phone, or blood group"
            className="w-full bg-[#111827] border border-gray-700 rounded-xl pl-10 pr-4 py-3 text-sm text-gray-200 outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      <div className="bg-[#1f2937] rounded-2xl shadow-xl border border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="bg-[#111827] border-b border-gray-800">
                <th className="px-6 py-4 font-semibold text-gray-300">Patient</th>
                <th className="px-6 py-4 font-semibold text-gray-300">Patient ID</th>
                <th className="px-6 py-4 font-semibold text-gray-300">Phone</th>
                <th className="px-6 py-4 font-semibold text-gray-300">Blood Group</th>
                <th className="px-6 py-4 text-right font-semibold text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                    No patients found.
                  </td>
                </tr>
              ) : (
                filteredPatients.map((patient) => (
                  <tr key={patient._id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-medium text-white">{patient.userId?.name || "N/A"}</p>
                      <p className="text-xs text-gray-500">{patient.userId?.email || "N/A"}</p>
                    </td>
                    <td className="px-6 py-4 text-gray-300">{patient.patientId || "N/A"}</td>
                    <td className="px-6 py-4 text-gray-400">{patient.phone || "N/A"}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex px-2.5 py-1 rounded-full text-xs border border-gray-700 text-gray-200 bg-[#111827]">
                        {patient.bloodGroup || "N/A"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => openEdit(patient)}
                        className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg bg-[#111827] text-gray-200 border border-gray-700 hover:border-gray-500"
                      >
                        <Pencil size={14} />
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 py-6">
          <div className="w-full max-w-2xl bg-[#1f2937] border border-gray-700 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between bg-[#111827]">
              <div>
                <h2 className="text-lg font-semibold text-white">Edit Patient</h2>
                <p className="text-xs text-gray-400">Email and patient ID are read-only</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="space-y-2">
                  <span className="text-sm text-gray-300">Full Name</span>
                  <input
                    value={editingPatient?.userId?.name || ""}
                    readOnly
                    className="w-full rounded-xl bg-[#111827] border border-gray-700 px-4 py-3 text-sm text-gray-400 outline-none"
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-sm text-gray-300">Email</span>
                  <input
                    value={editingPatient?.userId?.email || ""}
                    readOnly
                    className="w-full rounded-xl bg-[#111827] border border-gray-700 px-4 py-3 text-sm text-gray-400 outline-none"
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-sm text-gray-300">Patient ID</span>
                  <input
                    value={editingPatient?.patientId || ""}
                    readOnly
                    className="w-full rounded-xl bg-[#111827] border border-gray-700 px-4 py-3 text-sm text-gray-400 outline-none"
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-sm text-gray-300">Age</span>
                  <input
                    type="number"
                    value={form.age}
                    onChange={(e) => setForm({ ...form, age: e.target.value })}
                    className="w-full rounded-xl bg-[#111827] border border-gray-700 px-4 py-3 text-sm text-gray-200 outline-none focus:border-emerald-500"
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-sm text-gray-300">Gender</span>
                  <input
                    value={form.gender}
                    onChange={(e) => setForm({ ...form, gender: e.target.value })}
                    className="w-full rounded-xl bg-[#111827] border border-gray-700 px-4 py-3 text-sm text-gray-200 outline-none focus:border-emerald-500"
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-sm text-gray-300">Blood Group</span>
                  <input
                    value={form.bloodGroup}
                    onChange={(e) => setForm({ ...form, bloodGroup: e.target.value })}
                    className="w-full rounded-xl bg-[#111827] border border-gray-700 px-4 py-3 text-sm text-gray-200 outline-none focus:border-emerald-500"
                  />
                </label>
                <label className="space-y-2 md:col-span-2">
                  <span className="text-sm text-gray-300">Phone</span>
                  <input
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full rounded-xl bg-[#111827] border border-gray-700 px-4 py-3 text-sm text-gray-200 outline-none focus:border-emerald-500"
                  />
                </label>
                <label className="space-y-2 md:col-span-2">
                  <span className="text-sm text-gray-300">Address</span>
                  <textarea
                    rows={4}
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    className="w-full rounded-xl bg-[#111827] border border-gray-700 px-4 py-3 text-sm text-gray-200 outline-none focus:border-emerald-500 resize-none"
                  />
                </label>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="submit"
                  disabled={updateMutation.isPending}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-medium text-white hover:bg-emerald-500 disabled:opacity-50"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl bg-[#111827] border border-gray-700 px-4 py-3 text-sm font-medium text-gray-200 hover:border-gray-500"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagePatients;